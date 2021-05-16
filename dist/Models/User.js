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
exports.UserModel = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const type_graphql_1 = require("type-graphql");
const Comment_1 = __importDefault(require("./Comment"));
const Note_1 = __importDefault(require("./Note"));
const email_validator_1 = __importDefault(require("email-validator"));
let User = class User {
};
__decorate([
    type_graphql_1.Field(),
    typegoose_1.prop(),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(),
    typegoose_1.prop({ unique: true, validate: { validator: email_validator_1.default.validate,
            message: (props) => `${props.value} is not a valid email address`, } }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    type_graphql_1.Field(),
    typegoose_1.prop(),
    __metadata("design:type", Boolean)
], User.prototype, "sneekpeeks", void 0);
__decorate([
    type_graphql_1.Field(),
    typegoose_1.prop(),
    __metadata("design:type", Boolean)
], User.prototype, "newposts", void 0);
__decorate([
    type_graphql_1.Field((type) => [Note_1.default]),
    typegoose_1.prop({ ref: "Note", default: [] }),
    __metadata("design:type", Array)
], User.prototype, "notes", void 0);
__decorate([
    type_graphql_1.Field((type) => [Comment_1.default]),
    typegoose_1.prop({ ref: "Comment", default: [] }),
    __metadata("design:type", Array)
], User.prototype, "comments", void 0);
User = __decorate([
    type_graphql_1.ObjectType()
], User);
exports.default = User;
exports.UserModel = typegoose_1.getModelForClass(User);
//# sourceMappingURL=User.js.map