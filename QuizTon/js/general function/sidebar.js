const links = document.querySelectorAll('.sidebar-link');
const contents = document.querySelectorAll('.content');

links.forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default anchor behavior

        // Remove the active-content class from all sections
        contents.forEach(content => content.classList.remove('active-content'));

        // Get the target section from the data-target attribute
        const target = link.getAttribute('data-target');

        // Add the active-content class to the targeted section
        document.getElementById(target).classList.add('active-content');
    });
});



const hamburgerMenu = document.querySelector('.hamburger-menu');
const sidebar = document.querySelector('.sidebar');

// Toggle the sidebar and update the hamburger menu icon
hamburgerMenu.addEventListener('click', () => {
    // Check if the sidebar is collapsed
    const isCollapsed = sidebar.classList.toggle('collapsed');

    
    if (isCollapsed) {
        hamburgerMenu.style.backgroundImage = 
     "url('../../images/next.png')";  
        
       
    } else {
        hamburgerMenu.style.backgroundImage = 
        "url('../../images/back.png')";  
    }
});
links.forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();

        // Remove 'active-content' from all sections and active class from all links
        contents.forEach(content => content.classList.remove('active-content'));
        links.forEach(link => link.classList.remove('active'));

        // Get the target section and activate it
        const target = link.getAttribute('data-target');
        document.getElementById(target).classList.add('active-content');

        // Add the 'active' class to the clicked link
        link.classList.add('active');
    });
});
