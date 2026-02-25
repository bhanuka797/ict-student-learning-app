import { auth, db } from './firebase-config.js';
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

export async function loginWithRole({ role, studentId, email, password }) {
  const loginEmail = role === 'student' ? `${studentId}@ictlearning.local` : email;
  const cred = await signInWithEmailAndPassword(auth, loginEmail, password);
  const profileRef = doc(db, role === 'student' ? 'students' : 'admins', cred.user.uid);
  const profileSnap = await getDoc(profileRef);

  if (!profileSnap.exists()) {
    throw new Error('Profile not found. Please contact administrator.');
  }

  const profile = profileSnap.data();
  if (role === 'admin' && profile.role !== 'teacher') {
    throw new Error('Unauthorized admin account.');
  }

  return { user: cred.user, profile };
}

export function observeAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

export async function logout() {
  await signOut(auth);
}
