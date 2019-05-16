import { UserResolvers } from "@resolvers-types";
import { UserDbObject } from "@models";
import { ModuleContext } from "@graphql-modules/core";
import { AuthModule, AuthModuleContext } from "@modules/auth";
import { UserProvider } from "@modules/auth/providers/UserProvider";
import getEagerForResolver from "@utils/getEagerForResolver";

export default ({ injector }: typeof AuthModule) => ({
  User: {
    id: (user) => user.uuid,

    emails: async (user, _args, _ctx, info) => {
      if (user.emails) {
        return user.emails;
      }

      return injector
        .get(UserProvider)
        .emailsByUserUuid(user.uuid)
        .eager(getEagerForResolver(info));
    },

    timestamps: ({ created_at, updated_at }) => ({
      createdAt: created_at,
      updatedAt: updated_at,
    }),
  } as UserResolvers.Resolvers<ModuleContext<AuthModuleContext>, UserDbObject>,
});
