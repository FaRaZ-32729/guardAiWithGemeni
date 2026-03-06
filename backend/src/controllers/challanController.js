const sendEmail = require('../middleware/sendEmail');
const AnonymousViolation = require('../models/anonymousViolationModel');
const Challan = require('../models/challanModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const CHALLAN_AMOUNTS = {
    smoking: 500,
    fighting: 1000
};

// const generateChallan = async (geminiResult) => {
//     console.log(`gemeni result in generate challan ${geminiResult}`)
//     try {

//         if (!geminiResult.matched || geminiResult.rollNo === 'N/A') {
//             if (['smoking', 'fighting'].includes(geminiResult.action)) {
//                 const record = new AnonymousViolation({
//                     name: "Anonymous",
//                     action: geminiResult.action,
//                     confidence: geminiResult.confidence,
//                     description: geminiResult.description
//                 });
//                 await record.save();
//                 console.log(`⚠️ Anonymous violation saved | Action: ${geminiResult.action}`);
//             }
//             return;
//         }

//         // Only generate for smoking or fighting
//         if (!['smoking', 'fighting'].includes(geminiResult.action)) return;

//         // Only for matched (known) students
//         if (!geminiResult.matched || geminiResult.rollNo === 'N/A') {
//             console.log("Anonymous person detected with violation → cannot generate challan");
//             return;
//         }

//         // Find student by rollNo
//         const student = await User.findOne({ studentRollNumber: geminiResult.rollNo });
//         if (!student) {
//             console.warn(`Student not found in DB for rollNo: ${geminiResult.rollNo}`);
//             return;
//         }

//         // Get last unpaid challan balance
//         const lastChallan = await Challan.findOne({ studentId: student._id }).sort({ createdAt: -1 });
//         const previousBalance = lastChallan ? lastChallan.currentChallan : 0;

//         // Dates
//         const issueDate = new Date();
//         const dueDate = new Date();
//         dueDate.setDate(dueDate.getDate() + 7); // 7 days to pay


//         // Create challan
//         const challan = new Challan({
//             studentId: student._id,
//             previousChallanBalance: previousBalance,
//             currentChallan: previousBalance + CHALLAN_AMOUNTS[geminiResult.action],
//             challanIssueDate: issueDate,
//             challanDueDate: dueDate,
//             status: 'unpaid'
//         });

//         console.log("generated challan ", challan);

//         await challan.save();

//         console.log(` Challan generated for ${geminiResult.name} | Action: ${geminiResult.action} | Amount: ${CHALLAN_AMOUNTS[geminiResult.action]}`);

//     } catch (error) {
//         console.error(" Challan Generation Error:", error.message);
//     }
// };


// GET /api/challan/:id



// If not matched → save anonymous violation
// if (!geminiResult.matched || geminiResult.rollNo === 'N/A') {
//     if (['smoking', 'fighting'].includes(geminiResult.action)) {
//         const record = new AnonymousViolation({
//             name: "Anonymous",
//             action: geminiResult.action,
//             confidence: geminiResult.confidence,
//             description: geminiResult.description
//         });
//         await record.save();
//         console.log(`⚠️ Anonymous violation saved | Action: ${geminiResult.action}`);
//     }
//     return;
// }

// If not matched → save anonymous violation
// if (!geminiResult.matched || geminiResult.rollNo === 'N/A') {
//     if (['smoking', 'fighting'].includes(geminiResult.action)) {

//         // Save anonymous violation image
//         const violationsDir = path.join(__dirname, "../../violations");
//         if (!fs.existsSync(violationsDir)) {
//             fs.mkdirSync(violationsDir, { recursive: true });
//         }

//         const filename = `violation_anonymous_${Date.now()}.jpg`;
//         const violationImagePath = path.join(violationsDir, filename);
//         fs.copyFileSync(snapshotPath, violationImagePath);
//         console.log(`📸 Anonymous violation image saved: ${filename}`);

//         const record = new AnonymousViolation({
//             name: "Anonymous",
//             action: geminiResult.action,
//             confidence: geminiResult.confidence,
//             description: geminiResult.description,
//             evidenceImage: violationImagePath  
//         });
//         await record.save();
//         console.log(`⚠️ Anonymous violation saved | Action: ${geminiResult.action}`);
//     }
//     return;
// }


