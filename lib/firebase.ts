import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyD3yGOxqRWOpLtLWdrdQBEpfmOnVMXVwpI",
  authDomain: "tulong-db976.firebaseapp.com",
  databaseURL: "https://tulong-db976-default-rtdb.firebaseio.com",
  projectId: "tulong-db976",
  storageBucket: "tulong-db976.firebasestorage.app",
  messagingSenderId: "812692292705",
  appId: "1:812692292705:web:38e5bf616cb5ae0c75d620",
  measurementId: "G-CDGG0TV2RN"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);


