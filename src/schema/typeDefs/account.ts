import { gql } from "graphql-tag";

export const accountTypeDefs = gql`
  type Account {
    id: ID!
    name: String!
    icon: String
    isActive: Boolean!
    userId: ID
    createdAt: String
    updatedAt: String
  }

  extend type Query {
    accountsByUser(userId: ID!): [Account!]!
    account(id: ID!): Account
  }

  extend type Mutation {
    createAccount(name: String!, icon: String, userId: ID): Account!
    updateAccount(id: ID!, name: String, icon: String, isActive: Boolean): Account!
  }
`;
