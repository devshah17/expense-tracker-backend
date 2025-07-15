import { gql } from "graphql-tag";

export const transferTypeDefs = gql`
  type Transfer {
    id: ID!
    fromAccountId: ID!
    toAccountId: ID!
    amount: Float!
    date: String
    notes: String
    userId: ID!
    isActive: Boolean!
    createdAt: String
    updatedAt: String
  }

  extend type Query {
    transferById(id: ID!): Transfer
    transfersByUser: [Transfer!]!
  }

  extend type Mutation {
    createTransfer(
      fromAccountId: ID!
      toAccountId: ID!
      amount: Float!
      date: String
      notes: String
    ): Transfer!
    updateTransfer(
      id: ID!
      fromAccountId: ID
      toAccountId: ID
      amount: Float
      date: String
      notes: String
      isActive: Boolean
    ): Transfer!
  }
`;
