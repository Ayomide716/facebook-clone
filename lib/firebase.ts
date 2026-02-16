import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyC8R0l6Pc2ShkN8eBJcTwZGVs9fVx_hQRM",
  authDomain: "ais-bfe23.firebaseapp.com",
  projectId: "ais-bfe23",
  storageBucket: "ais-bfe23.firebasestorage.app",
  messagingSenderId: "921203946130",
  appId: "1:921203946130:web:ff04e586d4a66cb3836c4b",
  measurementId: "G-LS8NV0FR33"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);