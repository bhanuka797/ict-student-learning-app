import { db } from './firebase-config.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

export async function loginStudent(studentID, password) {
    try {
        const studentRef = doc(db, 'students', studentID);
        const studentSnap = await getDoc(studentRef);

        if (!studentSnap.exists()) {
            throw new Error("Student not found");
        }

        const studentData = studentSnap.data();

        if (studentData.password !== password) {
            throw new Error("Wrong password");
        }

        return studentData;

    } catch (error) {
        throw error;
    }
}
