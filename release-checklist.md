# Release Checklist

## 1. Backend Configuration

- Confirm `backend/.env` contains real values for:
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `ACCESS_TOKEN_SECRET`
  - provider API key
- Confirm `SKIP_AUTH=false`
- Rotate any temporary development API keys before release

## 2. Database Readiness

- Run migration SQL in the hosted DB
- Seed redeem codes into `redeem_codes`
- Run:
  `npm run check:db`
- Confirm these tables are reachable:
  - `participants`
  - `redeem_codes`
  - `refresh_tokens`
  - `sessions`
  - `request_logs`

## 3. Client Configuration

- Replace placeholder URLs in:
  - `client/appsettings.Staging.json`
  - `client/appsettings.Production.json`
- Confirm staging/production `ApiBaseUrl` and `WsBaseUrl` are correct
- Confirm auth is enabled in staging/production config

## 4. Build Output

### Client
1. Run:
   `.\publish-client.ps1 -Configuration Release -Runtime win-x64 -EnvironmentName Production`
2. Confirm output exists in `dist/client/`
3. Confirm `Start-CodeExplainer.bat` exists
4. Confirm production `appsettings` files are present
5. Launch once on a clean Windows machine

### Backend
1. Run:
   `.\package-backend.ps1`
2. Confirm output exists in `dist/backend/`
3. Confirm `src/`, `db/`, `package.json`, `.env.example` are present
4. Confirm no local secrets were copied unintentionally

## 5. Functional Verification

- Redeem-code login works
- Access token refresh works after restart
- Logout works
- Authenticated WebSocket connect works
- One full explain request succeeds
- Overlay renders correctly
- Thumbs feedback works for one visible response
- Final request log row is inserted after completion

## 6. Data Verification

After one successful test request, confirm these DB effects:
- one `participant` row exists or is reused
- one `refresh_tokens` row exists
- one `sessions` row exists or updates
- one `request_logs` row exists with expected values

## 7. Operational Readiness

- tester guide is packaged
- support bundle export script is available
- redeem-code issuance list is tracked
- privacy/support contact is prepared
- internal pilot users are selected

## 8. Go / No-Go

Release only if all are true:
- build works
- auth works
- DB logging works
- support process is ready
- no critical capture or overlay regressions remain
