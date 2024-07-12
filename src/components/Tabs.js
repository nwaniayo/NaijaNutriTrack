import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from '@react-navigation/stack';
import { Feather, Ionicons } from '@expo/vector-icons';
import { TouchableWithoutFeedback } from 'react-native';

import Watch from "../../src/screens/Watch";
import Calories from "../../src/screens/Calories";
import Foodlog from "../../src/screens/FoodLog";
import CreateFood from "../../src/screens/CreateFood"; // Import CreateFood

const Tab = createBottomTabNavigator();
const FoodStack = createStackNavigator(); // Create a stack navigator for the Food tab

// Stack Navigator for the Food tab
const FoodStackScreen = () => (
  <FoodStack.Navigator>
    <FoodStack.Screen
      name="Food List"
      component={Foodlog}
      options={({ navigation }) => ({
        headerRight: () => (
          <TouchableWithoutFeedback onPress={() => navigation.navigate('CreateFood')}>
            <Ionicons
              name={'add-circle-outline'}
              size={34}
              color={'#0080ff'}
              style={{ marginRight: 25 }}
            />
          </TouchableWithoutFeedback>
        ),
      })}
    />
    <FoodStack.Screen name="CreateFood" component={CreateFood} />
  </FoodStack.Navigator>
);

const Tabs = ({ calorie, profile }) => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'grey',
        tabBarStyle: {
          backgroundColor: 'beige'
        },
        headerStyle: {
          backgroundColor: 'beige'
        },
        headerTitleStyle: {
          fontSize: 25,
          fontWeight: 'bold',
          color: 'black'
        }
      }}
    >
            <Tab.Screen
        name="Calorie"
        component={Calories}
        initialParams={{ calorieData: calorie }} // Pass initial params
        options={{
          tabBarIcon: ({ focused }) => (
            <Feather
              name={'sun'}
              size={25}
              color={focused ? 'tomato' : 'black'}
            />
          )
        }}
      />

      <Tab.Screen
        name="Food"
        component={FoodStackScreen} // Use the FoodStackScreen as the component
        options={{
          tabBarIcon: ({ focused }) => (
            <Feather
              name={'list'}
              size={25}
              color={focused ? 'tomato' : 'black'}
            />
          )
        }}
      />

            <Tab.Screen
        name="Calorie"
        component={Calories}
        initialParams={{ calorieData: calorie }} // Pass initial params
        options={{
          tabBarIcon: ({ focused }) => (
            <Feather
              name={'sun'}
              size={25}
              color={focused ? 'tomato' : 'black'}
            />
          )
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Watch}
        initialParams={{ watchData: profile.user }} // Pass initial params
        options={{
          tabBarIcon: ({ focused }) => (
            <Feather
              name={'user'}
              size={25}
              color={focused ? 'tomato' : 'black'}
            />
          )
        }}
      />
      {/* Other Tab Screens */}
    </Tab.Navigator>
  );
};

export default Tabs;
