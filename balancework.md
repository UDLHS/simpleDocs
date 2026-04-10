# Balance Work

This document lists the remaining work in detail so we can move from near-deployment to a stable pilot release without changing the core architecture.

## 1. Current Position

### Already done
- core WPF + native capture + Hono + WebSocket architecture is preserved
- overlay explanation flow is working
- compact explanation style is working
- thumbs feedback is present
- redeem-code auth is implemented in backend and client
- secure token storage is implemented
- authenticated WebSocket flow is implemented
- hosted Supabase connectivity is working
- DB tables are reachable
- packaging/support scripts are present

### Still not fully finished
- redeem-code seed data is not loaded yet
- client staging/production backend URLs are still placeholders
- one confirmed live auth-to-log run is still pending
- final pilot packaging and environment verification still need to be completed

## 2. Remaining Work By Priority

## Priority A: Must Complete Before Pilot

### A1. Seed redeem codes
Status: not done

Work:
- insert redeem codes into `redeem_codes`
- verify codes are visible in hosted DB
- assign tester-code tracking sheet

Why it matters:
- without redeem codes, no tester can sign in

Done when:
- at least one test code exists
- one code can be redeemed once and cannot be reused

### A2. Replace client placeholder URLs
Status: not done

Files:
- `client/appsettings.Staging.json`
- `client/appsettings.Production.json`

Work:
- replace `https://staging-api.example.com`
- replace `https://api.example.com`
- replace matching `wss://...` URLs

Why it matters:
- packaged clients will not connect to the real backend otherwise

Done when:
- client starts and points to the real hosted backend in staging/production mode

### A3. Full hosted auth verification
Status: not done

Work:
- test `POST /auth/redeem-code`
- test `POST /auth/refresh`
- test `POST /auth/logout`
- test invalid code behavior
- test expired/revoked session behavior

Why it matters:
- auth code exists, but pilot readiness requires live behavior verification

Done when:
- sign-in, restart, refresh, and logout work against hosted backend

### A4. Full hosted explain verification
Status: not done

Work:
- start client against hosted backend
- redeem a real code
- send one real explain request
- verify streaming response returns correctly
- verify overlay remains responsive

Why it matters:
- this confirms the real deployment path, not just local builds

Done when:
- one end-to-end hosted explanation succeeds

### A5. DB request logging verification
Status: partially done

Work:
- confirm final `request_logs` row is created
- confirm `participants` row exists
- confirm `refresh_tokens` row exists
- confirm `sessions` row exists/updates
- verify final logged field values match expectations

Why it matters:
- this is required for the planned case-study and pilot analysis

Done when:
- one successful live request creates the expected rows in all related tables

## Priority B: Strongly Recommended Before External Users

### B1. Internal pilot validation
Status: not done

Work:
- test on 3 to 5 internal users
- cover VS Code, browser, Windows Terminal, classic terminal
- collect support bundles
- record auth issues, capture issues, and explanation quality issues

Done when:
- internal pilot completes without critical blockers

### B2. Packaging validation
Status: partly done

Work:
- publish client in release mode
- verify packaged bundle on a clean Windows machine
- confirm launcher works
- confirm no dev-only files are required

Done when:
- a tester can run the packaged build without source-code setup

### B3. Support and operations flow
Status: partly done

Work:
- decide who receives tester issues
- decide where support bundles are sent
- define code issuance tracking
- define how pilot issues are triaged

Done when:
- support process is written and usable by the team

### B4. Privacy and tester guidance
Status: partly done

Work:
- finalize tester-facing privacy note
- clearly state that selected text and background context may be processed
- tell testers what they should not select

Done when:
- tester package includes clear privacy/use guidance

## Priority C: Quality and Hardening

### C1. Multi-environment QA
Status: not done

Work:
- Windows 10 and Windows 11 validation
- multiple DPI/scaling tests
- multiple monitor checks
- different browsers and terminals

### C2. Error handling validation
Status: partly done

Work:
- confirm backend-unavailable behavior
- confirm WebSocket disconnect behavior
- confirm token refresh failure path
- confirm sign-in recovery UX

### C3. Secret hygiene
Status: not done

Work:
- rotate any temporary API keys used during development
- ensure only final deployment secrets remain
- confirm no secrets are bundled into published client files

## 3. Detailed Verification Matrix

## Auth
- redeem code accepted
- invalid code rejected cleanly
- used code rejected cleanly
- refresh works
- logout revokes refresh token
- app restart restores session

## Streaming
- authenticated WebSocket connects
- first token arrives promptly
- complete message is received
- overlay status updates correctly

## Logging
- session id is created
- request id is unique
- final request row is written only once
- DB failure does not block user-visible output

## Feedback
- thumbs appear only when real response text is visible
- only one reaction per response
- reaction is logged without breaking the response flow

## 4. Suggested Execution Order

1. seed redeem codes
2. replace client staging/production URLs
3. run backend hosted env check
4. test redeem login
5. test one full explanation
6. verify DB rows
7. build release package
8. internal pilot
9. fix pilot issues
10. external pilot

## 5. Deployment Blockers Right Now

These are the real blockers preventing a true pilot release today:
- redeem codes not seeded
- client production/staging URLs not finalized
- no confirmed end-to-end live auth + explain + DB log test yet

## 6. What Should Not Change Now

To keep risk low, we should not redesign these before the pilot:
- capture architecture
- overlay architecture
- WebSocket streaming architecture
- WPF client platform choice
- backend framework choice

## 7. Definition Of Done For Pilot Start

We can call the system pilot-ready when:
- hosted auth works
- hosted logging works
- packaged client works
- internal users complete real tasks successfully
- no critical blocker remains in capture, overlay, or session flow
