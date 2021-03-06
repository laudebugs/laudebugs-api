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
exports.resolvers = void 0;
const rich_text_html_renderer_1 = require("@contentful/rich-text-html-renderer");
const dbConnectors_1 = require("./dbConnectors");
const contentful_1 = require("../lib/contentful");
const functions_1 = require("../lib/functions");
const types_1 = require("./types");
// Resolver map
exports.resolvers = {
    Query: {
        getUser: () => { },
        getPosts: () => {
            return dbConnectors_1.Post.find();
        },
        getSnacks: () => __awaiter(void 0, void 0, void 0, function* () {
            return functions_1.getSnacks().then((data) => {
                let snacks = data.data.data.repository.defaultBranchRef.target.file.object.entries;
                snacks = snacks.filter((snack) => snack.name.substring(snack.name.length - 3) === ".md" &&
                    snack.name !== "README.md");
                snacks = snacks.map((snack) => {
                    return { fileName: snack.name, body: snack.object.text };
                });
                return snacks;
            });
        }),
        getPost: () => { },
        getBlogPosts: () => __awaiter(void 0, void 0, void 0, function* () {
            let posts = yield contentful_1.getAllPosts();
            //@ts-ignore
            console.log(posts[0].fields.date);
            posts = posts.sort((a, b) => {
                //@ts-ignore
                return new Date(b.fields.date) - new Date(a.fields.date);
            });
            let data = posts.map((post) => {
                let bodyType = typeof post.fields.body;
                post.fields.body =
                    bodyType !== "string"
                        ? rich_text_html_renderer_1.documentToHtmlString(post.fields.body)
                        : post.fields.body;
                return new types_1.PostType(functions_1.readableDate(post.fields.date), post.fields.slug, post.fields.title, post.fields.description, post.fields.body, post.fields.feature_image.fields.file.url, post.fields.tags || [], post.fields.section || [], 0, post.sys.contentType.sys.id);
            });
            return data;
        }),
        //@ts-ignore
        getUser: () => { },
        /**
         * Gets comments based on a slug
         */
        getComments: (root, { slug }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                let post = yield dbConnectors_1.Post.findOne({ slug: slug });
                if (post !== null) {
                    const getComments = yield Promise.all(
                    //@ts-ignore
                    post.comments.map((commentId) => __awaiter(void 0, void 0, void 0, function* () {
                        return yield dbConnectors_1.Comment.findById(commentId);
                    })));
                    const commentsWitData = yield Promise.all(getComments.map((comment) => __awaiter(void 0, void 0, void 0, function* () {
                        //@ts-ignore
                        let thisUser = yield dbConnectors_1.User.findById(comment.user);
                        let commentUser = thisUser.name;
                        return {
                            //@ts-ignore
                            content: comment.content,
                            //@ts-ignore
                            approved: comment.approved,
                            //@ts-ignore
                            createdAt: functions_1.readableDate(comment.createdAt),
                            user: { name: commentUser },
                        };
                    })));
                    return commentsWitData.filter((comment) => comment.approved);
                }
                else {
                    /**
                     * Post is not created??
                     * TODO: Find the cases where this happens
                     */
                    post = new dbConnectors_1.Post({
                        slug: slug,
                        comments: [],
                        likes: 0,
                    });
                    post.save();
                    //@ts-ignore
                    return post.comments;
                }
            }
            catch (error) {
                console.log(error.message);
                return [];
            }
        }),
        getUnapprovedComments: () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                let unapprovedComments = yield dbConnectors_1.Comment.find({ approved: false });
                return unapprovedComments;
            }
            catch (error) {
                console.log(error.message);
                return [];
            }
        }),
        getNotes: () => { },
        getLikes: (root, { slug }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                let post = yield dbConnectors_1.Post.findOne({ slug: slug });
                if (post !== null) {
                    //@ts-ignore
                    return post.likes;
                }
                else {
                    post = new dbConnectors_1.Post({
                        slug: slug,
                        likes: 0,
                    });
                    post.save();
                    //@ts-ignore
                    return post.likes;
                }
            }
            catch (error) {
                /**
                 * Means there was an error in retrieving the post likes or
                 * in saving the post likes
                 */
                return -1;
            }
        }),
        getRandomImage: () => __awaiter(void 0, void 0, void 0, function* () {
            let image = yield functions_1.getRandomImage();
            return { url: image };
        }),
    },
    Mutation: {
        createPost: (root, { input }) => {
            const newPost = new dbConnectors_1.Post({
                slug: input.slug,
                likes: 0,
                comments: [],
            });
            newPost.id = newPost._id;
            return new Promise((resolve, reject) => {
                newPost.save((err) => {
                    if (err)
                        reject(err);
                    else
                        resolve(newPost);
                });
            });
        },
        createComment: (root, { data }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                let post = yield dbConnectors_1.Post.findOne({ slug: data.slug });
                if (post === null) {
                    post = new dbConnectors_1.Post({
                        slug: data.slug,
                        comments: [],
                        likes: 0,
                    });
                }
                // TODO: Save current Post later
                let currentUser = yield dbConnectors_1.User.findOne({ email: data.email });
                if (currentUser === null) {
                    let userName;
                    if (!data.name) {
                        let atIndx = data.email.indexOf("@");
                        userName = data.email.substring(0, atIndx);
                        console.log(userName);
                    }
                    else {
                        userName = data.name;
                        console.log(userName);
                    }
                    currentUser = new dbConnectors_1.User({
                        name: userName,
                        email: data.email,
                    });
                }
                const newComment = new dbConnectors_1.Comment({
                    content: data.comment,
                    user: currentUser._id,
                    likes: 0,
                    approved: false,
                    moderated: false,
                });
                //@ts-ignore
                post.comments.push(newComment._id);
                //@ts-ignore
                currentUser.comments.push(newComment._id);
                currentUser.save();
                post.save();
                newComment.save();
                return newComment;
            }
            catch (error) {
                console.log(error.message);
                /**
                 * If an error occurs
                 */
                return null;
            }
        }),
        createNote: (root, { note }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                let usr = yield dbConnectors_1.User.findOne({ email: note.email });
                if (!usr) {
                    usr = new dbConnectors_1.User({ name: note.name, email: note.email });
                }
                let newNote = new dbConnectors_1.Note({
                    subject: note.subject,
                    note: note.note,
                    user: usr._id,
                });
                //@ts-ignore
                usr.notes.push(newNote._id);
                usr.save().then(() => {
                    newNote.save();
                });
                return newNote;
            }
            catch (error) {
                return null;
            }
        }),
        userSignUp: (root, { user }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                let usr = yield dbConnectors_1.User.findOne({ email: user.email });
                if (!usr) {
                    usr = new dbConnectors_1.User({ name: user.name, email: user.email });
                }
                //@ts-ignore
                usr.sneekpeeks = user.sneekpeeks;
                //@ts-ignore
                usr.newposts = user.newposts;
                usr.save();
                return usr;
            }
            catch (error) {
                return null;
            }
        }),
        postLike: (root, { slug }) => __awaiter(void 0, void 0, void 0, function* () {
            console.log(slug);
            try {
                let post = yield dbConnectors_1.Post.findOne({ slug: slug });
                if (post === null) {
                    post = new dbConnectors_1.Post({
                        slug: slug,
                        likes: 0,
                    });
                }
                //@ts-ignore
                post.likes += 1;
                post.save();
                //@ts-ignore
                return post.likes;
            }
            catch (error) {
                return -1;
            }
        }),
    },
};
//# sourceMappingURL=resolvers.js.map