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

// Add middleware
app.use(express.static(publicPath));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Gets the comments on a specific post
 */
app.get("/comments", (req, res) => {});
/**
 * Posts a comment to a specific post
 */
app.post("/comment", (req, res) => {});

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
app.get("/likes", (req, res) => {});
/**
 * Posts a like
 */
app.post("/like", (req, res) => {});

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
/**
 * Posts a request to delete any identifying information for a user - email, name, comments
 */
app.post("/deleterequest", (req, res) => {});
app.listen(process.env.PORT || 4000, () => console.log("Server is running..."));
