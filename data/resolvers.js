import { Post, User, Note, Comment } from "../lib/db";
// Resolver map
export const resolvers = {
  Query: {
    getPost: ({ slug }) => {
      return new Post(slug, postDatabase[slug]);
    },
  },
  Mutation: {
    createPost: (root, { input }) => {
      const newPost = new Post({
        slug: input.slug,
        likes: 0,
        comments: [],
      });
      newPost.id = newPost._id;

      return new Promise((resolve, object) => {
        newPost.save((err) => {
          if (err) reject(err);
          else resolve(object);
        });
      });
    },
  },
};
