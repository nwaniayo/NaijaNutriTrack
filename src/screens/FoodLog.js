import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Button, ScrollView, Alert, RefreshControl, TextInput, Text } from 'react-native';
import Foodlist from '../components/Foodlist';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import db from '../db/firestore';

const mapDocToFoodItem = (doc) => {
  return {
    id: doc.id,
    name: doc.data().name,
    protein: doc.data().protein,
    calories: doc.data().calories,
    carbohydrate: doc.data().carbohydrate,
    fat: doc.data().fat,
  };
};

const getUserId = () => {
  const user = getAuth().currentUser;
  if (!user) return null;
  return user.uid;
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

const Foodlog = () => {
  const [foodDetails, setFoodDetails] = useState([]);
  const [customFoodDetails, setCustomFoodDetails] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    fetchAndSetFoodDetails();
  }, []);

  const fetchAndSetFoodDetails = async () => {
    try {
      // Fetch all meals from the foodDetails collection
      const foodDetailsQuery = await getDocs(collection(db, 'foodDetails'));
      const fetchedFoodDetails = foodDetailsQuery.docs.map(mapDocToFoodItem);
      setFoodDetails(fetchedFoodDetails);

      // Fetch custom meals for the current user from the customMeals collection
      const uid = getUserId();
      if (uid) {
        const customMealsQuery = query(collection(db, 'customMeals'), where('uid', '==', uid));
        const querySnapshot = await getDocs(customMealsQuery);
        const customMeals = querySnapshot.docs.map(mapDocToFoodItem);
        setCustomFoodDetails(customMeals);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateTask = (id, isChecked) => {
    if (isChecked) {
      setSelectedItems([...selectedItems, id]);
    } else {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAndSetFoodDetails();
    setRefreshing(false);
  };

  const handleSubmit = async () => {
    if (selectedItems.length === 0) {
      Alert.alert('Select an item', 'Please select at least one item before submitting.');
      return;
    }

    const allFoodDetails = [...foodDetails, ...customFoodDetails];
    const selectedFoodDetails = allFoodDetails.filter((foodItem) =>
      selectedItems.includes(foodItem.id)
    );
    const totalCalories = selectedFoodDetails.reduce((sum, item) => sum + item.calories, 0);
    const totalFat = selectedFoodDetails.reduce((sum, item) => sum + item.fat, 0);
    const totalCarbohydrate = selectedFoodDetails.reduce((sum, item) => sum + item.carbohydrate, 0);
    const totalProtein = selectedFoodDetails.reduce((sum, item) => sum + item.protein, 0);

    const mealType = getMealType();
    const mealName = selectedFoodDetails.map((item) => item.name).join(', ');
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
        calories: totalCalories,
        fat: totalFat,
        carbohydrate: totalCarbohydrate,
        protein: totalProtein,
        mealType,
        name: mealName,
        date: serverTimestamp(),
      });
      Alert.alert('Success', 'The food has been added to the database.');
      setSelectedItems([]);
    } catch (error) {
      console.error('Error writing document: ', error);
      Alert.alert('Error', 'There was a problem adding the food to the database.');
    }
  };

  const filteredFoodList = foodDetails.filter(foodItem =>
    foodItem.name && foodItem.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  const filteredCustomFoodList = customFoodDetails.filter(foodItem =>
    foodItem.name && foodItem.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchInput}
          onChangeText={setSearchInput}
          placeholder="Search..."
        />
        {filteredFoodList.length === 0 && searchInput !== '' && <Text style={styles.nothingFoundText}>Nothing found</Text>}
      </View>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <Text style={styles.sectionHeader}>All Meals</Text>
        {filteredFoodList.map((foodItem) => (
          <Foodlist
            key={foodItem.id}
            foodItem={foodItem}
            updateTask={updateTask}
          />
        ))}
        <Text style={styles.sectionHeader}>Custom Meals</Text>
        {filteredCustomFoodList.map((foodItem) => (
          <Foodlist
            key={foodItem.id}
            foodItem={foodItem}
            updateTask={updateTask}
          />
        ))}
      </ScrollView>
      <Button
        title="Log food"
        onPress={handleSubmit}
        color="#007bff"
        style={styles.logButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  scrollView: {
    flex: 1,
  },
  searchContainer: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginBottom: 10,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  nothingFoundText: {
    alignSelf: 'center',
    marginTop: 10,
    color: 'red',
  },
  logButton: {
    marginTop: 10,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
});

export default Foodlog;
