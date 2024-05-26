// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-931b4.firebaseapp.com",
  projectId: "mern-blog-931b4",
  storageBucket: "mern-blog-931b4.appspot.com",
  messagingSenderId: "769167046528",
  appId: "1:769167046528:web:0f8db1c5dcfda42aea3365"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);