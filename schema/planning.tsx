import { Recepies } from "./recepies";
import Realm from "realm";


// Schema used in the DB for the users planning of recipes
export class Planning extends Realm.Object<Planning>{
  _id?: Realm.BSON.ObjectId;
  date?: Date;
  meal?: string;
  owner_id?: string;
  recipe?: Recepies;
  static schema: Realm.ObjectSchema = {
    name: 'Planning',
    properties: {
      _id: 'objectId?',
      date: 'date?',
      meal: 'string?',
      owner_id: 'string?',
      recipe: 'Recepies',
    },
    primaryKey: '_id',
  };
}
