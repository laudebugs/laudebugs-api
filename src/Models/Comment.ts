import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";
import User from "./User";


@ObjectType()
export default class Comment {
  @Field()
  @prop({ default: "" })
  public content!: string;

  @Field((type) => User)
  @prop({ ref: "User" })
  user?: Ref<User>;

  @Field()
  @prop({ default: 0 })
  likes!: number;

  @Field()
  @prop({ default: false })
  moderated!: boolean;

  @Field()
  @prop({ default: false })
  approved!: boolean;

  @Field((type) => Date)
  @prop()
  createdAt!: Date ;

  @Field()
  user_name?: string;
}

export const CommentModel = getModelForClass(Comment)