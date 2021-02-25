import express from 'express';
import bodyParser from 'body-parser';
import { ApolloServer, gql } from 'apollo-server-express';
import { v4 as uuidv4 } from 'uuid';

interface AddUserDto {
  name: string;
  age: number;
  from: string;
  latitude: number;
  longitude: number;
}

const accounts = [
  {
    name: 'Caio Henrique',
    age: 29,
    from: 'Rio de Janeiro',
    latitude: -20.3679421,
    longitude: -40.3170442,
    uid: '6a344650-f1b5-4d94-bf5b-4fd8fcf819c2',
    createdDate: 'Wed Feb 24 2021 22:32:09 GMT-0300 (Brasilia Standard Time)'
  },
  {
    name: 'Gabriel Pereira',
    age: 29,
    from: 'Rio de Janeiro',
    latitude: -20.3531683,
    longitude: -40.3157945,
    uid: '4aec351c-e890-46f5-9f0c-144670d55dfa',
    createdDate: 'Wed Feb 24 2021 22:32:24 GMT-0300 (Brasilia Standard Time)'
  },
  {
    name: 'Daniel Antunes Pereira',
    age: 35,
    from: 'Rio de Janeiro',
    latitude: -20.3165917,
    longitude: -40.3031257,
    uid: '856b9f25-0b40-466c-a16c-e462d3ae9f9d',
    createdDate: 'Wed Feb 24 2021 22:32:44 GMT-0300 (Brasilia Standard Time)'
  },
  {
    name: 'Envy',
    age: 25,
    from: 'Rio de Janeiro',
    latitude: -20.3165917,
    longitude: -40.3031257,
    uid: '25fb8293-57cf-4613-8167-4e0a90794b3f',
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
    uid: ID!
    name: String!
    age: Int!
    from: String!
    latitude: Float!
    longitude: Float!
  }

  type User {
    name: String!
    age: Int!
    from: String!
    latitude: Float!
    longitude: Float!
    createdDate: String!
  }

  type CreateUserResponse {
    uid: String!
    createdDate: String!
  }

  type Query {
    getUsers(minAge: Int!): [User!]!
  }

  type Mutation {
    addUser(user: UserInput): CreateUserResponse!
    deleteUser(user: ID!): Boolean!
    updateUser(user: UserUpdateInput): Boolean!
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    getUsers: (parent: any, args: any) => {
      const { minAge } = args
    
      return accounts
        .filter((value) => value.age > minAge)
    }
  },
  Mutation: {
    addUser: async (parent: any, args: any) => {
      // Obtém o que está dentro de args
      const user = args.user

      // Formatar dados
      const data = {
        ...user,
        uid: uuidv4(),
        createdDate: new Date().toString()
      }

      // Salva na memória
      accounts.push(data)

      return {
        uid: data.uid,
        createdDate: data.createdDate
      }
    },
    deleteUser: async (parent: any, args: any) => {
      const uid = args.user

      const found = accounts.find(value => value.uid === uid)

      if (!found) { return false }

      // TODO this.
      accounts.filter((value) => value.uid !== uid)

      return true
    },
    updateUser: async (parent: any, args: any) => {
      const user = args.user

      const found = accounts.find(value => value.uid === user.uid)

      if (!found) { return false }

      // TODO this.
      accounts.map((value) => value.uid === user.uid ? user : value)

      return true
    }
  },
};


const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);