import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    icon: { type: String },
    isActive: { type: Boolean, default: true },
    type: { type: String, enum: ['expense', 'income'], required: true },
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: false },
}, { timestamps: true });

export const Category = mongoose.model('Category', categorySchema);
