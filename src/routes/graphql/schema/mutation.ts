import { GraphQLObjectType } from 'graphql';
import { createUserField } from '../types/userType.js';
import { createPostField } from '../types/postType.js';

export const Mutation: GraphQLObjectType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createUser: createUserField,
    createPost: createPostField,
  },
});
