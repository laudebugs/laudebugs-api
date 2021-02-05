const client = require("contentful").createClient({
  space: "rnmht6wsj5nl",
  accessToken: "_AsjIH6r4ph08uPsSxi_61X8pBSjVP_PSOKOBXpObCM",
});
const getAllPosts = () =>
  client.getEntries().then((response) => response.items);
const getBlogPosts = () =>
  client
    .getEntries({ content_type: "post" })
    .then((response) => response.items);
const getProjects = () =>
  client
    .getEntries({ content_type: "project" })
    .then((response) => response.items);

const getSinglePost = (slug) =>
  client
    .getEntries({
      "fields.slug": slug,
      content_type: "post",
    })
    .then((response) => response.items);

const getSingleExperiment = (slug) =>
  client
    .getEntries({
      "fields.slug": slug,
      content_type: "project",
    })
    .then((response) => response.items);

const getTaggedPost = (tag) =>
  client
    .getEntries({
      "fields.tags": tag,
      content_type: "project",
    })
    .then((response) => response.items);

const getTaggedPosts = (tag) =>
  client
    .getEntries({
      "fields.tags": tag,
      content_type: "post",
    })
    .then((response) => response.items);
const getSectionedPosts = (section) =>
  client
    .getEntries({
      "fields.section": section,
      content_type: "post",
    })
    .then((response) => response.items);

export {
  getTaggedPost,
  getAllPosts,
  getBlogPosts,
  getSinglePost,
  getTaggedPosts,
  getSectionedPosts,
  getProjects,
  getSingleExperiment,
};
