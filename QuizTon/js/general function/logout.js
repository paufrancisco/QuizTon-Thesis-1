import { 
    auth, 
    db, 
    getAuth, 
    signOut, 
    createUserWithEmailAndPassword, 
    collection, 
    where, 
    deleteDoc, 
    query, 
    doc, 
    setDoc, 
    updateDoc 
} from '../../js/general function/firebase.js';   





//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////// logout function ///////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
document.getElementById('logout-button').addEventListener('click', function (event) {
    event.preventDefault(); // Prevent default behavior of the link

    const auth = getAuth();
    
    if (auth.currentUser) {
        // Sign out the user
        signOut(auth).then(() => {
            // Redirect to the login page or a landing page
            window.location.href = "../welcome.html";
        }).catch((error) => {
            // Handle errors here
            console.error("Error during logout: ", error);
            alert("An error occurred while logging out. Please try again.");
        });
    } else {
        console.log("No user is currently signed in.");
        alert("You are not logged in.");
    }
});

