import { FastifyInstance } from 'fastify';
import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { UUIDType } from './uuid.js';

const PostsType = new GraphQLObjectType({
  name: 'PostsType',
  fields: () => ({
    id: { type: UUIDType },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: UUIDType },
  }),
});

// All Posts
const getPostsResolver = async (_parent, _args, fastify: FastifyInstance) => {
  return await fastify.prisma.post.findMany();
};

export const postsField = {
  type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostsType))),
  resolve: getPostsResolver,
};

// Posts By Id
const getPostByIdResolver = async (
  _parent,
  args: { id: string },
  fastify: FastifyInstance,
) => {
  const post = await fastify.prisma.post.findUnique({
    where: {
      id: args.id,
    },
  });
  return post;
};

export const postByIdField = {
  type: PostsType,
  args: { id: { type: UUIDType } },
  resolve: getPostByIdResolver,
};
