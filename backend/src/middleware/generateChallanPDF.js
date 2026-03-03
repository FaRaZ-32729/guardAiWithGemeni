const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generateChallanPDF = (student, challan, violationAmount) => {
    return new Promise((resolve, reject) => {
        try {
            const dirPath = path.join(__dirname, "../uploads/challans");

            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
            }

            const filePath = path.join(
                dirPath,
                `Challan_${student.studentRollNumber}_${Date.now()}.pdf`
            );

            const doc = new PDFDocument({ margin: 50 });
            const stream = fs.createWriteStream(filePath);

            doc.pipe(stream);

            // Header
            doc
                .fontSize(20)
                .fillColor("#0055a5")
                .text("Disciplinary Challan Notice", { align: "center" });

            doc.moveDown(2);

            doc.fillColor("black");
            doc.fontSize(12);

            doc.text(`Student Name: ${student.name}`);
            doc.text(`Roll Number: ${student.studentRollNumber}`);
            doc.text(`Program: ${student.program || "N/A"}`);
            doc.moveDown();

            doc.text(`Violation Type: ${challan.violationType}`);
            doc.text(`Violation Amount: Rs. ${violationAmount}`);
            doc.text(`Previous Balance: Rs. ${challan.previousChallanBalance}`);
            doc.text(`Total Payable: Rs. ${challan.currentChallan}`);
            doc.moveDown();

            doc.text(`Issue Date: ${challan.challanIssueDate.toDateString()}`);
            doc.text(`Due Date: ${challan.challanDueDate.toDateString()}`);
            doc.moveDown(2);

            doc.fillColor("red")
               .text("Please ensure payment before due date to avoid further penalties.");

            doc.moveDown(4);

            doc.fillColor("gray")
               .fontSize(10)
               .text(`© ${new Date().getFullYear()} Your Institution Name`, {
                   align: "center"
               });

            doc.end();

            stream.on("finish", () => resolve(filePath));
            stream.on("error", reject);

        } catch (error) {
            reject(error);
        }
    });
};

module.exports = generateChallanPDF;