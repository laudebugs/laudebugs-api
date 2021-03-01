"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// create the express app
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_graphql_1 = require("express-graphql");
const schema_1 = require("./data/schema");
const app = express_1.default();
const publicPath = path_1.default.resolve(__dirname, "public");
app.use(cors_1.default());
/**
 * Cheerio and got are used to parse EyeEm photos by webscraping my user profile
 */
const { Db } = require("mongodb");
require("./data/dbConnectors");
// Add middleware
app.use(express_1.default.static(publicPath));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
const Post = mongoose_1.default.model("Post");
const User = mongoose_1.default.model("User");
const Comment = mongoose_1.default.model("Comment");
const Note = mongoose_1.default.model("Note");
/**
 * Configure cors headers
 * Reference: https://stackoverflow.com/questions/51017702/enable-cors-in-fetch-api
 */
const root = { hello: () => "GraphQL is amazing" };
app.use((req, res, next) => {
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
app.use("/graphql", express_graphql_1.graphqlHTTP({
    schema: schema_1.schema,
    rootValue: root,
    graphiql: true,
}));
app.get("*", (req, res) => {
    res.send("welcome to lau de bugs's api");
});
/**
 * Posts a request to delete any identifying information for a user - email, name, comments
 */
app.post("/deleterequest", (req, res) => { });
const port = 8080;
app.listen(port, () => console.log(`Server is running on port ${port}`));
//# sourceMappingURL=server.js.map