import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import { memberTypeByIdField, memberTypesField } from '../types/memberType.js';

const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    memberType: memberTypeByIdField,
    memberTypes: memberTypesField,
  },
});

const schema = new GraphQLSchema({
  query: RootQuery,
});

export default schema;
