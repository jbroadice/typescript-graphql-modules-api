import "reflect-metadata";
import * as path from "path";
import * as express from "express";
import { ApolloServer } from "apollo-server-express";
import * as cors from "cors";
import { json } from "body-parser";
import authRoutes from "./routes/auth";
import { Model } from "objection";
import { AppModule } from "@modules/app";

const { NODE_ENV, ENGINE_API_KEY } = process.env;

const isDev = NODE_ENV !== "production";

const createApp = ({ db }) => {
  Model.knex(db);

  const { schema, context } = AppModule.forRoot({});

  const server = new ApolloServer({
    schema,
    context,
    introspection: isDev,
    playground: isDev,
    engine: ENGINE_API_KEY && {
      apiKey: ENGINE_API_KEY,
      privateVariables: ["password"],
      generateClientInfo: ({ request }) => {
        const headers = request.http.headers;
        return {
          clientName:
            (headers && headers.get("client-name")) || "Unknown Client",
          clientVersion:
            (headers && headers.get("client-version")) || "Unversioned",
        };
      },
    },
  });

  const app = express();

  // app.use(removeXPoweredBy());

  app.use(cors());

  app.use(json());

  app.use(express.static(path.resolve(__dirname, "../static")));

  app.use(authRoutes);

  server.applyMiddleware({
    app,
    cors: false,
    bodyParserConfig: false,
  });

  return app;
};

export default createApp;
