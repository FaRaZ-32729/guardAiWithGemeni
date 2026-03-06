// const ffmpeg = require('fluent-ffmpeg');
// const fs = require('fs');
// const path = require('path');
// const axios = require('axios');
// const Camera = require('../models/cameraModel');
// const { processWithGemini } = require('./geminiService');

// ffmpeg.setFfmpegPath('C:\\ProgramData\\ffmpeg-8.0.1-essentials_build\\bin\\ffmpeg.exe');

// // Ensure the capture directory exists
// const captureDir = path.join(__dirname, 'public', 'captures');
// if (!fs.existsSync(captureDir)) {
//     fs.mkdirSync(captureDir, { recursive: true });
// }

// let isGeminiProcessing = false;

// // NEW: Check if frame contains a person using Roboflow
// const containsPerson = async (imagePath) => {
//     try {
//         const image = fs.readFileSync(imagePath, { encoding: "base64" });

//         const response = await axios({
//             method: "POST",
//             url: "https://serverless.roboflow.com/face-i3ibd/1",
//             params: {
//                 api_key: "5AClPrAwkdK3SDazhOji"
//             },
//             data: image,
//             headers: {
//                 "Content-Type": "application/x-www-form-urlencoded"
//             }
//         });

//         const predictions = response.data.predictions || [];
//         console.log(predictions, ">>>>>")
//         const personFound = predictions.length > 0;

//         console.log(personFound
//             ? `👤 Person detected (${predictions.length} found) → sending to Gemini`
//             : `🚫 No person detected → skipping Gemini`
//         );

//         return personFound;

//     } catch (err) {
//         console.error("❌ Roboflow Detection Error:", err.message);
//         return false; // If Roboflow fails, skip Gemini to be safe
//     }
// };

// const captureFrame = async (camera) => {
//     const filename = `camera_${camera._id}.jpg`;
//     const outputPath = path.join(captureDir, filename);
//     const isRtsp = camera.streamUrl.toLowerCase().startsWith('rtsp://');

//     let command = ffmpeg(camera.streamUrl)
//         .outputOptions('-frames:v 1')
//         .outputOptions('-y');

//     if (isRtsp) {
//         command = command
//             .inputOption('-rtsp_transport tcp')
//             .inputOption('-timeout 5000000');
//     }

//     command
//         .save(outputPath)
//         .on('end', async () => {
//             console.log(`✅ Screenshot saved for ${camera.cameraName}: ${filename}`);

//             // 🚀 Only send if Gemini is free
//             if (!isGeminiProcessing) {

//                 // ✅ NEW: First check if person exists in frame
//                 const personDetected = await containsPerson(outputPath);
//                 if (!personDetected) return; // No person → ignore frame

//                 isGeminiProcessing = true;  // 🔒 LOCK

//                 try {
//                     await processWithGemini(outputPath, camera);
//                 } catch (err) {
//                     console.error("Gemini Processing Error:", err.message);
//                 } finally {
//                     setTimeout(() => {
//                         isGeminiProcessing = false;
//                     }, 2000);
//                 }
//             } else {
//                 console.log("⏳ Gemini busy → frame ignored");
//             }
//         })
//         .on('error', (err) => {
//             console.error(`❌ Error capturing frame for ${camera.cameraName}:`, err.message);
//         });
// };

//  // Start the capture service
// const startCameraCaptureService = () => {
//     console.log('🎥 Camera Capture + Roboflow Service Started (Interval: 5 seconds)');

//     setInterval(async () => {
//         try {
//             const cameras = await Camera.find({});
//             if (cameras.length === 0) return;

//             // Process cameras with slight delay to avoid overwhelming CPU/network
//             cameras.forEach((camera, index) => {
//                 setTimeout(() => {
//                     captureFrame(camera);
//                 }, index * 800); // 800ms stagger between cameras
//             });

//         } catch (error) {
//             console.error('🔴 Error fetching cameras for capture:', error);
//         }
//     }, 5000);
// };

// module.exports = { startCameraCaptureService };


const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const Camera = require('../models/cameraModel');
const { processWithGemini } = require('./geminiService');

ffmpeg.setFfmpegPath('C:\\ProgramData\\ffmpeg-8.0.1-essentials_build\\bin\\ffmpeg.exe');

