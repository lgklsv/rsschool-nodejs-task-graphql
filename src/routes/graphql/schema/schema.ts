import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import { memberTypeByIdField, memberTypesField } from '../types/memberType.js';
import { postsField } from '../types/postType.js';
import { usersField } from '../types/userType.js';
import { profilesField } from '../types/profileType.js';

const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    memberType: memberTypeByIdField,
    memberTypes: memberTypesField,
    posts: postsField,
    profiles: profilesField,
    users: usersField,
  },
});

const schema = new GraphQLSchema({
  query: RootQuery,
});

export default schema;
