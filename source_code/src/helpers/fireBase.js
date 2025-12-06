// Firebase initialization and utility functions
// Put your Firebase config into .env.local or replace process.env.
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as fbSignOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, getDocs, doc, getDoc, setDoc, addDoc, query, orderBy, limit } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC6HRjS2ShUYcebZRuOobMZ96O8v2LZUJU",
  authDomain: "boggle-solver-b7411.firebaseapp.com",
  projectId: "boggle-solver-b7411",
  storageBucket: "boggle-solver-b7411.firebasestorage.app",
  messagingSenderId: "651982784080",
  appId: "1:651982784080:web:47f39d418f0fed61377355",
  measurementId: "G-7SXELPRYCY"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export async function signIn() {
  return signInWithPopup(auth, provider);
}

export function signOut() {
  return fbSignOut(auth);
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

export { auth, db, collection, getDocs, doc, getDoc, setDoc, addDoc, query, orderBy, limit };



