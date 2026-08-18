---
title: 'Pi Remote: Feature Catalog'
description: 'Unified reference combining the complete feature inventory and current-reality reference for the Pi Remote app.'
trigger_phrases:
  - 'pi remote'
  - 'pi remote feature catalog'
  - 'feature catalog'
last_updated: '2026-02-11'
version: 1.0.0.0
---

# Pi Remote: Feature Catalog

This document combines the current feature inventory for the `pi-remote` app into a single reference. The root catalog acts as the app-level directory: it summarizes each capability area, describes what the app does today, and points to the per-feature files that carry the deeper implementation and validation anchors.

---

## 1. OVERVIEW

Use this catalog as the canonical inventory for the live `pi-remote` feature surface. The numbered sections below group the app by capability area so readers can move from a top-level summary into per-feature reference files without losing implementation or validation context.

---

## 2. TRANSPORT AND STATE

### RPC supervision

#### Description

Persistent supervision of one Pi RPC child with bounded restart and recorded fixture fallback.

#### Current Reality

The relay owns exactly one `pi --mode rpc` child, serializes command writes through a promise chain, and correlates each response by request id. A missing binary or an unexpected exit triggers exponential backoff restarts up to a fixed bound, after which the supervisor reports a failed state. The recorded fixture stream keeps request and response behavior available when the live child is absent.

#### Source Files

See [`transport-and-state/rpc-supervision.md`](transport-and-state/rpc-supervision.md) for full implementation and test file listings.

---

### LF JSONL framing and demux

#### Description

Strict LF-delimited JSONL framing and request id demultiplexing for the Pi RPC stream.

#### Current Reality

One decoder treats LF as the only record delimiter, rejects carriage returns, empty records, and oversized frames, and routes each parsed record through a demultiplexer that matches responses to pending request ids while delivering events independently. Child exit rejects every pending response.

#### Source Files

See [`transport-and-state/lf-jsonl-framing-and-demux.md`](transport-and-state/lf-jsonl-framing-and-demux.md) for full implementation and test file listings.

---

### Canonical redaction

#### Description

The single redaction policy applied to every envelope before persistence or broadcast.

#### Current Reality

A recursive redactor replaces path, secret, and private-text fields plus inline token, bearer, and path patterns with fixed markers, and stamps each envelope with a policy version, a redacted field count, and sorted reasons. The approval card display reuses the same function for shown arguments.

#### Source Files

See [`transport-and-state/canonical-redaction.md`](transport-and-state/canonical-redaction.md) for full implementation and test file listings.

---

### Redacted durable ledger

#### Description

SQLite ledger that persists redacted envelopes with epoch ordering, deduplication, and retention floors.

#### Current Reality

The store commits one monotonic envelope per append, refuses duplicate event ids and out-of-order sequences, opens a new epoch at sequence one, and trims old rows to a retention floor. Migrations run on open, and the same database handle is shared with the approval and push services.

#### Source Files

See [`transport-and-state/redacted-durable-ledger.md`](transport-and-state/redacted-durable-ledger.md) for full implementation and test file listings.

---

### Sync and replay barrier

#### Description

A sync hub that joins replay snapshots and live deltas without interleaving pre-snapshot messages.

#### Current Reality

A subscription receives a cursor-aware plan of snapshot, delta, or gap messages frozen at one committed barrier, then receives only live deltas beyond that barrier. Queued deltas collected during initialization flush in sequence order after the plan is sent.

#### Source Files

See [`transport-and-state/sync-replay-barrier.md`](transport-and-state/sync-replay-barrier.md) for full implementation and test file listings.

---

### Transcript projection

#### Description

Projection of the Pi event stream into typed, revisable transcript blocks.

#### Current Reality

The projector maps every event family to text, thinking, plan, tool call, tool result, file diff, and usage blocks, buffers streaming deltas, and assigns stable block ids with incrementing revisions and sequences. Submitted phone prompts project as user text blocks.

#### Source Files

See [`transport-and-state/transcript-projection.md`](transport-and-state/transcript-projection.md) for full implementation and test file listings.

---

## 3. AUTH AND BOUNDARY

### Device enrollment

#### Description

Short-lived QR pairing challenges and ECDSA key proof for binding one device.

#### Current Reality

The relay issues a one-time pairing challenge with a host fingerprint and expiry, and the enrolling device proves possession of a fresh P-256 key by signing the byte-stable statement. One challenge yields one enrolled device and the challenge is consumed.

#### Source Files

See [`auth-and-boundary/device-enrollment.md`](auth-and-boundary/device-enrollment.md) for full implementation and test file listings.

---

### Application sessions

#### Description

Short-lived application sessions established by a device proof challenge exchange.

#### Current Reality

An enrolled device requests a session challenge, signs the challenge statement, and receives an opaque session token with a bounded TTL. Every request revalidates origin, principal, device liveness, and expiry before the session is accepted.

