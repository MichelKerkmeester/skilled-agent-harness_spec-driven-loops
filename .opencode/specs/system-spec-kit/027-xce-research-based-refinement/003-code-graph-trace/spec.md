---
title: "Phase 003 — Symbol-to-Architecture Trace Tool (`code_graph_trace`)"
description: "ADAPT XCE's xce_trace concept: walk symbol to file/module/architectural role using CodeNode.filePath as the ownership truth, optional CONTAINS edges for class/method display, and Phase 002 HLD/LLD classification. New code_graph_trace MCP tool. ~390-460 LOC with sparse-containment fixtures and optional cache/package follow-ups."
trigger_phrases:
  - "027 phase 003"
  - "code-graph trace"
  - "code_graph_trace"
  - "trace tool"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-code-graph-trace"
    last_updated_at: "2026-05-08T15:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded 027/003 phase from sub-packet-proposals.md Proposal 2"
    next_safe_action: "Implement code-graph-trace.ts (depends on Phase 002 HLD/LLD)"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-4-7-2026-05-08-027-003"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: code_graph_trace — Symbol-to-Architecture Trace Tool

<!-- SPECKIT_LEVEL: 2 -->

---

## EXECUTIVE SUMMARY

Implement the trace pipeline proposed in 027 RQ2 (`../research/iterations/iteration-002.md` F-008/F-012) with pt-02 corrections from `../research/027-xce-research-based-refinement-pt-02/research.md`. A new `mcp_server/code_graph/lib/code-graph-trace.ts` resolves the file rung from `CodeNode.filePath`, derives module ownership from an explicit file-path policy, uses available CONTAINS/fqName metadata only for class/method display, and calls Phase 002's HLD/LLD classification for the architectural-role terminus. Exposed as a new `code_graph_trace` MCP tool. Optional recursive memoization cache and optional `code_packages` table remain P1 follow-ups after the filePath policy is correct.

ADAPT verdict from findings.md item #2 + PRAT stages #6, #7, #9 (Persistent / Recursive / Tree).

**Key Decisions**:
- **`CodeNode.filePath` is the ownership truth** for the file rung; CONTAINS is not sufficient across top-level functions, Bash/doc symbols, module nodes, or default exports.
- **Module ownership is a file-path policy**, not dotted `fq_name` splitting.
- **Schema delta NOT required for MVP**; `code_packages` and `trace_cache` are optional P1 optimizations after correctness fixtures pass.

**Critical Constraints**:
- Phase 002 (HLD/LLD) must ship first — its `classifyFileRole()` is the source for the architectural-role rung.
- Cap trace depth at 5 levels (configurable parameter) to prevent runaway recursion.
- Single-repo scope only — cross-repo trace is out of scope.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Spec-Scaffolded |
| **Parent Packet** | `027-xce-research-based-refinement` |
| **Source** | `../research/sub-packet-proposals.md` Proposal 2; `../research/iterations/iteration-002.md`; pt-02 amendments in `../research/027-xce-research-based-refinement-pt-02/` |
| **Depends on** | `027/003-code-graph-hld-lld` (architectural-role labels) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

XCE's `xce_trace` (external/README.md:211-218) walks `function → class → module → architectural role` and returns a labeled chain payload. Our edge graph stores parent/child via `CONTAINS` (indexer-types.ts:19) but no `code_graph_trace` tool surfaces the chain. AI consumers manually walk via `code_graph_query` for each rung, which is inefficient and breaks the abstraction.

**Purpose**: ship a single MCP tool call that returns the full trace chain from any symbol up to its architectural role, reusing `CodeNode.filePath`, available class/method containment metadata, and Phase 002 classification.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- New `mcp_server/code_graph/lib/code-graph-trace.ts` (~150 LOC):
  - `traceSymbol(symbolId, db, opts)` → `{symbol, class?, file, module, architectural_role}`
  - Resolves the file rung from `CodeNode.filePath` for the subject symbol.
  - Uses `queryEdgesTo(symbolId, 'CONTAINS')` only to decorate class/method ancestry where reliable.
  - Derives module ownership from a documented file-path policy.
  - Calls `classifyFileRole()` from Phase 002 for the role rung.
- New handler `mcp_server/code_graph/handlers/trace.ts` (~60 LOC) with zod schema + readiness gate reuse.
- Tool registration `mcp_server/code_graph/tools/code-graph-tools.ts` (+3 LOC).
- Optional: `code-graph-db.ts` `trace_cache` SQLite table (+50 LOC) for memoization.
- Optional: `code-graph-db.ts` `code_packages` table (+50 LOC) for formalized module hierarchy.
- Tests `mcp_server/tests/code-graph-trace.vitest.ts` (~80 LOC, ≥80% coverage).

