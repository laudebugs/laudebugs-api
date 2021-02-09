const express = require("express");
// create the express app
const app = express();
const cors = require("cors");

const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const imageToBase64 = require("image-to-base64");
const feed = require("feed");
const publicPath = path.resolve(__dirname, "public");

app.use(cors());
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
const Note = mongoose.model("Note");

/**
 * Configure cors headers
 * Reference: https://stackoverflow.com/questions/51017702/enable-cors-in-fetch-api
 */
app.use((req, res, next) => {
  const allowedOrigins = ["http://laudebugs.me", "http://localhost:3000"];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  //res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:8020');
  res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", true);
  return next();
});
/**
 * Return all the podcasts with their likes
 * TODO: Implement
 */
app.get("/allpostdata", async (req, res) => {
  let allPosts = await Post.find();
  console.log(allPosts);
  res.json({ data: allPosts });
});
/**
 * Gets the comments on a specific post
 */
app.get("/comments", async (req, res) => {
  const slug = req.query.slug;
  try {
    let post = await Post.findOne({ slug: slug });
    if (post !== null) {
      const getComments = await Promise.all(
        post.comments.map(async (commentId) => {
          return await Comment.findById(commentId);
        })
      );
      const commentsWitData = await Promise.all(
        getComments.map(async (comment) => {
          let thisUser = await User.findById(comment.user);
          commentUser = thisUser.name;

          return {
            content: comment.content,
            approved: comment.approved,
            createdAt: comment.createdAt,
            user: commentUser,
          };
        })
      );
      res.json({
        comments: commentsWitData.filter((comment) => comment.approved),
        slug: slug,
      });
    } else {
      /**
       * Post is not created??
       * TODO: Find the cases where this happens
       */
      post = new Post({
        slug: slug,
        comments: [],
        likes: 0,
      });
      post.save().then(() => {
        res.json({ comments: [], slug: slug });
      });
    }
  } catch (error) {
    console.log(error.message);
    res.json({ commments: [], slug: slug });
  }
});
/**
 * Posts a comment to a specific post
 */
app.post("/comment", async (req, res) => {
  console.log(req.body);
  const data = req.body;
  /**
   * Find the User, if they don't
   *  exist,
   * create a new user
   *
   * TODO: Find out how to moderate the comments and approve comments for users who have previously
   * had comments approved
   *
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
      let userName;
      if (!data.name) {
        let atIndx = data.email.indexOf("@");
        userName = data.email.substring(0, atIndx);
        console.log(userName);
      } else {
        userName = data.name;
        console.log(userName);
      }
      currentUser = new User({
        name: userName,
        email: data.email,
      });
    }
    console.log("Comment -> " + data.comment);
    const newComment = new Comment({
      content: data.comment,
      user: currentUser._id,
      likes: 0,
      approved: false,
      moderated: false,
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
    console.log(error.message);
    /**
     * If an error occurs
     */
    res.json({ saved: false });
  }
});

/**
 * User sending a note, suggestion
 */
app.post("/note", async (req, res) => {
  const note = req.body;
  console.log(note);
  try {
    let usr = await User.findOne({ email: note.email });
    if (!usr) {
      usr = new User({ name: note.name, email: note.email });
    }
    let newNote = new Note({
      subject: note.subject,
      note: note.note,
      user: usr._id,
    });

    usr.notes.push(newNote._id);

    usr.save().then(() => {
      newNote.save().then(() => {
        res.json({ posted: true });
      });
    });
  } catch (error) {
    res.json({ posted: false });
  }
});

/**
 * User signing up for newsletter
 */
app.post("/signup", async (req, res) => {
  let user = req.body;
  try {
    let usr = await User.findOne({ email: user.email });
    if (!usr) {
      usr = new User({ name: user.name, email: user.email });
    }

    usr.sneekpeeks = user.sneekpeeks;
    usr.newposts = user.newposts;

    usr.save().then(() => {
      res.json({ saved: true });
    });
  } catch (error) {
    res.json({ saved: false });
  }
});
app.get("/feed", (req, res) => {
  const feed = new Feed({
    title: "Feed Title",
    description: "This is my personal feed!",
    id: "http://example.com/",
    link: "http://example.com/",
    language: "en", // optional, used only in RSS 2.0, possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
    image: "http://example.com/image.png",
    favicon: "http://example.com/favicon.ico",
    copyright: "All rights reserved 2013, John Doe",
    updated: new Date(2013, 6, 14), // optional, default = today
    generator: "awesome", // optional, default = 'Feed for Node.js'
    feedLinks: {
      json: "https://example.com/json",
      atom: "https://example.com/atom",
    },
    author: {
      name: "John Doe",
      email: "johndoe@example.com",
      link: "https://example.com/johndoe",
    },
  });
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
    let post = await Post.findOne({ slug: slug });
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
  console.log(req.body);
  try {
    let post = await Post.findOne({ slug: slug });
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
    console.log(error.message);
    res.json({ likes: -1 });
  }
});
/**
 * Image proxy link
 */

app.post(`/photo`, function (req, res) {
  let url = req.body.link;

  imageToBase64(url) // Image URL
    .then((response) => {
      res.json({ image: response });
    })
    .catch((error) => {
      console.log(error); // Logs an error if there was one
    });
});
/**
 * Gets a random EyeEm image
 */
app.get("/allposts", (req, res) => {
  const client = require("contentful").createClient({
    space: "rnmht6wsj5nl",
    accessToken: "_AsjIH6r4ph08uPsSxi_61X8pBSjVP_PSOKOBXpObCM",
  });
  const getAllPosts = () =>
    client.getEntries().then(async (response) => {
      const posts = response.items.sort(function (a, b) {
        return new Date(b.fields.date) - new Date(a.fields.date);
      });
      const getPosts = await Promise.all(
        posts.map(async (post) => {
          let base64 = await imageToBase64(
            "https:" + post.fields.feature_image.fields.file.url
          ); // Image URL
          post.fields.feature_image.fields.file.url =
            "data:image/jpeg;base64," + base64;
          return post;
        })
      );
      res.json({ posts: posts });
    });
  getAllPosts();
});
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
app.get("/unapprovedComments", async (req, res) => {
  try {
    let unapprovedComments = await Comment.find({ approved: false });
    res.json({ comments: unapprovedComments });
  } catch (error) {
    console.log(error.message);
    res.json({ comments: [] });
  }
});
app.post("/approvecomment", async (req, res) => {
  const id = req.body.id;
  try {
    const comment = await Comment.findById(id);
    comment.approved = true;
    comment.moderated = true;
    comment.save().then(() => {
      console.log("saved");
      res.json({ saved: true });
    });
  } catch (error) {
    console.log(error.message);
  }
});
app.get("*", (req, res) => {
  res.send("welcome to lau de bugs's api");
});
/**
 * Posts a request to delete any identifying information for a user - email, name, comments
 */
app.post("/deleterequest", (req, res) => {});
app.listen(process.env.PORT || 4000, () => console.log("Server is running..."));
