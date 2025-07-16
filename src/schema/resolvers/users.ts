import { User } from "../../models/User.ts";
import { Role } from "../../models/Role.ts";
import { Permission } from "../../models/Permission.ts";
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { checkPermission } from '../../utils/middlewares/verifyToken.ts';
import { sendMail } from '../../utils/mailer/sendMail.ts';
import { OTP_EMAIL_TEMPLATE } from '../../utils/constants/email.ts';

export const userResolvers = {
    Query: {
        users: async (_: any, __: any, context: any) => {
            if (context.authError) {
                return {
                    success: false,
                    data: null,
                    message: context.authError.message,
                    logIn: context.authError.logIn,
                    status: context.authError.status
                };
            }
            if (!context.user) {
                return {
                    success: false,
                    data: null,
                    message: 'Not authenticated',
                    logIn: false,
                    status: 401
                };
            }
            if (!checkPermission(context.user, 'view_users')) {
                return {
                    success: false,
                    data: null,
                    message: 'Not authorized',
                    logIn: true,
                    status: 403
                };
            }
            const users = await User.find().populate('roles').populate('permissions');
            return {
                success: true,
                data: users,
                message: 'Users fetched successfully',
                logIn: true,
                status: 200
            };
        },
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

        signIn: async (_: any, { email }: { email: string }) => {
            const user = await User.findOne({ email });
            if (!user) {
                return {
                    success: false,
                    data: null,
                    message: "User not found!",
                    status: 404
                };
            }
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            user.otp = otp;
            await user.save();

            // Send OTP email with CSS design
            const subject = 'Your OTP Code for Login';
            const body = OTP_EMAIL_TEMPLATE({ name: user.name, email: user.email, otp });
            try {
                await sendMail({ subject, body, to: user.email, consoleMessage: `OTP mail sent to ${user.email}` });
            } catch (e) {
                // Optionally log or handle mail sending error
                console.error('Failed to send OTP email:', e);
            }

            return {
                success: true,
                data: user,
                message: "User found! OTP sent to email.",
                status: 200
            };
        },

        verifyOtp: async (_: any, { email, otp }: { email: string, otp: string }) => {
            const user = await User.findOne({ email });
            if (!user) {
                return {
                    success: false,
                    data: null,
                    message: "User not found!"
                };
            }
            if (user.otp !== otp) {
                return {
                    success: false,
                    data: null,
                    message: "Invalid OTP!"
                };
            }
            const token = jwt.sign(
                { userId: user._id, email: user.email },
                process.env.JWT_SECRET || 'default_secret',
                { expiresIn: '30d' }
            );
            user.otp = undefined;
            await user.save();
            return {
                success: true,
                data: {
                    user,
                    token
                },
                message: "OTP verified successfully!"
            };
        }
    },
};
