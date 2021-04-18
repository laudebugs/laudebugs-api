import User, { UserModel } from './../../Models/User';
import { InputType, Mutation, Query, Resolver } from "type-graphql";
import Comment, { CommentModel } from "../../Models/Comment";
import { PostModel } from "../../Models/Post";
import { readableDate } from '../../lib/functions';

!InputType();
class CommentInput {
        public comment!: string;
  public email!:string
    public     name!: string
      public   slug!: string
    }
@Resolver((of) => Comment)
export default class CommentResolver {
  @Query((returns) => [Comment])
  async getComments(slug: string): Promise<Comment[] | null> {
    try {
      let post = await PostModel.findOne({ slug: slug });
      if (post !== null) {
        const getComments: (Comment|null)[]  = await Promise.all(
          post.comments.map(async (commentId): Promise<Comment| null> => {
            return await CommentModel.findById(commentId);
          })
        );
        const commentsWitData = await Promise.all(
          getComments.map(async (comment: Comment ): Promise<Comment>=> {
            let thisUser: User | any = await UserModel.findById(comment.user);
            let commentUser = thisUser.name;

            return {
              user_name: commentUser,
              ...comment
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

        return [];
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

  @Mutation((returns)=>Comment)

  async createComment (data:CommentInput): Promise<Comment |null>{
      try {
        let post = await PostModel.findOne({ slug: data.slug });
        if (post === null) {
          post = new PostModel({
            slug: data.slug,
            comments: [],
            likes: 0,
          });
        }
        // TODO: Save current Post later
        let currentUser: User | any = await UserModel.findOne({
          email: data.email,
        });
        if (currentUser === null) {
          let userName;
          if (!data.name) {
            let atIndx = data?.email.indexOf("@");
            userName = data?.email.substring(0, atIndx);
            console.log(userName);
          } else {
            userName = data.name;
            console.log(userName);
          }
          currentUser = new UserModel({
            name: userName,
            email: data.email,
            comments: [],
          });
        }
        const newComment = new CommentModel({
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
    }
}
