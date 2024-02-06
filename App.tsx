import { NavigationContainer } from "@react-navigation/native";
import {
  Recipes,
  Scanner,
  Pantry,
  Planner,
  User,
  AddItemToPantry,
  RecepieDetail,
  AddRecipeToPlanner,
  FoodInfo,
} from "./screens/index";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, Platform, View, StyleSheet } from "react-native";
import { realmContext } from "./RealmContext";
import { AppProvider, UserProvider } from "@realm/react";
import { appId, baseUrl } from "./atlasConfig.json";
import Initial from "./screens/Welcome";
import "./tools/i18n";

const { RealmProvider } = realmContext;

// Stack with all the screens
export type StackParams = {
  Home: any;
  Recipes: any;
  RecepieDetail: any;
  Scanner: any;
  Pantry: any;
  Planner: any;
  User: any;
  addItemToPantry: any;
  AddRecipeToPlanner: any;
  FoodInfo: any;
};

const Stack = createNativeStackNavigator();

// Wrapper that manages if the user is already logged in
const AppWrapper = () => {
  return (
    <AppProvider id={appId} baseUrl={baseUrl}>
      <UserProvider fallback={Initial}>
        <App />
      </UserProvider>
    </AppProvider>
  );
};

// Renders Loading screen
const LoadingIndicator = () => {
  return (
    <View style={styles.activityContainer}>
      <ActivityIndicator size="large" />
    </View>
  );
};

// App component where navigation and screen initiation is managed
const App = () => {
  return (
    <RealmProvider
      sync={{
        flexible: true,
        onError: (_, error) => {
          // Show sync errors in the console
          console.error(error);
        },
      }}
      fallback={LoadingIndicator}
    >
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Recipes"
          screenOptions={{
            animation: Platform.OS != "ios" ? "none" : "fade",
            presentation: "card",
            orientation: "portrait_up",
          }}
        >
          <Stack.Group>
            <Stack.Group>
              <Stack.Screen
                name="Recipes"
                component={Recipes}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="RecepieDetail"
                component={RecepieDetail}
                options={{
                  headerShown: false,
                  animation: "slide_from_bottom",
                  presentation: "modal",
                }}
              />
            </Stack.Group>
            <Stack.Group>
              <Stack.Screen
                name="Scanner"
                component={Scanner}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="FoodInfo"
                component={FoodInfo}
                options={{
                  headerShown: false,
                  animation: "slide_from_bottom",
                  presentation: "modal",
                }}
              />
            </Stack.Group>
            <Stack.Group>
              <Stack.Screen
                name="Pantry"
                component={Pantry}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="addItemsPantry"
                component={AddItemToPantry}
                options={{
                  headerShown: false,
                  animation: "slide_from_bottom",
                  presentation: "modal",
                }}
              />
            </Stack.Group>
            <Stack.Group>
              <Stack.Screen
                name="Planner"
                component={Planner}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="AddRecipeToPlanner"
                component={AddRecipeToPlanner}
                options={{
                  headerShown: false,
                  animation: "slide_from_bottom",
                  presentation: "modal",
                }}
              />
            </Stack.Group>
            <Stack.Screen
              name="User"
              component={User}
              options={{
                headerShown: false,
              }}
            />
          </Stack.Group>
        </Stack.Navigator>
      </NavigationContainer>
    </RealmProvider>
  );
};

// Style for
const styles = StyleSheet.create({
  activityContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
});

export default AppWrapper;
