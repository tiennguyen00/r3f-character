// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBNE7-FCG98BjZhUFWUjxu2qzaYrosp24M",
  authDomain: "r3f-character.firebaseapp.com",
  databaseURL:
    "https://r3f-character-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "r3f-character",
  storageBucket: "gs://r3f-character.appspot.com",
  messagingSenderId: "864784254552",
  appId: "1:864784254552:web:4644917df32940b62cec2d",
};

// Initialize Firebase
export const firebaseConfigApp = initializeApp(firebaseConfig);
