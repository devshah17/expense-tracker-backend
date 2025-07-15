import { gql } from "graphql-tag";

export const transactionTypeDefs = gql`
  type Transaction {
    id: ID!
    amount: Float!
    type: String!
    date: String!
    notes: String
    account: Account!
    category: Category!
    subCategory: SubCategory
    icon: String
    isActive: Boolean!
    user: User!
    createdAt: String
    updatedAt: String
  }

  input CreateTransactionInput {
    amount: Float!
    type: String!
    date: String
    notes: String
    accountId: ID!
    categoryId: ID!
    subCategoryId: ID
    icon: String
    isActive: Boolean
  }

  input UpdateTransactionInput {
    amount: Float
    type: String
    date: String
    notes: String
    accountId: ID
    categoryId: ID
    subCategoryId: ID
    icon: String
    isActive: Boolean
  }

  extend type Query {
    transactionsByUser(userId: ID!): [Transaction!]!
    transactionById(id: ID!): Transaction
  }

  extend type Mutation {
    createTransaction(input: CreateTransactionInput!): Transaction!
    updateTransaction(id: ID!, input: UpdateTransactionInput!): Transaction!
  }
`;
