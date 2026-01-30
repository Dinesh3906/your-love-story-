import requests
import json
import time

url = "http://localhost:3001/generate"
data = {
    "summary_of_previous": "Protagonist enters a crowded ballroom looking for their lost love.",
    "chosen_option": None
}

print("Sending request... (Model loading might take time)")
start = time.time()
try:
    response = requests.post(url, json=data, timeout=300)
    print(f"Time: {time.time() - start:.2f}s")
    print(f"Status Code: {response.status_code}")
    try:
        print("JSON Response:", json.dumps(response.json(), indent=2))
    except:
        print("Raw Response:", response.text)
except Exception as e:
    print(f"Error: {e}")
