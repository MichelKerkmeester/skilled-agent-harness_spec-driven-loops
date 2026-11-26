---
title: "Implementation Plan: Phase 5: polling-transports"
description: "Three transports on the contract of channel.ts, built side by side against recorded wire fixtures, then bots channel listen with its lease and probe, then the shared transport test file this child creates and child 006 extends."
trigger_phrases:
  - "polling transports plan"
  - "telegram slack terminal transport plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 5: polling-transports

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript on Node 22 or later. `fetch` for HTTPS, the built-in `WebSocket` for Socket Mode, `node:readline` for stdin |
| **Framework** | None. No package is added |
| **Storage** | The seen records, the lease and the queue of children 002 to 004 |
| **Testing** | vitest. Each transport takes its `fetch` and `WebSocket` as injected arguments, and the tests pass recorded fixtures |

### Overview
Each transport is one module that implements the contract and imports `channel`, `channel-link`, `channel-approval`, `channel-queue`, `conversation`, `secrets`, `answer` and `request-queue`, the edges `contracts/runtime-architecture.md` section 1.2 allows. Its inbound loop runs the seven steps of child 002, its send takes a due queue entry and returns a receipt and its probe proves the credential before the first poll. `bots channel listen` picks the transport from a table, which child 006 extends by two rows.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `test -f .skilled/skills/system-skilled-bots/runtime/lib/channel-queue.ts` exits 0, child 004
- [ ] The whole suite prints a `Test Files` line with no `failed` count

### Definition of Done
- [ ] All acceptance criteria met
- [ ] The whole suite and the typecheck pass
- [ ] `validate.sh --strict` on this folder prints `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One adapter per provider behind one contract, with every network call injected so a test replays a recorded exchange.

### Key Components
- **`channel-telegram.ts`**: the poll loop, the offset rule, the press check before emit, `answerCallbackQuery` on receipt, the inline keyboard, the byte-length cut and the probe.
- **`channel-slack.ts`**: the socket loop, the envelope acknowledge after the seen record, the reconnect, Block Kit with the escape of `&`, `<` and `>`, the character cut and the probe.
- **`channel-terminal.ts`**: the stdin loop, the grammar and the 010 chat path.
- **`listen` in `bots.cjs`**: the lease, the transport table and the probe line.

### Data Flow
A Telegram update arrives. Its `messageId` is `update:<update_id>`. A seen record means a redelivery and it is dropped. Otherwise `channel-link.ts` resolves the chat. A press resolves through `channel-approval.ts` and calls `answerItem`. Any other text is rendered through `conversation.ts` and enqueued with the event id `telegram:<messageId>`. The seen record is written, the catalog reply is queued and the offset moves on. The send path takes child 004's queue entries for `telegram` and calls `sendMessage`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `bin/bots.cjs` | The `channel` group of children 003 and 004 | update - `listen` and its transport table | `node .skilled/bin/bots.cjs channel --help </dev/null` names `listen` |
| `lib/conversation.ts` | 010's renderer | unchanged, called by the transports | `rg -n "from './conversation" .skilled/skills/system-skilled-bots/runtime/lib/channel-telegram.ts` prints one line |

Required inventories:
- Token readers: `rg -n 'resolveSecret' .skilled/skills/system-skilled-bots/runtime/lib/channel-*.ts` names each transport and nothing writes a value.
- Algorithm invariant: no acknowledge, offset move or `envelope_id` echo happens before the seen record is written.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup confirms child 004's handoff and reads the Telegram and Slack references. Implementation writes the three transports side by side, then `listen`, then the fixtures and the test file. Verification runs the transport tests, the suite, the typecheck, one terminal session and the validator.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Replay | Each transport against its recorded fixtures, including a replay of the same fixture | `npx vitest run tests/channel-transports.vitest.ts` |
| Golden | Every sent message against its golden or mockup payload | `-t "^transport shared matches every golden$"` prints `Tests  1 passed` |
| Security | The token never reaches the state root, the injection fixture stays in its block | `-t "^transport shared reads the token at every send$"` and `-t "^transport shared keeps an inbound message inside its block$"` each print `Tests  1 passed` |
| Manual | A piped terminal session on a temporary state root | `tasks.md` T019 |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Children 003 and 004 | Internal | Planned | No contract, index or queue |
| Phase 008 `resolveSecret` | Internal | Yellow | No token |
| Phase 010 `conversation.ts` | Internal | Yellow | No untrusted block and no terminal chat path |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a transport answers an item twice or a token reaches a file.
- **Procedure**: revert this child's commit. Queued entries for `telegram` and `slack` stay `queued`, and `bots channel drain` refuses them until a transport returns. Rotate any token that may have been written.
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
| Implementation | Setup | Verification and child 006's edits of `bots.cjs` and the shared test file |
| Verification | Implementation | Child 007 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:external-orchestration -->
## 8. External orchestration

The executor roster, the effort policy, the fallback ladder, the dispatch rules and the self-invocation guards are `../003-link-roster-and-answer-gate/plan.md` section 8. This child adds one wave table. Wave 1 may run beside child 006's wave 1, because the five transport modules are disjoint files. Wave 2 runs before child 006's wave 2.

| Wave | Task ids | Files | Executor | Effort | Workers | Verify |
|------|----------|-------|----------|--------|---------|--------|
| 0 | T001 to T004 | none, reads | `cli-pi` | `--thinking high` | 1 | The setup checks |
| 1 | T005 to T008 | `lib/channel-telegram.ts`, `lib/channel-slack.ts`, `lib/channel-terminal.ts` | `cli-pi` | `--thinking max` | 3 | T005 to T008 and the typecheck |
| 2 | T009 to T011 | `bin/bots.cjs`, `tests/fixtures/channels/`, `tests/channel-transports.vitest.ts` | `cli-pi` | `--thinking max` | 2: the verb and the fixtures with the test file | T009 to T011 |
| 3 | T012 to T020 | none | the orchestrator | none | 1 | T012 to T020 |
<!-- /ANCHOR:external-orchestration -->
