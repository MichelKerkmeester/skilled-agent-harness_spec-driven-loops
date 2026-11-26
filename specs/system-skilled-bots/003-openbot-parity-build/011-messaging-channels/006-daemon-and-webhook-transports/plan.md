---
title: "Implementation Plan: Phase 6: daemon-and-webhook-transports"
description: "Signal and WhatsApp on the contract of channel.ts, built beside child 005's transports against a fake loopback daemon and recorded webhook bodies, then two rows in listen and two blocks in the shared test file."
trigger_phrases:
  - "signal whatsapp transport plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 6: daemon-and-webhook-transports

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript on Node 22 or later. `fetch` for the Graph API and the JSON-RPC calls, `node:http` for the listener, `node:crypto` `timingSafeEqual` for the signature |
| **Framework** | None. No package is added |
| **Storage** | The seen records, the lease and the queue of children 002 to 004 |
| **Testing** | vitest. The Signal tests run a fake daemon on an ephemeral loopback port, and the WhatsApp tests post recorded bodies to the listener on an ephemeral loopback port |

### Overview
Both modules keep child 005's shape: an inbound loop that runs the seven steps of child 002, a send that takes a due queue entry and a probe. Signal has no acknowledge, so its step 7 is skipped. WhatsApp's acknowledge is the HTTP answer, so the handler awaits steps 2 to 6 for every message before it writes `200`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `test -f .skilled/skills/system-skilled-bots/runtime/lib/channel-queue.ts` exits 0, child 004
- [ ] Child 005's wave 2 has landed before this child's wave 2 edits `bots.cjs`

### Definition of Done
- [ ] All acceptance criteria met
- [ ] The whole suite and the typecheck pass
- [ ] `validate.sh --strict` on this folder prints `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
The same adapter pattern as child 005, with authentication as step 1 for the one provider that signs its deliveries.

### Key Components
- **`channel-signal.ts`**: the SSE reader with its 2 s to 60 s reconnect, the JSON-RPC send, the rate-limit classification and the `/api/v1/check` probe.
- **`channel-whatsapp.ts`**: the loopback listener, the size bound, the raw-byte HMAC with `timingSafeEqual` before parse, the handshake, the served-number filter, the `statuses` drop and the Graph send with the status classification of the Wire Table.
- **Two `listen` rows** in `bots.cjs`.

### Data Flow
Meta posts a body to the operator's tunnel, which forwards to `127.0.0.1:8787`. The listener reads at most 2 MiB, checks the signature on the raw bytes, then parses. Each message runs steps 2 to 6. When all are durable it answers `200`. A send takes a `whatsapp` queue entry and calls Graph with the access token, and the status decides `delivered`, `failed`, a retry or `unknown`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `bin/bots.cjs` | `listen` with child 005's three rows | update - two rows | `rg -n "signal|whatsapp" .skilled/bin/bots.cjs` names both rows |
| `tests/channel-transports.vitest.ts` | Child 005's three blocks | update - two blocks | `rg -c "^describe\\(" .skilled/skills/system-skilled-bots/runtime/tests/channel-transports.vitest.ts` prints 6 |

Required inventories:
- Parsers on the webhook path: `rg -n 'JSON.parse' .skilled/skills/system-skilled-bots/runtime/lib/channel-whatsapp.ts` names one call, after the signature check.
- Algorithm invariant: no WhatsApp `200` is written before every message of its body has a seen record.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup reads the Signal and WhatsApp references. Implementation writes the two modules beside child 005's, then the two `listen` rows and the two test blocks after child 005's. Verification runs the tests, the suite, the typecheck, the unsigned-body check and the validator.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Replay | Signal events from a fake daemon, WhatsApp bodies posted to the listener, each replayed | `-t "^transport signal follows the wire table$"` and `-t "^transport whatsapp follows the wire table$"` each print `Tests  1 passed` |
| Security | Unsigned, malformed and wrong signatures, a body over 2 MiB, the handshake | `-t "^transport whatsapp refuses an unsigned body before parse$"` and `-t "^transport whatsapp echoes the handshake challenge$"` each print `Tests  1 passed` |
| Shared | Child 005's `token`, `injection` and `golden` cases over the two new transports | `-t "^transport shared "` prints `Tests  7 passed` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Children 003 to 005 | Internal | Planned | No contract, queue, `listen` or shared test file |
| Phase 008 `resolveSecret` | Internal | Yellow | No account, token or app secret |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: an unsigned body is parsed, or a send repeats.
- **Procedure**: revert this child's commit. Stop the operator's tunnel, so Meta's posts fail and are retried later and rotate the app secret if a forged body may have been accepted.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Child 004 | Implementation |
| Implementation | Setup, and child 005's wave 2 for the two shared files | Verification |
| Verification | Implementation | Child 007 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:external-orchestration -->
## 8. External orchestration

The executor roster, the effort policy, the fallback ladder, the dispatch rules and the self-invocation guards are `../003-link-roster-and-answer-gate/plan.md` section 8. This child adds one wave table. Wave 1 may run beside child 005's wave 1. Wave 2 waits for child 005's wave 2.

| Wave | Task ids | Files | Executor | Effort | Workers | Verify |
|------|----------|-------|----------|--------|---------|--------|
| 0 | T001 to T003 | none, reads | `cli-pi` | `--thinking high` | 1 | The setup checks |
| 1 | T004 to T006 | `lib/channel-signal.ts`, `lib/channel-whatsapp.ts` | `cli-pi` | `--thinking max` | 2 | T004 to T006 and the typecheck |
| 2 | T007 to T009 | `bin/bots.cjs`, `tests/fixtures/channels/`, `tests/channel-transports.vitest.ts` | `cli-pi` | `--thinking max` | 2: the verb rows and the fixtures with the test blocks | T007 to T009 |
| 3 | T010 to T016 | none | the orchestrator | none | 1 | T010 to T016 |
<!-- /ANCHOR:external-orchestration -->
