# Implementation Status Plan

This document replaces the older temporary planning notes and tracks the current implementation status of the deployment-ready system.

## Completed Work

### Core assistant flow
- native Windows capture pipeline remains intact
- overlay rendering remains intact
- WebSocket streaming remains intact
- explanation style is tuned for the small overlay
- thumbs up / thumbs down feedback exists in the overlay

### Auth and session
- redeem-code login UI exists in the WPF client
- backend redeem / refresh / logout endpoints exist
- client stores tokens securely on Windows
- session restore and silent refresh are implemented
- WebSocket auth is validated on connect

### Request logging
- session id and request id flow exist
- request logging is designed to happen after stream completion
- hosted DB connectivity checks are available
- DB schema and seed SQL files exist in the repo

### Deployment tooling
- client publish script exists
- backend package script exists
- tester bundle script exists
- support bundle export script exists
- release and launch docs exist

## Remaining Work

### High priority
1. seed redeem codes in the hosted DB
2. replace staging/production client placeholder URLs
3. run one full redeem-code login test against hosted backend
4. run one full explain request against hosted backend
5. verify DB rows are created correctly

### Medium priority
1. validate on multiple Windows environments
2. verify logout and expired-session recovery with real backend
3. package the final pilot bundle
4. prepare internal pilot support workflow

### Lower priority after pilot starts
1. refine onboarding copy based on tester confusion
2. tighten metrics review process
3. decide long-term release/update workflow

## Current Truth

The remaining work is mostly infrastructure hookup, staging validation, and pilot hardening.

The main product architecture should not be redesigned at this stage.
