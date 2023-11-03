import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'

// data
import db from './_db.js'

// types
import { typeDefs } from './schema.js'

// resolvers
const resolvers = {
  Query: {
    games() {
      return db.games
    },
    game(_, { id }) {
      return db.games.find(game => game.id === id)
    },
    authors() {
      return db.authors
    },
    author(_, { id }) {
      return db.authors.find(author => author.id === id)
    },
    reviews() {
      return db.reviews
    },
    review(_, { id }) {
      return db.reviews.find(review => review.id === id)
    },
  },
  Game: {
    reviews(parent) {
      return db.reviews.filter(review => review.game_id === parent.id)
    },
  Author: {
      reviews(parent) {
        return db.reviews.filter(review => review.author_id === parent.id)
      }
    },
  Review: {
      game(parent) {
        return db.games.find(game => game.id === parent.game_id)
      },
      author(parent) {
        return db.authors.find(author => author.id === parent.author_id)
      }
    },
  },
}

// server setup
const server = new ApolloServer({
  typeDefs,
  resolvers
})

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 }
})

console.log(`Server ready at: ${url}`)