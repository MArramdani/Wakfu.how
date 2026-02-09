import requests
import json
import os

# Configuration
CONFIG_URL = "https://wakfu.cdn.ankama.com/gamedata/config.json"
BASE_URL = "https://wakfu.cdn.ankama.com/gamedata"
OUTPUT_FILE = "data/items.json"

def update_data():
    try:
        print(f"--- Fetching version info from {CONFIG_URL} ---")
        config_response = requests.get(CONFIG_URL)
        config_response.raise_for_status()
        
        # Get the version string (e.g., "1.90.1.48")
        version = config_response.json().get("version")
        
        if not version:
            print("Error: Could not find version in config.json")
            return

        print(f"Current Version identified: {version}")

        # Construct the items URL
        items_url = f"{BASE_URL}/{version}/items.json"
        print(f"Downloading items from: {items_url}")

        items_response = requests.get(items_url)
        items_response.raise_for_status()

        # Save the file locally
        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
            json.dump(items_response.json(), f, indent=4)

        print(f"Successfully saved to {OUTPUT_FILE}!")

    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    update_data()