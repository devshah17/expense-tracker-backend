import { gql } from "graphql-tag";

export const investmentTypeDefs = gql`
  type Investment {
    id: ID!
    userId: ID!
    name: String!
    type: String!
    accountId: ID!
    units: Float
    avgBuyPrice: Float
    totalAmountInvested: Float
    currentNAV: Float
    externalKey: String
    targetAmount: Float
    targetDate: String
    isArchived: Boolean
    createdAt: String
    updatedAt: String
  }

  input CreateInvestmentInput {
    name: String!
    type: String!
    accountId: ID!
    units: Float
    avgBuyPrice: Float
    totalAmountInvested: Float
    currentNAV: Float
    externalKey: String
    targetAmount: Float
    targetDate: String
    isArchived: Boolean
  }

  input UpdateInvestmentInput {
    name: String
    type: String
    accountId: ID
    units: Float
    avgBuyPrice: Float
    totalAmountInvested: Float
    currentNAV: Float
    externalKey: String
    targetAmount: Float
    targetDate: String
    isArchived: Boolean
  }

  extend type Query {
    investmentsByUser(userId: ID!): [Investment!]!
    investmentById(id: ID!): Investment
  }

  extend type Mutation {
    createInvestment(input: CreateInvestmentInput!): Investment!
    updateInvestment(id: ID!, input: UpdateInvestmentInput!): Investment!
  }
`;
