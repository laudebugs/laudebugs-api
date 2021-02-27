import { buildSchema } from "graphql";

const schema = buildSchema(`
    type Post{
        slug:String
        likes:Int
        comments:[Comment]
    }
    type Comment{
        content:String
    }
    input PostInput{
        slug:String
        likes:Int
        comments:[Comment]
    }
    type Mutation {
        createPost(input:PostInput):Post
    }
    type Query {
        getPost(slug:String):Post
    }
`);
export default schema;
