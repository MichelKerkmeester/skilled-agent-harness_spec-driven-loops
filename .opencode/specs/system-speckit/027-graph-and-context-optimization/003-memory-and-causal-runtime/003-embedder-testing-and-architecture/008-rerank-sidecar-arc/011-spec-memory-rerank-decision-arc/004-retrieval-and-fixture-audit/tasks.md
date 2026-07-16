---
title: "Tasks: retrieval + fixture audit [template:level_1/tasks.md]"
description: "T001-T018 covering probe classification, candidate coverage, parity, rerank effect, branch decision."
trigger_phrases:
  - "011/004 tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/004-retrieval-and-fixture-audit"
    last_updated_at: "2026-05-21T14:30:00Z"
    last_updated_by: "main_agent"
    recent_action: "Tasks scaffolded"
    next_safe_action: "Dispatch"
    blockers: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: retrieval + fixture audit

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`[x]` complete, `[ ]` open, `[!]` blocked. P-tag: P0 / P1.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T001 | P0 | Read fixture + Phase 1/Phase 2 evidence files | `[ ]` | (pending) |
| T002 | P0 | Verify memory_index SQLite reachable | `[ ]` | (pending) |
| T003 | P0 | Verify daemon IPC socket reachable from sandbox (or document gap) | `[ ]` | (pending) |
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T004 | P0 | Phase A: classify all 50 probes (valid / stale / replaced / unusable) | `[ ]` | evidence/probe-classification-*.json |
| T005 | P0 | Phase B: log candidate coverage per-lane top-20/50/100 for valid+replaced probes | `[ ]` | evidence/candidate-coverage-*.json |
| T006 | P0 | Phase B aggregate: % probes where gold appears in pre-rerank candidate pool | `[ ]` | impl-summary §Candidate Coverage |
| T007 | P0 | Phase C: handler-parity check on 5 sample probes (direct-replay vs daemon IPC) | `[ ]` | evidence/handler-parity-*.md |
| T008 | P1 | Phase C: if daemon IPC unreachable, mark REQ-003 as deferred + document | `[ ]` | (conditional) |
| T009 | P0 | Phase D: log rerank raw + blended scores + position deltas | `[ ]` | evidence/rerank-effect-*.json |
| T010 | P0 | Phase D aggregate: % probes where rerank changed top-5 | `[ ]` | impl-summary §Rerank Effect |
| T011 | P0 | Phase E: recompute hit-rate@5 / NDCG@10 / recall@5 on valid+replaced subset | `[ ]` | evidence/valid-subset-metrics-*.json |
| T012 | P0 | Phase E: apply branch logic → choose RETRIEVAL_WORK / SCORING_INTEGRATION_WORK / PHASE_3_JUSTIFIED | `[ ]` | impl-summary §Branch Decision |
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T013 | P0 | Verify zero production source modified (git diff lib/search/ empty) | `[ ]` | git diff output |
| T014 | P0 | Strict-validate this packet | `[ ]` | exit 0 |
| T015 | P0 | Strict-validate arc parent | `[ ]` | exit 0 |
| T016 | P0 | Update arc parent spec.md phase-map with branch decision | `[ ]` | 011 spec diff |
| T017 | P0 | Update 003 spec.md status based on branch (Superseded / Deprioritized / Justified) | `[ ]` | 003 spec diff |
| T018 | P0 | Commit handoff: exact paths | `[ ]` | impl-summary §Commit Handoff |
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

T001-T018 with evidence. PARTIAL acceptable only if T008 fires (sandbox blocks daemon IPC) — REQ-003 deferred, other branches complete.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- spec.md §Scope mechanical-branch table → T012 mapping
- spec.md §Risks "Daemon IPC sandbox" → T003 + T008
- 003-domain-tuned-finetune (Phase 3) status changes based on T012 outcome
- 011 arc parent phase-map updated by T016
<!-- /ANCHOR:cross-refs -->
