"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const BlogPostResolver_1 = __importDefault(require("./BlogPostResolver"));
const CommentResolver_1 = __importDefault(require("./CommentResolver"));
const RandomImageResolver_1 = __importDefault(require("./RandomImageResolver"));
const SnackResolver_1 = __importDefault(require("./SnackResolver"));
const SpotifyResolver_1 = __importDefault(require("./SpotifyResolver"));
const UserResolver_1 = __importDefault(require("./UserResolver"));
const PostResolver_1 = __importDefault(require("./PostResolver"));
exports.resolvers = [
    BlogPostResolver_1.default,
    UserResolver_1.default,
    CommentResolver_1.default,
    SnackResolver_1.default,
    SpotifyResolver_1.default,
    RandomImageResolver_1.default,
    PostResolver_1.default,
];
//# sourceMappingURL=index.js.map