import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import { memberTypeByIdField, memberTypesField } from '../types/memberType.js';
import { postsField } from '../types/postType.js';
import { usersField } from '../types/userType.js';

const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    users: usersField,
    posts: postsField,
    memberType: memberTypeByIdField,
    memberTypes: memberTypesField,
  },
});

const schema = new GraphQLSchema({
  query: RootQuery,
});

export default schema;
