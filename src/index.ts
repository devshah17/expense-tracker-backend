// index.js
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs } from './schema/typeDefs.ts';
import { resolvers } from './schema/resolvers.ts';
import cors from 'cors';
import { connectDB } from './config/db.ts';
import * as dotenv from "dotenv";
dotenv.config()

const app = express();

interface MyContext {
    token?: string | null;
}

async function startApolloServer() {
    const server = new ApolloServer<MyContext>({
        typeDefs,
        resolvers
    });
    await server.start();

    app.use(express.json());
    app.use(cors());

    app.use(
        '/graphql',
        expressMiddleware(server, {
            context: async ({ req }) => ({
                token: req.headers.authorization || null
            })
        }) as unknown as express.RequestHandler
    );

    await connectDB();

    app.listen(process.env.PORT, () => {
        console.log(`Server ready at http://localhost:${process.env.PORT}/graphql`);
    });
}

startApolloServer();