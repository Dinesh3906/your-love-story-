import os
import requests
import re

def test_groq_key(key):
    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json"
    }
    data = {
        "messages": [{"role": "user", "content": "test"}],
        "model": "llama-3.1-8b-instant",
        "max_tokens": 1
    }
    try:
        response = requests.post(url, headers=headers, json=data, timeout=15)
        if response.status_code == 200:
            return True, "OK"
        else:
            return False, f"Status {response.status_code}: {response.text[:200]}"
    except Exception as e:
        return False, str(e)

def main():
    if not os.path.exists(".dev.vars"):
        print("Error: .dev.vars not found.")
        return

    with open(".dev.vars", "r") as f:
        content = f.read()
    
    groq_keys = re.findall(r'(GROQ_API_KEY_\d+)\s*=\s*"([^"]+)"', content)
    
    print("=== Testing Groq Keys ===")
    for name, key in groq_keys:
        print(f"Testing {name} ({key[:10]}...{key[-4:]})...", end="", flush=True)
        success, message = test_groq_key(key)
        if success:
            print(" [PASS]")
        else:
            print(f" [FAIL] {message}")

if __name__ == "__main__":
    main()
