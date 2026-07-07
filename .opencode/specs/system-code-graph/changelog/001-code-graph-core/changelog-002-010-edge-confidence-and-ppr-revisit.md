---
title: "Changelog: Edge-Confidence Differentiation and Seeded-PPR Revisit [002-code-graph/010-edge-confidence-and-ppr-revisit]"
description: "Chronological changelog for the Edge-Confidence Differentiation and Seeded-PPR Revisit phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-07-01

> Spec folder: `.opencode/specs/system-code-graph/001-code-graph-core/010-edge-confidence-and-ppr-revisit` (Level 3)
> Parent packet: `.opencode/specs/system-code-graph/001-code-graph-core`

### Summary

Seeded-PPR code-graph ranking was cut once already because every CALLS edge carried identical confidence metadata (0.8/INFERRED/heuristic), leaving PPR nothing to differentiate on and tying the flat walk exactly on every metric. The original benchmark record explicitly left the door open, calling that "not a refute of PPR as an algorithm, a verdict on this substrate." This phase built the missing prerequisite, a real per-edge confidence gradient for CALLS edges gated behind a new default-off flag, recovered the deleted seeded-PPR module byte-for-byte from git history, re-wired it to consume that gradient and re-ran the original unmodified benchmark to get a clean second verdict.

### Added

- New default-off flag `SPECKIT_CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION`, defined in `edge-confidence-flags.ts`.
- Same-file candidate-cardinality confidence differentiation in `structural-indexer.ts` (0.75/INFERRED for a single candidate, 0.35/AMBIGUOUS for multiple).
- Cross-file resolution-quality confidence differentiation in `cross-file-edge-resolver.ts`, writing the resolved/ambiguously-skipped/unresolved classification it already computed into edge metadata (0.9/EXTRACTED for a clean resolution, 0.3/AMBIGUOUS for a multi-candidate tie) instead of discarding it after fixing up `target_id`.
- The deleted seeded-PPR module (`computeBoundedPersonalizedPageRank` and supporting code), recovered from git history into `code-graph-context.ts`, along with its own two recovered vitest files and its recovered eval script.

### Changed

- With both flags off, behavior is byte-identical to before this phase. Every CALLS edge still gets the same constant 0.8/INFERRED/heuristic metadata, proven by the existing code-graph vitest suite passing identically against a genuine stash/pop before/after comparison.
- With both flags on, `contextEdgeReliability` now has a real confidence gradient to blend into transition weights instead of a uniform constant, since it was already live for other consumers but had never had differentiated confidence to work with before.

### Fixed

- An ADR-001 near-miss caught during recovery: the first recovery pass replaced the module's original cross-subsystem dependency (a dynamic import of the Memory MCP's compiled `collectWeightedWalk`) with a local reimplementation of the same walker, because the compiled dist output wasn't present in the isolation worktree. This violated this packet's own decision record against standing up a second graph-walk engine. Caught by diffing the recovered file's imports against the pre-deletion original via `git show`, and fixed by building the missing dist output and restoring the real shared-substrate dynamic import.

### Verification

| Check | Result |
|-------|--------|
| `tsc --noEmit` (confidence differentiation) | PASS, 0 errors |
| Existing code-graph vitest suite, flag off (regression proof) | PASS, same pre-existing baseline failures confirmed via a real stash/pop before/after comparison, 0 new failures |
| `tsc --noEmit` (PPR recovery + ADR-001 fix) | PASS, 0 errors |
| Recovered PPR module's own unit tests | PASS, 2 files / 9 tests |
| Fresh full-repo reindex with flag on | PASS, 4 distinct confidence values landed in the live database (892 edges at 0.3, 2267 at 0.35, 16198 at 0.75, 2838 at 0.9), replacing the uniform 0.8 |
| Re-benchmark, original unmodified harness, both flags on | PASS, run completed against the same 20 labeled queries, same metrics, same damping sweep 0.5-0.95 |

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts` | Modified | Same-file candidate-cardinality confidence differentiation for CALLS edges |
| `.opencode/skills/system-code-graph/mcp_server/lib/cross-file-edge-resolver.ts` | Modified | Writes the existing resolution-quality classification into edge confidence metadata instead of discarding it |
| `.opencode/skills/system-code-graph/mcp_server/lib/edge-confidence-flags.ts` | Created | New default-off flag `SPECKIT_CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION` |
| `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts` | Modified (recovered) | Deleted seeded-PPR module (`computeBoundedPersonalizedPageRank`) recovered from git history and re-wired to consume the new differentiated confidence via `contextEdgeReliability` |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-seeded-ppr-ranking.vitest.ts` | Created (recovered) | Recovered PPR module's own unit test coverage |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-seeded-ppr-flag-on-path.vitest.ts` | Created (recovered) | Recovered flag-on path coverage |
| `.opencode/skills/system-code-graph/mcp_server/scripts/eval/score-seeded-ppr-retrieval.mjs` | Created (recovered) | Recovered eval script |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-cross-file-edges.vitest.ts` | Modified | New confidence-differentiation unit test cases |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-indexer.vitest.ts` | Modified | New confidence-differentiation unit test cases |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modified | New flag documented |

### Follow-Ups

- No further seeded-PPR revisit is planned. The open question the original benchmark record left open, whether PPR performs differently with a real edge-confidence gradient, now has a clear negative answer: it loses on every metric instead of tying.
- Both the new confidence-differentiation flag and the recovered seeded-PPR flag stay default-off. No production behavior changed.
