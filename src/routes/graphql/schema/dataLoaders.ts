import { FastifyInstance } from 'fastify';
import { memberTypesDataLoader } from '../types/memberType.js';
import { postsDataLoader } from '../types/postType.js';
import { profileDataLoader } from '../types/profileType.js';
import { userDataLoader } from '../types/userType.js';

export const createDataLoaders = (fastify: FastifyInstance) => {
  return {
    memberType: memberTypesDataLoader(fastify),
    user: userDataLoader(fastify),
    post: postsDataLoader(fastify),
    profile: profileDataLoader(fastify),
  };
};

export type DataLoadersType = ReturnType<typeof createDataLoaders>;
