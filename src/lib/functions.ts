import cheerio from "cheerio";
import got from "got";
import axios from "axios";
// import mailchimp from "@mailchimp/mailchimp_marketing";
const mailchimp = require("@mailchimp/mailchimp_marketing");
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
  return axios
    .post(githubUrl, { query: query }, { headers: oauth })
    .then((data) => {
      let snacks =
        data.data.data.repository.defaultBranchRef.target.file.object.entries;
      snacks = snacks.filter(
        (snack) =>
          snack.name.substring(snack.name.length - 3) === ".md" &&
          snack.name !== "README.md"
      );
      snacks = snacks.map((snack) => {
        return { fileName: snack.name, body: snack.object.text };
      });
      return snacks;
    });
};

/* Mailchimp integration */
mailchimp.setConfig({
  apiKey: "a8cba921f0e83c43fbcde91a17357c2f-us4",
  server: "us4",
});

export async function addSubscriber(user) {
  const response = await mailchimp.lists.addListMember("8a0a984d69", {
    email_address: user.email,
    status: "subscribed",
    merge_fields: {
      FNAME: user.firstName,
      LNAME: user.lastName,
    },
  });
  console.log(response.id);
}
