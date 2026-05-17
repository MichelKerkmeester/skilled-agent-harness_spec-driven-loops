---
title: "Tasks: 018/003 comparison measure"
description: "Task checklist for the comparison + ADR-001"
trigger_phrases: ["018/003 tasks"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/018-code-embedder-coderank/003-comparison-measure"
    last_updated_at: "2026-05-17T18:50:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored task checklist"
    next_safe_action: "Execute T001 after 018/001+002 land"
    blockers:
      - "depends on 018/001"
      - "depends on 018/002"
    key_files:
      - "evidence/cocoindex-embedder-comparison.jsonl"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000018003"
      session_id: "018-003-comparison-measure-tasks"
      parent_session_id: "018-003-comparison-measure"
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Tasks: 018/003 comparison measure

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

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 [B] Verify 018/001 + 018/002 shipped
- [ ] T002 Confirm fixture validator passes
- [ ] T003 [P] Download all 4 candidate embedders (or accept first-run download)
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Sweep candidate 1 (gemma baseline) — swap, reindex, measure
- [ ] T005 Sweep candidate 2 (jina-code — primary) — swap, reindex, measure
- [ ] T006 [P] Sweep candidate 3 (CodeRankEmbed) — optional
- [ ] T007 [P] Sweep candidate 4 (bge-code) — optional
- [ ] T008 Aggregate per-pair JSONL into per-embedder CSV
- [ ] T009 Author ADR-001 in `decision-record.md`
- [ ] T010 If winner ≠ current default, ship config update commit
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Update memory note ratifying production embedder choice
- [ ] T012 Strict-validate this packet
- [ ] T013 Commit + push
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

All 13 tasks marked `[x]`. ADR-001 verdict committed. Strict-validate PASSED. Memory note shipped.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md`
- Plan: `plan.md`
- Parent: `../spec.md`
- Dependencies: `../001-cocoindex-swap/`, `../002-baseline-fixture/`
- Analog: `../../016-pluggable-embedder-architecture/004-mxbai-swap-and-008-closure/decision-record.md` ADR-012
<!-- /ANCHOR:cross-refs -->
