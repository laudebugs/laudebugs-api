import { documentToHtmlString } from "@contentful/rich-text-html-renderer";

import { Post, User, Note, Comment } from "./dbConnectors";
import { getAllPosts } from "../lib/contentful";
import { getRandomImage } from "../lib/functions";
// Resolver map
export const resolvers = {
  Query: {
    getUser: () => {},
    getPosts: () => {
      return Post.find();
    },
    getPost: () => {},
    getBlogPosts: async () => {
      let posts = await getAllPosts();
      posts.sort(function (a, b) {
        return new Date(b.fields.date) - new Date(a.fields.date);
      });
      let data = posts.map((post) => {
        let bodyType = typeof post.fields.body;
        post.fields.body =
          bodyType !== "string"
            ? documentToHtmlString(post.fields.body)
            : post.fields.body;
        return {
          slug: post.fields.slug,
          title: post.fields.title,
          description: post.fields.description,
          body: post.fields.body,
          date: post.fields.date,
          featuredImage: post.fields.feature_image.fields.file.url,
          section: post.fields.tags,
          tags: post.fields.section,
        };
      });
      return data;
    },
    getUser: () => {},
    /**
     * Gets comments based on a slug
     */
    getComments: async (root, { slug }) => {
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
              let commentUser = thisUser.name;

              return {
                content: comment.content,
                approved: comment.approved,
                createdAt: comment.createdAt,
                user: { name: commentUser },
              };
            })
          );
          return commentsWitData.filter((comment) => comment.approved);
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
          post.save();
          return post.comments;
        }
      } catch (error) {
        console.log(error.message);
        return [];
      }
    },
    getUnapprovedComments: async () => {
      try {
        let unapprovedComments = await Comment.find({ approved: false });

        return unapprovedComments;
      } catch (error) {
        console.log(error.message);
        return [];
      }
    },
    getNotes: () => {},
    getLikes: async (root, { slug }) => {
      try {
        let post = await Post.findOne({ slug: slug });

        if (post !== null) {
          return post.likes;
        } else {
          post = new Post({
            slug: slug,
            likes: 0,
          });
          post.save();
          return post.likes;
        }
      } catch (error) {
        /**
         * Means there was an error in retrieving the post likes or
         * in saving the post likes
         */
        return -1;
      }
    },
    getRandomImage: async () => {
      let image = await getRandomImage();
      return { url: image };
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

      return new Promise((resolve, reject) => {
        newPost.save((err) => {
          if (err) reject(err);
          else resolve(newPost);
        });
      });
    },
    createComment: async (root, { data }) => {
      /**
       * Find the User, if they don't
       *  exist,
       * create a new user
       *
       * TODO: Find out how to moderate the comments and approve comments for users who have previously
       * had comments approved
       *
       */
      console.log(data);
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
        currentUser.save();
        post.save();
        newComment.save();

        return newComment;
      } catch (error) {
        console.log(error.message);
        /**
         * If an error occurs
         */
        return null;
      }
    },
    createNote: async (root, { note }) => {
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
          newNote.save();
        });
        return newNote;
      } catch (error) {
        return null;
      }
    },
    userSignUp: async (root, { user }) => {
      try {
        let usr = await User.findOne({ email: user.email });
        if (!usr) {
          usr = new User({ name: user.name, email: user.email });
        }

        usr.sneekpeeks = user.sneekpeeks;
        usr.newposts = user.newposts;

        usr.save();
        return usr;
      } catch (error) {
        return null;
      }
    },
    postLike: async (root, { slug }) => {
      try {
        let post = await Post.findOne({ slug: slug });
        if (post === null) {
          post = new Post({
            slug: slug,
            likes: 0,
          });
        }
        post.likes += 1;
        post.save();
        return post.likes;
      } catch (error) {
        return -1;
      }
    },
  },
};
