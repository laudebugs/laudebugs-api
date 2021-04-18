import mongoose from "mongoose";
require("dotenv").config();

import "reflect-metadata";
import Fastify from "fastify";
import mercurius from "mercurius";
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
//@ts-ignore
mongoose.connect(dbconf, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

(async function runServer() {
  const schema = await buildSchema({
    resolvers: [
      BlogPostResolver,
      PostResolver,
      CommentResolver,
      SnackResolver,
      SpotifyResolver,
      UserResolver,
    ],
  });
  const app = Fastify();

  app.register(mercurius, {
    graphiql: false,
    ide: false,
    path: "/graphql",
    schema,
  });
  app.register(require("fastify-cors"), {
    origin: ["http://laudebugs.me", "http://localhost:4200"],
  });

  /**
   * Posts a request to delete any identifying information for a user - email, name, comments
   */
  app.post("/deleterequest", (req: any, res: any) => {});


 
  // ...
  app.register(AltairFastify, {
    path: "/altair",
    baseURL: "/altair/",
    // 'endpointURL' should be the same as the mercurius 'path'
    endpointURL: "/graphql",
  });

  const PORT = process.env.PORT || 8080;

  app.listen(PORT);
})();
