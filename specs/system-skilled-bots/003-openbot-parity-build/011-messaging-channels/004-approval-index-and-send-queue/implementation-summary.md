---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "approval index and send queue implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/011-messaging-channels/004-approval-index-and-send-queue"
    last_updated_at: "2026-11-26T00:00:20Z"
    last_updated_by: "template-author"
    recent_action: "Initialized Level 2 template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-004-approval-index-and-send-queue"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-approval-index-and-send-queue |
| **Completed** | 2026-11-28 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A parked run whose target is a chat now leaves one file in `channels/queue/` instead of a `channel-unsupported` entry, and `bots channel drain` writes the prompt's approval index entry before it sends. A press or a typed reply then resolves from `channels/approvals.json` alone, so a restart loses no prompt, and a send that may have landed is recorded `unknown` and never sent again.

### Phase 4: approval-index-and-send-queue

You get the approval index with its derived `approval-v1:<item-id>:<index>` action id, the expiry that refuses a late press with M15, the group refusal with M16, the `notApprover` counter and the reply grammar, with `N` mapped to `no` before the answer call so a refusal is recorded `deny`. You get the durable send queue: an exclusive create under the idempotency key, forward-only states, the backoff ladder with the provider's own wait, `unknown` for any send that may have landed and the terminal state written back to the run record. `delivery.ts` names the four chat channels, appends the choice block and runs the literal check over the text form before anything is queued, and picks the button form only where the channel draws buttons and every label fits. `bots channel list`, `send` and `drain` run through one in-process `runChannelVerb(argv, transports, io)`, so a test hands it a fake transport table.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skilled-bots/runtime/lib/channel-approval.ts` | Created | The index, the action id, `writePromptEntry`, `removePromptEntry`, `countNotApprover`, `answerFromChat` with an injected answer call, the reply grammar and M23 |
| `.skilled/skills/system-skilled-bots/runtime/lib/channel-queue.ts` | Created | The entry shape, the keys, `promptForm`, `enqueueChannel`, `drainQueue` with injected index hooks, the backoff and M21 |
| `.skilled/skills/system-skilled-bots/runtime/lib/delivery.ts` | Modified | The four channel names, the choice block under the literal check, a chat target as a queue entry and the reply target joining the declared targets |
| `.skilled/bin/bots.cjs` | Modified | `runChannelVerb`, the memoized runtime load, the empty transport table and `list`, `send` and `drain` |
| `.skilled/skills/system-skilled-bots/runtime/lib/runner.ts` | Modified, outside the Files to Change table | The queued request's `delivery` reaches `resolveDeliveryEntries` as the reply target |
| `.skilled/skills/system-skilled-bots/runtime/lib/request-drain.ts` | Modified, outside the table | Passes `request.delivery` into the queued run request |
| `.skilled/skills/system-skilled-bots/runtime/tests/channel-approval.vitest.ts` | Created | Seven tests |
| `.skilled/skills/system-skilled-bots/runtime/tests/channel-queue.vitest.ts` | Created | Nine tests |
| `.skilled/skills/system-skilled-bots/runtime/tests/cli-channel.vitest.ts` | Modified | Four tests in the `list`, `send` and `drain` blocks |
| `.skilled/skills/system-skilled-bots/runtime/tests/delivery.vitest.ts` | Modified, outside the table | The unknown-channel example moves from `slack:ops` to `email:ops`, because slack is now a channel |
| `.skilled/skills/system-skilled-bots/scripts/fixtures/delivery-channel-unknown/bots/nightly-digest/BOT.md` | Modified, outside the table | The same move, so the checker still sees an unknown channel |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Fifteen workers wrote the code in three internal waves. Wave 0 was the four setup reads, run by the orchestrator. Wave 1 ran two Vibe slots side by side, three sequential briefs for `channel-approval.ts` and two for `channel-queue.ts`. Wave 2 ran Vibe on `delivery.ts`, two sequential briefs on `bots.cjs`, the two fixup lines, the runner plumbing and one follow-up on `channel-approval.ts` that keeps a typed line on Telegram a chat message. The first `delivery.ts` brief passed its greps but kept the early local-only return, which dropped a reply target, so its one retry ran on `cli-pi` at `llmgateway/deepseek-v4.1-flash-1017` with thinking at max and fixed it. Wave 3 ran the three test files on Vibe in parallel. The orchestrator ran every verify command after each wave, then the whole runtime suite, the typecheck, the crate tests, every acceptance filter and T020 on a temporary state root.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The drain loop lives in `channel-queue.ts` and takes `beforeSend` and `afterFailed` hooks, which `bots.cjs` fills from `channel-approval.ts` | The queue may not import the approval module, and the transports of children 005 and 006 need the same pass `bots channel drain` runs, so the loop is typed and shared while `bots.cjs` stays the caller that joins the two modules |
| `answerFromChat` takes the answer call as an argument | `channel-approval.ts` may not import `answer.ts`, and the module still owns removing the entry after an answer and counting `notApprover` after `answer-not-approver` |
| `runChannelVerb(argv, transports, io)` takes a third argument with `env`, `stdout` and `stderr` | Without it an in-process test resolves the vitest process environment and writes the real state root |
| The reply target is the queued request's `delivery` field and joins the definition's targets, even for a local-only bot | The request already carries the hint and nothing read it. A chat-started run that answered no one would leave the asker with no prompt |
| A send error whose `kind` is `channel-daemon-unreachable` returns the entry to `queued` with its attempt unspent and stops the pass with exit 4 | `contracts/refusals.md` section 3.10 says the queue keeps the entry, and no later entry could reach an unreachable transport |
| Two delivered prompts make a bare number, `YES` or `NO` answer nothing | reply-grammar.md section 1 and the M23 rule name all three. The spec names a number or `YES`, and answering a `NO` against a guessed prompt would record a refusal the person did not mean |
| A typed line on a buttons channel is a chat message unless the prompt went out in the text form | Telegram always draws buttons, and REQ-008 gives the grammar only to Signal, WhatsApp, the terminal and the one Slack case |
| `channel send` on a text holding a known secret refuses `channel-send-secret`, exit 4 | The verb runs the literal check before the file is written, and no existing refusal name fits a send |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm test` in the runtime | PASS: `Test Files  51 passed (51)`, `Tests  654 passed (654)`, exit 0. The floor after 008 is 49 files and 634 tests, so this unit adds 2 files and 20 tests and loses none |
| `npm run typecheck` | PASS: exit 0 |
| `cargo test --locked --manifest-path crates/bots-tui/Cargo.toml` | PASS: exit 0, 120, 24, 8, 2, 53 with 1 ignored, 1 and 16, the same as the floor |
| Every acceptance filter | PASS: all twenty filters printed one passed test, observed 2026-11-28 |
| T020 on a temporary state root | PASS with a checkout `bots/config.json` naming `acme/widgets`: `exit=0`. The literal command exits 4 `identity-unknown` |
| File modes | `approvals.json` and a queue entry are 0600 and `channels/queue/` is 0700, observed with `statSync` |
| CHK-011, CHK-012, CHK-022 | PASS: `delivery.ts` imports only `channel-queue.js` among the channel modules, no ephemeral label in either module, no socket call in either new test file |
| Temp folders | The three channel test files leave 0 `bots-*` folders, measured before and after a run of them alone. The whole suite left 253 on this run and 200 on the baseline run, all from files this unit did not touch |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **T010, T020 and CHK-040 as written cannot pass.** Each relies on `SKILLED_BOTS_IDENTITY`, which the CLI drops because it resolves identity under the job environment, the same limit 011.003 recorded for its T024. Run them with a checkout `bots/config.json` naming the identity.
2. **CHK-050 is not met as written.** Four files outside the Files to Change table changed: `runner.ts` and `request-drain.ts` carry the reply target, which no file in the table could reach, and `delivery.vitest.ts` and the `delivery-channel-unknown` fixture used `slack` as their unknown channel.
3. **Four contract lines disagree with the code and need their owners.** `contracts/refusals.md` section 3.10 says the drain exits 1 while an entry stays queued, while F-062 and REQ-034, which the code follows, say only `failed` or `unknown` does. The section also lacks `channel-approvals-invalid`, `channel-send-secret`, `queue-key-invalid`, `queue-entry-invalid` and `reply-ambiguous`. The message catalog places M23 in the `channel.ts` table and says `channel-approval.ts` builds the choice block, while M23 lives in `channel-approval.ts` and `delivery.ts` builds the block, because of the import rules. The spec edge case "a reply of 2 when two prompts are open answers the newer one" contradicts F-020 and AC-008, which the code follows.
4. **Production chat runs still need a writer of the reply target.** `runner.ts` now reads `request.delivery`, and child 005 must set it to `<channel>:<chatId>` when it enqueues a chat request.
5. **A notice key names one chat per channel and run.** A bot with two targets on one channel queues the first and records the second `not-attempted` with `queue-key-taken`, because the key `notice-<runId>-<channel>` is frozen.
6. **Two drains at once may mark each other's in-flight send `unknown`.** The direction is safe, because `unknown` is never resent. An entry held by a failing `beforeSend` stays `queued` and shows in `queueDepth`.
<!-- /ANCHOR:limitations -->
