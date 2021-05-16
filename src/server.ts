import mongoose from "mongoose";
require("dotenv").config();

import "reflect-metadata";
import Fastify from "fastify";
import mercurius from "mercurius";
const fastifyWebsocket = require("fastify-websocket");
const AltairFastify = require("altair-fastify-plugin");

import BlogPostResolver from "./graphql/resolvers/BlogPostResolver";
import PostResolver from "./graphql/resolvers/PostResolver";
import CommentResolver from "./graphql/resolvers/CommentResolver";
import SnackResolver from "./graphql/resolvers/SnackResolver";
import SpotifyResolver from "./graphql/resolvers/SpotifyResolver";
import UserResolver from "./graphql/resolvers/UserResolver";
import { buildSchema } from "type-graphql";

const dbconf: string = process.env.MONGO_DB || "";

// connect to the database
mongoose.connect(dbconf, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

async function runServer() {
  const schema = await buildSchema({
    resolvers: [
      BlogPostResolver,
      PostResolver,
      CommentResolver,
      SnackResolver,
      SpotifyResolver,
      UserResolver,
    ],
    emitSchemaFile: true,
  });
  const app = Fastify();

  app.register(mercurius, {
    graphiql: false,
    ide:  false,
    schema,
    path: "/graphql",
  });

  app.register(require("fastify-cors"), {
    origin: ["http://laudebugs.me", "http://localhost:4200"],
  });
 
  app.register(fastifyWebsocket, {
    options: {
      maxPayload: 1048576,
    },
  });

  app.register(AltairFastify, {
    path: "/altair",
    baseURL: "/altair/",
    endpointURL: "/graphql",
  });

  app.get("/subs", { websocket: true }, (connection, req) => {
    connection.socket.on("message", (message) => {
      // connection.socket.send("hi from server");
      console.log("connected");
    });
  });

  const PORT = process.env.PORT || 8080;

  app.listen(PORT, ()=>console.log(`api running on port ${PORT}`))
}

runServer().catch((error: Error)=>{console.log(error.message)})