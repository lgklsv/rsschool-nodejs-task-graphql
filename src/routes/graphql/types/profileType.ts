/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { FastifyInstance } from 'fastify';
import {
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import { UUIDType } from './uuid.js';
import {
  MemberType,
  MemberTypeId,
  MemberTypeIdEnum,
  getMemberTypeByProfileIdResolver,
} from './memberType.js';
import { UserType, getUserByProfileIdResolver } from './userType.js';

export const ProfileType: GraphQLObjectType = new GraphQLObjectType({
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
  return await fastify.prisma.profile.findUnique({
    where: {
      id: args.id,
    },
  });
}

export async function getProfilesByUserIdResolver(
  parent: { id: string },
  _args,
  fastify: FastifyInstance,
) {
  return await fastify.prisma.profile.findUnique({
    where: {
      userId: parent.id,
    },
  });
}

// Mutations(create)
const CreateProfileArgs = new GraphQLInputObjectType({
  name: 'CreateProfileArgs',
  fields: () => ({
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberTypeId: { type: new GraphQLNonNull(MemberTypeIdEnum) },
  }),
});

async function createProfileResolver(
  _parent,
  args: {
    dto: {
      isMale: boolean;
      yearOfBirth: number;
      userId: string;
      memberTypeId: MemberTypeId;
    };
  },
  fastify: FastifyInstance,
) {
  return fastify.prisma.profile.create({
    data: args.dto,
  });
}

export const createProfileField = {
  type: ProfileType,
  args: {
    dto: {
      type: new GraphQLNonNull(CreateProfileArgs),
    },
  },
  resolve: createProfileResolver,
};

export const profileByIdField = {
  type: ProfileType,
  args: { id: { type: UUIDType } },
  resolve: getProfilesByIdResolver,
};
