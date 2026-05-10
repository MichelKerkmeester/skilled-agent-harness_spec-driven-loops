# Phase 004 amendments-applied — pt-02 cross-validation cycle

**Source**: `pt-02/sub-packet-amendments.md` §"Phase 004 amendments"
**Applied**: 2026-05-08
**iter trace**: `pt-02/iterations/iteration-003.md`, `iteration-006.md`, `iteration-007.md`, `iteration-009.md`

---

## BLOCKING findings resolved

| ID | Finding | REQ Added/Changed | iter ref |
|----|---------|-------------------|----------|
| **B-iter003-001** | `queryEdgesTo(filePath)` and `queryEdgesFrom(filePath)` operate on symbol IDs, not file paths; impact-analysis cannot count fan-in/fan-out at file level without symbol→file aggregation | NEW REQ-010 (file-level aggregation) | iteration-003.md |
| **B-iter003-002** | Risk score formula coefficients (0.35/0.25/0.25/0.15) are unvalidated heuristics; spec presents them as validated risk weights | REQ-002/003 amended (label as `heuristic`) + NEW REQ-009 (deterministic normalization) | iteration-003.md |
| **B-iter003-003** | BFS 3-hop depth cap claims to use `queryFileImportDependents` LIMIT, but that helper returns 1-hop flat list, not depth-limited tree | NEW REQ-013 (explicit BFS loop with visited set) | iteration-003.md |
| **B-iter003-005** | TESTED_BY edge direction is test→production in indexer; spec walks it backward, claims "untested" when absent (false positive) | NEW REQ-011 (incoming direction) + NEW REQ-012 (coverage evidence class) | iteration-003.md |
| **B-iter003-007** | LLM enrichment is boolean opt-in with cli-opencode default; introduces hidden remote dependency, no budget contracts | REQ-007 amended (default `provider: "none"`) + NEW REQ-014 (enrichment options contract) | iteration-003.md |
| **B-iter006-005** | Phase 004 references "layer-based criticality" from Phase 002 but Phase 002's classifier is undefined contract; would force redundant local classifier | NEW REQ-015 (layer fallback to `unavailable/null`, no second classifier) | iteration-006.md |
| **B-iter007-003** | Coverage gap signal direction inversion confirmed; production files show "untested" when test files exist | (Same as B-iter003-005 — REQ-011) | iteration-007.md |
| **B-iter007-004** | LLM enrichment contract gap; cli-opencode subprocess inherits stdin-deadlock and lifecycle failure modes from pre-097 era | (Same as B-iter003-007 — REQ-014 + Phase 006 dispatcher reuse) | iteration-007.md |
| **B-iter009-001** | File-level aggregation gap re-confirmed at iteration 9 with concrete fixture proposal | (Same as B-iter003-001 — REQ-010) | iteration-009.md |
| **B-iter009-005** | BFS depth implementation gap re-confirmed with cycle-detection requirement | (Same as B-iter003-003 — REQ-013) | iteration-009.md |
| **B-iter009-007** | Enrichment options contract gap re-confirmed; budget envelope including `maxInputBytes` and `cacheKey` proposed | (Same as B-iter003-007 — REQ-014) | iteration-009.md |

---

## REQ-delta table

