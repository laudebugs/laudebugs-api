"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rich_text_html_renderer_1 = require("@contentful/rich-text-html-renderer");
const type_graphql_1 = require("type-graphql");
const contentful_1 = require("../../lib/contentful");
const functions_1 = require("../../lib/functions");
const BlogPost_1 = __importDefault(require("../../Models/BlogPost"));
let BlogPostResolver = class BlogPostResolver {
    getBlogPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield contentful_1.getAllPosts();
            let blogPosts = data.map((post) => {
                let bodyType = typeof post.fields.body;
                post.fields.body =
                    bodyType !== "string"
                        ? rich_text_html_renderer_1.documentToHtmlString(post.fields.body)
                        : post.fields.body;
                return {
                    date: functions_1.readableDate(post.fields.date),
                    slug: post.fields.slug,
                    title: post.fields.title,
                    description: post.fields.description,
                    body: post.fields.body,
                    featuredImage: post.fields.feature_image.fields.file.url,
                    tags: post.fields.tags || [],
                    section: post.fields.section || [],
                    likes: 0,
                    type: post.sys.contentType.sys.id,
                };
            });
            return blogPosts;
        });
    }
};
__decorate([
    type_graphql_1.Query((returns) => [BlogPost_1.default]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BlogPostResolver.prototype, "getBlogPosts", null);
BlogPostResolver = __decorate([
    type_graphql_1.Resolver((of) => BlogPost_1.default)
], BlogPostResolver);
exports.default = BlogPostResolver;
//# sourceMappingURL=BlogPostResolver.js.map