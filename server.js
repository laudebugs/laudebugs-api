const express = require("express");
// create the express app
const app = express();

const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const publicPath = path.resolve(__dirname, "public");

/**
 * Cheerio and got are used to parse EyeEm photos by webscraping my user profile
 */
const cheerio = require("cheerio");
const got = require("got");

const { Db } = require("mongodb");
require("./lib/db");
// Add middleware
app.use(express.static(publicPath));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const Post = mongoose.model("Post");
const User = mongoose.model("User");
const Comment = mongoose.model("Comment");

/**
 * Gets the comments on a specific post
 */
app.get("/comments/:slug", async (req, res) => {
  const slug = req.params.slug;
  console.log(slug);
  try {
    const post = await Post.findOne({ slug: slug });
    if (post !== null) {
      const getComments = await Promise.all(
        post.comments.map(async (commentId) => {
          return await Comment.findById(commentId);
        })
      );
      res.json({ comments: getComments });
    } else {
      /**
       * Post is not created??
       * TODO: Find the cases where this happens
       */
      res.json({ comments: [] });
    }
  } catch (error) {
    res.json({ commments: [] });
  }
});
/**
 * Posts a comment to a specific post
 */
app.post("/comment", async (req, res) => {
  const data = req.body;
  /**
   * Find the User, if they don't exist,
   * create a new user
   */
  try {
    let post = await Post.findOne({ slug: data.slug });
    if (post === null) {
      post = new Post({
        slug: data.slug,
        comments: [],
        likes: 0,
      });
    }
    // TODO: Save current Post later
    console.log(post);
    let currentUser = await User.findOne({ email: data.email });
    if (currentUser === null) {
      currentUser = new User({
        name: data.name,
        email: data.email,
      });
    }
    const newComment = new Comment({
      content: data.comment,
      user: currentUser._id,
      likes: 0,
    });
    post.comments.push(newComment._id);
    currentUser.comments.push(newComment._id);
    currentUser.save().then(
      post.save().then(
        newComment.save().then(() => {
          res.json({
            saved: true,
            note: "comment awaiting moderation",
          });
        })
      )
    );
  } catch (error) {
    /**
     * If an error occurs
     */
    res.json({ saved: false });
  }
});

/**
 * Gets a user details - Name, email, comments ids
 */
app.get("/user", (req, res) => {});
/**
 * Adds a user to the database
 */
app.post("/user", (req, res) => {});

/**
 * Gets the likes on a specific post
 */
app.get("/likes/:slug", async (req, res) => {
  const slug = req.params.slug;
  console.log(slug);
  try {
    const post = await Post.findOne({ slug: slug });
    if (post !== null) {
      res.json({ likes: post.likes });
    } else {
      post = new Post({
        slug: slug,
        likes: 0,
      });
      post.save().then(() => {
        res.json({ likes: post.likes });
      });
    }
  } catch (error) {
    /**
     * Means there was an error in retrieving the post likes or
     * in saving the post likes
     */
    res.json({ likes: -1 });
  }
});
/**
 * Posts a like
 */
app.post("/like", async (req, res) => {
  let slug = req.body.slug;

  try {
    const post = await Post.findOne({ slug: slug });
    if (post === null) {
      post = new Post({
        slug: slug,
        likes: 0,
      });
    }
    post.likes += 1;
    post.save().then(() => {
      res.json({ likes: post.likes });
    });
  } catch (error) {
    res.json({ likes: -1 });
  }
});

/**
 * Gets a random EyeEm image
 */
app.get("/randomImage", (req, res) => {
  const url = "https://www.eyeem.com/u/laudebugs";

  got(url)
    .then((response) => {
      const $ = cheerio.load(response.body);
      const images = $("figure a img");

      const no_images = $("figure a img").length;
      const randomNo = Math.floor(Math.random() * no_images + 1);
      // select a random number between 0 and no_images-1
      res.json({
        link: images[randomNo].attribs.src,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});
app.get("*", (req, res) => {
  res.send("welcome to lau de bugs's api");
});
/**
 * Posts a request to delete any identifying information for a user - email, name, comments
 */
app.post("/deleterequest", (req, res) => {});
app.listen(process.env.PORT || 4000, () => console.log("Server is running..."));
