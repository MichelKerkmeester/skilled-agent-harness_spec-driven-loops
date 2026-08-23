---
title: "Implementation Plan: Mode Projection Contracts"
description: "Build the mode-owned legacy-projection contracts by composing single-artifact contracts into surface contracts, proving each against its real consumer, and honestly reclassifying the surfaces the build proved are not ledger folds."
trigger_phrases:
  - "mode projection contracts plan"
  - "projection contract build plan"
importance_tier: "important"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/009-mode-projection-contracts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/009-mode-projection-contracts"
    last_updated_at: "2026-08-23T06:30:00Z"
    last_updated_by: "claude"
    recent_action: "Built the foundation and six contracts; reclassified three surfaces"
    next_safe_action: "Proceed to 004-legacy-writer-retirement"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/legacy-projections/legacy-projection-surface-fold.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Three surfaces are reducer output or operator input, not ledger folds"
---

# Implementation Plan: Mode Projection Contracts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

|| Aspect | Value |
|--------|-------|
| **Surface** | `lib/legacy-projections/`, the projection coverage checker, and the projection manifest |
| **Change class** | Additive composition foundation plus six new contracts and three honest reclassifications |
| **Authority** | Untouched; this phase writes no authority record |
| **Blast radius** | Contained: the single-artifact engine, store, and existing contracts stay behaviourally unchanged |

The projection library shipped one contract — `research-state`. The coverage checker named the
remaining mode-owned surfaces as projectable-but-uncovered, and their consumers still read the legacy
files directly. This plan extends the library by **composition** — a surface contract that yields
several single-artifact contracts — so every surface that is genuinely a ledger fold gets a real
contract, and the surfaces the build proves are *not* ledger folds are reclassified honestly rather
than fabricated.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

|| Gate | Command | Pass condition |
|------|---------|----------------|
| Coverage | `node scripts/check-projection-coverage.cjs` | `modeOwned.uncovered` reaches `0`; both cross-check constants balanced |
| Materialization | `npx vitest run tests/unit/<surface>-contract.vitest.ts` | Byte assertion over folded events passes |
| Real consumer | consumer run against the projected file | No corruption warning; derived state reflects the folded events |
| Negative control | toggle off one condition, re-run | Byte proof and consumer proof both go red; restore returns green |
| Suite delta | full projection suite vs captured baseline | Failed-test count does not increase |
| Packet | `validate.sh 009-mode-projection-contracts --strict` | `Errors: 0` |
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The shipped `LegacyProjectionContract` models exactly one `json`/`jsonl` artifact. Most mode-owned
surfaces are not single artifacts: two are per-iteration delta directories, three are multi-file
groups, and one carries a markdown file. The library is extended by composition rather than by
rewriting the engine.

- A new `LegacyProjectionSurfaceContract` names a surface and a `buildArtifacts(events)` function
  that returns an ordered set of ordinary single-artifact `LegacyProjectionContract`s — one per file
  the surface projects. A `foldLegacyProjectionSurface` helper folds each member artifact and returns
  its bytes. The single-artifact engine, store, and fold stay unchanged.
- `LegacyProjectionFormat` is extended to `'json' | 'jsonl' | 'md'`. A markdown artifact's
  `serialize()` returns a markdown string the store already writes verbatim.
- Per-iteration deltas are modelled as a surface whose `buildArtifacts` partitions events by
  iteration and emits one artifact per iteration, so the dynamic file set is derived from the ledger.

Each contract is orchestrated to a single executor and verified against the real consumer, not a
mirror of it. A contract that passes its own byte assertion but that the real reducer chokes on is
not done. Single dispatch at a time; the session is continued rather than restarted when a build is
interrupted.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Foundation

- Build the `review-state` single-file jsonl contract as the proven pilot pattern.
- Extend the type system: `LegacyProjectionFormat` gains `'md'`; add `LegacyProjectionSurfaceContract`
  and `foldLegacyProjectionSurface`.
- Prove the foundation: a mixed (jsonl+md) surface and a per-iteration delta fan-out fold correctly,
  with a negative control.

### Phase 2: Surface contracts

- Build the direct-append surface contracts, each folding its mode's ledger events into the legacy
  files its consumer reads: `review-deltas`, `research-deltas`, `alignment-state-deltas`,
  `improvement-ledgers`, `council-config-state`.
- Prove each against its real consumer with an independent negative control that goes red when its
  single condition is disabled and green when restored.

### Phase 3: Reclassification & integration

- Reclassify the three surfaces the build proved are not ledger folds to `retain-legacy-input`:
  `research-strategy-inbox` (authored prose + operator inbox; ledger carries only digests),
  `review-projections` and `research-projections` (reducer output from projected state and deltas,
  not folded from the ledger).
- Register every covered contract in the coverage checker so `modeOwned.uncovered` reaches `0`.
- Re-run the full projection suite and report the delta; run strict packet validation.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

|| Test Type | Scope | Tools |
|-----------|-------|-------|
| Materialization | Each contract | `npx vitest run tests/unit/<surface>-contract.vitest.ts` — byte assertion over folded events |
| Real consumer | Each contract | The mode's own reducer/verifier run against the projected file |
| Negative control | Each contract | Toggle one fold condition off; assert red; restore; assert green |
| Coverage | All surfaces | `node scripts/check-projection-coverage.cjs` from the runtime dir |
| Suite delta | Projection suite | Full projection suite re-run vs the captured baseline |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

|| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `003-fleet-enablement` | Predecessor | Complete | All modes must be on ledger authority before their writers can be retired |
| `004-legacy-writer-retirement` | Successor | Pending | Blocked until every mode-owned surface is covered or honestly reclassified |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **A plausible-but-wrong row shape** is caught by running the real consumer, the objective check the
  contract exists to satisfy.
- **A green that cannot go red** is caught by the mandatory negative control on every contract.
- **A silent authority-record change** is caught by listing the authority store after every dispatch;
  this phase writes none. The authority store is byte-identical to its pre-phase state.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:cross-refs -->
## Cross-References

|| Reference | Location |
|-----------|----------|
| Requirements | `spec.md` §4 |
| Task list | `tasks.md` |
| Verification contract | `checklist.md` |
| Design | `decision-record.md` |
| Template contract | `../../../../../.opencode/skills/system-deep-loop/runtime/lib/legacy-projections/deep-research-contract.ts` |
| Predecessor | `../003-fleet-enablement/` |
| Blocks | `../004-legacy-writer-retirement/` |
<!-- /ANCHOR:cross-refs -->
