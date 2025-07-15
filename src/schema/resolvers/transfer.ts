import { Transfer } from "../../models/Transfer.ts";
import mongoose from "mongoose";
import { requireAuth } from "../../utils/middlewares/verifyToken.ts";

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
            const transfer = new Transfer({
                fromAccountId: new mongoose.Types.ObjectId(fromAccountId),
                toAccountId: new mongoose.Types.ObjectId(toAccountId),
                amount,
                date: date ? new Date(date) : undefined,
                notes,
                userId: new mongoose.Types.ObjectId(context.user._id),
            });
            await transfer.save();
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
