---
title: "Tasks: opt-in-only closure [template:level_1/tasks.md]"
description: "T001-T016: code patch + supersede sweep + arc closure."
trigger_phrases:
  - "011/005 tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/005-opt-in-only-closure"
    last_updated_at: "2026-05-21T15:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Tasks scaffolded"
    next_safe_action: "Dispatch"
    blockers: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: opt-in-only closure

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`[x]` complete, `[ ]` open. P-tag: P0 / P1.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T001 | P0 | Read search-flags.ts to confirm SPECKIT_CROSS_ENCODER default + comment line numbers | `[x]` | `search-flags.ts:99-108` updated default-off comment and accessor |
| T002 | P0 | Read confidence-scoring.ts:38/250/258 to confirm penalty application | `[x]` | `confidence-scoring.ts:39,251,256-262` |
| T003 | P0 | grep for all WEIGHT_RERANKER + rerankerFactor references | `[x]` | `rg "WEIGHT_RERANKER|rerankerFactor"` found constant, factor, and one application only |
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T004 | P0 | Flip SPECKIT_CROSS_ENCODER default true→false + update inline comment | `[x]` | `search-flags.ts:99-108` |
| T005 | P0 | Add isRerankerExpected() helper + docstring + export | `[x]` | `search-flags.ts:111-126` |
| T006 | P0 | Wrap WEIGHT_RERANKER penalty in isRerankerExpected() guard | `[x]` | `confidence-scoring.ts:27,256-262` |
| T007 | P0 | Write tests/scoring-opt-in.vitest.ts with 3 cases | `[x]` | `tests/scoring-opt-in.vitest.ts:70-107` |
| T008 | P0 | Run new vitest → exit 0 | `[x]` | `npx vitest run tests/scoring-opt-in.vitest.ts`: 3 passed |
| T009 | P0 | Supersede sweep: 7 packets (011/002, 011/003, 011/004, 008/005, 008/007, 008/008, 008/009) | `[x]` | 7 frontmatter updates + 7 `graph-metadata.json` updates; all strict-validated exit 0 |
| T010 | P0 | Update 011 arc parent spec.md + graph-metadata | `[x]` | 011 parent phase map closed; `derived.status=complete`; strict-validate exit 0 |
| T011 | P0 | Update 008 arc parent spec.md + graph-metadata | `[x]` | 008 parent phase map updated; `derived.last_active_child_id` points to 011 arc; strict-validate exit 0 |
| T012 | P0 | Update spec-memory SKILL.md with "Reranking (opt-in)" section | `[x]` | `.opencode/skills/system-spec-kit/SKILL.md:377-379` |
| T013 | P0 | Update sidecar SKILL.md with consumer clarification | `[x]` | `.opencode/skills/system-rerank-sidecar/SKILL.md:12,222` |
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T014 | P0 | Strict-validate all 9 affected packets | `[x]` | 10 listed paths validated exit 0: 011/005, seven superseded packets, 011 parent, 008 parent |
| T015 | P0 | Existing vitest failure count <= 168 (no new regressions) | `[x]` | Full suite after fix: 157 failed, below <=168 baseline ceiling |
| T016 | P0 | Fill implementation-summary.md sections + Commit Handoff | `[x]` | `implementation-summary.md` filled with code changes, tests, sweep, closure, verification, and path handoff |
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All T001-T016 with evidence. Strict-validate exit 0 across the supersede sweep.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- spec.md §3 §In Scope items 1-16 map to T004-T013
- 011 arc parent closes after T010 lands
- 008 arc parent's 011 row marked Complete after T011
<!-- /ANCHOR:cross-refs -->
