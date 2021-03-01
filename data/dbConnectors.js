import mongoose from "mongoose";
const Schema = mongoose.Schema;
import emailValidator from "email-validator";
// import the configuration file for the mongodb database
console.log(process.env.MONGO_DB);
let dbconf = process.env.MONGO_DB;

// connect to the database
mongoose.connect(dbconf, {
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
const CommentSchema = new Schema(
  {
    content: String,
    user: { type: Schema.ObjectId, ref: "User" },
    likes: Number,
    approved: false,
    moderated: false,
  },
  {
    timestamps: true,
  }
);
const NoteSchema = new Schema({
  note: String,
  subject: String,
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
      validator: emailValidator.validate,
      message: (props) => `${props.value} is not a valid email address`,
    },
    index: { unique: true },
  },
  sneekpeeks: false,
  newposts: false,
  notes: [{ type: Schema.Types.ObjectId, ref: "Note" }],
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
});
const Post = mongoose.model("Post", PostSchema);
const User = mongoose.model("User", UserSchema);
const Note = mongoose.model("Note", NoteSchema);
const Comment = mongoose.model("Comment", CommentSchema);

export { Post, User, Note, Comment };
