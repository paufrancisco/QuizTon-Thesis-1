document.addEventListener('DOMContentLoaded', function () {
    const tabs = document.querySelectorAll('[data-tab-target]');
    const tabContents = document.querySelectorAll('[data-tab-content]');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetContent = document.querySelector(tab.dataset.tabTarget);

             tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            tab.classList.add('active');
            targetContent.classList.add('active');
        });
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const loginButton = document.querySelector(".login-btn");
    const getStartedButton = document.querySelector(".get-started-btn");

    function fadeOutAndRedirect(event) {
        event.preventDefault();  
        document.body.classList.add("fade-out");  
        
        setTimeout(() => {
            window.location.href = event.target.closest("a").href;  
        }, 500);  
    }

    loginButton.addEventListener("click", fadeOutAndRedirect);
    getStartedButton.addEventListener("click", fadeOutAndRedirect);
});

