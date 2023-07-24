import { FastifyInstance } from 'fastify';
import { memberTypesDataLoader } from '../types/memberType.js';

export const createDataLoaders = (fastify: FastifyInstance) => {
  return {
    memberType: memberTypesDataLoader(fastify),
    // user: userDataLoader(fastify),
    // post: postDataLoader(fastify),
    // profile: profileDataLoader(fastify),
  };
};

export type DataLoadersType = ReturnType<typeof createDataLoaders>;
