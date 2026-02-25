# ICT Student Learning App (PWA)

Progressive Web App for Grade 6-13 ICT lessons with Firebase Authentication + Firestore.

## Features
- Student login using Student ID + password (Student ID converted to virtual auth email)
- Admin/Teacher login
- Monthly premium access control based on `AccessEndDate`
- Student dashboard with:
  - Free activities
  - Premium activities (auto-lock when expired)
  - Progress tracker
  - Leaderboard placeholder
- Admin panel to manage payment/access dates and filter active/expired students
- PWA support (`manifest.json`, `service-worker.js`) for installability

## Data Model
Firestore collections:
- `students/{uid}`
- `admins/{uid}`

Student fields:
- `StudentID`
- `Name`
- `Grade`
- `Phone`
- `PaymentStatus` (Free/Paid/Expired)
- `AccessStartDate` (YYYY-MM-DD)
- `AccessEndDate` (YYYY-MM-DD)
- `ProgressPercent` (number, optional)

Admin fields:
- `Name`
- `role` = `teacher`

## Setup
1. Configure Firebase in `public/js/firebase-config.js`.
2. Enable Email/Password sign-in in Firebase Authentication.
3. Create accounts in Auth:
   - Students: email format `<StudentID>@ictlearning.local`
   - Admins: regular teacher email
4. Add matching profile docs in Firestore (`students` or `admins`).
5. Deploy:
   ```bash
   firebase deploy
   ```

## Bubblewrap Notes
- PWA uses `display: standalone` and valid manifest fields.
- After hosting, run Bubblewrap pointing to the hosted URL.
