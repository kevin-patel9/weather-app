import SearchScreen from "./Screens/Search/SearchScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Font from "expo-font";
import { useEffect } from "react";

const App = () => {

  const Stack = createNativeStackNavigator();

  useEffect(() => {
    (async () => {
      await Font.loadAsync({
        poppinsRegular: require("./assets/Fonts/Poppins-Regular.ttf"),
        poppinsBold: require("./assets/Fonts/Poppins-Bold.ttf"),
        poppinsMedium: require("./assets/Fonts/Poppins-Medium.ttf"),
      });
    })();
  },[])

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="SearchScreen"
          component={SearchScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;