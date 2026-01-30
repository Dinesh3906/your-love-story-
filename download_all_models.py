from huggingface_hub import snapshot_download
import os

CACHE_DIR = "D:\\your love story\\hf_cache"

print("--- Starting Download Process ---")
print(f"Target Cache Directory: {CACHE_DIR}")

# 1. Download Qwen 2.5-7B-Instruct
# Qwen 7B removed as per request
print("Skipping Qwen 7B...")

print("\n[2/2] Downloading Qwen/Qwen2.5-3B-Instruct...")
try:
    snapshot_download(
        repo_id="Qwen/Qwen2.5-3B-Instruct",
        cache_dir=CACHE_DIR,
        resume_download=True
    )
    print("✓ Qwen 3B Download Complete")
except Exception as e:
    print(f"✗ Qwen Download Failed: {e}")

print("\n--- All Downloads Finished ---")
