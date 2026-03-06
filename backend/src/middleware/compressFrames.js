const sharp = require('sharp');
const fs = require('fs');

const compressImageToBase64 = async (imagePath) => {
    // ✅ Read file into buffer first, then process
    // This releases the file handle immediately before Sharp processes it
    const fileBuffer = fs.readFileSync(imagePath);

    const compressed = await sharp(fileBuffer)  // ✅ pass buffer, not file path
        .rotate()
        .resize(640, 640, { fit: 'inside' })
        .jpeg({ quality: 50 })
        .toBuffer();

    return compressed.toString('base64');
};

module.exports = compressImageToBase64;