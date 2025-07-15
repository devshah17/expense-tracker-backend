import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs } from './schema/typeDefs/index.ts';
import { resolvers } from './schema/resolvers/index.ts';
import cors from 'cors';
import { connectDB } from './config/db.ts';
import * as dotenv from "dotenv";
import { verifyAndFetchUser } from './utils/middlewares/verifyToken.ts';
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
            context: async ({ req }) => {
                const token = req.headers.authorization || null;
                let user = null;
                let authError = null;
                if (token) {
                    const result = await verifyAndFetchUser(token);
                    if (result.status !== 200) {
                        authError = { status: result.status, logIn: result.logIn, message: result.message };
                    } else {
                        user = result.user;
                    }
                }
                return { token, user, authError };
            }
        }) as unknown as express.RequestHandler
    );

    await connectDB();

    app.listen(process.env.PORT, () => {
        console.log(`Server ready at http://localhost:${process.env.PORT}/graphql`);
    });
}

startApolloServer();