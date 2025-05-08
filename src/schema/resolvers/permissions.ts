import { Permission } from "../../models/Permission.ts";

export const permissionResolvers = {
    Query: {
        permissions: async () => await Permission.find(),
        permission: async (_: any, { id }: { id: string }) => {
            const permission = await Permission.findById(id);
            if (!permission) throw new Error("Permission not found");
            return permission;
        },
    },

    Mutation: {
        createPermission: async (_: any, { name, key }: { name: string; key: string }) => {
            const permission = new Permission({ name, key });
            return await permission.save();
        },

        updatePermission: async (
            _: any,
            {
                id,
                name,
                key,
                isActive,
            }: { id: string; name?: string; key?: string; isActive?: boolean }
        ) => {
            const updated = await Permission.findByIdAndUpdate(
                id,
                {
                    ...(name && { name }),
                    ...(key && { key }),
                    ...(isActive !== undefined && { isActive }),
                },
                { new: true }
            );

            if (!updated) throw new Error("Permission not found or failed to update");
            return updated;
        },
    },
};
