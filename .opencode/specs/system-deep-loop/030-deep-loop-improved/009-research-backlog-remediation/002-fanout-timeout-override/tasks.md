---
title: "Tasks: Fanout Lineage Timeout Override"
description: "Task list for the fanout lineage timeout override."
trigger_phrases:
  - "fanout lineage timeout override tasks"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-improved/009-research-backlog-remediation/002-fanout-timeout-override"
    last_updated_at: "2026-07-01T07:15:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Implemented by GPT-5.5 xhigh fast, verified by Claude Sonnet 5"
    next_safe_action: "Phase complete; move to child 003-runtime-hygiene-fixes"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs"
      - ".opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sonnet-009-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Fanout Lineage Timeout Override

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`[x]` complete, `[ ]` pending.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read `computeLineageTimeoutMs` (fanout-run.cjs:884-888) and `parseArgs` (line ~95) in full
- [x] T002 Write RED tests: default behavior unchanged (REQ-001); override raises ceiling (REQ-002)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add `--lineage-timeout-hours <N>` CLI arg parsing
- [x] T004 Thread the override into `computeLineageTimeoutMs`'s ceiling computation, preserving the `iters*timeoutSeconds*2` lower-bound formula
- [x] T005 Document the new flag in `.opencode/commands/deep/research.md` and `.opencode/commands/deep/review.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Confirm T002's RED tests now pass (GREEN) — targeted file independently re-run by Claude Sonnet 5: 34/34 pass
- [x] T007 Run the full `deep-loop-runtime` Vitest suite; confirm no regressions — independently re-run by Claude Sonnet 5: 556/558 pass, 2 failures (`dependency-seams.vitest.ts`, `executor-provenance-mismatch.vitest.ts`) confirmed pre-existing/unrelated (identical 2 failures observed during child 001's independent verification; unrelated code paths, not touched by this change)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All 7 tasks complete; new tests pass; flag documented; full-suite regressions independently attributed as pre-existing and unrelated.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `./spec.md` · Plan: `./plan.md` · Implementation summary: `./implementation-summary.md`
- Source finding: `../../research/research.md` §4.1 (F-006/G-005)
<!-- /ANCHOR:cross-refs -->
