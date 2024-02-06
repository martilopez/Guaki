import {BSON} from 'realm';

// Schema used in the DB for food items
export class Food extends Realm.Object<Food> {
  _id!: BSON.ObjectId;
  name!: string;
  type!: string;

  static schema: Realm.ObjectSchema = {
    name: 'Food',
    primaryKey: '_id',
    properties: {
      // This allows us to automatically generate a unique _id for each Item
      _id: {type: 'objectId', default: () => new BSON.ObjectId()},
      // All todo items will default to incomplete
      name: 'string',
      type: 'string',
    },
  };
}

// Schema used in the DB for the users pantry
export class FoodPantry extends Realm.Object<FoodPantry> {
  _id!: BSON.ObjectId;
  items!: Realm.List<Food>;
  owner_id!: string;

  static schema: Realm.ObjectSchema = {
    name: 'FoodPantry',
    primaryKey: '_id',
    properties: {
      // This allows us to automatically generate a unique _id for each Item
      _id: {type: 'objectId', default: () => new BSON.ObjectId()},
      // All todo items will default to incomplete
      items: {
        type: 'list',
        objectType: 'Food',
        optional: false
      },
      owner_id: 'string',
    },
  };
}


