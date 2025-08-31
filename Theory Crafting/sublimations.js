// Load rune data from external JSON file
let runes = [];

// Function to load rune data with fallback
async function loadRuneData() {
    try {
        // Try to fetch from external JSON file
        const response = await fetch('sublimations.json');
        
        if (!response.ok) {
            throw new Error('JSON file not found');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading JSON file, using fallback data:', error);
        
        // Fallback to embedded data if JSON file can't be loaded
        return [
            {
                "name": "Influence",
                "colors": ["G", "B", "G"],
                "description": "[1] 3% Critical Hit",
                "rarity": "Rare / Mythic / Legendary",
                "effect": "Per additional level: +3% Critical hit",
                "maxLevel": "[6]",
                "obtenation": "Runic Mimic",
                "levelRange": "1-20"
            },
            {
                "name": "Length",
                "colors": ["B", "R", "R"],
                "description": "[1] 2% Damage Inflicted on aligned targets 2 or more cells away from the state bearer",
                "rarity": "Rare / Mythic / Legendary",
                "effect": "Per additional level: +2% Damage Inflicted",
                "maxLevel": "[6]",
                "obtenation": "",
                "levelRange": "1-20"
            },
            // Add more fallback data as needed
        ];
    }
}

// Initialize the application
async function initApp() {
    try {
        runes = await loadRuneData();
        initializePage();
    } catch (error) {
        console.error('Error initializing application:', error);
        const runesContainer = document.getElementById('runesContainer');
        if (runesContainer) {
            runesContainer.innerHTML = `
                <div class="no-results">
                    <h3>Error Loading Data</h3>
                    <p>Could not load sublimation data. Please try again later.</p>
                    <p>Error: ${error.message}</p>
                </div>
            `;
        }
    }
}

// Initialize the page after data is loaded
function initializePage() {
    // Extract unique level ranges
    const levelRanges = [...new Set(runes.map(rune => rune.levelRange))].sort((a, b) => {
        const aMin = parseInt(a.split('-')[0]);
        const bMin = parseInt(b.split('-')[0]);
        return aMin - bMin;
    });

    // Generate level tabs
    const levelTabsContainer = document.getElementById('levelTabs');
    if (!levelTabsContainer) {
        console.error('Level tabs container not found');
        return;
    }
    
    levelTabsContainer.innerHTML = '<div class="level-tab active" data-level="all">All Levels</div>';
    
    levelRanges.forEach(range => {
        const tab = document.createElement('div');
        tab.className = 'level-tab';
        tab.textContent = `Level ${range}`;
        tab.setAttribute('data-level', range);
        levelTabsContainer.appendChild(tab);
    });

    // Function to render runes
    function renderRunes(runesToRender) {
        const container = document.getElementById('runesContainer');
        if (!container) {
            console.error('Runes container not found');
            return;
        }
        
        if (runesToRender.length === 0) {
            container.innerHTML = '<div class="no-results">No sublimation matches your search criteria</div>';
            return;
        }
        
        container.innerHTML = '';
        
        let lastObtenation = "";
        
        runesToRender.forEach(rune => {
            // Use the last obtenation value if current is empty
            if (rune.obtenation && rune.obtenation.trim() !== "") {
                lastObtenation = rune.obtenation;
            }
            const obtenationValue = rune.obtenation && rune.obtenation.trim() !== "" ? rune.obtenation : lastObtenation;
            
            const card = document.createElement('div');
            card.className = 'rune-card';

            card.innerHTML = `
<div class="rune-header">
    <div class="rune-name">${rune.name}</div>
    <div class="rune-colors">
        ${rune.colors.map(color => {
            let colorClass = '';
            let colorName = '';
            if (color === 'G') {
                colorClass = 'color-green';
                colorName = 'Green';
            }
            if (color === 'R') {
                colorClass = 'color-red'; 
                colorName = 'Red';
            }
            if (color === 'B') {
                colorClass = 'color-blue';
                colorName = 'Blue';
            }
            return `<div class="rune-color ${colorClass}" title="${colorName} Slot">${color}</div>`;
        }).join('')}
    </div>
</div>
<div class="rune-body">
    <div class="rune-description">
        <div class="effect-label">Description</div>
        ${rune.description}
    </div>
    <div class="level-effect-maxlevel">
        <div class="level-effect">
            <div class="effect-label">Effect for Additional Levels</div>
            <div>${rune.effect}</div>
        </div>
        <div class="max-level-mini">
            <div class="detail-label">Max Level</div>
            <div class="detail-value">${rune.maxLevel}</div>
        </div>
    </div>
    <div class="rune-details">
        <div class="detail-item">
            <div class="detail-label">Drop Rarity</div>
            <div class="detail-value">${rune.rarity}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Level Range</div>
            <div class="detail-value">${rune.levelRange}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Obtenation</div>
            <div class="detail-value">${obtenationValue}</div>
        </div>
    </div>
</div>
`;
            container.appendChild(card);
        });
    }
    
    // Function to filter runes based on criteria
    function filterRunes() {
        const searchInput = document.getElementById('searchInput');
        const activeLevelTab = document.querySelector('.level-tab.active');
        
        if (!searchInput || !activeLevelTab) {
            return runes;
        }
        
        const searchTerm = searchInput.value.toLowerCase();
        const activeLevel = activeLevelTab.getAttribute('data-level');
        
        return runes.filter(rune => {
            // Search filter
            if (searchTerm && !rune.name.toLowerCase().includes(searchTerm) && 
                !rune.description.toLowerCase().includes(searchTerm) && 
                !rune.obtenation.toLowerCase().includes(searchTerm)) {
                return false;
            }
            
            // Level filter
            if (activeLevel !== 'all' && rune.levelRange !== activeLevel) {
                return false;
            }
            
            return true;
        });
    }
    
    // Event listeners for filters
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const filteredRunes = filterRunes();
            renderRunes(filteredRunes);
        });
    }
    
    // Add search button event listener if the button exists
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const filteredRunes = filterRunes();
            renderRunes(filteredRunes);
        });
    }
    
    // Level tabs event listener
    levelTabsContainer.addEventListener('click', function(e) {
        const tab = e.target.closest('.level-tab');
        if (!tab) return;
        document.querySelectorAll('.level-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const filteredRunes = filterRunes();
        renderRunes(filteredRunes);
    });
    
    // Sidebar toggle functionality
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (sidebarToggle && sidebar) {
        // Check if we have a saved state in localStorage
        const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
        
        // Set initial state
        if (isCollapsed) {
            sidebar.classList.add('collapsed');
        }
        
        // Toggle sidebar
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            
            // Save state to localStorage
            const isNowCollapsed = sidebar.classList.contains('collapsed');
            localStorage.setItem('sidebarCollapsed', isNowCollapsed);
        });
    }
    
    // Initial render
    renderRunes(runes);
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});