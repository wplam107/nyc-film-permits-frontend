// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { firebaseConfig } from "./config";
import { getFirestore } from "firebase/firestore";


const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore();

// import db from "./fs_emulator_connect";

export default db;