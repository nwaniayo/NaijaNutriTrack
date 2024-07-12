import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import db from '../db/firestore';
import { format } from 'date-fns';

const SummaryScreen = ({ navigation }) => {
  const initialMealSummary = {
    Breakfast: { calories: 0, fat: 0, carbohydrate: 0, protein: 0 },
    Lunch: { calories: 0, fat: 0, carbohydrate: 0, protein: 0 },
    Dinner: { calories: 0, fat: 0, carbohydrate: 0, protein: 0 },
  };

  const [mealSummary, setMealSummary] = useState(initialMealSummary);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const fetchAllMeals = async (date) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const uid = user.uid;
    setIsLoading(true);
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    try {
      const q = query(
        collection(db, 'foodLog'),
        where('date', '>=', startOfDay),
        where('date', '<=', endOfDay),
        where('uid', '==', uid)
      );
      const querySnapshot = await getDocs(q);
      const userMeals = querySnapshot.docs.map((doc) => doc.data());

      const summary = userMeals.reduce((acc, meal) => {
        const mealType = meal.mealType;
        acc[mealType].calories += meal.calories;
        acc[mealType].fat += meal.fat;
        acc[mealType].carbohydrate += meal.carbohydrate;
        acc[mealType].protein += meal.protein;
        return acc;
      }, initialMealSummary);

      setMealSummary(summary);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllMeals(currentDate);
  }, [currentDate]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAllMeals(currentDate);
    setRefreshing(false);
  };

  const goToPreviousDay = () => {
    const previousDay = new Date(currentDate);
    previousDay.setDate(currentDate.getDate() - 1);
    setCurrentDate(    previousDay);
  };

  const goToNextDay = () => {
    const nextDay = new Date(currentDate);
    nextDay.setDate(currentDate.getDate() + 1);
    setCurrentDate(nextDay);
  };

  const isToday = format(new Date(), 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd');

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.container}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#007bff" />
        ) : (
          <>
            
            <View style={styles.navigationContainer}>
              <TouchableOpacity onPress={goToPreviousDay}>
                <Text style={styles.navigationArrow}>←</Text>
              </TouchableOpacity>
              <Text style={styles.dateText}>{format(currentDate, 'MMMM do, yyyy')}</Text>
              {!isToday && (
                <TouchableOpacity onPress={goToNextDay}>
                  <Text style={styles.navigationArrow}>→</Text>
                </TouchableOpacity>
              )}
            </View>
            {Object.entries(mealSummary).map(([mealType, summary]) => (
              <View key={mealType} style={styles.mealDetails}>
                <Text style={styles.mealType}>{mealType}:</Text>
                <Text style={styles.detailText}>Calories: {summary.calories}</Text>
                <Text style={styles.detailText}>Fat: {summary.fat}g</Text>
                <Text style={styles.detailText}>Carbohydrate: {summary.carbohydrate}g</Text>
                <Text style={styles.detailText}>Protein: {summary.protein}g</Text>
              </View>
            ))}
            <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('Home')}>
              <Text style={styles.homeButtonText}>Go to Home</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f7',
    padding: 20,
  },
  header: {
    backgroundColor: '#0d47a1',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  navigationArrow: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0d47a1',
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0d47a1',
  },
  mealDetails: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mealType: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#0d47a1',
    marginBottom: 5,
  },
  detailText: {
    fontSize: 16,
    color: '#666',
  },
  homeButton: {
    backgroundColor: '#0d47a1',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  homeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SummaryScreen;

