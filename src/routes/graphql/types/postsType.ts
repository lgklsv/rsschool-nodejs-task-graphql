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

const getPostsResolver = async (_parent, _args, fastify: FastifyInstance) => {
  return await fastify.prisma.memberType.findMany();
};

export const postsField = {
  type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostsType))),
  resolve: getPostsResolver,
};
