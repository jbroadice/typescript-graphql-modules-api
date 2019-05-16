import * as Knex from "knex";
import dbSchemaAddTimestamps from '../src/utils/dbSchemaAddTimestamps';
import { USER_ROLES } from '../src/constants';

exports.up = async function (knex: Knex): Promise<any> {
  await knex.schema.createTable('users', (table) => {
    table.increments('id').notNullable().primary();
    table.uuid('uuid').notNullable().unique();
    table.string('firstName');
    table.string('lastName');
    table.string('password');
    table.enum('roleType', USER_ROLES);
    table.index(['roleType']);
    dbSchemaAddTimestamps({ knex, table });
  });

  await knex.schema.createTable('emails', (table) => {
    table.increments('id').notNullable().primary();
    table.uuid('userId').notNullable();
    table.string('email', 100).notNullable();
    table.boolean('verified').notNullable().defaultTo(false);
    table.boolean('primary').notNullable().defaultTo(false);
    table.unique(['email', 'verified']);
    dbSchemaAddTimestamps({ knex, table });
  });

  await knex.schema.createTable('tokens', (table) => {
    table.increments('id').notNullable().primary();
    table.uuid('userId').notNullable();
    table.string('token', 255).notNullable();
    table.boolean('blacklisted').notNullable().defaultTo(false);
    table.unique(['userId', 'token']);
    dbSchemaAddTimestamps({ knex, table });
  });
};

exports.down = async function (knex: Knex): Promise<any> {
  await knex.schema.dropTableIfExists('users');
  await knex.schema.dropTableIfExists('emails');
  await knex.schema.dropTableIfExists('tokens');
};
