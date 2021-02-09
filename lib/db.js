const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const emailValidator = require("email-validator");

const Post = new Schema({
  slug: {
    type: String,
    required: true,
    index: { unique: true },
  },
  likes: Number,
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
});
const Comment = new Schema(
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
const Note = new Schema({
  note: String,
  subject: String,
  user: { type: Schema.ObjectId, ref: "User" },
});
const User = new Schema({
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
mongoose.model("Post", Post);
mongoose.model("User", User);
mongoose.model("Note", Note);
mongoose.model("Comment", Comment);

// import the configuration file for the mongodb database
const fs = require("fs");
const fn = "src/config.json";
const data = fs.readFileSync(fn);

const conf = JSON.parse(data);
let dbconf = conf.dbconf;

// connect to the database
mongoose.connect(dbconf, { useNewUrlParser: true, useUnifiedTopology: true });
