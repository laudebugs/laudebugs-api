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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addSubscriber = exports.getSnacks = exports.readableDate = exports.getRandomImage = void 0;
const cheerio_1 = __importDefault(require("cheerio"));
const got_1 = __importDefault(require("got"));
const axios_1 = __importDefault(require("axios"));
// import mailchimp from "@mailchimp/mailchimp_marketing";
const mailchimp = require("@mailchimp/mailchimp_marketing");
function getRandomImage() {
    return __awaiter(this, void 0, void 0, function* () {
        const url = "https://www.eyeem.com/u/laudebugs";
        let page = yield got_1.default(url);
        const $ = cheerio_1.default.load(page.body);
        const images = $("figure a img");
        const no_images = $("figure a img").length;
        const randomNo = Math.floor(Math.random() * no_images + 1);
        // select a random number between 0 and no_images-1
        return images[randomNo].attribs.src;
    });
}
exports.getRandomImage = getRandomImage;
function readableDate(dateString) {
    return new Date(dateString).toDateString();
}
exports.readableDate = readableDate;
const githubUrl = "https://api.github.com/graphql";
const oauth = { Authorization: "bearer " + process.env.GH_TOKEN };
const query = `
           {
             repository(owner: "lbugasu", name: "articles") {
               defaultBranchRef {
                 target {
                   ... on Commit {
                     file(path: "/") {
                       type
                       object {
                         ... on Tree {
                           entries {
                             name
                             object {
                               ... on Blob {
                                 text
                               }
                             }
                           }
                         }
                       }
                     }
                   }
                 }
               }
             }
           }
         `;
const getSnacks = () => {
    return axios_1.default.post(githubUrl, { query: query }, { headers: oauth });
};
exports.getSnacks = getSnacks;
/* Mailchimp integration */
mailchimp.setConfig({
    apiKey: "a8cba921f0e83c43fbcde91a17357c2f-us4",
    server: "us4",
});
function addSubscriber(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield mailchimp.lists.addListMember("8a0a984d69", {
            email_address: user.email,
            status: "subscribed",
            merge_fields: {
                FNAME: user.firstName,
                LNAME: user.lastName,
            },
        });
        console.log(response.id);
    });
}
exports.addSubscriber = addSubscriber;
//# sourceMappingURL=functions.js.map