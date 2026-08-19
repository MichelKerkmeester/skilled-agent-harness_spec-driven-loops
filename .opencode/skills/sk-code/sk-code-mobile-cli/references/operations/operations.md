---
title: Pi Remote Operations
description: Runtime configuration, migrations, retention, device management, kill switch, and push lifecycle.
trigger_phrases:
  - 'pi remote operations'
  - 'relay runtime configuration'
  - 'database migrations'
  - 'retention limits'
  - 'device and session management'
  - 'mutation kill switch'
  - 'push subscription lifecycle'
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Pi Remote Operations

Runtime configuration, migrations, retention, device management, kill switch, and push lifecycle.

---

## 1. OVERVIEW

### Purpose

Operate the relay after deployment: configuration, start and stop, migrations, retention, device and session management, the mutation kill switch, and push subscription lifecycle.

### When to Use

- Changing relay environment variables
- Upgrading or restoring the SQLite database
- Recovering devices after a relay restart
- Toggling mutation capability
- Debugging push delivery

### Core Principle

Startup configuration plus restart-scrubbed memory state means operators plan relay restarts deliberately.

---

## 2. RUNTIME CONFIGURATION

The relay reads these variables at startup:

| Variable                       | Behavior                                                                                                     |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| `PI_REMOTE_PUBLIC_ORIGIN`      | Required exact HTTPS browser origin                                                                          |
| `PI_REMOTE_SERVE_SECRET`       | Required secret-prefixed Serve anchor. The deployment script generates it                                    |
| `PI_REMOTE_PORT`               | Relay loopback port. Defaults to `4310`                                                                      |
| `PI_REMOTE_DB`                 | SQLite filename. Defaults to `./pi-remote.db`. `:memory:` is test/fixture-only                               |
| `PI_REMOTE_USE_FIXTURE`        | `1` forces recorded fixture mode                                                                             |
| `PI_REMOTE_PRINT_ENROLLMENT`   | `1` prints one enrollment payload at startup                                                                 |
| `PI_REMOTE_MUTATION_ENABLED`   | `1` enables the startup mutation switch. Defaults off                                                        |
| `PI_REMOTE_MUTATION_FAMILY`    | One of `filesystem`, `process`, or `network`                                                                 |
| `PI_REMOTE_OPERATOR_PRINCIPAL` | Exact Tailscale principal allowed to decide extension-created leases. Required only when mutation is enabled |
| Push variables                 | All encryption and VAPID variables must be present or push remains disabled                                  |

Do not persist actual values in runbooks or incident notes.

---

## 3. START AND STOP

Use the foreground deployment:

```bash
sh deploy/setup-tailscale-serve.sh
```

Interrupt the script to remove its Serve routes and stop the relay and PWA. The relay handles `SIGINT` and `SIGTERM` by stopping its owned Pi child, closing the approval service, terminating sockets, closing HTTP, and then closing SQLite.

The authenticated `POST /health` response reports process status, read-only mode, and authentication counters. It does not report Pi supervisor state, migration version, database size, push delivery totals, or mutation-policy state.

---

## 4. DATABASE MIGRATIONS

SQLite opens with foreign keys and WAL enabled. Relay construction automatically applies every pending `NNN-name.up.sql` migration in numeric order. Each migration and its `schema_migrations` row commit in one transaction. Current migrations create:

1. Stream epochs, stream state, redacted envelopes, and session catalog.
2. Approval leases, approval audit, and accept-edits grants.
3. Encrypted push subscriptions and bounded attention items.

Every migration has a paired down file, and the internal `MigrationRunner.migrateDown()` reverses only the latest applied version transactionally. There is no bundled migration CLI or npm script. Do not apply down SQL ad hoc to a live database. Use a validated database restore for production rollback, or add a reviewed release-specific migration tool before depending on down-migration operations.

Before upgrade or restore, stop the relay cleanly and take a SQLite-consistent backup, including WAL state when applicable. The repository does not provide a backup, integrity-check, restore, or schema-inspection command.

---

## 5. RETENTION

- Redacted envelopes: newest 1,000 per stream epoch by default. The class accepts 1 through 10,000, but the production entrypoint exposes no configuration variable.
- Attention items: newest 200 globally.
- Browser read-only cache: seven days, at most eight sessions, and 500 blocks per transcript.
- Approval lease and audit rows: no automatic retention job is implemented.
- Ended stream epochs and session catalog rows: no automatic retention job is implemented.

When a cursor falls below the envelope floor, the relay sends a retention gap followed by the retained authoritative snapshot.

---

## 6. DEVICE AND SESSION MANAGEMENT

The PWA supports two current-device actions:

- **Log out:** revoke the current session, disconnect its socket, delete its push subscription, and retain the browser device key for future sign-in.
- **Revoke this device:** revoke the current in-memory device and clear the browser's stored device record.

There is no device inventory, named devices, remote revocation of another device, or persistent device registry. Relay restart clears all enrolled-device and session state. Generate a new startup enrollment payload and enroll each intended device again after restart.

---

## 7. MUTATION KILL SWITCH

Keep `PI_REMOTE_MUTATION_ENABLED` unset or set to a value other than `1` for normal monitoring. The switch and family are read once at startup. To change them safely:

1. Stop the foreground deployment.
2. Change the controlled startup environment.
3. Restart the deployment.
4. Re-enroll the device because authentication state is not persistent.
5. Treat all prior pending or approved leases as invalid.

The component service drains leases when its live policy is disabled. A graceful relay stop also closes the service and revokes outstanding leases. Startup environment enablement activates the authenticated extension transport, but it is not proof that the installed Pi version loaded the final handler or that protected execution is contained. Keep the switch off until the operator checks in [Security](../standards/security.md) pass.

---

## 8. PUSH SUBSCRIPTION LIFECYCLE

Push is optional and per-device:

1. The PWA obtains capability and the public VAPID key from `/api/push/config`.
2. The browser asks for notification permission and creates a user-visible subscription.
3. The relay encrypts the subscription with AES-256-GCM and upserts one row for the device.
4. The device can enable or disable each of `needs_input`, `finished`, and `error`.
5. Foreground devices are suppressed. The PWA reports visibility state, and active WebSockets provide an additional foreground signal.
6. Provider responses `404` or `410` remove the invalid subscription automatically.
7. Disable notifications, logout, or device revocation removes the relay subscription. The PWA also asks the browser to unsubscribe.

Other push-provider failures are swallowed and are not exposed through health metrics. The Attention Inbox is the operational fallback. Preserve the push encryption key with any database backup. Changing it leaves existing ciphertext unreadable, and no key-rotation workflow is implemented.

---

## 9. ROUTINE VERIFICATION

Use the repository gates after code or configuration changes:

```bash
npm run typecheck
npm test
npm run build -w @pi-remote/web
```

Then perform the environment-specific checks listed in [Setup](../setup/setup.md) and [Platform Support](../standards/platform-support.md).
