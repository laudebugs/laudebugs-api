"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notion = void 0;
const { Client, APIErrorCode } = require('@notionhq/client');
// Initializing a client
exports.notion = new Client({
    auth: process.env.NOTION_TOKEN
});
const doSth = () => __awaiter(void 0, void 0, void 0, function* () {
    const listUsersResponse = yield exports.notion.users.list();
    console.log(listUsersResponse);
});
// doSth()
// Add any filters here
const filter = {};
const getBlog = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield exports.notion.databases.retrieve({
            database_id: process.env.NOTION_BLOG_DB_ID
        });
        // console.log(db)
        const blog = yield exports.notion.databases.query({
            database_id: process.env.NOTION_BLOG_DB_ID
            // filter: filter
        });
        console.log(blog);
    }
    catch (error) {
        if (error.code === APIErrorCode.ObjectNotFound) {
            //
            // For example: handle by asking the user to select a different database
            //
        }
        else {
            // Other error handling code
            console.error(error.message);
        }
    }
});
const getPublishedpages = () => {
    return exports.notion.databases.query({
        database_id: process.env.NOTION_BLOG_DB_ID
    });
};
const getPageBlocks = (page_id) => {
    return exports.notion.blocks.children.list({
        block_id: page_id
    });
};
getPublishedpages().then((query) => __awaiter(void 0, void 0, void 0, function* () {
    const getPages = () => Promise.all(query.results.map(page => {
        const pageBlocks = getPageBlocks(page.id);
        return pageBlocks;
    }));
    getPages().then(results => console.log(JSON.stringify(results)));
}));
//# sourceMappingURL=notion.so.js.map