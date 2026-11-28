---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "polling transports implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/011-messaging-channels/005-polling-transports"
    last_updated_at: "2026-11-28T14:30:00Z"
    last_updated_by: "unit-orchestrator-011-005"
    recent_action: "Built and verified the three polling transports and bots channel listen"
    next_safe_action: "Merge the unit branch, then open child 006"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-polling-transports"
      parent_session_id: null
    completion_pct: 100
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
| **Spec Folder** | 005-polling-transports |
| **Completed** | 2026-11-28 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A person can now answer a bot from Telegram, from Slack or from the terminal. `bots channel listen telegram` long-polls with no public URL, `bots channel listen slack` holds one outbound Socket Mode connection, and `bots channel listen terminal` reads piped or typed lines with no tty.

### Phase 5: polling-transports

You get three transports on the adapter contract. Each one runs the inbound order in the module itself: the seen record drops a redelivery, the link record refuses a stranger in silence, an unlinked direct chat pairs by its code, a press or a matching reply goes through the approval index to `answerItem` on the surface `channel`, and any other line must start with `@<bot-id>` or it gets the M22 reply. An addressed line becomes one request whose prompt is the escaped `<conversation channel="...">` block with the address stripped, whose event id is `<channel>:<messageId>` and whose `delivery` is `<channel>:<chatId>`, so the run's prompt and outcome reach the chat that asked. The acknowledge, the offset move and the `envelope_id` echo all happen after the seen record. Every token is read through the vault at each probe, poll, connect and send, held in one call and passed through `redactToken`. A send sorts its error three ways, so the queue resends only what cannot have landed. `listen` takes the lease, runs the start probe, prints the ready line and runs one drain pass for its own channel after each inbound turn and on a 60 second tick. `bots channel drain` and `send` now build the same transports from the channel config, so a queued Telegram or Slack message leaves without a listener.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skilled-bots/runtime/lib/channel-telegram.ts` | Created | `getUpdates` long polling with the offset rule, `deleteWebhook` and `getMe` at the probe, `answerCallbackQuery` on receipt, the inline keyboard, the 4,096-byte cut and the three-way error rule |
| `.skilled/skills/system-skilled-bots/runtime/lib/channel-slack.ts` | Created | `auth.test` then `apps.connections.open`, the socket loop with the reconnect after 2 s, the acknowledge after the seen record, Block Kit with five buttons per block, the escape and the 3,900 and 3,000 character cuts that never split an entity |
| `.skilled/skills/system-skilled-bots/runtime/lib/channel-terminal.ts` | Created | stdin lines, the newest open prompt answered by the OS user on `channel`, the 010 chat path and the 60 s list refresh |
| `.skilled/bin/bots.cjs` | Modified | `channel listen` with `LISTEN_TRANSPORTS`, the lease, the probe line, the drain pass and the stop on a signal, plus the real send table for `channel drain` and `channel send` |
| `.skilled/skills/system-skilled-bots/runtime/tests/channel-transports.vitest.ts` | Created | Sixteen tests in the `transport telegram`, `transport slack`, `transport terminal` and `transport shared` blocks |
| `.skilled/skills/system-skilled-bots/runtime/tests/fixtures/channels/` | Created | Seventeen recorded Telegram and Slack bodies, invented data only |
| `design/wire-notes.md` | Created | The Telegram and Slack wire facts in this plan's own words, one source per fact, written by the one worker that read the reference |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Fifteen Vibe workers on `deepseek-flash` wrote every file, and none needed the `cli-pi` fallback. Wave 0 ran three side by side: the wire notes (Telegram, then Slack in a second brief), the terminal transport and the fixtures. The terminal and the fixtures moved up from waves 1 and 2, because neither reads the wire notes. Wave 1 wrote the Telegram transport as soon as its half of the notes passed, then its press handling in a second brief, and the Slack transport once the Slack half passed. Wave 2 wrote `listen`, a follow-up that fixed its cleanup and the send table in one slot, and the test file in five sequential briefs in the other: the terminal block, the first shared tests, then the Telegram, Slack and remaining shared tests after `listen` passed. The follow-up came from the orchestrator's own read of `listen`: its `finally` called `removeListener` on an `AbortSignal`, which has none, so a signal-stopped run would have exited 1. The orchestrator ran every verify command itself after each brief, then every acceptance filter, the whole suite, the typecheck, the crate tests and T019 on a temporary state root.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Each transport carries the inbound pipeline itself, written from one shared brief | The import edges let a transport reach only the eight modules its row names and no sibling transport, so a shared pipeline module would be a new module the architecture does not list. One brief text kept the two copies the same |
| The terminal's reply target is `terminal:<os-user>` and its 010 conversation file is `terminal-<os-user>` | A conversation id must be a safe path segment, and the colon of `terminal:<os-user>` is not one. The request carries no `delivery`, because a `terminal` target would be recorded as an unsupported channel and the reply already reaches the terminal through the chat path |
| An unaddressed terminal line goes to the checkout's one bot, and gets M22 when there are none or several | AC-015 and T019 pipe a bare `hello`, while REQ-035 refuses an unaddressed message. The rule follows the terminal screen's bot picker, which chooses the one bot when only one is listed |
| T008's verify names `enqueueFromCheckout` instead of `enqueueRequest` | `enqueueRequest` takes a built request record, and building one needs `request-record.ts`, which the transport edges forbid. `enqueueFromCheckout` is the call `bots chat` makes |
| Each transport exports its own `BOT_UNKNOWN_REPLY` holding the M22 text | M22 is not in the `channel.ts` reply table, which this child may not edit. The golden test checks all three copies against the golden |
| `listen` clears the webhook at the probe, and the transport reads `parameters.retry_after` on a 429 | REQ-024 requires both. The wire notes record that the reference calls `deleteWebhook` only after a 409 and reads no wait. The plan wins, because it is the design and the reference is evidence |
| A Slack token counts as rejected on HTTP 401 or 403 or the codes `invalid_auth`, `not_authed`, `account_inactive`, `token_revoked` and `token_expired` | The wire notes show the reference maps twelve codes to one forbidden error. Only these five say the credential itself is bad, and the rest fail the probe with their own detail |
| `bots channel drain` and `send` build the real Telegram and Slack transports when the CLI passes its marker table | A queued message would otherwise wait for a listener forever. A test still gets exactly the table it passes |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm test` in the runtime | PASS: `Test Files  56 passed (56)`, `Tests  758 passed (758)`, exit 0. The floor is 55 files and 742 tests, so this unit adds one file and sixteen tests and loses none |
| `npm run typecheck` | PASS: exit 0 |
| `cargo test --locked --manifest-path .skilled/crates/bots-tui/Cargo.toml` | PASS: exit 0, 120, 24, 8, 2, 53 with 1 ignored, 1 and 16, the same as the floor. This unit writes no crate file |
| Every acceptance filter | PASS: all sixteen printed `Tests  1 passed`, and `-t "^transport "` printed `Tests  16 passed (16)` |
| T019 on a temporary state root | PASS with a checkout `bots/config.json` naming `acme/widgets`: the M22 line and `exit=0`. The literal command exits 4 `identity-unknown` |
| CHK-011, CHK-012, CHK-022 | PASS: the three transports import only the eight allowed modules, no ephemeral label in any of them, no `https://` in the test file |
| Token readers | `resolveSecret` is called three times in `channel-telegram.ts` and five in `channel-slack.ts`, and nothing writes a value |
| Temp folders | The transport test file leaves no `bots-*` folder, measured before and after a run of it alone |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A Slack typed message redelivered with a new `envelope_id` would start a second run.** Whether Slack keeps the id across a reconnect is still UNKNOWN, because settling it needs a live workspace. A press is covered either way: a second press reaches the duplicate path, replies M08 and records no second answer. The request queue's own seen marker keys on the event id, which holds the `envelope_id`, so it does not catch a new one.
2. **T019 as written cannot pass.** It relies on `SKILLED_BOTS_IDENTITY`, which the CLI drops because it resolves identity under the job environment, the limit 011.003 and 011.004 recorded. Run it with a checkout `bots/config.json` naming the identity.
3. **A chat message is not checked for a stored secret before it becomes a request prompt.** The 010 chat path refuses `body-secret`, and the terminal keeps that check, but the Telegram and Slack pipelines reach no known-secret map within their import edges. No requirement names the check for a channel.
4. **`listen` runs on a channel whose config entry is switched off.** `bots channel unlink` sets `enabled: false`, and no requirement says `listen` refuses it, so it does not.
5. **Lines outside this folder need their owners.** `contracts/refusals.md` section 3.10 has no row for `channel listen` failing its probe on a network error, which prints `bots: <channel> probe failed: <detail>` and exits 1. The Wire Table's Telegram row says the reference clears any webhook first, while the reference does so only after a 409. `tests/fixtures/README.md` does not list the new `channels/` folder.
<!-- /ANCHOR:limitations -->

---
