import React from "react";
import { SafeAreaView, Text, StyleSheet, ImageBackground } from "react-native";
import { Feather } from '@expo/vector-icons';
import moment from "moment";

const Calories = ({ calorieData }) => {
  const { container, cityName, cityText, imageLayout } = styles;

  return (
    <SafeAreaView style={container}>
      <ImageBackground
        source={require('../../assets/mariko.jpeg')}
        style={imageLayout}
      >
        {calorieData && (
          <>
            <Text style={[cityName, cityText]}>{calorieData.value}</Text>
            <Text style={[cityName, cityText]}>{calorieData.dateTime}</Text>
          </>
        )}
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageLayout: {
    flex: 1
  },
  cityName: {
    fontSize: 40,
  },
  cityText: {
    justifyContent: 'center',
    alignSelf: 'center',
    fontWeight: 'bold',
    color: 'white'
  },
})

export default Calories