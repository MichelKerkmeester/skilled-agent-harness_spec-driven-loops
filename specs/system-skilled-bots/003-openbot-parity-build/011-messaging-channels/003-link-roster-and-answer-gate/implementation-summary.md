---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "link roster and answer gate implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/011-messaging-channels/003-link-roster-and-answer-gate"
    last_updated_at: "2026-11-26T00:00:19Z"
    last_updated_by: "template-author"
    recent_action: "Initialized Level 2 template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-link-roster-and-answer-gate"
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
| **Spec Folder** | 003-link-roster-and-answer-gate |
| **Completed** | 2026-11-28 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A chat can now link itself to a person with a one-time code, and an answer from a chat counts only when the `operators.json` roster names that person. `bots channel link telegram` prints `bots: telegram link code 482913, valid for 5 minutes` on the host, and `bots channel roster add ada --role owner` is the only way to write the roster.

### Phase 3: link-roster-and-answer-gate

You get one adapter contract every transport implements, with the capability matrix and an explicit unsupported result for an operation a transport does not declare. You get the pairing code, the link record that binds a chat to the actor who ran `link` and to the sender id that sent the code, and a file-backed lockout after five wrong codes. Every answer surface now passes one roster check before the item lock: on `channel` a missing roster refuses `channel-roster-missing`, on `terminal` it refuses nothing, and a present roster refuses an actor it does not name `answer-not-approver` on both. The two test helpers later children import are in place: `temporaryStateRoot` with `runBots`, and `fakeTransport`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skilled-bots/runtime/lib/channel.ts` | Created | The adapter types, the capability matrix and descriptors, the unsupported result, `readChannelConfig` and `writeChannelConfig`, `withStateLock`, `redactToken`, the seen-record and listen-lease helpers and the reply table M07 to M20 |
| `.skilled/skills/system-skilled-bots/runtime/lib/channel-link.ts` | Created | The roster with `isApprover`, `rosterAdd` and `rosterRemove`, the links file, `startLink`, `unlinkChannel`, `resolveLink` and `pairChat` with the lockout |
| `.skilled/skills/system-skilled-bots/runtime/lib/state-root.ts` | Modified | `channelFolder`, `operatorsFile`, `ensureChannelState`, `STATE_FILE_MODE` and `writeStateFile`, which chmods the temp file to 0600 before the rename |
| `.skilled/skills/system-skilled-bots/runtime/lib/answer.ts` | Modified | The required `surface` input, refused `surface-invalid` when absent, and the roster check after the actor and before the lock |
| `.skilled/bin/bots.cjs` | Modified | The `channel` verb group with `link`, `unlink` and `roster add|remove|list`, its usage lines, the child-write bar and `surface: 'terminal'` on both host answer calls |
| `.skilled/skills/system-skilled-bots/runtime/tests/channel-support.ts` | Created | `temporaryStateRoot`, `runBots` with an optional pty and `fakeTransport` |
| `.skilled/skills/system-skilled-bots/runtime/tests/channel.vitest.ts` | Created | Five tests: the unsupported result, the message model, the config entry, the reply goldens and the redaction |
| `.skilled/skills/system-skilled-bots/runtime/tests/channel-link.vitest.ts` | Created | Two tests: the lockout and the roster refusal of a linked chat |
| `.skilled/skills/system-skilled-bots/runtime/tests/answer.vitest.ts` | Modified | `surface: 'terminal'` on every existing call and four roster tests |
| `.skilled/skills/system-skilled-bots/runtime/tests/cli-channel.vitest.ts` | Created | Three `link` tests and seven `roster` tests |
| `.skilled/skills/system-skilled-bots/runtime/tests/runner.vitest.ts`, `quarantine.vitest.ts` and `resume.vitest.ts` | Modified | `surface: 'terminal'` on the one `answerItem` call in each, so the required key binds every caller |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Fifteen Vibe workers on `deepseek-flash` wrote the code in four internal waves, and none needed the `cli-pi` fallback. After 007 merged and the branch was rebased onto it, four more Vibe workers made the surface required: three named `surface: 'terminal'` on the last callers in `runner.vitest.ts`, `quarantine.vitest.ts` and `resume.vitest.ts`, then one dropped the default in `answer.ts`. Wave 1 wrote `state-root.ts` and the `channel.ts` contract side by side, then the rest of `channel.ts` beside `channel-support.ts`. Wave 2 wrote `channel-link.ts` in three sequential briefs: the roster, then the link record, then the lockout. Wave 3 wrote `answer.ts`, `bots.cjs` and a small `channel-support.ts` fix side by side. Wave 4 wrote the four test files in parallel slots, with `answer.vitest.ts` taking two sequential briefs. The orchestrator ran every verify command itself after each wave, then the whole runtime suite, the typecheck, the crate tests and T024 on a temporary state root.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| `surface` is required with no default | A bare actor name cannot say which path an answer came from, and a default of `terminal` would let a chat transport that omits it skip the missing-roster refusal. A JS caller that omits it is refused `surface-invalid`. It landed in a second commit after 007 merged, because `runner.vitest.ts` was 007's file while both units ran |
| A sender mismatch is refused `channel-unlinked` with detail `sender mismatch` | The channel message catalog section 2 makes it silent with no counter and no answer call, while the spec's edge case names `answer-not-approver`. `answerItem` never sees a sender id, so `answer-not-approver` there would trigger the M14 reply and the per-actor count the catalog rules out |
| The pending code carries a `failures` count that reads 0 when absent | The code is void after five wrong codes across every chat of the channel, and the frozen link record shape had no counter. An added key keeps the version by the versioning rule |
| `link` with no `--secret` keeps an existing entry's secret name | Linking a second chat on a configured channel would otherwise reset a custom name such as `slack-app-token` back to `slack` |
| The `channel` verbs resolve under the drain job's environment | The answer path reads the roster there, so the verbs and the answer path can never read two different rosters |
| The `channel` group refuses a bot child, except `roster list` | A bot child that linked a chat or wrote the roster could answer its own questions. This follows the CLI's own rule that each write verb joins the child bar |
| A lock that cannot be taken in 2,000 ms throws `channel-busy` | It names no new refusal for the CLI, which exits 1 on a throw, and a later child can catch it where a pass must report an entry as still due |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm test` in the runtime | PASS after the rebase onto 007: `Test Files  47 passed (47)`, `Tests  588 passed (588)`, exit 0. The floor after 007 is 44 files and 567 tests, so this unit adds 3 files and 21 tests and loses none |
| `npm run typecheck` | PASS: exit 0 |
| `cargo test --locked --manifest-path .skilled/crates/bots-tui/Cargo.toml` | PASS: exit 0, 117, 22, 8, 2, 53 with 1 ignored and 16, the same as the floor after 003.005 |
| Every caller names `surface` | PASS: a brace-matching check over `lib/`, `tests/` and `bots.cjs` counts 47 `answerItem({` calls and 0 without `surface`, and `rg "surface\?:\|\?\? 'terminal'" lib/answer.ts` exits 1 |
| T024 on a temporary state root | PASS: `roster add "$(id -un)" --role owner` exit 0, `schemaVersion` 1, then one line `bots: telegram link code 177214, valid for 5 minutes` |
| Refusals on the same root | PASS: `link` with no roster exits 4 `channel-roster-missing`, `--as mallory` with no tty exits 2 with `bots: --as needs a tty` (observed `exit=2`), a 49 character whatsapp secret exits 4 `secret-name-invalid` |
| CHK-031 and CHK-032 | `config.json`, `links.json` and `operators.json` are 0600 and `channels/` is 0700. `rg token` over the state JSON exits 1. `approvals.json` lands with child 004 |
| Every acceptance row | PASS: ten rows Met, each with its observed `Tests` line |
| CHK-011, CHK-012, CHK-022 | PASS: one relative import in `channel.ts`, no ephemeral label in either module, no socket call in any channel test |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **T024 and SC-001 as written cannot pass.** Each adds `ada` as owner and links with no `--as`, which names the OS user and is refused `answer-not-approver`. Each also relies on `SKILLED_BOTS_IDENTITY`, which the CLI drops because it resolves under the job environment. Run them with `"$(id -un)"` as owner and a checkout `bots/config.json` naming the identity.
2. **CHK-031 is 2 of 3 here.** `approvals.json` is child 004's file, so the third count waits on its T006.
3. **Four lines outside this folder need their owners.** `contracts/records.md` section 12 should list the pending code's `failures` key. The spec's edge case for a mismatched sender should name `channel-unlinked`. The plan's Definition of Ready counts 21 goldens where there are 23. Four refusal names this unit adds are not in `contracts/refusals.md` section 3.10: `channel-config-invalid` and `channel-links-invalid` for a damaged channel file, `surface-invalid` for a surface outside `terminal` and `channel`, and the `channel-busy` throw, which exits 1 when a channel lock stays held past 2,000 ms.
<!-- /ANCHOR:limitations -->

---
