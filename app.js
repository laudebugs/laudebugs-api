const express = require("express");
const app = express();

const cheerio = require("cheerio");
const got = require("got");

const url = "https://www.eyeem.com/u/laudebugs";

app.get("/randomImage", (req, res) => {
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

app.listen(process.env.PORT || 4000, () => console.log("Server is running..."));
