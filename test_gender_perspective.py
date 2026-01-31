import requests
import json

url = "http://localhost:3001/generate"

def test_gender(gender):
    print(f"\n--- Testing Perspective: {gender.upper()} ---")
    payload = {
        "summary_of_previous": "A protagonist wakes up in a cherry blossom garden and finds a mysterious letter.",
        "user_gender": gender
    }
    
    try:
        response = requests.post(url, json=payload, timeout=60)
        if response.status_code == 200:
            data = response.json()
            print("Story Segment:")
            print(data.get("story", "No story found"))
            
            # Check for pronouns (heuristic check)
            story = data.get("story", "").lower()
            if gender == "female":
                if "she" in story or "her" in story:
                    print("✅ Found female pronouns/perspective.")
                else:
                    print("⚠️ Might not have used specific pronouns, check manually.")
            else:
                if "he" in story or "his" in story:
                    print("✅ Found male pronouns/perspective.")
                else:
                    print("⚠️ Might not have used specific pronouns, check manually.")
        else:
            print(f"❌ Failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_gender("female")
    test_gender("male")
