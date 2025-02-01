import { 
    auth, 
    db, 
    getAuth, 
    signOut, 
    collection, 
    doc, 
    getDocs, 
    getDoc 
} from '../js/general function/firebase.js';


const profileImage = document.getElementById('profile-image');
const profileDropdown = document.querySelector('.profile-dropdown');
const logoutButton = document.getElementById('logout-button');

// Toggle dropdown visibility when profile image is clicked
profileImage.addEventListener('click', (event) => {
    event.stopPropagation(); // Prevent click event from propagating to the document
    const isVisible = profileDropdown.style.display === 'block';
    profileDropdown.style.display = isVisible ? 'none' : 'block';
});

// Close the dropdown when clicking outside of it
document.addEventListener('click', (event) => {
    if (!profileImage.contains(event.target) && !profileDropdown.contains(event.target)) {
        profileDropdown.style.display = 'none';
    }
});

// Keep the dropdown open when clicking on the profile or dropdown itself
profileDropdown.addEventListener('click', (event) => {
    event.stopPropagation(); // Prevent event from closing the dropdown when interacting with it
});

// Function to fetch and display user details (first name, last name, email)
async function loadUserProfile() {
    const user = getAuth().currentUser; // Get the authenticated user

    if (!user) {
        console.error("No user is currently signed in.");
        return;
    }

    try {
        // Fetch the user document by UID from the 'teacher_accounts' collection
        const teacherRef = doc(db, "teacher_accounts", user.uid);
        const teacherSnapshot = await getDoc(teacherRef);

        if (teacherSnapshot.exists()) {
            const userData = teacherSnapshot.data(); // Get user data
            const userName = document.getElementById("user-name");
            const userEmail = document.getElementById("user-email");

            // Set the user profile dropdown data
            userName.textContent = `${userData.firstname} ${userData.lastname}`; // Set full name
            userEmail.textContent = userData.email; // Set email address
        } else {
            console.log("No user document found in Firestore.");
            // Optionally, handle this case (e.g., show a default message or redirect)
        }
    } catch (error) {
        console.error("Error fetching user data: ", error);
    }
}

// Add a listener to ensure the user is signed in before attempting to load the profile
getAuth().onAuthStateChanged((user) => {
    if (user) {
         loadUserProfile();
    } else { 
        console.log("User is not signed in");
    }
});
document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.querySelector(".sidebar");
    const mainContent = document.querySelector(".main-content");
    const hamburgerMenu = document.getElementById("hamburger-menu");

    hamburgerMenu.addEventListener("click", function () {
        sidebar.classList.toggle("collapsed");
        mainContent.classList.toggle("expanded");
    });
});

 