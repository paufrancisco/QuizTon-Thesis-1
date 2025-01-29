// Select all sidebar links
const sidebarLinks = document.querySelectorAll('.sidebar-link');

// Add event listeners to sidebar links
sidebarLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Get the target content section
        const targetContent = this.getAttribute('data-target');
        
        // Hide all content sections
        document.querySelectorAll('.content').forEach(content => {
            content.classList.remove('active-content');
        });

        // Show the clicked content section
        document.getElementById(targetContent)?.classList.add('active-content');
    });
});

////////////////////////IMPORTS//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { collection, where,deleteDoc,getDocs, query, orderBy, addDoc, updateDoc} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";



// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyDBFxB8...",
    authDomain: "quizton-850ed.firebaseapp.com",
    projectId: "quizton-850ed",
    storageBucket: "quizton-850ed.firebasestorage.app",
    messagingSenderId: "792857775463",
    appId: "1:792857775463:web:296e0eecb6610f2d0f73c2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


 
////////////////////////Open Modal for New Teacher //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const newTeacherButton = document.getElementById("new-teacher");
const modal = document.createElement("div");
modal.classList.add("modal");
modal.innerHTML = `
    <div class="modal-content">
        <span class="close-btn">&times;</span>
        <h3>Register New Teacher</h3>
        <form id="new-teacher-form">
            <label for="email">Email:</label>
            <input type="email" id="email" required>
            <label for="firstname">First Name:</label>
            <input type="text" id="firstname" required>
            <label for="lastname">Last Name:</label>
            <input type="text" id="lastname" required>
            <label for="facultyID">Faculty ID:</label>
            <input type="text" id="facultyID" required>
            <label for="password">Generated Password:</label>
            <input type="text" id="password" readonly>
            <label for="role">Role:</label>
            <select id="role">
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
            </select>
            <label for="grade-level">Grade Level Assigned:</label>
            <input type="text" id="grade-level" required>
            <label for="dob">Date of Birth:</label>
            <input type="date" id="dob" required> 
            <label for="date-hired">Date Hired:</label>
            <input type="date" id="date-hired" required>
            <div class="modal-buttons">
                <button type="button" id="cancel-btn">Cancel</button>
                <button type="submit">Register</button>
            </div>
        </form>
    </div>
`;
document.body.appendChild(modal);

// Show Modal
newTeacherButton.addEventListener("click", () => {
    modal.style.display = "block";
});

// Close Modal
modal.querySelector(".close-btn").addEventListener("click", () => {
    modal.style.display = "none";
});
document.getElementById("cancel-btn").addEventListener("click", () => {
    modal.style.display = "none";
});

// Generate Password
const lastnameInput = document.getElementById("lastname");
const facultyIDInput = document.getElementById("facultyID");
const passwordInput = document.getElementById("password");
lastnameInput.addEventListener("input", generatePassword);
facultyIDInput.addEventListener("input", generatePassword);
function generatePassword() {
    const lastname = lastnameInput.value.trim();
    const facultyID = facultyIDInput.value.trim();
    if (lastname.length >= 3 && facultyID) {
        passwordInput.value = lastname.slice(-3) + facultyID;
    } else {
        passwordInput.value = "";
    }
}

////////////////////////// Register Teacher to Firestore //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

document.getElementById("new-teacher-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const teacherData = {
        email: document.getElementById("email").value,
        firstname: document.getElementById("firstname").value,
        lastname: document.getElementById("lastname").value,
        facultyID: document.getElementById("facultyID").value,
        password: document.getElementById("password").value,
        role: document.getElementById("role").value,
        gradeLevel: document.getElementById("grade-level").value,
        dob: document.getElementById("dob").value,
        dateHired: document.getElementById("date-hired").value
    };
    
    try {
        await addDoc(collection(db, "teacher_accounts"), teacherData);
        alert("Teacher registered successfully!");
        modal.style.display = "none";
    } catch (error) {
        console.error("Error adding document: ", error);
        alert("Failed to register teacher.");
    }
});

