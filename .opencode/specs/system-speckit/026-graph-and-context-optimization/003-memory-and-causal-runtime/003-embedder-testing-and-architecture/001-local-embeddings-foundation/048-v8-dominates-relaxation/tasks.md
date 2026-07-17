---
title: "Tasks: 047 V8 dominates relaxation"
description: "Task ledger for V8 dominance relaxation, parent child allowlisting, tests, and validation."
trigger_phrases:
  - "047 tasks"
  - "V8 dominates tasks"
importance_tier: "critical"
contextType: "spec"
status: "complete"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/048-v8-dominates-relaxation"
    last_updated_at: "2026-05-14T17:15:00Z"
    last_updated_by: "codex"
    recent_action: "Completed all implementation and verification tasks"
    next_safe_action: "No further action required for packet 047"
    blockers: []
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks | v2.2 -->
# Tasks: 047 V8 Dominates Relaxation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## TASK NOTATION

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

- [x] T001 Capture pre-bound Gate 3 folder for phase 047.
- [x] T002 Read `validate-memory-quality.ts` V8 rule body and helpers.
- [x] T003 Read existing V8 overreach and regex-narrow Vitests.
- [x] T004 Reproduce live parent handover V8 failure.
- [x] T005 Create the 047 Level-2 packet directory.
- [x] T006 Author initial 047 spec, plan, tasks, checklist, implementation summary, description, and graph metadata.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T007 Add named dominance threshold constants.
- [x] T008 Add doc-type-specific dominance threshold selection.
- [x] T009 Add cached direct-child spec ID enumeration.
- [x] T010 Extend direct child allowlisting to numbered child directories.
- [x] T011 Add T047-01 decision-record dominance relaxation coverage.
- [x] T012 Add T047-02 plan strict dominance coverage.
- [x] T013 Add T047-03 parent handover child allowlist coverage.
- [x] T014 Add T047-04 unrelated parent handover dominance coverage.
- [x] T015 Add T047-05 live handover source validation coverage.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T016 Run `npm run build` from `.opencode/skills/system-spec-kit/scripts`.
- [x] T017 Run targeted V8 overreach and regex-narrow Vitests.
- [x] T018 Run live validator against `014-local-embeddings-migration/handover.md`.
- [x] T019 Run strict validation against this 047 packet.
- [x] T020 Update implementation-summary.md and checklist.md with final evidence.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## COMPLETION CRITERIA

- [x] Build, targeted tests, live validator, and strict packet validation have fresh evidence.
- [x] Checklist reflects all P0/P1 verification items.
- [x] Implementation summary contains the requested binding trace.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Implementation Summary**: `implementation-summary.md`
- **Dependency**: `../041-v-rule-cross-spec-overreach/`
<!-- /ANCHOR:cross-refs -->
