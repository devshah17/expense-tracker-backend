import { Account } from "../../models/Account.ts";
import mongoose from "mongoose";
import { requireAuth } from "../../utils/middlewares/verifyToken.ts";

export const accountResolvers = {
    Query: {
        accountsByUser: async (_: any, __: any, context: any) => {
            requireAuth(context);
            return Account.find({ userId: new mongoose.Types.ObjectId(context.user._id) });
        },
        account: async (_: any, { id }: { id: string }, context: any) => {
            requireAuth(context);
            return Account.findById(id);
        },
    },
    Mutation: {
        createAccount: async (
            _: any,
            { name, icon }: { name: string; icon?: string },
            context: any
        ) => {
            requireAuth(context);
            const account = new Account({
                name,
                icon,
                userId: new mongoose.Types.ObjectId(context.user._id),
            });
            await account.save();
            return account;
        },
        updateAccount: async (
            _: any,
            { id, name, icon, isActive }: { id: string; name?: string; icon?: string; isActive?: boolean },
            context: any
        ) => {
            requireAuth(context);
            const update: any = {};
            if (name !== undefined) update.name = name;
            if (icon !== undefined) update.icon = icon;
            if (isActive !== undefined) update.isActive = isActive;
            const account = await Account.findByIdAndUpdate(id, update, { new: true });
            return account;
        },
    },
};
