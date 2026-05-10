---
title: "Phase 004 — Risk-Scored Impact Analysis (`code_graph_impact_analysis`)"
description: "ADAPT XCE's xce_impact_analysis. Wrap detect_changes with deterministic file-level risk signals, explicit normalization, incoming TESTED_BY coverage evidence, and optional provider-configured narrative enrichment. New code_graph_impact_analysis MCP tool. ~430-570 LOC with pt-02 correctness fixtures."
trigger_phrases:
  - "027 phase 004"
  - "code-graph impact analysis"
  - "code_graph_impact_analysis"
  - "impact analysis"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-code-graph-impact-analysis"
    last_updated_at: "2026-05-08T15:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded 027/004 phase from sub-packet-proposals.md Proposal 3"
    next_safe_action: "Implement code-graph-impact-analysis.ts (works independently of Phase 003)"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-4-7-2026-05-08-027-004"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: code_graph_impact_analysis — Risk-Scored Impact Analysis

<!-- SPECKIT_LEVEL: 2 -->

---

## EXECUTIVE SUMMARY

Implement the deterministic risk-scored impact analysis proposed in 027 RQ3 (`../research/iterations/iteration-003.md` F-019) with pt-02 corrections from `../research/027-xce-research-based-refinement-pt-02/research.md`. A new `mcp_server/code_graph/lib/code-graph-impact-analysis.ts` wraps the existing `detect_changes` handler and enriches its output with deterministic file-level risk signals aggregated across all CodeNode rows for each file. Exposed as a new `code_graph_impact_analysis` MCP tool. Optional narrative enrichment is disabled by default and requires explicit provider configuration.

ADAPT verdict from findings.md item #3.

**5 Deterministic Risk Signals**:
1. **fan-in** — aggregate incoming symbol-level edges across all CodeNode rows for the file
2. **fan-out** — aggregate outgoing symbol-level edges across all CodeNode rows for the file
3. **hub centrality** — `queryFileDegrees(filePath)` total connectedness
4. **coverage evidence gap** — incoming `TESTED_BY` edges to production symbols, reported as unknown/missing when absent
5. **edge confidence** — average `metadata.confidence` from `code_edges` (DEFAULT_EDGE_WEIGHTS as floor)

**Risk score formula** (heuristic, tunable):
```
risk = normalize(fanIn) * 0.35
     + normalize(hubDegree) * 0.25
     + (coverageUnknownOrMissing ? 1.0 : 0.0) * 0.25
     + normalize(transitiveDepth) * 0.15
```

**Key Decisions**:
- **Deterministic baseline first; narrative enrichment opt-in via explicit provider options**.
- **Risk weights are tunable constants** — Phase 006 eval harness validates them against labeled tasks.
- **No new tables for MVP** — uses existing query helpers.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Spec-Scaffolded |
| **Parent Packet** | `027-xce-research-based-refinement` |
| **Source** | `../research/sub-packet-proposals.md` Proposal 3; `../research/iterations/iteration-003.md`; pt-02 amendments in `../research/027-xce-research-based-refinement-pt-02/` |
| **Optional dep** | `027/003-code-graph-hld-lld` (for layer-based criticality in LLM enrichment) |
| **Optional dep** | `027/004-code-graph-trace` (for trace-based downstream narrative) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

XCE's `xce_impact_analysis` (external/README.md:220-227) returns affected modules + downstream dependencies + risk assessment for a changed-file set. Our `detect_changes` handler (handlers/detect-changes.ts:40-50) returns affected symbols only — zero risk signals. Iteration-003 F-019 confirms 5 deterministic risk signals are computable from existing graph data without LLM dependency.

**Purpose**: ship a single MCP tool that takes a changed-file list and returns affected files + risk scores + optional LLM-enriched narrative — closing the impact-analysis gap with XCE while preserving local-first determinism.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- New `mcp_server/code_graph/lib/code-graph-impact-analysis.ts` (~200 LOC):
  - `analyzeImpact(changedFiles[], db, opts)` → `{affected_files[], risk_scores[], summary}`
  - Risk-signal computation by file-level aggregation over symbol-level `queryEdgesFrom/To`, plus `queryFileDegrees` and import dependents.
  - Risk score formula application.
  - BFS for transitive depth capped at 3 hops with an explicit visited set.
