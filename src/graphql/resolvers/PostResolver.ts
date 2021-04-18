import { Mutation, Query, Resolver } from "type-graphql";
import Post, { PostModel } from "../../Models/Post";

@Resolver((of) => Post)
export default class PostResolver {
  @Query((returns) => [Post])
  async getPosts(): Promise<Post[]> {
    const posts: Post[] = await PostModel.find();
    return posts;
  }

  @Query((returns) => Number)
  async getLikes(root, { slug }): Promise<number> {
    try {
      let post: Post | any = await PostModel.findOne({ slug: slug });

      if (post !== null) {
        return post.likes;
      } else {
        post = new PostModel({
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
  }

  @Mutation((returns) => Number)
  async postLike(root, { slug }): Promise<number> {
    console.log(slug);
    try {
      let post: Post | any = await PostModel.findOne({ slug: slug });
      if (post === null) {
        post = new PostModel({
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
  }
}
