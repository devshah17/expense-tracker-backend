import { userResolvers } from "./users.ts";
import { roleResolvers } from "./roles.ts";
import { permissionResolvers } from "./permissions.ts";
import { accountResolvers } from "./account.ts";
import { categoryResolvers } from "./category.ts";
import { subCategoryResolvers } from "./subCategory.ts";
import { transferResolvers } from "./transfer.ts";
import { oweResolvers } from "./owe.ts";
import { budgetResolvers } from "./budget.ts";
import { transactionResolvers } from "./transactions.ts";

export const resolvers = {
    Query: {
        ...budgetResolvers.Query,
        ...userResolvers.Query,
        ...roleResolvers.Query,
        ...permissionResolvers.Query,
        ...accountResolvers.Query,
        ...categoryResolvers.Query,
        ...subCategoryResolvers.Query,
        ...transferResolvers.Query,
        ...oweResolvers.Query,
        ...transactionResolvers.Query,
    },
    Mutation: {
        ...budgetResolvers.Mutation,
        ...userResolvers.Mutation,
        ...roleResolvers.Mutation,
        ...permissionResolvers.Mutation,
        ...accountResolvers.Mutation,
        ...categoryResolvers.Mutation,
        ...subCategoryResolvers.Mutation,
        ...transferResolvers.Mutation,
        ...oweResolvers.Mutation,
        ...transactionResolvers.Mutation,
    },
};
