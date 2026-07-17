---
title: "Implementation Plan: Causal Relation-Coverage Reporting Honesty"
description: "One reporter edit (implemented:false, command:null, honest hint) plus unit + integration test coverage, then a daemon rebuild + recycle (shared with #2)."
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/019-causal-relation-coverage-honesty"
    last_updated_at: "2026-06-04T09:45:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Reporter corrected; tests green; build clean"
    next_safe_action: "Commit + deploy with #2"
    blockers: []
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Causal Relation-Coverage Reporting Honesty

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

A single source edit to the relation-coverage reporter to stop advertising a non-existent backfill, plus test coverage locking the honest contract. No behavior change beyond the reported `relationCoverage` shape + hint text.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- Daemon TypeScript builds clean.
- New unit test + updated integration test green; broader causal suite unaffected.
- Comment hygiene clean (no spec-paths/packet ids in code comments).
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

`lib/causal/relation-coverage.ts` — `RelationCoverageState.backfillJob` gains `implemented: boolean` and widens `command` to `string | null`; `buildRelationCoverageState` returns `implemented:false`, `command:null`, and a `remediationHint` that names the real mechanism. `backfillJob.name` is retained. Consumed by `handlers/causal-graph.ts` (surfaces `remediationHint` + the full `relationCoverage`).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Change | Activation |
|---------|--------|-----------|
| `mcp_server/lib/causal/relation-coverage.ts` | honest backfillJob + hint | dist rebuild + recycle |
| `mcp_server/tests/relation-coverage-unit.vitest.ts` | new unit coverage | n/a |
| `mcp_server/tests/causal-stats-output.vitest.ts` | honest-contract assertions | n/a |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

1. Edit reporter (implemented:false, command:null, honest hint) — DONE.
2. Add unit test + integration assertions — DONE.
3. Build + run tests — DONE (5 tests across 2 files green; build clean).
4. Commit.
5. Deploy with #2 (daemon rebuild + recycle); verify `memory_causal_stats` hint.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- `relation-coverage-unit.vitest.ts`: implemented:false/command:null; below-target honest hint (no `autoRepair`); null hint when met; no_edges when empty.
- `causal-stats-output.vitest.ts`: implemented:false/command:null + surfaced hints contain no `autoRepair`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `handlers/causal-graph.ts` (consumer) — relies on `remediationHint` + `relationCoverage` shape; unaffected by the additive `implemented` field.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- `git revert` the commit; reporter change reverts on the next dist rebuild + recycle. No data migration, no state change — purely the reported shape/text.
<!-- /ANCHOR:rollback -->
