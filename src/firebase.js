import firebase from 'firebase';

const firebaseApp=firebase.initializeApp(
    {
        apiKey: "AIzaSyAtwksa38NhmUPiXy1ZSthgWlS6buAzzZA",
        authDomain: "instagram-clone-7facc.firebaseapp.com",
        projectId: "instagram-clone-7facc",
        storageBucket: "instagram-clone-7facc.appspot.com",
        messagingSenderId: "170726626242",
        appId: "1:170726626242:web:c7da88b411f60094717c5b",
        measurementId: "G-6Y8N05B5VC"
      }

);

const db=firebaseApp.firestore();
const auth=firebase.auth();

const storage=firebase.storage();

export {db,auth,storage};