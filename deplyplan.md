# Deployment Plan

## Current Stage

The project is in late pre-deployment / pilot-preparation stage.

The main application flow is already preserved and working in its intended structure:
- Windows WPF client
- native capture engine
- Node.js Hono backend
- WebSocket streaming
- overlay response UI

The system is no longer just local-only in design. The deployment path now includes hosted auth and hosted request logging.

## What Is Already Implemented

### Core product
- hotkey-triggered native capture flow
- overlay streaming response flow
- lightweight thumbs up / thumbs down response feedback
- compact overlay-oriented explanation style

### Auth and session
- redeem-code login
- refresh-token flow
- logout flow
- Windows secure token storage
- WebSocket auth at handshake
- protected backend routes

### Hosted data path
- Supabase/Postgres connectivity
- auth-related tables
- request log table path
- session/request id flow
- async post-response request logging

### Packaging and support
- client publish script
- backend package script
- tester bundle script
- support bundle export script
- release checklist and pilot guide

## What Still Needs To Be Done

### Must do before external users
1. Seed redeem codes into `redeem_codes`.
2. Replace placeholder staging/production backend URLs in the client config files.
3. Run one real redeem-code login against the hosted backend.
4. Run one full explain request and confirm DB rows are written.
5. Confirm logout and refresh behavior.
6. Build and verify the final packaged tester bundle.

### Should do before broader rollout
1. Validate on multiple Windows versions and DPI settings.
2. Validate on VS Code, browser, Windows Terminal, and classic terminal.
3. Confirm support process for logs and tester issues.
4. Freeze one build for the pilot.

## Deployment Phases

### Phase 1: Infrastructure completion
- hosted Supabase configured
- schema applied
- service-role and access-token secrets configured
- redeem codes seeded

### Phase 2: Staging validation
- client points to real staging API / WebSocket URLs
- one redeem-code login works
- one request writes to `participants`, `refresh_tokens`, `sessions`, and `request_logs`
- WebSocket auth works with the live backend

### Phase 3: Internal pilot
- 3 to 5 trusted users
- packaged build only
- support bundle collection enabled
- issue triage after every tester session

### Phase 4: External pilot
- 10 to 30 users
- fixed build and fixed model configuration
- redeem-code issuance tracked manually
- thumbs feedback and DB logs reviewed regularly

## Current Risks

### Technical risks
- staging and production client URLs are still placeholders
- redeem codes are not seeded yet
- full live auth-to-log path still needs one confirmed end-to-end run

### Operational risks
- API keys in local env should be rotated before real-user rollout
- support / tester onboarding must be consistent
- privacy language must be shown clearly to testers

## Recommended Immediate Order

1. Seed `redeem_codes`.
2. Replace client staging/production URLs.
3. Start hosted backend with final env values.
4. Test redeem-code login.
5. Test one real explanation.
6. Confirm DB inserts.
7. Produce final tester bundle.
8. Start internal pilot.

## Definition Of Pilot Ready

The system is pilot ready when all of these are true:
- client packaged build launches cleanly
- redeem-code login works
- session restores after restart
- authenticated WebSocket explain request works
- final request log row is written to hosted DB
- thumbs feedback works in overlay
- no obvious capture or overlay regressions are present
