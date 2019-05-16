import { GraphQLModule } from "@graphql-modules/core";
import { loadSchemaFiles } from "@graphql-modules/sonar";
import { mergeGraphQLSchemas } from "@graphql-modules/epoxy";

import { GraphQLDateTime } from "graphql-iso-date";

export const CommonModule = new GraphQLModule({
  typeDefs: mergeGraphQLSchemas(loadSchemaFiles(`${__dirname}/schema/`)),

  resolvers: {
    Date: GraphQLDateTime,
  },
});
