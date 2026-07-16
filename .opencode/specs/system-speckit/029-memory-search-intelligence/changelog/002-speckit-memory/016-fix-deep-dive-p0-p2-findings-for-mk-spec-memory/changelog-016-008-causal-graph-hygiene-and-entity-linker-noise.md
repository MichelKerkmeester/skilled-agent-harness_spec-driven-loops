---
title: "Changelog: Causal-Graph Hygiene and Entity-Linker Noise [016/008-causal-graph-hygiene-and-entity-linker-noise]"
description: "Down-weighted the entity-linker supports edges that were most of the causal graph, stopped the strength ratchet, regenerated placeholder surrogate titles and fixed the community lifecycle and graph-signals correctness."
trigger_phrases:
  - "causal graph hygiene changelog"
  - "entity linker noise downweight"
  - "surrogate title regeneration"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-07-04

> Spec folder: `.opencode/specs/system-speckit/029-memory-search-intelligence/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/008-causal-graph-hygiene-and-entity-linker-noise/` (Level 3)
> Parent packet: `.opencode/specs/system-speckit/029-memory-search-intelligence/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/`

### Summary

The causal graph is no longer 94 percent noise. Of 33,101 edges, 31,118 were auto-created entity-linker `supports` edges at full causal strength, so a real causal edge could never outrank the co-occurrence sludge. This phase down-weighted 31,644 `entity_linker` `supports` edges from strength 0.7 to 0.05 in place. That is a provenance-scoped UPDATE rather than a delete, so the default causal read is dominated by real edges while the history is preserved for opt-in consumers. `recomputeLocal` no longer ratchets toward 1.0. The causal-links resolver stops attaching a wrong memory with a confident polarity. Placeholder surrogate titles were regenerated for 3,787 rows. The community lifecycle and graph-signals correctness bugs were fixed. Two live migrations ran under an atomic backup. Shipped in `bf44d13752`.

### Added

- Generation-time real titles for new surrogate rows.
- A write-path staleness rebuild for the community subsystem so it rebuilds on a live cadence with stable IDs.

### Changed

- 31,644 `entity_linker` `supports` edges dropped from strength 0.7 to 0.05, below the causal band.
- `recomputeLocal` replaces the additive strength climb with a non-accumulating computation, so re-runs are idempotent.
- The entity linker's incremental path normalizes identifiers the same way the full run does, so incremental and full-rebuild agree.
- The density guard counts only numeric-endpoint memory-to-memory edges, so pseudo-edges cannot trip it.
- The session-trace causal reducer requires two or more distinct-session co-occurrences and excludes same-query co-retrieved pairs before inferring an edge.
- Graph-signals momentum uses a nearest-snapshot lookup, keys caches on DB identity and drains its dirty-set on read.

### Fixed

- The causal-links resolver fuzzy-`LIKE` fallback returns unresolved-with-suggestions instead of silently attaching a wrong memory.
- `createEntityLinks` invalidates the caches it dirties.
- Per-memory linking failures are contained so one bad memory cannot escalate into a full-corpus relink.
- 3,787 placeholder `Memory NNNN` surrogate questions were regenerated from the stored document title.

### Verification

- `npx tsc --build` exit 0.
- 008 targeted vitest 225 of 225 across 8 files.
- REQ review 11 of 13 on the first pass. The community rebuild cadence and the dirty-set drain were remediated.
- Migration copy-tested on a 1.4 GB live clone, integrity ok, FK clean, both idempotent.
- Live down-weight 31,644 edges to 0.05, residual at 0.7 is zero.
- Live surrogate titles 3,787 rewritten, residual candidates zero.
- Live `integrity_check` and `foreign_key_check` ok.
- `validate.sh --strict` pass.

### Files Changed

- `mcp_server/lib/graph/community-detection.ts` fixes the community lifecycle.
- `mcp_server/lib/graph/graph-signals.ts` fixes the signal correctness bugs.
- `mcp_server/lib/search/entity-linker.ts` tightens the linker.
- `mcp_server/scripts/migrations/downweight-entity-linker-supports.mjs` is the live down-weight.

### Follow-Ups

- Code effects apply on the next daemon-lease restart. The two live data migrations are already in effect against the corpus.
- The Louvain to label-propagation rename and a real weighted-modularity algorithm are deferred until phase 006's eval harness can measure them.
