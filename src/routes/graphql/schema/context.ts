import { FastifyInstance } from 'fastify';
import { DataLoadersType } from './dataLoaders.js';

export type ContextType = {
  fastify: FastifyInstance;
  dataLoaders: DataLoadersType;
};