#### Source Files

See [`auth-and-boundary/application-sessions.md`](auth-and-boundary/application-sessions.md) for full implementation and test file listings.

---

### One-use tickets

#### Description

One-use WebSocket tickets that bind a session to a single sync or prompt upgrade.

#### Current Reality

A session can mint a short-lived ticket that is consumed exactly once at the WebSocket upgrade or prompt submit boundary. Tickets are deleted on use, revocation, or expiry.

#### Source Files

See [`auth-and-boundary/one-use-tickets.md`](auth-and-boundary/one-use-tickets.md) for full implementation and test file listings.

---

### Default-deny authorization

#### Description

An explicit action allowlist that denies every unknown action and tool mutation.

#### Current Reality

Every request maps to a named action string, and the auth service rejects the session when the action is not in the allowlist. Rate limiters bound enrollment, general request, and prompt ingress without retaining payloads.

#### Source Files

See [`auth-and-boundary/default-deny-authorization.md`](auth-and-boundary/default-deny-authorization.md) for full implementation and test file listings.

---

### Serve-identity anchor

#### Description

Fail-closed loopback ingress that trusts only the Serve secret path and the Tailscale identity headers.

#### Current Reality

The server binds to IPv4 loopback only, requires the secret path prefix plus the exact public origin, and takes the principal from the Tailscale user login header. All identity headers are deleted before the request is handled, and a rate limiter guards upgrades.

#### Source Files

See [`auth-and-boundary/serve-identity-anchor.md`](auth-and-boundary/serve-identity-anchor.md) for full implementation and test file listings.

---

### Revocation

#### Description

Session, device, and grant revocation with active connection teardown.

#### Current Reality

Revoking a session or device marks the records terminal, invalidates tickets and challenges, aborts in-flight approval authority, and closes matching WebSocket connections with a revocation code. Push subscriptions are removed at the same time.

#### Source Files

See [`auth-and-boundary/revocation.md`](auth-and-boundary/revocation.md) for full implementation and test file listings.

---

## 4. APPROVAL AND MUTATION

### Exact-action leases

#### Description

One-decision approval leases bound to the exact canonical action digest.

#### Current Reality

Each protected tool call requests a lease that pins the principal, session, epoch, tool, and canonical arguments digest with a bounded TTL. The approval card carries the redacted canonical arguments and digest so an operator can decide with the full action in view.

#### Source Files

See [`approval-and-mutation/exact-action-leases.md`](approval-and-mutation/exact-action-leases.md) for full implementation and test file listings.

---

### CAS decision settle

#### Description

Compare-and-swap settling of one approval decision under idempotency and revision guards.

#### Current Reality

A decision applies only when the lease is still pending at the submitted revision, the digest and epoch match, and the idempotency key has not been used. Replayed, raced, stale, and expired decisions are rejected with a reason.

#### Source Files

See [`approval-and-mutation/cas-decision-settle.md`](approval-and-mutation/cas-decision-settle.md) for full implementation and test file listings.

---

### Final-gate digest

#### Description

Recomputation of the exact action digest at the final boundary before execution.

#### Current Reality

Before authority is granted, the relay recomputes the canonical digest from the live action, rechecks epoch, policy version, expiry, lease status, and policy enablement, and only then marks the lease consumed. The extension boundary runs the same digest check against the relay authority routes.

#### Source Files

See [`approval-and-mutation/final-gate-digest.md`](approval-and-mutation/final-gate-digest.md) for full implementation and test file listings.

---

### Accept-edits grants

#### Description

Bounded grants that auto-approve a fixed number of edits within named enabled tools.

#### Current Reality

An operator can grant a session a counted allowance for edit and write tools with a hard TTL ceiling. Each action consumes one allowance, must match the grant principal, session, and epoch, and must not repeat an exact action that was previously denied.

#### Source Files

See [`approval-and-mutation/accept-edits-grants.md`](approval-and-mutation/accept-edits-grants.md) for full implementation and test file listings.

---

### Kill switch

#### Description

A mutation policy that disables the enabled command family and revokes outstanding authority.

#### Current Reality

One command family can be enabled at a time, and turning the policy off emits a disable reason that the approval service uses to revoke pending and approved leases and abort in-flight execution. The relay composes the switch from the mutation environment flags.

#### Source Files

See [`approval-and-mutation/kill-switch.md`](approval-and-mutation/kill-switch.md) for full implementation and test file listings.

---

### Mutation containment

#### Description

The extension boundary that blocks protected tool calls before execution and the loopback authority routes that back it.

#### Current Reality

The Pi extension hooks the final tool call boundary, digests every protected action, and requests and consumes leases from the relay authority routes with a shared secret. A non-matching action, digest, or authority configuration blocks the tool call before execution.

#### Source Files

See [`approval-and-mutation/mutation-containment.md`](approval-and-mutation/mutation-containment.md) for full implementation and test file listings.

