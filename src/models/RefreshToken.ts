import BaseModel from "./BaseModel";
import { User } from ".";

export interface RefreshTokenDbObject extends BaseModel {
  user: User;
  blacklisted: boolean;
  userId: number;
  token: string;
}

export class RefreshToken extends BaseModel {
  static tableName = "tokens";

  static relationMappings = {
    user: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: "User",
      join: {
        from: "tokens.userId",
        to: "users.uuid",
      },
    },
  };
}
export interface RefreshToken extends RefreshTokenDbObject {}
