const axios = require("axios");
const cheerio = require("cheerio");

async function fetchHTML(url) {
  const { data } = await axios.get(url);
  return cheerio.load(data);
}
const ch = fetchHTML("https://www.eyeem.com/u/laudebugs");

// Print the full HTML
console.log(`Site HTML: ${ch.html()}\n\n`);

// Print some specific page content
