---
title: "Implementation Summary: Mode Projection Contracts"
description: "A projection-composition foundation plus six ledger-fold projection surface contracts were built and proven against their real consumers, and three surfaces the build proved are not ledger folds were honestly reclassified to retain-legacy-input; the coverage checker reports zero mode-owned gaps and no authority record changed."
trigger_phrases:
  - "mode projection contracts summary"
  - "projection surface contracts"
  - "ledger-fold projection coverage"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/009-mode-projection-contracts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/009-mode-projection-contracts"
    last_updated_at: "2026-08-23T06:30:00Z"
    last_updated_by: "claude"
    recent_action: "Reconciled the packet to complete: six contracts, three reclassifications, coverage at zero"
    next_safe_action: "Proceed to 004-legacy-writer-retirement"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/legacy-projections/legacy-projection-surface-fold.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/legacy-projections/deep-review-state-contract.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/legacy-projections/deep-review-deltas-contract.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/legacy-projections/deep-research-deltas-contract.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/legacy-projections/deep-alignment-state-deltas-contract.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/legacy-projections/deep-improvement-ledgers-contract.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/legacy-projections/deep-ai-council-config-state-contract.ts"
      - ".opencode/skills/system-deep-loop/runtime/scripts/check-projection-coverage.cjs"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Six mode-owned surfaces are ledger folds and got real contracts; the seventh (research-state) was the pre-existing pilot"
      - "Three mode-owned surfaces are not ledger folds and were reclassified, not fabricated"
      - "The coverage checker reaches modeOwned.uncovered=0 with both cross-check constants balanced"
      - "No authority record changed during this phase"
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

# Implementation Summary: Mode Projection Contracts

<!-- ANCHOR:metadata -->
## 1. METADATA

|| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/009-mode-projection-contracts |
| **Status** | Complete |
| **Commit** | see `git log` on `worktrees/022-012-runtime-enablement-build`, not pushed |
| **Completed** | Six ledger-fold contracts built and proven; three non-foldable surfaces reclassified; coverage at zero mode-owned gaps |
| **Lines** | code and test files changed across the phase's commit chain |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

The projection library shipped exactly one contract — `research-state`. The coverage checker named the
remaining mode-owned surfaces as projectable-but-uncovered, and their consumers still read the legacy
files directly. This phase extended the library by composition and built a real contract for every
surface that is genuinely a ledger fold, then honestly reclassified the three surfaces the build proved
are not.

**The composition foundation.** A new `LegacyProjectionSurfaceContract` names a surface and a
`buildArtifacts(events)` function that returns an ordered set of ordinary single-artifact
`LegacyProjectionContract`s — one per file the surface projects. A `foldLegacyProjectionSurface` helper
folds each member artifact and returns its bytes (`lib/legacy-projections/legacy-projection-surface-fold.ts`).
`LegacyProjectionFormat` was extended to `'json' | 'jsonl' | 'md'`. The single-artifact engine, store, and
fold stay unchanged, so every surface that already works keeps working. The foundation was proven first:
a mixed (jsonl+md) surface and a per-iteration delta fan-out fold correctly, with an independent negative
control that went red when its condition was disabled and green when restored.

**Six ledger-fold projection surface contracts**, each built and verified with a byte proof, a real-consumer
proof, and an independent negative control that went red when its single condition was disabled and green
when restored:

1. `deep-review-state` (`deep-review-state-contract.ts`) — consumer `reduceReviewState`.
2. `deep-review-deltas` (`deep-review-deltas-contract.ts`) — consumer `loadDeltaPayloads`/`buildRegistry`
   (`openFindingsCount===2`).
3. `deep-research-deltas` (`deep-research-deltas-contract.ts`) — consumer `verify-iteration.cjs`
   (`ok:true`).
4. `deep-alignment-state-deltas` (`deep-alignment-state-deltas-contract.ts`) — consumer
   `reduceAlignmentState`.
5. `deep-improvement-ledgers` (`deep-improvement-ledgers-contract.ts`) — consumer
   `deep-improvement/scripts/shared/reduce-state.cjs`.
6. `deep-ai-council-config-state` (`deep-ai-council-config-state-contract.ts`) — projects
   `ai-council-state.jsonl` + `session-state.jsonl`; `ai-council-config.json` was honestly omitted because
   it is operator input and the ledger carries only its digest.

Together with the pre-existing `research-state` pilot contract, **seven mode-owned surfaces are covered**.

**Three honest reclassifications.** The build proved three surfaces are not ledger-fold projections, and
they were reclassified in the manifest from disposition `project` to `retain-legacy-input` (`serializerId`
null, `refreshBoundary` null, non-null `nonProjectableReason` + `laterOwner`):

