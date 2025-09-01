// Load rune data from external JSON file
let runes = [];
let currentLevels = {}; // Store current level for each rune

// Local icon paths
const localIcons = {
    red: "./icons/red_slot.png",
    green: "./icons/green_slot.png",
    blue: "./icons/blue_slot.png",
    epic: "./icons/epic_slot.png",
    relic: "./icons/relic_slot.png",
    rare: "./icons/rare_icon.png",
    mythic: "./icons/mythic_icon.png",
    legendary: "./icons/legendary_icon.png"
};

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
                    "localIcon": "./icons/runic_mimic.png"
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
                    "localIcon": "./icons/rift.png"
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
            },
            {
                "name": "Flee",
                "colors": ["B", "G", "G"],
                "description": "1 mp After dodging with loss ([X] max per turn)",
                "rarity": ["Mythic"],
                "effect": "Per additional 2 levels: +1 max per turn",
                "maxLevel": 6,
                "minLevel": 2,
                "step": 2,
                "obtenation": {
                    "name": "Kween's Gawden Dungeon",
                    "localIcon": "./icons/viziew.png"
                },
                "values": [
                    {
                        "base": 1,
                        "increment": 1,
                        "placeholder": "X"
                    }
                ]
            }
        ];
    }
}

// Function to load local image
function loadLocalImage(src, alt, className) {
    const img = new Image();
    img.src = src;
    img.alt = alt;
    if (className) img.className = className;
    return Promise.resolve(img);
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

    // Remove level tabs section
    const levelTabsContainer = document.getElementById('levelTabs');
    if (levelTabsContainer) {
        levelTabsContainer.style.display = 'none';
    }

    // Function to render runes
    async function renderRunes(runesToRender) {
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
        
        for (const rune of runesToRender) {
            const currentLevel = currentLevels[rune.name] || rune.minLevel;
            
            // Generate description with current values - FIXED: Replace all occurrences
            let description = rune.description;
            if (rune.values && rune.values.length > 0) {
                rune.values.forEach(value => {
                    // Calculate how many "steps" have been taken from the minimum level
                    const steps = Math.floor((currentLevel - rune.minLevel) / rune.step);
                    const calculatedValue = value.base + (value.increment * steps);
                    // Use global regex to replace ALL occurrences
                    const regex = new RegExp(`\\[${value.placeholder}\\]`, 'g');
                    description = description.replace(regex, calculatedValue);
                });
            }
            
            // Generate color elements with local icons
            const colorElements = [];
            for (const color of rune.colors) {
                let colorElement;
                if (color === 'R') {
                    colorElement = await loadLocalImage(
                        localIcons.red,
                        "Red Slot",
                        "color-icon"
                    );
                    colorElement = colorElement.outerHTML;
                } else if (color === 'G') {
                    colorElement = await loadLocalImage(
                        localIcons.green,
                        "Green Slot",
                        "color-icon"
                    );
                    colorElement = colorElement.outerHTML;
                } else if (color === 'B') {
                    colorElement = await loadLocalImage(
                        localIcons.blue,
                        "Blue Slot",
                        "color-icon"
                    );
                    colorElement = colorElement.outerHTML;
                } else if (color === 'Epic' || color === 'Relic') {
                    // For Epic and Relic, just show text without icon
                    colorElement = `<div class="special-color ${color.toLowerCase()}">${color}</div>`;
                }
                
                if (colorElement) {
                    colorElements.push(`<div class="rune-color" title="${color === 'R' ? 'Red' : color === 'G' ? 'Green' : color === 'B' ? 'Blue' : color} Slot">${colorElement}</div>`);
                }
            }
            
            // Generate rarity icons with local icons
            const rarityIcons = [];
            for (const rarity of rune.rarity) {
                let rarityElement;
                if (rarity === 'Rare') {
                    rarityElement = await loadLocalImage(
                        localIcons.rare,
                        "Rare",
                        "rarity-icon"
                    );
                    rarityElement = rarityElement.outerHTML;
                } else if (rarity === 'Mythic') {
                    rarityElement = await loadLocalImage(
                        localIcons.mythic,
                        "Mythic",
                        "rarity-icon"
                    );
                    rarityElement = rarityElement.outerHTML;
                } else if (rarity === 'Legendary') {
                    rarityElement = await loadLocalImage(
                        localIcons.legendary,
                        "Legendary",
                        "rarity-icon"
                    );
                    rarityElement = rarityElement.outerHTML;
                } else if (rarity === 'Epic') {
                    rarityElement = await loadLocalImage(
                        localIcons.epic,
                        "Epic",
                        "rarity-icon"
                    );
                    rarityElement = rarityElement.outerHTML;
                } else if (rarity === 'Relic') {
                    rarityElement = await loadLocalImage(
                        localIcons.relic,
                        "Relic",
                        "rarity-icon"
                    );
                    rarityElement = rarityElement.outerHTML;
                }
                
                if (rarityElement) {
                    rarityIcons.push(rarityElement);
                }
            }
            
            // Load obtenation icon with local icon
            let obtenationIcon = '';
            if (rune.obtenation.localIcon) {
                const obtenationElement = await loadLocalImage(
                    rune.obtenation.localIcon,
                    rune.obtenation.name,
                    "obtenation-icon"
                );
                obtenationIcon = obtenationElement.outerHTML;
            }
            
            // Check if this is a Relic or Epic rune (no slider needed)
            const isSpecialRune = rune.colors.includes('Relic') || rune.colors.includes('Epic');
            
            // Check if min equals max for slider positioning
            const isFixedLevel = rune.minLevel === rune.maxLevel;
            
            // Add special class for relic and epic names
            const nameClass = rune.colors.includes('Relic') ? 'relic-name' : 
                             rune.colors.includes('Epic') ? 'epic-name' : '';
            
            const card = document.createElement('div');
            card.className = 'rune-card';
            card.innerHTML = `
                <div class="rune-header">
                    <div class="rune-name-container">
                        <div class="rune-name ${nameClass}">${rune.name}</div>
                        ${!isSpecialRune ? `<div class="rune-level">Lvl. ${currentLevel}</div>` : ''}
                    </div>
                    <div class="rune-colors">
                        ${colorElements.join('')}
                    </div>
                </div>
                
                <div class="divider"></div>
                
                <div class="rune-meta">
                    <div class="obtenation">
                        ${obtenationIcon}
                        <span>${rune.obtenation.name}</span>
                    </div>
                    <div class="rarity">
                        ${rarityIcons.join('')}
                    </div>
                </div>
                
                <div class="rune-description">
                    ${description}
                </div>
                
                ${!isSpecialRune ? `
                <div class="level-controls">
                    <input type="range" 
                           class="level-slider ${isFixedLevel ? 'fixed-level' : ''}" 
                           min="${rune.minLevel}" 
                           max="${rune.maxLevel}" 
                           step="${rune.step}" 
                           value="${currentLevel}"
                           data-rune="${rune.name}">
                    <div class="level-display">${currentLevel}</div>
                </div>
                ` : ''}
            `;
            
            // Add event listener to the slider if it's not a special rune
            if (!isSpecialRune) {
                const slider = card.querySelector('.level-slider');
                const levelDisplay = card.querySelector('.level-display');
                
                slider.addEventListener('input', function() {
                    const level = parseInt(this.value);
                    levelDisplay.textContent = level;
                    currentLevels[rune.name] = level;
                    
                    // Update description with new values - FIXED: Replace all occurrences
                    let updatedDescription = rune.description;
                    if (rune.values && rune.values.length > 0) {
                        rune.values.forEach(value => {
                            // Calculate how many "steps" have been taken from the minimum level
                            const steps = Math.floor((level - rune.minLevel) / rune.step);
                            const calculatedValue = value.base + (value.increment * steps);
                            // Use global regex to replace ALL occurrences
                            const regex = new RegExp(`\\[${value.placeholder}\\]`, 'g');
                            updatedDescription = updatedDescription.replace(regex, calculatedValue);
                        });
                    }
                    
                    card.querySelector('.rune-description').textContent = updatedDescription;
                    card.querySelector('.rune-level').textContent = `Lvl. ${level}`;
                });
            }
            
            container.appendChild(card);
        }
    }
    
    // Function to filter runes based on criteria
    function filterRunes() {
        const searchInput = document.getElementById('searchInput');
        const activeCategoryTab = document.querySelector('.category-tab.active');
        
        if (!searchInput || !activeCategoryTab) {
            return runes;
        }
        
        const searchTerm = searchInput.value.toLowerCase();
        const activeCategory = activeCategoryTab.getAttribute('data-category');
        
        return runes.filter(rune => {
            // Search filter
            if (searchTerm && !rune.name.toLowerCase().includes(searchTerm) && 
                !rune.description.toLowerCase().includes(searchTerm) && 
                !rune.obtenation.name.toLowerCase().includes(searchTerm)) {
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