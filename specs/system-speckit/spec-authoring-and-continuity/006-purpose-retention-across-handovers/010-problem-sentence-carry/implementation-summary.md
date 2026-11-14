---
title: "Implementation Summary"
description: "Built 2026-11-14. After a compaction, the recovered context prints the first sentence of the packet's Problem Statement as a Problem line under its purpose line, on Claude and on Pi."
trigger_phrases:
  - "problem sentence carry implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/010-problem-sentence-carry"
    last_updated_at: "2026-11-14T06:14:05Z"
    last_updated_by: "template-author"
    recent_action: "Planned fourteen edits that carry the problem sentence after a compaction"
    next_safe_action: "Get the operator's yes in spec.md section 7 before any build"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/lib/spec/packet-purpose.ts"
      - ".skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-010-problem-sentence-carry"
      parent_session_id: null
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
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 010-problem-sentence-carry |
| **Completed** | 2026-11-14 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

After a compaction the next AI now sees why the work exists as well as what it is for: a `Problem:` line with the first sentence of the packet's Problem Statement follows the purpose line, on Claude and on Pi. The stored `packet_purpose`, the resume brief and the relaunch note are unchanged.

### Phase 10: problem-sentence-carry

E1 to E6 gave the purpose helper a `problem` field, read by `problemIn`, and the `formatPacketProblem` formatter. E7 to E9 print the line in the Claude and Pi compaction adapters. E10 to E12 extend four helper assertions and add one Claude and one Pi check. E13 and E14 update three READMEs.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/lib/spec/packet-purpose.ts` | Modified | `problem` field, `problemIn` and `formatPacketProblem` |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts`, `hooks/pi/session-compact-context.ts` | Modified | Print the Problem line |
| `runtime/tests/packet-purpose.vitest.ts`, `hook-session-start.vitest.ts`, `history-locator-adapters.vitest.ts` | Modified | Extended assertions and one new compaction test |
| `runtime/lib/spec/README.md`, `hooks/claude/README.md`, `hooks/pi/README.md` | Modified | Describe the Problem line |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

The orchestrator captured the baselines in `plan.md` section 5 and counted every search text once. One DeepSeek V4.1 Flash max worker, dispatched through cli-deepseek-harness with `--add-dir` for the four target folders, applied E1 to E14 and exited 0 with a `completed` final event. The orchestrator built the runtime and reran every check below itself.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| The Problem line goes into the compaction recovery only | It is the hop where code prints the line and nothing else supplies the problem. A resume reads `spec.md` itself, a relaunch note states its goal in the session's words and the stored continuity value has a 512-character limit |
| A second function, `formatPacketProblem` | `formatPacketPurpose` returns the one line the continuity writer stores, so it stays one line |
| Planned as its own phase | The operator approved a design that quotes the Purpose only. A separate phase can be dropped without touching phases 007 to 009 |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| The two Measured Behavior commands in `spec.md` | Run 2026-11-14: no line that mentions a problem in the helper or either adapter, and 2656 live files with a `### Problem Statement` heading |
| Search texts in `plan.md` section 4 that exist today | Each of the sixteen counted `1` |
| REQ-001 to REQ-003 tests | `(9 tests)`, `(28 tests)`, `(19 tests)`, `Tests  56 passed (56)`, including `adds the problem under the purpose line` |
| REQ-004 stored purpose | `(42 tests)`, `(1 test)`, `Tests  43 passed (43)`, `workflow.ts` unchanged |
| REQ-005 typecheck and build | both exit 0, `formatPacketProblem` appears once in the built helper |
| Lint | eslint exit 0 on the three source files |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **It needs a decision first.** The operator approved a Purpose-only design. Until they say yes to `spec.md` section 7, this phase stays a plan.
2. **Three hops still carry no problem.** The resume brief, the relaunch note and the continuity save are left as they are, for the reasons in `spec.md` section 3.
<!-- /ANCHOR:limitations -->

---
