const AnonymousViolation = require('../models/anonymousViolationModel');
const Challan = require('../models/challanModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');

const CHALLAN_AMOUNTS = {
    smoking: 500,
    fighting: 1000
};

const generateChallan = async (geminiResult) => {
    console.log(`gemeni result in generate challan ${geminiResult}`)
    try {

        if (!geminiResult.matched || geminiResult.rollNo === 'N/A') {
            if (['smoking', 'fighting'].includes(geminiResult.action)) {
                const record = new AnonymousViolation({
                    name: "Anonymous",
                    action: geminiResult.action,
                    confidence: geminiResult.confidence,
                    description: geminiResult.description
                });
                await record.save();
                console.log(`⚠️ Anonymous violation saved | Action: ${geminiResult.action}`);
            }
            return;
        }
        
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
            currentChallan: previousBalance + CHALLAN_AMOUNTS[geminiResult.action],
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


// GET /api/challan/:id
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