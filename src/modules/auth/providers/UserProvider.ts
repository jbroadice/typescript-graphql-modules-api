import { Injectable } from "@graphql-modules/di";
import { User, EmailAddress } from "@models";
// import * as DataLoader from 'dataloader';

@Injectable()
export class UserProvider {
  constructor() {
    // TODO: It woud be idiomatic to take injected DBProvider instance here (see knex docs)
  }

  userByUuid = (uuid: string) => User.query().findOne({ uuid });

  emailsByUserUuid = (userId: string) => EmailAddress.query().where({ userId });

  userById = (id: number) => User.query().findById(id);

  users = () => User.query();
}
