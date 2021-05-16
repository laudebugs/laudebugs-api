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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentModel = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const type_graphql_1 = require("type-graphql");
const User_1 = __importDefault(require("./User"));
let Comment = class Comment {
};
__decorate([
    type_graphql_1.Field(),
    typegoose_1.prop({ default: "" }),
    __metadata("design:type", String)
], Comment.prototype, "content", void 0);
__decorate([
    type_graphql_1.Field((type) => User_1.default),
    typegoose_1.prop({ ref: "User" }),
    __metadata("design:type", Object)
], Comment.prototype, "user", void 0);
__decorate([
    type_graphql_1.Field(),
    typegoose_1.prop({ default: 0 }),
    __metadata("design:type", Number)
], Comment.prototype, "likes", void 0);
__decorate([
    type_graphql_1.Field(),
    typegoose_1.prop({ default: false }),
    __metadata("design:type", Boolean)
], Comment.prototype, "moderated", void 0);
__decorate([
    type_graphql_1.Field(),
    typegoose_1.prop({ default: false }),
    __metadata("design:type", Boolean)
], Comment.prototype, "approved", void 0);
__decorate([
    type_graphql_1.Field((type) => Date),
    typegoose_1.prop(),
    __metadata("design:type", Date)
], Comment.prototype, "createdAt", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], Comment.prototype, "user_name", void 0);
Comment = __decorate([
    type_graphql_1.ObjectType()
], Comment);
exports.default = Comment;
exports.CommentModel = typegoose_1.getModelForClass(Comment);
//# sourceMappingURL=Comment.js.map