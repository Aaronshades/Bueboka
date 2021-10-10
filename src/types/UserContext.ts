import { IUser } from "./User";

export type UserContextState = {
  user: IUser;
  updateUser: (user: any) => void;
};
