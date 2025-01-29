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
        document.getElementById(targetContent).classList.add('active-content');
    });
});