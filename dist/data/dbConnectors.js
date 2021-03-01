"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = exports.Note = exports.User = exports.Post = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const email_validator_1 = __importDefault(require("email-validator"));
// import the configuration file for the mongodb database
console.log(process.env.MONGO_DB);
//@ts-ignore
let dbconf = process.env.MONGO_DB;
// connect to the database
//@ts-ignore
mongoose_1.default.connect(dbconf, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
});
// Define the Schemas to be used in the database
const PostSchema = new Schema({
    slug: {
        type: String,
        required: true,
        index: { unique: true },
    },
    likes: Number,
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
});
const CommentSchema = new Schema({
    content: String,
    //@ts-ignore
    user: { type: Schema.ObjectId, ref: "User" },
    likes: Number,
    //@ts-ignore
    approved: false,
    //@ts-ignore
    moderated: false,
}, {
    timestamps: true,
});
const NoteSchema = new Schema({
    note: String,
    //@ts-ignore
    user: { type: Schema.ObjectId, ref: "User" },
});
const UserSchema = new Schema({
    name: String,
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: email_validator_1.default.validate,
            message: (props) => `${props.value} is not a valid email address`,
        },
        index: { unique: true },
    },
    //@ts-ignore
    sneekpeeks: false,
    //@ts-ignore
    newposts: false,
    notes: [{ type: Schema.Types.ObjectId, ref: "Note" }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
});
const Post = mongoose_1.default.model("Post", PostSchema);
exports.Post = Post;
const User = mongoose_1.default.model("User", UserSchema);
exports.User = User;
const Note = mongoose_1.default.model("Note", NoteSchema);
exports.Note = Note;
const Comment = mongoose_1.default.model("Comment", CommentSchema);
exports.Comment = Comment;
//# sourceMappingURL=dbConnectors.js.map