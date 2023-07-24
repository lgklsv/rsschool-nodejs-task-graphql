import DataLoader from 'dataloader';
import {
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import { ContextType } from '../schema/context.js';
import { FastifyInstance } from 'fastify';

export type MemberTypeId = 'basic' | 'business';

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
async function getMemberTypesResolver(_parent, _args, ctx: ContextType) {
  return await ctx.fastify.prisma.memberType.findMany();
}

export const memberTypesField = {
  type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberType))),
  resolve: getMemberTypesResolver,
};

// Get Members By Id
async function getMemberTypeByIdResolver(
  _parent,
  args: { id: string },
  ctx: ContextType,
) {
  return await ctx.fastify.prisma.memberType.findUnique({
    where: {
      id: args.id,
    },
  });
}

export const memberTypeByIdField = {
  type: MemberType,
  args: { id: { type: MemberTypeIdEnum } },
  resolve: getMemberTypeByIdResolver,
};

// From parent resolvers
export async function getMemberTypeByProfileIdResolver(
  parent: { memberTypeId: MemberTypeId },
  _args,
  ctx: ContextType,
) {
  return await ctx.dataLoaders.memberType.load(parent.memberTypeId);
}

export interface IMemberType {
  id: MemberTypeId;
  discount: number;
  postsLimitPerMonth: number;
}

// Data loader
export function memberTypesDataLoader(fastify: FastifyInstance) {
  return new DataLoader(async (memberTypeIds: readonly string[]) => {
    const memberTypes = await fastify.prisma.memberType.findMany({
      where: {
        id: {
          in: memberTypeIds as string[],
        },
      },
    });

    const memberTypeIdsToMap: { [key: string]: IMemberType } = memberTypes.reduce(
      (mapping, memberType) => {
        mapping[memberType.id] = memberType;
        return mapping;
      },
      {},
    );
    return memberTypeIds.map((id) => memberTypeIdsToMap[id]);
  });
}
