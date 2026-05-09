---
title: "Tasks: 027/003 Code Graph Impact Analysis"
description: "Task list for file-level impact scoring, deterministic normalization, coverage evidence, and explicit enrichment provider options."
trigger_phrases:
  - "027 003 impact tasks"
  - "code graph impact analysis tasks"
importance_tier: "important"
contextType: "task"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-code-graph-impact-analysis"
    last_updated_at: "2026-05-09T06:00:00Z"
    last_updated_by: "codex"
    recent_action: "Aligned tasks.md with manifest anchors and pt-02 scoring/provider amendments"
    next_safe_action: "Implement deterministic impact analysis baseline first"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-09-027-alignment-fix"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Choose fixed caps or graph-baseline semantics for normalizers."
    answered_questions:
      - "LLM enrichment defaults to provider none."
---
# Tasks: 027/003 Code Graph Impact Analysis

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

- [ ] T001 Define impact output schema with `affected_files`, `risk_scores`, `summary`, and enrichment status.
- [ ] T002 Define deterministic normalizer strategy for fan-in, hub degree, and transitive depth.
- [ ] T003 Define enrichment options object and default `provider: "none"` behavior.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Create `mcp_server/code_graph/lib/code-graph-impact-analysis.ts`.
- [ ] T005 Implement `getNodesForFile(filePath, db)` and file-level edge aggregation over all matching `CodeNode` rows.
- [ ] T006 Compute fan-in, fan-out, hub degree, edge confidence, and coverage evidence from symbol-level graph APIs.
- [ ] T007 Read incoming `TESTED_BY` edges with `queryEdgesTo(productionSymbol.id, 'TESTED_BY')`.
- [ ] T008 Emit `coverageUnknownOrMissing` or `{hasTestEdge, coverageEvidence}` when no graph evidence exists.
- [ ] T009 Implement `normalizeFanIn`, `normalizeHubDegree`, and `normalizeTransitiveDepth`.
- [ ] T010 Implement 3-hop BFS with explicit visited set in the new module.
- [ ] T011 Implement `applyRiskFormula()` with heuristic weight labels.
- [ ] T012 Create `handlers/impact-analysis.ts` and register `code_graph_impact_analysis`.
- [ ] T013 Add optional `includeRisk=true` integration to `handlers/detect-changes.ts`.
- [ ] T014 Implement optional layer fallback as unavailable/null when Phase 001 is absent.
- [ ] T015 Implement optional LLM provider interface with explicit provider, timeout, budget, cache, and redaction options.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T016 Add multi-symbol file aggregation tests.
- [ ] T017 Add deterministic normalizer snapshot tests.
- [ ] T018 Add TESTED_BY fixture with supported sibling layout and unsupported layout.
- [ ] T019 Add BFS depth and cycle fixture.
- [ ] T020 Add skipped-provider output test for default enrichment.
- [ ] T021 Add CLI provider hardening contract tests if CLI enrichment remains in scope.
- [ ] T022 Run `npm run check`.
- [ ] T023 Run `npx vitest run code-graph-impact-analysis.vitest.ts --coverage` and confirm >=80% coverage.
- [ ] T024 Run strict validation for this spec folder.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] Deterministic baseline is complete without any remote provider.
- [ ] Risk scores are reproducible for unchanged graph state.
- [ ] Coverage absence is represented as unknown-or-missing, not proven untested.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Research**: `../research/027-xce-research-based-refinement-pt-02/research.md`
<!-- /ANCHOR:cross-refs -->
