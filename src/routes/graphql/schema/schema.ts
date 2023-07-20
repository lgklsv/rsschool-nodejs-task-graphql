import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import { memberTypeByIdField, memberTypesField } from '../types/memberType.js';
import { postsField } from '../types/postsType.js';

const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    posts: postsField,
    memberType: memberTypeByIdField,
    memberTypes: memberTypesField,
  },
});

const schema = new GraphQLSchema({
  query: RootQuery,
});

export default schema;
