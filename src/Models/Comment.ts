import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";
import User from "./User";


@ObjectType()
export default class Comment{
    @Field()
    @prop()
    public content?: string;

    @Field((type)=>User)
    @prop({ref: "User"})
    user?: Ref<User> 

    @Field()
    @prop()
    likes?: number

    @Field()
    @prop()
    moderated?: boolean 

    
}

export const CommentModel = getModelForClass(Comment)