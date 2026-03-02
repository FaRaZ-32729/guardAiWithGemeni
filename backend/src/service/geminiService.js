// const Student = require('../models/userModel');
// const axios = require('axios');
// const fs = require('fs');

// let cachedStudents = [];

// const loadStudents = async () => {
//     cachedStudents = await Student.find({});
//     console.log("📚 Students cached in memory", cachedStudents.length, "students loaded");
// };

// const processWithGemini = async (imagePath, camera) => {
//     try {
//         console.log("🚀 Sending frame to Gemini...");

//         const students = cachedStudents;

//         const base64Image = fs.readFileSync(imagePath, {
//             encoding: "base64"
//         });

//         const prompt = `
// You are a school surveillance AI.

// Registered Students:
// ${students.map(s => `Name: ${s.name}, RollNo: ${s.studentRollNumber}`).join("\n")}

// Compare the image and identify:
// - name
// - rollNo
// - action (smoking, fighting, normal)
// - description

// Return ONLY valid JSON.
// `;

//         const response = await axios.post(
//             `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
//             {
//                 contents: [
//                     {
//                         parts: [
//                             { text: prompt },
//                             {
//                                 inlineData: {
//                                     mimeType: "image/jpeg",
//                                     data: base64Image
//                                 }
//                             }
//                         ]
//                     }
//                 ]
//             }
//         );

//         const text = response.data.candidates[0].content.parts[0].text;

//         console.log("🎯 Raw Gemini Response:", text);

//         // ✅ SAFE JSON PARSING HERE
//         let parsed;

//         try {
//             const cleanText = text
//                 .replace(/```json/g, '')
//                 .replace(/```/g, '')
//                 .trim();

//             parsed = JSON.parse(cleanText);
//         } catch (err) {
//             console.error("❌ Invalid JSON from Gemini");
//             return null;
//         }

//         console.log("✅ Parsed Gemini JSON:", parsed);

//         return parsed;

//     } catch (error) {
//         console.error("❌ Gemini API Error:", error.message);
//         return null;
//     }
// };

// module.exports = { processWithGemini, loadStudents };



const fs = require('fs');
const path = require('path');
const axios = require('axios');
const Student = require('../models/userModel');
const { generateChallan } = require('../controllers/challanController');

let cachedStudents = [];

const loadStudents = async () => {
    cachedStudents = await Student.find({});
    console.log("📚 Students cached in memory", cachedStudents.length, "students loaded");
};

const processWithGemini = async (cameraFramePath, camera) => {
    try {
        console.log("🚀 Sending frame to Gemini...");

        const students = cachedStudents;

        // Read camera frame as base64
        const cameraBase64 = fs.readFileSync(cameraFramePath, { encoding: "base64" });

        // Prepare prompt text
        const promptText = `
You are an advanced school surveillance AI with facial recognition capabilities.

## YOUR TASK:
Analyze the FIRST image (camera frame) carefully.
Then compare EVERY face detected in the camera frame against ALL provided registered student images.

## STRICT MATCHING RULES:
1. Examine facial features closely: face shape, eyes, nose, mouth, eyebrows, skin tone, and overall structure.
2. A match is ONLY valid if you are at least 80% confident the face matches a registered student.
3. If a person's face does NOT closely match any registered student → label them as "anonymous".
4. If NO face is detected in the camera frame → return empty array [].
5. Do NOT guess or assume. If unsure → return "anonymous".

## ACTION DETECTION:
For each detected person, identify their action:
- "smoking"     → person is holding/smoking a cigarette, vape, or any smoking object
- "fighting"    → person is involved in physical aggression
- "normal"      → no suspicious activity detected

## SEVERITY LEVELS:
- "high"   → smoking or fighting
- "low"    → normal behavior

## OUTPUT FORMAT:
Return ONLY a valid JSON array. No explanation, no markdown, no extra text.

[
  {
    "matched": true or false,
    "name": "Student Full Name" or "Anonymous",
    "rollNo": "student roll number" or "N/A",
    "action": "smoking" | "fighting" | "normal",
    "severity": "high" | "low",
    "confidence": "percentage like 85%",
    "description": "One short sentence describing what this person is doing"
  }
]

## IMPORTANT REMINDERS:
- Return one object per detected person in the camera frame.
- If multiple people are in the frame, return multiple objects.
- Never return null. Always return a valid JSON array.
- If zero people detected, return [].
`;

        // Prepare multimodal content
        const parts = [
            { text: promptText },
            { text: "📷 CAMERA FRAME (analyze this image for faces and actions):" },
            {
                inlineData: {
                    mimeType: "image/jpeg",
                    data: cameraBase64
                }
            },
            { text: "👥 REGISTERED STUDENTS (compare faces against the camera frame):" }
        ];

        // Add all student images
        for (const student of students) {
            const studentImagePath = path.join(__dirname, "../../uploads", `${student.studentRollNumber}.jpeg`);
            if (fs.existsSync(studentImagePath)) {
                const studentBase64 = fs.readFileSync(studentImagePath, { encoding: "base64" });

                console.log(`✅ Loaded student image: ${student.name}, RollNo: ${student.studentRollNumber}, Size: ${studentBase64.length} bytes`);

                parts.push(
                    { text: `🎓 Student Name: ${student.name} | RollNo: ${student.studentRollNumber}` },
                    {
                        inlineData: {
                            mimeType: "image/jpeg",
                            data: studentBase64
                        }
                    }
                );
            } else {
                console.warn(`⚠️ Student image NOT found: ${student.name}, RollNo: ${student.studentRollNumber}`);
            }
        }

        // Final instruction
        parts.push({
            text: `🔍 Now analyze the camera frame, match faces against the registered students above, detect actions, and return ONLY the JSON array as instructed.`
        });

        // Call Gemini
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [{ parts }],
                generationConfig: {
                    temperature: 0.1,        // Low temperature = more deterministic, less creative guessing
                    topP: 0.8,
                    maxOutputTokens: 2048
                }
            }
        );

        const text = response.data.candidates[0].content.parts[0].text;
        console.log("🎯 Raw Gemini Response:", text);

        // Parse JSON safely
        let parsed;
        try {
            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            parsed = JSON.parse(cleanText);

            // Validate it's an array
            if (!Array.isArray(parsed)) {
                parsed = [parsed]; // wrap if single object returned
            }

        } catch (err) {
            console.error("❌ Invalid JSON from Gemini:", err.message);
            return null;
        }

        console.log("✅ Parsed Gemini JSON:", parsed);
        // Generate challan for each violation detected
        for (const result of parsed) {
            console.log("result send")
            await generateChallan(result);
        }

        return parsed;

    } catch (error) {
        console.error("❌ Gemini API Error:", error.message);
        return null;
    }
};

module.exports = { processWithGemini, loadStudents };