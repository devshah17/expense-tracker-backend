export const subCategoryTypeDefs = `
  type SubCategory {
    id: ID!
    name: String!
    icon: String
    isActive: Boolean
    type: String!
    userId: ID
    categoryId: ID!
    createdAt: String
    updatedAt: String
  }

  extend type Query {
    subCategoriesByUserAndCategory(categoryId: ID!): [SubCategory!]!
    subCategoryById(id: ID!): SubCategory
  }

  extend type Mutation {
    createSubCategory(name: String!, icon: String, type: String!, categoryId: ID!): SubCategory!
    updateSubCategory(id: ID!, name: String, icon: String, isActive: Boolean, type: String): SubCategory!
  }
`;
