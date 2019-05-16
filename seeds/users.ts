import * as Knex from 'knex';
import { Model } from 'objection';
import { User } from '../src/models';
import * as faker from 'faker';
import * as bcrypt from 'bcryptjs';
import { USER_ROLES } from '../src/constants';

exports.seed = async function (knex: Knex): Promise<any> {
  Model.knex(knex);

  const users = await Promise.all(Array.from({ length: 1000 }).map(async () => {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();

    const getEmail = () =>
      `${firstName.toLowerCase()}_${lastName.toLowerCase()}@${faker.random.alphaNumeric(10)}.com`;

    return {
      uuid: faker.random.uuid(),
      firstName,
      lastName,
      password: await bcrypt.hash('secret', 8),
      roleType: faker.random.arrayElement(USER_ROLES),
      emails: [
        {
          email: getEmail(),
        },
        {
          email: getEmail(),
          verified: true,
        },
        {
          email: getEmail(),
          verified: true,
          primary: true,
        },
      ],
    };
  }));

  await User.query().insertGraph(users);
};
