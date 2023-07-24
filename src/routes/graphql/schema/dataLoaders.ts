import { FastifyInstance } from 'fastify';
import { memberTypesDataLoader } from '../types/memberType.js';
import { postsDataLoader } from '../types/postType.js';

export const createDataLoaders = (fastify: FastifyInstance) => {
  return {
    memberType: memberTypesDataLoader(fastify),
    // user: userDataLoader(fastify),
    post: postsDataLoader(fastify),
    // profile: profileDataLoader(fastify),
  };
};

export type DataLoadersType = ReturnType<typeof createDataLoaders>;
