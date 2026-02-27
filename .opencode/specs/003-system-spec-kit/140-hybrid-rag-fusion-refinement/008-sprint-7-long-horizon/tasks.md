---
title: "Tasks: Sprint 7 — Long Horizon"
description: "Task breakdown for Sprint 7: memory summaries, content generation, entity linking, full reporting, R5 INT8 evaluation"
trigger_phrases:
  - "sprint 7 tasks"
  - "long horizon tasks"
  - "R5 evaluation tasks"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Sprint 7 — Long Horizon

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
| `[GATE]` | Sprint exit gate |

**Task Format**: `T### [P?] Description [effort] {dependencies} — Requirement`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:implementation -->
## Implementation (all parallelizable)

> **SPRINT GATE NOTE**: Sprint 7 is entirely P2/P3 and optional. Before beginning any task, confirm: Sprint 0-6 exit gates all passed AND scale thresholds met. All tasks below are conditional on these prerequisites.

- [ ] T001 [P] Implement memory summary generation (gated on >5K **active memories with embeddings**) behind `SPECKIT_MEMORY_SUMMARIES` flag [15-20h] — R8 (REQ-S7-001)
  - **Scale gate check (required first)**: `SELECT COUNT(*) FROM memories WHERE status != 'archived' AND embedding IS NOT NULL`. If result <5K, skip T001 entirely and document.
  - The "5K memories" threshold means: total active (non-archived) memories with embeddings. Draft memories and archived memories do not count.
  - **Latency check (before pipeline integration)**: Validate that R8 pre-filter adds <50ms to p95 search latency. If latency impact exceeds budget, do not integrate into production path.
  - Summary generation algorithm (extractive or TF-IDF key-sentence)
  - Pre-filter integration into search pipeline (only if latency constraint met)
  - Gate: skip if <5K active-with-embeddings — document query result as decision evidence
  - What T001 needs before becoming implementable: confirmed scale gate result + latency budget headroom measurement
- [ ] T002 [P] Implement smarter memory content generation from markdown [8-12h] — S1 (REQ-S7-002)
  - Improved content extraction heuristics (e.g., heading-aware extraction, code-block stripping, list normalization)
  - Quality verification via manual review of >=10 before/after memory content samples
  - Acceptance criteria: manual review shows measurable improvement in content density/relevance for >=8/10 sampled memories
  - What T002 needs before becoming implementable: baseline quality measurement on current content generation output
- [ ] T003 [P] Implement cross-document entity linking [8-12h] — S5 (REQ-S7-003)
  - Entity resolution strategy: link only verified entities (not R10 auto-entities with unknown FP rate); use exact-match + normalized-alias matching first
  - Cross-document entity matching and link graph
  - Acceptance criteria: at least 3 cross-document entity links established in integration test; no R10 auto-entities included unless FP rate confirmed <20%
  - What T003 needs before becoming implementable: R10 FP rate confirmed from Sprint 6; entity catalog available
- [ ] T004 [P] Implement R13-S3: full reporting dashboard + ablation study framework [12-16h] — R13-S3 (REQ-S7-004)
  - Full reporting dashboard (per-sprint and per-channel metric views)
  - Ablation study framework: enable/disable individual channels and measure Recall@20 delta per component
  - Acceptance criteria: ablation framework can isolate contribution of at least 1 individual channel (e.g., graph-only vs. vector-only)
  - What T004 needs before becoming implementable: eval infrastructure from Sprint 0/4 operational; per-channel scoring data available
- [ ] T005 Evaluate R5 (INT8 quantization) need [2h] — R5 (REQ-S7-005)
  - Measure: memory count (active with embeddings), p95 search latency, embedding dimensions
  - Activation criteria: >10K memories OR >50ms p95 latency OR >1536 dimensions
  - Document decision with rationale and measured values (document even if criteria NOT met)
  - If implementing: use custom quantized BLOB (NOT `vec_quantize_i8`); preserve original float vectors
  - What T005 needs before becoming implementable: production metrics from Sprint 6 evaluation run
- [ ] T005a Feature flag sunset audit [1-2h] — program completion
  - Inventory all active feature flags across Sprints 0-7
  - Retire or consolidate flags no longer needed
  - Document final flag list with justification for each surviving flag
  - Acceptance criteria: zero sprint-specific temporary flags active at program completion
- [ ] T006 [GATE] Sprint 7 exit gate verification: R8 summary pre-filtering verified (if activated), S1 content quality improved, S5 entity links established, R13-S3 dashboard operational, R5 decision documented, feature flag sunset audit completed [0h] {T001-T005a}
<!-- /ANCHOR:implementation -->

---

<!-- ANCHOR:completion -->
## Program Completion

- [ ] T007 Program completion verification [0h] {T001, T002, T003, T004, T005, T006}
  - [ ] R13-S3 full reporting operational
  - [ ] R13-S3 ablation study framework functional
  - [ ] R8 gating verified (if applicable)
  - [ ] S1 content quality improved (manual review)
  - [ ] S5 entity links established
  - [ ] R5 decision documented
  - [ ] All health dashboard targets reviewed
  - [ ] Final feature flag audit: sunset all sprint-specific flags

---

## Completion Criteria

- [ ] All tasks T001-T007 marked `[x]` (or documented as skipped due to gating condition not met)
- [ ] No `[B]` blocked tasks remaining
- [ ] Sprint 7 exit gate verification (T006) passed
- [ ] Program completion verification (T007) passed
- [ ] All existing tests still passing
- [ ] Feature flag sunset audit (T005a) complete — sprint-specific flags retired or documented
- [ ] All health dashboard targets reviewed
- [ ] Scale gate documented: query result for active-memories-with-embeddings recorded
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:pageindex-xrefs -->
## PageIndex Cross-References (from Earlier Sprints)

- [ ] T-PI-S7 Review and integrate PageIndex patterns from earlier sprints [2-4h] — Cross-reference (non-blocking)
  - PI-A5 (Sprint 0): Incorporate verify-fix-verify pattern into long-horizon quality monitoring and R13-S3 reporting loop
  - PI-B1 (Sprint 5): Apply tree thinning approach to R8 summary generation and R13-S3 ablation traversal for large accumulated spec folders
  - Status: Pending
  - Research evidence: See `9 - analysis-pageindex-systems-architecture.md`, `9 - recommendations-pageindex-patterns-for-speckit.md`, `9 - pageindex-tree-search-analysis.md` in the parent research/ folder
<!-- /ANCHOR:pageindex-xrefs -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- **Parent Tasks**: See `../tasks.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS — Phase 8 of 8 (FINAL)
- 7 tasks: T001-T005 implementation (all parallelizable), T006 exit gate, T007 program completion
- All items independent — no internal dependencies
- R5 decision gate: implement only if activation criteria met
-->
