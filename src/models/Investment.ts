import mongoose from "mongoose";

const investmentSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    type: {
        type: String,
        enum: ['GOAL', 'MF', 'STOCK', 'FD'],
        required: true,
    },
    accountId: { type: mongoose.Types.ObjectId, ref: 'Account', required: true },
    units: { type: Number, default: 0 },
    avgBuyPrice: { type: Number, default: 0 },
    totalAmountInvested: { type: Number, default: 0 },
    currentNAV: { type: Number, default: 0 },
    externalKey: { type: String },
    targetAmount: { type: Number },
    targetDate: { type: Date },
    isArchived: { type: Boolean, default: false },
}, { timestamps: true });

export const Investment = mongoose.model('Investment', investmentSchema);
