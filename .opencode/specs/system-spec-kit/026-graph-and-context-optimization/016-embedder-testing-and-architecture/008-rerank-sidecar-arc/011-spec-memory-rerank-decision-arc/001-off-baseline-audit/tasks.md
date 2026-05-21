---
title: "Tasks: OFF baseline audit + penalty removal [template:level_1/tasks.md]"
description: "T001-T012 covering measurement, verdict, conditional patch, and verification."
trigger_phrases:
  - "011/001 tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/001-off-baseline-audit"
    last_updated_at: "2026-05-21T13:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Tasks scaffolded"
    next_safe_action: "Dispatch cli-codex to execute Phase A"
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
| T001 | P0 | Locate rerank benchmark harness via grep in skills/system-spec-kit/ | `[ ]` | (pending) |
| T002 | P0 | Identify how to run with reranker OFF (env, CLI arg, or harness mode flag) | `[ ]` | (pending) |
| T003 | P1 | Inspect 50-probe fixture for known-weak probe categories (short query → long doc, etc.) | `[ ]` | (pending) |
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T004 | P0 | Run OFF baseline; output to evidence/off-baseline-<date>.json | `[ ]` | evidence/ path |
| T005 | P0 | Compute summary stats (hit-rate@5, NDCG@10, recall@5, per-category) | `[ ]` | impl-summary §Baseline Numbers |
| T006 | P0 | Apply verdict thresholds → OFF_ACCEPTABLE / OFF_DEFICIENT | `[ ]` | impl-summary §Verdict |
| T007 | P0 | (Patch path) Locate WEIGHT_RERANKER penalty site | `[ ]` | impl-summary §Penalty Site (file:line) |
| T008 | P0 | (Patch path) Apply conditional patch + add isRerankerExpected() helper | `[ ]` | git diff |
| T009 | P0 | (Patch path) New vitest asserting requestQuality reflects retrieval quality | `[ ]` | tests/<new-file> exit 0 |
| T010 | P0 | (Escalate path) Categorize failures; update Phase 2 spec's §Scope with target metrics | `[ ]` | 002-bge-v2-m3-trial/spec.md diff |
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T011 | P0 | (Patch path) Vitest exit 0 + focused vitest suites still PASS | `[ ]` | exit codes captured |
| T012 | P0 | Strict-validate this packet + arc parent | `[ ]` | both exit 0 |
| T013 | P0 | Update arc parent _memory.continuity and phase-map | `[ ]` | 011 spec.md diff |
| T014 | P0 | Commit handoff list: exact paths modified | `[ ]` | impl-summary §Commit Handoff |
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
