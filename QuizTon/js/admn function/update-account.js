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
    updateDoc 
}from '../../js/general function/firebase.js';     


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////// Function to update teacher data in Firestore ///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


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



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////  Add the Edit button functionality to each row dynamically ///////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



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
