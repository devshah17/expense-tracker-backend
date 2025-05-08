import { gql } from "graphql-tag";
import { userTypeDefs } from "./users.ts";
import { roleTypeDefs } from "./roles.ts";
import { permissionTypeDefs } from "./permissions.ts";

export const baseTypeDefs = gql`
  type Query
  type Mutation
`;

export const typeDefs = [
  baseTypeDefs,
  userTypeDefs,
  roleTypeDefs,
  permissionTypeDefs,
];
