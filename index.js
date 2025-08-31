// Handle navigation and sidebar functionality
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sidebar = document.querySelector('.sidebar');
    const toggleButton = document.querySelector('.sidebar-toggle');
    
    // Set active link based on current page
    function setActiveLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            
            // Remove active class from all links first
            link.classList.remove('active');
            
            // Check if this link matches current page
            if (linkHref === currentPage || 
                (currentPage === '' && linkHref === 'index.html') ||
                (window.location.hash && linkHref === window.location.hash)) {
                link.classList.add('active');
            }
        });
    }
    
    // Set initial active state
    setActiveLink();
    
    // Add click event listeners to all navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Handle hash links (internal page navigation)
            if (href.startsWith('#')) {
                e.preventDefault();
                
                // Remove active class from all links
                navLinks.forEach(l => l.classList.remove('active'));
                // Add active class to clicked link
                this.classList.add('active');
                
                // Update URL hash
                window.location.hash = href;
                
                // Update content for hash-based navigation
                updateContentForHash(href);
            }
            // For actual page links, let the browser handle them normally
            // (no preventDefault(), so they will work as regular links)
        });
    });
    
    // Update content based on hash
    function updateContentForHash(hash) {
        const pageTitle = document.querySelector('.page-title');
        const pageDescription = document.querySelector('.page-description');
        const contentCards = document.querySelectorAll('.content-card');
        
        if (!pageTitle || !pageDescription) return;
        
        // Simple content switching based on hash
        switch(hash) {
            case '#analytics':
                pageTitle.textContent = 'Getting Started with Wakfu';
                pageDescription.textContent = 'Begin your adventure in the World of Twelve with our comprehensive beginner guides.';
                updateCardContent(contentCards, 'Getting Started');
                break;
            case '#settings':
                pageTitle.textContent = 'Latest Community Posts';
                pageDescription.textContent = 'Stay updated with the latest discussions, news, and updates from the Wakfu community.';
                updateCardContent(contentCards, 'Community');
                break;
            default:
                // Default content (home page)
                pageTitle.textContent = 'Wakfu Guides & Resources';
                pageDescription.textContent = 'Your comprehensive resource for Wakfu game guides, dungeon strategies, and theorycrafting.';
                updateCardContent(contentCards, 'Wakfu');
        }
    }
    
    // Helper function to update card content
    function updateCardContent(cards, pageName) {
        cards.forEach((card, index) => {
            const heading = card.querySelector('h2');
            const paragraph = card.querySelector('p');
            
            if (!heading || !paragraph) return;
            
            switch(index) {
                case 0:
                    heading.textContent = `About ${pageName}`;
                    paragraph.textContent = `Explore comprehensive resources and information about ${pageName.toLowerCase()}. Find everything you need to enhance your gameplay experience.`;
                    break;
                case 1:
                    heading.textContent = `${pageName} Resources`;
                    paragraph.textContent = `Access detailed guides, strategies, and tips to master ${pageName.toLowerCase()} aspects of the game.`;
                    break;
                case 2:
                    heading.textContent = `Latest ${pageName} Updates`;
                    paragraph.textContent = `Stay informed about the newest developments, changes, and community discussions related to ${pageName.toLowerCase()}.`;
                    break;
            }
        });
    }
    
    // Handle hash changes on page load
    if (window.location.hash) {
        updateContentForHash(window.location.hash);
    }
    
    // Handle browser back/forward buttons
    window.addEventListener('hashchange', function() {
        setActiveLink();
        updateContentForHash(window.location.hash);
    });
    
    // Sidebar toggle functionality
    if (sidebar && toggleButton) {
        // Check if we have a saved state in localStorage
        const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
        
        // Set initial state
        if (isCollapsed) {
            sidebar.classList.add('collapsed');
        }
        
        // Toggle sidebar
        toggleButton.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            
            // Save state to localStorage
            const isNowCollapsed = sidebar.classList.contains('collapsed');
            localStorage.setItem('sidebarCollapsed', isNowCollapsed);
        });
        
        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', function(event) {
            if (window.innerWidth <= 992 && 
                !sidebar.contains(event.target) && 
                !toggleButton.contains(event.target) &&
                !sidebar.classList.contains('collapsed')) {
                sidebar.classList.add('collapsed');
                localStorage.setItem('sidebarCollapsed', 'true');
            }
        });
    }
    
    // Remove the debug script if it exists
    const debugScript = document.querySelector('script[src*="debug"]');
    if (debugScript) {
        debugScript.remove();
    }
});

// Handle actual page navigation (for when users click on real page links)
async function loadPage(page) {
    try {
        console.log('Loading page:', page);
        
        const response = await fetch(page);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const html = await response.text();
        
        // Extract just the main content from the response
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const mainContent = doc.querySelector('.main-content');
        
        if (!mainContent) {
            throw new Error('No .main-content element found in the response');
        }
        
        // Update the main content area
        document.getElementById('main-content').innerHTML = mainContent.innerHTML;
        
        // Update page title if available
        const newTitle = doc.querySelector('title');
        if (newTitle) {
            document.title = newTitle.textContent;
        }
        
        console.log('Page loaded successfully:', page);
        
    } catch (error) {
        console.error('Error loading page:', error);
        document.getElementById('main-content').innerHTML = `
            <div class="page-header">
                <h1 class="page-title">Error Loading Content</h1>
                <p class="page-description">The page could not be loaded. Please try again later.</p>
                <p>Error: ${error.message}</p>
            </div>
        `;
    }
}