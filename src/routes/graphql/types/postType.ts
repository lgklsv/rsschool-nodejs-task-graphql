import { FastifyInstance } from 'fastify';
import {
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './uuid.js';

export const PostsType: GraphQLObjectType = new GraphQLObjectType({
  name: 'PostsType',
  fields: () => ({
    id: { type: UUIDType },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: UUIDType },
  }),
});

// All Posts
async function getPostsResolver(_parent, _args, fastify: FastifyInstance) {
  return await fastify.prisma.post.findMany();
}

export const postsField = {
  type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostsType))),
  resolve: getPostsResolver,
};

// Posts By Id
async function getPostByIdResolver(
  _parent,
  args: { id: string },
  fastify: FastifyInstance,
) {
  return await fastify.prisma.post.findUnique({
    where: {
      id: args.id,
    },
  });
}

export const postByIdField = {
  type: PostsType,
  args: { id: { type: UUIDType } },
  resolve: getPostByIdResolver,
};

export async function getPostsByUserIdResolver(
  parent: { id: string },
  _args,
  fastify: FastifyInstance,
) {
  return await fastify.prisma.post.findMany({
    where: {
      authorId: parent.id,
    },
  });
}

// Mutations(create)
const CreatePostArgs = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: () => ({
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  }),
});

async function createPostResolver(
  _parent,
  args: { dto: { title: string; content: string; authorId: string } },
  fastify: FastifyInstance,
) {
  return fastify.prisma.post.create({
    data: args.dto,
  });
}

export const createPostField = {
  type: PostsType,
  args: {
    dto: {
      type: new GraphQLNonNull(CreatePostArgs),
    },
  },
  resolve: createPostResolver,
};

// Mutations (update)
async function updatePostResolver(
  _parent,
  args: { id: string; dto: { title: string; content: string } },
  fastify: FastifyInstance,
) {
  return fastify.prisma.post.update({
    where: { id: args.id },
    data: args.dto,
  });
}

const UpdatePostArgs = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: () => ({
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  }),
});

export const updatePostField = {
  type: PostsType,
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
    dto: {
      type: new GraphQLNonNull(UpdatePostArgs),
    },
  },
  resolve: updatePostResolver,
};
