import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from "./screens/HomeScreen";
import SplashScreen from "./screens/LoadingScreen";

const Stack = createNativeStackNavigator();

function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Splash">
                <Stack.Screen name="Home" component={HomeScreen}/>
                <Stack.Screen name="Splash" component={SplashScreen}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;