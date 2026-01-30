from huggingface_hub import snapshot_download
import os

print("Starting download with standard downloader (stable)...")
# os.environ["HF_HUB_ENABLE_HF_TRANSFER"] = "1"
snapshot_download(
    repo_id="Qwen/Qwen2.5-3B-Instruct", 
    cache_dir="D:\\your love story\\hf_cache",
    resume_download=True
)
print("Download complete!")
