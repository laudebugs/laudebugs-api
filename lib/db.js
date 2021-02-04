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
const User = new Schema({
  name: String,
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    index: { unique: true },
    validate: {
      validator: emailValidator.validate,
      message: (props) => `${props.value} is not a valid email address`,
    },
    index: { unique: true },
  },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
});
const Image = new Schema({ img: { data: Buffer, contentType: String } });
mongoose.model("Image", Image);
mongoose.model("Post", Post);
mongoose.model("User", User);
mongoose.model("Comment", Comment);

// import the configuration file for the mongodb database
const fs = require("fs");
const fn = "src/config.json";
const data = fs.readFileSync(fn);

const conf = JSON.parse(data);
let dbconf = conf.dbconf;

// connect to the database
mongoose.connect(dbconf, { useNewUrlParser: true, useUnifiedTopology: true });
