import { Category } from '../../models/Category.ts';
import mongoose from 'mongoose';
import { requireAuth } from '../../utils/middlewares/verifyToken.ts';

export const categoryResolvers = {
    Query: {
        categoriesByUser: async (_: any, __: any, context: any) => {
            requireAuth(context);
            const userId = context.user._id;
            return Category.find({
                $or: [
                    { userId: new mongoose.Types.ObjectId(userId) },
                    { userId: { $exists: false } },
                    { userId: null }
                ]
            });
        },
        categoryById: async (_: any, { id }: { id: string }, context: any) => {
            requireAuth(context);
            const userId = context.user._id;
            const category = await Category.findOne({
                _id: id,
                $or: [
                    { userId: new mongoose.Types.ObjectId(userId) },
                    { userId: { $exists: false } },
                    { userId: null }
                ]
            });
            if (!category) throw new Error('Category not found or not accessible');
            return category;
        },
    },
    Mutation: {
        createCategory: async (_: any, { name, icon, type }: { name: string, icon?: string, type: string }, context: any) => {
            requireAuth(context);
            const userId = context.user._id;
            const existingPermanent = await Category.findOne({ name, userId: { $exists: false } });
            if (existingPermanent) {
                throw new Error('Category name conflicts with a permanent category');
            }
            const category = new Category({
                name,
                icon,
                type,
                userId: new mongoose.Types.ObjectId(userId),
            });
            await category.save();
            return category;
        },
        updateCategory: async (_: any, { id, name, icon, isActive, type }: { id: string, name?: string, icon?: string, isActive?: boolean, type?: string }, context: any) => {
            requireAuth(context);
            const userId = context.user._id;
            const category = await Category.findOne({ _id: id, userId: new mongoose.Types.ObjectId(userId) });
            if (!category) throw new Error('Category not found or not owned by user');
            if (name) {
                const existingPermanent = await Category.findOne({ name, userId: { $exists: false } });
                if (existingPermanent) {
                    throw new Error('Category name conflicts with a permanent category');
                }
                category.name = name;
            }
            if (icon !== undefined) category.icon = icon;
            if (isActive !== undefined) category.isActive = isActive;
            if (type !== undefined) category.type = type as "expense" | "income";
            await category.save();
            return category;
        },
    },
};
