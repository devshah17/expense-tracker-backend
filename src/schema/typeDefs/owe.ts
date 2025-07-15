import { gql } from "graphql-tag";

export const oweTypeDefs = gql`
  type Owe {
    id: ID!
    fromUserId: ID
    toUserId: ID
    fromName: String
    toName: String
    amount: Float!
    currency: String
    status: String
    relatedTransactionId: ID
    notes: String
    createdBy: ID!
    isActive: Boolean
    createdAt: String
    updatedAt: String
  }

  extend type Query {
    oweById(id: ID!): Owe
    owesByUser: [Owe!]!
  }

  extend type Mutation {
    createOwe(
      fromUserId: ID
      toUserId: ID
      fromName: String
      toName: String
      amount: Float!
      currency: String
      status: String
      relatedTransactionId: ID
      notes: String
      isActive: Boolean
    ): Owe!
    updateOwe(
      id: ID!
      fromUserId: ID
      toUserId: ID
      fromName: String
      toName: String
      amount: Float
      currency: String
      status: String
      relatedTransactionId: ID
      notes: String
      isActive: Boolean
    ): Owe!
  }
`;
