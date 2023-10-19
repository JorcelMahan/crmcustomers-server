import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from '@apollo/server/standalone';
import typeDefs from './gql/schema.js'
import resolvers from './gql/resolvers.js'
import jwt from 'jsonwebtoken';
import connectDB from "./config/db.js";
import 'dotenv/config.js';

connectDB();

const server = new ApolloServer({
    typeDefs,
    resolvers,
});


const { url } = await startStandaloneServer(server,
    {
        context: ({ req }) => {
            const token = req.headers.authorization || '';
            if (token) {
                try {
                    const user = jwt.verify(token.replace('Bearer ', ''), process.env.SECRET_WORD);
                    return {
                        user
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }
    },
    {
        listen: {
            port: 4000
        }
    }
);

console.log(`Server ready at ${url}`);