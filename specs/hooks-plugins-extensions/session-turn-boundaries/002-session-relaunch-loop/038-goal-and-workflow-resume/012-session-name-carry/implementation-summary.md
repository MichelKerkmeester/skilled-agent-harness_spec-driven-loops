---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "session name carry implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/012-session-name-carry"
    last_updated_at: "2026-11-13T00:00:00Z"
    last_updated_by: "builder"
    recent_action: "Built and verified the phase"
    next_safe_action: "The orchestrator commits the phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-012-session-name-carry"
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
| **Spec Folder** | 012-session-name-carry |
| **Completed** | 2026-11-13 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A Claude or Pi receiver now starts with the sender's live session name plus its own number, and every receiver after the first is named `<stem> (2)`, `<stem> (3)`, and so on without the suffixes stacking. A `/rename` in a Claude sender survives the hop, because `prepare` records the last `customTitle` from the session log ahead of `SKILLED_LOOP_NAME`.

### Phase 12: session-name-carry

The name now moves through four places. `readClaudeSettings` searches the transcript tail for the last `custom-title` entry, `resolveSessionSettings` passes the value on, `prepare` writes it to the record, and `consume` prints it. The wrapper reads it back, rejects a value that starts with `-` or holds a control character, strips the number this wrapper wrote for the sender, exports the stem, and replays `<stem> (H+1)` on a hop. A manual claim keeps the stem with no number, and the two option comments now say that the Codex, Cursor, Devin and OpenCode name entries are not in those runtimes' help and exist only so a hop strips them.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/session-relaunch/lib/context-usage.cjs` | Modified | `readClaudeSettings` returns the last non-empty custom title as `name`. |
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | Modified | `resolveSessionSettings` carries `name` and proves `''` when nothing is read. |
| `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` | Modified | `prepare` prefers the live name; `consume` prints a non-empty `name`. |
| `.skilled/bin/skilled-loop` | Modified | Validates and stems the consumed name, exports it, numbers the hop replay, keeps the manual stem, corrects the two comments. |
| `.skilled/hooks/session-relaunch/tests/context-usage.test.cjs` | Modified | Four custom-title tests and the `name: ''` expectations. |
| `.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` | Modified | Prepare and consume name tests. |
| `.skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-harness.cjs` | Modified | The stub record takes `RECORD_NAME`. |
| `.skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs` | Modified | Six hop-name tests, the manual test, and amended guards. |
| `.skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-claim-goal.test.cjs` | Modified | The Claude goal hop expects `Work (2)`. |
| `.skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-decline-manual.test.cjs` | Modified | The automatic name is the manual stem plus ` (2)`. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every source change followed a failing test. The two title tests and the prepare, consume and wrapper name tests were run red first, with the runs saved in `scratch/red.txt`; the passing focused runs and the full suite are in `scratch/green.txt`. The baseline was 915 tests on the post-011 tree. The final run was 928 tests, 928 pass, fail 0. `prepare` was timed before and after on the same 16 MiB untitled log: 137.2 ms to 279.8 ms, a 142.6 ms delta inside the 200 ms bound.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The title needs its own tail search | A `/rename` can land before the last assistant turn, so the trail after that turn misses it; the widening reader finds it within the same 16 MiB cap. |
| `prepare` prefers the live title | The launch line only repeats what the operator typed at launch, while the log holds the name the session really carries after a `/rename`. |
| The hop name is `<stem> (H+1)` with a trailing ` (H)` stripped | The receiver needs its own number; stripping only the number this wrapper wrote keeps a name like `Phase (7)` intact at every hop but the seventh. |
| A refused consumed name falls back to the launch name with a warning | The record is read-only input, and a value starting with `-` or holding a control character must never become an option or break the printed command. |
| The manual claim carries the stem with no number | A manual claim starts a new wrapper at hop 0, so its first receiver would otherwise be numbered twice. |
| The option entries stay and only their comments change | The existing strip cases rely on them, and dropping them would make a Cursor or OpenCode `-n` launch ambiguous and unable to relaunch. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/*.test.cjs` | PASS: tests 928, pass 928, fail 0, exit 0; baseline 915 plus 13 new tests. |
| Focused title, prepare, consume and hop-name patterns | PASS: 2, 2, 7 and 7 tests, each fail 0. |
| `rg -n 'no name flag' .skilled/bin/skilled-loop` | PASS: 2 lines. |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh .../012-session-name-carry --strict` | PASS: `RESULT: PASSED`. |
| Prepare timing on the same 16 MiB untitled log | PASS: 137.2 ms before, 279.8 ms after, delta 142.6 ms under the 200 ms bound. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The OpenCode title and Pi live names stay out of this phase** Phase 013 owns the OpenCode title, and a Pi live name would need an adapter change. A Pi receiver gets its number from the wrapper's exported stem.
2. **A title older than the 16 MiB tail cap is missed** The hop falls back to `SKILLED_LOOP_NAME`, as it did before this phase.
<!-- /ANCHOR:limitations -->

---

