import { Field, ObjectType } from "type-graphql";

@ObjectType()
export default class BlogPost {
  @Field()
  slug?: string;

  @Field()
  title?: string;

  @Field()
  description?: string;

  @Field()
  body?: string;

  @Field()
  date?: string;

  @Field()
  featuredImage?: string;

  @Field((type) => [String])
  section?: [string];

  @Field((type) => [String])
  tags?: [string];

  // @Field((type) => [Comment])
  // comments?: [Comment];

  @Field()
  likes?: number;

  @Field()
  likeLevel?: number;

  @Field()
  type?: string;
}
