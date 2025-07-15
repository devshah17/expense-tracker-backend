import { gql } from "graphql-tag";

export const budgetTypeDefs = gql`
  type Budget {
    id: ID!
    name: String!
    amount: Float!
    spent: Float!
    userId: ID!
    categoryId: ID
    subCategoryId: ID
    accountId: ID
    type: String!
    startDate: String!
    endDate: String!
    alertThreshold: Float
    isActive: Boolean!
    createdAt: String
    updatedAt: String
  }

  input CreateBudgetInput {
    name: String!
    amount: Float!
    spent: Float
    categoryId: ID
    subCategoryId: ID
    accountId: ID
    type: String
    startDate: String!
    endDate: String!
    alertThreshold: Float
    isActive: Boolean
  }

  input UpdateBudgetInput {
    name: String
    amount: Float
    spent: Float
    categoryId: ID
    subCategoryId: ID
    accountId: ID
    type: String
    startDate: String
    endDate: String
    alertThreshold: Float
    isActive: Boolean
  }

  extend type Query {
    budgetsByUser: [Budget!]!
    budgetById(id: ID!): Budget
  }

  extend type Mutation {
    createBudget(
      name: String!
      amount: Float!
      spent: Float
      categoryId: ID
      subCategoryId: ID
      accountId: ID
      type: String
      startDate: String!
      endDate: String!
      alertThreshold: Float
      isActive: Boolean
    ): Budget!
    updateBudget(
      id: ID!
      name: String
      amount: Float
      spent: Float
      categoryId: ID
      subCategoryId: ID
      accountId: ID
      type: String
      startDate: String
      endDate: String
      alertThreshold: Float
      isActive: Boolean
    ): Budget!
  }
`;
