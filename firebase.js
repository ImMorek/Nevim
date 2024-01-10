// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore"

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBjNBeQMLzKH_brNRhw3J8ORSprtpXzH6o",
  authDomain: "nevim-6d7fc.firebaseapp.com",
  projectId: "nevim-6d7fc",
  storageBucket: "nevim-6d7fc.appspot.com",
  messagingSenderId: "513957091176",
  appId: "1:513957091176:web:f30f12bbfebbb075bce8dd",
  measurementId: "G-6YE1KKLNEZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
export {db}