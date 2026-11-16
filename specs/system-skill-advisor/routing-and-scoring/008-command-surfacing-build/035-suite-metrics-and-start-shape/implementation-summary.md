---
title: "Implementation Summary: Phase 35: suite-metrics-and-start-shape"
description: "The advisor suite no longer writes into the shared health-metrics folder, and the scorer prints the shape of every start beside the start rate. The split showed most counted starts are document reads alone."
trigger_phrases:
  - "suite metrics and start shape implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/035-suite-metrics-and-start-shape"
    last_updated_at: "2026-11-16T07:13:24Z"
    last_updated_by: "generate-context"
    recent_action: "Closed 035: 267c27fc5df, isolation check and shape check recorded"
    next_safe_action: "Run T001 of phase 036 to record the before summaries"
    packet_purpose: "Purpose: A suite run leaves the shared metrics folder untouched, and each start rate prints the shape of its starts so a reader can apply either rule without rescoring."
    blockers: []
    key_files:
      - "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/035-suite-metrics-and-start-shape/implementation-summary.md"
      - "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/035-suite-metrics-and-start-shape/scratch/isolation.txt"
      - ".skilled/skills/system-skill-advisor/runtime/vitest.config.ts"
    session_dedup:
      fingerprint: "sha256:043f104e60f2cec78d590ad7bdb96df21366661707073cea699c6aaa8e78c120"
      session_id: "scaffold-035-suite-metrics-and-start-shape"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "77af2d6d-58e8-4180-b6da-697f12833f71"
      workspace: "/Users/michelkerkmeester/worktrees/public/352-command-surfacing-research"
      savedAt: "2026-11-16T07:13:24Z"
      locatorKind: "transcript_path"
      version: 1
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
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 035-suite-metrics-and-start-shape |
| **Completed** | 2026-11-16 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A suite run now leaves the shared health-metrics folder untouched, so the advisor's health readers stop counting test records as real use. The scorer also prints which shape made each start, and the split showed that most printed starts are a document read with nothing written, which the goal's fixed start rule calls a lookup.

### Phase 35: suite-metrics-and-start-shape

`vitest.config.ts` makes one temp folder per run with `mkdtempSync`, points `TMPDIR` at it before any worker starts and removes it when the run exits. Every test and every process a test spawns inherits it, so the advisor's metrics root, which resolves under `tmpdir()`, lands there. Before the change one full run added 6 files and 312 lines to the shared folder.

`startState` now returns a `shape` for each start: `skill`, `reported`, `expanded`, `readWrite` or `readOnly`, in that fixed order. The summary tallies the shapes of counted starts as `startShapes` per runtime and arm and prints them in the text output. No total moved.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skill-advisor/runtime/vitest.config.ts` | Modified | Per-run temp folder, set before workers start and removed on exit |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs` | Modified | `startState` shape, `startShapes` tally and print |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts` | Modified | Shape cases and the capped-row split case |
| `scratch/isolation-check.sh`, `scratch/isolation.txt` | Created | The shared-folder check and its output |
| `scratch/before.txt`, `scratch/after.txt` | Created | Gate output before and after |
| `scratch/summary-shapes.json`, `scratch/shape-check.txt` | Created | The 033 rescore and its comparison with 034 |
| `../goal.md` | Modified | Rows `Start shape split`, `Suite metrics isolation` and a correction row for each |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The before state showed the leak: one full suite took the shared folder from 729 to 735 files and 26001 to 26313 lines. After the config change, `isolation-check.sh` counted and snapshotted the folder around a full run: 739 files and 26383 lines before and after, no file changed, and the one per-run folder gone after exit. The 033 lines were then rescored at `267c27fc5df`. All 10 start rates equal 034's, every split sums to its started count and the rest of the summary is identical. The first gate review asked for reproducible evidence, because a plain count moved with other sessions' writes. The committed check script answered it, and the second review approved.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Set `TMPDIR` in the config, not a new metrics-root option | `tmpdir()` already reads it, so every test and spawned child moves with no new knob, and the full suite passed under it |
| Throw when the folder cannot be made | A silent fallback would put records back into the shared folder unnoticed |
| Print shapes, change no total | The rule choice was the operator's. The split lets either rule be applied to the printed numbers |
| Replace the plain count with a snapshot check | Other sessions on the machine write the same folder, so only a path and change-time snapshot attributes a change |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Leak before | 729 to 735 files, 26001 to 26313 lines across one full run (`before.txt`) |
| Isolation after | 739 files, 26383 lines before and after, no shared file changed, per-run folder gone, `test -e` exit 1 (`isolation.txt`) |
| Advisor suite | 2325 passed, 6 skipped, 0 failed, exit 0 |
| Scorer tests | 342 passed. Build type check exit 0 |
| Floors and eval | `24/44`, `0/35`, `2/44` and `[160,49,21,5]`, unchanged |
| Rescore | 10 lines `rate equal, shapes sum equal`, summary identical to 034 apart from `startShapes` |
| Gate review | First REQUESTED_CHANGES on evidence, second APPROVED 96/100. Its three P2s fixed: provenance reworded, T009 closed, script labelled macOS-only |
| Acceptance criteria | 5 of 5 Met. Checklist P0 12 of 12, P1 13 of 13, P2 deferred to phase 036 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **One unexplained suite failure.** The first full run after the config change reported 1 failed test, which was not captured. The nine full runs since passed with 0 failed. The config change cannot be ruled out as its cause.
2. **The README field list lacks `startShapes`.** Phase 036 adds it with the start rule.
3. **The 77 sweep files already in the shared folder stay.** They sit outside git, so removing them waits on the operator.
4. **`isolation-check.sh` runs on macOS only.** It reads change times with BSD `stat -f`.
<!-- /ANCHOR:limitations -->

---