const captureDir = path.join(__dirname, 'public', 'captures');
if (!fs.existsSync(captureDir)) {
    fs.mkdirSync(captureDir, { recursive: true });
}

let isGeminiProcessing = false;
let cameraQueue = [];      // ✅ list of cameras waiting for Gemini
let currentQueueIndex = 0; // ✅ tracks whose turn it is

const containsPerson = async (imagePath) => {
    try {
        const image = fs.readFileSync(imagePath, { encoding: "base64" });

        const response = await axios({
            method: "POST",
            url: "https://serverless.roboflow.com/face-i3ibd/1",
            params: { api_key: "5AClPrAwkdK3SDazhOji" },
            data: image,
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        });

        const predictions = response.data.predictions || [];
        console.log(predictions, ">>>>>")
        const personFound = predictions.length > 0;

        console.log(personFound
            ? `👤 Person detected (${predictions.length} found) → sending to Gemini`
            : `🚫 No person detected → skipping Gemini`
        );

        return personFound;

    } catch (err) {
        console.error("❌ Roboflow Detection Error:", err.message);
        return false;
    }
};

const captureFrame = (camera) => {
    return new Promise((resolve) => {
        const filename = `camera_${camera._id}.jpg`;
        const outputPath = path.join(captureDir, filename);
        const isRtsp = camera.streamUrl.toLowerCase().startsWith('rtsp://');

        // ✅ Skip if Gemini is busy
        if (isGeminiProcessing) {
            console.log(`⏳ Gemini busy → skipping capture for ${camera.cameraName}`);
            return resolve();
        }

        let command = ffmpeg(camera.streamUrl)
            .outputOptions(['-frames:v 1', '-q:v 2', '-update 1']);

        if (isRtsp) {
            command.inputOptions(['-rtsp_transport tcp', '-timeout 10000000']);
        } else {
            command.inputOptions(['-re', '-timeout 10000000']);
        }

        command
            .output(outputPath)
            .on('end', async () => {
                console.log(`✅ Screenshot saved for ${camera.cameraName}: ${filename}`);

                isGeminiProcessing = true; // 🔒 Lock before person check

                try {
                    const personDetected = await containsPerson(outputPath);
                    if (!personDetected) return;

                    console.log(`🎯 Processing ${camera.cameraName} with Gemini...`);
                    await processWithGemini(outputPath, camera);

                } catch (err) {
                    console.error(`Gemini Processing Error for ${camera.cameraName}:`, err.message);
                } finally {
                    isGeminiProcessing = false; // 🔓 Unlock
                    console.log(`🔓 Gemini unlocked after processing ${camera.cameraName}`);
                    await new Promise(r => setTimeout(r, 1000)); // cooldown
                    resolve();
                }
            })
            .on('error', (err) => {
                console.error(`❌ Error capturing frame for ${camera.cameraName}:`, err.message);
                isGeminiProcessing = false;
                resolve();
            })
            .run();
    });
};

// ✅ Process cameras one by one in a cycle
const processCameraQueue = async () => {
    if (cameraQueue.length === 0) return;

    // Get next camera in cycle
    if (currentQueueIndex >= cameraQueue.length) {
        currentQueueIndex = 0; // reset to start
    }

    const camera = cameraQueue[currentQueueIndex];
    currentQueueIndex++;

    console.log(`🔄 Camera turn: ${camera.cameraName} (${currentQueueIndex}/${cameraQueue.length})`);
    await captureFrame(camera);
};

const startCameraCaptureService = () => {
    console.log('🎥 Camera Capture Service Started');

    // ✅ Refresh camera list every 30 seconds
    const refreshCameras = async () => {
        try {
            cameraQueue = await Camera.find({});
            console.log(`📷 Camera queue refreshed: ${cameraQueue.length} cameras`);
        } catch (err) {
            console.error('🔴 Error fetching cameras:', err.message);
        }
    };

    refreshCameras(); // initial load
    setInterval(refreshCameras, 30000); // refresh every 30s

    // ✅ Process one camera every 3 seconds in round-robin
    setInterval(async () => {
        await processCameraQueue();
    }, 5000);
};

module.exports = { startCameraCaptureService };




///// capture all frames 

// const ffmpeg = require('fluent-ffmpeg');
// const fs = require('fs');
// const path = require('path');
// const axios = require('axios');
// const Camera = require('../models/cameraModel');
// const { processWithGemini } = require('./geminiService');

