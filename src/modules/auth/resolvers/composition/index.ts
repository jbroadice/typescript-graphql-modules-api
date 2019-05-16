import { GraphQLModule } from "@graphql-modules/core";
import { getFieldsWithDirectives } from "@graphql-modules/utils";
import { authenticated } from "./authenticated-guard";
import { validateRole } from "./validate-role";

const DIRECTIVE_TO_GUARD = {
  auth: () => authenticated,
  protect: ({ role }) => validateRole(role),
};

export const resolversComposition = ({ typeDefs }: GraphQLModule) => {
  const fieldsAndTypeToDirectivesMap = getFieldsWithDirectives(typeDefs);

  let resolvers = {};

  for (const fieldPath in fieldsAndTypeToDirectivesMap) {
    const directives = fieldsAndTypeToDirectivesMap[fieldPath];

    if (directives.length > 0) {
      resolvers[fieldPath] = directives
        .map((directive) =>
          DIRECTIVE_TO_GUARD[directive.name]
            ? DIRECTIVE_TO_GUARD[directive.name](directive.args)
            : null,
        )
        .filter((a) => a);
    }
  }

  return resolvers;
};
