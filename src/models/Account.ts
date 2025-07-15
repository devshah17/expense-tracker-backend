import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
    name: { type: String, required: true },
    icon: { type: String },
    isActive: { type: Boolean, default: true },
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: false },
}, { timestamps: true });

export const Account = mongoose.model('Account', accountSchema);
