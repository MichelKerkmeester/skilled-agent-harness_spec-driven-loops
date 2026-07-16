---
title: "Tasks: OFF baseline audit + penalty removal [template:level_1/tasks.md]"
description: "T001-T012 covering measurement, verdict, conditional patch, and verification."
trigger_phrases:
  - "011/001 tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/001-off-baseline-audit"
    last_updated_at: "2026-05-21T12:57:39Z"
    last_updated_by: "cli-codex"
    recent_action: "OFF baseline measured; OFF_DEFICIENT path documented"
    next_safe_action: "Dispatch Phase 2 bge-v2-m3 trial"
    blockers: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: OFF baseline audit + penalty removal

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
| T001 | P0 | Locate rerank benchmark harness via grep in skills/system-spec-kit/ | `[x]` | Harness found at `mcp_server/benchmarks/benchmark-2026-05-20-rerank-ab/scripts/run_arm.py`; package has no `bench:rerank` script |
| T002 | P0 | Identify how to run with reranker OFF (env, CLI arg, or harness mode flag) | `[x]` | OFF mode is `SPECKIT_CROSS_ENCODER=false RERANKER_LOCAL=false --cross-encoder false --reranker-local false` |
| T003 | P1 | Inspect 50-probe fixture for known-weak probe categories (short query → long doc, etc.) | `[x]` | Fixture categories: arc-context 12, paraphrase 27, terminology 11 |
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T004 | P0 | Run OFF baseline; output to evidence/off-baseline-<date>.json | `[x]` | `evidence/off-baseline-2026-05-21.json` |
| T005 | P0 | Compute summary stats (hit-rate@5, NDCG@10, recall@5, per-category) | `[x]` | hit-rate@5 0.12, NDCG@10 0.11, recall@5 0.12 |
| T006 | P0 | Apply verdict thresholds → OFF_ACCEPTABLE / OFF_DEFICIENT | `[x]` | `OFF_DEFICIENT` |
| T007 | P0 | (Patch path) Locate WEIGHT_RERANKER penalty site | `[x]` | Located in `lib/search/confidence-scoring.ts:38` and `:258`; patch skipped due OFF_DEFICIENT |
| T008 | P0 | (Patch path) Apply conditional patch + add isRerankerExpected() helper | `[x]` | N/A — OFF_DEFICIENT path, no source patch |
| T009 | P0 | (Patch path) New vitest asserting requestQuality reflects retrieval quality | `[x]` | N/A — OFF_DEFICIENT path, no vitest added |
| T010 | P0 | (Escalate path) Categorize failures; update Phase 2 spec's §Scope with target metrics | `[x]` | 44 recall misses, 0 ranking inversions, 0 empty results; Phase 2 target table updated |
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T011 | P0 | (Patch path) Vitest exit 0 + focused vitest suites still PASS | `[x]` | N/A — OFF_DEFICIENT path, no patch test required |
| T012 | P0 | Strict-validate this packet + arc parent | `[x]` | packet exit 0; arc parent exit 0 |
| T013 | P0 | Update arc parent _memory.continuity and phase-map | `[x]` | Parent `spec.md` updated; `001` marked Complete |
| T014 | P0 | Commit handoff list: exact paths modified | `[x]` | impl-summary §Commit Handoff |
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All T001-T014 (Patch path) OR T001-T006 + T010 + T012-T014 (Escalate path) with evidence. Both paths produce a documented verdict + clear next action.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- spec.md §4 REQ rows → T001..T014 mapping
- Phase 2 (002-bge-v2-m3-trial) gets target metrics if OFF_DEFICIENT
- Phase 3 (003-domain-tuned-finetune) becomes superseded if OFF_ACCEPTABLE
- Sibling packet `005-cross-cutting-quality/008-spec-memory-vitest-stabilization/` — the new vitest here is NEW, not part of the 168-failure baseline
<!-- /ANCHOR:cross-refs -->
