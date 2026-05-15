---
title: "Deep Review: Extracted Skills Isolation Arc (commits 6fd5934f → 339134df)"
description: "20-iter autonomous deep-review via Devin CLI + SWE-1.6 on the full isolation-arc work shipped this session: 015 research + 016 Phase 1 + 020 Phases 2/3/4 + cleanup commits (22-- rename, structural-contract test rewrite)."
trigger_phrases:
  - "017 isolation arc deep review"
  - "isolation deep review swe-1.6"
  - "devin deep review isolation"
  - "015 016 020 deep review"
importance_tier: "important"
contextType: "review"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/017-isolation-arc-deep-review"
    last_updated_at: "2026-05-15T10:30:00Z"
    last_updated_by: "main-agent"
    recent_action: "Scaffolded review packet; dispatching 20-iter Devin/SWE-1.6 deep-review on the isolation arc"
    next_safe_action: "Wait for Devin convergence; synthesize P0/P1/P2 findings; commit"
    blockers: []
    key_files:
      - "spec.md"
      - "review/review-report.md (to be authored by Devin)"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000170026"
      session_id: "017-isolation-arc-deep-review"
      parent_session_id: null
    completion_pct: 5
    open_questions:
      - "Are the inlined helpers in spec-kit (compact-merger, budget-allocator, runtime-detection) actually trivial enough to justify duplication?"
      - "Does the code-graph-boundary wrapper hide enough surface that future spec-kit work can't accidentally re-couple?"
      - "Is the readiness-marker pattern resilient against partial writes or stale state?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Isolation Arc Deep Review

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 (review quality + adversarial pass on architectural change) |
| **Status** | review-in-progress |
| **Created** | 2026-05-15 |
| **Branch** | main |
| **Parent** | `026-graph-and-context-optimization/` |
| **Phase** | 017 |
| **Reviewer** | Devin CLI + Cognition SWE-1.6 |
| **Commit Range** | `6fd5934f` → `339134df` (the isolation arc) |
| **Iteration Budget** | 20 |
| **Evidence Dir** | `review/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The isolation arc shipped 8+ commits over a single session implementing the 015 research recommendation. The work touched ~150 files across system-spec-kit, system-code-graph, and system-skill-advisor. Components included:
  - New shared types package (`system-spec-kit/shared/` exposed as `@spec-kit/shared`)
  - New boundary wrapper (`mcp_server/lib/code-graph-boundary.ts`)
  - Inlined helpers (compact-merger, budget-allocator, runtime-detection, codex-hook-policy)
  - Readiness marker pattern (`system-code-graph/mcp_server/lib/readiness-marker.ts` + spec-kit-side reader)
  - 14 test moves, 11 doc moves, 14 line tsconfig + vitest config edits
  - 22-- directory rename with 41 cross-ref sed updates
  - Structural-contract test rewrite with boundary mocking

Some of this was synthesized from the 015 research; some was operator parallel work (the 020 packet); some emerged from cleanup tasks. The aggregate change passes the literal "zero source imports" criterion but the architectural quality, edge cases, and long-term maintainability haven't been adversarially examined.

### Purpose

Run a 20-iteration autonomous deep-review via Devin/SWE-1.6 covering all 5 standard dimensions (correctness, security, traceability, maintainability, plus an arc-specific dimension: future-coupling-resistance). Produce P0/P1/P2 findings with file:line citations. Adversarially challenge each architectural choice (boundary wrapper vs MCP-only, inlined helpers vs shared lib, readiness marker vs synchronous queries). Recommend remediation packets if any P0/P1 findings emerge.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (review surface)

The commit range `6fd5934f..339134df` inclusive of the operator's parallel-track commits that fell in this window:

  - `6fd5934f6` docs(026/015): deep-research output (research/research.md + 6 iteration files)
  - `ff526411f` refactor(026/016): Phase 1 skill-advisor isolation (tsconfig + vitest + 11 file moves + 016 packet)
  - `276c1a930` docs(readme): tool-count update (operator parallel, light review)
  - `125976a9a` refactor(026/020): Phase 2+3 hybrid (boundary wrapper + readiness marker + shared types + 60 modified .ts files + 14 test moves)
  - `e00930347` docs(026/020): Phase 4 doc/playbook migration
  - `ba5e108a0` + `e06e6da49` 020 finalize + trim
  - `1d5907b38` chore(spec-kit): 22--context-preservation-and-code-graph → 22--context-preservation rename + 41 cross-ref sed updates
  - `ff91ddfe4` test(advisor): manual-playbook fixture refresh (operator parallel)
  - `0dba8febf` test(spec-kit): structural-contract.vitest rewrite (16/16 PASS)
  - `35893e57c` feat(021): code_graph_classify_query_intent MCP tool + spec-kit shim replacement
  - `339134df1` feat(007/035): sk-doc-aligned READMEs for code-graph code folders

### Review Dimensions

  - **Correctness**: Does the boundary wrapper actually mediate all cross-skill access? Are inlined helpers semantically equivalent to their code-graph originals? Does the readiness marker handle stale/partial-write states? Does the rewritten structural-contract.vitest preserve the original intent under mocks?
  - **Security**: Does the readiness-marker file path traversal-safe? Are subprocess invocations (boundary wrapper → MCP) injection-safe?
  - **Traceability**: Are spec-doc continuity fields consistent across the 4 packets (015, 016, 020, 017)? Do cross-references survive the 22-- rename?
  - **Maintainability**: Is the boundary wrapper crisp enough to discourage future re-coupling? Are inlined helpers documented as "intentionally duplicated"? Does the shared types package establish a clear contract?
  - **Future-coupling-resistance (arc-specific)**: How easily could a future PR add a new `import.*system-code-graph` line in spec-kit? Is there a CI check or eslint rule that would prevent it? If not, recommend one.

### Out of Scope

- The deeper architectural decisions (Strategy C vs A/B/D/E) — those were settled in 015 research's adversarial pass
- Style/format issues that aren't relevant to correctness or maintainability
- Performance benchmarking (no claim was made about MCP-call latency in the shipped work)
- Operator's parallel-track commits OUTSIDE the isolation arc (mk-spec-memory tool drop, manual-playbook fixture refresh) — only light review for collateral impact
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Review deliverables

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 11 isolation-arc commits reviewed end-to-end | review-report.md cites each commit with concrete findings or PASS confirmation |
| REQ-002 | Boundary wrapper adversarially tested | At least 3 scenarios where the wrapper might fail to mediate: concurrent access, missing marker, daemon mid-restart |
| REQ-003 | Inlined-helper equivalence verified | Each inlined helper (compact-merger, budget-allocator, runtime-detection, codex-hook-policy) checked against its code-graph origin for behavioral drift |
| REQ-004 | Readiness-marker resilience | Stale-marker, write-during-read, missing-file, malformed-JSON scenarios examined |
| REQ-005 | Findings rated P0/P1/P2 with file:line | Each finding cites exact location |
| REQ-006 | Recommendation per finding | Concrete remediation OR explicit deferral with reason |
| REQ-007 | Future-coupling-resistance check | Is there a CI / eslint / pre-commit hook preventing reintroduction of cross-skill imports? Recommend if absent |
| REQ-008 | Convergence | Iteration count ≤ 20 OR new-finding ratio ≤ 0.10 (rolling avg over last 3) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `review/review-report.md` exists with sections: Executive Summary, Per-Commit Review, Finding Registry, Risk Register, Adversarial Pass, Recommendations
- **SC-002**: ≥10 iterations completed OR convergence reached with documented stop reason
- **SC-003**: Each P0/P1 finding has a concrete remediation path
- **SC-004**: Operator can read the report and decide GO / CONDITIONAL / BLOCK on the isolation arc
- **SC-005**: At least 1 future-coupling-prevention recommendation (CI rule / eslint / hook) surfaced
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:complexity -->
## 6. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 19/25 | 11 commits, ~150 files, multi-skill architecture |
| Risk | 13/25 | Review-only; no code mutations expected outside review/ |
| Research | 18/20 | 20-iter loop on SWE-1.6 |
| **Total** | **50/70** | **Level 2** review packet |
<!-- /ANCHOR:complexity -->
