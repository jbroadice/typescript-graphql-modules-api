import { GraphQLResolveInfo, FieldNode, GraphQLList } from "graphql";
import * as Models from "@models";
import { intersection } from "lodash";

const getEagerForResolver = (resolveInfo: GraphQLResolveInfo) => {
  const { returnType }: any = resolveInfo;

  let returnTypeName: string =
    (returnType instanceof GraphQLList ||
    (returnType.ofType && returnType.ofType instanceof GraphQLList)
      ? returnType.ofType.ofType.name
      : returnType.ofType && returnType.ofType.name) || returnType.name;

  const listType = returnTypeName.match(/^(.+?)List/);
  if (listType) {
    returnTypeName = listType[1];
  }

  if (!(returnTypeName in Models)) {
    throw new Error(
      `[getEagerForResolver]: '${returnTypeName}' is not a valid model.`,
    );
  }

  const fieldNodesSelections: any = listType
    ? resolveInfo.fieldNodes[0].selectionSet.selections.find(
        (s: FieldNode) => s.name.value === "data",
      )
    : resolveInfo.fieldNodes[0];

  if (!fieldNodesSelections) {
    return null;
  }

  const fieldNodes = fieldNodesSelections.selectionSet.selections.map(
    (selection: FieldNode) => selection.name.value,
  );

  const relations = Object.keys(Models[returnTypeName].relationMappings);

  return `[${intersection(fieldNodes, relations).join(",")}]`;
};

export default getEagerForResolver;
