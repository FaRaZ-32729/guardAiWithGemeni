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
            enum: ["unpaid", "partially_paid", "paid", "overdue"],
            default: "unpaid"
        }
    },
    { timestamps: true }
);

challanSchema.pre("save", function (next) {
    if (this.challanDueDate < this.challanIssueDate) {
        return next(new Error("Due date cannot be before issue date"));
    }
    next();
});

const challanModel = mongoose.model('challan', challanSchema);

module.exports = challanModel;