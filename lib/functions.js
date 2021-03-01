import cheerio from "cheerio";
import got from "got";

export async function getRandomImage() {
  const url = "https://www.eyeem.com/u/laudebugs";
  let page = await got(url);

  const $ = cheerio.load(page.body);
  const images = $("figure a img");

  const no_images = $("figure a img").length;
  const randomNo = Math.floor(Math.random() * no_images + 1);
  // select a random number between 0 and no_images-1
  return images[randomNo].attribs.src;
}

export function readableDate(dateString) {
  return new Date(dateString).toDateString();
}
