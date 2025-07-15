import { SubCategory } from '../../models/SubCategory.ts';
import { Category } from '../../models/Category.ts';
import mongoose from 'mongoose';
import { requireAuth } from '../../utils/middlewares/verifyToken.ts';

export const subCategoryResolvers = {
    Query: {
        subCategoriesByUserAndCategory: async (_: any, { categoryId }: { categoryId: string }, context: any) => {
            requireAuth(context);
            const userId = context.user._id;
            return SubCategory.find({
                categoryId: new mongoose.Types.ObjectId(categoryId),
                $or: [
                    { userId: new mongoose.Types.ObjectId(userId) },
                    { userId: { $exists: false } },
                    { userId: null }
                ]
            });
        },
        subCategoryById: async (_: any, { id }: { id: string }, context: any) => {
            requireAuth(context);
            const userId = context.user._id;
            const subCategory = await SubCategory.findOne({
                _id: id,
                $or: [
                    { userId: new mongoose.Types.ObjectId(userId) },
                    { userId: { $exists: false } },
                    { userId: null }
                ]
            });
            if (!subCategory) throw new Error('SubCategory not found or not accessible');
            return subCategory;
        },
    },
    Mutation: {
        createSubCategory: async (_: any, { name, icon, type, categoryId }: { name: string, icon?: string, type: string, categoryId: string }, context: any) => {
            requireAuth(context);
            const userId = context.user._id;
            const categoryExists = await Category.findById(categoryId);
            if (!categoryExists) {
                throw new Error('Category does not exist');
            }
            const existingPermanent = await SubCategory.findOne({ name, categoryId: new mongoose.Types.ObjectId(categoryId), userId: { $exists: false } });
            if (existingPermanent) {
                throw new Error('SubCategory name conflicts with a permanent subcategory');
            }
            const subCategory = new SubCategory({
                name,
                icon,
                type,
                categoryId: new mongoose.Types.ObjectId(categoryId),
                userId: new mongoose.Types.ObjectId(userId),
            });
            await subCategory.save();
            return subCategory;
        },
        updateSubCategory: async (_: any, { id, name, icon, isActive, type, categoryId }: { id: string, name?: string, icon?: string, isActive?: boolean, type?: string, categoryId?: string }, context: any) => {
            requireAuth(context);
            const userId = context.user._id;
            const subCategory = await SubCategory.findOne({ _id: id, userId: new mongoose.Types.ObjectId(userId) });
            if (!subCategory) throw new Error('SubCategory not found or not owned by user');
            if (categoryId && categoryId !== String(subCategory.categoryId)) {
                const categoryExists = await Category.findById(categoryId);
                if (!categoryExists) {
                    throw new Error('Category does not exist');
                }
                subCategory.categoryId = new mongoose.Types.ObjectId(categoryId) as any;
            }
            if (name) {
                const existingPermanent = await SubCategory.findOne({ name, categoryId: subCategory.categoryId, userId: { $exists: false } });
                if (existingPermanent) {
                    throw new Error('SubCategory name conflicts with a permanent subcategory');
                }
                subCategory.name = name;
            }
            if (icon !== undefined) subCategory.icon = icon;
            if (isActive !== undefined) subCategory.isActive = isActive;
            if (type !== undefined) subCategory.type = type as 'expense' | 'income';
            await subCategory.save();
            return subCategory;
        },
    },
};
