// Dungeons data organized by bracket
const dungeonsByBracket = {
    20: [
        "Grandmeow's House",
        "Gobball Pastures",
        "The Tofuhouse",
        "Larventura"
    ],
    35: [
        "Treechnee Dungeon",
        "The Raised Vault",
        "Hoola Hoopiwi"
    ],
    50: [
        "The Royal Pasturizer",
        "The Hill Hazize",
        "Sureberry Fields",
        "Mineral tower 50",
        "Octopus Crew Dungeon",
        "Deathburn Dungeon"
    ],
    65: [
        "The Forgotten Lair",
        "Bwork Dungeon",
        "Dry Selachii",
        "Mollusky Dungeon",
        "Miss Ugly Tower",
        "Kokokobana",
        "Cwab's Castle",
        "Bitter-Hammer Dungeon"
    ],
    80: [
        "The Ratatombs",
        "Temple of the Grand Orrok",
        "Cro-Cave",
        "Abandoned Strichery",
        "Boarthroom Estate",
        "Tsu's Palace",
        "Lunar Altar / Boowolf Dungeon",
        "Arachnee Dungeon",
        "Excarnus's Lair"
    ],
    95: [
        "The Undieworld",
        "Miseryeum",
        "Wagnar's Castle",
        "Trool Academy",
        "Mussly Hammam",
        "Schnekymosis Cavern",
        "Abandoned Scarapit",
        "Morbax Neplopolis",
        "Moowolf's Lair"
    ],
    110: [
        "Supervillains' Lair",
        "Dancehall Arena",
        "The Horned Glacier",
        "The Yech'Ti'Wawa's Kennel",
        "Jelly Dungeon",
        "Magik Riktus Den",
        "Hushquarters",
        "The Black Crow's Lair",
        "The Gobbalrog's Lair"
    ],
    125: [
        "Hagen Daz's Pot",
        "Ambassador's Wing",
        "The Frozen Tower",
        "Castuc Dungeon",
        "Tormentor Pit",
        "The Whirlway Station",
        "Puddly Dungeon",
        "The Snaptrap",
        "Dragon Pig's Den"
    ],
    140: [
        "Flaxhid's Sanctuary",
        "Blackspore Dungeon",
        "Dirty Trouffe Estate",
        "Treechnid Dungeon",
        "Great Zomkin's Compost",
        "Lenald Palace",
        "Kween's Gawden"
    ],
    155: [
        "The Villany Vineyards",
        "Srambad Dungeon",
        "Enurado Dungeon",
        "Blopera",
        "Wellspring of Evil",
        "Sandyoptera Mother-Hive",
        "Wa Wabbit's Castle",
        "Womewo's Labowatowy",
        "Pyramid of Tal Kasha"
    ],
    170: [
        "Mecha Factory",
        "Ow El Dungeon",
        "Kali's Lair",
        "Elite Riktus Dungeon",
        "Bistrogue",
        "The Zeppelantern",
        "The Stalagmotel",
        "High Wind Plateau"
    ],
    185: [
        "Crocodyl Dungeon",
        "Kannivore Dungeon",
        "Kanniball Dungeon",
        "Tropickle Dungeon",
        "Forbidden City",
        "Gerbean Dungeon",
        "Top of Giant Totem"
    ],
    200: [
        "Badgeroxes' Lair",
        "Or'Hodruin Volcano",
        "Dreggons' Sanctuary",
        "Iced-Over Crest",
        "Mineral tower 200",
        "Pandala Tomb",
        "Blightopard Cannon",
        "Bubourg Factory",
        "Nogord Wungleezared's Lair",
        "Mount Zinit Peak Ogrest",
        "Shadofang Item Dimension"
    ],
    215: [
        "Mineral tower 215",
        "Tundrazor Dungeon",
        "Crabstacean Dungeon",
        "Sunsloth Dungeon",
        "Vandalophrenic Dungeon",
        "Plantiguard Dungeon",
        "Pingwin Dungeon",
        "Scramshell Dungeon"
    ],
    230: [
        "Phytomorph Dungeon",
        "Voidivion Dungeon",
        "Horridemon Dungeon",
        "Streye Dungeon",
        "Destroyer Dungeon",
        "Necroworld",
        "Foggernaut Dungeon",
        "Abyssal Creeper Dungeon",
        "Rushu's Palace"
    ]
};

