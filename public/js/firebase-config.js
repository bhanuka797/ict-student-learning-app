import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

// Replace with your Firebase project config
const firebaseConfig = {
  apiKey: "AIza....",
  authDomain: "ict-student-learning-app.firebaseapp.com",
  projectId: "ict-student-learning-app",
  storageBucket: "ict-student-learning-app.appspot.com",
  messagingSenderId: "3307....",
  appId: "1:3307...."
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
