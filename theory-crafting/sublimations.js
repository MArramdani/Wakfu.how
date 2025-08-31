// Load rune data from external JSON file
let runes = [];
let currentLevels = {}; // Store current level for each rune

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
                "description": "[X]% Critical Hit",
                "rarity": ["Rare", "Mythic", "Legendary"],
                "effect": "Per additional level: +3% Critical hit",
                "maxLevel": 6,
                "minLevel": 1,
                "step": 1,
                "obtenation": {
                    "name": "Runic Mimic",
                    "icon": "https://static.ankama.com/wakfu/portal/game/monster/200/190004327.w133h.png"
                },
                "levelRange": "1-20",
                "category": "Crit %",
                "values": [
                    {
                        "base": 3,
                        "increment": 3,
                        "placeholder": "X"
                    }
                ]
            },
            {
                "name": "Raw Power",
                "colors": ["G", "G", "G"],
                "description": "At start of Fight -[X] max WP. For each WP spent during turn: [Y]% damage inflicted",
                "rarity": ["Rare", "Mythic", "Legendary"],
                "effect": "Per additional level: -1 max WP +2% DMG",
                "maxLevel": 4,
                "minLevel": 1,
                "step": 1,
                "obtenation": {
                    "name": "Rift",
                    "icon": "https://static.ankama.com/wakfu/portal/game/monster/200/190004327.w133h.png"
                },
                "levelRange": "201-215",
                "category": "Damage %",
                "values": [
                    {
                        "base": 1,
                        "increment": 1,
                        "placeholder": "X"
                    },
                    {
                        "base": 2,
                        "increment": 2,
                        "placeholder": "Y"
                    }
                ]
            }
        ];
    }
}

