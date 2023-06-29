import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

// data
import db from "./_db.js";

// types
const typeDefs = `#graphql
type Game {
  id: ID!
  title: String!
  platform: [String!]!
  reviews: [Review!]
}
type Review {
  id: ID!
  rating: Int!
  content: String!
  author: Author!
  game: Game!
}
type Author {
  id: ID!
  name: String!
  verified: Boolean!
  reviews: [Review!]
}
type Query {
  games: [Game]
  game(id: ID!): Game
  reviews: [Review]
  review(id: ID!): Review
  authors: [Author]
  author(id: ID!): Author
}
`;

const resolvers = {
  Query: {
    games: () => db.games,
    game: (_, args) => db.games.find((game) => game.id === args.id),
    authors: () => db.authors,
    author: (_, args) => db.authors.find((author) => author.id === args.id),
    reviews: () => db.reviews,
    review: (_, args) => db.reviews.find((review) => review.id === args.id),
  },
  Game: {
    reviews(parent) {
      return db.reviews.filter((r) => r.game_id === parent.id);
    },
  },
  Review: {
    author(parent) {
      return db.authors.find((a) => a.id === parent.author_id);
    },
    game(parent) {
      return db.games.find((g) => g.id === parent.game_id);
    },
  },
  Author: {
    reviews(parent) {
      return db.reviews.filter((r) => r.author_id === parent.id);
    },
  },
};
// server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`Server ready at: ${url}`);
