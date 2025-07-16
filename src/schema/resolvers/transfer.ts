import { Transfer } from "../../models/Transfer.ts";
import mongoose from "mongoose";
import { requireAuth } from "../../utils/middlewares/verifyToken.ts";
import { Transaction } from "../../models/Transactions.ts";

export const transferResolvers = {
    Query: {
        transferById: async (_: any, { id }: { id: string }, context: any) => {
            requireAuth(context);
            return Transfer.findById(id);
        },
        transfersByUser: async (_: any, __: any, context: any) => {
            requireAuth(context);
            const userId = context.user._id;
            return Transfer.find({ userId: new mongoose.Types.ObjectId(userId) });
        },
    },
    Mutation: {
        createTransfer: async (
            _: any,
            { fromAccountId, toAccountId, amount, date, notes }: { fromAccountId: string; toAccountId: string; amount: number; date?: string; notes?: string },
            context: any
        ) => {
            requireAuth(context);
            const userId = new mongoose.Types.ObjectId(context.user._id);
            // 1. Create expense transaction from fromAccountId
            const expenseTransaction = new Transaction({
                amount,
                type: 'expense',
                date: date ? new Date(date) : undefined,
                notes,
                accountId: new mongoose.Types.ObjectId(fromAccountId),
                userId,
            });
            await expenseTransaction.save();

            // 2. Create income transaction to toAccountId
            const incomeTransaction = new Transaction({
                amount,
                type: 'income',
                date: date ? new Date(date) : undefined,
                notes,
                accountId: new mongoose.Types.ObjectId(toAccountId),
                userId,
            });
            await incomeTransaction.save();

            // 3. Create the Transfer
            const transfer = new Transfer({
                fromAccountId: new mongoose.Types.ObjectId(fromAccountId),
                toAccountId: new mongoose.Types.ObjectId(toAccountId),
                amount,
                date: date ? new Date(date) : undefined,
                notes,
                userId,
            });
            await transfer.save();

            await Transaction.findByIdAndUpdate(expenseTransaction._id, { transferId: transfer._id });
            await Transaction.findByIdAndUpdate(incomeTransaction._id, { transferId: transfer._id });

            return transfer;
        },
        updateTransfer: async (
            _: any,
            { id, fromAccountId, toAccountId, amount, date, notes, isActive }: { id: string; fromAccountId?: string; toAccountId?: string; amount?: number; date?: string; notes?: string; isActive?: boolean },
            context: any
        ) => {
            requireAuth(context);
            const update: any = {};
            if (fromAccountId !== undefined) update.fromAccountId = new mongoose.Types.ObjectId(fromAccountId);
            if (toAccountId !== undefined) update.toAccountId = new mongoose.Types.ObjectId(toAccountId);
            if (amount !== undefined) update.amount = amount;
            if (date !== undefined) update.date = new Date(date);
            if (notes !== undefined) update.notes = notes;
            if (isActive !== undefined) update.isActive = isActive;
            const transfer = await Transfer.findByIdAndUpdate(id, update, { new: true });
            return transfer;
        },
    },
};
