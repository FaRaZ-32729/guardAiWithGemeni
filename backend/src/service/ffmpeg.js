const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
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
