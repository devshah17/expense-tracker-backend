import { InvestmentTransaction } from '../../models/InvestmentTransaction.ts';
import { Investment } from '../../models/Investment.ts';
import { Transaction } from '../../models/Transactions.ts';
import { Category } from '../../models/Category.ts';
import mongoose from 'mongoose';
import { requireAuth } from '../../utils/middlewares/verifyToken.ts';

// Helper to map investment transaction type to transaction type
function mapInvestmentTypeToTransactionType(type: string): 'expense' | 'income' {
    if (type === 'BUY' || type === 'TRANSFER_OUT') return 'expense';
    if (type === 'SELL' || type === 'DIVIDEND' || type === 'INTEREST' || type === 'TRANSFER_IN') return 'income';
    return 'expense'; // default fallback
}

export const investmentTransactionResolvers = {
    Query: {
        investmentTransactionsByUser: async (_: any, { userId }: { userId: string }, context: any) => {
            requireAuth(context);
            return InvestmentTransaction.find({ userId: new mongoose.Types.ObjectId(userId) });
        },
        investmentTransactionById: async (_: any, { id }: { id: string }, context: any) => {
            requireAuth(context);
            return InvestmentTransaction.findById(id);
        },
    },
    Mutation: {
        createInvestmentTransaction: async (_: any, { input }: any, context: any) => {
            requireAuth(context);
            const userId = new mongoose.Types.ObjectId(context.user._id);
            const date = input.date ? new Date(input.date) : undefined;

            // 1. Fetch the related investment to get accountId
            const investment = await Investment.findById(input.investmentId);
            if (!investment) throw new Error('Related investment not found');
            const accountId = investment.accountId;

            // 2. Find or create the permanent 'Investment' category
            let category = await Category.findOne({ name: 'Investment', userId: { $exists: false }, type: 'expense' });
            if (!category) {
                category = new Category({ name: 'Investment', type: 'expense' });
                await category.save();
            }

            // 3. Map type
            const transactionType = mapInvestmentTypeToTransactionType(input.type);

            // 4. Create the linked Transaction
            const transaction = new Transaction({
                amount: input.amount,
                type: transactionType,
                date,
                notes: input.note,
                accountId,
                categoryId: category._id,
                userId,
                investmentTransactionId: undefined, // will set after investmentTransaction is created
            });
            await transaction.save();

            // 5. Create the InvestmentTransaction, linking the transaction
            const investmentTransaction = new InvestmentTransaction({
                ...input,
                userId,
                date,
                linkedTransactionId: transaction._id,
            });
            await investmentTransaction.save();

            await Transaction.findByIdAndUpdate(
                transaction._id,
                { investmentTransactionId: investmentTransaction._id },
            );

            return investmentTransaction;
        },
        updateInvestmentTransaction: async (_: any, { id, input }: any, context: any) => {
            requireAuth(context);
            if (input.date) input.date = new Date(input.date);
            const investmentTransaction = await InvestmentTransaction.findByIdAndUpdate(
                id,
                { $set: input },
                { new: true }
            );
            return investmentTransaction;
        },
    },
};
