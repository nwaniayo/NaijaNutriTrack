// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
//import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
//import { initializeAuth, getReactNativePersistence } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDV87R6PRsG2VZON8q1QWvRdIngviaV7AQ",
  authDomain: "fooddata-c11a1.firebaseapp.com",
  projectId: "fooddata-c11a1",
  storageBucket: "fooddata-c11a1.appspot.com",
  messagingSenderId: "237880819678",
  appId: "1:237880819678:web:9c38271db62065593ae74f",
  measurementId: "G-GZHWYNDQDX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize Firebase Authentication and set the persistence
/*const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Now you can use the `auth` object to perform authentication operations
// For example, to listen to the authentication state:
onAuthStateChanged(auth, user => {
  if (user) {
    // User is signed in
  } else {
    // User is signed out
  }
});
*/
export const fetchData = async () => {
  const querySnapshot = await getDocs(collection(db, 'foodDetails'));
  const tasks = querySnapshot.docs.map(doc => ({
    id: doc.id,
    name: doc.data().name,
    protein: doc.data().protein,
    calories: doc.data().calories,
    carbohydrate: doc.data().carbohydrate,
    fat: doc.data().fat, // Corrected typo (Fat to fat)
  }));
  return tasks;
};

export const authentication = getAuth(app); // Export the authentication object
export default db;
