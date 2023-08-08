import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import ImageDetector from "./components/ImageDetector";
import CustomHeader from './components/CustomHeader';
import ChatBot from "./components/ChatBot";
import Home from "./components/Home";

const ToolsNavigationStack = createStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <ToolsNavigationStack.Navigator initialRouteName="Home">
        <ToolsNavigationStack.Screen
          name="Home"
          component={Home}
          options={{
            headerShown: false,
          }}
        />
        <ToolsNavigationStack.Screen
          name="ChatBot"
          component={ChatBot}
          options={{
            title: "Enova",
            headerTintColor: "#B400AA",
            headerStyle: {
              height: 150,
              borderBottomWidth: .3,
              borderBottomColor: "#000",
            },
            headerTitle: () => (
              <CustomHeader />
            ),
            headerBackTitleVisible: false,
          }}
        />
        <ToolsNavigationStack.Screen
          name="ImageDetector"
          component={ImageDetector}
          options={{
            title: "Enova",
            headerTintColor: "#B400AA",
            headerStyle: {
              height: 150,
            },
            headerTitle: () => (
              <CustomHeader />
            ),
            headerBackTitleVisible: false,
          }}
        />
      </ToolsNavigationStack.Navigator>
    </NavigationContainer>
  );
}
