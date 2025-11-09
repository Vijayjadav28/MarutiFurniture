import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDHT-gYifPMlPMHWaxG8xkFLzkccgSnx80",
  authDomain: "marutifurniture-4d613.firebaseapp.com",
  projectId: "marutifurniture-4d613",
  storageBucket: "marutifurniture-4d613.appspot.com",
  messagingSenderId: "293833322043",
  appId: "1:293833322043:web:10fd3d3ca841571a6e361e",
  measurementId: "G-53SK6VRW8K",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export const auth = getAuth(app);   
export { db };

export const storage = getStorage(app);
