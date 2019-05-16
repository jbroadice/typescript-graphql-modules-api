import { Model } from "objection";

export default class BaseModel extends Model {
  static modelPaths = [__dirname];

  // static defaultEagerAlgorithm = Model.JoinEagerAlgorithm;
}
