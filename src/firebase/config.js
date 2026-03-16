import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCtmbEBMffeMZOekUI-GPc5E68q9Ios10U",
  authDomain: "lab2014p4.firebaseapp.com",
  projectId: "lab2014p4",
  storageBucket: "lab2014p4.firebasestorage.app",
  messagingSenderId: "464951380690",
  appId: "1:464951380690:web:a03941f2eeb3ec5e3c7b0b"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