- New handler `mcp_server/code_graph/handlers/impact-analysis.ts` (~80 LOC) with zod schema + readiness gate reuse.
- Tool registration `mcp_server/code_graph/tools/code-graph-tools.ts` (+3 LOC).
- Edit `mcp_server/code_graph/handlers/detect-changes.ts` (+50 LOC) to optionally pass through risk signals.
- Optional `mcp_server/code_graph/lib/code-graph-llm-risk-enrich.ts` (~80 LOC) narrative adapter behind `{enabled, provider, model?, timeoutMs?, maxCallsPerSession?, maxInputBytes?, cacheKey?}`.
- Tests `mcp_server/tests/code-graph-impact-analysis.vitest.ts` (~120 LOC, ≥80% coverage).

### Out of Scope
- Real-time edge-drift tracking (requires `code_edge_snapshots` table — future enhancement).
- Change-intent classification (narrative-provider only, disabled by default).
- Cross-repository impact tracing.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `analyzeImpact(changedFiles[], db)` returns `{affected_files[], risk_scores[], summary}` | Output schema validated via zod parse |
| REQ-002 | **5 risk signals computed deterministically from existing graph data after file-level aggregation over all `CodeNode` rows for each affected file** | Unit test asserts each signal value for a fixture db; aggregation walks every CodeNode whose `filePath` matches each affected file. (Amended per B-iter003-001/iter009-001.) |
| REQ-003 | **Risk score formula uses documented tunable weights and deterministic normalizers; default weights are labeled `heuristic` until Phase 006 calibration** | Constants centralized in module-level `RISK_WEIGHTS = {fanIn:0.35, hubDegree:0.25, untested:0.25, transitive:0.15}`; output rows label `weight_class: "heuristic"` until 005 calibration. (Amended per B-iter003-002.) |
| REQ-004 | New MCP tool `code_graph_impact_analysis` registered + handler dispatches | `opencode mcp list` shows tool |
| REQ-005 | BFS transitive depth capped at 3 hops | Trace doesn't expand beyond depth 3 even with deep graphs |
| REQ-006 | Vitest ≥80% line coverage | `--coverage` output |
| **REQ-009** | **Deterministic normalization** | Define `normalizeFanIn`, `normalizeHubDegree`, and `normalizeTransitiveDepth` with fixed caps OR documented graph-baseline semantics; outputs MUST remain reproducible for unchanged graph state. (Resolves B-iter003-002.) |
| **REQ-010** | **File-level aggregation** | `fanIn`, `fanOut`, `hubDegree`, `edgeConfidence`, AND coverage signals MUST aggregate symbol-level edges by file and dedupe connected files. NO direct `queryEdgesTo(filePath)` / `queryEdgesFrom(filePath)` (those operate on symbol IDs, not file paths). (Resolves B-iter003-001 + B-iter009-001.) |
| **REQ-011** | **TESTED_BY direction** | Coverage evidence for production files MUST use **incoming** `TESTED_BY` edges via `queryEdgesTo` across production symbols (because the edge points test→production in the indexer). (Resolves B-iter003-005 + B-iter007-003.) |
| **REQ-012** | **Coverage evidence class** | Absence of `TESTED_BY` MUST be represented as `coverageUnknownOrMissing` OR `{hasTestEdge, coverageEvidence}`; absence MUST NOT be described as "proven untested". (Resolves B-iter003-005.) |
| **REQ-013** | **BFS depth implementation** | The 3-hop cap MUST be enforced in the NEW impact-analysis BFS loop with an explicit `visited` set; do NOT rely on `queryFileImportDependents()` to apply a LIMIT (it returns flat 1-hop only). (Resolves B-iter003-003 + B-iter009-005.) |

