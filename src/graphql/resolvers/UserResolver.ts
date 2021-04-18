import { Mutation, Query, Resolver } from "type-graphql";
import { addSubscriber } from "../../lib/functions";
import User, { UserModel } from "../../Models/User";

@Resolver((of) => User)
export default class UserResolver {
  @Query((returns) => [User])
  async getUsers(): Promise<User[]> {
    const users: User[] = await UserModel.find();

    return users;
  }

  @Mutation()

      async userSignUp(root, { user }){
      try {
        let usr = await UserModel.findOne({ email: user.email });
        if (!usr) {
          usr = new UserModel({ name: user.name, email: user.email });
        }
        usr.sneekpeeks = user.sneekpeeks;
        usr.newposts = user.newposts;

        usr.save();

        let subRequest = addSubscriber({
          email: user.email,
          firstName: user.name,
          lastName: user.name,
        });
        subRequest.then(() => {
          return usr;
        });
      } catch (error) {
        return null;
      }
    }
}
