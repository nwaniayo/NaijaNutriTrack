import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import db from '../db/firestore';
import { format } from 'date-fns';

const HomeScreen = () => {
  const [totalCalories, setTotalCalories] = useState(0);
  const [totalFat, setTotalFat] = useState(0);
  const [totalCarbohydrate, setTotalCarbohydrate] = useState(0);
  const [totalProtein, setTotalProtein] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [mealLog, setMealLog] = useState({ breakfast: [], lunch: [], dinner: [] });

  const fetchNutrientData = async (date) => {
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

      const totals = userMeals.reduce(
        (acc, meal) => {
          acc.calories += meal.calories;
          acc.fat += meal.fat;
          acc.carbohydrate += meal.carbohydrate;
          acc.protein += meal.protein;
          return acc;
        },
        { calories: 0, fat: 0, carbohydrate: 0, protein: 0 }
      );

      const mealLog = {
        breakfast: [],
        lunch: [],
        dinner: [],
      };

      userMeals.forEach((meal) => {
        const mealTime = format(meal.date.toDate(), 'hh:mm a');
        if (meal.mealType === 'Breakfast') {
          mealLog.breakfast.push({ name: meal.name, time: mealTime });
        } else if (meal.mealType === 'Lunch') {
          mealLog.lunch.push({ name: meal.name, time: mealTime });
        } else if (meal.mealType === 'Dinner') {
          mealLog.dinner.push({ name: meal.name, time: mealTime });
        }
      });

      setTotalCalories(totals.calories);
      setTotalFat(totals.fat);
      setTotalCarbohydrate(totals.carbohydrate);
      setTotalProtein(totals.protein);
      setMealLog(mealLog);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNutrientData(currentDate);
  }, [currentDate]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNutrientData(currentDate);
    setRefreshing(false);
  };

  const calculatePercentage = (value, total) => {
    return ((value / total) * 100).toFixed(2);
  };

  const progress = totalCalories / 2500;

  const currentHour = new Date().getHours();

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
            <View style={styles.summary}>
              <Text style={styles.title}>Total Nutrient Intake</Text>
              <Text style={styles.detailText}>Total Calories: {totalCalories}</Text>
              <Text style={styles.detailText}>Total Fat: {totalFat}g</Text>
              <Text style={styles.detailText}>Total Carbohydrate: {totalCarbohydrate}g</Text>
              <Text style={styles.detailText}>Total Protein: {totalProtein}g</Text>
            </View>
            <View>
              <Text style={styles.title}>Calorie Progress ({(progress * 100).toFixed(2)}%)</Text>
              <ProgressBar progress={progress} color="#0d47a1" style={styles.progressBar} />
            </View>
            <View style={styles.mealLog}>
              <Text style={styles.title}>Today's Meals</Text>
              <Text style={styles.detailText}>
                {currentHour > 12 && mealLog.breakfast.length === 0 ? 'No breakfast had today.' : `You had this for breakfast:`}
                {mealLog.breakfast.map((meal, index) => (
                  <Text key={index}>{`${meal.name} at ${meal.time}`}</Text>
                ))}
              </Text>
              <Text style={styles.detailText}>
                {currentHour > 16 && mealLog.lunch.length === 0 ? 'No lunch had today.' : `You had this for lunch: `}
                {mealLog.lunch.map((meal, index) => (
                  <Text key={index}>{` ${ meal.name } at ${ meal.time } `}</Text>
                ))}
              </Text>
              <Text style={styles.detailText}>
                {mealLog.dinner.length === 0 ? 'No dinner had today.' : `You had this for dinner:`}
                {mealLog.dinner.map((meal, index) => (
                  <Text key={index}>{`${meal.name} at ${meal.time}`}</Text>
                ))}
              </Text>
            </View>
            <View style={styles.recommendation}>
              <Text style={styles.title}>Nutrient Recommendations</Text>
              <Text style={styles.detailText}>
                Recommended Carbohydrates: 45-65% ({calculatePercentage(totalCarbohydrate, totalCalories)}%)
              </Text>
              <Text style={styles.detailText}>
                Recommended Protein: 10-35% ({calculatePercentage(totalProtein, totalCalories)}%)
              </Text>
              <Text style={styles.detailText}>
                Recommended Fat: 20-35% ({calculatePercentage(totalFat, totalCalories)}%)
              </Text>
            </View>
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
    padding: 40,
  },
  summary: {
    backgroundColor: '#fff3e0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  recommendation: {
    backgroundColor: '#e0f7fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#0d47a1',
  },
  detailText: {
    fontSize: 16,
    color: '#666',
  },
  mealLog: {
    backgroundColor: '#e8f5e9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default HomeScreen;