| REQ | Status | Summary |
|-----|--------|---------|
| REQ-001 | unchanged | `analyzeImpact` returns `{affected_files[], risk_scores[], summary}` |
| REQ-002 | **edited** | Was: `5 risk signals computed deterministically from existing graph data`. Now: `…after file-level aggregation over all CodeNode rows for each affected file`. Closes B-iter003-001. |
| REQ-003 | **edited** | Was: `Risk score formula uses tunable weight constants`. Now: `…uses documented tunable weights and deterministic normalizers; default weights are labeled heuristic until Phase 006 calibration`. Closes B-iter003-002. |
| REQ-004 | unchanged | New MCP tool registered + handler dispatches |
| REQ-005 | unchanged | BFS transitive depth capped at 3 (refined by REQ-013) |
| REQ-006 | unchanged | Vitest ≥80% coverage |
| REQ-007 | **edited (P1)** | Was: `Optional enrichWithLLM:true flag triggers LLM narrative`. Now: `…disabled unless explicit provider configuration is supplied; disabled output remains complete and deterministic`. Closes B-iter003-007. |
| REQ-008 | unchanged | Risk weights tunable via env/config |
| **REQ-009** | **NEW P0** | Deterministic normalization: `normalizeFanIn/HubDegree/TransitiveDepth` with fixed caps OR documented graph-baseline. Closes B-iter003-002. |
| **REQ-010** | **NEW P0** | File-level aggregation: aggregate symbol-level edges by file; NO direct `queryEdgesTo(filePath)`. Closes B-iter003-001 + B-iter009-001. |
| **REQ-011** | **NEW P0** | TESTED_BY direction: incoming via `queryEdgesTo(productionSymbol.id)`. Closes B-iter003-005 + B-iter007-003. |
| **REQ-012** | **NEW P0** | Coverage evidence class: `coverageUnknownOrMissing` OR `{hasTestEdge, coverageEvidence}`; never "proven untested". Closes B-iter003-005. |
| **REQ-013** | **NEW P0** | BFS depth implementation: explicit visited set in new impact-analysis loop; do NOT rely on query LIMIT. Closes B-iter003-003 + B-iter009-005. |
| **REQ-014** | **NEW P1** | Enrichment options contract: `{enabled, provider, model?, timeoutMs?, maxCallsPerSession?, maxInputBytes?, cacheKey?}`. Closes B-iter003-007 + B-iter009-007. |
| **REQ-015** | **NEW P1** | Layer fallback: emit `unavailable/null` if Phase 002 layer data missing; no second local classifier. Closes B-iter006-005. |

---

## NEW tasks (added to tasks.md)

- T-003A: File-node aggregation helper `getNodesForFile()` + multi-symbol fixture tests
- T-003B: Deterministic normalizers + snapshot tests
- T-003C: TESTED_BY direction fixture incl. unsupported test layouts
- T-003D: BFS depth/cycle fixture with explicit visited set
- T-003E: Replace boolean `enrichWithLLM` with enrichment options schema
- T-003F: Redaction/budget/timeout contract tests for CLI enrichment
- T-003G: Layer fallback `unavailable/null` for Phase 002 absence

## REMOVED tasks

- ~~Call cli-opencode by default when `enrichWithLLM` is true~~ — default is now `provider: "none"`

---

## NEW risks (added to spec.md §6)

- Heuristic weights without calibration label can mislead consumers (mitigation: `weight_class: "heuristic"` + Phase 006 calibration).
- Coverage absence overstates risk for unsupported test layouts (mitigation: `coverageEvidence` class).
- LLM enrichment can silently introduce remote dependency (mitigation: default skipped + explicit budgets).
- CLI enrichment inherits subprocess lifecycle failure modes (mitigation: Phase 006 dispatcher reuse).

---

## LOC-delta

- **Original estimate**: ~350 LOC
- **Amendment delta**: +120 to +220 LOC (file-aggregation helper, normalizers, BFS visited set, TESTED_BY direction fix, options-shape rewrite, layer fallback)
- **Revised estimate**: ~470–570 LOC if optional CLI enrichment remains; ~430–480 LOC if enrichment ships as `none/skipped` only

---

## Out-of-scope amendments (deferred)

- Calibrated risk weights (deferred to Phase 006 eval harness; weights labeled `heuristic` until then).
- LlmNarrativeProvider non-CLI implementations (HTTP/native API) — interface defined, only `none` and `cli` providers wired.

---

## Phase 004 readiness after amendments

- ✅ Implementable: yes — every BLOCKING finding has a remediation REQ.
- ⚠️ Conditional: REQ-015 depends on Phase 002's REQ-015 (`classifyFileRole()` exported); REQ-014 CLI provider depends on Phase 006's subprocess dispatcher contract.
- ▲ Level unchanged: still Level 2 (complexity 26→32/70 — within L2 envelope).
