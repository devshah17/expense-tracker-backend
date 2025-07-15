import mongoose from "mongoose";

const transferSchema = new mongoose.Schema({
    fromAccountId: { type: mongoose.Types.ObjectId, ref: 'Account', required: true },
    toAccountId: { type: mongoose.Types.ObjectId, ref: 'Account', required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    notes: { type: String },

    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const Transfer = mongoose.model('Transfer', transferSchema);
