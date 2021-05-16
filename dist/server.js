"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
// create the express app
require('dotenv').config('../');
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const express_graphql_1 = require("express-graphql");
const path_1 = __importDefault(require("path"));
const schema_1 = require("./data/schema");
require('./clients/notion.so');
const app = express_1.default();
const publicPath = path_1.default.resolve(__dirname, 'public');
app.use(cors_1.default());
/**
 * Cheerio and got are used to parse EyeEm photos by webscraping my user profile
 */
const { Db } = require('mongodb');
require('./data/dbConnectors');
// Add middleware
app.use(express_1.default.static(publicPath));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
/**
 * Configure cors headers
 * Reference: https://stackoverflow.com/questions/51017702/enable-cors-in-fetch-api
 */
const root = { hello: () => 'GraphQL is amazing' };
app.use((req, res, next) => {
    const allowedOrigins = ['http://laudebugs.me', 'http://localhost:3000'];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    return next();
});
app.use('/graphql', express_graphql_1.graphqlHTTP({
    schema: schema_1.schema,
    graphiql: true
}));
/**
 * Posts a request to delete any identifying information for a user - email, name, comments
 */
app.post('/deleterequest', (req, res) => { });
const port = process.env.PORT || 9000;
const host = '0.0.0.0';
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
//# sourceMappingURL=server.js.map