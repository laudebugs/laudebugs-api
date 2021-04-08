import bodyParser from "body-parser";
// create the express app
require("dotenv").config("../");
import cors from "cors";
import express from "express";
import { graphqlHTTP } from "express-graphql";
import path from "path";
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
  return next();
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

/**
 * Posts a request to delete any identifying information for a user - email, name, comments
 */
app.post("/deleterequest", (req: any, res: any) => {});
const port = process.env.PORT || 9000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