### P1
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | **Optional LLM enrichment is disabled unless explicit provider configuration is supplied; disabled output remains complete and deterministic** | Default `provider: "none"` → `narrative: null` + complete deterministic risk_scores. (Amended per B-iter003-007 + B-iter007-004.) |
| REQ-008 | Risk weights tunable via env or config | `RISK_WEIGHTS` overridable for Phase 006 eval harness validation |
| **REQ-014** | **Enrichment options contract** | Replace boolean-only `enrichWithLLM` with `{enabled, provider, model?, timeoutMs?, maxCallsPerSession?, maxInputBytes?, cacheKey?}`. (Resolves B-iter003-007 + B-iter009-007.) |
| **REQ-015** | **Layer fallback** | If Phase 002 layer data is unavailable, emit `{source: "unavailable", value: null}` OR omit layer weighting; do NOT invent a second local layer classifier. (Resolves B-iter006-005.) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: AI calling `code_graph_impact_analysis({changedFiles: ["src/auth/middleware.ts"]})` receives `{affected_files: [...], risk_scores: [{file, score, signals: {fanIn, fanOut, hub, coverageEvidence, edgeConfidence}}], summary}` with risk scores in [0..1].
- **SC-002**: Zero LLM dependency for default mode (deterministic baseline).
- **SC-003**: `npm run check` green; `vitest` ≥80% coverage.
- **SC-004**: Phase 006 eval harness can baseline-vs-after on this tool's output.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Risk score formula is unvalidated — weights are design intuition | Medium | Document as heuristic; weights tunable; Phase 006 eval validates |
| Risk | Transitive import BFS expensive on large graphs | Medium | Cap BFS at 3 hops with explicit visited set (REQ-013); does NOT rely on query LIMIT |
| Risk | LLM enrichment latency + cost | Low | Opt-in only via `provider: "none"` default; deterministic baseline always complete |
| **Risk** | **Scores reproducible in code but misleading in interpretation if heuristic weights presented as validated** | Medium | Output labels `weight_class: "heuristic"` until Phase 006 calibration; documented in REQ-003 + Phase 006 dependency |
| **Risk** | **Coverage absence can overstate risk for unsupported test layouts** (e.g., `__tests__/foo.test.ts`, integration suites) | Medium | `coverageEvidence` class records absence as unknown-or-missing, NOT "proven untested" (REQ-012) |
| **Risk** | **Optional LLM enrichment can silently introduce remote dependency** | Medium | Default `provider: "none"` → skipped; explicit budgets on `timeoutMs/maxCallsPerSession/maxInputBytes` (REQ-014) |
| **Risk** | **CLI enrichment inherits subprocess lifecycle failure modes** (stdin deadlock, unkilled child) | High | If CLI provider used, MUST reuse Phase 006 hardening contract (subprocess dispatcher helper, timeouts, SIGTERM/SIGKILL escalation) |
| Dependency | Existing `detect_changes`, `queryEdgesFrom/To` (symbol-level), `queryFileDegrees`, `queryFileImportDependents` | Internal | Already shipped, stable; symbol-level edge queries are aggregated per file via REQ-010 |
| Dependency | Phase 002 REQ-015 (`classifyFileRole(filePath, db)` exported) for optional layer weighting | Internal | If Phase 002 layer data unavailable, emit `unavailable/null` per REQ-015 |
| Dependency | Phase 006 subprocess dispatcher helper (if CLI enrichment kept in scope) | Internal | Avoids re-implementing subprocess lifecycle for CLI provider |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

- **NFR-P01**: `analyzeImpact()` <500ms p95 for changed-file set ≤5 files on 10k-symbol graph.
- **NFR-R01**: Returns structured `{ok: false, error}` on missing files; never throws.
- **NFR-M01**: Risk weights centralized in module constants for easy tuning.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Changed file not in graph: skip with warning; no risk score for it.
- File with 0 incoming edges: `fanIn=0`, score weighted accordingly.
- File with no `TESTED_BY` edges: emit `coverageUnknownOrMissing` or explicit `coverageEvidence`; do not claim the file is proven untested.
- Cycle detection in BFS: track visited set to prevent infinite recursion.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score |
|-----------|-------|
| Scope (1 lib + 1 handler + edits + optional LLM adapter + 5 new P0 + 2 new P1 REQs + tests) | 19/25 |
| Risk (heuristic formula, BFS cost, file-level aggregation correctness, TESTED_BY direction) | 11/25 |
| Research (already done) | 2/20 |
| **Total** | **32/70** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- LLM enrichment provider: none, cli-opencode subprocess, or direct API? (Default: `provider: "none"`; any provider must be explicit.)
- Risk weight defaults validated empirically? (Default: ship as design intuition; Phase 006 eval validates and tunes.)
<!-- /ANCHOR:questions -->
