import { Query, Resolver } from "type-graphql";
import spotifyClient from "../../clients/spotify";

@Resolver()
export default class SpotifyResolver {
  @Query((returns) => String)
  getSpotifyAlbums(query: string): string {
    return spotifyClient
      .request(`https://api.spotify.com/v1/${query}`)
      .then(function (data) {
        let sth = JSON.stringify(data);
        return sth;
      })
      .catch((err) => {
        console.log(err.message);
        return err.message;
      });
  }
}
