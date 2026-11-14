---
title: "Implementation Summary"
description: "Planned, not built, and waiting on an operator decision. This phase holds the plan for fourteen edits that print the first sentence of a packet's Problem Statement under its purpose line after a compaction. No file outside this packet has changed yet."
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
    completion_pct: 0
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
| **Completed** | Not built. Planned 2026-11-14 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

Nothing is built yet. This packet holds the plan that answers the last point of finding 3 of the independent review: the Problem Statement, which says why the work exists and for whom, is never carried.

### Phase 10: problem-sentence-carry

The five built phases carry one sentence of the Purpose. `plan.md` section 4 holds fourteen edits that make the purpose helper also return the first sentence of the Problem Statement, and make the two compaction adapters print it as a `Problem:` line under the purpose line. The stored `packet_purpose`, the resume brief and the relaunch note do not change.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md`, `plan.md`, `tasks.md` | Created | The plan for the fourteen edits |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

Not delivered. Planning ran the two Measured Behavior commands in `spec.md` and counted the sixteen search texts that exist today once each with `rg -c -F`. Four more search texts are lines phases 007 and 009 write, so they cannot be counted until those phases are built. This session could not start `node`, so no code was run.
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
| The fourteen edits | Not run. Tasks T001 to T022 are open |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **It needs a decision first.** The operator approved a Purpose-only design. Until they say yes to `spec.md` section 7, this phase stays a plan.
2. **Three hops still carry no problem.** The resume brief, the relaunch note and the continuity save are left as they are, for the reasons in `spec.md` section 3.
<!-- /ANCHOR:limitations -->

---
