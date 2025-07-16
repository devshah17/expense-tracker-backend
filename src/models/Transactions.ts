import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    type: { type: String, enum: ['expense', 'income'], required: true },
    date: { type: Date, default: Date.now },
    notes: { type: String },
    accountId: { type: mongoose.Types.ObjectId, ref: 'Account', required: true },
    categoryId: { type: mongoose.Types.ObjectId, ref: 'Category' },
    subCategoryId: { type: mongoose.Types.ObjectId, ref: 'SubCategory' },
    icon: { type: String },
    isActive: { type: Boolean, default: true },
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    investmentTransactionId: { type: mongoose.Types.ObjectId, ref: 'InvestmentTransaction' },
    transferId: { type: mongoose.Types.ObjectId, ref: 'Transfer' },
}, { timestamps: true });

export const Transaction = mongoose.model('Transaction', transactionSchema);
