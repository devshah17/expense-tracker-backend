import jwt from 'jsonwebtoken';
import { User } from '../../models/User.ts';

export async function verifyAndFetchUser(token: string) {
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as { userId: string };
        const user = await User.findById(payload.userId).populate('roles').populate('permissions');
        if (!user) {
            return {
                status: 401,
                logIn: false,
                message: 'User not found',
                user: null
            };
        }
        if (!user.isActive) {
            return {
                status: 401,
                logIn: false,
                message: 'User is not active',
                user: null
            };
        }
        return {
            status: 200,
            logIn: true,
            message: 'Authenticated',
            user
        };
    } catch (err: any) {
        return {
            status: 401,
            logIn: false,
            message: err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token',
            user: null
        };
    }
}

export function checkPermission(user: any, requiredPermission: string): boolean {
    if (!user || !user.permissions) return false;
    return user.permissions.some((perm: any) => {
        if (typeof perm === 'string') return perm === requiredPermission;
        return perm.name === requiredPermission || perm._id?.toString() === requiredPermission;
    });
}

export function requireAuth(context: any) {
    if (!context.user || !context.user._id) {
        throw new Error("Authentication required");
    }
}
