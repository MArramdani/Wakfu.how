// Changelog specific functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize changelog page
    initializeChangelog();
});

function initializeChangelog() {
    console.log('Changelog page initialized');
    
    // Set current year in footer if needed
    const currentYear = new Date().getFullYear();
    const yearElement = document.querySelector('.current-year');
    if (yearElement) {
        yearElement.textContent = currentYear;
    }
    
    // Initialize animations for changelog entries
    initializeAnimations();
}

function initializeAnimations() {
    const entries = document.querySelectorAll('.changelog-item');
    
    // Make all entries immediately visible
    entries.forEach(entry => {
        entry.style.opacity = '1';
        entry.style.transform = 'translateY(0)';
    });
    
    // Optional: Add scroll-triggered animations for when new content loads
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    // Observe entries for future dynamic content
    entries.forEach(entry => {
        observer.observe(entry);
    });
}

// Utility function to format dates
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Export functions for potential future use
window.changelogUtils = {
    formatDate
};