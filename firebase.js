import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyB2Eaw65CFf9LKMPio3vU_BhSm6sWKPJf4",
  authDomain: "gaming-linkedin.firebaseapp.com",
  projectId: "gaming-linkedin",
  storageBucket: "gaming-linkedin.appspot.com",
  messagingSenderId: "207295354015",
  appId: "1:207295354015:web:e7264ec900b9d28f693eaa"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore();
const storage = getStorage();

export {app, auth, db, storage}; 