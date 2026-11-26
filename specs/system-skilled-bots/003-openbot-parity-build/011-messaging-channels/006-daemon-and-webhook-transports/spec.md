---
title: "Feature Specification: Phase 6: daemon-and-webhook-transports"
description: "The two transports that need something beside this runtime: Signal through a local signal-cli daemon and WhatsApp through the Cloud API webhook on a local listener, each with its protocol, credentials, limits, retries, idempotency key and restart behavior."
trigger_phrases:
  - "daemon and webhook transports"
  - "phase 6 daemon and webhook transports"
  - "signal cli daemon transport"
  - "whatsapp cloud api webhook"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 6: daemon-and-webhook-transports

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-26 |
| **Branch** | `system-skilled-bots` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 7 |
| **Predecessor** | 005-polling-transports |
| **Successor** | 007-conformance-hardening-and-proof |
| **Handoff Criteria** | Signal and WhatsApp pass their transport tests against recorded fixtures and a local fake daemon and listener, an unsigned WhatsApp body is refused before parse, every acceptance criterion is Met and `validate.sh --strict` prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the messaging channels phase parent. It builds its two modules beside child 005's three, then appends to `bots.cjs` and `tests/channel-transports.vitest.ts` after child 005 has.

**Scope Boundary**: `channel-signal.ts`, `channel-whatsapp.ts`, two rows in `listen`'s transport table and two `describe` blocks in the shared test file. Every rule child 005 states for a transport holds here unchanged: REQ-014 for tokens, REQ-022 for the untrusted block and REQ-029 for the goldens.

**Dependencies**:
- Children 003, 004 and 005: the contract, the index, the queue, `listen` and the shared test file
- `../002-adapter-and-record-contracts/design/inbound-sequence.md` sections 4 and 5, `records.md` sections 1.1 and 5 and `operator-runbook.md` sections 4 and 5
- `contracts/refusals.md` section 3.10, for `channel-signature` and `channel-daemon-unreachable`

**Deliverables**:
- `channel-signal.ts`: the SSE event loop, the JSON-RPC send and the `/api/v1/check` probe
- `channel-whatsapp.ts`: the local listener, the signature check before parse, the handshake and the Graph send
- The `signal` and `whatsapp` rows of `listen`
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Signal has no hosted bot API, so a bot speaks through a `signal-cli` daemon the operator runs. WhatsApp delivers only to a public HTTPS webhook, so a forged body is the first thing an exposed listener will see. Both differ from the polling transports in what they acknowledge and in what a restart can lose.

### Purpose
Two transports with every wire fact fixed and cited, where an unsigned body is never parsed and a send whose outcome is unknown is never repeated.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

Taken on 2026-11-26 in this worktree.

