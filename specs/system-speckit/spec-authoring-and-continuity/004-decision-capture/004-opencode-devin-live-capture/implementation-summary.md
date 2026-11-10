---
title: "Implementation Summary"
description: "OpenCode and Devin operator answers now queue live, through an OpenCode plugin and a Devin PostToolUse adapter keyed like the save-time readers, proven in the 006 live runs with no duplicate."
trigger_phrases:
  - "opencode devin live capture implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-authoring-and-continuity/004-decision-capture/004-opencode-devin-live-capture"
    last_updated_at: "2026-11-02T14:05:52Z"
    last_updated_by: "generate-context"
    recent_action: "Closed 004 on the 006 OpenCode and Devin live runs, 14/14 each"
    next_safe_action: "Verify CHK-FIX-007 against the commit SHA once the operator approves"
    blockers: []
    key_files:
      - ".skilled/hooks/decision-capture/lib/capture-core.mjs"
      - ".skilled/hooks/decision-capture/lib/capture-core.test.mjs"
      - ".opencode/plugins/decision-capture.js"
      - ".skilled/hooks/decision-capture/devin/ask-capture-posttooluse.mjs"
    session_dedup:
      fingerprint: "sha256:e9a3a1e2d714b5645a9d717ef2c2ca0e3840f4108598488d3f593f4a21f25a1c"
      session_id: "scaffold-004-opencode-devin-live-capture"
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
| **Spec Folder** | 004-opencode-devin-live-capture |
| **Status** | Complete |
| **Completed** | 2026-11-02, after the 006 OpenCode and Devin re-proof |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

