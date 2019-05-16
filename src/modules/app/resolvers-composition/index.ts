// import { GraphQLModule } from '@graphql-modules/core';
// import { getFieldsWithDirectives } from '@graphql-modules/utils';
// import { addFieldNodes } from './add-field-nodes';

// export const resolversComposition = ({ typeDefs }: GraphQLModule) => {
//   const fieldsAndTypeToDirectivesMap = getFieldsWithDirectives(typeDefs);

//   let resolvers = {};

//   for (const fieldPath in fieldsAndTypeToDirectivesMap) {
//     resolvers[fieldPath] = addFieldNodes;
//   }

//   return resolvers;
// }
