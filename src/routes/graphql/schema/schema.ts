import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import { memberTypeByIdField, memberTypesField } from '../types/memberType.js';
import { postByIdField, postsField } from '../types/postType.js';
import { userByIdField, usersField } from '../types/userType.js';
import { profileByIdField, profilesField } from '../types/profileType.js';

const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    memberType: memberTypeByIdField,
    memberTypes: memberTypesField,
    post: postByIdField,
    posts: postsField,
    profile: profileByIdField,
    profiles: profilesField,
    user: userByIdField,
    users: usersField,
  },
});

const schema = new GraphQLSchema({
  query: RootQuery,
});

export default schema;
