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
} from '../../js/general function/firebase.js';   


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////   Function to delete teacher from Firestore  ///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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