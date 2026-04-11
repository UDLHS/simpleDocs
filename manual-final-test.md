# Manual Final Test

Use this for the last real desktop check before pilot use.

## What Is Already Verified

These checks are already done:
- Azure backend health works
- hosted redeem-code login works
- invalid redeem code returns a clean error
- already-used redeem code returns a clean error
- hosted refresh works
- hosted logout and token revocation work
- hosted authenticated WebSocket explain flow works
- hosted DB logging works
- packaged client builds successfully
- tester bundle builds successfully

## What You Need To Verify Manually

This is the final real-user desktop path:
1. sign in through the packaged WPF window
2. select real text in a desktop app
3. press the hotkey
4. confirm the overlay visually
5. confirm the DB row created by that packaged-client path

## Before You Start

1. Close any old `simpleDocs` or `CodeExplainer` window that is still open.
2. Use the latest tester bundle:
   `dist/tester-bundle/app/Start-CodeExplainer.bat`
3. Pick one redeem code that is still unused in `redeem_codes`.

## Sign-In Test

1. Run `dist/tester-bundle/app/Start-CodeExplainer.bat`.
2. Wait for the sign-in window to appear.
3. Type one unused redeem code.
4. Click `Continue`.

Expected result:
- the sign-in window closes
- the app stays running in the tray
- no error message is shown

If it fails:
- invalid code should say the code is invalid
- used code should say the code has already been used

## Explanation Test

Use a simple code sample first.

Example:

```ts
const items = [{ price: 5 }, { price: 10 }];
const total = items.reduce((sum, item) => sum + item.price, 0);
```

Steps:
1. Open VS Code or another supported app.
2. Highlight the `reduce(...)` line.
3. Press the configured hotkey.
4. Wait for the overlay to appear.

Expected result:
- overlay opens
- explanation streams in
- text is readable
- feedback controls appear only after response text is visible

## DB Verification

After one successful packaged-client request, run these queries in Supabase.

Participants:

```sql
select * from participants order by created_at desc;
```

Refresh tokens:

```sql
select * from refresh_tokens order by created_at desc;
```

Sessions:

```sql
select * from sessions order by created_at desc;
```

Request logs:

```sql
select request_id, session_id, task_type, status, timestamp, response_text
from request_logs
order by timestamp desc;
```

Expected result:
- a participant row exists or is reused
- a refresh token row exists
- a session row exists or updates
- a new request log row exists with `status = completed`

## Final Pass Criteria

The final desktop path is considered verified when:
- packaged sign-in succeeds
- the real hotkey flow shows the overlay
- the hosted DB gets the new request row
- no critical UI issue blocks a tester from using the app
