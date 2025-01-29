import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

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
const auth = getAuth(app);

// Handle Sign In
document.addEventListener("DOMContentLoaded", () => {
    const signinForm = document.getElementById("signinForm");

    signinForm.addEventListener("submit", async (e) => {
        e.preventDefault();  

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            alert("Sign-in successful! Redirecting...");
            window.location.href = "/QuizTon-Thesis-1/QuizTon/html/dashboard/admin.html";
        } catch (error) {
            console.error("Error signing in:", error);
            alert("Sign-in failed: " + error.message);
        }
    });
});
