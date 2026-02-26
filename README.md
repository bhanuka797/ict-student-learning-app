# ICT Student Learning App (PWA)

A simple Progressive Web App for Grade 6–13 ICT lessons with Firebase Authentication + Firestore.

---

## Super Easy Setup (10–15 minutes)

### 1) Create Firebase project
1. Go to Firebase Console.
2. Create a new project.
3. Enable these products:
   - **Authentication** → Sign-in method → **Email/Password**
   - **Firestore Database**
   - **Hosting**

### 2) Put your Firebase keys into the app
Open:
- `public/js/firebase-config.js`

Replace placeholder values with your real Firebase config.

### 3) Create users in Firebase Authentication
Create accounts in **Authentication → Users**:
- **Student account format**: `<StudentID>@ictlearning.local`
  - Example: `STU-001@ictlearning.local`
- **Admin/Teacher account**: normal email
  - Example: `teacher@school.edu`

### 4) Add Firestore documents
Create two collections:
- `students`
- `admins`

#### `students/{uid}` fields
Use the student's Firebase Auth UID as document ID.

Required fields:
- `StudentID` (string)
- `Name` (string)
- `Grade` (number: 6–13)
- `Phone` (string)
- `PaymentStatus` (string: `Free`, `Paid`, or `Expired`)
- `AccessStartDate` (string: `YYYY-MM-DD`)
- `AccessEndDate` (string: `YYYY-MM-DD`)
- `ProgressPercent` (number, optional)

#### `admins/{uid}` fields
Use the admin's Firebase Auth UID as document ID.

Required fields:
- `Name` (string)
- `role` (string: must be `teacher`)

### 5) Deploy to Firebase Hosting
Install CLI and login:
```bash
npm i -g firebase-tools
firebase login
```

Set your project ID in:
- `.firebaserc`

Deploy:
```bash
firebase deploy
```

---

## How Login Works (Important)

- Student types **Student ID + password** on login page.
- App automatically converts Student ID to email:
  - `StudentID + @ictlearning.local`
- Then Firebase Email/Password login is used.

So student must exist in Firebase Auth using this exact email pattern.

---

## Access Control Rules (Monthly Premium)

Premium lessons are allowed only when:
- `PaymentStatus === "Paid"`
- AND today is `<= AccessEndDate`

If expired:
- premium activities show as locked
- renewal message appears

---

## Admin Panel Capabilities

Admin can:
- View all students
- Filter **All / Active / Expired**
- Update:
  - `PaymentStatus`
  - `AccessStartDate`
  - `AccessEndDate`

---

## Grade Content Structure

Each grade folder includes:
- `free.html`
- `premium.html`

Paths:
- `public/grades/grade6/` … `public/grades/grade13/`

---

## PWA + Android Bubblewrap

Already included:
- `public/manifest.json`
- `public/service-worker.js`
- Mobile responsive UI

For production:
1. Replace placeholder app icons in `manifest.json` with your own local icons.
2. Host on Firebase.
3. Use Bubblewrap with your hosted HTTPS URL.

---

## Quick Troubleshooting

### Student cannot login
Check:
1. Student Auth email is exactly `<StudentID>@ictlearning.local`
2. Password is correct
3. Firestore `students/{uid}` doc exists for that same user UID

### Admin opens admin page but sees unauthorized
Check:
1. `admins/{uid}` document exists
2. field `role` is exactly `teacher`

### Premium still locked for paid student
Check:
1. `PaymentStatus` is exactly `Paid`
2. `AccessEndDate` is future date in `YYYY-MM-DD`

---

## Security note

`firestore.rules` is a starter file and should be reviewed and hardened before going live for real students.