// Fetch and display teacher data from Firestore
const teacherTable = document.getElementById("teacher-table").getElementsByTagName("tbody")[0]; // Get the tbody of the table
    
    // Function to retrieve and display teacher accounts
    async function getTeacherAccounts() {
        // Reference to the "teacher_accounts" collection in Firestore
        const teacherRef = collection(db, "teacher_accounts");
        const teacherSnapshot = await getDocs(teacherRef);
        const teacherList = teacherSnapshot.docs.map(doc => doc.data()); // Get data from each document
        
        // Clear current table rows
        teacherTable.innerHTML = "";
        
        // Loop through the teacherList to add each row
        teacherList.forEach(teacher => {
            // Create a new row for each teacher
            const row = teacherTable.insertRow();
            
            // Create and populate the columns for each teacher
            const emailCell = row.insertCell(0);
            emailCell.textContent = teacher.email || "N/A";
            
            const passwordCell = row.insertCell(1);
            const passwordInput = document.createElement("input");
            passwordInput.type = "password";
            passwordInput.value = teacher.password || "N/A";
            passwordCell.appendChild(passwordInput);

            const showHideButton = document.createElement("button");
            showHideButton.textContent = "Show";
            showHideButton.onclick = function () {
                if (passwordInput.type === "password") {
                    passwordInput.type = "text";
                    showHideButton.textContent = "Hide";
                } else {
                    passwordInput.type = "password";
                    showHideButton.textContent = "Show";
                }
            };
            passwordCell.appendChild(showHideButton);
            
            const roleCell = row.insertCell(2);
            roleCell.textContent = teacher.role || "N/A";
            
            const dobCell = row.insertCell(3);
            dobCell.textContent = teacher.dob || "N/A";
            
            const dateHiredCell = row.insertCell(4);
            dateHiredCell.textContent = teacher.dateHired || "N/A";
            
            const gradeLevelCell = row.insertCell(5);
            gradeLevelCell.textContent = teacher.gradeLevel || "N/A";
            
            const statusCell = row.insertCell(6);
            statusCell.textContent = teacher.status || "Inactive";
            
            const actionsCell = row.insertCell(7);
             
            // Create the edit button
            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.classList.add("edit-btn");
            editButton.onclick = function () {
                openEditModal(teacher);
            };

            // Create the delete button
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.classList.add("delete-btn");

            // Adding confirmation prompt before deletion
            deleteButton.onclick = function () {
                // Show a confirmation dialog
                const confirmDelete = window.confirm("Are you sure you want to delete this teacher?");
                
                if (confirmDelete) {
                    // If the user confirms, proceed to delete
                    deleteTeacherFromFirestore(teacher.facultyID); // Pass the teacher's facultyID
                } else {
                    // If the user cancels, do nothing
                    console.log("Teacher deletion canceled.");
                }
            };

            actionsCell.appendChild(editButton);
            actionsCell.appendChild(deleteButton);
        });
    }

    // Call the function to retrieve and populate the table when the page loads
    window.addEventListener("DOMContentLoaded", getTeacherAccounts);




//////////////////////////// Function to show the modal and populate it with the selected teacher's data  ///////////////////////////////////////////////////////////
function openEditModal(teacherData) {
    // Populate the modal with teacher data
    document.getElementById("edit-email").value = teacherData.email || "";
    document.getElementById("edit-password").value = teacherData.password || "";
    document.getElementById("edit-role").value = teacherData.role || "";
    document.getElementById("edit-dob").value = teacherData.dob || "";
    document.getElementById("edit-date-hired").value = teacherData.dateHired || "";
    document.getElementById("edit-year-level").value = teacherData.gradeLevel || "";
    document.getElementById("edit-status").value = teacherData.status || "Inactive";

    console.log("Opening modal...");
    console.log(teacherData);
    
    // Show the modal
    document.getElementById("editModal").style.display = "block";
    
    // Handle form submission (saving the changes)
    document.getElementById("editForm").onsubmit = async function (event) {
        event.preventDefault();

        // Get updated data from the form
        const updatedTeacher = {
            email: document.getElementById("edit-email").value,
            password: document.getElementById("edit-password").value,
            role: document.getElementById("edit-role").value,
            dob: document.getElementById("edit-dob").value,
            dateHired: document.getElementById("edit-date-hired").value,
            gradeLevel: document.getElementById("edit-year-level").value,
            status: document.getElementById("edit-status").value
        };

        // Save the updated data to Firestore using facultyID as the unique identifier
        await updateTeacherInFirestore(teacherData.facultyID, updatedTeacher);

        // Close the modal after saving
        closeModal();
    };
}


