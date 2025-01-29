import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

console.log("Firestore initialized successfully:", db);



 // Handle Signup
 document.addEventListener("DOMContentLoaded", function () {
     const signupForm = document.getElementById("signupForm");

     signupForm.addEventListener("submit", async (e) => {
         e.preventDefault();

         const firstName = document.getElementById("firstName").value;
         const lastName = document.getElementById("lastName").value;
         const email = document.getElementById("email").value;
         const password = document.getElementById("password").value;
         const facultyId = document.getElementById("password").value;
         const confirmPassword = document.getElementById("confirmPassword").value;
         const role = document.getElementById("role").value;

         // Password Confirmation Check
         if (password !== confirmPassword) {
             alert("Passwords do not match!");
             return;
         }


         try {
             // Save user in Firestore (Pending approval)
             await addDoc(collection(db, "pending_users"), {
                 firstName: firstName,
                 lastName: lastName,
                 email: email,
                 password: password,  
                 role: role,
                 facultyID: facultyId,
                 status: "pending"
             });

             alert("Signup request sent! Please wait for admin approval.");
             signupForm.reset();
         } catch (error) {
             console.error("Error during signup:", error);
             alert("Error signing up.");
         }
     });

     // Show/Hide Password Functionality
     document.querySelectorAll(".toggle-password").forEach(toggle => {
         toggle.addEventListener("click", function () {
             const input = this.previousElementSibling;
             if (input.type === "password") {
                 input.type = "text";
                 this.textContent = "👁️‍🗨️"; // Eye Open Icon
             } else {
                 input.type = "password";
                 this.textContent = "🙈"; // Eye Closed Icon
             }
         });
     });
 });