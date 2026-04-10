# Intelligent Context Engine & Code Explainer

This repository contains a Windows-first OS-level assistant that explains highlighted code, browser text, and terminal output inside a floating overlay without forcing the user to switch windows.

The current system keeps the original core architecture intact:
- C# / .NET 8 / WPF desktop client
- Native Windows capture pipeline using UIA, MSAA, clipboard fallback, console APIs, and OCR
- Node.js backend with Hono
- WebSocket streaming for live responses
- Hosted Supabase/Postgres for auth and study logging

## Current Product Status

The project is near pilot deployment.

Completed now:
- native capture pipeline is in place
- overlay streaming flow is in place
- short overlay-focused explanation style is in place
- thumbs up / thumbs down feedback is in place
- one-time redeem-code auth is implemented
- Windows secure token storage is implemented
- authenticated WebSocket flow is implemented
- request/session logging path to hosted DB is implemented
- release packaging scripts are present

Still required before external rollout:
- seed redeem codes in the hosted DB
- replace staging and production placeholder URLs in the client configs
- run one full live auth + explain + DB-log test
- package the final tester build
- run internal pilot validation before external rollout

## High-Level Runtime Flow

1. User launches the Windows client.
2. The client restores the stored session or prompts for a redeem code.
3. The client stores tokens securely on Windows using DPAPI.
4. The user highlights text and presses the hotkey.
5. The capture engine extracts selected text and surrounding context.
6. The client sends the payload to the backend over an authenticated WebSocket.
7. The backend classifies the request and streams the explanation back in real time.
8. The overlay renders the response immediately as tokens arrive.
9. After stream completion, the backend writes one final request log row to the hosted DB.
10. The user can submit a single thumbs up or thumbs down reaction for the visible response.

## Architecture

### Client
- WPF app for tray, auth flow, hotkey, and overlay
- Capture engine for selected text and background context
- Secure token storage with DPAPI
- WebSocket client with retry and reconnect behavior

### Backend
- Hono HTTP + WebSocket server
- `/auth/redeem-code`, `/auth/refresh`, `/auth/logout`
- `/ws/stream` with access-token validation on connection
- Prompt, classification, and model routing services
- Async request logging after stream completion

### Data Layer
Hosted Supabase/Postgres is used for:
- `participants`
- `redeem_codes`
- `refresh_tokens`
- `sessions`
- `request_logs`

Local client logs still exist under `runlogs/` for debugging and support.

## Repository Structure

```text
/client
  /Engine
    /Strategies
    /Classifiers
    /Detectors
    /Managers
    /Models
  App.xaml.cs
  BackendClient.cs
  AuthApiClient.cs
  AuthSessionManager.cs
  SecureTokenStore.cs
  LoginWindow.xaml
  OverlayWindow.xaml

/backend
  /db
    /migrations
    seed_redeem_codes.sql
  /scripts
    check-db-config.js
  /src
    /config
    /db
    /middleware
    /routes
    /services
  index.js
  .env
  .env.example

/docs and root markdown
  README.md
  deplyplan.md
  launch-docs.md
  release-checklist.md
  pilot-user-guide.md
  balancework.md
```

## Current DB Logging Shape

The hosted DB request log is intended to store the full final request record used for case-study analysis.

Current target fields include:
- `participant_id`
- `session_id`
- `request_id`
- `timestamp`
- `environment_type`
- `process_name`
- `usage_context`
- `window_title`
- `selected_text`
- `background_context`
- `selected_method`
- `background_method`
- `is_partial`
- `is_unsupported`
- `task_type`
- `response_text`
- `time_to_first_token_ms`
- `total_response_time_ms`
- `status`

## Performance Notes

The main user-visible path is intentionally preserved.

Important runtime decisions:
- DB writes happen after stream completion
- there are no per-token DB writes
- auth refresh is lightweight and separate from capture work
- capture logic was not redesigned
- forced browser OCR debug behavior was removed

This means the current deployment/auth work should not materially change the core capture speed or first-token experience.

## Local Development

### Backend

```powershell
cd backend
npm install
npm run check
npm run dev
```

### Client

```powershell
dotnet build client\CodeExplainer.csproj -nologo
dotnet run --project client\CodeExplainer.csproj
```

## Deployment Configuration

### Backend required environment values

Minimum deployment-side values:

```env
PORT=3000
AI_PROVIDER=groq
GROQ_API_KEY=your_real_key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ACCESS_TOKEN_SECRET=your_random_secret
SKIP_AUTH=false
```

### Client environment values

The client loads:
- `appsettings.json`
- `appsettings.Staging.json`
- `appsettings.Production.json`

For real staging/production, replace the placeholder backend URLs in those files.

## Important Documents

- `deplyplan.md`: current deployment plan and rollout path
- `launch-docs.md`: launch and environment setup guide
- `release-checklist.md`: release and verification checklist
- `pilot-user-guide.md`: tester-facing usage guide
- `balancework.md`: detailed remaining work

## Recommendation

The next best step is not a redesign. It is final infrastructure hookup and staged validation:
- seed redeem codes
- set real client backend URLs
- run one end-to-end login and explain test
- confirm DB inserts
- package the pilot build
