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