const generateChallan = async (geminiResult, snapshotPath) => {
    console.log(`gemini result in generate challan`, geminiResult);

    try {

        if (!geminiResult.matched || geminiResult.rollNo === 'N/A') {
            if (['smoking', 'fighting'].includes(geminiResult.action)) {

                const violationsDir = path.join(__dirname, "../../violations");
                if (!fs.existsSync(violationsDir)) {
                    fs.mkdirSync(violationsDir, { recursive: true });
                }

                const filename = `violation_anonymous_${Date.now()}.jpg`;
                const violationImagePath = path.join(violationsDir, filename);
                fs.copyFileSync(snapshotPath, violationImagePath);

                const issueDate = new Date();
                const dueDate = new Date();
                dueDate.setDate(dueDate.getDate() + 7);

                // ✅ Save in same Challan model
                const challan = new Challan({
                    isAnonymous: true,
                    name: "Anonymous",
                    previousChallanBalance: 0,
                    currentChallan: 0,
                    challanIssueDate: issueDate,
                    challanDueDate: dueDate,
                    violationType: geminiResult.action,
                    evidenceImage: violationImagePath,
                    description: geminiResult.description,
                    status: 'unpaid'
                });

                await challan.save();
                console.log(`⚠️ Anonymous challan saved | Action: ${geminiResult.action}`);
            }
            return;
        }

        if (!['smoking', 'fighting'].includes(geminiResult.action)) return;

        // Find student
        const student = await User.findOne({ studentRollNumber: geminiResult.rollNo });

        if (!student) {
            console.warn(`Student not found in DB for rollNo: ${geminiResult.rollNo}`);
            return;
        }

        // Get previous balance
        const lastChallan = await Challan
            .findOne({ studentId: student._id })
            .sort({ createdAt: -1 });

        const previousBalance = lastChallan ? lastChallan.currentChallan : 0;

        const issueDate = new Date();
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 7);

        const violationAmount = CHALLAN_AMOUNTS[geminiResult.action];

        // save evidance evidence
        const violationsDir = path.join(__dirname, "../../violations");

        if (!fs.existsSync(violationsDir)) {
            fs.mkdirSync(violationsDir, { recursive: true });
            console.log("new folder created")
        }

        const filename = `violation_${student.studentRollNumber}_${Date.now()}.jpg`;
        console.log(filename)
        const violationImagePath = path.join(violationsDir, filename);

        // copy frame as evidence
        fs.copyFileSync(snapshotPath, violationImagePath);

        const challan = new Challan({
            studentId: student._id,
            previousChallanBalance: previousBalance,
            currentChallan: previousBalance + violationAmount,
            challanIssueDate: issueDate,
            challanDueDate: dueDate,
            violationType: geminiResult.action,
            status: 'unpaid',
            evidenceImage: violationImagePath,
            description: geminiResult.description
        });


        await challan.save();

        console.log(`Challan generated for ${student.name} | Action: ${geminiResult.action}`);

        try {
            const recipients = [student.email, student.parentsEmail]

            // Send Email with Attachment
            await sendEmail(
                recipients,
                `Violation Challan Notice - ${student.name}`,
                `
        <div style="font-family: Arial, sans-serif; background:#f2f2f2; padding:20px;">
          <div style="max-width:750px; margin:auto; background:white; padding:20px; border:1px solid #000;">

            <!-- Header -->
            <div style="text-align:center; border-bottom:2px solid #000; padding-bottom:10px;">
              <img src="https://iqra.edu.pk/wp-content/uploads/2025/08/LOGO-IU-01-2048x495-1.png"
                   style="width:200px;" />
              <h2 style="margin:5px 0;">DISCIPLINARY CHALLAN</h2>
              <p style="margin:0;">Depositor's Copy</p>
            </div>

            <br/>

            <!-- Student Info Table -->
            <table style="width:100%; border-collapse:collapse; font-size:14px;">
              <tr>
                <td style="border:1px solid #000; padding:8px;"><b>Student Name</b></td>
                <td style="border:1px solid #000; padding:8px;">${student.name}</td>
              </tr>
              <tr>
                <td style="border:1px solid #000; padding:8px;"><b>Father Name</b></td>
                <td style="border:1px solid #000; padding:8px;">${student.fatherName || "N/A"}</td>
              </tr>
              <tr>
                <td style="border:1px solid #000; padding:8px;"><b>Phone Number</b></td>
                <td style="border:1px solid #000; padding:8px;">${student.parentsPhone || "N/A"}</td>
              </tr>
              <tr>
                <td style="border:1px solid #000; padding:8px;"><b>Roll Number</b></td>
                <td style="border:1px solid #000; padding:8px;">${student.studentRollNumber}</td>
              </tr>
              <tr>
                <td style="border:1px solid #000; padding:8px;"><b>Program</b></td>
                <td style="border:1px solid #000; padding:8px;">${student.department || "N/A"}</td>
              </tr>
            </table>

            <br/>

            <!-- Challan Details -->
            <table style="width:100%; border-collapse:collapse; font-size:14px;">
              <tr>
                <th style="border:1px solid #000; padding:8px;">Description</th>
                <th style="border:1px solid #000; padding:8px;">Amount (PKR)</th>
              </tr>
              <tr>
                <td style="border:1px solid #000; padding:8px;">Previous Challan Balance</td>
                <td style="border:1px solid #000; padding:8px;">${previousBalance}</td>
              </tr>
              <tr>
                <td style="border:1px solid #000; padding:8px;">
                  Violation (${geminiResult.action.toUpperCase()})
                </td>
                <td style="border:1px solid #000; padding:8px;">${violationAmount}</td>
              </tr>
              <tr>
                <td style="border:1px solid #000; padding:8px;"><b>Total Payable</b></td>
                <td style="border:1px solid #000; padding:8px; color:red;">
                  <b>${challan.currentChallan}</b>
                </td>
              </tr>
            </table>

            <br/>

            <!-- Dates -->
            <table style="width:100%; border-collapse:collapse;">
              <tr>
                <td style="border:1px solid #000; padding:8px;"><b>Issue Date:</b> ${issueDate.toDateString()}</td>
                <td style="border:1px solid #000; padding:8px;"><b>Due Date:</b> ${dueDate.toDateString()}</td>
              </tr>
            </table>

            <br/>

            <!-- JazzCash Payment Details -->
            <div style="border:1px solid #000; padding:10px;">
              <h3 style="margin-top:0;">Payment Method - JazzCash</h3>
              <p><b>Account Title:</b> FARAZ Siyal </p>
              <p><b>JazzCash Number:</b> 03042240997 </p>
              <p style="color:red; font-size:13px;">
                Please send payment screenshot to accounts department after transaction.
              </p>
            </div>

            <br/>

            <div style="text-align:center; font-size:12px; color:#555;">
              This is a system generated challan. No signature required.
            </div>

            <br/>

            <div style="border-top:1px dashed #000; padding-top:10px; text-align:center;">
              © ${new Date().getFullYear()} Campus Administration | All Rights Reserved
            </div>

          </div>
        </div>
        `);

        } catch (emailError) {
            console.error("Email sending failed:", emailError.message);
        }


        console.log("📧 Challan email sent to student and parent.");

    } catch (error) {
        console.error("Challan Generation Error:", error.message);
    }
};

