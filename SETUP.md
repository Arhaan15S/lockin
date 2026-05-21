# LockIn — Setup Guide

This guide assumes you have never used a terminal before. Follow every step exactly.

---

## STEP 1 — Install Node.js

Node.js is the engine that runs the app.

1. Go to https://nodejs.org
2. Click the big green button that says **"LTS"** (not "Current")
3. Download and install it like any normal app
4. When it's done, move to Step 2

---

## STEP 2 — Open a Terminal

**On Mac:**
- Press `Cmd + Space`, type `Terminal`, hit Enter

**On Windows:**
- Press the Windows key, type `cmd`, hit Enter

---

## STEP 3 — Navigate to the Project Folder

In your terminal, type this and hit Enter:

```
cd Desktop
```

Then drag the `lockin` folder into the terminal window and hit Enter.

Or navigate manually:
```
cd lockin
```

You should see the folder name in your terminal prompt.

---

## STEP 4 — Install Dependencies

Type this exactly and hit Enter:

```
npm install
```

Wait for it to finish. It will download everything the app needs. This takes 1–2 minutes.

---

## STEP 5 — Add Your Anthropic API Key

1. Go to https://console.anthropic.com
2. Sign in or create a free account
3. Go to **API Keys** and click **Create Key**
4. Copy the key (it starts with `sk-ant-...`)

Now create a file called `.env.local` in the `lockin` folder.

**On Mac:**
```
touch .env.local
open -e .env.local
```

**On Windows:**
```
notepad .env.local
```

Paste this inside the file (replace with your actual key):

```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

Save the file and close it.

---

## STEP 6 — Run the App Locally

In your terminal, type:

```
npm run dev
```

Wait a few seconds. Then open your browser and go to:

```
http://localhost:3000
```

You should see the LockIn app. Paste some notes and test it.

---

## STEP 7 — Deploy to Vercel (Put it on the Internet)

1. Go to https://vercel.com and create a free account
2. Install the Vercel CLI:
```
npm install -g vercel
```
3. In your terminal (inside the lockin folder), type:
```
vercel
```
4. Follow the prompts — say yes to everything
5. When it asks about environment variables, add:
   - Name: `ANTHROPIC_API_KEY`
   - Value: your API key from Step 5

6. When it's done it will give you a URL like `lockin-abc123.vercel.app`

That's your live app. Share it with anyone.

---

## TROUBLESHOOTING

**"npm: command not found"** → You didn't install Node.js. Go back to Step 1.

**"Cannot find module"** → You forgot to run `npm install`. Go back to Step 4.

**AI returns an error** → Your API key is wrong or missing. Check Step 5.

**Port already in use** → Another app is using port 3000. Try: `npm run dev -- -p 3001` and go to `http://localhost:3001`

---

Built for the night before.
