import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";
import User from "./User";

@ObjectType()
export default class Note{

    @Field()
    @prop()
    public note?:string 

    @Field((type)=>User)
    @prop({ref:"User"})
    public user?:Ref<User>
}

export const NoteModel = getModelForClass(Note)