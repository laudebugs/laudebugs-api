import { Field, ObjectType } from "type-graphql";

@ObjectType()
export default class RandomImage {
  @Field()
  public url?: string;
}
