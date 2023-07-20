import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import { memberTypeByIdField } from '../types/memberType.js';

const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    memberType: memberTypeByIdField,
  },
});

const schema = new GraphQLSchema({
  query: RootQuery,
});

export default schema;
