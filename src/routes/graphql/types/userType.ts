/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { FastifyInstance } from 'fastify';
import {
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { ProfileType, getProfilesByUserIdResolver } from './profileType.js';
import { PostsType, getPostsByUserIdResolver } from './postType.js';

export const UserType: GraphQLObjectType = new GraphQLObjectType({
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
  return await fastify.prisma.user.findUnique({
    where: {
      id: args.id,
    },
  });
}

export const userByIdField = {
  type: UserType,
  args: { id: { type: UUIDType } },
  resolve: getUsersByIdResolver,
};

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
  return await fastify.prisma.user.findUnique({
    where: {
      id: parent.userId,
    },
  });
}

// Mutations (create)
async function createUserResolver(
  _parent,
  args: { dto: { name: string; balance: number } },
  fastify: FastifyInstance,
) {
  return fastify.prisma.user.create({
    data: args.dto,
  });
}

const CreateUserArgs = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  }),
});

export const createUserField = {
  type: UserType,
  args: {
    dto: {
      type: new GraphQLNonNull(CreateUserArgs),
    },
  },
  resolve: createUserResolver,
};

// Mutations (update)
async function updateUserResolver(
  _parent,
  args: { id: string; dto: { name?: string; balance?: number } },
  fastify: FastifyInstance,
) {
  return fastify.prisma.user.update({
    where: { id: args.id },
    data: args.dto,
  });
}

const UpdateUserArgs = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: () => ({
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  }),
});

export const updateUserField = {
  type: UserType,
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
    dto: {
      type: new GraphQLNonNull(UpdateUserArgs),
    },
  },
  resolve: updateUserResolver,
};
