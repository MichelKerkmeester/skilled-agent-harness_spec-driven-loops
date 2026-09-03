---
title: "Tasks: 012/003"
description: "Edge explanation + blast_radius uplift."
importance_tier: "important"
contextType: "implementation"
trigger_phrases: []
---
# Tasks: 012/003

<!-- SPECKIT_LEVEL: 2 -->

| ID | Task | Phase | Status |
|----|------|-------|--------|
| T-003-A1 | Extend metadata writer with `reason` + `step` | A | complete — `structural-indexer.ts` metadata helper writes both fields |
| T-003-A2 | Define owner-local vocabulary for fields | A | complete — `heuristic-name-match`, `ambiguous-test-association`, `inferred-structural-relation`, `{provenance}-structural-extraction`; steps `extract`, `resolve`, `link` |
| T-003-A3 | Surface in query output `query.ts:978-981` | A | complete — relationship edges include `reason` + `step` |
| T-003-A4 | Propagate through `code-graph-context.ts` | A | complete — context edges and text brief carry explanation fields |
| T-003-B1 | Add `minConfidence` parameter to `computeBlastRadius` | B | complete — `QueryArgs.minConfidence` filters IMPORTS traversal |
| T-003-B2 | Refactor output shape (depthGroups, riskLevel, ambiguityCandidates, failureFallback) | B | complete — added alongside prior `nodes`/`affectedFiles` shape |
| T-003-B3 | Implement risk classification rules | B | complete — documented in `implementation-summary.md` |
| T-003-B4 | Implement ambiguity detection + candidate surfacing | B | complete — ambiguous `fq_name`/`name` subjects return candidates and fallback |
| T-003-B5 | Wrap failure paths in structured `failureFallback` | B | complete — unresolved/ambiguous/query-failure paths return structured fallback |
| T-003-C1 | feature_catalog entry for `analysis/` | C | complete — `08-code-graph-edge-explanation-blast-radius-uplift.md` |
| T-003-C2 | manual_testing_playbook entry for `analysis/` | C | complete — `026-code-graph-edge-explanation-blast-radius-uplift.md` |
| T-003-C3 | sk-doc DQI ≥85 | C | complete — feature catalog DQI 87; playbook DQI 89 |
| T-003-D1 | Unit tests for all requirements | D | complete — targeted Vitest cases added |
| T-003-D2 | Run existing code-graph vitest suite | D | blocked — `npx vitest` attempted network fetch and local Vitest is absent |
| T-003-D3 | `validate.sh --strict` | D | blocked — strict validator fails on pre-existing scaffold/template mismatches and missing local `tsx` runtime |
| T-003-D4 | Populate `implementation-summary.md` | D | complete |

## Dependencies
- 012/001 license audit complete

## References
- spec.md, plan.md, checklist.md
