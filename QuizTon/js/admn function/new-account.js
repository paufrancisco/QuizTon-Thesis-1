import { 
    auth, 
    db, 
    getAuth, 
    signOut, 
    createUserWithEmailAndPassword, 
    collection, 
    where, 
    deleteDoc, 
    getDocs, 
    query, 
    doc, 
    setDoc, 
    updateDoc,
    EmailAuthProvider,
    reauthenticateWithCredential,
    getFirestore,
    signInWithEmailAndPassword
} from '../../js/general function/firebase.js';   


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////Open Modal for New Teacher //////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const newTeacherButton = document.getElementById("new-teacher");
const modal = document.querySelector(".modal");
const closeBtn = modal.querySelector(".close-btn");
const cancelBtn = document.getElementById("cancel-btn");

// Show Modal
newTeacherButton.addEventListener("click", () => {
    modal.style.display = "flex";  
});

// Close Modal
closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

cancelBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

// Optionally, close modal if user clicks outside
window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
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

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////// Register Teacher to Firestore //////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 

document.getElementById("new-teacher-form").addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent form submission

    const teacherData = {
        email: document.getElementById("email").value,
        firstname: document.getElementById("firstname").value,
        lastname: document.getElementById("lastname").value,
        facultyID: document.getElementById("facultyID").value,
        password: document.getElementById("password").value,
        role: document.getElementById("role").value,
        gradeLevel: document.getElementById("grade-level").value,
        dateHired: document.getElementById("date-hired").value
    };

    try {
        // Step 1: Get the currently signed-in admin
        const auth = getAuth();
        const db = getFirestore();
        const currentUser = auth.currentUser;

        if (!currentUser) {
            alert("No admin is signed in. Please sign in first.");
            return;
        }

        // Step 2: Store admin's email & prompt for re-authentication
        const adminEmail = currentUser.email;
        const adminPassword = prompt("Please enter your admin password to confirm session.");
        if (!adminPassword) {
            alert("Password is required to re-authenticate.");
            return;
        }

        // Step 3: Re-authenticate the admin to keep the session active
        const credential = EmailAuthProvider.credential(adminEmail, adminPassword);
        await reauthenticateWithCredential(currentUser, credential);

        // Step 4: Create the new teacher account
        const userCredential = await createUserWithEmailAndPassword(auth, teacherData.email, teacherData.password);
        const newUID = userCredential.user.uid; // Get the UID of the new teacher

        // Step 5: Store teacher data in Firestore
        await setDoc(doc(db, "teacher_accounts", newUID), {
            ...teacherData,
            uid: newUID // Save UID in Firestore
        });

        // Step 6: Sign the admin back in
        await signInWithEmailAndPassword(auth, adminEmail, adminPassword);

        // Step 7: Provide feedback and close modal
        alert("Teacher registered successfully!");
        getTeacherAccounts();  // Refresh teacher accounts
        modal.style.display = "none";

    } catch (error) {
        console.error("Error creating user:", error);
        alert(`Error: ${error.code} - ${error.message}`);

        // Handle specific error cases
        if (error.code === 'auth/email-already-in-use') {
            alert("The email address is already registered.");
        } else if (error.code === 'auth/invalid-email') {
            alert("The email address is not valid.");
        } else if (error.code === 'auth/weak-password') {
            alert("The password is too weak. It must be at least 6 characters.");
        } else {
            alert("An error occurred. Please try again.");
        }
    }
});





//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////Fetch and display teacher data from Firestore//////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


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
    




///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////// Function to show the modal and populate it with the selected teacher's data  /////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

window.addEventListener("load", () => {
    modal.style.display = "none";
});