export * from "./User";
export * from "./EmailAddress";
export * from "./RefreshToken";

export interface HasTimestamps {
  created_at: Date;
  updated_at: Date;
}
