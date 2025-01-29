///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////IMPORTS////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { collection, where,deleteDoc,getDocs, query, doc, setDoc, updateDoc} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, signOut, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";



// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyDBFxB8rWCl3Qoxuh8zdetKwv4u3AmvxYM",
    authDomain: "quizton-850ed.firebaseapp.com",
    projectId: "quizton-850ed",
    storageBucket: "quizton-850ed.firebasestorage.app",
    messagingSenderId: "792857775463",
    appId: "1:792857775463:web:296e0eecb6610f2d0f73c2"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);










//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////// logout function ///////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


document.getElementById('logout-button').addEventListener('click', function (event) {
    event.preventDefault(); // Prevent default behavior of the link

    const auth = getAuth();
    
    // Sign out the user
    signOut(auth).then(() => {
        // Redirect to the login page or a landing page
        window.location.href = "/QuizTon-Thesis-1/QuizTon/html/sign_In.html";
    }).catch((error) => {
        // Handle errors here
        console.error("Error during logout: ", error);
        alert("An error occurred while logging out. Please try again.");
    });
});