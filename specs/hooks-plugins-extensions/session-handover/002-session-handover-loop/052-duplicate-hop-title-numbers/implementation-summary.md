---
title: "Implementation Summary"
description: "A relaunched session of a named loop now carries one hop number, counted from 0 for each fresh wrapper. The wrapper used to keep any number it had not predicted and add the receiver's beside it, and to inherit a hop count from its shell, which is how ENGINE LIMITS (2) (4) appeared."
trigger_phrases:
  - "duplicate hop title numbers implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-handover/002-session-handover-loop/052-duplicate-hop-title-numbers"
    last_updated_at: "2026-11-16T20:46:45Z"
    last_updated_by: "generate-context"
    recent_action: "Fixed stacked hop numbers and the inherited hop count"
    next_safe_action: "Commit in worktree 438, merge origin/main, rebuild the trigger index and push to main"
    packet_purpose: "Purpose: Every receiver of a named loop carries exactly one hop number, counted from 0 for each fresh wrapper."
    blockers: []
    key_files:
      - ".skilled/bin/skilled-loop"
    session_dedup:
      fingerprint: "sha256:9bf7819428a6e96e4ea52e9d6039826615280fdb3b5afadc4cdc82522d667c15"
      session_id: "scaffold-052-duplicate-hop-title-numbers"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "cbc62a39-7ca8-4b5a-989f-a86fdea260ea"
      workspace: "/Users/michelkerkmeester/worktrees/public/438-duplicate-hop-title-numbers"
      savedAt: "2026-11-16T20:46:45Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
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
| **Spec Folder** | 052-duplicate-hop-title-numbers |
| **Completed** | 2026-11-16 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A named loop's receivers now count up with one number each: `ENGINE LIMITS (2)`, `(3)`, `(4)`. That holds when the sender's title shows a stale number, when the launch name already ends in one and when the wrapper starts from a looped session's shell.

### Phase 52: duplicate-hop-title-numbers

The wrapper names each receiver `<stem> (<hops + 1>)`. Before it does, `name_stem` turns the sender's live name back into the stem. It used to strip only the exact number the hop count predicted, so on the third hop it stripped ` (3)` and nothing else, and a sender name showing ` (2)` became `ENGINE LIMITS (2) (4)`. It now strips every trailing ` (<digits>)`, whatever the number and wherever it came from. Text in brackets that is not all digits, such as `Fix (auth)`, stays.

A fresh wrapper also took `SKILLED_LOOP_HOPS` from its environment. Started from a looped session's shell, it numbered its first receiver from the outer loop's count and could hit the hop cap at once. The launch reset now clears it with the other loop variables, so each fresh wrapper counts from 0.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/bin/skilled-loop` | Modified | `name_stem` strips every trailing number, and the launch reset clears `SKILLED_LOOP_HOPS` |
| `.skilled/hooks/session-handover/tests/skilled-loop-wrapper-launch-arguments.test.cjs` | Modified | Tests for the strip rule, the hop reset and the manual command |
| `.skilled/hooks/session-handover/runtime-behavior.md` | Modified | States the strip rule for Claude and Pi |
| `.skilled/hooks/session-handover/README.md` | Modified | States that a fresh wrapper ignores an inherited hop count |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Both suites ran first for a baseline. A three-hop harness run reproduced `ENGINE LIMITS (2) (4)`. The tests were written and run against the original wrapper, where six of eight failed with the stacked names or the missing relaunch. Then the wrapper changed, and the wrapper file, the node suite and the vitest config ran in full. Nothing is committed: the changes sit in the worktree for the operator's review.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Strip every trailing ` (<digits>)`, including one the operator typed | The operator chose never-stack. One rule replaces the earlier sender-number and stem-match rules, and it also heals a name that already carries two numbers |
| Strip only all-digit brackets | Text such as `Fix (auth)` is part of the name, not a hop number |
| Clear the hop count at launch rather than validate it | A count from another loop has no meaning in a new one, and the README already said the count starts at 0 |
| Run injected-hop tests as real multi-hop loops | With the reset, an injected count no longer reaches the wrapper, so a later hop has to be reached by hopping |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| New and changed tests on the original wrapper | 6 of 8 FAIL as expected: `'ENGINE LIMITS (2) (4)'`, `'ENGINE LIMITS (2) (2)'`, `'ENGINE LIMITS (2) (4) (2)'`, `'Phase (7) (2)'`, manual command with `'X (2)'`, and the `SKILLED_LOOP_HOPS=10` launch made 1 session instead of 2. The 2 that pass guard behaviour that did not change |
| `/bin/bash -n .skilled/bin/skilled-loop` (Bash 3.2.57) | Exit 0 |
| Wrapper test file | 68 of 68 |
| `node --test .skilled/hooks/session-handover/tests/*.test.cjs`, loop variables removed | Baseline 1045 of 1045. After: 1051 of 1051 |
| `vitest run --config .skilled/hooks/vitest.config.ts` | Baseline 509 passed. After: 509 passed |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The real trigger is not confirmed.** Why the operator's sender name showed an earlier number is UNKNOWN. The hop records and relaunch log for that loop in the primary checkout would show the name each `prepare` recorded.
2. **A bracketed number in the name's own text is dropped.** A loop named `Phase (7)` names its receivers `Phase (2)`, `Phase (3)`. Write the number without brackets, such as `Phase 7`, to keep it.
3. **The hop-count integer check no longer fires.** It stays in the wrapper because removing it is outside this fix.
<!-- /ANCHOR:limitations -->

---
