"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSingleExperiment = exports.getProjects = exports.getSectionedPosts = exports.getTaggedPosts = exports.getSinglePost = exports.getBlogPosts = exports.getAllPosts = exports.getTaggedPost = void 0;
const contentful_1 = require("contentful");
const client = contentful_1.createClient({
    space: "rnmht6wsj5nl",
    accessToken: "_AsjIH6r4ph08uPsSxi_61X8pBSjVP_PSOKOBXpObCM",
});
const getAllPosts = () => client.getEntries().then((response) => response.items);
exports.getAllPosts = getAllPosts;
const getBlogPosts = () => client
    .getEntries({ content_type: "post" })
    .then((response) => response.items);
exports.getBlogPosts = getBlogPosts;
const getProjects = () => client
    .getEntries({ content_type: "project" })
    .then((response) => response.items);
exports.getProjects = getProjects;
const getSinglePost = (slug) => client
    .getEntries({
    "fields.slug": slug,
    content_type: "post",
})
    .then((response) => response.items);
exports.getSinglePost = getSinglePost;
const getSingleExperiment = (slug) => client
    .getEntries({
    "fields.slug": slug,
    content_type: "project",
})
    .then((response) => response.items);
exports.getSingleExperiment = getSingleExperiment;
const getTaggedPost = (tag) => client
    .getEntries({
    "fields.tags": tag,
    content_type: "project",
})
    .then((response) => response.items);
exports.getTaggedPost = getTaggedPost;
const getTaggedPosts = (tag) => client
    .getEntries({
    "fields.tags": tag,
    content_type: "post",
})
    .then((response) => response.items);
exports.getTaggedPosts = getTaggedPosts;
const getSectionedPosts = (section) => client
    .getEntries({
    "fields.section": section,
    content_type: "post",
})
    .then((response) => response.items);
exports.getSectionedPosts = getSectionedPosts;
//# sourceMappingURL=contentful.js.map