/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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

export const UserType = new GraphQLObjectType({
  name: 'UserType',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    profile: { type: ProfileType, resolve: getProfilesByUserIdResolver },
    posts: { type: new GraphQLList(PostsType), resolve: getPostsByUserIdResolver },
    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: subscribedToUserResolver,
    },
    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: userSubscribedToResolver,
    },
  }),
});

// All Users
async function getUsersResolver(_parent, _args, fastify: FastifyInstance) {
  return await fastify.prisma.user.findMany();
}

export const usersField = {
  type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
  resolve: getUsersResolver,
};

// Users By Id
async function getUsersByIdResolver(
  _parent,
  args: { id: string },
  fastify: FastifyInstance,
) {
  const user = await fastify.prisma.user.findUnique({
    where: {
      id: args.id,
    },
  });
  return user;
}

async function subscribedToUserResolver(
  parent: { id: string },
  _args,
  fastify: FastifyInstance,
) {
  return fastify.prisma.user.findMany({
    where: {
      userSubscribedTo: {
        some: {
          authorId: parent.id,
        },
      },
    },
  });
}

async function userSubscribedToResolver(
  parent: { id: string },
  _args,
  fastify: FastifyInstance,
) {
  return fastify.prisma.user.findMany({
    where: {
      subscribedToUser: {
        some: {
          subscriberId: parent.id,
        },
      },
    },
  });
}

export async function getUserByProfileIdResolver(
  parent: { userId: string },
  _args,
  fastify: FastifyInstance,
) {
  const user = await fastify.prisma.user.findUnique({
    where: {
      id: parent.userId,
    },
  });
  return user;
}

export const userByIdField = {
  type: UserType,
  args: { id: { type: UUIDType } },
  resolve: getUsersByIdResolver,
};
