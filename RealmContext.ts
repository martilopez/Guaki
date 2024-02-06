import {createRealmContext} from '@realm/react';
import { Food, FoodPantry } from './schema/food';
import { Recepies_ingredients, Recepies, FavouriteRecipes } from './schema/recepies';
import { Planning } from './schema/planning';

// Creates the realm context in order to connect to the backend
export const realmContext = createRealmContext({
  schema: [Food, FoodPantry, Recepies_ingredients, Recepies, FavouriteRecipes, Planning],
});
