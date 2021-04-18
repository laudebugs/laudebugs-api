import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";
import Comment from "./Comment";
import Note from "./Note";
import emailValidator from 'email-validator'

@ObjectType()
export default class User{
    @Field()
    @prop()
    public name?: string;

    @Field()
    @prop({unique:true, validate:{validator: emailValidator.validate,
      message: (props) => `${props.value} is not a valid email address`,}})
    public email?:string

    @Field()
    @prop()
    public sneekpeeks?:boolean

    @Field()
    @prop()
    public newposts?:boolean

    @Field((type)=>[Note])
    @prop({ref:"Note"})
    public notes?:Ref<Note>[]

    @Field((type)=>[Comment])
    @prop({ref: "Comment"})
    comments?:Ref<Comment>[]

}

export const UserModel = getModelForClass(User)