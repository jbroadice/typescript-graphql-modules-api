import { MutationResolvers } from "@resolvers-types";
import { ModuleContext } from "@graphql-modules/core";
import { AuthModuleContext } from "@modules/auth";
import getTokensFromLogin from "@utils/getTokensFromLogin";
import { AuthenticationError } from "apollo-server-core";
import { trim } from "lodash";
import { RefreshToken } from "@models";
import generateTokenPair from "@utils/generateTokenPair";

export default () => ({
  Mutation: {
    login: async (_, { email, password }) => {
      const tokens = await getTokensFromLogin({ email, password });

      if (!tokens) {
        throw new AuthenticationError("Invalid authentication credentials.");
      }

      return tokens;
    },

    refreshToken: async (_, { refreshToken }, { currentUser }) => {
      if (!trim(refreshToken)) {
        throw new AuthenticationError("Invalid refresh token.");
      }

      const refreshTokenOld = await RefreshToken.query()
        .eager("user")
        .whereRaw("`tokens`.`created_at` > DATE_SUB(NOW(), INTERVAL 12 HOUR)")
        .findOne({
          token: refreshToken,
          blacklisted: false,
        });

      if (
        !refreshTokenOld ||
        !refreshTokenOld.user ||
        refreshTokenOld.user.uuid !== currentUser.uuid
      ) {
        throw new AuthenticationError("Invalid refresh token.");
      }

      await refreshTokenOld.$query().patch({ blacklisted: true });

      return generateTokenPair(currentUser.uuid);
    },
  } as MutationResolvers.Resolvers<ModuleContext<AuthModuleContext>>,
});
