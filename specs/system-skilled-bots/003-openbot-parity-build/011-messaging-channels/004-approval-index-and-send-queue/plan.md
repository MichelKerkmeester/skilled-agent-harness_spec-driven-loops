---
title: "Implementation Plan: Phase 4: approval-index-and-send-queue"
description: "channel-approval.ts and channel-queue.ts side by side, then the channel targets in delivery.ts and the list, send and drain verbs, all proved against child 003's fake transport."
trigger_phrases:
  - "approval index plan"
  - "send queue plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 4: approval-index-and-send-queue

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript on Node 22 or later, CommonJS for the CLI |
| **Framework** | None. `node:crypto` for the key hashes |
| **Storage** | `channels/approvals.json` and one file per entry in `channels/queue/`, each `schemaVersion: 1` |
| **Testing** | vitest with `temporaryStateRoot` and the fake transport of `tests/channel-support.ts` |

### Overview
`delivery.ts` stays the one place a run's outcome leaves the runner. It gains four channel names and, for a channel target, builds the message with its choice block, checks it and hands it to `channel-queue.ts` as a `queued` file. `bots channel drain` walks the due entries. For an entry carrying an item id it has `channel-approval.ts` write the index entry, then marks the entry `sending` and calls the transport. A press or a reply comes back through `channel-approval.ts`, which resolves the item and the choice from the index alone.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `test -f .skilled/skills/system-skilled-bots/runtime/lib/channel.ts` exits 0, child 003's first wave
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run` prints a `Test Files` line with no `failed` count

### Definition of Done
- [ ] All acceptance criteria met
- [ ] The whole suite and the typecheck pass
- [ ] `validate.sh --strict` on this folder prints `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A durable outbox with a derived index: every message is a file before it is sent, and every press resolves from a file.

### Key Components
- **`channel-approval.ts`**: imports `channel`, `needs-you` and `state-root` (`contracts/runtime-architecture.md` section 1.2). It writes and reads the index, derives the action id with a 1-based index, removes an expired entry on read, refuses a group conversation, counts `notApprover` and parses a reply by the grammar of child 001. The action id follows the reference's `approval-v1` form [SOURCE: specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-bus/src/channel/event.rs:14-24], with a 1-based index where the reference counts from 0.
- **`channel-queue.ts`**: imports `channel`, `state-root` and `run-record`. It creates an entry with the exclusive flag, walks due entries, moves states forward, applies the backoff and writes `unknown` to the run record's delivery entry. The backoff values are the reference's [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/delivery/policy.rs:11].
- **`delivery.ts`**: the four channel names, the choice block and the queue entry.
- **`list`, `send` and `drain`** in `bots.cjs`, after child 003's verbs. The `drain` verb is the one caller that joins the modules: it takes the due entries from `channel-queue.ts`, has `channel-approval.ts` write the index entry for one carrying an item id, has `channel-queue.ts` mark it `sending` and calls the channel's transport from the transport table `listen` uses. `channel-queue.ts` may import only `channel`, `state-root` and `run-record` (`contracts/runtime-architecture.md` section 1.2), so the loop cannot live there. Children 005 and 006 fill the table, and until they do a due entry for a channel with no transport stays `queued`.

### Data Flow
A run parks with the target `telegram:81234567`. `delivery.ts` builds the M01 text, runs the literal check over all of it and writes `notice-<runId>-telegram`. `bots channel drain` finds it due, `channel-approval.ts` writes `prompts.<itemId>`, the entry goes `sending`, the transport sends and the entry ends `delivered`, `failed` or `unknown`, which `channel-queue.ts` also writes to the run record. A press later resolves `approval-v1:<itemId>:2` from the index and calls `answerItem` with the linked actor and the surface `channel`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `lib/delivery.ts` | Sends the desktop notice and records each target's state | update - four channel names and the queue entry | `rg -n "DELIVERY_CHANNELS = \['desktop', 'telegram', 'slack', 'signal', 'whatsapp'\]" .skilled/skills/system-skilled-bots/runtime/lib/delivery.ts` prints one line |
| `bin/bots.cjs` | The `channel` group from child 003 | update - `list`, `send` and `drain` | `node .skilled/bin/bots.cjs channel --help </dev/null` names all three |
| `bots status` | Shows each run's delivery state | unchanged code, a channel entry can now read `unknown` | `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/channel-queue.vitest.ts -t "run record"` prints one passing test |

Required inventories:
- Same-class producers of the queue: `rg -n 'channels/queue|enqueueChannel' .skilled/skills/system-skilled-bots/runtime --glob '*.ts'` names one writer, `channel-queue.ts`.
- Same-class producers of the index: `rg -n 'approvals.json' .skilled/skills/system-skilled-bots/runtime --glob '*.ts'` names one writer, `channel-approval.ts`.
- Algorithm invariant: no prompt text reaches a queue file before the literal check has passed over its title, body and choice block.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup confirms child 003's handoff and reads the reference queue and action id. Implementation writes the two modules side by side, then `delivery.ts`, then the verbs, then the tests. Verification runs the tests, the suite, the typecheck, one drain on a temporary state root and the validator.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The index: restart, expiry, group, grammar, counter | `npx vitest run tests/channel-approval.vitest.ts` |
| Unit | The queue: exclusive create, backoff, `unknown`, the run record | `npx vitest run tests/channel-queue.vitest.ts` |
| Integration | The delivery hook end to end with the fake transport, and the three verbs | `npx vitest run tests/channel-queue.vitest.ts -t "delivery"` and `tests/cli-channel.vitest.ts` |
| Manual | One empty drain on a temporary state root | `tasks.md` T020 |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Child 003 wave 1 | Internal | Planned | Nothing compiles |
| Child 003 `channel-link.ts` | Internal | Planned | `list` has no linked count and `send` no link check |
| Phase 006's `deny` rule | Internal | Yellow | A `no` would be recorded `once` |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a prompt is sent twice, or a press answers the wrong option.
- **Procedure**: revert this child's commit. `DELIVERY_CHANNELS` returns to `desktop`, so a channel target records `channel-unsupported` again (`contracts/refusals.md` section 3.10). Delete `channels/queue/` and `channels/approvals.json` on any host that ran it.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Child 003 wave 1 | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Children 005 and 006, which send through the queue |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:external-orchestration -->
## 8. External orchestration

The executor roster, the effort policy, the fallback ladder, the dispatch rules and the self-invocation guards are `../003-link-roster-and-answer-gate/plan.md` section 8. This child adds one wave table. `bots.cjs` is edited only after child 003's wave 3 has landed, and `tests/cli-channel.vitest.ts` only after child 003's wave 4.

| Wave | Task ids | Files | Executor | Effort | Workers | Verify |
|------|----------|-------|----------|--------|---------|--------|
| 0 | T001 to T004 | none, reads | `cli-pi` | `--thinking high` | 1 | The setup checks |
| 1 | T005 to T008 | `lib/channel-approval.ts`, `lib/channel-queue.ts` | `cli-pi` | `--thinking max` | 2 | T005 to T008 and the typecheck |
| 2 | T009, T010 | `lib/delivery.ts`, `bin/bots.cjs` | `cli-pi` | `--thinking max` | 2 | T009, T010 and the typecheck |
| 3 | T011 to T013 | the three test files | `cli-pi` | `--thinking high` | 3 | Each file prints no `failed` |
| 4 | T014 to T021 | none | the orchestrator | none | 1 | T014 to T021 |
<!-- /ANCHOR:external-orchestration -->
