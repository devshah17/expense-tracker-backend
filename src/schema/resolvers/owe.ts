import { Owe } from "../../models/Owe.ts";
import mongoose from "mongoose";
import { requireAuth } from "../../utils/middlewares/verifyToken.ts";

export const oweResolvers = {
    Query: {
        oweById: async (_: any, { id }: { id: string }, context: any) => {
            requireAuth(context);
            return Owe.findById(id);
        },
        owesByUser: async (_: any, __: any, context: any) => {
            requireAuth(context);
            const userId = context.user._id;
            return Owe.find({
                $or: [
                    { fromUserId: new mongoose.Types.ObjectId(userId) },
                    { toUserId: new mongoose.Types.ObjectId(userId) }
                ]
            });
        },
    },
    Mutation: {
        createOwe: async (
            _: any,
            { fromUserId, toUserId, fromName, toName, amount, currency, status, relatedTransactionId, notes, isActive }: any,
            context: any
        ) => {
            requireAuth(context);
            const owe = new Owe({
                fromUserId: fromUserId ? new mongoose.Types.ObjectId(fromUserId) : undefined,
                toUserId: toUserId ? new mongoose.Types.ObjectId(toUserId) : undefined,
                fromName,
                toName,
                amount,
                currency,
                status,
                relatedTransactionId: relatedTransactionId ? new mongoose.Types.ObjectId(relatedTransactionId) : undefined,
                notes,
                createdBy: new mongoose.Types.ObjectId(context.user._id),
                isActive: isActive !== undefined ? isActive : true,
            });
            await owe.save();
            return owe;
        },
        updateOwe: async (
            _: any,
            { id, fromUserId, toUserId, fromName, toName, amount, currency, status, relatedTransactionId, notes, isActive }: any,
            context: any
        ) => {
            requireAuth(context);
            const update: any = {};
            if (fromUserId !== undefined) update.fromUserId = new mongoose.Types.ObjectId(fromUserId);
            if (toUserId !== undefined) update.toUserId = new mongoose.Types.ObjectId(toUserId);
            if (fromName !== undefined) update.fromName = fromName;
            if (toName !== undefined) update.toName = toName;
            if (amount !== undefined) update.amount = amount;
            if (currency !== undefined) update.currency = currency;
            if (status !== undefined) update.status = status;
            if (relatedTransactionId !== undefined) update.relatedTransactionId = new mongoose.Types.ObjectId(relatedTransactionId);
            if (notes !== undefined) update.notes = notes;
            if (isActive !== undefined) update.isActive = isActive;
            const owe = await Owe.findByIdAndUpdate(id, update, { new: true });
            return owe;
        },
    },
};
