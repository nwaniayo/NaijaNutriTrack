import React, { useState } from 'react';
import { Text, View, StyleSheet, KeyboardAvoidingView, TextInput, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const auth = getAuth();

const SignUp = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [loading, setLoading] = useState(false);

  const calculateBMI = (weight, height) => {
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  };

  const suggestTargetWeight = (bmi, height) => {
    // Suggest a target weight based on a healthy BMI range (18.5 - 24.9)
    const heightInMeters = height / 100;
    return 22 * heightInMeters * heightInMeters; // Using 22 as the optimal BMI value
  };

  const db = getFirestore();

  const signUp = async () => {
    const bmi = calculateBMI(parseFloat(weight), parseFloat(height));
    const suggestedWeight = suggestTargetWeight(bmi, parseFloat(height));
  
    if (parseFloat(targetWeight) >= parseFloat(weight)) {
      Alert.alert('Invalid Target Weight', 'Your target weight must be less than your current weight.');
      return;
    }
  
    setLoading(true);
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log(user);
  
      // User's UID
      const uid = user.uid;
  
      // User's data
      const userData = {
        age: parseInt(age, 10),
        bmi: bmi,
        email: email,
        height: parseInt(height, 10),
        targetWeight: parseInt(targetWeight, 10),
        weight: parseInt(weight, 10)
      };
  
      // Store user's data in Firestore with UID as the document ID
      await setDoc(doc(db, 'users', uid), userData);
  
      Alert.alert('Success', `Check your emails! Your suggested target weight is ${suggestedWeight.toFixed(2)} kg based on a BMI of ${bmi.toFixed(2)}.`);
    } catch (error) {
      console.error(error);
      Alert.alert('Sign up failed', error.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior="padding" style={styles.keyboardView}>
        <Text style={styles.title}>Create Your Account</Text>
        <TextInput
          value={email}
          style={styles.input}
          placeholder={'Email'}
          autoCapitalize="none"
          onChangeText={setEmail}
        />
        <TextInput
          secureTextEntry={true}
          value={password}
          style={styles.input}
          placeholder={'Password'}
          autoCapitalize="none"
          onChangeText={setPassword}
        />
        <TextInput
          value={age}
          style={styles.input}
          placeholder={'Age'}
          keyboardType="numeric"
          onChangeText={setAge}
        />
        <TextInput
          value={weight}
          style={styles.input}
          placeholder={'Weight (kg)'}
          keyboardType="numeric"
          onChangeText={setWeight}
        />
        <TextInput
          value={height}
          style={styles.input}
          placeholder={'Height (cm)'}
          keyboardType="numeric"
          onChangeText={setHeight}
        />
        <TextInput
          value={targetWeight}
          style={styles.input}
          placeholder={'Target Weight (kg)'}
          keyboardType="numeric"
          onChangeText={setTargetWeight}
        />
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <TouchableOpacity style={styles.button} onPress={signUp}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        )}
      </KeyboardAvoidingView>
      <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkButtonText}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      marginHorizontal: 20,
      flex: 1,
      justifyContent: 'center',
      backgroundColor: '#f7f7f7',
    },
    keyboardView: {
      justifyContent: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
    },
    input: {
      marginVertical: 10,
      height: 50,
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      padding: 15,
      backgroundColor: '#fff',
    },
    button: {
      backgroundColor: '#007bff',
      padding: 15,
      borderRadius: 8,
      marginVertical: 10,
    },
    buttonText: {
      textAlign: 'center',
      color: '#fff',
      fontWeight: 'bold',
    },
    linkButton: {
        marginTop: 10,
      },
      linkButtonText: {
        color: '#007bff',
        textAlign: 'center',
      },
  });
  export default SignUp;