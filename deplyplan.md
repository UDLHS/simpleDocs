# Deployment Plan

## Goal

Deploy the current system to a small group of real Windows users without changing the existing application flow.

The safest first release is a **local pilot deployment**:

- The WPF client runs on the tester's Windows machine.
- The Node backend also runs locally on the tester's machine.
- The backend continues to call the LLM provider directly using the tester or team API key.
- No hosted backend changes are required for the first pilot.

This keeps the current architecture intact and avoids introducing new network, auth, latency, and hosting variables while we validate the product with real usage.

## Recommended rollout stages

### Stage 1: Internal pilot

- 3 to 5 trusted Windows testers
- Manual install
- Local backend only
- Shared support channel for issues
- Collect logs manually from `runlogs/`

### Stage 2: Small external pilot

- 10 to 20 testers
- Same local architecture
- Add installer/package workflow
- Add onboarding checklist and support instructions
- Define log collection and issue reporting process

### Stage 3: Production hardening

- Decide whether backend stays local or becomes hosted
- Add auth strategy
- Add packaging and auto-update strategy
- Add privacy policy and user consent flow
- Add operational monitoring and release process

## What can be deployed right now

The current repo can already be piloted manually if each tester has:

- Windows 10/11
- Node.js installed
- `.NET` runtime support via published client build
- `backend/.env` configured with a valid API key

Current launch path:

1. Install backend dependencies with `npm install` in `backend/`
2. Start backend with `npm run dev` or `node index.js`
3. Start client with `dotnet run --project client/CodeExplainer.csproj` or a published build

This is enough for an internal pilot, but it is not yet a polished tester package.

## Things we need to change before real-user deployment

These are the main gaps. I am listing them only in docs here and not changing code.

### 1. Packaging

- Create a repeatable release bundle for the client
- Decide whether Node is bundled or required separately
- Provide a one-click launcher for testers
- Remove dependency on `dotnet run` for pilot users

### 2. Environment setup

- Prepare a clean `backend/.env` template for testers
- Decide whether all testers use one shared API key or per-user keys
- Lock the provider and model for pilot consistency
- Verify `PORT=3000` is acceptable on tester machines

### 3. Logs and support

- Decide which log files testers should send back
- Define how users report issues
- Add a short troubleshooting checklist
- Decide log retention and cleanup expectations

### 4. Privacy and consent

- Explain clearly that the app captures selected text and surrounding context
- Define which data can be sent to the LLM provider
- Confirm whether browser and terminal capture are allowed for pilot testers
- Add tester consent language before external rollout

### 5. Stability hardening

- Test on multiple Windows versions
- Test on multiple DPI/scaling settings
- Test VS Code, browsers, terminals, and unsupported apps
- Verify clipboard fallback safety on tester machines

### 6. Security

- Decide whether `SKIP_AUTH=true` is acceptable for local pilot only
- Confirm API key storage approach on tester machines
- Add a secret-handling policy for support staff
- Decide whether Supabase logging is enabled or disabled for pilot

### 7. Operations

- Define who owns pilot support
- Define release naming and versioning
- Define rollback instructions
- Define how updated builds will be distributed to testers

## Recommended deployment decision

For the next step, I recommend:

- **Deploy local-only pilot**
- **Do not host backend yet**
- **Do not change capture logic yet**
- **Do not add more features until pilot feedback starts coming in**

This gives the cleanest signal on whether the current workflow is useful in real usage.

## Minimum checklist before sending to testers

- Build client in `Release`
- Install backend dependencies with `npm ci --omit=dev`
- Create `backend/.env`
- Verify API key works
- Verify `http://localhost:3000/api/health`
- Verify hotkey works on one clean Windows machine
- Verify logs are written to `runlogs/`
- Prepare launch instructions and troubleshooting notes

## Decision points still needed

- Shared API key vs per-user API key
- Manual zip distribution vs installer
- Local backend only vs hosted backend later
- Internal pilot only vs external pilot
