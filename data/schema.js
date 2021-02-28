import { resolvers } from "./resolvers";
import { makeExecutableSchema } from "graphql-tools";

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
        user: UserInput
    }
    input CommentInput {
        content: String
        user: UserInput
        approved: Boolean
        moderated: Boolean
    }
    input PostInput {
        slug: String
        likes: Int
        comments: [CommentInput]
    }

    type Query {
        getUser: User
        getComments (slug: String!): [Comment]
        getNotes: [Note]
        getPosts: [Post]
        getPost: Post
        getLikes (slug: String!): Int
        getBlogPosts: [BlogPost]
        getRandomImage: String
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

const schema = makeExecutableSchema({ typeDefs, resolvers });

export { schema };
