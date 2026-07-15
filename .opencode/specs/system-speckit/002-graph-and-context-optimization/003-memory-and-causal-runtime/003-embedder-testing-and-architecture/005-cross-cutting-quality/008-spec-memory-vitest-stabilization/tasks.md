---
title: "Tasks: spec-memory vitest stabilization [template:level_1/tasks.md]"
description: "Task breakdown for the 5-cluster vitest stabilization work."
trigger_phrases:
  - "008 vitest tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/008-spec-memory-vitest-stabilization"
    last_updated_at: "2026-05-21T13:50:00Z"
    last_updated_by: "main_agent"
    recent_action: "Tasks scaffolded"
    next_safe_action: "Begin Phase A (cluster 1) when operator opts in"
    blockers: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: spec-memory vitest stabilization

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
| T001 | P0 | Baseline failure count: `npx vitest run tests/ 2>&1 \| tail -5` captures pass/fail counts | `[ ]` | (pending) |
| T002 | P0 | Sample 3 representative failures per cluster (15 total) and copy to implementation-summary §Root Cause draft | `[ ]` | (pending) |
| T003 | P1 | Verify focused Dispatch C suites still PASS (skill-advisor 34 + spec-kit 10 + pytest 4) | `[ ]` | (pending) |
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T004 | P0 | Phase A: Fix Cluster 1 mock exports (stage1-expansion.vitest.ts, 13 tests) | `[ ]` | tests/stage1-expansion.vitest.ts patched; vitest exit 0 |
| T005 | P0 | Phase B: Fix Cluster 5 flag/config drift (4 tests) | `[ ]` | flag tests pass |
| T006 | P0 | Phase C: Fix Cluster 3 lease timeouts (7 tests) | `[ ]` | 3 consecutive runs all 7 pass |
| T007 | P0 | Phase D: Fix or quarantine Cluster 2 MCP connection failures (25 tests) | `[ ]` | runtime-routing exits 0 (or 25 .skip with reasons) |
| T008 | P0 | Phase E: Sample + fix or quarantine Cluster 4 assertion drift (127 tests) | `[ ]` | ≥64 newly-green OR plan-documented quarantine |
| T009 | P1 | Update CI/pre-commit gate to run vitest | `[ ]` | INSTALL_GUIDE or .git/hooks updated |
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T010 | P0 | Full `npx vitest run tests/` exits 0 | `[ ]` | exit 0 captured |
| T011 | P0 | Document each cluster's root cause in implementation-summary §Root Cause | `[ ]` | §Root Cause has 5 subsections |
| T012 | P0 | Strict-validate this packet | `[ ]` | exit 0 |
| T013 | P0 | Strict-validate arc parent (005-cross-cutting-quality) | `[ ]` | exit 0 |
| T014 | P0 | Commit `feat(016/005/008): spec-memory vitest stabilization — <PARTIAL\|COMPLETE>` | `[ ]` | git log |
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All T001-T014 with evidence. PARTIAL is acceptable if Cluster 4 doesn't fully close; document remaining failures as `.skip` with reason comments.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- spec.md §4 REQ rows → T001..T014 mapping
- The 016 deep-research synthesis at `013-embedder-testing-and-architecture/research/research.md` flagged this work as deferred
- Codex Dispatch C's verification snippet (focused suites that still pass): `.opencode/specs/.../008-rerank-sidecar-arc/.../implementation-summary.md`
- Sibling packets: `005-cross-cutting-quality/001-playbook-quality-audit/`, `005-cross-cutting-quality/002-deep-review-stack/`
<!-- /ANCHOR:cross-refs -->
