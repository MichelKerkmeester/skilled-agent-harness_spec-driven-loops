---
title: "Tasks: 018/002 baseline fixture"
description: "Task checklist for authoring the deterministic code-retrieval fixture"
trigger_phrases: ["018/002 tasks"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/018-code-embedder-coderank/002-baseline-fixture"
    last_updated_at: "2026-05-17T18:50:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored task checklist"
    next_safe_action: "Execute T001"
    blockers: []
    key_files:
      - "evidence/code-retrieval-fixture.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000018002"
      session_id: "018-002-baseline-fixture-tasks"
      parent_session_id: "018-002-baseline-fixture"
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Tasks: 018/002 baseline fixture

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

- [ ] T001 Survey 15-20 representative source files across domains
- [ ] T002 Capture path + symbol + 1-line description per source
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Author 5 easy queries (high lexical overlap)
- [ ] T004 Author 5 medium queries (paraphrased)
- [ ] T005 Author 5 hard queries (semantic intent only)
- [ ] T006 Write `evidence/code-retrieval-fixture.json`
- [ ] T007 Write `evidence/fixture-validate.sh`
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Run `fixture-validate.sh` — expect exit 0
- [ ] T009 Hand-review for lexical leakage; rewrite biased queries
- [ ] T010 Strict-validate this packet
- [ ] T011 Commit + push
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

All 11 tasks marked `[x]`. Validator exits 0. Hand-review confirms no biased pairs. Strict-validate PASSED.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md`
- Plan: `plan.md`
- Parent: `../spec.md`
- Consumer: `../003-comparison-measure/`
<!-- /ANCHOR:cross-refs -->
