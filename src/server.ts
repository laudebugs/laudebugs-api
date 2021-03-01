import express from "express";
// create the express app
import cors from "cors";

import path from "path";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import feed from "feed";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";
import { graphqlHTTP } from "express-graphql";
import cheerio from "cheerio";
import got from "got";

import { schema } from "./data/schema";

const app = express();

const publicPath = path.resolve(__dirname, "public");

app.use(cors());
/**
 * Cheerio and got are used to parse EyeEm photos by webscraping my user profile
 */

const { Db } = require("mongodb");
require("./data/dbConnectors");
// Add middleware
app.use(express.static(publicPath));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const Post = mongoose.model("Post");
const User = mongoose.model("User");
const Comment = mongoose.model("Comment");
const Note = mongoose.model("Note");

/**
 * Configure cors headers
 * Reference: https://stackoverflow.com/questions/51017702/enable-cors-in-fetch-api
 */
const root = { hello: () => "GraphQL is amazing" };

app.use((req: any, res: any, next: any) => {
  const allowedOrigins = ["http://laudebugs.me", "http://localhost:3000"];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  //res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:8020');
  res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", true);
  return next();
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

app.get("*", (req: any, res: any) => {
  res.send("welcome to lau de bugs's api");
});
/**
 * Posts a request to delete any identifying information for a user - email, name, comments
 */
app.post("/deleterequest", (req: any, res: any) => {});
const port = 8080;
app.listen(port, () => console.log(`Server is running on port ${port}`));
