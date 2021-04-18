import { documentToHtmlString } from "@contentful/rich-text-html-renderer";
import { Resolver, Query } from "type-graphql";
import { getAllPosts } from "../../lib/contentful";
import { readableDate } from "../../lib/functions";
import BlogPost from "../../Models/BlogPost";

@Resolver((of) => BlogPost)
export default class BlogPostResolver {
  @Query((returns) => [BlogPost])
  async getBlogPosts(): Promise<BlogPost[]> {
    let data = await getAllPosts();

    let blogPosts: BlogPost[] | any = data.map((post: any) => {
      let bodyType = typeof post.fields.body;
      post.fields.body =
        bodyType !== "string"
          ? documentToHtmlString(post.fields.body)
          : post.fields.body;
      return {
        date: readableDate(post.fields.date),
        slug: post.fields.slug,
        title: post.fields.title,
        description: post.fields.description,
        body: post.fields.body,
        featuredImage: post.fields.feature_image.fields.file.url,
        tags: post.fields.tags || [],
        section: post.fields.section || [],
        likes: 0,
        type: post.sys.contentType.sys.id,
      };
    });

    return blogPosts;
  }
}
