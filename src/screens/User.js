import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import Login from './Login';

export const ProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const uid = user.uid;
        const userRef = doc(db, 'users', uid);
        try {
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setUserData(userSnap.data());
          } else {
            console.log('No user data found!');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false);
        }
      } else {
        console.log('No user is currently signed in.');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate('SignUp');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const calculateBMR = (weight, height, age, gender) => {
    if (gender === 'male') {
      return 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      return 10 * weight + 6.25 * height - 5 * age - 161;
    }
  };

  const calculateCalorieDeficit = (bmr) => {
    return bmr - 300; // 300 calorie deficit for weight loss
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.message}>No user data available.</Text>
      </View>
    );
  }

  const { weight, height, age, gender, targetWeight } = userData;
  const bmr = calculateBMR(weight, height, age, gender);
  const calorieDeficit = calculateCalorieDeficit(bmr);

  // Export the calorieDeficit value

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Profile</Text>
      </View>
      <View style={styles.profileInfo}>
        <View style={styles.profileInfoPrimary}>
          <Text style={styles.label}>Email: <Text style={styles.valuePrimary}>{userData.email}</Text></Text>
          <Text style={styles.label}>Age: <Text style={styles.valuePrimary}>{userData.age}</Text></Text>
        </View>
        <View style={styles.profileInfoSecondary}>
          <Text style={styles.label}>Weight: <Text style={styles.valueSecondary}>{userData.weight} kg</Text></Text>
          <Text style={styles.label}>Height: <Text style={styles.valueSecondary}>{userData.height} cm</Text></Text>
          <Text style={styles.label}>Target Weight: <Text style={styles.valueSecondary}>{userData.targetWeight} kg</Text></Text>
        </View>
      </View>
      <View style={styles.recommendation}>
        <Text style={styles.recommendationText}>
          To reach your target weight of {targetWeight} kg, maintain a daily calorie intake of approximately {calorieDeficit.toFixed(0)} calories.
        </Text>
        <Text style={styles.recommendationText}>
          This plan will help you achieve a weight loss of approximately 0.5 kg per week.
        </Text>
      </View>
      <TouchableOpacity style={styles.smallButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
    backgroundColor: '#f0f4f7',
    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', // Adds subtle shadow to the container
  },
  header: {
    marginBottom: 20,
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#0d47a1', // Dark blue background for the header
    borderRadius: 10,
    shadowColor: '#000', // Shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileInfoPrimary: {
    marginBottom: 20,
    backgroundColor: '#e3f2fd', // Light blue background for primary info
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000', // Shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  valuePrimary: {
    fontWeight: 'bold',
    color: '#0d47a1', // Dark blue color for primary info text
    fontSize: 20,
  },
  profileInfoSecondary: {
    backgroundColor: '#fff3e0', // Light orange background for secondary info
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000', // Shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  valueSecondary: {
    fontWeight: 'normal',
    color: '#bf360c', // Dark orange color for secondary info text
    fontSize: 18,
  },
  recommendation: {
    backgroundColor: '#e0f7fa', // Light cyan background for recommendations
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000', // Shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginVertical: 20,
  },
  recommendationText: {
    fontSize: 16,
    color: '#00796b', // Dark cyan color for recommendation text
    marginBottom: 10,
  },
  smallButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10, // Smaller padding for a smaller button
    paddingHorizontal: 15, // Smaller padding for a smaller button
    borderRadius: 5,
    alignItems: 'center',
    shadowColor: '#000', // Shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14, // Slightly smaller font size
    fontWeight: 'bold',
    textTransform: 'uppercase', // Makes button text uppercase for a more defined look
  },
  message: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center', // Centers the message text
    marginHorizontal: 20, // Adds horizontal margin
  },
  label: {
    marginBottom: 10,
    fontSize: 18,
    color: '#333',
    letterSpacing: 0.5, // Adds spacing between characters for better readability
  },
  value: {
    fontWeight: 'bold',
    color: '#555',
    fontSize: 20, // Slightly larger font size for emphasis
  },
});

export default ProfileScreen;