// ffmpeg.setFfmpegPath('C:\\ProgramData\\ffmpeg-8.0.1-essentials_build\\bin\\ffmpeg.exe');

// const captureDir = path.join(__dirname, 'public', 'captures');
// if (!fs.existsSync(captureDir)) {
//     fs.mkdirSync(captureDir, { recursive: true });
// }

// const containsPerson = async (imagePath) => {
//     try {
//         const image = fs.readFileSync(imagePath, { encoding: "base64" });
//         const response = await axios({
//             method: "POST",
//             url: "https://serverless.roboflow.com/face-i3ibd/1",
//             params: { api_key: "5AClPrAwkdK3SDazhOji" },
//             data: image,
//             headers: { "Content-Type": "application/x-www-form-urlencoded" }
//         });
//         const predictions = response.data.predictions || [];
//         const personFound = predictions.length > 0;
//         console.log(personFound
//             ? `👤 Person detected in frame (${predictions.length} found)`
//             : `🚫 No person detected → skipping`
//         );
//         return personFound;
//     } catch (err) {
//         console.error("❌ Roboflow Detection Error:", err.message);
//         return false;
//     }
// };

// // ✅ Capture single frame - returns outputPath or null
// const captureFrame = (camera) => {
//     return new Promise((resolve) => {
//         const filename = `camera_${camera._id}.jpg`;
//         const outputPath = path.join(captureDir, filename);
//         const isRtsp = camera.streamUrl.toLowerCase().startsWith('rtsp://');

//         let command = ffmpeg(camera.streamUrl)
//             .outputOptions(['-frames:v 1', '-q:v 2', '-update 1']);

//         if (isRtsp) {
//             command.inputOptions(['-rtsp_transport tcp', '-timeout 10000000']);
//         } else {
//             command.inputOptions(['-re', '-timeout 10000000']);
//         }

//         command
//             .output(outputPath)
//             .on('end', () => {
//                 console.log(`✅ Frame captured: ${camera.cameraName}`);
//                 resolve(outputPath); // ✅ return path on success
//             })
//             .on('error', (err) => {
//                 console.error(`❌ Capture failed for ${camera.cameraName}:`, err.message);
//                 resolve(null); // ✅ return null on failure
//             })
//             .run();
//     });
// };

// const startCameraCaptureService = () => {
//     console.log('🎥 Camera Capture Service Started');

//     setInterval(async () => {
//         try {
//             const cameras = await Camera.find({});
//             if (cameras.length === 0) return;

//             console.log(`\n📷 Starting capture cycle for ${cameras.length} cameras...`);

//             // ✅ STEP 1: Capture ALL frames simultaneously
//             const captureResults = await Promise.all(
//                 cameras.map(async (camera) => {
//                     const framePath = await captureFrame(camera);
//                     return { camera, framePath };
//                 })
//             );

//             // ✅ STEP 2: Check ALL frames for persons simultaneously
//             const personCheckResults = await Promise.all(
//                 captureResults.map(async ({ camera, framePath }) => {
//                     if (!framePath) return null; // skip failed captures
//                     const hasPerson = await containsPerson(framePath);
//                     return hasPerson ? { camera, framePath } : null;
//                 })
//             );

//             // ✅ STEP 3: Filter only frames with persons
//             const framesWithPersons = personCheckResults.filter(Boolean);
//             console.log(`👥 ${framesWithPersons.length}/${cameras.length} frames have persons → sending to Gemini`);

//             // ✅ STEP 4: Process each frame with Gemini ONE BY ONE
//             for (const { camera, framePath } of framesWithPersons) {
//                 console.log(`🎯 Gemini processing: ${camera.cameraName}`);
//                 try {
//                     await processWithGemini(framePath, camera);
//                 } catch (err) {
//                     console.error(`❌ Gemini error for ${camera.cameraName}:`, err.message);
//                 }
//                 await new Promise(r => setTimeout(r, 1000)); // 1s cooldown between cameras
//             }

//             console.log(`✅ Capture cycle complete\n`);

//         } catch (error) {
//             console.error('🔴 Capture cycle error:', error.message);
//         }
//     }, 5000);
// };

// module.exports = { startCameraCaptureService };