### Out of Scope
- Cross-repository trace.
- Downward impact tracing (that's Phase 004).
- LLM enrichment of trace narrative.
- New parsing logic.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `traceSymbol(symbolId, db)` returns chain at minimum {symbol, file, architectural_role} + chain metadata; **file rung MUST be sourced from `CodeNode.filePath`**, NOT inferred from CONTAINS or fq_name | Output has `symbol`, `file` (from CodeNode.filePath), `architectural_role` minimum; `class`/`module` optional based on container chain. (Amended per B-iter002-001.) |
| REQ-002 | New MCP tool `code_graph_trace` registered + handler dispatches | `opencode mcp list` shows the tool |
| REQ-003 | Trace depth capped at 5 levels (default), tunable via `maxDepth` param | Trace at depth 6+ truncates with `truncated: true` flag |
| REQ-004 | `architectural_role` uses Phase 002's `classifyFileRole(filePath, db)` AND **MUST equal `generateHLD(filePath, db).file_role`** for the same indexed state | Shared-contract test imports Phase 002's exported signature; equality enforced. (Amended per B-iter006-002.) |
| REQ-005 | Vitest ≥80% line coverage | `--coverage` output ≥80% |
| **REQ-008** | **Deterministic module ownership** | The module rung MUST be derived from an explicit file-path policy (e.g., nearest package/root segment OR basename fallback), NOT inferred from dotted `fq_name` segments. Per-language policy examples documented (TS/JS, Python, Bash, doc). (Resolves B-iter002-008 + B-iter008-001.) |
| **REQ-009** | **Sparse containment behavior** | Top-level functions, Bash functions, doc symbols, module nodes, anonymous/default exports, AND symbols with no incoming CONTAINS edge MUST still return valid `file` and `architectural_role` fields. Fixtures cover each shape. (Resolves B-iter002-002.) |
| **REQ-010** | **Nested-class containment correctness** | If CONTAINS is used for class/method display, parent matching MUST compare against `class.fqName + "."`, not short name. Nested-class regression fixture proves correctness. (Resolves B-iter002-004.) |

### P1
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Memoization cache for repeated traces | Optional SQLite `trace_cache` table; benchmark shows ≥2x speedup on repeated symbol traces |
| REQ-007 | **`code_packages` may optimize OR formalize module hierarchy** ONLY AFTER P0 filePath-derived module policy is correct | A table populated from `fq_name` prefixes is **NOT acceptable** as the P0 source of truth. If kept as P1, populate from file paths, package markers, path aliases, import metadata, OR explicit config. (Demoted P0→P1 + rewritten per B-iter002-008.) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: AI calling `code_graph_trace({symbolId: "auth.middleware.requireAuth"})` receives `{symbol: "requireAuth", class: "AuthMiddleware", file: "src/auth/middleware.ts", module: "auth", architectural_role: "api-handler"}`.
- **SC-002**: Schema unchanged for MVP (no migrations).
- **SC-003**: `npm run check` green; `vitest` ≥80% coverage.
- **SC-004**: Phase 004 (impact analysis) can reuse trace chains for downstream-dependency narrative.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | **Current CONTAINS edges only cover class→method pairs**; trace completeness can be overstated | **High** | Use `CodeNode.filePath` as the normal path for file rung (REQ-001 amended); CONTAINS only for class/method display where available. Per B-iter002-001/002. |
| Risk | **`fqName` dot-splitting confuses lexical containment with package ownership** | High | Derive module from `filePath` policy (REQ-008); reserve `fqName` for class/method display only. Per B-iter002-008 + B-iter008-001. |
| Risk | **Parallel work before Phase 002 ships can hide classifier-contract drift** | Medium | Use typed test doubles ONLY before Phase 002 ships; later add shared-contract test against real `classifyFileRole()` (REQ-004 amended). |
| Risk | Deeply nested traces (10+ levels) hit budget | Low | Cap at maxDepth (default 5); truncate with marker |
| Dependency | Phase 027/002 (HLD/LLD) must ship first | Internal | Hard sequence — Phase 003 cannot start until 001 lands; REQ-015 from 001 pins `classifyFileRole(filePath, db)` signature |
| Dependency | Existing `code-graph-db.ts` queryEdgesTo + resolveSubjectFilePath | Internal | Already shipped, stable |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

- **NFR-P01**: `traceSymbol()` <50ms p95 for chains ≤5 levels deep on a 10k-symbol graph.
- **NFR-R01**: Returns structured error if symbolId not in code_nodes.
- **NFR-M01**: Zero direct SQL — `code-graph-db.ts` query helpers only.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Symbol at file-level (no class container): `class: null`, `file: <path>`, role from Phase 002.
- Symbol with no CONTAINS edges: `chain: [symbol]`, `truncated: false`, role from file path heuristic.
- Cross-language file (e.g. .ts importing .py): trace stops at file boundary; cross-language not handled.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score |
|-----------|-------|
| Scope (1 lib + 1 handler + 2 file edits + optional table) | 14/25 |
| Risk (depth-cap + Phase 002 dep) | 6/25 |
| Research (already done in 027 root) | 2/20 |
| **Total** | **22/70** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should `code_packages` table ship in this phase or defer? (Default: defer — fq_name splitting suffices for MVP.)
- Memoization cache: SQLite table or in-memory LRU? (Default: SQLite for cross-process consistency.)
<!-- /ANCHOR:questions -->
