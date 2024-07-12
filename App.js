// App.js

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Foodlog from './src/screens/FoodLog';
import CreateFood from './src/screens/CreateFood';
import SummaryScreen from './src/screens/SummaryScreen';
import HomeScreen from './src/screens/HomeScreen';
import Login from './src/screens/Login';
import FoodDetectorScreen from './src/screens/FoodDetectorScreen.js';
import { onAuthStateChanged } from 'firebase/auth';
import { authentication } from './src/db/firestore';
import { TouchableOpacity } from 'react-native';

import SignUp from './src/screens/SignUp';
import User from './src/screens/User';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Create a new stack navigator for the FoodLog and CreateFood screens
const FoodLogStack = createNativeStackNavigator();

function FoodLogStackScreen() {
  return (
    <FoodLogStack.Navigator>
      <FoodLogStack.Screen
        name="FoodLogHome"
        component={Foodlog}
        options={({ navigation }) => ({
          title: 'Food Log',
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('CreateFood')}>
              <Ionicons name="add-circle-outline" size={25} color={'#007bff'} />
            </TouchableOpacity>
          ),
        })}
      />
      <FoodLogStack.Screen
        name="CreateFood"
        component={CreateFood}
        options={{ title: 'Create Food' }}
      />
    </FoodLogStack.Navigator>
  );
}

function FoodApp() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Food Log') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Summary') {
            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          } else if (route.name === 'User') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Food Detector') {
            iconName = focused ? 'camera' : 'camera-outline';
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: true }} />
      <Tab.Screen name="Food Log" component={FoodLogStackScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Summary" component={SummaryScreen} options={{ headerShown: true }} />
      <Tab.Screen name="User" component={User} options={{ headerShown: false }} />
      <Tab.Screen name="Food Detector" component={FoodDetectorScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authentication, (user) => {
      setUser(user);
      console.log('user', user);
    });

    // Unsubscribe from the listener when unmounting
    return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      {user ? (
        <FoodApp />
      ) : (
        <Stack.Navigator>
          <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default App;
