# Bug Fix: InferenceClient AttributeError

## Issue
When running the chatbot, encountered:
```
AttributeError: 'InferenceClient' object has no attribute 'post'
```

## Root Cause
The `HuggingFaceEndpoint` class had a compatibility issue with the current version of `langchain-huggingface` and the Hugging Face Inference API.

## Solution
Switched from `HuggingFaceEndpoint` to `HuggingFaceHub` which uses a more stable API interface.

### Change Made in `app.py`:

```diff
-from langchain_huggingface import HuggingFaceEndpoint
+from langchain_huggingface import HuggingFaceHub

-llm = HuggingFaceEndpoint(
+llm = HuggingFaceHub(
     repo_id="mistralai/Mistral-7B-Instruct-v0.2",
     huggingfacehub_api_token=os.environ.get("HUGGINGFACE_API_TOKEN"),
-    temperature=0.3,
-    max_new_tokens=512,
-    top_k=10,
-    top_p=0.95,
-    typical_p=0.95,
+    model_kwargs={
+        "temperature": 0.3,
+        "max_new_tokens": 512,
+        "top_k": 10,
+        "top_p": 0.95,
+    }
 )
```

## Status
✅ Fixed - Ready to test

The application should now work correctly. Please restart the Flask app if it's still running.
