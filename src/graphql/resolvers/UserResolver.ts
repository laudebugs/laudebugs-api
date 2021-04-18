import { Query, Resolver } from "type-graphql";
import User, { UserModel } from "../../Models/User";

@Resolver((of) => User)
export default class UserResolver {
  @Query((returns) => [User])
  async getUsers(): Promise<User[]> {
    const users: User[] = await UserModel.find();

    return users;
  }
}
