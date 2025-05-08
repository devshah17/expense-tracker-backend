import { User } from "../../models/User.ts";
import { Role } from "../../models/Role.ts";
import { Permission } from "../../models/Permission.ts";
import mongoose from 'mongoose';

export const userResolvers = {
    Query: {
        users: async () => await User.find().populate('roles').populate('permissions'),
        user: async (_: any, { id }: { id: string }) => {
            const user = await User.findById(id).populate('roles').populate('permissions');
            if (!user) throw new Error("User not found");
            return user;
        },
    },

    User: {
        id: (parent: any) => parent._id.toString(),
        familyId: (parent: any) => parent.familyId ? parent.familyId.toString() : null,
        roles: (parent: any) => {
            if (!parent.roles) return [];
            return parent.roles.map((role: any) => ({
                ...role.toObject(),
                id: role._id.toString()
            }));
        },
        permissions: (parent: any) => {
            if (!parent.permissions) return [];
            return parent.permissions.map((permission: any) => ({
                ...permission.toObject(),
                id: permission._id.toString()
            }));
        }
    },

    Role: {
        id: (parent: any) => parent._id.toString()
    },

    Permission: {
        id: (parent: any) => parent._id.toString()
    },

    Mutation: {
        createUser: async (
            _: any,
            { name, email, roleIds, permissionIds, isActive, profileImage, familyId }: {
                name: string,
                email: string,
                roleIds?: string[],
                permissionIds?: string[],
                isActive?: boolean,
                profileImage?: string,
                familyId?: string
            }
        ) => {
            let validRoles: any[] = [];
            if (roleIds && roleIds.length > 0) {
                validRoles = await Role.find({ _id: { $in: roleIds } });
                if (validRoles.length !== roleIds.length) {
                    throw new Error("One or more roles are invalid.");
                }
            }

            let validPermissions: any[] = [];
            if (permissionIds && permissionIds.length > 0) {
                validPermissions = await Permission.find({ _id: { $in: permissionIds } });
                if (validPermissions.length !== permissionIds.length) {
                    throw new Error("One or more permissions are invalid.");
                }
            }

            const user = new User({
                name,
                email,
                roles: validRoles.length > 0 ? validRoles.map(role => role._id) : [],
                permissions: validPermissions.length > 0 ? validPermissions.map(permission => permission._id) : [],
                isActive: isActive ?? true,
                profileImage: profileImage || "",
                familyId: familyId ? new mongoose.Types.ObjectId(familyId) : null
            });

            await user.save();

            const populatedUser = await User.findById(user._id)
                .populate('roles')
                .populate('permissions');

            if (!populatedUser) throw new Error("Failed to retrieve created user");

            return populatedUser;
        },

        updateUser: async (
            _: any,
            { id, name, email, roleIds, permissionIds, isActive, profileImage, familyId }: {
                id: string,
                name?: string,
                email?: string,
                roleIds?: string[],
                permissionIds?: string[],
                isActive?: boolean,
                profileImage?: string,
                familyId?: string
            }
        ) => {
            const user = await User.findById(id);
            if (!user) throw new Error("User not found");

            if (roleIds) {
                const validRoles = await Role.find({ _id: { $in: roleIds } });
                if (validRoles.length !== roleIds.length) {
                    throw new Error("One or more roles are invalid.");
                }
                user.roles = validRoles.map(role => role._id);
            }

            if (permissionIds) {
                const validPermissions = await Permission.find({ _id: { $in: permissionIds } });
                if (validPermissions.length !== permissionIds.length) {
                    throw new Error("One or more permissions are invalid.");
                }
                user.permissions = validPermissions.map(permission => permission._id);
            }

            if (name) user.name = name;
            if (email) user.email = email;
            if (isActive !== undefined) user.isActive = isActive;
            if (profileImage !== undefined) user.profileImage = profileImage;
            if (familyId !== undefined) user.familyId = new mongoose.Types.ObjectId(familyId);

            await user.save();
            return user;
        },
    },
};
