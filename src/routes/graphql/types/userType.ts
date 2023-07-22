import { FastifyInstance } from 'fastify';
import {
  GraphQLFloat,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { ProfileType, getProfilesByUserIdResolver } from './profileType.js';
import { PostsType, getPostsByUserIdResolver } from './postType.js';

const UserType = new GraphQLObjectType({
  name: 'UserType',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    profile: { type: ProfileType, resolve: getProfilesByUserIdResolver },
    posts: { type: new GraphQLList(PostsType), resolve: getPostsByUserIdResolver },
  }),
});

// All Users
const getUsersResolver = async (_parent, _args, fastify: FastifyInstance) => {
  return await fastify.prisma.user.findMany();
};

export const usersField = {
  type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
  resolve: getUsersResolver,
};

// Users By Id
const getUsersByIdResolver = async (
  _parent,
  args: { id: string },
  fastify: FastifyInstance,
) => {
  const user = await fastify.prisma.user.findUnique({
    where: {
      id: args.id,
    },
  });
  return user;
};

export const userByIdField = {
  type: UserType,
  args: { id: { type: UUIDType } },
  resolve: getUsersByIdResolver,
};
