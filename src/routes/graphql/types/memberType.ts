import { FastifyInstance } from 'fastify';
import {
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';

type MemberTypeId = 'basic' | 'business';

export const MemberTypeIdEnum = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    basic: {
      value: 'basic',
    },
    business: {
      value: 'business',
    },
  },
});

export const MemberType = new GraphQLObjectType({
  name: 'MemberType',
  fields: () => ({
    id: { type: MemberTypeIdEnum },
    discount: { type: GraphQLFloat },
    postsLimitPerMonth: { type: GraphQLInt },
  }),
});

// All members
async function getMemberTypesResolver(_parent, _args, fastify: FastifyInstance) {
  return await fastify.prisma.memberType.findMany();
}

export const memberTypesField = {
  type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberType))),
  resolve: getMemberTypesResolver,
};

// Get Members By Id
async function getMemberTypeByIdResolver(
  _parent,
  args: { id: string },
  fastify: FastifyInstance,
) {
  const memberType = await fastify.prisma.memberType.findUnique({
    where: {
      id: args.id,
    },
  });
  return memberType;
}

export async function getMemberTypeByProfileIdResolver(
  parent: { memberTypeId: MemberTypeId },
  _args,
  fastify: FastifyInstance,
) {
  const memberType = await fastify.prisma.memberType.findUnique({
    where: {
      id: parent.memberTypeId,
    },
  });
  return memberType;
}

export const memberTypeByIdField = {
  type: MemberType,
  args: { id: { type: MemberTypeIdEnum } },
  resolve: getMemberTypeByIdResolver,
};
