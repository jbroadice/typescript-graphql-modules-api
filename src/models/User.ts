import BaseModel from "./BaseModel";
import { EmailAddress, HasTimestamps } from ".";
import { UserRoleType, PaginationInfo } from "@resolvers-types";

export interface UserDbObject extends HasTimestamps {
  id: number;
  uuid: string;
  password: string;
  firstName: string;
  lastName: string;
  roleType: UserRoleType;
  emails?: Partial<EmailAddress>[] | null;
}

export interface UserListDb {
  data: UserDbObject[];
  pageInfo: PaginationInfo;
}

export class User extends BaseModel {
  static tableName = "users";

  static relationMappings = {
    emails: {
      relation: BaseModel.HasManyRelation,
      modelClass: "EmailAddress",
      join: {
        from: "users.uuid",
        to: "emails.userId",
      },
    },
    refreshTokens: {
      relation: BaseModel.HasManyRelation,
      modelClass: "RefreshToken",
      join: {
        from: "users.uuid",
        to: "tokens.userId",
      },
    },
  };

  testRole = (roleType: string): boolean => {
    const userRoleType = this.roleType.toUpperCase();

    switch (roleType.toUpperCase()) {
      case UserRoleType.ADMIN:
        return userRoleType === UserRoleType.ADMIN;
      case UserRoleType.CUSTOMER:
        return (
          userRoleType === UserRoleType.ADMIN ||
          userRoleType === UserRoleType.CUSTOMER
        );
      case UserRoleType.DEALER:
        return (
          userRoleType === UserRoleType.ADMIN ||
          userRoleType === UserRoleType.CUSTOMER ||
          userRoleType === UserRoleType.DEALER
        );
      default:
        return false;
    }
  };
}
export interface User extends UserDbObject {}
