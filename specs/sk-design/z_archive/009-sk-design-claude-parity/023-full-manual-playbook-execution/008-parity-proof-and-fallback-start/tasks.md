---
title: "Tasks: Wave 008 - Parity-Proof and Fallback-Start"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "wave 008 tasks"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/008-parity-proof-and-fallback-start"
    last_updated_at: "2026-07-07T17:10:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "All dispatch tasks completed"
    next_safe_action: "Write checklist.md, dispatch-log.md, implementation-summary.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "pb-fr-wave-008"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Wave 008 - Parity-Proof and Fallback-Start

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

- [x] T001 Read `shared-polish-gate-selection-proof.md` in full (`.opencode/skills/sk-design/manual_testing_playbook/parity-behavior/shared-polish-gate-selection-proof.md`)
- [x] T002 Read `interface-variation-set-selection-proof.md` in full (`.opencode/skills/sk-design/manual_testing_playbook/parity-behavior/interface-variation-set-selection-proof.md`)
- [x] T003 Read `no-card-matches-fallback.md` in full (`.opencode/skills/sk-design/manual_testing_playbook/fallback-and-resilience/no-card-matches-fallback.md`)
- [x] T004 Read `../022-benchmark-rerun-and-coverage-fill/` docs as the exact Level 2 structural template
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Advisor probe for `PB-006` (top-1 `sk-code` 0.9157, `sk-design` 0.8841)
- [x] T006 Real orchestrator dispatch for `PB-006`, transcript saved (`/tmp/skd-PB006-response.jsonl`)
- [x] T007 Advisor probe for `PB-007` (top-1 `sk-design` 0.8656)
- [x] T008 Real orchestrator dispatch for `PB-007`, transcript saved (`/tmp/skd-PB007-response.jsonl`)
- [x] T009 Advisor probe for `FR-001-foundations` (empty `[]`, below threshold)
- [x] T010 Real orchestrator dispatch for `FR-001-foundations`, transcript saved (`/tmp/skd-FR001-foundations-response.jsonl`)
- [x] T011 Read `design-interface/SKILL.md`'s Procedure Card Selection table to author the `FR-001-interface` prompt with no card-trigger words
- [x] T012 Advisor probe for authored `FR-001-interface` prompt (empty `[]`, below threshold)
- [x] T013 Real orchestrator dispatch for `FR-001-interface`, transcript saved (`/tmp/skd-FR001-interface-response.jsonl`)
- [x] T014 Read `design-motion/SKILL.md`'s Procedure Card Selection table to author the `FR-001-motion` prompt with no card-trigger words
- [x] T015 Advisor probe for authored `FR-001-motion` prompt (empty `[]`, below threshold)
- [x] T016 Real orchestrator dispatch for `FR-001-motion`, transcript saved (`/tmp/skd-FR001-motion-response.jsonl`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T017 Read `../shared/procedures/polish_gate_orchestration.md` to verify the exact PB-006 finding-grouping taxonomy required by its Output contract field
- [x] T018 Parse `PB-006` transcript, grade `PARTIAL` (correct card/owner/routing, but findings grouped by P0-P3 severity, not the card's own blockers/quality-issues/polish-notes/open-decisions/out-of-scope taxonomy)
- [x] T019 Parse `PB-007` transcript, grade `PARTIAL` (correct mode/card/rationale/distinctness/advisor-win, but never names "seed of thought" or cites `variation_diversity.md` in the final response text)
- [x] T020 Parse `FR-001-foundations` transcript, grade `PASS` (exact fallback line cited, baseline workflow continued)
- [x] T021 Parse `FR-001-interface` transcript, grade `PASS` (exact fallback line cited twice, baseline workflow continued)
- [x] T022 Parse `FR-001-motion` transcript, grade `PASS` (exact fallback line cited, baseline workflow continued)
- [x] T023 Write `dispatch-log.md` with one row per dispatch, each verdict citing a specific criterion line
- [x] T024 Write `checklist.md` and `implementation-summary.md`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All 5 assigned dispatches ran, transcripts captured, and verdicts cite specific criterion lines
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Evidence table**: See `dispatch-log.md`
- **Structural precedent**: `../022-benchmark-rerun-and-coverage-fill/`
<!-- /ANCHOR:cross-refs -->
