---
title: "Checklist — 027/001 code-graph HLD/LLD"
description: "QA validation checklist for the HLD/LLD narrative generator."
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->
# Checklist: 027/001 code-graph HLD/LLD

<!-- SPECKIT_LEVEL: 2 -->

Mark each item `[x]` only with file:line evidence after completion.

---

## P0 — REQ-001..REQ-006

- [ ] **C-001**: `generateHLD(filePath, db)` returns deterministic JSON for identical inputs — evidence: unit test "deterministic output across 100 runs"
- [ ] **C-002**: `generateLLD(symbolId, db)` returns null on missing symbol; populated 4 fields otherwise
- [ ] **C-003**: `code_graph_hld_lld` MCP tool registered and callable — evidence: `opencode mcp list` shows tool
- [ ] **C-004**: `queryMode:'omni'` payload includes `hld_lld` field — evidence: integration test
- [ ] **C-005**: `JSON.stringify(result)` succeeds without circular-ref error — evidence: serialization test
- [ ] **C-006**: Vitest line coverage ≥80% on new code — evidence: `--coverage` output

## P1 — REQ-007..REQ-009

- [ ] **C-007**: 5 baseline file_role classifications (module / api-handler / library / test / config) covered with unit tests
- [ ] **C-008**: 4 layer-tier classifications (presentation / business / data / utility) covered with unit tests
- [ ] **C-009**: `complexity_hints` includes "high-fan-in (N callers)" when fan-in > 10

## P0 — pt-02 amendments (NEW)

- [ ] **C-012** (REQ-012): Stable-sort helper applied before every cap; 100 repeated calls with 1000+ symbols produce identical output
- [ ] **C-013** (REQ-013): Dangling-edge policy chosen and documented (filter OR unresolved record); fixture asserts behavior
- [ ] **C-014** (REQ-014): Primary-module selection picks synthetic module (`fq_name === getModuleName(filePath)`) over captured module-like symbol
- [ ] **C-015** (REQ-015): `classifyFileRole(filePath, db)` exported; `generateHLD(file, db).file_role === classifyFileRole(file, db)` in test
- [ ] **C-016** (REQ-016): EITHER full omni wire-contract integration (QueryMode + ContextResult + handler parse + serialized JSON + integration test) OR omni explicitly removed from Phase 001 scope

## P0 — Verification

- [ ] **C-V01**: `npm run check` green (lint + typecheck)
- [ ] **C-V02**: `npx vitest run code-graph-hld-lld.vitest.ts` all tests pass
- [ ] **C-V03**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-code-graph-hld-lld --strict` passes
- [ ] **C-V04**: `implementation-summary.md` authored with completion percentage and file:line evidence per requirement