- `research-strategy-inbox` — `deep-research-strategy.md` is authored strategy prose and `inbox.jsonl` is
  operator input; the ledger carries only digests, never the content.
- `review-projections` — produced by the deep-review reducer from projected state and deltas, not folded
  from the ledger.
- `research-projections` — produced by the deep-research reducer from projected state and deltas, not
  folded from the ledger.

This is an honest reclassification, not a fabricated contract. A recorded gap is preferred over a
fabricated file.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED

The foundation and the six contracts were built one at a time, each orchestrated to a single executor
with a fact-inlined brief pointing at the template contract, the schema, and the real consumer. The
orchestrator read the diff, re-ran the coverage checker, ran the real consumer, and ran the negative
control independently before accepting each contract. Single dispatch at a time; the session was
continued rather than restarted when a build was interrupted. The three reclassifications were made once
the build had proved the surfaces were not ledger folds, rather than fabricating a contract to satisfy the
checker.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS

**Composition over an engine rewrite.** The shipped `LegacyProjectionContract` models one artifact; most
mode-owned surfaces are multi-file. Rewriting the engine is a larger blast radius over a component already
tested and consumed by the rollback drills. Composition reuses it.

**A recorded gap over a fabricated contract.** `research-strategy-inbox`, `review-projections`, and
`research-projections` could have been given plausible-looking contracts to drive the uncovered count to
zero. The build proved they are operator input or reducer output, not ledger folds, so they were
reclassified honestly instead. A fabricated file would have projected bytes that no real append produces.

**`ai-council-config.json` omitted, not projected.** The config file is operator input; the ledger carries
only its digest. Projecting it would mean inventing content the ledger never recorded. The consumer
tolerates its absence, so the contract projects the two state files and leaves the config to its operator.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## 5. VERIFICATION

**Coverage.** `node scripts/check-projection-coverage.cjs` run from the runtime dir reports exactly
`{"ok":true,"projectable":19,"covered":7,"uncovered":12,"breakdown":{"modeOwned":{"total":7,"uncovered":0},"infrastructure":{"total":12,"uncovered":12}}}`,
exit 0. The cross-check constants balanced: `UNCOVERED_DECLARED_COUNT=12`,
`MODE_OWNED_EXPECTED_COUNT=7`. `modeOwned.uncovered` is `0`.

**Negative control on the coverage checker.** Flipping one reclassified surface back to `project` produced
`modeOwned.uncovered=1` plus `UNDECLARED_UNCOVERED_SURFACE` and exit 2; restoring it returned
`modeOwned.uncovered=0` and exit 0. The reclassification is what holds the count at zero.

**Per-contract proof.** Each of the six contracts has a materialization byte proof, a real-consumer proof,
and an independent negative control that went red when its single condition was disabled and green when
restored. The real consumers are the modes' own reducers and verifiers — `reduceReviewState`,
`loadDeltaPayloads`/`buildRegistry`, `verify-iteration.cjs`, `reduceAlignmentState`,
`deep-improvement/scripts/shared/reduce-state.cjs`, and the three council consumers — not mirrors of them.

**Coverage checker test corrected.** `tests/unit/check-projection-coverage.vitest.ts` had a stale fixture
builder seeded only with the review-state contract; it was corrected to seed all seven covered contracts so
case 5 (`MISSING_CONTRACT_EXPORT`) again observes exactly the one violation it induces.

**Suite delta.** The full projection suite (9 files) ran 39 passed / 1 failed, exit 1. The single failure
is pre-existing and out of scope — a `model-benchmark-hub-output` path drift (census `prompt-models` vs
manifest `sk-prompt-models`, a separate hub-rename), not a projection-contract surface. No
projection-contract test regressed.

**Authority.** The authority store (`.opencode/skills/.authority-state/`) is byte-identical to its pre-phase
state — 009 changed no authority record.
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS

**The three reclassified surfaces are `retain-legacy-input` by design.** `research-strategy-inbox`,
`review-projections`, and `research-projections` are operator input or reducer output, not ledger folds.
They are not projected from the ledger and are not meant to be; their legacy writers are retained. This is
an accepted, recorded gap, not a deficiency to close later.

**One pre-existing suite failure is out of scope.** The `model-benchmark-hub-output` failure is a path drift
from a separate hub-rename (`prompt-models` vs `sk-prompt-models`), unrelated to projection contracts. It
predates this phase and is not a projection-contract regression.

**The twelve infrastructure surfaces remain uncovered.** The coverage checker reports
`infrastructure.total=12, uncovered=12`. These are not mode-owned and are out of the retirement's scope by
design (spec.md §2 Non-Goals).
<!-- /ANCHOR:limitations -->
