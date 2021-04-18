import { Field, ObjectType } from "type-graphql";

@ObjectType()
export default class Snack {
  @Field()
  public body?: string;

  @Field()
  public fileName?: string;
}
