// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDHT-gYifPMlPMHWaxG8xkFLzkccgSnx80",
  authDomain: "marutifurniture-4d613.firebaseapp.com",
  projectId: "marutifurniture-4d613",
  storageBucket: "marutifurniture-4d613.firebasestorage.app",
  messagingSenderId: "293833322043",
  appId: "1:293833322043:web:10fd3d3ca841571a6e361e",
  measurementId: "G-53SK6VRW8K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);

export { db };  