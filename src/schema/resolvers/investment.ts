import { Investment } from "../../models/Investment.ts";
import mongoose from "mongoose";
import { requireAuth } from "../../utils/middlewares/verifyToken.ts";

export const investmentResolvers = {
    Query: {
        investmentsByUser: async (_: any, { userId }: { userId: string }, context: any) => {
            requireAuth(context);
            return Investment.find({ userId: new mongoose.Types.ObjectId(userId) });
        },
        investmentById: async (_: any, { id }: { id: string }, context: any) => {
            requireAuth(context);
            return Investment.findById(id);
        },
    },
    Mutation: {
        createInvestment: async (_: any, { input }: any, context: any) => {
            requireAuth(context);
            const userId = context.user._id;
            const investment = new Investment({
                ...input,
                userId: new mongoose.Types.ObjectId(userId),
            });
            await investment.save();
            return investment;
        },
        updateInvestment: async (_: any, { id, input }: any, context: any) => {
            requireAuth(context);
            const investment = await Investment.findOne({ _id: id, userId: new mongoose.Types.ObjectId(context.user._id) });
            if (!investment) throw new Error("Investment not found or not owned by user");
            Object.keys(input).forEach(key => {
                if (input[key] !== undefined) {
                    investment[key] = input[key];
                }
            });
            await investment.save();
            return investment;
        },
    },
};
