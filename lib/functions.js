import cheerio from "cheerio";
import got from "got";

export const getRandomImage = () => {
  const url = "https://www.eyeem.com/u/laudebugs";

  got(url)
    .then((response) => {
      const $ = cheerio.load(response.body);
      const images = $("figure a img");

      const no_images = $("figure a img").length;
      const randomNo = Math.floor(Math.random() * no_images + 1);
      // select a random number between 0 and no_images-1
      return images[randomNo].attribs.src;
    })
    .catch((err) => {
      return null;
    });
};
