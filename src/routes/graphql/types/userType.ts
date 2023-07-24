import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLResolveInfo,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { ProfileType, getProfilesByUserIdResolver } from './profileType.js';
import { PostsType, getPostsByUserIdResolver } from './postType.js';
import { ContextType } from '../schema/context.js';
import { FastifyInstance } from 'fastify';
import DataLoader from 'dataloader';
import {
  ResolveTree,
  parseResolveInfo,
  simplifyParsedResolveInfoFragmentWithType,
} from 'graphql-parse-resolve-info';

export interface IUserType {
  id: string;
  name: string;
  balance: number;
  subscribedToUser?: {
    authorId: string;
    subscriberId: string;
  }[];
  userSubscribedTo?: {
    subscriberId: string;
    authorId: string;
  }[];
}

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
async function getUsersResolver(
  _parent,
  _args,
  ctx: ContextType,
  resolveInfo: GraphQLResolveInfo,
) {
  const parsedResolveInfoFragment = parseResolveInfo(resolveInfo) as ResolveTree;
  const { fields } = simplifyParsedResolveInfoFragmentWithType(
    parsedResolveInfoFragment,
    new GraphQLList(UserType),
  );
  const users = await ctx.fastify.prisma.user.findMany({
    include: {
      subscribedToUser: 'subscribedToUser' in fields && !!fields.subscribedToUser,
      userSubscribedTo: 'userSubscribedTo' in fields && !!fields.userSubscribedTo,
    },
  });

  users.forEach((res) => {
    ctx.dataLoaders.user.prime(res.id, res);
  });

  return users;
}

export const usersField = {
  type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
  resolve: getUsersResolver,
};

// Users By Id
async function getUsersByIdResolver(_parent, args: { id: string }, ctx: ContextType) {
  return await ctx.dataLoaders.user.load(args.id);
}

export const userByIdField = {
  type: UserType,
  args: { id: { type: UUIDType } },
  resolve: getUsersByIdResolver,
};

async function subscribedToUserResolver(parent: IUserType, _args, ctx: ContextType) {
  if (Array.isArray(parent.subscribedToUser)) {
    const ids = parent.subscribedToUser.map(
      (item) =>
        (
          item as {
            authorId: string;
            subscriberId: string;
          }
        ).subscriberId,
    );
    return await ctx.dataLoaders.user.loadMany(ids);
  }
}

async function userSubscribedToResolver(parent: IUserType, _args, ctx: ContextType) {
  if (Array.isArray(parent.userSubscribedTo)) {
    const ids = parent.userSubscribedTo.map(
      (item) =>
        (
          item as {
            authorId: string;
            subscriberId: string;
          }
        ).authorId,
    );
    return ctx.dataLoaders.user.loadMany(ids);
  }
}

export async function getUserByProfileIdResolver(
  parent: { userId: string },
  _args,
  ctx: ContextType,
) {
  return await ctx.fastify.prisma.user.findUnique({
    where: {
      id: parent.userId,
    },
  });
}

// Mutations (create)
async function createUserResolver(
  _parent,
  args: { dto: { name: string; balance: number } },
  ctx: ContextType,
) {
  return ctx.fastify.prisma.user.create({
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
  ctx: ContextType,
) {
  return ctx.fastify.prisma.user.update({
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

// Mutations (delete)
async function deleteUserResolver(_parent, args: { id: string }, ctx: ContextType) {
  await ctx.fastify.prisma.user.delete({
    where: { id: args.id },
  });
}

export const deleteUserField = {
  type: GraphQLBoolean,
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: deleteUserResolver,
};

// Mutations (subscribeTo)
async function subscribeToResolver(
  _parent,
  args: { userId: string; authorId: string },
  ctx: ContextType,
) {
  return ctx.fastify.prisma.user.update({
    where: { id: args.userId },
    data: {
      userSubscribedTo: {
        create: {
          authorId: args.authorId,
        },
      },
    },
  });
}

export const subscribeToField = {
  type: UserType,
  args: {
    userId: { type: new GraphQLNonNull(UUIDType) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: subscribeToResolver,
};

// Mutations (unsubscribeFrom)
async function unsubscribeFromResolver(
  _parent,
  args: { userId: string; authorId: string },
  ctx: ContextType,
) {
  await ctx.fastify.prisma.user.update({
    where: { id: args.userId },
    data: {
      userSubscribedTo: {
        deleteMany: {
          authorId: args.authorId,
        },
      },
    },
  });
}

export const unsubscribeFromField = {
  type: GraphQLBoolean,
  args: {
    userId: { type: new GraphQLNonNull(UUIDType) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: unsubscribeFromResolver,
};

// Data loaders
export function userDataLoader(fastify: FastifyInstance) {
  return new DataLoader(async (ids: readonly string[]) => {
    const users = await fastify.prisma.user.findMany({
      where: {
        id: {
          in: ids as string[],
        },
      },
      include: {
        userSubscribedTo: true,
        subscribedToUser: true,
      },
    });

    const usersToMap: { [key: string]: IUserType } = users.reduce((mapping, user) => {
      mapping[user.id] = user;
      return mapping;
    }, {});

    return ids.map((id) => usersToMap[id]);
  });
}
