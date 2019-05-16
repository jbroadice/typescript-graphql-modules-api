import * as Models from "@models";
// import { GraphQLSchema } from 'graphql';
// import { BaseModel } from '@models';
import { intersection } from "lodash";

export default function joinMonsterAdapt(schema) {
  const typeMap = schema.getTypeMap();

  intersection(Object.keys(Models), Object.keys(typeMap)).forEach((typeKey) => {
    const Model = Models[typeKey];
    const type = typeMap[typeKey];
    const schemaTypeRef = schema._typeMap[typeKey];

    const typeProps = {
      sqlTable: Model.tableName,
      uniqueKey: Model.idColumn,
    };

    schemaTypeRef._typeConfig = {
      ...schemaTypeRef._typeConfig,
      ...typeProps,
    };

    intersection(
      Object.keys(Model.relationMappings),
      Object.keys(type._fields),
    ).forEach((fieldKey) => {
      const fieldsModel = Model.relationMappings[fieldKey];
      const fieldProps = {
        sqlJoin: `${fieldsModel.join.from} = ${fieldsModel.join.to}`,
      };

      schemaTypeRef._fields[fieldKey] = {
        ...schemaTypeRef._fields[fieldKey],
        ...fieldProps,
      };
    });
  });
}
