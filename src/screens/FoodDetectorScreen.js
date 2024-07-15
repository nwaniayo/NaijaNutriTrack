import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import db from '../db/firestore';

const FoodDetectorScreen = () => {
  const [image, setImage] = useState(null);
  const [classification, setClassification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      classifyImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      classifyImage(result.assets[0].uri);
    }
  };

  const classifyImage = async (uri) => {
    setIsLoading(true);
    setClassification(null);

    let formData = new FormData();
    formData.append('file', {
      uri: uri,
      name: 'photo.jpeg',
      type: 'image/jpeg',
    });

    try {
      const response = await axios.post('https://gleaming-ronna-pau-4fd07e76.koyeb.app/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const predictedFood = response.data;
      setClassification(predictedFood);

      // Check if the predicted food is in the database
      const foodDetailsQuery = query(collection(db, 'foodDetails'), where('name', '==', predictedFood));
      const customMealsQuery = query(collection(db, 'customMeals'), where('name', '==', predictedFood));
      const foodDetailsSnapshot = await getDocs(foodDetailsQuery);
      const customMealsSnapshot = await getDocs(customMealsQuery);

      let foodItem = null;
      if (!foodDetailsSnapshot.empty) {
        foodItem = foodDetailsSnapshot.docs[0].data();
      } else if (!customMealsSnapshot.empty) {
        foodItem = customMealsSnapshot.docs[0].data();
      }

      if (foodItem) {
        await logFood(foodItem);
      } else {
        Alert.alert('No match found', 'The detected food item is not in the database.');
      }
    } catch (error) {
      console.error('Error classifying image:', error);
      setClassification('Error classifying image');
    } finally {
      setIsLoading(false);
    }
  };

  const logFood = async (foodItem) => {
    const mealType = getMealType();
    const auth = getAuth();
    const user = auth.currentUser;
    const uid = user ? user.uid : null;

    if (!uid) {
      Alert.alert('Error', 'You must be logged in to log food.');
      return;
    }

    try {
      await addDoc(collection(db, 'foodLog'), {
        uid: uid,
        calories: foodItem.calories,
        fat: foodItem.fat,
        carbohydrate: foodItem.carbohydrate,
        protein: foodItem.protein,
        mealType,
        name: foodItem.name,
        date: serverTimestamp(),
      });
      Alert.alert('Success', 'The food has been logged successfully.');
    } catch (error) {
      console.error('Error logging food:', error);
      Alert.alert('Error', 'There was a problem logging the food.');
    }
  };

  const getMealType = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 11) {
      return 'Breakfast';
    } else if (currentHour >= 11 && currentHour < 16) {
      return 'Lunch';
    } else {
      return 'Dinner';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Food Detector</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>Import from Camera Roll</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={takePhoto}>
          <Text style={styles.buttonText}>Snap a Photo</Text>
        </TouchableOpacity>
      </View>
      {isLoading && <ActivityIndicator size="large" color="#007bff" />}
      {image && <Image source={{ uri: image }} style={styles.image} />}
      {classification && (
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>{classification}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f7',
    padding: 20,
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0d47a1',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#0d47a1',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 10,
    marginTop: 20,
  },
  resultBox: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    width: '80%',
  },
  resultText: {
    fontSize: 18,
    color: '#0d47a1',
    fontWeight: 'bold',
  },
});

export default FoodDetectorScreen;
