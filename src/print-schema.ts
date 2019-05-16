import * as path from "path";
import * as fs from "fs";
import { printSchema, graphqlSync, introspectionQuery } from "graphql";
import schema from "./schema";

const buildDir = path.resolve(__dirname, "../build");

if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir);
}

const printIntrospectionQuery = () => {
  const introspectionResult = graphqlSync(schema, introspectionQuery);
  fs.writeFileSync(
    `${buildDir}/introspectionQuery.json`,
    JSON.stringify(introspectionResult.data),
  );

  filterFragmentTypesFromIntrospectionQuery(introspectionResult);
  fs.writeFileSync(
    `${buildDir}/fragmentTypes.json`,
    JSON.stringify(introspectionResult.data),
  );
};

const printSDL = () => {
  fs.writeFileSync(`${buildDir}/schema.graphql`, printSchema(schema));
};

const filterFragmentTypesFromIntrospectionQuery = (introspectionQuery) => {
  const filteredData = introspectionQuery.data.__schema.types.filter(
    (type) => type.possibleTypes !== null,
  );
  introspectionQuery.data.__schema.types = filteredData;
};

printSDL();
printIntrospectionQuery();

console.log(`✅ GraphQL Schema written to ${buildDir}`);
