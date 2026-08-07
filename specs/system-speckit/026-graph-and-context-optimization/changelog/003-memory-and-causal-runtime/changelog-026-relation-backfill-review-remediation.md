---
title: "Relation-Backfill Review Remediation"
description: "Remediated deep-review SEC-001: the opt-in contradicts collector could silently invalidate a valid caused edge on a reciprocal lineage pair. Added a relation-agnostic conflict guard (hasConflictingValidEdge reusing exported relationsConflict, surfaces skippedConflicting), honest before/after delta counting, a strict inner backfill schema, and five maintainability cleanups. Triple-verified, then the non-dry production backfill was executed."
trigger_phrases:
  - "relation backfill review remediation"
  - "supersession contradicts caused invalidation"
  - "hasConflictingValidEdge backfill guard"
  - "backfill skippedConflicting honest count"
  - "026-relation-backfill-review-remediation"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-04

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/026-relation-backfill-review-remediation` (Level 3)

### Summary

A deep review of the relation-inference backfill subsystem surfaced a confirmed data-integrity defect (SEC-001). The supersession `contradicts` collector and the lineage `caused` collector emit the SAME directed pair, because lineage is reciprocal (`A.superseded_by=B` AND `B.predecessor=A`). In a committed run with `contradicts:true`, the `caused` edge inserted first, then the `contradicts` edge triggered contradiction-detection, which silently set `invalid_at` on the just-created valid `caused` edge, mislabeling an evolution as a contradiction and corrupting traversal. It would do the same to a pre-existing manual or higher-strength edge on that pair.

This packet added a relation-agnostic conflict guard that suppresses any conflict-prone backfill auto edge whose pair already carries a VALID conflicting edge (reusing the shared `relationsConflict` rules and surfacing `skippedConflicting`), made `written`/`byRelation` honest via a committed valid-auto-edge delta, made the inner `backfill` schema strict, and cleared five maintainability snags. The detector and the `contradicts` labeling are intentionally left untouched, and the fix suppresses the backfill EMISSION. Triple-verified (179-test suite including a 5-case reciprocal-pair reproduction, gpt-5.5-fast-high via cli-opencode, and an Opus probe). Committed as `bb61e8864e`.

### Added

- `hasConflictingValidEdge` in `relation-backfill.ts`: column-aware (degrades on a DB without the temporal `invalid_at` column), reuses `relationsConflict`, fails open so a conflict-check query failure never crashes `memory_causal_stats`.
- `insertNonConflictingEdges` (filter plus insert, returns skipped) and `insertInferredEdges` (single batch helper for all collectors).
- Summary field `skippedConflicting`. Skipped edges are NOT counted as written.
- `tests/relation-backfill-conflict.vitest.ts` (5 cases): reciprocal caused-survives plus contradicts-skipped plus `skippedConflicting`, pre-existing manual edge survives, `written===0` on re-run, `byRelation` equals the live valid-auto SQL distribution, and the strict inner schema rejects a typo'd key.

### Changed

- `relation-backfill.ts`: transaction reordered so non-conflicting edges insert first, then conflict-prone collectors are filtered against the in-transaction valid edge set. `written`/`byRelation` now derived from a before/after `countValidAutoEdgesByRelation` delta (replaces the over-counting `countWrittenByRelation`), so a re-run reports `written=0` and excludes any invalidated edge.
- `contradiction-detection.ts`: exported `relationsConflict` so the guard reuses the single conflict-rule source.
- `schemas/tool-input-schemas.ts`: inner `backfill` object now built via `getSchema`, so a typo'd key (`contradict`/`threshold`) throws `ToolSchemaValidationError` instead of being silently dropped.
- `handlers/causal-graph.ts`: honest hint ("wrote N new auto edges") and surfaces `skippedConflicting` when non-zero.
- Maintainability cleanups: dropped the unused `createSpecDocumentChain` import, removed the dead `bumpRelation(...,0)` no-op loop, named the spec-chain strength literals (`SPEC_CHAIN_CAUSED_STRENGTH` / `SPEC_CHAIN_SUPPORTS_STRENGTH`), extracted a single insert helper, and corrected the lock-step comment.

### Fixed

- SEC-001: a committed backfill with `contradicts:true` over a reciprocal lineage pair no longer silently invalidates the valid `caused` edge. The conflicting `contradicts` is skipped and reported under `skippedConflicting`, and the guard protects every pre-existing valid edge, manual or auto, for any conflicting relation.
- The over-counting summary that reported upserts on a re-run as if freshly written. `written`/`byRelation` now reflect only the newly-inserted valid-auto-edge delta.
- The non-strict inner `backfill` schema that silently dropped typo'd keys.

### Verification

| Check | Result |
|-------|--------|
| `tsc --noEmit` | PASS (0 errors) |
| `vitest run` over the required plus keep-green suites (9 files) | PASS (179 passed) |
| `relation-backfill-conflict.vitest.ts` P0 plus P1 honesty cases | PASS (reciprocal `caused` stays valid while `contradicts` is skipped, manual edge survives, `written===0` on re-run, `byRelation` deep-equals the live valid-auto distribution) |
| Cross-model triple verification | PASS (gpt-5.5-fast-high via cli-opencode and an Opus probe, in addition to the local suite) |
| Comment hygiene | PASS (grep confirms no spec-path/packet/finding ids in production code comments) |
| Production backfill executed 2026-06-04 (non-dry, similarity:true, contradicts:true, limit 2000) | PASS (skippedConflicting 0, no invalidation, the SEC-001 guard held in production) |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/causal/relation-backfill.ts` | Conflict guard, honest delta counting, single insert helper, P2 cleanups |
| `.opencode/skills/system-spec-kit/mcp_server/lib/graph/contradiction-detection.ts` | Exported `relationsConflict` for reuse |
| `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | Strict inner `backfill` object via `getSchema` |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/causal-graph.ts` | Honest hint wording plus `skippedConflicting` surfacing |
| `.opencode/skills/system-spec-kit/mcp_server/tests/relation-backfill-conflict.vitest.ts` | NEW. 5 conflict-guard plus honesty plus strict-schema cases |

### Follow-Ups

- Supersession `contradicts` is intentionally NOT auto-created on a pair that already carries a valid conflicting edge. An explicit `contradicts` can still be added via `memory_causal_link` if a real contradiction (not an evolution) is recorded.
- Structurally, `caused` stays below the 5% coverage target because `supports` dominates the inferred distribution. The production run raised total coverage 39.91% to 43.59% and `caused` from 3 to 103 edges, still under target.
- When both a similarity `supports` and a supersession `contradicts` candidate target the same pair, the first-inserted (`supports`) wins and the `contradicts` is skipped. This is deterministic by insert order, not a value judgement between the two signals.
