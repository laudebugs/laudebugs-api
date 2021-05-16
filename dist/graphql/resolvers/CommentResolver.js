"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
const User_1 = require("./../../Models/User");
const type_graphql_1 = require("type-graphql");
const Comment_1 = __importStar(require("../../Models/Comment"));
const Post_1 = require("../../Models/Post");
!type_graphql_1.InputType();
class CommentInput {
}
let CommentResolver = class CommentResolver {
    getComments(slug) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let post = yield Post_1.PostModel.findOne({ slug: slug });
                if (post !== null) {
                    const getComments = yield Promise.all(post.comments.map((commentId) => __awaiter(this, void 0, void 0, function* () {
                        return yield Comment_1.CommentModel.findById(commentId);
                    })));
                    const commentsWitData = yield Promise.all(getComments.map((comment) => __awaiter(this, void 0, void 0, function* () {
                        let thisUser = yield User_1.UserModel.findById(comment.user);
                        let commentUser = thisUser.name;
                        return Object.assign({ user_name: commentUser }, comment);
                    })));
                    return commentsWitData.filter((comment) => comment.approved);
                }
                else {
                    /**
                     * Post is not created??
                     * TODO: Find the cases where this happens
                     */
                    post = new Post_1.PostModel({
                        slug: slug,
                        comments: [],
                        likes: 0,
                    });
                    post.save();
                    return [];
                }
            }
            catch (error) {
                console.log(error.message);
                return [];
            }
        });
    }
    getUnapprovedComments() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let unapprovedComments = yield Comment_1.CommentModel.find({ approved: false });
                return unapprovedComments;
            }
            catch (error) {
                console.log(error.message);
                return [];
            }
        });
    }
    createComment(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let post = yield Post_1.PostModel.findOne({ slug: data.slug });
                if (post === null) {
                    post = new Post_1.PostModel({
                        slug: data.slug,
                        comments: [],
                        likes: 0,
                    });
                }
                // TODO: Save current Post later
                let currentUser = yield User_1.UserModel.findOne({
                    email: data.email,
                });
                if (currentUser === null) {
                    let userName;
                    if (!data.name) {
                        let atIndx = data === null || data === void 0 ? void 0 : data.email.indexOf("@");
                        userName = data === null || data === void 0 ? void 0 : data.email.substring(0, atIndx);
                        console.log(userName);
                    }
                    else {
                        userName = data.name;
                        console.log(userName);
                    }
                    currentUser = new User_1.UserModel({
                        name: userName,
                        email: data.email,
                        comments: [],
                    });
                }
                const newComment = new Comment_1.CommentModel({
                    content: data.comment,
                    user: currentUser._id,
                    likes: 0,
                    approved: false,
                    moderated: false,
                });
                post.comments.push(newComment._id);
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
        });
    }
};
__decorate([
    type_graphql_1.Query((returns) => [Comment_1.default]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CommentResolver.prototype, "getComments", null);
__decorate([
    type_graphql_1.Query((returns) => [Comment_1.default]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CommentResolver.prototype, "getUnapprovedComments", null);
__decorate([
    type_graphql_1.Mutation((returns) => Comment_1.default),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CommentInput]),
    __metadata("design:returntype", Promise)
], CommentResolver.prototype, "createComment", null);
CommentResolver = __decorate([
    type_graphql_1.Resolver((of) => Comment_1.default)
], CommentResolver);
exports.default = CommentResolver;
//# sourceMappingURL=CommentResolver.js.map