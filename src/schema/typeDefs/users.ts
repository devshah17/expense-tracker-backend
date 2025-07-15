import { gql } from "graphql-tag";

export const userTypeDefs = gql`
  type Role {
    id: ID!
    name: String!
    key: String!
  }

  type Permission {
    id: ID!
    name: String!
    key: String!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    isActive: Boolean!
    roles: [Role!]!
    permissions: [Permission!]!
    familyId: String
    otp: String
    profileImage: String
  }

  type SignInResponse {
    success: Boolean!
    data: User
    message: String!
  }

  type OtpVerifyResponse {
    success: Boolean!
    data: UserWithToken
    message: String!
  }

  type UserWithToken {
    user: User
    token: String
  }

  extend type Query {
    users: [User!]!
    user(id: ID!): User
  }

  extend type Mutation {
    createUser(
      name: String!
      email: String!
      roleIds: [ID!]
      permissionIds: [ID!]
      isActive: Boolean
      profileImage: String
      familyId: ID
    ): User!

    updateUser(
      id: ID!
      name: String
      email: String
      roleIds: [ID!]
      permissionIds: [ID!]
      isActive: Boolean
      profileImage: String
      familyId: ID
    ): User!

    signIn(email: String!, otp: String!): SignInResponse!
    verifyOtp(email: String!, otp: String!): OtpVerifyResponse!
  }
`;
