import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";
import Comment from "./Comment";
@ObjectType()
export default class Post {
  @Field()
  @prop()
  public likes?: number;

  @Field()
  @prop()
  public slug?: string;

  @Field((type) => [Comment])
  @prop({ ref: "Comment", default: [] })
  comments!: Ref<Comment>[];
}

export const PostModel = getModelForClass(Post);
