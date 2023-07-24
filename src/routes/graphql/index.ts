import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, parse, validate } from 'graphql';
import schema from './schema/schema.js';
import depthLimit from 'graphql-depth-limit';
import { createDataLoaders } from './schema/dataLoaders.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const validationRes = validate(schema, parse(req.body.query), [depthLimit(5)]);
      if (validationRes.length) return { errors: validationRes };
      return await graphql({
        schema: schema,
        source: String(req.body.query),
        contextValue: {
          fastify: fastify,
          dataLoaders: createDataLoaders(fastify),
        },
        variableValues: req.body.variables,
      });
    },
  });
};

export default plugin;