// Initialize the application
async function initApp() {
    try {
        runes = await loadRuneData();
        
        // Initialize current levels for each rune
        runes.forEach(rune => {
            currentLevels[rune.name] = rune.minLevel;
        });
        
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

    // Extract unique categories
    const categories = [...new Set(runes.map(rune => rune.category))].sort();

    // Generate category tabs
    const categoryFilterContainer = document.getElementById('categoryFilter');
    if (categoryFilterContainer) {
        categoryFilterContainer.innerHTML = '<div class="category-tab active" data-category="all">All Categories</div>';
        
        categories.forEach(category => {
            const tab = document.createElement('div');
            tab.className = 'category-tab';
            tab.textContent = category;
            tab.setAttribute('data-category', category);
            categoryFilterContainer.appendChild(tab);
        });
    }

    // Generate level tabs
    const levelTabsContainer = document.getElementById('levelTabs');
    if (levelTabsContainer) {
        levelTabsContainer.innerHTML = '<div class="level-tab active" data-level="all">All Levels</div>';
        
        levelRanges.forEach(range => {
            const tab = document.createElement('div');
            tab.className = 'level-tab';
            tab.textContent = `Level ${range}`;
            tab.setAttribute('data-level', range);
            levelTabsContainer.appendChild(tab);
        });
    }

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
        
        runesToRender.forEach(rune => {
            const currentLevel = currentLevels[rune.name] || rune.minLevel;
            
            // Generate description with current values
            let description = rune.description;
            if (rune.values) {
                rune.values.forEach(value => {
                    const calculatedValue = value.base + (value.increment * (currentLevel - rune.minLevel));
                    description = description.replace(`[${value.placeholder}]`, calculatedValue);
                });
            }
            
            // Generate color elements
            const colorElements = rune.colors.map(color => {
                if (color === 'R') {
                    return `<div class="rune-color color-red" title="Red Slot">
                        <img src="https://methodwakfu.com/wp-content/uploads/2020/04/chasse_rouge_xs.png" class="color-icon" alt="Red">
                    </div>`;
                } else if (color === 'G') {
                    return `<div class="rune-color color-green" title="Green Slot">
                        <img src="https://methodwakfu.com/wp-content/uploads/2020/04/chasse_verte_xs.png" class="color-icon" alt="Green">
                    </div>`;
                } else if (color === 'B') {
                    return `<div class="rune-color color-blue" title="Blue Slot">
                        <img src="https://methodwakfu.com/wp-content/uploads/2020/04/chasse_bleue_xs.png" class="color-icon" alt="Blue">
                    </div>`;
                } else if (color === 'Epic') {
                    return `<div class="rune-color color-epic" title="Epic">Epic</div>`;
                } else if (color === 'Relic') {
                    return `<div class="rune-color color-relic" title="Relic">Relic</div>`;
                }
                return '';
            }).join('');
            
            // Generate rarity icons
            const rarityIcons = rune.rarity.map(rarity => {
                if (rarity === 'Rare') {
                    return `<img src="https://static.ankama.com/wakfu/portal/game/item/115/81228822.png" class="rarity-icon" alt="Rare" title="Rare">`;
                } else if (rarity === 'Mythic') {
                    return `<img src="https://static.ankama.com/wakfu/portal/game/item/115/81228823.png" class="rarity-icon" alt="Mythic" title="Mythic">`;
                } else if (rarity === 'Legendary') {
                    return `<img src="https://static.ankama.com/wakfu/portal/game/item/115/81227111.png" class="rarity-icon" alt="Legendary" title="Legendary">`;
                }
                return '';
            }).join('');
            
            const card = document.createElement('div');
            card.className = 'rune-card';
            card.innerHTML = `
                <div class="rune-header">
                    <div class="rune-name-container">
                        <div class="rune-name">${rune.name}</div>
                        <div class="rune-level">Lvl. ${currentLevel}</div>
                    </div>
                    <div class="rune-colors">
                        ${colorElements}
                    </div>
                </div>
                
                <div class="divider"></div>
                
                <div class="rune-meta">
                    <div class="obtenation">
                        ${rune.obtenation.icon ? `<img src="${rune.obtenation.icon}" class="obtenation-icon" alt="${rune.obtenation.name}">` : ''}
                        <span>${rune.obtenation.name}</span>
                    </div>
                    <div class="rarity">
                        ${rarityIcons}
                    </div>
                </div>
                
                <div class="divider"></div>
                
                <div class="rune-description">
                    ${description}
                </div>
                
                <div class="divider"></div>
                
                <div class="level-controls">
                    <input type="range" 
                           class="level-slider" 
                           min="${rune.minLevel}" 
                           max="${rune.maxLevel}" 
                           step="${rune.step}" 
                           value="${currentLevel}"
                           data-rune="${rune.name}">
                    <div class="level-display">${currentLevel}</div>
                </div>
            `;
            
            // Add event listener to the slider
            const slider = card.querySelector('.level-slider');
            const levelDisplay = card.querySelector('.level-display');
            
            slider.addEventListener('input', function() {
                const level = parseInt(this.value);
                levelDisplay.textContent = level;
                currentLevels[rune.name] = level;
                
                // Update description with new values
                let updatedDescription = rune.description;
                if (rune.values) {
                    rune.values.forEach(value => {
                        const calculatedValue = value.base + (value.increment * (level - rune.minLevel));
                        updatedDescription = updatedDescription.replace(`[${value.placeholder}]`, calculatedValue);
                    });
                }
                
                card.querySelector('.rune-description').textContent = updatedDescription;
                card.querySelector('.rune-level').textContent = `Lvl. ${level}`;
            });
            
            container.appendChild(card);
        });
    }
    
    // Function to filter runes based on criteria
    function filterRunes() {
        const searchInput = document.getElementById('searchInput');
        const activeLevelTab = document.querySelector('.level-tab.active');
        const activeCategoryTab = document.querySelector('.category-tab.active');
        
        if (!searchInput || !activeLevelTab || !activeCategoryTab) {
            return runes;
        }
        
        const searchTerm = searchInput.value.toLowerCase();
        const activeLevel = activeLevelTab.getAttribute('data-level');
        const activeCategory = activeCategoryTab.getAttribute('data-category');
        
        return runes.filter(rune => {
            // Search filter
            if (searchTerm && !rune.name.toLowerCase().includes(searchTerm) && 
                !rune.description.toLowerCase().includes(searchTerm) && 
                !rune.obtenation.name.toLowerCase().includes(searchTerm)) {
                return false;
            }
            
            // Level filter
            if (activeLevel !== 'all' && rune.levelRange !== activeLevel) {
                return false;
            }
            
            // Category filter
            if (activeCategory !== 'all' && rune.category !== activeCategory) {
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
    const levelTabsContainerListener = document.getElementById('levelTabs');
    if (levelTabsContainerListener) {
        levelTabsContainerListener.addEventListener('click', function(e) {
            const tab = e.target.closest('.level-tab');
            if (!tab) return;
            document.querySelectorAll('.level-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const filteredRunes = filterRunes();
            renderRunes(filteredRunes);
        });
    }
    
    // Category tabs event listener
    const categoryFilterContainerListener = document.getElementById('categoryFilter');
    if (categoryFilterContainerListener) {
        categoryFilterContainerListener.addEventListener('click', function(e) {
            const tab = e.target.closest('.category-tab');
            if (!tab) return;
            document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const filteredRunes = filterRunes();
            renderRunes(filteredRunes);
        });
    }
    
    // Initial render
    renderRunes(runes);
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});