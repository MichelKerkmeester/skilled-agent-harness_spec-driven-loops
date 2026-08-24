---
title: "Decision Record: Mode Projection Contracts"
description: "Records why the projection library is extended by composition — a surface contract that yields several single-artifact contracts — rather than by rewriting the single-artifact engine, and why reducer-derived projections delegate to the reducer instead of reimplementing it."
trigger_phrases:
  - "projection contract decisions"
  - "surface projection composition"
importance_tier: "important"
contextType: "decision"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/009-mode-projection-contracts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/009-mode-projection-contracts"
    last_updated_at: "2026-08-24T06:19:12Z"
    last_updated_by: "claude"
    recent_action: "Recorded the composition design and the honest reclassification"
    next_safe_action: "Proceed to 004-legacy-writer-retirement"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/legacy-projections/legacy-projection-types.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Three surfaces are reducer output or operator input, not ledger folds"
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

# Decision Record: Mode Projection Contracts

<!-- ANCHOR:context -->
## 1. CONTEXT

The fleet flip moved all eight modes to ledger authority, but only the `research-state` surface had a
projection contract. Eight more mode-owned surfaces are named uncovered by the coverage checker, and their
consumers still read the legacy files directly. Inspection showed the eight are not uniform: two are
per-iteration delta directories (`deltas/iter-NNN.jsonl`), three are multi-file groups, one carries a
markdown file, and two (`review-projections`, `research-projections`) are produced by the reducer from the
state file rather than folded from the ledger at all. The shipped `LegacyProjectionContract` models exactly
one `json`/`jsonl` artifact, so none of the eight fit it as a single pilot-style contract.
<!-- /ANCHOR:context -->

<!-- ANCHOR:decision -->
## 2. DECISION

Extend the library by **composition**, not by rewriting the engine.

- A new `LegacyProjectionSurfaceContract` names a surface and a `buildArtifacts(events)` function that returns
  an ordered set of ordinary single-artifact `LegacyProjectionContract`s — one per file the surface projects.
  A `foldLegacyProjectionSurface` helper folds each member artifact and returns its bytes. The single-artifact
  engine, store, and fold stay unchanged, so every surface that already works keeps working.
- `LegacyProjectionFormat` gains `'md'`. A markdown artifact's `serialize()` returns a markdown string that the
  store already writes verbatim; only the format union needed widening.
- **Per-iteration deltas** are modelled as a surface whose `buildArtifacts` partitions the events by iteration
  and emits one artifact per iteration, so the dynamic file set is derived from the ledger, not hardcoded.
- **Reducer-derived projections** — `review-projections` and `research-projections` — were investigated as
  delegation candidates but the build proved they are not ledger folds at all: they are produced by the
  mode's reducer from the projected state and deltas, not folded from the ledger. They are honestly
  reclassified to `retain-legacy-input` (`serializerId` null, `refreshBoundary` null, non-null
  `nonProjectableReason` + `laterOwner`) rather than fabricated into a contract. A recorded gap is preferred
  over a fabricated file.
<!-- /ANCHOR:decision -->

<!-- ANCHOR:alternatives -->
## 3. ALTERNATIVES CONSIDERED

| Alternative | Why not |
|-------------|---------|
| Minimal-correct: build only the load-bearing state contracts and reclassify deltas/projections as derived | Adopted in part: the seven foldable surfaces got real contracts; the three surfaces the build proved non-foldable (`research-strategy-inbox`, `review-projections`, `research-projections`) were reclassified to `retain-legacy-input` — an accepted, recorded gap rather than a fabricated contract |
| Rewrite the engine to be natively multi-artifact | Larger blast radius; the single-artifact engine is already tested and consumed by the rollback drills. Composition reuses it |
| Reimplement each reducer's registry/dashboard inside a projection fold | Moot for the reducer-derived surfaces once the build proved they are reducer output, not ledger folds; reclassification removes the need to duplicate the consumer's logic |
| Roll back the seven non-research flips | Rejected by the operator; abandons the fleet cutover rather than completing it |
<!-- /ANCHOR:alternatives -->

<!-- ANCHOR:consequences -->
## 4. CONSEQUENCES

- The build is staged: a foundation (surface type, `md` format, surface-fold helper) proven first, then one
  contract per foldable surface, each proven against its real consumer.
- Blast radius stays contained: no change to the single-artifact engine, store, or existing contracts'
  behaviour. The projection manifest is edited only to reclassify the three non-foldable surfaces.
- The coverage checker reaches `modeOwned.uncovered = 0` by registering a surface factory per foldable
  surface, the same export check it already performs. The three reclassified surfaces leave the mode-owned
  uncovered count at zero because they are no longer declared `project`.
- No authority record changes; the authority store is byte-identical to its pre-phase state.
<!-- /ANCHOR:consequences -->
