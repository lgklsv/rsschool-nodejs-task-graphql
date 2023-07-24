import { FastifyInstance } from 'fastify';
import DataLoader from 'dataloader';
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
import { ContextType } from '../schema/context.js';

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
async function getProfilesResolver(_parent, _args, ctx: ContextType) {
  return await ctx.fastify.prisma.profile.findMany();
}

export const profilesField = {
  type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ProfileType))),
  resolve: getProfilesResolver,
};

// Profiles By Id
async function getProfilesByIdResolver(_parent, args: { id: string }, ctx: ContextType) {
  return await ctx.fastify.prisma.profile.findUnique({
    where: {
      id: args.id,
    },
  });
}

export const profileByIdField = {
  type: ProfileType,
  args: { id: { type: UUIDType } },
  resolve: getProfilesByIdResolver,
};

// From parent resolvers
export async function getProfilesByUserIdResolver(
  parent: { id: string },
  _args,
  ctx: ContextType,
) {
  return await ctx.dataLoaders.profile.load(parent.id);
}

// Mutations(create)
const CreateProfileArgs = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
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
  ctx: ContextType,
) {
  return ctx.fastify.prisma.profile.create({
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

// Mutations (update)
async function updateProfileResolver(
  _parent,
  args: {
    id: string;
    dto: { isMale: boolean; yearOfBirth: number; memberTypeId: MemberTypeId };
  },
  ctx: ContextType,
) {
  return ctx.fastify.prisma.profile.update({
    where: { id: args.id },
    data: args.dto,
  });
}

const UpdateProfileArgs = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: () => ({
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: MemberTypeIdEnum },
  }),
});

export const updateProfileField = {
  type: ProfileType,
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
    dto: {
      type: new GraphQLNonNull(UpdateProfileArgs),
    },
  },
  resolve: updateProfileResolver,
};

// Mutations (delete)
async function deleteProfileResolver(_parent, args: { id: string }, ctx: ContextType) {
  await ctx.fastify.prisma.profile.delete({
    where: {
      id: args.id,
    },
  });
}

export const deleteProfileField = {
  type: GraphQLBoolean,
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: deleteProfileResolver,
};

// Data loader
export function profileDataLoader(fastify: FastifyInstance) {
  return new DataLoader(async (ids: readonly string[]) => {
    const profiles = await fastify.prisma.profile.findMany({
      where: {
        userId: {
          in: ids as string[],
        },
      },
    });

    return ids.map((id) => profiles.find((profile) => profile.userId === id));
  });
}
