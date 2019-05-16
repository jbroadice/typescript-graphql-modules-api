import * as Knex from "knex";

const dbSchemaAddTimestamps = (
  { knex, table }: { knex: Knex; table: Knex.CreateTableBuilder },
  addUpdatedAt = true,
) => {
  table
    .dateTime("created_at")
    .notNullable()
    .defaultTo(knex.raw("now()"));

  if (addUpdatedAt) {
    table
      .dateTime("updated_at")
      .defaultTo(knex.raw("NULL ON UPDATE CURRENT_TIMESTAMP"));
  }
};

export default dbSchemaAddTimestamps;
