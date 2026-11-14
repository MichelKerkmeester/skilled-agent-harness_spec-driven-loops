---
title: "Implementation Summary"
description: "The purpose reader no longer prints a problem or a layout note as a Purpose, and every hop states the same rule."
trigger_phrases:
  - "purpose reader precision implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/012-purpose-reader-precision"
    last_updated_at: "2026-11-14T11:26:57Z"
    last_updated_by: "orchestrator-worker"
    recent_action: "Built and verified the phase"
    next_safe_action: "Build phase 013"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-012-purpose-reader-precision"
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
| **Spec Folder** | 012-purpose-reader-precision |
| **Completed** | 2026-11-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

After a compaction, resume or relaunch, the next AI now sees a `Purpose:` line only when the packet states a purpose. The opening paragraph of a combined `## PROBLEM & PURPOSE` section is now the packet's problem, and both scaffold layout sentences are skipped.

### Phase 12: purpose-reader-precision

The reader returns a combined section's opening paragraph as the problem and keeps looking for a purpose in the phase parent or `goal.md`. A packet's own problem goes beside any purpose it inherits. A lead-in of three words or fewer joins the next sentence, bold markers and control characters are dropped and the 300-character cut never splits a surrogate pair. One exported `enclosingPacketFolder` gives the Pi hook the walk-up the Claude hook had. The Claude hook reads a cached brief's folder only when it accepted that brief. The nudge, `handoff.md` and both resume assets state the same rule. Across every live `spec.md`, 211 packets stopped printing a problem or layout sentence as their purpose.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/lib/spec/packet-purpose.ts` | Modified | The reader fixes and `enclosingPacketFolder` |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts` | Modified | Shared walk-up, accepted brief only, project root |
| `.skilled/skills/system-spec-kit/runtime/hooks/pi/session-compact-context.ts` | Modified | Shared walk-up, real type, logged import failure |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts` | Modified | A `:12` line suffix counts toward its folder |
| `.skilled/skills/system-spec-kit/runtime/tests/packet-purpose.vitest.ts` | Modified | 9 to 14 tests |
| `.skilled/skills/system-spec-kit/runtime/tests/hook-session-start.vitest.ts` | Modified | 28 to 29 tests, folders in the temp checkout |
| `.skilled/skills/system-spec-kit/runtime/tests/hook-precompact.vitest.ts` | Modified | 18 to 19 tests |
| `.skilled/skills/system-spec-kit/runtime/tests/history-locator-adapters.vitest.ts` | Modified | 19 to 20 tests |
| `.skilled/hooks/session-relaunch/lib/nudge.cjs` | Modified | The rule names every heading shape and both layout sentences |
| `.skilled/hooks/session-relaunch/tests/nudge.test.cjs` | Modified | Asserts each new part |
| `.skilled/commands/speckit/handoff.md` | Modified | Same rule |
| `.skilled/commands/speckit/assets/speckit-resume-auto.yaml` | Modified | Same rule in `purpose_row` |
| `.skilled/commands/speckit/assets/speckit-resume-confirm.yaml` | Modified | Same rule in `purpose_row` |
| `.skilled/skills/system-spec-kit/runtime/lib/spec/README.md` | Modified | Two rows |
| Phases 006 to 011, `goal.md` and `implementation-summary.md` | Modified | `completion_pct: 100` and a done next action |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The build started at `26cfcdb603` after every baseline reproduced and all 59 search texts counted as stated. One DeepSeek V4.1 Flash worker at max effort ran through `cli-deepseek-harness` on dsh 0.2.2-rc.3, from a temp cwd with a disposable home. It applied E1 to E24 and exited 0 with a `completed` final event. The orchestrator then reran every check itself. eslint caught one plan miss, an unused `join` import, which the orchestrator fixed before the build, typecheck and suites ran again. The phase is committed on `worktrees/376-dsh-single-executor-loop`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The fix sits in the reader, not in each hook | Every hop and the continuity save print what the reader returns, so one fix reaches all of them |
| A shared `enclosingPacketFolder` over a copy in the Pi hook | Two copies of the walk-up already drifted once, which is the review's P1 |
| Tests make their folders in the system temp dir | The operator chose it, so a crashed run leaves nothing in the repository |
| A packet's own problem goes beside an inherited or goal purpose | The operator chose the planner's default, because the problem and the packet come from the same folder |
| Drop `join` from the Claude hook import | E10 removed its last call, and eslint fails on an unused import |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Four purpose suites | PASS. `(14 tests)`, `(29 tests)`, `(20 tests)`, `(19 tests)`. Before: 9, 28, 19 and 18 |
| Continuity suites | PASS. 42 and 1, unchanged |
| Probe over every live `spec.md` | PASS. `combinedOpening":0`, layout 0, short 0, `own purpose read: 2721 of 2985`. Before: 203, 8, 7 and 2931 of 2984 |
| nudge test | PASS. `pass 89`, `fail 0` |
| Relaunch suite with `env -u AI_SESSION_CHILD` | PASS. `pass 1028`, `fail 0`, exit 0 |
| Command workflow test | PASS. `Result: passed=150 failed=0` |
| Resume YAML load | PASS. `yaml ok` |
| Mirrors and prompt syncs | PASS. 256 mirrors in sync, three prompt syncs at 45 |
| Typecheck, eslint, build | PASS. All exit 0, eslint after the `join` fix |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Five packets now print no Purpose line.** Each printed a problem sentence as its purpose before. The operator chose to give them no new sentence.
2. **No live hop was run.** The suites and the probe prove the reader and the rule text. A real compaction, resume or relaunch needs an operator session.
<!-- /ANCHOR:limitations -->

---
