import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    icon: { type: String },
    isActive: { type: Boolean, default: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    categoryId: { type: mongoose.Types.ObjectId, ref: 'Category', required: true },
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: false },
}, { timestamps: true });

export const SubCategory = mongoose.model('SubCategory', subCategorySchema);
