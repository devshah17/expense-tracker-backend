import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema({
    name: { type: String, required: true },

    amount: { type: Number, required: true },
    spent: { type: Number, default: 0 },

    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },

    categoryId: { type: mongoose.Types.ObjectId, ref: 'Category', required: false },
    subCategoryId: { type: mongoose.Types.ObjectId, ref: 'SubCategory', required: false },
    accountId: { type: mongoose.Types.ObjectId, ref: 'Account', required: false },

    type: { type: String, enum: ['one-time', 'monthly', 'weekly'], default: 'monthly' },

    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    alertThreshold: { type: Number, default: 80 },

    isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const Budget = mongoose.model('Budget', budgetSchema);
