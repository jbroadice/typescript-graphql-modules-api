import { EmailAddressResolvers } from "@resolvers-types";
import { EmailAddressDbObject } from "@models";
import { ModuleContext } from "@graphql-modules/core";
import { AuthModule, AuthModuleContext } from "@modules/auth";
import { UserProvider } from "@modules/auth/providers/UserProvider";
import getEagerForResolver from "@utils/getEagerForResolver";

export default ({ injector }: typeof AuthModule) => ({
  EmailAddress: {
    user: async (email, _args, _ctx, info) => {
      if (email.user) {
        return email.user;
      }

      return injector
        .get(UserProvider)
        .userByUuid(email.userId)
        .eager(getEagerForResolver(info));
    },

    timestamps: ({ created_at, updated_at }) => ({
      createdAt: created_at,
      updatedAt: updated_at,
    }),
  } as EmailAddressResolvers.Resolvers<
    ModuleContext<AuthModuleContext>,
    EmailAddressDbObject
  >,
});
