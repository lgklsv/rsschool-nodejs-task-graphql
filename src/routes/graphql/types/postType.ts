import { FastifyInstance } from 'fastify';
import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { UUIDType } from './uuid.js';

export const PostsType = new GraphQLObjectType({
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
  const post = await fastify.prisma.post.findUnique({
    where: {
      id: args.id,
    },
  });
  return post;
}

export async function getPostsByUserIdResolver(
  parent: { id: string },
  _args,
  fastify: FastifyInstance,
) {
  const post = await fastify.prisma.post.findUnique({
    where: {
      id: parent.id,
    },
  });
  return post;
}

export const postByIdField = {
  type: PostsType,
  args: { id: { type: UUIDType } },
  resolve: getPostByIdResolver,
};
