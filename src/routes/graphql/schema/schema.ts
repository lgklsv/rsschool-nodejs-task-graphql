import { GraphQLSchema } from 'graphql';
import { RootQuery } from './query.js';
import { Mutation } from './mutation.js';

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

export default schema;