const getSingleChallanById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid challan ID" });
        }

        const challan = await Challan.findById(id).populate('studentId', 'name email studentRollNumber department');
        if (!challan) {
            return res.status(404).json({ message: "Challan not found" });
        }

        return res.status(200).json({ challan });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message || "Server error" });
    }
};

// GET /api/challan/user/:userId
const getAllChallansOfUser = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const student = await User.findById(userId);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        const challans = await Challan.find({ studentId: userId }).populate('studentId', 'name email studentRollNumber department');

        return res.status(200).json({
            total: challans.length,
            challans
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message || "Server error" });
    }
};

// GET /api/challan
const getAllChallans = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;

        const filter = {};
        if (status) {
            if (!['unpaid', 'paid', 'overdue'].includes(status)) {
                return res.status(400).json({ message: "Invalid status. Use: unpaid, paid, overdue" });
            }
            filter.status = status;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [challans, total] = await Promise.all([
            Challan.find(filter)
                .populate('studentId', 'name email studentRollNumber department')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            Challan.countDocuments(filter)
        ]);

        return res.status(200).json({
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
            challans
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message || "Server error" });
    }
};

// PATCH /api/challan/:id/status
const updateChallanStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid challan ID" });
        }

        if (!status) {
            return res.status(400).json({ message: "Status is required" });
        }

        if (!['unpaid', 'paid', 'overdue'].includes(status)) {
            return res.status(400).json({ message: "Invalid status. Use: unpaid, paid, overdue" });
        }

        const challan = await Challan.findById(id);
        if (!challan) {
            return res.status(404).json({ message: "Challan not found" });
        }

        if (challan.status === 'paid') {
            return res.status(400).json({ message: "Paid challan cannot be updated" });
        }

        challan.status = status;
        await challan.save();

        return res.status(200).json({ message: "Challan status updated", challan });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message || "Server error" });
    }
};

// DELETE /api/challan/:id
const deleteChallan = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid challan ID" });
        }

        const challan = await Challan.findById(id);
        if (!challan) {
            return res.status(404).json({ message: "Challan not found" });
        }

        if (challan.status === 'paid') {
            return res.status(400).json({ message: "Paid challan cannot be deleted" });
        }

        await Challan.findByIdAndDelete(id);

        return res.status(200).json({ message: "Challan deleted successfully" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message || "Server error" });
    }
};

module.exports = {
    generateChallan,
    getSingleChallanById,
    getAllChallansOfUser,
    getAllChallans,
    updateChallanStatus,
    deleteChallan
};