# Ollama Setup Guide

## What is Ollama?

Ollama is a local LLM runtime that lets you run powerful models like Mistral, Llama, and others **directly on your machine** without any API keys, rate limits, or internet dependency.

## Benefits

✅ **No API Keys** - Runs completely locally  
✅ **No Rate Limits** - Use as much as you want  
✅ **No Internet Required** - Works offline  
✅ **Fast** - Direct hardware access  
✅ **Private** - Your data never leaves your machine  
✅ **Stable** - No API compatibility issues  

---

## Installation

### Windows

1. **Download Ollama**:
   - Visit: https://ollama.com/download
   - Download the Windows installer
   - Run the installer

2. **Verify Installation**:
   ```bash
   ollama --version
   ```

### Alternative: Using PowerShell
```powershell
winget install Ollama.Ollama
```

---

## Setup for Medical Chatbot

### 1. Pull the Mistral Model

Open a terminal and run:
```bash
ollama pull mistral
```

This downloads the Mistral-7B model (~4GB). It may take a few minutes.

### 2. Verify Model is Ready

```bash
ollama list
```

You should see `mistral` in the list.

### 3. Test the Model (Optional)

```bash
ollama run mistral "What is diabetes?"
```

Press `Ctrl+D` or type `/bye` to exit.

---

## Running Your Medical Chatbot

### 1. Make Sure Ollama is Running

Ollama runs as a background service. If it's not running:
```bash
ollama serve
```

### 2. Start Your Flask App

```bash
python app.py
```

### 3. Open Browser

Navigate to: http://localhost:5000

---

## Troubleshooting

### "Connection refused" error
**Problem**: Ollama service is not running

**Solution**:
```bash
ollama serve
```

### Model not found
**Problem**: Mistral model not downloaded

**Solution**:
```bash
ollama pull mistral
```

### Slow responses
**Problem**: Model is large for your hardware

**Solutions**:
1. Use a smaller model:
   ```bash
   ollama pull mistral:7b-instruct-q4_0  # Quantized version
   ```
   
2. Or switch to a lighter model in `app.py`:
   ```python
   llm = Ollama(model="phi", temperature=0.3)  # Smaller, faster
   ```

---

## Alternative Models

You can easily switch models by changing the `model` parameter in `app.py`:

### Recommended for Medical Use:
```python
# Current (Good balance)
llm = Ollama(model="mistral", temperature=0.3)

# More powerful (requires more RAM)
llm = Ollama(model="llama2:13b", temperature=0.3)

# Faster, lighter (less accurate)
llm = Ollama(model="phi", temperature=0.3)

# Latest Mistral variant
llm = Ollama(model="mistral:latest", temperature=0.3)
```

### To use a different model:
1. Pull it first: `ollama pull <model-name>`
2. Update `app.py` with the new model name
3. Restart your Flask app

---

## System Requirements

**Minimum**:
- 8GB RAM
- 10GB free disk space

**Recommended**:
- 16GB RAM
- 20GB free disk space
- GPU (optional, but faster)

---

## Why Ollama is Better for This Project

| Feature | Ollama | HuggingFace API | Gemini |
|---------|--------|-----------------|--------|
| **API Keys** | ❌ None | ✅ Required | ✅ Required |
| **Rate Limits** | ❌ None | ✅ Yes | ✅ Yes |
| **Internet** | ❌ Not needed | ✅ Required | ✅ Required |
| **Cost** | 💰 Free | 💰 Free tier limited | 💰 Free tier limited |
| **Privacy** | 🔒 100% local | ⚠️ Data sent to HF | ⚠️ Data sent to Google |
| **Stability** | ✅ Very stable | ⚠️ API changes | ⚠️ API changes |
| **Speed** | ⚡ Fast (local) | 🐌 Network dependent | 🐌 Network dependent |

---

## Next Steps

1. ✅ Install Ollama
2. ✅ Pull Mistral model
3. ✅ Run `python app.py`
4. ✅ Test your medical chatbot!

Your chatbot is now running completely locally with no external dependencies! 🎉
