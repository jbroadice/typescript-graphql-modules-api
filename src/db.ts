import * as knex from "knex";
import * as knexConfigs from "../knexfile";

const env = () => process.env.NODE_ENV || "development";

const knexConfig = knexConfigs[env()];

export default knex(knexConfig);
