# Launch Docs

## Purpose

This guide is for launching the current system with pilot testers without changing the codebase.

## Recommended tester profile

- Windows 10 or Windows 11
- Comfortable running a simple setup guide
- Has permission to install Node.js if needed
- Understands that selected text and surrounding context may be sent to the configured AI provider

## Tester prerequisites

Each tester machine needs:

- Node.js 22+
- Internet access to the configured AI provider
- A configured `backend/.env`
- The project files or a prepared release bundle

## Files the tester needs

- `client/` build output or the repo itself
- `backend/`
- `run.ps1` or equivalent launcher
- `backend/.env`

## Backend setup

Create `backend/.env` from `backend/.env.example`.

Minimum values:

```env
PORT=3000
SKIP_AUTH=true
AI_PROVIDER=openrouter
OPENROUTER_API_KEY=your_real_key_here
OPENROUTER_MODEL=google/gemini-2.5-flash-preview
```

Notes:

- `SKIP_AUTH=true` is acceptable only for a local pilot
- Use one fixed model during the pilot so results are easier to compare
- If OpenRouter is not used, set the matching provider variables instead

## Launch steps for internal testers

### Option A: Run from source

Backend:

```powershell
cd backend
npm install
npm run dev
```

Client:

```powershell
dotnet run --project client\CodeExplainer.csproj
```

### Option B: Run with the existing root script

```powershell
.\run.ps1
```

This is the simplest current launch path for internal testing.

## Pre-launch checks

Before handing this to a tester, verify:

```powershell
cd backend
npm install
npm run check
```

Then confirm:

- Backend starts on port `3000`
- `http://localhost:3000/api/health` returns healthy JSON
- Client launches without crashing
- Tray icon appears
- Hotkey registration succeeds
- One real capture request works
- `runlogs/` is being written

## Suggested tester instructions

Tell testers:

- Start the app
- Go to VS Code, browser, or terminal
- Select text
- Press `Ctrl+Shift+Space`
- Wait for the overlay result
- Repeat in a few different apps
- Report where it worked, where it failed, and any confusing behavior

## What testers should send back

- A short bug description
- What app they were using
- What text they selected
- What they expected
- What happened instead
- Relevant files from `runlogs/`

## Support checklist

If a tester says the app does not work:

1. Check Node is installed with `node -v`
2. Check backend starts without errors
3. Check `backend/.env` exists and has a real key
4. Check port `3000` is free
5. Check the tray icon appears
6. Check hotkey registration succeeded in logs
7. Check `runlogs/client_live.log`

## Known rollout limitations of the current system

- Windows only
- Local backend required
- Manual setup required
- No installer yet
- No auto-update path yet
- No structured feedback collection flow yet
- No deployment packaging workflow yet

## Recommended pilot policy

- Start with internal testers only
- Use one supported provider and one model
- Avoid giving this to non-technical users first
- Keep pilot size small until setup friction is reduced

## What still needs to be prepared before broader launch

- A packaged release bundle
- A one-click launcher for published builds
- A support channel
- A privacy note for testers
- A log collection and triage process
- A versioned release process
