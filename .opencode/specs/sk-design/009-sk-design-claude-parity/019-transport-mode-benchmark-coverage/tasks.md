---
title: "Tasks: Phase 019 - Transport Mode Benchmark Coverage & Routing Re-Verification"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "phase 019 tasks"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/019-transport-mode-benchmark-coverage"
    last_updated_at: "2026-07-07T11:10:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "All implementation tasks completed; live-mode benchmark in progress"
    next_safe_action: "Analyze live-mode results once complete, write checklist.md and implementation-summary.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "transport-benchmark-019"
      parent_session_id: null
    completion_pct: 70
    open_questions: []
    answered_questions: []
---
# Tasks: Phase 019 - Transport Mode Benchmark Coverage & Routing Re-Verification

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read `manual_testing_playbook.md` root index in full
- [x] T002 Read `01--mode-routing/audit-mode.md` as the exact template
- [x] T003 Read `02--advisor-integration/positive-design-controls.md` in full
- [x] T004 Confirm no `command-metadata.json` entry needed for the transport mode
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Author `01--mode-routing/mcp-open-design-mode.md` (`MR-007`)
- [x] T006 [P] Add `P6` probe to `AI-001` in `positive-design-controls.md`; version bump
- [x] T007 [P] Fix stale "five modes" prompt text in `doc-write-routes-elsewhere.md` (`AI-003`); version bump
- [x] T008 Update `manual_testing_playbook.md`: overview, preconditions, Section 7 table, critical-path list, AI-003 row, cross-reference index, totals; version bump
- [x] T009 [P] Fix `README.md`'s stale playbook description line
- [x] T010 [P] Sync `description.json` (description, keywords, trigger_examples, modes[], backend_kinds[]); version bump
- [x] T011 [P] Sync `graph-metadata.json` (causal_summary, intent_signals)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Router-mode benchmark: confirm scenario count 24 -> 25, verdict PASS, D5 100/100
- [x] T013 JSON parse check on `description.json` and `graph-metadata.json`
- [x] T014 Live-mode benchmark: fresh baseline to `benchmark/after-018-transport-integration/`
- [x] T015 Grep sweep: 0 stale "five modes" hits in sk-design's own live docs
- [x] T017 Direct `router-replay.cjs` verification against real prompts, since MR-007 is browser-classified and skipped by both benchmark modes: confirms `design-mcp-open-design` wins its own vocabulary and the 3 spot-checked design modes (interface/audit/motion) are unaffected
- [x] T016 Write this phase's own `implementation-summary.md`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Both benchmark modes plus a direct router-replay spot-check confirm a clean, complete six-mode baseline
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor Phase**: `../018-mcp-open-design-transport-integration/`
<!-- /ANCHOR:cross-refs -->
