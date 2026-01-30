import requests
import json

url = "http://localhost:3001/generate"
data = {
    "prompt": "Start a romantic story",
    "history": [],
    "max_new_tokens": 512
}

try:
    response = requests.post(url, json=data, timeout=30)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
