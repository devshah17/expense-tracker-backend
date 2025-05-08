import { userResolvers } from "./users.ts";
import { roleResolvers } from "./roles.ts";
import { permissionResolvers } from "./permissions.ts";

export const resolvers = {
    Query: {
        ...userResolvers.Query,
        ...roleResolvers.Query,
        ...permissionResolvers.Query,
    },
    Mutation: {
        ...userResolvers.Mutation,
        ...roleResolvers.Mutation,
        ...permissionResolvers.Mutation,
    },
};
