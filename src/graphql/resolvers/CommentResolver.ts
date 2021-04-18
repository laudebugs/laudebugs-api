import { Query, Resolver } from "type-graphql";
import Comment, { CommentModel } from "../../Models/Comment";
import { PostModel } from "../../Models/Post";

@Resolver((of) => Comment)
export default class CommentResolver {
  @Query((returns) => [Comment])
  async getComments(slug: string): Promise<Comment[]> {
    try {
      let post = await PostModel.findOne({ slug: slug });
      if (post !== null) {
        const getComments = await Promise.all(
          //@ts-ignore
          post.comments.map(async (commentId) => {
            return await CommentModel.findById(commentId);
          })
        );
        const commentsWitData = await Promise.all(
          getComments.map(async (comment) => {
            //@ts-ignore
            let thisUser: any = await User.findById(comment.user);
            let commentUser = thisUser.name;

            return {
              //@ts-ignore

              content: comment.content,
              //@ts-ignore

              approved: comment.approved,
              //@ts-ignore

              createdAt: readableDate(comment.createdAt),
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
        post = new PostModel({
          slug: slug,
          comments: [],
          likes: 0,
        });
        post.save();
        //@ts-ignore

        return post.comments;
      }
    } catch (error) {
      console.log(error.message);
      return [];
    }
  }

  @Query((returns) => [Comment])
  async getUnapprovedComments(): Promise<Comment[]> {
    try {
      let unapprovedComments = await CommentModel.find({ approved: false });

      return unapprovedComments;
    } catch (error) {
      console.log(error.message);
      return [];
    }
  }
}
