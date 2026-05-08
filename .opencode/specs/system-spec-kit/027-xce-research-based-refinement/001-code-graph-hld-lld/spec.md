---
title: "Phase 001 — Deterministic HLD/LLD Narrative Generation for code_graph"
description: "Implement the headline ADOPT from the 027 XCE research adoption matrix: a template-only HLD/LLD narrative layer that emits per-file architectural descriptions and per-symbol low-level details from existing code_graph data. Zero LLM dependency for MVP, zero schema migration, ~250 LOC. New code_graph_hld_lld MCP tool plus integration into the queryMode:'omni' combiner."
trigger_phrases:
  - "027 phase 001"
  - "code-graph hld-lld"
  - "code-graph narrative"
  - "code_graph_hld_lld"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-code-graph-hld-lld"
    last_updated_at: "2026-05-08T15:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded 027/001 phase from sub-packet-proposals.md Proposal 1"
    next_safe_action: "Implement code-graph-hld-lld.ts + handler + tool reg + omni integration"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-4-7-2026-05-08-027-001"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Deterministic HLD/LLD Narrative for code_graph

<!-- SPECKIT_LEVEL: 2 -->

---

## EXECUTIVE SUMMARY

Build a template-only HLD/LLD narrative layer over the existing code_graph SQLite data so the MCP server can return architecturally-narrated context (per-file role/layer/summary, per-symbol signature/dependencies) instead of just raw symbols and edges. This is the headline ADOPT from the 027 XCE research adoption matrix (Findings.md item #1, item #8 PRAT-Abstract stage) — XCE's only genuinely new capability that we lack today.

Implementation is deterministic: every output field derives from data already in `code_files` / `code_nodes` / `code_edges` (plus existing query helpers in `code-graph-db.ts`). No LLM call required for MVP. No schema migration. Optional future extension: LLM-narrated summaries layered on top of the deterministic baseline (out of scope for this phase).

**Key Decisions in this Spec**:
- **Template-only baseline first**, LLM enrichment later in a separate phase. The deterministic baseline is a hard requirement; LLM is additive.
- **One new lib + one new handler + one tool registration edit + one omni integration edit.** ~250 LOC total.
- New MCP tool `code_graph_hld_lld` exposed alongside the existing `code_graph_context`.
- Integration with the omni combiner (027 Phase 004 fold-in path) handled here so phases 002/003/004 don't need to re-touch HLD/LLD generation.

**Critical Constraints**:
- No changes to `structural-indexer.ts` or `tree-sitter-parser.ts` — generation only, parsing is upstream.
- No new dependencies, no schema migration.
- Output format MUST be JSON-serializable (MCP wire compatibility).

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Spec-Scaffolded |
| **Created** | 2026-05-08 |
| **Branch** | `main` |
| **Parent Packet** | `027-xce-research-based-refinement` |
| **Source Proposal** | `research/sub-packet-proposals.md` Proposal 1 |
| **Source Findings** | `research/findings.md` items #1, #8 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`code_graph_context` (handlers/context.ts:264-266, lib/code-graph-context.ts:32-54) returns raw structural data: a `ContextResult` object with neighborhood symbols, edges, and readiness metadata. An AI consumer reads `node.kind=function, edges=[CONTAINS,IMPORTS,CALLS]` and must reconstruct architectural meaning itself. XCE returns the meaning directly — `xce_architecture_context` emits high-level descriptions ("This file is the auth middleware layer; it depends on session.ts and is called by 3 routes."), low-level details (per-symbol signature + dependency graph + complexity hints), and component summaries.

All input data needed to synthesize the same narrative deterministically already lives in our database:
- File role: derived from per-file SymbolKind counts (functions vs classes vs interfaces) — `code_nodes.kind` (indexer-types.ts:12-15) is stable schema
- Layer: derived from import/export ratios via `queryEdgesFrom('IMPORTS')` and `queryEdgesTo('IMPORTS')` (code-graph-db.ts:949-987)
- Summary: template ("This file defines N function(s), M class(es); imports K module(s)...")
- LLD per symbol: signature + docstring + direct_dependencies via `queryEdgesFrom(symbolId)` + complexity_hints from edge counts

### Purpose

Ship the deterministic HLD/LLD narrative as a new MCP tool (`code_graph_hld_lld`) and as a sub-mode of the omni combiner. After this phase lands, an AI calling `code_graph_hld_lld({path: 'src/auth/middleware.ts'})` receives a structured payload with `hld`, `lld[]`, and `summary` fields ready for prompt injection — closing the architectural-context gap with XCE without copying any closed-source PRAT internals.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- New file `mcp_server/code_graph/lib/code-graph-hld-lld.ts` (~200 LOC) implementing:
  - `generateHLD(filePath, db)` → `{file_role, layer, summary, primary_symbols[]}`
  - `generateLLD(symbolId, db)` → `{signature, docstring, direct_dependencies[], complexity_hints}`
  - `generateFileNarrative(filePath, db)` → `{hld, lld[]}`
  - Deterministic templates with placeholder slots filled from db queries
- New handler `mcp_server/code_graph/handlers/hld-lld.ts` (~50 LOC) wiring the MCP tool surface, request validation (zod schema), readiness gate reuse from existing `handlers/context.ts:182-262`.
- New tool registration `mcp_server/code_graph/tools/code-graph-tools.ts` (+2 LOC) for `code_graph_hld_lld`.
- Edit `mcp_server/code_graph/lib/code-graph-context.ts` (+15 LOC) to integrate HLD/LLD generation into the `queryMode:'omni'` flag (Phase 027/004 fold-in path).
- Tests under `mcp_server/tests/code-graph-hld-lld.vitest.ts` (~120 LOC, ≥80% coverage of new code).

### Out of Scope

- LLM-generated narrative (deferred — additive to deterministic baseline, separate phase).
- Changes to `structural-indexer.ts`, `tree-sitter-parser.ts`, or any parsing logic.
- New SQLite tables or schema migrations.
- Cross-repository file narrative.
- Replacing existing `code_graph_context` — additive only.

### Files Read (research input — read-only)

| Path | Purpose |
|------|---------|
| `research/iterations/iteration-001.md` | RQ1 findings (gap definition + minimum-viable schema) |
| `research/findings.md` items #1, #8 | Adoption verdict + rationale |
| `mcp_server/code_graph/lib/code-graph-db.ts:107-145` | code_files / code_nodes / code_edges schema |
| `mcp_server/code_graph/lib/code-graph-db.ts:949-1083` | queryEdgesFrom/To, queryFileDegrees APIs |
| `mcp_server/code_graph/lib/indexer-types.ts:12-44` | SymbolKind, EdgeType, DEFAULT_EDGE_WEIGHTS |
| `mcp_server/code_graph/lib/code-graph-context.ts:32-54` | ContextResult schema for omni integration |
| `mcp_server/code_graph/handlers/context.ts:182-262` | Readiness gate to reuse |

### Files Created/Modified

| Path | Type | Lines |
|------|------|------:|
| `mcp_server/code_graph/lib/code-graph-hld-lld.ts` | new | ~200 |
| `mcp_server/code_graph/handlers/hld-lld.ts` | new | ~50 |
| `mcp_server/code_graph/tools/code-graph-tools.ts` | edit | +2 |
| `mcp_server/code_graph/lib/code-graph-context.ts` | edit | +15 |
| `mcp_server/tests/code-graph-hld-lld.vitest.ts` | new | ~120 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `generateHLD(filePath, db)` returns deterministic `{file_role, layer, summary, primary_symbols[]}` | Identical input db state produces identical output across 100 calls. Unit-tested with fixture db. |
| REQ-002 | `generateLLD(symbolId, db)` returns `{signature, docstring, direct_dependencies[], complexity_hints}` | Returns null when symbolId not in code_nodes. Otherwise all 4 fields populated; docstring "" when missing. |
| REQ-003 | New MCP tool `code_graph_hld_lld` registered + handler dispatches | `opencode mcp list` shows the tool. Manual call returns valid JSON. |
| REQ-004 | Omni integration: `queryMode:'omni'` payload includes `hld_lld` sub-result | When called with `queryMode:'omni'`, ContextResult.hld_lld is populated for the resolved subject file. |
| REQ-005 | All output is JSON-serializable | `JSON.stringify(result)` succeeds without circular reference errors. |
| REQ-006 | Vitest suite ≥80% line coverage of new code | `npx vitest run code-graph-hld-lld.vitest.ts --coverage` shows ≥80%. |
| **REQ-012** | **Stable ordering before truncation** | `generateHLD()` and `generateLLD()` MUST sort candidate symbols before applying primary-symbol or LLD caps using a deterministic order: `kind priority → start_line ascending → name ascending → symbol_id ascending`. Unit-tested with 1000+ symbol fixture across 100 repeated calls. (Resolves B-iter001-001.) |
| **REQ-013** | **Dangling edge policy** | `generateLLD()` MUST either filter unresolved edge endpoints OR emit structured `unresolved` dependency records; the chosen policy MUST be documented and covered by a fixture with an edge endpoint missing from `code_nodes`. (Resolves B-iter001-003.) |
| **REQ-014** | **Primary module selection** | When multiple module-like symbols exist for one file, select the primary module deterministically: prefer the synthetic file module where `fq_name === getModuleName(filePath)`, then lowest `start_line`, then `symbol_id`. Unit-tested with synthetic + captured module-like symbols. (Resolves B-iter001-005.) |
| **REQ-015** | **Public classifier contract** | Export `classifyFileRole(filePath: string, db: CodeGraphDbLike): string` from `code-graph-hld-lld.ts`. `generateHLD(file, db).file_role` MUST equal `classifyFileRole(file, db)` for the same indexed state. Phase 002 imports this signature. (Resolves B-iter006-002.) |
| **REQ-016** | **Context wire contract** | If `queryMode:'omni'` is supported (REQ-004), update `QueryMode` enum, `ContextResult` interface, handler input parsing, AND serialized handler JSON to carry an optional `hld_lld` payload — together, in one PR with a handler-level JSON parse integration test. Otherwise REMOVE omni from Phase 001 scope. (Resolves B-iter006-003.) |

### P1 — Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | **File-role classification: open string with required baseline + reserved edge labels** | Returns an open string with required baseline labels: `module`, `api-handler`, `library`, `test`, `config`. Reserved edge labels include `empty` (zero-symbol file). **Consumers MUST NOT treat this as a closed enum.** Open-string contract tested. (Amended per B-iter006-001.) |
| REQ-008 | Layer classification covers 4 baseline tiers | "presentation / business / data / utility" via import/export ratios. Heuristic, unit-tested with known fixtures. |
| REQ-009 | Complexity hints surface a "high-fan-in" flag for hub symbols | When fan-in > 10, `complexity_hints` includes `"high-fan-in (N callers)"`. Threshold tunable as constant. |

### P2 — Nice to have

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-010 | LLM-required field markers for future extension | Output schema reserves `[LLM-required]` placeholder fields where deterministic generation would be too generic (long-form prose). Future phase fills them. |
| REQ-011 | Markdown rendering helper | Optional `renderHLDAsMarkdown(hld)` helper for human-readable output. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: An AI agent calling `code_graph_hld_lld({path: 'src/auth/middleware.ts'})` receives a JSON payload that, pasted into a prompt, gives downstream agents the same architectural understanding XCE's `xce_architecture_context` provides for that file.
- **SC-002**: Zero new dependencies in `package.json`. Zero new SQL DDL.
- **SC-003**: Vitest ≥80% line coverage; `npm run check` (lint + typecheck) green.
- **SC-004**: After this phase ships, Phase 027/002 (trace) can reuse the file-role labels as the trace's "architectural role" rung without rebuilding classification logic.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Template output is too generic for complex monorepos | Low | Template is a baseline; LLM enrichment (P2 REQ-010) is additive, not a replacement |
| Risk | Heuristic layer classification (import/export ratios) misclassifies edge cases | Low | Document classification rules; unit-test edge cases; refine heuristics per fixture |
| Risk | Schema changes in code_nodes break HLD derivation | Low | All input fields (kind, signature, docstring, fq_name) are stable in production; lock with unit tests |
| Risk | **Schema drift between local types and MCP serialized output** | Medium | `QueryMode`/`ContextResult` updates can compile locally while MCP serialized JSON omits `hld_lld`; mitigate with handler-level JSON parse integration test (REQ-016). Per B-iter006-003. |
| Risk | **Role-domain drift across phases** | Medium | Phase 002 may reject future role labels if it treats `file_role` as closed enum; mitigate with open-string contract tests (REQ-007 amended). Per B-iter006-001. |
| Risk | **Unresolved edges destabilize generated dependency narratives** | Medium | Dangling-edge endpoints cause non-deterministic LLD output; mitigate with explicit filter-or-structured-unresolved policy (REQ-013) + dangling-edge fixture. Per B-iter001-003. |
| Dependency | Existing `code-graph-db.ts` query APIs | Internal | Already shipped, stable surface |
| Dependency | Existing `indexer-types.ts` SymbolKind/EdgeType enums | Internal | Already shipped |
| Feeds-into | Phase 027/002 (trace) — architectural role labels via REQ-015 `classifyFileRole()` export | Internal | This phase ships first |
| Feeds-into | Phase 027/003 (impact-analysis) — layer-based criticality weighting | Internal | This phase ships first |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: `generateFileNarrative()` completes in <100ms p95 on a 500-symbol file (existing db query times + template rendering).
- **NFR-P02**: No N+1 query pattern — batch all symbol queries via single `queryEdgesFrom(filePath)` then in-memory traversal.

### Reliability
- **NFR-R01**: Deterministic output for identical db state.
- **NFR-R02**: Returns structured error (not throws) when filePath not in code_files.

### Maintainability
- **NFR-M01**: All template strings centralized in `code-graph-hld-lld.ts` constants block.
- **NFR-M02**: Zero direct SQL — only `code-graph-db.ts` query helpers.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- File with 0 symbols (empty file or comment-only): return HLD with `file_role: "empty"`, `summary: "Empty file or no parsable symbols."`
- File with 1000+ symbols: cap LLD output at 50 primary symbols (configurable), include `truncation_note` in HLD.
- Symbol with no outgoing edges: `direct_dependencies: []`, no error.

### Error Scenarios
- `code_files` row missing for path: handler returns `{ok: false, error: "FILE_NOT_INDEXED"}`.
- DB readiness gate fails: reuse existing `handlers/context.ts:182-262` gate; same error envelope as `code_graph_context`.

### State Transitions
- Stale db (file content changed but not reindexed): output still valid for prior content; `code_graph_status` informs caller of staleness.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 1 new lib + 1 new handler + 2 file edits + 1 test file. ~250 LOC. |
| Risk | 6/25 | Heuristic classification edge cases; well-mitigated. |
| Research | 2/20 | Implementation phase. Research already done in 027 root. |
| **Total** | **20/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should `file_role` be a closed enum or open string? (Default: open string for flexibility — closed enum can be added later if downstream consumers need it.)
- Should `complexity_hints` use a structured `{flags: string[], thresholds: object}` shape or a flat array of strings? (Default: flat array — simpler, matches XCE's payload shape.)
- Markdown helper (REQ-011) — same package or separate `code-graph-render.ts`? (Default: same file, internal helper, not exported as MCP surface.)
<!-- /ANCHOR:questions -->
