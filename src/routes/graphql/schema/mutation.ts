import { GraphQLObjectType } from 'graphql';
import { createUserField, deleteUserField, updateUserField } from '../types/userType.js';
import { createPostField, deletePostField, updatePostField } from '../types/postType.js';
import {
  createProfileField,
  deleteProfileField,
  updateProfileField,
} from '../types/profileType.js';

export const Mutation: GraphQLObjectType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createUser: createUserField,
    changeUser: updateUserField,
    deleteUser: deleteUserField,

    createPost: createPostField,
    changePost: updatePostField,
    deletePost: deletePostField,

    createProfile: createProfileField,
    changeProfile: updateProfileField,
    deleteProfile: deleteProfileField,
  },
});
