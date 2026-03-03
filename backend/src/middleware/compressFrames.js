const sharp = require('sharp');

// ✅ Add this helper function
const compressImageToBase64 = async (imagePath) => {
    const compressed = await sharp(imagePath)
        .resize(640, 640, { fit: 'inside' })   // max 640x640
        .jpeg({ quality: 70 })                  // compress quality
        .toBuffer();
    return compressed.toString('base64');
};

module.exports = compressImageToBase64