import { initializeApp } from "firebase/app"
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  
}

const firebaseapp = initializeApp(firebaseConfig)
const db = getFirestore(firebaseapp)
export {db}