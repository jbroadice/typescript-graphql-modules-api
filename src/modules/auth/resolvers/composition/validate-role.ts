import { UserProvider } from "@modules/auth/providers/UserProvider";
import { Resolver } from "@resolvers-types";
import { AuthModuleContext } from "@modules/auth";
import { AuthenticationError } from "apollo-server-express";

export const validateRole = (role) => (next): Resolver<null> => async (
  root,
  args,
  context: AuthModuleContext,
  info,
) => {
  const { currentUser, injector } = context;

  const user = await injector.get(UserProvider).userById(currentUser.id);

  if (!user.testRole(role)) {
    throw new AuthenticationError(`Unauthorized for this action`);
  }

  return next(root, args, context, info);
};
