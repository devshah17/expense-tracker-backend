import { Budget } from '../../models/Budget.ts';
import mongoose from 'mongoose';
import { requireAuth } from '../../utils/middlewares/verifyToken.ts';
import { Category } from '../../models/Category.ts';
import { SubCategory } from '../../models/SubCategory.ts';
import { Account } from '../../models/Account.ts';

async function checkRelatedIds({ categoryId, subCategoryId, accountId }: { categoryId?: string, subCategoryId?: string, accountId?: string }) {
    if (categoryId) {
        const exists = await Category.exists({ _id: categoryId });
        if (!exists) throw new Error('Category not found');
    }
    if (subCategoryId) {
        const exists = await SubCategory.exists({ _id: subCategoryId });
        if (!exists) throw new Error('SubCategory not found');
    }
    if (accountId) {
        const exists = await Account.exists({ _id: accountId });
        if (!exists) throw new Error('Account not found');
    }
}

export const budgetResolvers = {
    Query: {
        budgetsByUser: async (_: any, __: any, context: any) => {
            requireAuth(context);
            const userId = context.user._id;
            return Budget.find({ userId: new mongoose.Types.ObjectId(userId) });
        },
        budgetById: async (_: any, { id }: { id: string }, context: any) => {
            requireAuth(context);
            const userId = context.user._id;
            const budget = await Budget.findOne({ _id: id, userId: new mongoose.Types.ObjectId(userId) });
            if (!budget) throw new Error('Budget not found or not accessible');
            return budget;
        },
    },
    Mutation: {
        createBudget: async (_: any, args: any, context: any) => {
            requireAuth(context);
            const userId = context.user._id;
            await checkRelatedIds(args);
            const budget = new Budget({
                ...args,
                userId: new mongoose.Types.ObjectId(userId),
            });
            await budget.save();
            return budget;
        },
        updateBudget: async (_: any, { id, ...updates }: any, context: any) => {
            requireAuth(context);
            const userId = context.user._id;
            const budget = await Budget.findOne({ _id: id, userId: new mongoose.Types.ObjectId(userId) });
            if (!budget) throw new Error('Budget not found or not owned by user');
            await checkRelatedIds(updates);
            Object.keys(updates).forEach(key => {
                if (updates[key] !== undefined) {
                    budget[key] = updates[key];
                }
            });
            await budget.save();
            return budget;
        },
    },
};
