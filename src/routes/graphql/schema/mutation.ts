import { GraphQLObjectType } from 'graphql';
import { createUserField, updateUserField } from '../types/userType.js';
import { createPostField, updatePostField } from '../types/postType.js';
import { createProfileField, updateProfileField } from '../types/profileType.js';

export const Mutation: GraphQLObjectType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createUser: createUserField,
    changeUser: updateUserField,

    createPost: createPostField,
    changePost: updatePostField,

    createProfile: createProfileField,
    changeProfile: updateProfileField,
  },
});
