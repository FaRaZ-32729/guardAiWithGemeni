// const ffmpeg = require('fluent-ffmpeg');
// const fs = require('fs');
// const path = require('path');
// const Camera = require('../models/cameraModel');
// const { processWithGemini } = require('./geminiService');

// // Set FFmpeg path (Windows example)
// ffmpeg.setFfmpegPath('C:\\ProgramData\\ffmpeg-8.0.1-essentials_build\\bin\\ffmpeg.exe');

// // Ensure the capture directory exists
// const captureDir = path.join(__dirname, 'public', 'captures');
// if (!fs.existsSync(captureDir)) {
//     fs.mkdirSync(captureDir, { recursive: true });
// }

// let isGeminiProcessing = false;

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

// /**
//  * Start the capture service
//  */
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

// Set FFmpeg path (Windows example)
ffmpeg.setFfmpegPath('C:\\ProgramData\\ffmpeg-8.0.1-essentials_build\\bin\\ffmpeg.exe');

// Ensure the capture directory exists
const captureDir = path.join(__dirname, 'public', 'captures');
if (!fs.existsSync(captureDir)) {
    fs.mkdirSync(captureDir, { recursive: true });
}

let isGeminiProcessing = false;

// ✅ NEW: Check if frame contains a person using Roboflow
const containsPerson = async (imagePath) => {
    try {
        const image = fs.readFileSync(imagePath, { encoding: "base64" });

        const response = await axios({
            method: "POST",
            url: "https://serverless.roboflow.com/face-i3ibd/1",
            params: {
                api_key: "5AClPrAwkdK3SDazhOji"
            },
            data: image,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
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
        return false; // If Roboflow fails, skip Gemini to be safe
    }
};

const captureFrame = async (camera) => {
    const filename = `camera_${camera._id}.jpg`;
    const outputPath = path.join(captureDir, filename);
    const isRtsp = camera.streamUrl.toLowerCase().startsWith('rtsp://');

    let command = ffmpeg(camera.streamUrl)
        .outputOptions('-frames:v 1')
        .outputOptions('-y');

    if (isRtsp) {
        command = command
            .inputOption('-rtsp_transport tcp')
            .inputOption('-timeout 5000000');
    }

    command
        .save(outputPath)
        .on('end', async () => {
            console.log(`✅ Screenshot saved for ${camera.cameraName}: ${filename}`);

            // 🚀 Only send if Gemini is free
            if (!isGeminiProcessing) {

                // ✅ NEW: First check if person exists in frame
                const personDetected = await containsPerson(outputPath);
                if (!personDetected) return; // No person → ignore frame

                isGeminiProcessing = true;  // 🔒 LOCK

                try {
                    await processWithGemini(outputPath, camera);
                } catch (err) {
                    console.error("Gemini Processing Error:", err.message);
                } finally {
                    setTimeout(() => {
                        isGeminiProcessing = false;
                    }, 2000);
                }
            } else {
                console.log("⏳ Gemini busy → frame ignored");
            }
        })
        .on('error', (err) => {
            console.error(`❌ Error capturing frame for ${camera.cameraName}:`, err.message);
        });
};

// const captureFrame = async (camera) => {
//     // ✅ Skip capture completely if Gemini is busy
//     if (isGeminiProcessing) {
//         console.log("⏳ Gemini busy → skipping capture");
//         return;
//     }

//     const filename = `camera_${camera._id}.jpg`;
//     const outputPath = path.join(captureDir, filename);
//     const isRtsp = camera.streamUrl.toLowerCase().startsWith('rtsp://');

//     return new Promise((resolve) => {
//         let command = ffmpeg(camera.streamUrl)
//             .outputOptions([
//                 '-frames:v 1',
//                 '-q:v 2',
//                 '-update 1'
//             ]);

//         if (!isRtsp) {
//             command.inputOptions([
//                 '-re',
//                 '-timeout 10000000',
//             ]);
//         }

//         if (isRtsp) {
//             command.inputOptions([
//                 '-rtsp_transport tcp',
//                 '-timeout 10000000',
//             ]);
//         }

//         command
//             .output(outputPath)
//             .on('end', async () => {
//                 console.log(`✅ Screenshot saved for ${camera.cameraName}: ${filename}`);



//                 isGeminiProcessing = true; // 🔒 LOCK

//                 try {
//                     const personDetected = await containsPerson(outputPath);
//                     if (!personDetected) return resolve();
//                     await processWithGemini(outputPath, camera);
//                 } catch (err) {
//                     console.error("Gemini Processing Error:", err.message);
//                 } finally {
//                     isGeminiProcessing = false; // ✅ unlock immediately, no setTimeout
//                     console.log("🔓 Gemini unlocked → ready for next frame");
//                     await new Promise(r => setTimeout(r, 1000));
//                     resolve();
//                 }
//             })
//             .on('error', (err) => {
//                 console.error(`❌ Error capturing frame for ${camera.cameraName}:`, err.message);
//                 isGeminiProcessing = false; // ✅ also unlock on FFmpeg error
//                 resolve();
//             })
//             .run();
//     });
// };
/**
 * Start the capture service
 */
const startCameraCaptureService = () => {
    console.log('🎥 Camera Capture + Roboflow Service Started (Interval: 5 seconds)');

    setInterval(async () => {
        try {
            const cameras = await Camera.find({});
            if (cameras.length === 0) return;

            // Process cameras with slight delay to avoid overwhelming CPU/network
            cameras.forEach((camera, index) => {
                setTimeout(() => {
                    captureFrame(camera);
                }, index * 800); // 800ms stagger between cameras
            });

        } catch (error) {
            console.error('🔴 Error fetching cameras for capture:', error);
        }
    }, 5000);
};

module.exports = { startCameraCaptureService };