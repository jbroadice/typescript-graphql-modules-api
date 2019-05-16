import { QueryResolvers } from "@resolvers-types";
import { ModuleContext } from "@graphql-modules/core";
import { AuthModule, AuthModuleContext } from "@modules/auth";
import { UserProvider } from "@modules/auth/providers/UserProvider";
import getEagerForResolver from "@utils/getEagerForResolver";
import { trim } from "lodash";

export default ({ injector }: typeof AuthModule) => ({
  Query: {
    me: async (_, _args, { currentUser }, info) => {
      if (!currentUser || !currentUser.id) {
        return null;
      }

      return injector
        .get(UserProvider)
        .userById(currentUser.id)
        .eager(getEagerForResolver(info));
    },

    user: async (_, { id }, _ctx, info) =>
      injector
        .get(UserProvider)
        .userByUuid(id)
        .eager(getEagerForResolver(info)),

    users: async (_, { name, roleType, page = 1 }, _ctx, info) => {
      let users = injector
        .get(UserProvider)
        .users()
        .eager(getEagerForResolver(info));

      if (trim(name)) {
        const words = name.match(/\b(\w+)\b/g);
        users = users.where((builder) => {
          words.forEach((name) => {
            builder
              .orWhere("users.firstName", "LIKE", `%${trim(name)}%`)
              .orWhere("users.lastName", "LIKE", `%${trim(name)}%`);
          });
        });
      }
      if (roleType) {
        users = users.where("users.roleType", roleType);
      }

      if (page <= 0) {
        throw new Error(
          "Page out of bounds: Page number cannot be lower than 1",
        );
      }

      const PAGE_LIMIT = 30;
      const paged = await users.page(page - 1, PAGE_LIMIT);
      const countPages = Math.floor(paged.total / PAGE_LIMIT) + 1;

      if (page > countPages) {
        throw new Error(
          `Page out of bounds: Page number cannot be higher than ${countPages}`,
        );
      }

      return {
        data: paged.results,
        pageInfo: {
          page,
          limit: PAGE_LIMIT,
          count: paged.total,
          countPages,
          hasNextPage: page < countPages,
        },
      };
    },
  } as QueryResolvers.Resolvers<ModuleContext<AuthModuleContext>>,
});
