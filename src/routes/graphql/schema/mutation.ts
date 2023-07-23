import { GraphQLObjectType } from 'graphql';
import { createUserField } from '../types/userType.js';

export const Mutation: GraphQLObjectType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createUser: createUserField,
  },
});
