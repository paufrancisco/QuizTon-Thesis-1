import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDBFxB8rWCl3Qoxuh8zdetKwv4u3AmvxYM",
  authDomain: "quizton-850ed.firebaseapp.com",
  projectId: "quizton-850ed",
  storageBucket: "quizton-850ed.firebasestorage.app",
  messagingSenderId: "792857775463",
  appId: "1:792857775463:web:296e0eecb6610f2d0f73c2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
  const signinForm = document.getElementById("signinForm");

  signinForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch user data from Firestore
      const userDoc = await getDoc(doc(db, "teacher_accounts", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();

        // Check the role and redirect accordingly
        if (userData.role === "admin") {
          window.location.href = "dashboard/admin.html";
        } else if (userData.role === "teacher") {
          window.location.href = "dashboard/teacher.html";
        } else {
          alert("Unknown role. Please contact an administrator.");
        }
      } else {
        alert("User data not found.");
      }
    } catch (error) {
      console.error("Error signing in:", error);
      alert("Sign-in failed: " + error.message);
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const signinForm = document.getElementById('signinForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const rememberMeCheckbox = document.getElementById('rememberMe');
  
  // Check if "Remember Me" was checked previously and load the saved email
  if (localStorage.getItem('rememberMe') === 'true') {
      emailInput.value = localStorage.getItem('email');
      rememberMeCheckbox.checked = true;
  }

  // Toggle password visibility
  const togglePassword = document.querySelector('.toggle-password');
  togglePassword.addEventListener('click', () => {
      const type = passwordInput.type === 'password' ? 'text' : 'password';
      passwordInput.type = type;
      togglePasswordIcon.src = type === 'password' ? '../images/eye-icon.png' : '../images/eye-slash.png';
    });

  signinForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const email = emailInput.value;
      const password = passwordInput.value;

       
      if (rememberMeCheckbox.checked) {
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem('email', email);
      } else {
          localStorage.setItem('rememberMe', 'false');
          localStorage.removeItem('email');
      }

       console.log('Sign In with', email, password);
  });
});
