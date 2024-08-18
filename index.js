import express from 'express';
import http from "http";
import cors from 'cors';
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import passport from 'passport';
import session from 'express-session';
import connectMongo from 'connect-mongodb-session';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import mergeResolver from "./resolvers/main.js";
import mergedTypeDefs from "./typeDefs/main.js";
import conncetdb from './connections/db.js';
import dotenv from 'dotenv';
import { buildContext } from 'graphql-passport';
import { configurePassport } from './passport/passport.config.js';
dotenv.config();
configurePassport();

const app = express();
 await conncetdb();

const httpServer = http.createServer(app);

const MongoDBStore = connectMongo(session);

const store = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection:"sessions"
})

store.on("error" , (err)=> console.log(err));

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave:false,
        saveUninitialized: false,
        cookie:{
            maxAge:1000 * 60 * 60 * 24 * 7,
            httpOnly: true
        },
        store : store
    })
)

app.use(passport.initialize());
app.use(passport.session());

const server = new ApolloServer({
    typeDefs: mergedTypeDefs,
    resolvers: mergeResolver,
    plugins:[ApolloServerPluginDrainHttpServer({httpServer})]
})


await server.start();

app.use('/', cors(),express.json(),expressMiddleware(server,{context: async ({req , res})=>buildContext(req,res)}));

await new Promise((resolve)=>httpServer.listen({port:4000},resolve));

console.log(`server started at http:localhost:4000/`)