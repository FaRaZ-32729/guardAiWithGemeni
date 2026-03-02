const Challan = require('../models/challanModel');
const User = require('../models/userModel');

const CHALLAN_AMOUNTS = {
    smoking: 500,
    fighting: 1000
};

const generateChallan = async (geminiResult) => {
    console.log(`gemeni result in generate challan ${geminiResult}`)
    try {
        // Only generate for smoking or fighting
        if (!['smoking', 'fighting'].includes(geminiResult.action)) return;

        // Only for matched (known) students
        if (!geminiResult.matched || geminiResult.rollNo === 'N/A') {
            console.log("Anonymous person detected with violation → cannot generate challan");
            return;
        }

        // Find student by rollNo
        const student = await User.findOne({ studentRollNumber: geminiResult.rollNo });
        if (!student) {
            console.warn(`Student not found in DB for rollNo: ${geminiResult.rollNo}`);
            return;
        }

        // Get last unpaid challan balance
        const lastChallan = await Challan.findOne({ studentId: student._id }).sort({ createdAt: -1 });
        const previousBalance = lastChallan ? lastChallan.currentChallan : 0;

        // Dates
        const issueDate = new Date();
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 7); // 7 days to pay


        // Create challan
        const challan = new Challan({
            studentId: student._id,
            previousChallanBalance: previousBalance,
            currentChallan: CHALLAN_AMOUNTS[geminiResult.action],
            challanIssueDate: issueDate,
            challanDueDate: dueDate,
            status: 'unpaid'
        });

        console.log("generated challan ", challan);

        await challan.save();

        console.log(` Challan generated for ${geminiResult.name} | Action: ${geminiResult.action} | Amount: ${CHALLAN_AMOUNTS[geminiResult.action]}`);

    } catch (error) {
        console.error(" Challan Generation Error:", error.message);
    }
};

module.exports = { generateChallan };