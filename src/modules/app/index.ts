import { GraphQLModule } from "@graphql-modules/core";
import { Injector } from "@graphql-modules/di";
import { AuthModule } from "@modules/auth";
import * as Knex from "knex";

export interface AppModuleConfig {
  db?: Knex;
}

export interface AppModuleContext {
  injector?: Injector;
}

export const AppModule = new GraphQLModule<
  AppModuleConfig,
  {},
  AppModuleContext
>({
  imports: () => [AuthModule],

  // imports: ({ config }) => {
  //   console.log('imports', config);
  //   return [
  //     AuthModule
  //   ];
  // }
});
