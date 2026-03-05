const mongoose = require("mongoose");

const challanSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        previousChallanBalance: {
            type: Number,
            required: true,
            min: [0, "Previous balance cannot be negative"],
            default: 0
        },

        currentChallan: {
            type: Number,
            required: true,
            min: [0, "Current challan cannot be negative"]
        },

        challanIssueDate: {
            type: Date,
            required: [true, "Challan issue date is required"]
        },

        challanDueDate: {
            type: Date,
            required: [true, "Challan due date is required"]
        },

        status: {
            type: String,
            enum: ["unpaid", "paid", "overdue"],
            default: "unpaid"
        },

        violationType: {
            type: String,
            enum: ["smoking", "fighting"],
            required: true
        },
        
        evidenceImage: {
            type: String,
        },
    },
    { timestamps: true }
);

challanSchema.pre("save", async function () {
    if (this.challanDueDate < this.challanIssueDate) {
        throw new Error("Due date cannot be before issue date");
    }
});

const challanModel = mongoose.model('challan', challanSchema);

module.exports = challanModel;