# Groq AI Setup Instructions

## Changes Made

Your chatbot has been successfully migrated from Together AI to Groq Cloud! 🎉

## What Changed

1. **API Configuration**: Updated `Chatbot2.tsx` to use Groq's API instead of Together AI
2. **Environment Variables**: Created `.env` file for secure API key storage
3. **Model**: Changed from `meta-llama/Llama-3.3-70B-Instruct-Turbo-Free` to `llama-3.1-70b-versatile`

## Getting Your Groq API Key

Follow these steps to get your free Groq API key:

1. **Visit Groq Console**: Go to [https://console.groq.com](https://console.groq.com)
2. **Sign Up/Login**: Create a new account or login with your existing account
3. **Navigate to API Keys**: Click on "API Keys" in the left sidebar
4. **Create New Key**: Click "Create API Key" button
5. **Copy Your Key**: Copy the generated API key (it will only be shown once!)
6. **Add to .env**: Open the `.env` file in your project and replace `your_groq_api_key_here` with your actual key

## Configuration Files

### `.env` (Your local configuration - NOT committed to git)
```env
VITE_GROQ_API_KEY=your_actual_api_key_here
VITE_GROQ_API_URL=https://api.groq.com/openai/v1/chat/completions
VITE_GROQ_MODEL=llama-3.1-70b-versatile
```

### Available Groq Models

You can change the model in your `.env` file to any of these:

- `llama-3.1-70b-versatile` (recommended - balanced performance)
- `llama-3.1-8b-instant` (faster, less capable)
- `mixtral-8x7b-32768` (good for longer contexts)
- `gemma-7b-it` (efficient for simple tasks)

## Testing Your Setup

1. **Add your API key** to the `.env` file
2. **Restart your dev server** (if it's running)
3. **Open your portfolio** in the browser
4. **Click the chatbot** icon
5. **Send a test message** and see the AI response!

## Deploying to GitHub Pages

When deploying to GitHub Pages, you need to add your environment variables:

### If using GitHub Actions:
1. Go to your repository on GitHub
2. Click "Settings" → "Secrets and variables" → "Actions"
3. Click "New repository secret"
4. Add these secrets:
   - Name: `VITE_GROQ_API_KEY`, Value: your Groq API key
   - Name: `VITE_GROQ_API_URL`, Value: `https://api.groq.com/openai/v1/chat/completions`
   - Name: `VITE_GROQ_MODEL`, Value: `llama-3.1-70b-versatile`

### If using Vercel/Netlify:
1. Go to your project settings
2. Navigate to Environment Variables
3. Add the same variables as above

## Troubleshooting

### Chatbot returns fallback responses
- Check if your API key is correctly set in `.env`
- Make sure you've restarted your dev server after adding the key
- Open browser console (F12) and check for API errors

### API Rate Limits
- Groq has generous free tier limits
- If you hit limits, consider upgrading or implementing rate limiting

### CORS Errors
- Groq's API should work from browser directly
- If you face CORS issues, you may need to proxy requests through your backend

## Reverting to Together AI

If you need to revert back to Together AI, the original configuration was:
```javascript
const TOGETHER_API_URL = "https://api.together.xyz/v1/chat/completions";
const TOGETHER_API_KEY = "b6a97e32ffa80cecc2e327db9e60c9662763f0fc1a5b4933c737e417bd67228e";
const TOGETHER_MODEL = "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free";
```

## Benefits of Groq

✅ **Faster Inference**: Groq's LPU (Language Processing Unit) provides extremely fast responses
✅ **Free Tier**: Generous free tier for development and testing
✅ **OpenAI Compatible**: Uses the same API format as OpenAI
✅ **Multiple Models**: Choose from various open-source models
✅ **Great Documentation**: Well-documented API and examples

## Next Steps

1. Get your Groq API key from the console
2. Update your `.env` file with the real API key
3. Restart your dev server: `npm run dev`
4. Test the chatbot functionality
5. Deploy to your hosting platform with environment variables configured

Enjoy your lightning-fast AI chatbot powered by Groq! ⚡🤖
