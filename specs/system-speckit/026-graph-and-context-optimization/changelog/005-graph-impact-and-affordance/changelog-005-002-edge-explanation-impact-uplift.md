---
title: "Code Graph Edge Explanation + Impact Uplift (012/003)"
description: "Adds reason/step explanation fields to code edge metadata plus enriches blast_radius with depth groups, risk levels, confidence filtering, ambiguity candidates plus structured failure fallback. No SQLite schema migration."
trigger_phrases:
  - "edge explanation impact uplift"
  - "blast radius risk levels"
  - "code graph reason step metadata"
  - "ambiguity candidates blast radius"
  - "012/003 edge explanation"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-25

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-graph-impact-and-affordance/002-edge-explanation-impact-uplift` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-graph-impact-and-affordance`

### Summary

The code-graph edge metadata carried `confidence`, `detectorProvenance`, `evidenceClass` but gave operators no `reason` or `step` fields explaining why a relation was inferred. The `computeBlastRadius` function grouped files by depth but produced no risk classification, no confidence threshold filtering, no ambiguity surfacing, no structured failure states.

This phase added `reason` and `step` as graph-local JSON fields inside the existing `code_edges.metadata` column with no SQLite schema migration. Relationship query output and `code_graph_context` payloads were updated to propagate the new fields alongside existing ones. `computeBlastRadius` now returns `depthGroups`, `riskLevel`, `minConfidence` filtering, `ambiguityCandidates`, along with a structured `failureFallback`. Targeted Vitest coverage was added for all new surfaces. Wave-3 canonical verification (010/007/T-B, 2026-04-25) confirmed 9 test files passing with 90 tests passing, tsc exit 0, along with a cosmetic-only validate.sh failure deferred as P2 cleanup.

### Added

- `reason` and `step` JSON fields written into `code_edges.metadata` by the structural indexer metadata helper (no schema change to `code_edges` table)
- `depthGroups`, `riskLevel`, `ambiguityCandidates`, `failureFallback` fields on `computeBlastRadius` return shape in `query.ts`
- `minConfidence` parameter on `computeBlastRadius` to filter edges below a numeric threshold during traversal
- Risk classification rules: `high` when ambiguity candidates are present or depth-one file count exceeds 10. `medium` for 4-10 depth-one files. `low` for 0-3.
- Feature catalog entry `.opencode/skills/system-spec-kit/feature_catalog/06--analysis/08-code-graph-edge-explanation-blast-radius-uplift.md` (NEW)
- Manual testing playbook entry `.opencode/skills/system-spec-kit/manual_testing_playbook/06--analysis/026-code-graph-edge-explanation-blast-radius-uplift.md` (NEW)
- Targeted Vitest cases in `code-graph-indexer.vitest.ts`, `code-graph-query-handler.vitest.ts`, `code-graph-context-handler.vitest.ts` covering edge metadata round-trip, risk levels, confidence filtering, ambiguity candidates, failure fallback

### Changed

- `structural-indexer.ts` metadata helper (lines 80-100) extended to write `reason` and `step` alongside existing fields. Existing `confidence`, `detectorProvenance`, `evidenceClass` fields remain unchanged.
- `query.ts` relationship-query output path now threads `reason` and `step` per edge beside the pre-existing confidence and evidence fields
- `code-graph-context.ts` structured edge payloads updated to propagate all five explanation fields. Compact text brief includes explanation metadata when present.
- Ambiguous symbol subjects now return `ambiguityCandidates` metadata with a structured `failureFallback` instead of silently choosing a default graph node

### Fixed

- `computeBlastRadius` failures previously returned bare error strings. They now return a structured `failureFallback` object with `reason` and optional `partialResult`.
- Ambiguous target resolution previously picked a default silently. The fix surfaces all candidates so the caller controls disambiguation.

### Verification

| Check | Result | Evidence |
|-------|--------|----------|
| `tsc --noEmit` | PASS | Wave-3 canonical (010/007/T-B, 2026-04-25): exit 0 after type-widening fix in commit c6e766dc5 |
| `vitest run` (003 surfaces) | PASS | Wave-3 canonical: 9 test files passed (1 skipped), 90 tests passed (3 skipped), 1.34s. All 003 cases inside the 9 PASSED files. |
| Edge metadata round-trip | PASS | `code-graph-indexer.vitest.ts` asserts `reason` and `step` on extracted and inferred edges |
| Relationship query output | PASS | `code-graph-query-handler.vitest.ts` asserts per-edge `reason` and `step` |
| Blast-radius risk and coverage | PASS | `code-graph-query-handler.vitest.ts` covers low, medium, high risk, `minConfidence` 0.75 filtering, ambiguity candidates, structured `failureFallback` |
| Context propagation | PASS | `code-graph-context-handler.vitest.ts` asserts structured edge metadata and text brief propagation |
| Static schema check | PASS | `code-graph-db.ts` was not modified. `code_edges.metadata` remains a `TEXT` column. |
| `validate.sh --strict` | FAILED-COSMETIC | Wave-3 canonical: failed on template-section conformance only. Cosmetic style debt, not a content violation. Deferred as P2 cleanup in 010/007. |
| sk-doc DQI | OPERATOR-PENDING | Feature catalog DQI 87 and playbook DQI 89 reported during implementation via `extract_structure.py` but captured outside the canonical Wave-3 channel. Operator may re-run `python3 .opencode/skills/sk-doc/scripts/validate_document.py <doc> --json` for both entries to confirm current rubric scores. Tracked as R-007-20. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `mcp_server/code_graph/lib/structural-indexer.ts` | Modified | Metadata helper at lines 80-100 extended with `reason` and `step` fields |
| `mcp_server/code_graph/handlers/query.ts` | Modified | `computeBlastRadius` gains `depthGroups`, `riskLevel`, `minConfidence`, `ambiguityCandidates`, `failureFallback`. Relationship-query output threads `reason`/`step`. |
| `mcp_server/code_graph/lib/code-graph-context.ts` | Modified | Structured edge payloads propagate all five explanation fields. Compact text brief updated. |
| `mcp_server/code_graph/tests/code-graph-query-handler.vitest.ts` | Modified | 176-line addition covering blast-radius risk levels, confidence filtering, ambiguity, failure fallback |
| `mcp_server/code_graph/tests/code-graph-indexer.vitest.ts` | Modified | 32-line addition asserting `reason` and `step` on indexed edges |
| `mcp_server/code_graph/tests/code-graph-context-handler.vitest.ts` | Modified | 56-line addition for context propagation of explanation metadata |
| `.opencode/skills/system-spec-kit/feature_catalog/06--analysis/08-code-graph-edge-explanation-blast-radius-uplift.md` | Created (NEW) | Feature catalog entry for blast-radius uplift |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/06--analysis/026-code-graph-edge-explanation-blast-radius-uplift.md` | Created (NEW) | Manual testing playbook entry for blast-radius uplift |

### Follow-Ups

- Re-run `python3 .opencode/skills/sk-doc/scripts/validate_document.py` against the feature catalog and playbook entries to capture numeric DQI scores against the current rubric to close R-007-20.
- Address the cosmetic validate.sh template-section conformance failure tracked as P2 cleanup in 010/007 when the next maintenance window opens.
