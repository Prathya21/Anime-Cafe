import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyDY7iJIrdLpAVg7TYPLuPvTuVj1m63Hx4Q",
  authDomain: "productivity-9a7aa.firebaseapp.com",
  projectId: "productivity-9a7aa",
  storageBucket: "productivity-9a7aa.firebasestorage.app",
  messagingSenderId: "919057149076",
  appId: "1:919057149076:web:4df91a4e856166cfed9881",
  measurementId: "G-BFFPTWNC53"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export default app
