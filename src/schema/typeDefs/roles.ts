import { gql } from "graphql-tag";

export const roleTypeDefs = gql`
  type Role {
    id: ID!
    name: String!
    key: String!
    isActive: Boolean!
    permissions: [Permission!]!
  }

  extend type Query {
    roles: [Role!]!
    role(id: ID!): Role
  }

  extend type Mutation {
    createRole(name: String!, key: String!, permissionIds: [ID!]!): Role!
    updateRole(
      id: ID!
      name: String
      key: String
      isActive: Boolean
      permissionIds: [ID!]
    ): Role!
  }
`;
