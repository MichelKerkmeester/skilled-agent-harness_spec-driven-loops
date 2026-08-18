---
title: Pi Remote Rollback
description: Stop-first rollback procedure for Pi Remote. It removes ingress and processes, invalidates remote authority, and restores a validated relay database without touching native Pi session history.
trigger_phrases:
  - 'pi remote rollback'
  - 'disable mutation authority'
  - 'remove ingress drain approvals'
  - 'restore relay database'
  - 'down migration schema reversal'
  - 'local pi smoke test'
  - 'roll forward stop conditions'
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Pi Remote Rollback

Stop-first rollback procedure for Pi Remote. It removes ingress and processes, invalidates remote authority, and restores a validated relay database without touching native Pi session history.

---

## 1. OVERVIEW

### Purpose

Rollback removes Pi Remote ingress and processes, invalidates remote authority, and restores a validated relay database when required. It must not delete, rewrite, or migrate native Pi session history. The relay starts Pi with `--no-session` and does not manage Pi session files.

### Runtime Limits

The current runtime does not expose a live mutation switch, approval-drain endpoint, database backup command, restore command, or migration CLI. The safe deployed rollback is therefore stop-first. Component tests exercise the finer-grained controls in process.

### Core Principle

Stop everything first, preserve the database and Pi files, and never retry a consumed lease automatically.

## 2. EXECUTED DRILL EVIDENCE

The automated drill is part of `npm test` and has a standalone entrypoint:

```bash
npm test
npm run rollback:drill
```

### Drill Coverage

- Mutation disabled by default and live policy disable revoking authority.
- Lease expiry, revocation, epoch invalidation, restart invalidation, duplicate denial, and exact digest checks.
- Deterministic pre-write, post-write, acknowledgement, persistence, broadcast, and reconnect kill points.
- The persistence-boundary outcome remaining explicitly indeterminate and non-repeatable.
- Direct ingress rejection, session/device revocation, socket closure, and one-use tickets.
- Transactional durable replay, deduplication, retention gaps, and the sync barrier.
- Disposable database backup, destructive working-copy change, restore, and latest down-migration.
- Relay session preservation, indeterminate consumed-row preservation, and an unchanged native-session boundary sentinel.

### What The Drill Does Not Claim

The executable drill uses only app-local disposable state. It verifies the machinery without claiming that a target-host database, live Pi process, or real Pi session store has been rolled back. Production restore remains stop-first and operator-controlled.

## 3. DEPLOYED ROLLBACK PROCEDURE

### Step 1: Disable Mutation Authority

The startup kill switch defaults off. If a controlled integration started with mutation enabled, plan the replacement environment with `PI_REMOTE_MUTATION_ENABLED` unset or not equal to `1`.

There is no live administrative endpoint to apply that change. Do not assume editing an environment file changes the running process.

### Step 2: Remove Ingress And Drain Approvals

Interrupt the foreground deployment script. Its trap removes Serve routes for `/`, `/api`, and `/health`, then signals the relay and web processes. During graceful relay shutdown, `ApprovalService.close()` revokes pending and approved leases and aborts tracked in-flight executions before SQLite closes.

If shutdown is not graceful, a subsequent relay start marks every persisted pending or approved lease `restart-invalidated`. A consumed lease remains consumed and must never be retried automatically.

Confirm on the target host:

```bash
tailscale serve status
tailscale funnel status
```

No Pi Remote Serve route or public Funnel listener may remain.

### Step 3: Stop The Relay

Wait for the foreground command to exit. Do not remove the database or any Pi files. Preserve the database and target workspace if any mutation outcome is unresolved.

### Step 4: Restore The Database Or Reverse Schema

Preferred recovery is a SQLite-consistent backup taken while the relay was stopped or through a SQLite-aware backup mechanism. Restore the database and matching WAL state only while the relay is stopped. Keep the push encryption key paired with a database that contains encrypted subscriptions.

The code includes paired down migrations and an internal `MigrationRunner.migrateDown()` that reverses one latest version per call. No supported CLI invokes it. Do not execute the `.down.sql` files manually in production. If release rollback requires schema reversal rather than file restore, first ship and verify a release-specific operator command that calls the internal runner and checks the resulting schema version.

### Step 5: Preserve Pi Sessions And Browser Evidence

- Do not alter Pi session storage. Pi Remote has no code path for it.
- Expect all enrolled devices, application sessions, challenges, and tickets to be lost on relay restart because they are memory-only.
- Expect the PWA to retain a stale local read-only cache for up to seven days. It is evidence for display only, not authority.
- Expect restored push subscriptions to work only with the matching encryption key and still-valid provider endpoints.

### Step 6: Restart In Read-Only Mode

Start the normal deployment with mutation disabled:

```bash
sh deploy/setup-tailscale-serve.sh
```

Enroll a device with the fresh startup payload. Confirm session catalog access, transcript/cache freshness labels, and WebSocket reconnection. Confirm approval cards from before rollback are not actionable.

### Step 7: Local Pi Smoke Test

**Operator-verified:** prove that the target host has the intended Pi 0.84.1 executable and that the PWA receives a new live Pi event from the owned RPC child. The current `/health` response does not expose supervisor state, and absence of the executable activates fixture fallback, so relay startup alone is not proof of a live Pi connection.

If the live check fails, keep mutation disabled. Read-only fixture behavior may be used for diagnostics, but it must be labeled fixture data.

## 4. ROLL-FORWARD STOP CONDITIONS

Do not restore remote capability when any of these remains true:

- A mutation outcome is indeterminate.
- Serve or Funnel exposure differs from the intended private routes.
- A prior approval appears actionable after restart.
- Database schema or encryption-key compatibility is unknown.
- The live Pi extension, authorizer transport, or containment boundary has not been verified.
