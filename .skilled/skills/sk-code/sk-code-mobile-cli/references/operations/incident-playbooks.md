---
title: Pi Remote Incident Playbooks
description: Recovery procedures for indeterminate mutation, lease expiry, device lockout, sync stall, and push failure.
trigger_phrases:
  - 'indeterminate mutation'
  - 'lease expiry'
  - 'device lockout'
  - 'sync barrier stall'
  - 'push delivery failure'
  - 'recovery procedure'
importance_tier: normal
contextType: planning
version: 1.0.0.0
---

# Pi Remote Incident Playbooks

Recovery procedures for indeterminate mutation, lease expiry, device lockout, sync stall, and push failure.

---

## 1. OVERVIEW

### Purpose

Structured recovery for the five known Pi Remote failure modes. Each playbook has Detect, Recover, and Escalate steps.

### Core Principle

Preserve uncertainty. Never retry a protected action merely because the PWA did not receive an acknowledgement. Keep mutation disabled until the exact state is known.

### When to Use

- A protected tool ran but the outcome is unknown
- A lease expired while a runner was active
- The phone lost its device key or was lost
- The PWA stalls at the reconciliation barrier
- A push notification never arrives

---

## 2. INDETERMINATE MUTATION

### Detect

- A lease is durably `consumed`, but the protected runner or relay stopped before an external result was confirmed.
- The PWA shows consumed/settled state without reliable evidence of the filesystem, process, or network outcome.
- A crash occurred at the persistence boundary.

The recovery tests name this state `indeterminate`. They prove the durable lease cannot be consumed twice, not whether the external side effect happened.

### Recover

1. Keep or return mutation to disabled startup configuration.
2. Do not replay the approval or repeat the tool call.
3. Preserve the SQLite database and the target workspace for investigation.
4. Inspect the local target state using an independent read-only method.
5. Record exactly one conclusion: completed, not completed, or still indeterminate.
6. If correction is needed, create a new explicit action after the original state is understood.

### Escalate

Escalate whenever the side effect cannot be established independently. Pi Remote deliberately has no automatic retry for consumed authority.

---

## 3. LEASE EXPIRY MID-FLIGHT

### Detect

- The lease's `AbortSignal` is aborted with `lease-expired`.
- The review card expires while a protected runner is still active.

### Recover

1. Require the protected runner to terminate on the abort signal.
2. Treat any partially completed external side effect as indeterminate.
3. Inspect target state before requesting another action.
4. Never extend or revive the expired lease. A new action requires a new digest and lease.

### Operator-Verified Boundary

The service and tests emit the abort signal, but the production entrypoint does not launch a contained protected runner. Verify termination behavior in the real extension and runner integration before enabling mutation.

---

## 4. DEVICE LOCKOUT OR LOST KEY

### Detect

- The browser lost IndexedDB, the phone was lost, or the non-extractable private key is unavailable.
- Session challenge exchange returns unauthorized even though the tailnet site loads.
- No other enrolled device can self-revoke the lost device.

### Recover

1. Stop the foreground deployment to remove ingress and clear in-memory device/session state.
2. Restart with startup enrollment printing enabled.
3. Enroll the replacement phone with the new one-use payload.
4. Re-enable push from the replacement device if required.
5. Confirm the old device cannot authenticate to the restarted relay.

Restart clears every device, not only the lost one. The current implementation has no persistent device registry, recovery key, or remote administrator revocation endpoint.

---

## 5. SYNC-BARRIER STALL

### Detect

- The PWA remains on **Reconciliation barrier active**.
- The connection repeatedly reconnects without accepting a snapshot.
- A cursor reports retention, epoch, or ahead gap but no following snapshot reaches display state.

### Recover

1. Leave the view read-only and do not trust cached freshness.
2. Reload the PWA to discard the in-memory cursor and request a new snapshot.
3. Confirm the device can establish a fresh application session and one-use WebSocket ticket.
4. If the stall persists, stop the deployment cleanly, preserve the database, and restart.
5. Re-enroll, open the same opaque session, and confirm a snapshot or an explicit unknown-session result.

The server queues live events above a frozen barrier and normally sends a gap followed immediately by a snapshot. A persistent stall therefore indicates transport, authentication, database, or client-state failure and should not be bypassed with deltas.

---

## 6. PUSH DELIVERY FAILURE

### Detect

- No notification appears while the Attention Inbox contains a current item.
- Push is disabled in relay configuration or denied by the browser.
- The subscription was removed after a provider `404` or `410`.
- OS Focus, battery policy, or browser lifecycle delays delivery.

### Recover

1. Use the authenticated Attention Inbox as the source of current attention state.
2. Confirm push support and permission on the device.
3. Disable and re-enable notifications to replace the per-device subscription.
4. Reapply attention-class preferences.
5. Open a hint and confirm the relay revalidates it against the current epoch.

### Escalate

Non-`404`/`410` provider failures are not exposed through health or a delivery log. If re-subscription does not recover delivery, collect provider and browser evidence without subscription endpoints or keys, then keep operating from the Inbox.

**Operator-verified:** physical-device iOS delivery, OS Focus behavior, and service-worker restart behavior require testing on the supported target device.
