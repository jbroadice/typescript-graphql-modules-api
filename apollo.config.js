require('dotenv').config();

const { ENGINE_SERVICE_NAME } = process.env;

module.exports = {
  service: {
    name: ENGINE_SERVICE_NAME,
    localSchemaFile: './build/schema.graphql'
  },
};
