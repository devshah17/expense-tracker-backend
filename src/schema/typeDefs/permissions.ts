import { gql } from "graphql-tag";

export const permissionTypeDefs = gql`
  type Permission {
    id: ID!
    name: String!
    key: String!
    isActive: Boolean!
  }

  extend type Query {
    permissions: [Permission!]!
    permission(id: ID!): Permission
  }

  extend type Mutation {
    createPermission(name: String!, key: String!): Permission!
    updatePermission(id: ID!, name: String, key: String, isActive: Boolean): Permission!
  }
`;
