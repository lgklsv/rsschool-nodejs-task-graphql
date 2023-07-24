import { GraphQLObjectType } from 'graphql';
import { memberTypeByIdField, memberTypesField } from '../types/memberType.js';
import { postByIdField, postsField } from '../types/postType.js';
import { userByIdField, usersField } from '../types/userType.js';
import { profileByIdField, profilesField } from '../types/profileType.js';

export const RootQuery: GraphQLObjectType = new GraphQLObjectType({
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
