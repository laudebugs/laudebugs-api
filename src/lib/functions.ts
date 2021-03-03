import cheerio from "cheerio";
import got from "got";
import axios from "axios";

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

export function readableDate(dateString: number): String {
  return new Date(dateString).toDateString();
}

const githubUrl = "https://api.github.com/graphql";

const oauth = { Authorization: "bearer " + process.env.GH_TOKEN };
const query = `
           {
             repository(owner: "lbugasu", name: "articles") {
               defaultBranchRef {
                 target {
                   ... on Commit {
                     file(path: "/") {
                       type
                       object {
                         ... on Tree {
                           entries {
                             name
                             object {
                               ... on Blob {
                                 text
                               }
                             }
                           }
                         }
                       }
                     }
                   }
                 }
               }
             }
           }
         `;
export const getSnacks = () => {
  return axios.post(githubUrl, { query: query }, { headers: oauth });
};