---

## 5. COMMAND AND PUSH

### Prompt steering transport

#### Description

Steering prompt submission through the supervised RPC child with redacted projection.

#### Current Reality

One submission is in flight at a time, each submission id is single-use, and the returned transcript block is committed through the sync hub. A delivery-unknown outcome blocks automatic retry while the optimistic client block reconciles against the committed block.

#### Source Files

See [`command-and-push/prompt-steering-transport.md`](command-and-push/prompt-steering-transport.md) for full implementation and test file listings.

---

### VAPID content-free push

#### Description

Web Push delivery of content-free attention hints with encrypted stored subscriptions.

#### Current Reality

Push subscriptions are encrypted at rest with AES-256-GCM, hints carry only a lookup id and attention class, and foreground devices plus preference toggles suppress delivery. Invalid endpoints are removed when the push provider rejects them.

#### Source Files

See [`command-and-push/vapid-content-free-push.md`](command-and-push/vapid-content-free-push.md) for full implementation and test file listings.

---

### Attention inbox

#### Description

A bounded in-app attention list that resolves hints to current relay state.

#### Current Reality

Attention items persist with class, generation, and nonce metadata only, and opening one reauthenticates, resolves the current epoch, and routes to the review or session view. The inbox remains available when notifications are denied.

#### Source Files

See [`command-and-push/attention-inbox.md`](command-and-push/attention-inbox.md) for full implementation and test file listings.

---

## 6. PWA

### Session list

#### Description

The Home view that lists opaque session cards from the relay catalog.

#### Current Reality

Session cards carry only an opaque id, status, message count, and update time, and hydrate from the offline cache before the relay list arrives. Device footer actions log out and revoke the current device.

#### Source Files

See [`pwa/session-list.md`](pwa/session-list.md) for full implementation and test file listings.

---

### Typed-block transcript

#### Description

The live transcript view that renders typed, revisable blocks from sync messages.

#### Current Reality

Blocks normalize by stable id and revision, an epoch change triggers a reconciliation barrier until a fresh snapshot arrives, and the list virtualizes long transcripts. Every block kind has a dedicated renderer, including redacted file diffs and usage rows.

#### Source Files

See [`pwa/typed-block-transcript.md`](pwa/typed-block-transcript.md) for full implementation and test file listings.

---

### Compose box

#### Description

The prompt composer that submits steering input with optimistic blocks and retry.

#### Current Reality

Sending inserts an optimistic user block, submits through the relay command path, and replaces the optimistic block with the committed block on acceptance. Rejection restores the draft and keeps the same submission id for retry.

#### Source Files

See [`pwa/compose-box.md`](pwa/compose-box.md) for full implementation and test file listings.

---

### Approval card

#### Description

The review view that presents exact-action approvals with decision and grant actions.

#### Current Reality

Each card shows the relay-redacted canonical input, the digest, and a live countdown, with approve, deny, and accept-next-edits actions for edit and write tools. Decisions submit through the relay and results refresh every second.

#### Source Files

See [`pwa/approval-card.md`](pwa/approval-card.md) for full implementation and test file listings.

---

## 7. RELEASE

### Whole-gate runner

#### Description

The release verification runner that executes the full gate sequence and writes evidence.

#### Current Reality

The runner spawns typecheck, lint, format, test, build, web, drill, and threshold gates in order, sanitizes output, writes a timestamped evidence document, derives claims, and evaluates rollout readiness. Absolute app and home paths never appear in the document.

#### Source Files

See [`release/whole-gate-runner.md`](release/whole-gate-runner.md) for full implementation and test file listings.

---

### Numeric thresholds

#### Description

Declared numeric limits for release metrics with machine and operator measurement sources.

#### Current Reality

Eight metrics declare a finite threshold, a max or min comparison, a unit, and a source. Machine metrics are collected against a disposable build and database, and a missing machine measurement fails while a missing operator measurement stays pending.

#### Source Files

See [`release/numeric-thresholds.md`](release/numeric-thresholds.md) for full implementation and test file listings.

---

### Staged rollout

#### Description

A staged rollout policy that marks stages ready only on complete evidence.

#### Current Reality

Three stages each name a kill switch and a required evidence subset, and a stage is ready only when every required claim passes. Operator evidence must be schema-valid with app-relative artifact paths.

#### Source Files

See [`release/staged-rollout.md`](release/staged-rollout.md) for full implementation and test file listings.

---

### Rollback drill

#### Description

An executable drill that exercises authority drain, backup restore, and down-migration on disposable state.

#### Current Reality

The drill builds a disposable database, approves and consumes a lease, flips the kill switch to drain authority, damages and restores the backup, and migrates down to version 4 while preserving session and indeterminate rows. The native session history outside the relay is left untouched.

#### Source Files

See [`release/rollback-drill.md`](release/rollback-drill.md) for full implementation and test file listings.

---
