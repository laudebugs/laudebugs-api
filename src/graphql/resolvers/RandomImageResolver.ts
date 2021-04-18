import { Query, Resolver } from "type-graphql";
import { getRandomImage } from "../../lib/functions";
import RandomImage from "../../Models/RandomImage";

@Resolver((of) => RandomImage)
export default class RandomImageResolver {
  @Query((returns) => RandomImage)
  async getRandomImage(): Promise<RandomImage> {
    let image = await getRandomImage();
    return { url: image };
  }
}
