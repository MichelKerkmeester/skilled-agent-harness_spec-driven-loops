---
title: "Code Graph Runtime Upgrades: Detector Provenance, Blast-Radius Fix and Edge Evidence"
description: "Five additive upgrade lanes shipped for the code-graph runtime: detector provenance taxonomy, bounded blast-radius traversal, multi-file union mode, advisory hot-file breadcrumbs plus a frozen regression floor. All lanes passed typecheck, vitest and strict packet validation."
trigger_phrases:
  - "code graph runtime upgrades"
  - "detector provenance taxonomy"
  - "blast radius depth fix"
  - "hot file breadcrumbs"
  - "graph edge evidence enrichment"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-09

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/004-runtime-and-scan/001-code-graph-runtime-upgrades` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/004-runtime-and-scan`

### Summary

The code-graph runtime had no formal detector provenance vocabulary, so non-AST fallback paths could silently emit `ast` labels. Blast-radius traversal walked past `maxDepth` before filtering, leaking out-of-bound nodes into results. Hot-file degree data existed in the index but was not surfaced to callers. Edge evidence metadata was absent from query and scan responses.

Five additive upgrade lanes shipped across one implementation commit and one regression-floor follow-up:

1. **Detector provenance taxonomy.** `shared-payload.ts` now exports `DetectorProvenance`, guards, assertions plus a compatibility mapper back to the earlier `ParserProvenance` vocabulary. Scan and context handlers serialize provenance summary data instead of relying on loose strings.
2. **Bounded blast-radius and multi-file union.** `code_graph_query` stops traversal before nodes beyond `maxDepth` are included. Explicit `unionMode: 'multi'` merges multiple source files without duplicating results.
3. **Advisory hot-file breadcrumbs.** High-degree files now surface an advisory `hotFileBreadcrumb` warning without introducing a new authority score or competing with the trust-axis contract from packet 011.
4. **Additive edge evidence enrichment.** Shared payload sections can carry `graphEdgeEnrichment` with `edgeEvidenceClass` and `numericConfidence`. Query responses emit the fields directly and scan stores the latest summary.
5. **Frozen regression floor.** A dedicated scripts-side test file locks detector provenance honesty and blast-radius depth behavior under the same frozen-fixture discipline established by packet 007.

Lanes A through E shipped in order. Two tasks (lexical fallback cascade and cluster or export contracts) were deferred as prototype-later work per ADR-003.

### Added

- `DetectorProvenance` type, guards, assertions plus a `ParserProvenance` compatibility mapper in `shared-payload.ts`
- `hotFileBreadcrumb` advisory field on graph-owned query response shapes
- `graphEdgeEnrichment` section with `edgeEvidenceClass` and `numericConfidence` on graph-local payload owners
- Frozen regression floor in `graph-upgrades-regression-floor.vitest.ts.test.ts` covering detector provenance honesty and blast-radius depth behavior

### Changed

- `code_graph_query` blast-radius traversal now stops at `maxDepth` before including nodes. Previously walked past the bound and filtered afterward.
- Multi-file union behavior made explicit through `unionMode: 'multi'` rather than relying on implicit merging
- Scan and context handlers serialize detector provenance summary data instead of loose strings or implicit parser labels

### Fixed

- Blast-radius results included out-of-bound nodes when identically named symbols existed across files. Depth enforcement in the traversal loop eliminates this.
- Non-AST detector paths could silently emit `ast` provenance labels. The new vocabulary and guards reject invalid labels and preserve honest fallback states.

### Verification

| Check | Result |
|-------|--------|
| `cd .opencode/skills/system-spec-kit/mcp_server && npm run typecheck` | PASS |
| `cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/structural-trust-axis.vitest.ts tests/code-graph-query-handler.vitest.ts tests/code-graph-context-handler.vitest.ts tests/code-graph-scan.vitest.ts tests/graph-payload-validator.vitest.ts` | PASS |
| `cd .opencode/skills/system-spec-kit/scripts && npx vitest run tests/detector-regression-floor.vitest.ts.test.ts tests/graph-upgrades-regression-floor.vitest.ts.test.ts` | PASS |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/004-runtime-and-scan/001-code-graph-runtime-upgrades --strict` | PASS |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/context/shared-payload.ts` | Added `DetectorProvenance` vocabulary, guards, assertions, compatibility mapper, `hotFileBreadcrumb` plus `graphEdgeEnrichment` fields on graph-local payload owners. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/code-graph/query.ts` | Blast-radius traversal enforces `maxDepth` before node inclusion. Explicit `unionMode: 'multi'` for multi-file merges. Advisory breadcrumb and edge enrichment fields emitted on responses. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/code-graph/scan.ts` | Detector provenance summary and graph-edge enrichment serialized at scan time. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/code-graph/context.ts` | Detector provenance metadata surfaced on code-graph context responses. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts` | Schema extended with provenance summary helpers and file-degree data for hot-file tracking. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts` | Detector provenance vocabulary verified as separate from the existing trust-axis contract. |
| `.opencode/skills/system-spec-kit/scripts/tests/graph-upgrades-regression-floor.vitest.ts.test.ts` (NEW) | Frozen regression floor for detector provenance honesty and blast-radius depth behavior. |

### Follow-Ups

- Add a graph-local capability selector and forced-degrade verification matrix if a lexical fallback cascade is introduced later. The cascade was deferred because failure rates were below 1 percent and the cost of a multi-language lexical fallback exceeded the benefit at this stage.
- Stage cluster metadata and export contracts behind explicit feature flags when trust and payload prerequisites are in place. Clustering, GraphML or Cypher export plus rationale-node support remain prototype-later per ADR-003.
- Resume/bootstrap trust preservation stays with packet 011. Startup, compact plus response-surface routing nudges remain with packet 008.
