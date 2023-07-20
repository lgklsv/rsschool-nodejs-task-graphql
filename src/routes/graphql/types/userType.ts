import { FastifyInstance } from 'fastify';
import {
  GraphQLFloat,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './uuid.js';

const UserType = new GraphQLObjectType({
  name: 'UserType',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  }),
});

const getUsersResolver = async (_parent, _args, fastify: FastifyInstance) => {
  return await fastify.prisma.memberType.findMany();
};

export const usersField = {
  type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
  resolve: getUsersResolver,
};
