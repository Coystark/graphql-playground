import express from 'express';
import bodyParser from 'body-parser';
import { ApolloServer, gql } from 'apollo-server-express';
import { v4 as uuidv4 } from 'uuid';
import {createConnection} from "typeorm";

import userUseCase from './useCases/User';
import orderUseCase from './useCases/Order';

const accounts = [
  {
    name: 'Caio Henrique',
    age: 29,
    from: 'Rio de Janeiro',
    latitude: -20.3679421,
    longitude: -40.3170442,
    id: '6a344650-f1b5-4d94-bf5b-4fd8fcf819c2',
    createdDate: 'Wed Feb 24 2021 22:32:09 GMT-0300 (Brasilia Standard Time)'
  },
  {
    name: 'Gabriel Pereira',
    age: 29,
    from: 'Rio de Janeiro',
    latitude: -20.3531683,
    longitude: -40.3157945,
    id: '4aec351c-e890-46f5-9f0c-144670d55dfa',
    createdDate: 'Wed Feb 24 2021 22:32:24 GMT-0300 (Brasilia Standard Time)'
  },
  {
    name: 'Daniel Antunes Pereira',
    age: 35,
    from: 'Rio de Janeiro',
    latitude: -20.3165917,
    longitude: -40.3031257,
    id: '856b9f25-0b40-466c-a16c-e462d3ae9f9d',
    createdDate: 'Wed Feb 24 2021 22:32:44 GMT-0300 (Brasilia Standard Time)'
  },
  {
    name: 'Envy',
    age: 25,
    from: 'Rio de Janeiro',
    latitude: -20.3165917,
    longitude: -40.3031257,
    id: '25fb8293-57cf-4613-8167-4e0a90794b3f',
    createdDate: 'Wed Feb 24 2021 22:33:21 GMT-0300 (Brasilia Standard Time)'
  }
]

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  input UserInput {
    name: String!
    age: Int!
    from: String!
    latitude: Float!
    longitude: Float!
  }

  input UserUpdateInput {
    id: ID!
    name: String
    age: Int
    from: String
    latitude: Float
    longitude: Float
  }

  type User {
    name: String!
    age: Int!
    from: String!
    latitude: Float!
    longitude: Float!
    createdDate: String!
  }

  input OrderInput {
    product: String!
    user: String!
  }

  type Order {
    id: ID!
    product: String!
    createdDate: String!
    user: User!
  }

  type Query {
    users: [User!]!
    orders(id: ID): [Order!]!
  }

  type Mutation {
    addUser(user: UserInput): String!
    deleteUser(id: ID!): Boolean!
    updateUser(user: UserUpdateInput): Boolean!

    addOrder(data: OrderInput): String!
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    /**
     * User
     */
    users: async (parent: any, args: any) => {
      const users = await userUseCase.getAll()
    
      return users
    },
    /**
     * Order
     */
    orders: async (parent: any, args: any) => {
      const { id } = args 

      const orders = await orderUseCase.getAll({ id })
         
      return orders
    }
  },
  Mutation: {
    /**
     * User
     */
    addUser: async (parent: any, args: any) => {
      const data = args.user

      const uid = await userUseCase.create(data)

      return uid
    },
    deleteUser: async (parent: any, args: any) => {
      const { id } = args 

      await userUseCase.delete({ id })

      return true
    },
    updateUser: async (parent: any, args: any) => {
      const data = args.user

      await userUseCase.update(data)

      return true
    },
    /**
     * Order
     */
    addOrder: async (parent: any, args: any) => {
      const data = args.data

      console.log(data)

      const uid = await orderUseCase.create(data)

      return uid
    },
  },
};

createConnection().then(async connection => {
  const server = new ApolloServer({ typeDefs, resolvers });

  const app = express();
  server.applyMiddleware({ app });

  const PORT = 4000

  app.listen({ port: PORT }, () =>
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
  );
}).catch(error => console.log("TypeORM connection error: ", error));
