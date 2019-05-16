import { AuthenticationError } from "apollo-server-express";
import { Resolver } from "@resolvers-types";
import { AuthModuleContext } from "@modules/auth";

export const authenticated = (next): Resolver<null> => (
  root,
  args,
  context: AuthModuleContext,
  info,
) => {
  const { currentUser } = context;

  if (!currentUser || !currentUser.id) {
    throw new AuthenticationError("Invalid authentication credentials");
  }

  return next(root, args, context, info);
};
