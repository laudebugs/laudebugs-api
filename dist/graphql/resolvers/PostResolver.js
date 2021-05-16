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
const type_graphql_1 = require("type-graphql");
const Post_1 = __importStar(require("../../Models/Post"));
let PostResolver = class PostResolver {
    getPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = yield Post_1.PostModel.find();
            return posts;
        });
    }
    getLikes(root, { slug }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let post = yield Post_1.PostModel.findOne({ slug: slug });
                if (post !== null) {
                    return post.likes;
                }
                else {
                    post = new Post_1.PostModel({
                        slug: slug,
                        likes: 0,
                    });
                    post.save();
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
        });
    }
    postLike(root, { slug }) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(slug);
            try {
                let post = yield Post_1.PostModel.findOne({ slug: slug });
                if (post === null) {
                    post = new Post_1.PostModel({
                        slug: slug,
                        likes: 0,
                    });
                }
                post.likes += 1;
                post.save();
                return post.likes;
            }
            catch (error) {
                return -1;
            }
        });
    }
};
__decorate([
    type_graphql_1.Query((returns) => [Post_1.default]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "getPosts", null);
__decorate([
    type_graphql_1.Query((returns) => Number),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "getLikes", null);
__decorate([
    type_graphql_1.Mutation((returns) => Number),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "postLike", null);
PostResolver = __decorate([
    type_graphql_1.Resolver((of) => Post_1.default)
], PostResolver);
exports.default = PostResolver;
//# sourceMappingURL=PostResolver.js.map