////////////////////////////// Function to update teacher data in Firestore ///////////////////////////////////////////////////////////

async function updateTeacherInFirestore(facultyID, updatedTeacher) {
    if (!facultyID) {
        console.error("Error: Faculty ID is undefined.");
        return;
    }

    try {
        // Query Firestore by facultyID
        const teacherRef = query(
            collection(db, "teacher_accounts"),
            where("facultyID", "==", facultyID)
        );
        const teacherSnapshot = await getDocs(teacherRef);

        if (teacherSnapshot.empty) {
            console.error(`No teacher found with facultyID: ${facultyID}`);
            return;
        }

        // Assuming you get one teacher (adjust if multiple teachers can have the same facultyID)
        const teacherDoc = teacherSnapshot.docs[0];
        const teacherDocRef = teacherDoc.ref;

        // Update the document with the new data
        await updateDoc(teacherDocRef, updatedTeacher);
        console.log("Teacher account updated successfully!");

        // Refresh the teacher list after updating
        getTeacherAccounts();
        
    } catch (error) {
        console.error("Error updating teacher:", error);
    }
}

// Function to close the modal
function closeModal() {
    document.getElementById("editModal").style.display = "none";
}

// Close the modal when the "Close" button is clicked
document.getElementById("closeModal").addEventListener("click", closeModal);

const teacherRef = collection(db, "teacher_accounts");
const teacherSnapshot = await getDocs(teacherRef);
const teacherList = teacherSnapshot.docs.map(doc => doc.data()); // Get data from each document


////////////////////////////////  Add the Edit button functionality to each row dynamically ///////////////////////////////////////////////////////////
teacherList.forEach(teacher => {
    const row = teacherTable.insertRow();
    row.insertCell(0).textContent = teacher.email;
    row.insertCell(1).textContent = teacher.password;
    row.insertCell(2).textContent = teacher.role;
    row.insertCell(3).textContent = teacher.dob;
    row.insertCell(4).textContent = teacher.dateHired;
    row.insertCell(5).textContent = teacher.yearLevel;
    row.insertCell(6).textContent = teacher.status;
    const actionsCell = row.insertCell(7);
    
    // Create Edit Button
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.onclick = function () {
        openEditModal(teacher); // Open the modal with the teacher's data
    };

    // Create Delete Button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = async function () {
        // Implement delete functionality here
        await deleteTeacherFromFirestore(teacher.id);
        getTeacherAccounts(); // Reload the table after deletion
    };

    actionsCell.appendChild(editButton);
    actionsCell.appendChild(deleteButton);
});

//////////////////////////////////   Function to delete teacher from Firestore  ///////////////////////////////////////////////////////////


// Function to delete teacher from Firestore by facultyID
async function deleteTeacherFromFirestore(facultyID) {
    try {
        const teacherQuery = query(
            collection(db, "teacher_accounts"),
            where("facultyID", "==", facultyID)
        );

        const teacherSnapshot = await getDocs(teacherQuery);

        if (teacherSnapshot.empty) {
            console.error("No teacher found with facultyID:", facultyID);
            return;
        }

        const teacherDocRef = teacherSnapshot.docs[0].ref;
        await deleteDoc(teacherDocRef);
        alert("Teacher deleted successfully!");

        // Optionally, refresh the teacher list
        getTeacherAccounts();
        
    } catch (error) {
        console.error("Error deleting teacher:", error);
    }
}



//////////////////////////////////   logout function ///////////////////////////////////////////////////////////
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


 
