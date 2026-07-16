---
title: "Phase 003: code-graph-edge-explanation-and-impact-uplift"
description: "Code Graph edge output gained reason and step metadata, while blast_radius gained depth groups, risk levels, confidence filtering, ambiguity candidates and structured fallbacks."
trigger_phrases:
  - "phase 003 changelog"
  - "code graph edge explanation impact uplift"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-25

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/wave-4-2026-05-26-reorg/004-external-project-adoption-dissolved` (Level 2)
> Parent packet: `027-graph-and-context-optimization/005-graph-impact-and-affordance`

### Summary

Phase 003 made Code Graph impact output easier to audit. Edge metadata now carries `reason` and `step` inside the existing JSON metadata payload, without a SQLite migration. Relationship queries and `code_graph_context` propagate those fields beside confidence and provenance. `blast_radius` kept the prior file-oriented fields and added depth groups, risk level, `minConfidence`, ambiguity candidates and structured failure fallback.

### Added

- `reason` and `step` metadata fields on extracted and inferred graph edges.
- `depthGroups`, `riskLevel`, `minConfidence`, `ambiguityCandidates` and `failureFallback` in `blast_radius` output.
- Risk classification rules for ambiguity and depth-one affected-file counts.
- Feature catalog and manual testing playbook entries for edge explanation and blast-radius uplift.

### Changed

- Relationship query output now surfaces explanation fields per edge.
- `code_graph_context` structured edges and compact text now include explanation metadata when present.
- Ambiguous symbol subjects now return candidates instead of silently selecting a graph node.
- Review remediation later exposed `minConfidence` through schema, JSON schema and allowed-parameter ledgers.

### Fixed

- Missing "why did this edge exist" context was closed for Code Graph callers.
- Bare error-string behavior moved toward structured fallback payloads.
- Review remediation later added read-path sanitization for stale or imported `reason` and `step` values.
- Review remediation later corrected the risk overflow story and preserved seed nodes on sibling failures.

### Verification

- Wave-3 evidence: `tsc --noEmit` exited 0.
- Wave-3 evidence: phase test set reported 9 passed and 1 skipped test file, with 90 passed and 3 skipped tests.
- 003 surfaces in `code-graph-context-handler.vitest.ts`, `code-graph-indexer.vitest.ts` and `code-graph-query-handler.vitest.ts` passed.
- `validate.sh --strict` failed on template-section conformance only, classified as cosmetic.
- Git history for this directory includes `131b57f3a8` and `40dcf80052`.

### Files Changed

| File | What changed |
|------|--------------|
| `mcp_server/code_graph/lib/structural-indexer.ts` | Edge metadata writer added `reason` and `step`. |
| `mcp_server/code_graph/handlers/query.ts` | Relationship output and `blast_radius` response shape changed. |
| `mcp_server/code_graph/lib/code-graph-context.ts` | Context output preserved explanation metadata. |
| `mcp_server/code_graph/tests/code-graph-indexer.vitest.ts` | Edge metadata round-trip coverage. |
| `mcp_server/code_graph/tests/code-graph-query-handler.vitest.ts` | Risk, filter, ambiguity and fallback tests. |
| `mcp_server/code_graph/tests/code-graph-context-handler.vitest.ts` | Context propagation tests. |
| `feature_catalog/06--analysis/08-code-graph-edge-explanation-blast-radius-uplift.md` | Catalog entry. |
| `manual_testing_playbook/06--analysis/026-code-graph-edge-explanation-blast-radius-uplift.md` | Manual scenario. |

### Follow-Ups

- DQI scores for packet-local docs remain operator-pending in canonical Wave-3 evidence.
- 008 research later recommended more tests around malformed metadata JSON and failure-fallback codes.