```text
$ rg -n 'pub\(super\) const MAX_WEBHOOK_BYTES' specs/system-skilled-bots/context/tinychannels-main/src/providers/whatsapp/ingress.rs
27:pub(super) const MAX_WEBHOOK_BYTES: usize = 2 * 1024 * 1024;
$ rg -n 'GRAPH_VERSION: &str' specs/system-skilled-bots/context/tinychannels-main/src/providers/whatsapp/api.rs
13:pub(super) const GRAPH_VERSION: &str = "v23.0";
$ ls .skilled/skills/system-skilled-bots/runtime/lib/channel-signal.ts; echo "exit=$?"
ls: .skilled/skills/system-skilled-bots/runtime/lib/channel-signal.ts: No such file or directory
exit=1
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:wire -->
### Wire Table

| Transport | Protocol | Auth | Rate limits | Retries | Idempotency key | Restart |
|-----------|----------|------|-------------|---------|-----------------|---------|
| `signal` | HTTP to a local `signal-cli daemon --http` at `127.0.0.1:8080` (`../002-adapter-and-record-contracts/design/records.md` section 1.1). Events arrive as Server-Sent Events from `/api/v1/events` [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/signal/listener.rs:89-104]. A send is a JSON-RPC 2.0 `send` call on `/api/v1/rpc` with a fresh UUID as its id [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/signal/outbound.rs:388-397] | No token. The daemon holds the account, and the secret `<secret>` holds its E.164 number, sent as the `account` parameter [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/signal/listener.rs:89-90]. The daemon listens on loopback only | Signal's own limits are not stated in the reference. A send error whose text names a rate limit is retryable [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/signal/outbound.rs:50-58]. 2,000 characters per message (`../002-adapter-and-record-contracts/design/capabilities.md` section 2) | The event stream reconnects after 2 s, doubling to at most 60 s [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/signal/listener.rs:94-133]. A send retries by the queue's backoff. A daemon that does not answer refuses `channel-daemon-unreachable` and the entry stays queued | Inbound `<source number>:<timestamp>` [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/signal/inbound.rs:428]. The JSON-RPC id is per call and is not an idempotency key, so an uncertain send is `unknown` and never repeated | No acknowledge exists. Whether the daemon keeps events for a disconnected client is UNKNOWN (`../002-adapter-and-record-contracts/design/inbound-sequence.md` section 4), so a message sent while `listen signal` is down may be lost |
| `whatsapp` | The Cloud API webhook: Meta `POST`s to the operator's public HTTPS URL, which forwards to a local listener at `127.0.0.1:8787`. A send is a Graph `v23.0` call to `/<phone_number_id>/messages` [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/whatsapp/api.rs:13-16] | The access token under `<secret>` as a bearer header [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/whatsapp/api.rs:81]. Every body is checked as HMAC-SHA256 of its raw bytes with the app secret under `<secret>-app-secret`, in constant time, before any parse [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/whatsapp/ingress.rs:33-50]. The handshake checks `<secret>-verify-token`, and `<secret>-phone-number-id` names the one number served | Meta's own send limits are not stated in the reference. A body is at most 2 MiB [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/whatsapp/ingress.rs:26-27]. 4,096 characters per message | Meta retries a delivery until it sees a 2xx [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/whatsapp/ingress.rs:10-11]. On a send, a `4xx` other than `408` left the account untouched [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/whatsapp/api.rs:48-58]: `429` retries by the queue's backoff and any other is `failed`. A `5xx`, a `408` or a lost response is `unknown` | Inbound the message's `wamid` [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/whatsapp/ingress.rs:10-11]. Outbound the queue key | A body Meta saw no 2xx for is posted again, and the seen record drops every message already taken. The listener answers `200` only after steps 2 to 6 ran for every message in the body |
<!-- /ANCHOR:wire -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Build the Signal transport against a local `signal-cli` daemon on loopback.
- Build the WhatsApp transport: a loopback listener with the signature check before parse, the size bound, the handshake, one served number and the Graph send.
- Add the `signal` and `whatsapp` rows to `listen`.

### Out of Scope
- Running or registering `signal-cli` - the operator does, by the runbook.
- A public URL or a tunnel for WhatsApp - the operator's, by the runbook. The listener binds loopback only.
- The WhatsApp Web linked-device client - it needs a paired phone session.
- Signal groups and WhatsApp groups - `groupKnown` is undeclared on both (`../002-adapter-and-record-contracts/design/capabilities.md` section 2).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skilled-bots/runtime/lib/channel-signal.ts` | Create | SSE events, JSON-RPC send, the probe |
| `.skilled/skills/system-skilled-bots/runtime/lib/channel-whatsapp.ts` | Create | The listener, signature, size bound, handshake, served number and Graph send |
| `.skilled/bin/bots.cjs` | Modify | Two rows in `listen`'s transport table, after child 005 |
| `.skilled/skills/system-skilled-bots/runtime/tests/channel-transports.vitest.ts` | Modify | Two `describe` blocks after child 005's |
| `.skilled/skills/system-skilled-bots/runtime/tests/fixtures/channels/` | Modify | Recorded Signal and WhatsApp bodies, invented data only |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids keep their pre-expansion numbers and are unique across children 003 to 007, as `../spec.md` section 4 maps them. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-011 | Signal follows the `signal` row of the Wire Table: it talks to a local `signal-cli daemon --http` on loopback, receives events over SSE from `/api/v1/events`, sends through JSON-RPC `send` on `/api/v1/rpc`, cuts text at 2,000 characters and needs no public URL. A daemon that does not answer refuses `channel-daemon-unreachable` and keeps the queue entry |
| REQ-012 | WhatsApp follows the `whatsapp` row of the Wire Table: the listener binds `127.0.0.1:8787`, refuses a body over 2 MiB with `413` before the signature is computed, checks `X-Hub-Signature-256` over the raw bytes before any parse and answers a missing, malformed or wrong signature with `401` and the local reason `channel-signature`, the same for all three, drops a delivery for any number but the served one and answers `200` only after every message in the body ran steps 2 to 6 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-026 | `bots channel listen signal` takes its lease, resolves the account secret, calls `/api/v1/check` once and prints `bots: signal ready as <account>` on stderr before it opens the event stream. A check that does not answer `200` refuses `channel-daemon-unreachable` with exit 4 and releases the lease |
| REQ-027 | `bots channel listen whatsapp` takes its lease, resolves all four secrets before it binds, binds loopback only and prints `bots: whatsapp listening on 127.0.0.1:8787` on stderr. A `GET` with `hub.mode=subscribe` and the stored verify token echoes `hub.challenge` with `200` and logs `bots: whatsapp webhook verified`, and any other `GET` answers `403`. A missing secret refuses `secret-unknown` with exit 4 before the bind |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A Signal event fixture yields one queued request and a replay yields nothing new
- **SC-002**: An unsigned WhatsApp body answers `401` and a test spy on the parser records no call
- **SC-003**: A signed body with two messages answers `200` after both seen records exist
- **SC-004**: Child 005's `token`, `injection` and `golden` cases pass for both new transports
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The operator's `signal-cli` daemon | No Signal messages | The probe refuses `channel-daemon-unreachable` and the runbook's preflight |
| Risk | Events lost while the Signal client is down | A message reaches no bot | UNKNOWN, recorded and the runbook tells the operator |
| Risk | A forged WhatsApp body | A bot acts on it | Signature before parse, constant time, the same answer for every failure |
| Risk | The listener is reachable from the network | Anyone can post to it | It binds loopback only, and the operator's tunnel is the public side |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The listener reads at most 2 MiB per body and computes one HMAC per body

