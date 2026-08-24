---
title: Pi Remote Security
description: Four-boundary security posture, exact-action approval, containment, and redaction for Pi Remote.
trigger_phrases:
  - 'pi remote security posture'
  - 'exact-action approval'
  - 'tailnet boundary'
  - 'device revocation'
  - 'mutation kill switch'
  - 'redaction and privacy'
importance_tier: normal
contextType: general
version: 1.0.0.0
---

# Pi Remote Security

The four-boundary posture of Pi Remote: loopback, tailnet-only ingress, foreground authority, and redaction.

---

## 1. OVERVIEW

### Core Principle

Exact-action approval plus tailnet-only ingress plus redaction equals authority that the phone must prove fresh on every use.

### The Four Boundaries

Pi Remote combines four boundaries:

- **Loopback:** the relay and PWA preview bind to IPv4 `127.0.0.1`, not a LAN or tailnet interface.
- **Tailnet-only:** the deployment script disables Funnel and uses private Tailscale Serve HTTPS/WSS routes.
- **Foreground authority:** remote authority comes from a current device proof, short application session, exact Tailscale principal, exact Origin, and one-use action state. Push and cached content carry no authority.
- **Redaction:** the relay redacts before persistence and broadcast, and push carries only an opaque lookup ID plus one bounded attention class.

These controls reduce exposure. Automated tests prove the relay and mocked-extension authority loop, not live Pi process ordering or operating-system containment.

---

## 2. INGRESS AND AUTHENTICATION BOUNDARY

Every relay request must arrive on the secret-prefixed loopback path configured into Tailscale Serve. The relay also requires:

- An exact `Origin` match with `PI_REMOTE_PUBLIC_ORIGIN`.
- A non-empty `tailscale-user-login` principal.
- An action admitted by the fixed server policy.
- A valid application session for every route except enrollment and session challenge/exchange.

The secret prefix is compared safely and stripped before routing. Tailscale identity headers are removed from the request after the principal is captured. Direct loopback requests and spoofed identity headers cannot satisfy the Serve anchor by themselves.

The relay rate-limits requests to 120 per principal/address per minute and enrollment attempts to 10 per minute. HTTP bodies are limited to 16 KiB, WebSocket messages to 64 KiB, total sockets to 32, and sockets per device to four.

---

## 3. DEVICE ENROLLMENT AND SESSIONS

At startup, the relay can print a five-minute, one-use enrollment payload. The phone creates a non-extractable P-256 key, signs the exact enrollment statement, and stores the private key in IndexedDB. Enrollment binds the key to the configured origin, host fingerprint, and Tailscale principal.

Each application session requires a fresh one-minute signed challenge. Sessions last 15 minutes and use an `HttpOnly`, `Secure`, `SameSite=Strict`, host-only cookie. Each WebSocket connection consumes a separate one-use ticket with a 20-second lifetime.

Enrolled devices, challenges, application sessions, and tickets are process-memory state. Relay restart clears them. A device must enroll again after restart even if its browser key remains. The SQLite database does not contain device public keys or application sessions.

---

## 4. REVOCATION

**Log out** revokes the current application session, removes its tickets, closes its sockets, deletes its push subscription, and expires the cookie. **Revoke this device** additionally marks the current in-memory device revoked and prevents new signed sessions for that device until the relay restarts.

The PWA exposes only self-service logout and self-revocation. There is no operator API to list devices, revoke another device, or create a new enrollment challenge while the relay is running. Lost-device recovery therefore requires a controlled relay restart and fresh enrollment.

---

## 5. EXACT-ACTION APPROVAL

The shared canonicalizer recursively sorts JSON object keys and hashes the complete action: principal, session, epoch, tool, arguments, and policy version. Approval cards carry that digest, lease revision, expiry, and redacted canonical arguments.

A decision is accepted only when principal, epoch, revision, digest, pending status, and expiry all match. The database update uses status plus revision as a compare-and-swap condition, so only one racing decision can settle the lease. Idempotency keys reject replay.

Immediately before execution, lease consumption recomputes the digest and checks the current epoch, policy version, principal, session, expiry, status, and enabled command family. Successful consumption changes the durable lease to `consumed` before returning authority. Duplicate consumption is denied. Pending and approved leases become restart-invalidated when a new approval service opens the database.

Accept-edits grants are not wildcard authority. They bind one principal, session, epoch, explicit enabled tool list, expiry of at most ten minutes, and at most ten actions. Each action still gets and consumes its own exact-action lease. A prior denial of the same exact action takes precedence.

---

## 6. RUNTIME BOUNDARY

The production entrypoint enables the extension path only when `PI_REMOTE_MUTATION_ENABLED=1`, exactly one valid family is selected, and `PI_REMOTE_OPERATOR_PRINCIPAL` is present. It creates a random per-process capability, passes it only to the owned Pi child, and exposes request/consume endpoints only on the relay's IPv4 loopback listener. The extension removes the capability from its process environment after loading so protected tool subprocesses do not inherit it. The relay rejects a missing capability, mismatched principal/session/epoch/policy, malformed action, or mismatched digest before creating or consuming a lease.

The phone decision remains an authenticated command and is never persisted or replayed. Only redacted `approval.requested` and `approval.result` events enter the replay ledger. The extension polls consume while a lease is pending. Denial, expiry, relay loss, malformed responses, and final-gate failure block the tool.

---

## 7. KILL SWITCH AND COMMAND FAMILIES

Mutation defaults off. `PI_REMOTE_MUTATION_ENABLED=1` enables the switch only when `PI_REMOTE_MUTATION_FAMILY` selects exactly one implemented family:

| Family       | Protected tool names |
| ------------ | -------------------- |
| `filesystem` | `edit`, `write`      |
| `process`    | `bash`               |
| `network`    | `fetch`              |

Changing or disabling a family revokes pending and approved leases and aborts tracked in-flight work through an `AbortSignal`. The deployed entrypoint reads this configuration only at startup. It has no live administrative switch.

---

## 8. CONTAINMENT

`deploy/containment/pi-remote.sb` is a macOS `sandbox-exec` profile with default deny, workspace-scoped file access, denied network access, denied home and host writes, and a pinned runner executable. It complements approval but is not invoked by the production relay entrypoint.

**Operator verification required:** load the built extension in a running Pi and prove its handler is the final protected-tool boundary. Then execute an approved protected tool under `deploy/containment/pi-remote.sb` on the operator's Mac and run the escape suite in `deploy/containment/README.md`. Also prove the protected runner honors the lease abort signal. `sandbox-exec` is deprecated, and fixture tests cannot prove process-level extension ordering or containment.

---

## 9. REDACTION AND PRIVACY

Policy version 1 replaces recognized path keys, secret keys, prompt fields, secret assignments, bearer values, token patterns, POSIX host paths, and Windows paths. Approval audit rows store a hashed principal reference, digest, tool name, state transition, and reason, but no raw principal or action arguments. Push subscriptions are encrypted with AES-256-GCM before SQLite storage.

Push payloads contain exactly `lookupId` and `attentionClass`. They contain no transcript, tool, arguments, decision, result, path, workspace, or approval authority. Opening a hint requires a fresh authenticated fetch and a current epoch.

Redaction is pattern-based, not a proof that arbitrary free-form text is harmless. Operators must still avoid placing credentials in Pi prompts or tool output and must protect the SQLite database, browser storage, push encryption key, and VAPID private key.
