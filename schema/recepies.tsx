import {BSON} from 'realm';
import { Food } from './food';

// Schema used in the DB for the ingredients in the recepies
export class Recepies_ingredients extends Realm.Object<Recepies_ingredients>{
    food?: Food;
    quantity!: number;
    unit!: string;
    static schema: Realm.ObjectSchema = {
        name: 'Recepies_ingredients',
        embedded: true,
        properties: {
            food: 'Food',
            quantity: 'int',
            unit: 'string',
        },
    };
}

// Schema used in the DB for recepies
export class Recepies extends Realm.Object<Recepies>{
    _id?: Realm.BSON.ObjectId;
    calories!: number;
    carbohydrates!: number;
    description!: string;
    fats!: number;
    fiber!: number;
    image!: string;
    ingredients?: Realm.List<Recepies_ingredients>;
    name!: string;
    protein!: number;
    steps!: Realm.List<string>;
    static schema: Realm.ObjectSchema = {
        name: 'Recepies',
        properties: {
            _id: {type: 'objectId', default: () => new BSON.ObjectId()},
            calories: 'int',
            carbohydrates: 'int',
            description: 'string',
            fats: 'int',
            fiber: 'int',
            image: 'string',
            ingredients: {
                type: 'list',
                objectType: 'Recepies_ingredients',
                optional: false
            },
            name: 'string',
            protein: 'int',
            steps: {
                type: 'list',
                objectType: 'string',
                optional: false
            },
        },
        primaryKey: '_id',
    }

}

// Schema used in the DB for the users favourite recipes
export class FavouriteRecipes extends Realm.Object<FavouriteRecipes> {
    _id!: BSON.ObjectId;
    items!: Realm.List<Recepies>;
    owner_id!: string;
  
    static schema: Realm.ObjectSchema = {
      name: 'FavouriteRecipes',
      primaryKey: '_id',
      properties: {
        // This allows us to automatically generate a unique _id for each Item
        _id: {type: 'objectId', default: () => new BSON.ObjectId()},
        // All todo items will default to incomplete
        items: {
          type: 'list',
          objectType: 'Recepies',
          optional: false
        },
        owner_id: 'string',
      },
    };
  }