### Security
- **NFR-S01**: No byte of an unsigned body reaches a JSON parser
- **NFR-S02**: Both transports bind or connect to loopback addresses only

### Reliability
- **NFR-R01**: A WhatsApp body is answered `200` only after its messages are durable, so Meta's redelivery covers any stop
- **NFR-R02**: A Signal send with an unknown outcome is never repeated
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a signed body with only `statuses` entries answers `200` and enqueues nothing
- Maximum input: a 2 MiB plus one byte body answers `413` before its signature is computed
- Failure path: a daemon restart mid-stream reconnects after 2 s, then 4 s, up to 60 s
- A body for another `phone_number_id`: dropped, then `200`, so Meta stops retrying it
- A wrong verify token on the handshake: `403`
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Two transports and two appends |
| Risk | 15/25 | A public webhook and a send with no idempotency key at the provider |
| Research | 6/20 | The design children and the Wire Table fix the facts |
| **Total** | **31/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does signal-cli keep events for a disconnected client? UNKNOWN, with the manual run that confirms it in `../002-adapter-and-record-contracts/design/inbound-sequence.md` section 4.
- Is a WhatsApp `429` retried? Decision: yes, by the queue's backoff, because a `4xx` other than `408` left the account untouched. The reference marks it not retryable, and this design is stricter only about `5xx`.
- Where do the Signal and WhatsApp addresses live? Decision: fixed in `../002-adapter-and-record-contracts/design/records.md` section 1.1, because `contracts/records.md` section 11 has no key for them. The parent spec section 8 asks for keys.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent Spec**: `../spec.md`
- **Design children**: `../001-channel-ux-and-message-map/design/`, `../002-adapter-and-record-contracts/design/`
- **Sibling**: `../005-polling-transports/`
