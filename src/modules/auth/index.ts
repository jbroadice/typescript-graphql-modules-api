import { GraphQLModule } from "@graphql-modules/core";
import { loadResolversFiles, loadSchemaFiles } from "@graphql-modules/sonar";
import { mergeGraphQLSchemas, mergeResolvers } from "@graphql-modules/epoxy";
import { resolversComposition } from "./resolvers/composition";
import { UserProvider } from "./providers/UserProvider";
import getUserFromRequest from "@utils/getUserFromRequest";
import { AppModuleContext } from "@modules/app";
import { CommonModule } from "@modules/common";
import { UserDbObject } from "@models";
import { Request } from "express";

export interface AuthModuleContext extends AppModuleContext {
  currentUser: UserDbObject;
}

export interface AuthModuleRequest {
  req: Request;
}

export const AuthModule = new GraphQLModule<
  {},
  AuthModuleRequest,
  AuthModuleContext
>({
  typeDefs: mergeGraphQLSchemas(loadSchemaFiles(`${__dirname}/schema/`)),
  resolvers: mergeResolvers(loadResolversFiles(`${__dirname}/resolvers/`)),

  resolversComposition,

  imports: () => [CommonModule],

  providers: [UserProvider],

  async context({ req }) {
    const currentUser = await getUserFromRequest(req);
    return { currentUser };
  },
});