// Function to generate the HTML for the dungeons page
function generateDungeonsPage() {
    const bracketsContainer = document.getElementById('bracketsContainer');
    
    // Sort brackets in ascending order
    const brackets = Object.keys(dungeonsByBracket).sort((a, b) => parseInt(a) - parseInt(b));
    
    brackets.forEach(bracket => {
        const bracketElement = document.createElement('div');
        bracketElement.className = 'bracket';
        
        // Create bracket header
        const bracketHeader = document.createElement('div');
        bracketHeader.className = 'bracket-header';
        bracketHeader.innerHTML = `
            <span class="bracket-title">Level ${bracket} Dungeons</span>
            <span class="bracket-count">${dungeonsByBracket[bracket].length} dungeons</span>
        `;
        
        // Create bracket content
        const bracketContent = document.createElement('div');
        bracketContent.className = 'bracket-content';
        
        // Create image placeholder
        const bracketImage = document.createElement('div');
        bracketImage.className = 'bracket-image';
        bracketImage.innerHTML = `
            <div class="bracket-image-placeholder">
                Level ${bracket}<br>Dungeons
            </div>
        `;
        
        // Create dungeons list
        const dungeonsList = document.createElement('div');
        dungeonsList.className = 'dungeons-list';
        
        // Add each dungeon to the list
        dungeonsByBracket[bracket].forEach(dungeon => {
            const dungeonItem = document.createElement('div');
            dungeonItem.className = 'dungeon-item';
            dungeonItem.setAttribute('data-name', dungeon.toLowerCase());
            dungeonItem.innerHTML = `
                <div class="dungeon-name">${dungeon}</div>
                <div class="dungeon-level">Level ${bracket}</div>
            `;
            
            // Add click event to navigate to dungeon page
            dungeonItem.addEventListener('click', () => {
                // In a real implementation, this would navigate to the dungeon's page
                alert(`Navigating to ${dungeon} page (to be implemented)`);
                // window.location.href = `/dungeons/${dungeon.toLowerCase().replace(/\s+/g, '-')}`;
            });
            
            dungeonsList.appendChild(dungeonItem);
        });
        
        // Assemble the bracket
        bracketContent.appendChild(bracketImage);
        bracketContent.appendChild(dungeonsList);
        
        bracketElement.appendChild(bracketHeader);
        bracketElement.appendChild(bracketContent);
        
        bracketsContainer.appendChild(bracketElement);
    });
}

// Function to filter dungeons based on search input
function setupSearch() {
    const searchInput = document.getElementById('dungeonSearch');
    
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const allDungeonItems = document.querySelectorAll('.dungeon-item');
        const allBrackets = document.querySelectorAll('.bracket');
        
        // If search is empty, show everything
        if (!searchTerm) {
            allDungeonItems.forEach(item => {
                item.style.display = 'block';
            });
            allBrackets.forEach(bracket => {
                bracket.style.display = 'block';
            });
            return;
        }
        
        // Track which brackets have visible items
        const visibleBrackets = new Set();
        
        // Filter items based on search
        allDungeonItems.forEach(item => {
            const dungeonName = item.getAttribute('data-name');
            if (dungeonName.includes(searchTerm)) {
                item.style.display = 'block';
                // Find the parent bracket and mark it as having visible items
                const bracket = item.closest('.bracket');
                if (bracket) {
                    visibleBrackets.add(bracket);
                }
            } else {
                item.style.display = 'none';
            }
        });
        
        // Show/hide brackets based on whether they have visible items
        allBrackets.forEach(bracket => {
            if (visibleBrackets.has(bracket)) {
                bracket.style.display = 'block';
            } else {
                bracket.style.display = 'none';
            }
        });
    });
}

// Sidebar toggle functionality
function setupSidebarToggle() {
    const sidebar = document.querySelector('.sidebar');
    const toggleButton = document.querySelector('.sidebar-toggle');
    
    // Check if we have a saved state in localStorage
    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    
    // Set initial state
    if (isCollapsed) {
        sidebar.classList.add('collapsed');
    }
    
    // Toggle sidebar
    if (toggleButton) {
        toggleButton.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            
            // Save state to localStorage
            const isNowCollapsed = sidebar.classList.contains('collapsed');
            localStorage.setItem('sidebarCollapsed', isNowCollapsed);
        });
    }
}

// Initialize the page when it loads
document.addEventListener('DOMContentLoaded', () => {
    generateDungeonsPage();
    setupSearch();
    setupSidebarToggle();
});