import mongoose from "mongoose";

const investmentTransactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    investmentId: { type: mongoose.Types.ObjectId, ref: 'Investment', required: true },
    type: {
        type: String,
        enum: ['BUY', 'SELL', 'DIVIDEND', 'INTEREST', 'TRANSFER_IN', 'TRANSFER_OUT'],
        required: true,
    },
    amount: { type: Number, required: true },
    units: { type: Number },
    navOrPrice: { type: Number },
    date: { type: Date, default: Date.now },
    note: { type: String },
    linkedTransactionId: { type: mongoose.Types.ObjectId, ref: 'Transaction' },
}, { timestamps: true });

export const InvestmentTransaction = mongoose.model('InvestmentTransaction', investmentTransactionSchema);
