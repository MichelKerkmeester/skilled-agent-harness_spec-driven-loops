---
title: "Implementation Summary"
description: "Vibe's ask_user_question answers now reach the decision queue from a silent post_tool adapter and from a save-time journal sweep that share one mapper, and a turn-start part reminds the model to save once per rising pending count."
trigger_phrases:
  - "vibe decision capture implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/017-vibe-decision-capture"
    last_updated_at: "2026-11-14T23:45:00Z"
    last_updated_by: "deepseek-v4.1-flash-1017"
    recent_action: "Built save nudge and adapter registration"
    next_safe_action: "Run the TUI procedure in scratch/live-capture/procedure.md with an operator"
    blockers:
      - "T017 needs an interactive operator at the Vibe TUI"
    key_files:
      - ".skilled/hooks/decision-capture/bin/sweep-vibe.mjs"
      - ".skilled/hooks/decision-capture/vibe/ask-capture-post-tool.mjs"
      - ".skilled/hooks/session-lifecycle/vibe/turn-start.mjs"
      - ".vibe/hooks.toml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mistral-support-2026-11-14"
      parent_session_id: null
    completion_pct: 90
    open_questions:
      - "Does post_tool reach the adapter for the real question tool? Only an interactive TUI run shows it."
    answered_questions:
      - "Vibe's answer list maps to the shared normalizer through one Vibe mapper, so the hook and the sweep write one key."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 017-vibe-decision-capture |
| **Completed** | 2026-11-14 (fixture proof); live TUI capture pending an operator |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every answer the operator gives through Vibe's `ask_user_question` tool now lands in the shared decision queue, from the live `post_tool` adapter or from the save-time journal sweep, under one key. A cancelled widget writes nothing, and a turn-start part tells the model once when a new answer waits for `/speckit:save`.

### Phase 17: vibe-decision-capture

The shared normalizer reads answers as an object keyed by question text, while Vibe returns a list of `{question, answer, isOther}`. `vibeAnswerRecords` folds the list into that object, so the adapter and the sweep both reach the same normalized record without a change to the queue core or its record shape. `takeNudge` reports the pending count once per rise, so the composer's save reminder fires on the turn after a new answer and stays quiet afterwards.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/decision-capture/bin/sweep-vibe.mjs` | Create | Exports `isQuestionTool` and `vibeAnswerRecords`, and the journal sweep CLI over the Vibe session reader |
| `.skilled/hooks/decision-capture/bin/sweep-vibe.test.mjs` | Create | Mapper cases (one answer, `is_other`, multi-select, cancel) and the deduplicated sweep |
| `.skilled/hooks/decision-capture/vibe/ask-capture-post-tool.mjs` | Create | The silent, fail-open `post_tool` adapter keyed on `tool_call_id` |
| `.skilled/hooks/decision-capture/vibe/ask-capture-post-tool.test.mjs` | Create | Measured payload, another tool, a qualified name and malformed stdin |
| `.skilled/hooks/decision-capture/vibe/README.md` | Create | The adapter contract and its fail-open behavior |
| `.skilled/hooks/decision-capture/bin/README.md` | Modify | The `sweep-vibe` rows and the mapper export |
| `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs` | Modify | `buildSaveNudgePart`, appended last in the part list |
| `.skilled/hooks/session-lifecycle/vibe/turn-start.test.mjs` | Modify | The rising-count reminder and the quiet turn at the same count |
| `.vibe/hooks.toml` | Modify | One non-strict `post_tool` entry, `match = "ask_user_question"` |
| `.skilled/commands/speckit/save.md` | Modify | The Vibe sweep in the decision-sweep step and the tool map |
| `.skilled/skills/system-spec-kit/references/memory/save-workflow.md` | Modify | Vibe and `sweep-vibe.mjs` in the sweep-by-runtime line |
| `scratch/live-capture/procedure.md` | Create | The operator TUI procedure for the live capture proof |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

One mapper, two producers. The adapter maps a `post_tool` payload's `tool_output.answers` and appends through `appendRecords`; the sweep replays the journal's question effects through the shared Vibe reader and appends the same keys, which the queue core drops as duplicates. The turn-start composer calls `takeNudge` in its own part and adds one `[decision-capture]` line when the count rises. The adapter is registered in the rendered home hooks through the same absolute-path form every other entry uses.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The list-to-object mapping lives in `sweep-vibe.mjs` and the adapter imports it | A second mapper could drift and write a different key for one answer |
| The adapter accepts the short and any group-qualified tool name | Vibe reports `ui.ask_user_question`, while the configured match is the short name |
| The nudge part checks the `decision-capture` concern switch first | The concern switch disables the adapter and the reminder without a revert |
| The live procedure stays `[B]` | A non-interactive dispatch has no operator to answer the widget, and print mode has no question tool |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --check .skilled/hooks/session-lifecycle/vibe/turn-start.mjs` | exit 0 |
| `node --test .skilled/hooks/session-lifecycle/vibe/turn-start.test.mjs` | `tests 8`, `pass 8`, `fail 0` (baseline 6) |
| `rg -c 'match = "ask_user_question"' .vibe/hooks.toml` | `1` |
| `node --test .skilled/hooks/decision-capture/vibe/ask-capture-post-tool.test.mjs .skilled/hooks/decision-capture/bin/sweep-vibe.test.mjs` | `tests 9`, `pass 9`, `fail 0` |
| `node --test .skilled/hooks/decision-capture/lib/capture-core.test.mjs` | `tests 25`, `pass 25`, `fail 0` |
| `node --test .vibe/plugins/repo-guards/tests/render-home-hooks.test.mjs` | `tests 4`, `pass 4`, `fail 0` |
| Live TUI capture, `pendingRecords(scratch, session)` | Not run: needs an interactive operator (T017) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The live hook is not yet observed.** The fixture suites prove the payload, the mapper and the key, but only an interactive run proves Vibe delivers `post_tool` for `ask_user_question`. `scratch/live-capture/procedure.md` holds the run and its `pendingRecords` check; T017 stays blocked until an operator runs it.
2. **A print-mode or dispatched session captures nothing.** Vibe removes the question tool there by design, so the absence of a record is expected rather than a failure.
<!-- /ANCHOR:limitations -->

---
