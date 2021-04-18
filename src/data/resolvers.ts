// import { documentToHtmlString } from "@contentful/rich-text-html-renderer";
// import spotifyClient from "../clients/spotify";
// import { getAllPosts } from "../lib/contentful";
// import {
//   addSubscriber,
//   getRandomImage,
//   getSnacks,
//   readableDate,
// } from "../lib/functions";
// import { Comment, Note, Post, User } from "./dbConnectors";
// import { PostType } from "../Models/Post";

// // Resolver map
// export const resolvers = {
//   Query: {
//     getUser: () => {},
//     getPosts: () => {
//       return Post.find();
//     },
//     getSnacks: async () => {
//       return getSnacks().then((data) => {
//         let snacks =
//           data.data.data.repository.defaultBranchRef.target.file.object.entries;
//         snacks = snacks.filter(
//           (snack) =>
//             snack.name.substring(snack.name.length - 3) === ".md" &&
//             snack.name !== "README.md"
//         );
//         snacks = snacks.map((snack) => {
//           return { fileName: snack.name, body: snack.object.text };
//         });
//         return snacks;
//       });
//     },
//     getPost: () => {},
//     getBlogPosts: async () => {
//       let posts = await getAllPosts();
//       //@ts-ignore

//       let data = posts.map(<T>(post) => {
//         let bodyType = typeof post.fields.body;
//         post.fields.body =
//           bodyType !== "string"
//             ? documentToHtmlString(post.fields.body)
//             : post.fields.body;
//         return new PostType(
//           readableDate(post.fields.date),
//           post.fields.slug,
//           post.fields.title,
//           post.fields.description,
//           post.fields.body,
//           post.fields.feature_image.fields.file.url,
//           post.fields.tags || [],
//           post.fields.section || [],
//           0,
//           post.sys.contentType.sys.id
//         );
//       });

//       return data;
//     },
//     getSpotifyAlbums: async (root, { query }) => {
//       return spotifyClient
//         .request(`https://api.spotify.com/v1/${query}`)
//         .then(function (data) {
//           let sth = JSON.stringify(data);
//           return sth;
//         })
//         .catch((err) => {
//           console.log(err.message);
//           return err.message;
//         });
//     },
//     //@ts-ignore
//     getUser: () => {},
//     /**
//      * Gets comments based on a slug
//      */
//     getComments: async (root, { slug }) => {
//       try {
//         let post = await Post.findOne({ slug: slug });
//         if (post !== null) {
//           const getComments = await Promise.all(
//             //@ts-ignore
//             post.comments.map(async (commentId) => {
//               return await Comment.findById(commentId);
//             })
//           );
//           const commentsWitData = await Promise.all(
//             getComments.map(async (comment) => {
//               //@ts-ignore
//               let thisUser: any = await User.findById(comment.user);
//               let commentUser = thisUser.name;

//               return {
//                 //@ts-ignore

//                 content: comment.content,
//                 //@ts-ignore

//                 approved: comment.approved,
//                 //@ts-ignore

//                 createdAt: readableDate(comment.createdAt),
//                 user: { name: commentUser },
//               };
//             })
//           );
//           return commentsWitData.filter((comment) => comment.approved);
//         } else {
//           /**
//            * Post is not created??
//            * TODO: Find the cases where this happens
//            */
//           post = new Post({
//             slug: slug,
//             comments: [],
//             likes: 0,
//           });
//           post.save();
//           //@ts-ignore

//           return post.comments;
//         }
//       } catch (error) {
//         console.log(error.message);
//         return [];
//       }
//     },
//     getUnapprovedComments: async () => {
//       try {
//         let unapprovedComments = await Comment.find({ approved: false });

//         return unapprovedComments;
//       } catch (error) {
//         console.log(error.message);
//         return [];
//       }
//     },
//     getNotes: () => {},
//     getLikes: async (root, { slug }) => {
//       try {
//         let post = await Post.findOne({ slug: slug });

//         if (post !== null) {
//           //@ts-ignore
//           return post.likes;
//         } else {
//           post = new Post({
//             slug: slug,
//             likes: 0,
//           });
//           post.save();
//           //@ts-ignore
//           return post.likes;
//         }
//       } catch (error) {
//         /**
//          * Means there was an error in retrieving the post likes or
//          * in saving the post likes
//          */
//         return -1;
//       }
//     },
//     getRandomImage: async () => {
//       let image = await getRandomImage();
//       return { url: image };
//     },
//   },
//   Mutation: {
//     createPost: (root, { input }) => {
//       const newPost = new Post({
//         slug: input.slug,
//         likes: 0,
//         comments: [],
//       });
//       newPost.id = newPost._id;

//       return new Promise((resolve, reject) => {
//         newPost.save((err) => {
//           if (err) reject(err);
//           else resolve(newPost);
//         });
//       });
//     },
//     createComment: async (root, { data }) => {
//       try {
//         let post = await Post.findOne({ slug: data.slug });
//         if (post === null) {
//           post = new Post({
//             slug: data.slug,
//             comments: [],
//             likes: 0,
//           });
//         }
//         // TODO: Save current Post later
//         let currentUser = await User.findOne({ email: data.email });
//         if (currentUser === null) {
//           let userName;
//           if (!data.name) {
//             let atIndx = data.email.indexOf("@");
//             userName = data.email.substring(0, atIndx);
//             console.log(userName);
//           } else {
//             userName = data.name;
//             console.log(userName);
//           }
//           currentUser = new User({
//             name: userName,
//             email: data.email,
//           });
//         }
//         const newComment = new Comment({
//           content: data.comment,
//           user: currentUser._id,
//           likes: 0,
//           approved: false,
//           moderated: false,
//         });
//         //@ts-ignore
//         post.comments.push(newComment._id);
//         //@ts-ignore
//         currentUser.comments.push(newComment._id);
//         currentUser.save();
//         post.save();
//         newComment.save();

//         return newComment;
//       } catch (error) {
//         console.log(error.message);
//         /**
//          * If an error occurs
//          */
//         return null;
//       }
//     },
//     createNote: async (root, { note }) => {
//       try {
//         let usr = await User.findOne({ email: note.email });
//         if (!usr) {
//           usr = new User({ name: note.name, email: note.email });
//         }
//         let newNote = new Note({
//           subject: note.subject,
//           note: note.note,
//           user: usr._id,
//         });
//         //@ts-ignore
//         usr.notes.push(newNote._id);

//         usr.save().then(() => {
//           newNote.save();
//         });
//         return newNote;
//       } catch (error) {
//         return null;
//       }
//     },
//     userSignUp: async (root, { user }) => {
//       try {
//         let usr = await User.findOne({ email: user.email });
//         if (!usr) {
//           usr = new User({ name: user.name, email: user.email });
//         }
//         //@ts-ignore
//         usr.sneekpeeks = user.sneekpeeks;
//         //@ts-ignore
//         usr.newposts = user.newposts;

//         usr.save();

//         let subRequest = addSubscriber({
//           email: user.email,
//           firstName: user.name,
//           lastName: user.name,
//         });
//         subRequest.then(() => {
//           return usr;
//         });
//       } catch (error) {
//         return null;
//       }
//     },
//     postLike: async (root, { slug }) => {
//       console.log(slug);
//       try {
//         let post = await Post.findOne({ slug: slug });
//         if (post === null) {
//           post = new Post({
//             slug: slug,
//             likes: 0,
//           });
//         }
//         //@ts-ignore
//         post.likes += 1;
//         post.save();
//         //@ts-ignore
//         return post.likes;
//       } catch (error) {
//         return -1;
//       }
//     },
//   },
// };
