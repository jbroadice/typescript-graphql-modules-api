import BaseModel from "./BaseModel";
import { User, HasTimestamps } from ".";

export interface EmailAddressDbObject extends HasTimestamps {
  email: string;
  verified: boolean;
  primary: boolean;
  userId: string;
  user?: Partial<User>;
}

export class EmailAddress extends BaseModel {
  static tableName = "emails";

  static relationMappings = {
    user: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: "User",
      join: {
        from: "emails.userId",
        to: "users.uuid",
      },
    },
  };
}
export interface EmailAddress extends EmailAddressDbObject {}
