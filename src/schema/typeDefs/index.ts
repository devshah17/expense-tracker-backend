import { gql } from "graphql-tag";
import { userTypeDefs } from "./users.ts";
import { roleTypeDefs } from "./roles.ts";
import { permissionTypeDefs } from "./permissions.ts";
import { accountTypeDefs } from "./account.ts";
import { transferTypeDefs } from "./transfer.ts";
import { oweTypeDefs } from "./owe.ts";
import { categoryTypeDefs } from "./category.ts";
import { subCategoryTypeDefs } from "./subCategory.ts";
import { budgetTypeDefs } from "./budget.ts";
import { transactionTypeDefs } from "./transactions.ts";
import { investmentTypeDefs } from "./investment.ts";
import { investmentTransactionTypeDefs } from "./investmentTransaction.ts";

export const baseTypeDefs = gql`
  type Query
  type Mutation
`;

export const typeDefs = [
  baseTypeDefs,
  budgetTypeDefs,
  userTypeDefs,
  roleTypeDefs,
  permissionTypeDefs,
  accountTypeDefs,
  categoryTypeDefs,
  subCategoryTypeDefs,
  transferTypeDefs,
  oweTypeDefs,
  transactionTypeDefs,
  investmentTypeDefs,
  investmentTransactionTypeDefs,
];
