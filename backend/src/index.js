require('dotenv').config({ path: 'variables.env' });

const { GraphQLServer } = require('graphql-yoga');
const { prisma } = require('./generated/prisma-client');

const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const User = require('./resolvers/User');
const Link = require('./resolvers/Link');

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers: {
    Mutation,
    Query,
    User,
    Link,
  },
  context: request => ({
    ...request,
    prisma,
  }),
});

const PORT = process.env.PORT || 4000;
server.start(() =>
  console.log(`Server is running on http://localhost:${PORT}`)
);
