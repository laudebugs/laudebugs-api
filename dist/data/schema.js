"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = void 0;
const resolvers_js_1 = require("./resolvers.js");
const graphql_tools_1 = require("graphql-tools");
// Define types
const typeDefs = `
    type User {
        id: ID
        name: String
        email: String
        sneekpeeks: Boolean
        newposts: Boolean
        notes: [Note]
    }
    type Note {
        id: ID
        note: String
        subject: String
        user: User
    }
    type Comment {
        id: ID
        content: String
        user: User
        approved: Boolean
        moderated: Boolean
        createdAt: String
    }
    type Post {
        id: ID
        slug: String
        likes: Int
        comments: [Comment]

    }

    type BlogPost {
        slug: String
        title: String
        description: String
        body: String
        date: String
        featuredImage: String
        section: [String]
        tags: [String]
        comments: [Comment]
        likes: Int
        likeLevel: Int
        type: String
    }
    
    type RandomImage {
        url: String
    }
    
    input UserInput {
        id: ID
        name: String
        email: String
        sneekpeeks: Boolean
        newposts: Boolean
        notes: [NoteInput]
    }
    input NoteInput {
        note: String
        subject: String
        email: String
        name: String
    }
    input CommentInput {
        comment: String
        email: String
        name: String
        slug: String
    }
    input PostInput {
        slug: String
        likes: Int
        comments: [CommentInput]
    }
    type Snack {
        body:String
        fileName:String
    }
    type Query {
        getUser: User
        getComments (slug: String!): [Comment]
        getNotes: [Note]
        getPosts: [Post]
        getPost: Post
        getLikes (slug: String!): Int
        getBlogPosts: [BlogPost]
        getRandomImage: RandomImage
        getUnapprovedComments: [Comment]
        getSnacks:[Snack]
    }

    type Mutation {
        createUser (user: UserInput) : User
        createNote (note: NoteInput) : Note
        createPost (input: PostInput) : Post
        createComment (data: CommentInput): Comment
        postLike (slug: String!): Int
        userSignUp (user: UserInput): User
    }
`;
const schema = graphql_tools_1.makeExecutableSchema({ typeDefs, resolvers: resolvers_js_1.resolvers });
exports.schema = schema;
//# sourceMappingURL=schema.js.map