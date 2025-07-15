export const categoryTypeDefs = `
  type Category {
    id: ID!
    name: String!
    icon: String
    isActive: Boolean
    type: String!
    userId: ID
    createdAt: String
    updatedAt: String
  }

  type Query {
    categoriesByUser: [Category!]!
    categoryById(id: ID!): Category
  }

  type Mutation {
    createCategory(name: String!, icon: String, type: String!): Category!
    updateCategory(id: ID!, name: String, icon: String, isActive: Boolean, type: String): Category!
  }
`;
