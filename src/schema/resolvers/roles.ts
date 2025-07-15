import mongoose from "mongoose";
import { Permission } from "../../models/Permission.ts";
import { Role } from "../../models/Role.ts";
import { requireAuth } from "../../utils/middlewares/verifyToken.ts";

export const roleResolvers = {
    Query: {
        roles: async (_: any, __: any, context: any) => {
            requireAuth(context);
            return Role.find().populate("permissions");
        },
        role: async (_: any, { id }: { id: string }, context: any) => {
            requireAuth(context);
            const role = await Role.findById(id).populate("permissions");
            if (!role) throw new Error("Role not found");
            return role;
        },
    },
    Mutation: {
        createRole: async (
            _: any,
            { name, key, permissionIds }: { name: string; key: string; permissionIds: string[] },
            context: any
        ) => {
            requireAuth(context);
            const existingPermissions = await Permission.find({
                _id: { $in: permissionIds },
            });

            if (existingPermissions.length !== permissionIds.length) {
                throw new Error("Some permission IDs are invalid.");
            }

            const role = new Role({
                name,
                key,
                permissions: permissionIds,
            });

            const savedRole = await role.save();
            return await Role.findById(savedRole._id).populate("permissions");
        },
        updateRole: async (
            _: any,
            {
                id,
                name,
                key,
                isActive,
                permissionIds,
            }: {
                id: string;
                name?: string;
                key?: string;
                isActive?: boolean;
                permissionIds?: string[];
            },
            context: any
        ) => {
            requireAuth(context);
            if (permissionIds) {
                const validPermissions = await Permission.find({
                    _id: { $in: permissionIds.map(pid => new mongoose.Types.ObjectId(pid)) },
                });

                if (validPermissions.length !== permissionIds.length) {
                    throw new Error("Some permission IDs are invalid.");
                }
            }

            const updatedRole = await Role.findByIdAndUpdate(
                id,
                {
                    ...(name && { name }),
                    ...(key && { key }),
                    ...(isActive !== undefined && { isActive }),
                    ...(permissionIds && { permissions: permissionIds }),
                },
                { new: true }
            ).populate("permissions");

            if (!updatedRole) {
                throw new Error("Role not found or failed to update");
            }

            return updatedRole;
        },
    },
};
