/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { FastifyInstance } from 'fastify';
import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import { UUIDType } from './uuid.js';
import {
  MemberType,
  MemberTypeIdEnum,
  getMemberTypeByProfileIdResolver,
} from './memberType.js';
import { UserType, getUserByProfileIdResolver } from './userType.js';

export const ProfileType = new GraphQLObjectType({
  name: 'ProfileType',
  // @ts-ignore;
  fields: () => ({
    id: { type: UUIDType },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: UUIDType },
    user: { type: UserType, resolve: getUserByProfileIdResolver },
    memberTypeId: { type: MemberTypeIdEnum },
    memberType: { type: MemberType, resolve: getMemberTypeByProfileIdResolver },
  }),
});

// All Profiles
async function getProfilesResolver(_parent, _args, fastify: FastifyInstance) {
  return await fastify.prisma.profile.findMany();
}

export const profilesField = {
  type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ProfileType))),
  resolve: getProfilesResolver,
};

// Profiles By Id
async function getProfilesByIdResolver(
  _parent,
  args: { id: string },
  fastify: FastifyInstance,
) {
  const profile = await fastify.prisma.profile.findUnique({
    where: {
      id: args.id,
    },
  });
  return profile;
}

export async function getProfilesByUserIdResolver(
  parent: { id: string },
  _args,
  fastify: FastifyInstance,
) {
  const profile = await fastify.prisma.profile.findUnique({
    where: {
      userId: parent.id,
    },
  });
  return profile;
}

export const profileByIdField = {
  type: ProfileType,
  args: { id: { type: UUIDType } },
  resolve: getProfilesByIdResolver,
};
