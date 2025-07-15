import mongoose from "mongoose";

const oweSchema = new mongoose.Schema({
    fromUserId: { type: mongoose.Types.ObjectId, ref: 'User', required: false },
    toUserId: { type: mongoose.Types.ObjectId, ref: 'User', required: false },

    fromName: { type: String, required: function () { return !this.fromUserId; } },
    toName: { type: String, required: function () { return !this.toUserId; } },

    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    status: { type: String, enum: ['pending', 'settled', 'partial'], default: 'pending' },

    relatedTransactionId: { type: mongoose.Types.ObjectId, ref: 'Transaction', required: false },
    notes: { type: String },

    createdBy: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const Owe = mongoose.model('Owe', oweSchema);
