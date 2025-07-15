import { Transaction } from '../../models/Transactions.ts';
import { Account } from '../../models/Account.ts';
import { Category } from '../../models/Category.ts';
import { SubCategory } from '../../models/SubCategory.ts';
import { User } from '../../models/User.ts';
import mongoose from 'mongoose';
import { requireAuth } from '../../utils/middlewares/verifyToken.ts';

export const transactionResolvers = {
    Query: {
        transactionsByUser: async (_: any, { userId }: { userId: string }, context: any) => {
            requireAuth(context);
            const transactions = await Transaction.find({ userId: new mongoose.Types.ObjectId(userId) })
                .populate('accountId')
                .populate('categoryId')
                .populate('subCategoryId')
                .populate('userId');
            return transactions;
        },
        transactionById: async (_: any, { id }: { id: string }, context: any) => {
            requireAuth(context);
            const transaction = await Transaction.findById(id)
                .populate('accountId')
                .populate('categoryId')
                .populate('subCategoryId')
                .populate('userId');
            return transaction;
        },
    },
    Mutation: {
        createTransaction: async (_: any, { input }: any, context: any) => {
            requireAuth(context);
            const transaction = new Transaction({
                ...input,
                userId: new mongoose.Types.ObjectId(context.user._id),
            });
            await transaction.save();
            return await Transaction.findById(transaction._id)
                .populate('accountId')
                .populate('categoryId')
                .populate('subCategoryId')
                .populate('userId');
        },
        updateTransaction: async (_: any, { id, input }: any, context: any) => {
            requireAuth(context);
            const transaction = await Transaction.findByIdAndUpdate(
                id,
                { $set: input },
                { new: true }
            )
                .populate('accountId')
                .populate('categoryId')
                .populate('subCategoryId')
                .populate('userId');
            return transaction;
        },
    },
};
