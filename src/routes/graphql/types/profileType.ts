import { FastifyInstance } from 'fastify';
import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { MemberTypeIdEnum } from './memberType.js';

const ProfileType = new GraphQLObjectType({
  name: 'ProfileType',
  fields: () => ({
    id: { type: UUIDType },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: UUIDType },
    memberTypeId: { type: MemberTypeIdEnum },
  }),
});

// All Profiles
const getProfilesResolver = async (_parent, _args, fastify: FastifyInstance) => {
  return await fastify.prisma.profile.findMany();
};

export const profilesField = {
  type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ProfileType))),
  resolve: getProfilesResolver,
};

// Profiles By Id
const getProfilesByIdResolver = async (
  _parent,
  args: { id: string },
  fastify: FastifyInstance,
) => {
  const profile = await fastify.prisma.profile.findUnique({
    where: {
      id: args.id,
    },
  });
  return profile;
};

export const profileByIdField = {
  type: ProfileType,
  args: { id: { type: UUIDType } },
  resolve: getProfilesByIdResolver,
};
