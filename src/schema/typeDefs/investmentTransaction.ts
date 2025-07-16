import { gql } from "graphql-tag";

export const investmentTransactionTypeDefs = gql`
  type InvestmentTransaction {
    id: ID!
    userId: ID!
    investmentId: ID!
    type: String!
    amount: Float!
    units: Float
    navOrPrice: Float
    date: String
    note: String
    linkedTransactionId: ID
    createdAt: String
    updatedAt: String
  }

  input CreateInvestmentTransactionInput {
    investmentId: ID!
    type: String!
    amount: Float!
    units: Float
    navOrPrice: Float
    date: String
    note: String
    linkedTransactionId: ID
  }

  input UpdateInvestmentTransactionInput {
    investmentId: ID
    type: String
    amount: Float
    units: Float
    navOrPrice: Float
    date: String
    note: String
    linkedTransactionId: ID
  }

  extend type Query {
    investmentTransactionsByUser(userId: ID!): [InvestmentTransaction!]!
    investmentTransactionById(id: ID!): InvestmentTransaction
  }

  extend type Mutation {
    createInvestmentTransaction(input: CreateInvestmentTransactionInput!): InvestmentTransaction!
    updateInvestmentTransaction(id: ID!, input: UpdateInvestmentTransactionInput!): InvestmentTransaction!
  }
`;