An answer you give to an OpenCode or Devin question now reaches the decision queue during the session, not only at the next save. OpenCode also tells the model, in its next system text, when answers are waiting for a decision record. Each live path writes the same key as that runtime's save-time reader, so a later save adds no duplicate.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/plugins/decision-capture.js` and `tests/decision-capture.test.cjs` | Created | `tool.execute.after` capture for the `question` tool and the pending-answer system line. 6 tests |
| `.skilled/hooks/decision-capture/devin/ask-capture-posttooluse.mjs`, its test and `fixtures/devin-posttooluse-ask-user-question.json` | Created | Devin PostToolUse adapter that reuses `devinAnswerRecords` from the reader. 6 tests |
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json`, `.devin/hooks.v1.json` | Modified, Regenerated | Devin `PostToolUse` binding, matcher `^ask_user_question$` |
| `.skilled/hooks/shared/hook-stdin-deadline.test.mjs`, `runtime/cli/tests/hook-registration-sync.vitest.ts` | Modified | Deadline entry for the new adapter. Binding count 100 to 101 |
| `.skilled/hooks/decision-capture/bin/fixtures/opencode-session-message.json` and a case in `bin/sweep-opencode.test.mjs` | Created, Modified | Real `session_message` rows from the live probe |
| `.skilled/hooks/README.md`, `.opencode/plugins/README.md`, `feature-catalog/ux-hooks/operator-decision-capture.md` | Modified | Coverage row, adapter table, plugin index and catalog entries |
| `.skilled/hooks/decision-capture/lib/capture-core.test.mjs` | Modified | Same-key tests in both producer orders for each runtime, plus exact-key cases for a skipped question and near-miss ids |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Consent: `scratch/probe-consent.md` quotes the operator's "Yes, all four (Recommended)" (Q007 in `../decision-record.md`).

The orchestrator probed both runtimes live in scratch projects outside the repository, with one harmless question answered and one cancelled. OpenCode ran a throwaway plugin wrapped by the repo's v2 bridge. Devin ran throwaway `PostToolUse` and `Stop` loggers. Evidence: the probe files under `.skilled/skills/.state/decision-capture/probe/` and the redacted samples `bin/fixtures/opencode-session-message.json` and `devin/fixtures/devin-posttooluse-ask-user-question.json`. The raw logs held real session and call ids, so they were not kept in the packet. Devin's trust entry was removed afterwards.

Luna workers through cli-codex wrote the real-row test, the plugin and the adapter. The orchestrator reran each suite, repeated the real-row negative control, ran the binding-count vitest the worker's sandbox could not run, and proved both live paths in fresh scratch projects.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| OpenCode captures on `tool.execute.after` | The live payload carries `input.callID`, `input.sessionID` and `output.metadata.answers`, and the call id equals the stored row's item id. No `question.replied` event reached a plugin through the v2 bridge |
| The OpenCode reader needed no change | The real `session_message` row matched the inferred shape. The new case fails only with the reader's `session_message` branch removed (T007: no change, the real row matched) |
| The plugin imports only the capture core | `sweep-opencode.mjs` loads `node:sqlite` at import, which a plugin host may not provide. The plugin builds the same key from the same inputs |
| Devin captures on `PostToolUse` and reuses the reader's mapping | The live payload's `session_id` and `tool_use_id` equal the transcript's `session_id` and `source_call_id`, and its output holds the same answer envelope |
| No Devin nudge (REQ-006, T015 skipped) | The live Stop hook's `additionalContext` line was not shown in the Devin TUI, and Devin has no other surface that puts text in front of the session. Answers still reach the queue live |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test .skilled/hooks/decision-capture/bin/sweep-opencode.test.mjs` | pass 7, fail 0. With the `session_message` branch disabled, the real-row case and the existing message-layout case fail |
| `node --test .opencode/plugins/tests/decision-capture.test.cjs .opencode/plugins/tests/plugin-inventory.test.cjs` | pass 60, fail 0 |
| `node --test .skilled/hooks/decision-capture/devin/ask-capture-posttooluse.test.mjs` | pass 6, fail 0, including both producer orders |
| `sync-hook-registrations.cjs --check` | PASS: 4 registration files match the 32-hook registry |
| `hook-registration-sync.vitest.ts` | Tests 7 passed (7) |
| OpenCode plugin live in a scratch project | Queued `plum` with source `hook` during the session; `sweep-opencode.mjs` then printed `recovered 0` and the queue held 1 line |
| Devin adapter live in a scratch project | Queued `plum` with source `hook`; `sweep-devin.mjs` then printed `recovered 0` and the queue held 1 line |
| T001 baseline: the two reader tests at HEAD, run from a `git archive` copy | pass 11, fail 0 |
| `node --test` on every `lib` and `bin` test, and on both plugin suites | pass 78, fail 0; pass 60, fail 0 |
| Same-key tests in `lib/capture-core.test.mjs` | pass 20, fail 0. Dedup disabled: 6 fail. Case-insensitive dedup: the near-miss case fails |
| Queue consumers outside this folder | `hook-session-stop.vitest.ts` 19 passed, `match-decision-table.vitest.ts` 5 passed |
| 006 live re-proof, OpenCode and Devin | main 14/14 and kill-switch 1/1 each; 6 queue lines per runtime as the answers came in, 0 duplicate keys, 7 record rows, a second save identical |
| Devin call ids with `#` | The first Devin save refused its keys. After the key builders in `lib/capture-core.mjs` mapped any character outside `[A-Za-z0-9:._-]` to `.`, the rerun passed; the new capture-core case fails without the fix. Suite after it: 93 pass, 0 fail |

T006 failing output, rerun 2026-11-02 with the reader's `if (tables.has(MESSAGE_TABLE))` branch disabled, then restored with `git checkout`:

```text
✔ the fixture yields its four answered decisions and nothing else
✔ a part database recovers its answered decisions once
✖ the message layout recovers a question stored as a content item
✖ real session_message rows queue the answered call and ignore the dismissed call
✔ the newest session for the directory wins across both session tables
✔ the CLI resolves the newest session under the XDG data home
✔ the CLI reports a missing database as JSON and fails
ℹ pass 5
ℹ fail 2
```

Both failures are `strictEqual` with `actual: 0, expected: 1`: without the branch, no answered call is read from `session_message`.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Devin gets no pending-answer nudge.** Its Stop hook writes the count to the nudge file, but Devin discards the Stop output, so the operator learns of waiting answers only at save time.
2. **OpenCode's default model failed at the gateway during the probe.** `Direct provider routing is not available on coding plans` came back for the scratch project's default MiMo model. The probes set `llmgateway/deepseek-v4.1-flash-1017` in the scratch `opencode.json`.
<!-- /ANCHOR:limitations -->

---


