///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////SIDEBAR FUNCTIONS//////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


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
