---
title: "Checklist: Mode Projection Contracts"
description: "Blocking verification contract: a surface-composition foundation, six ledger-fold projection contracts each proven against its real consumer with a negative control, three honest reclassifications, coverage at zero mode-owned gaps, and no authority record changed."
trigger_phrases:
  - "mode projection contracts checklist"
importance_tier: "critical"
contextType: "verification"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/009-mode-projection-contracts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/009-mode-projection-contracts"
    last_updated_at: "2026-08-24T06:19:12Z"
    last_updated_by: "claude"
    recent_action: "Reconciled the checklist to the verified final state"
    next_safe_action: "Proceed to 004-legacy-writer-retirement"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Three surfaces are reducer output or operator input, not ledger folds"
---
# Verification Checklist: Mode Projection Contracts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

A projection contract counts only when its real consumer reads the projected file and reduces it
without corruption, and only when an independent negative control goes red when the fold is broken
and green when it is restored. A surface that the build proves is not a ledger fold is reclassified
honestly to `retain-legacy-input` — a recorded gap — never fabricated into a contract. No item here
is advisory.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Predecessor `003-fleet-enablement` complete; every mode on ledger authority (REQ-007) [EVIDENCE: predecessor moved all eight modes to ledger authority; this phase touches no authority record]
- [x] CHK-002 [P0] Coverage baseline captured: only `research-state` had a projection contract; the remaining mode-owned surfaces were projectable-but-uncovered [EVIDENCE: coverage checker before this phase reported the mode-owned surfaces as uncovered; consumers still read the legacy files directly]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-003 [P0] `LegacyProjectionSurfaceContract` and `foldLegacyProjectionSurface` exist and are exported; the single-artifact engine, store, and existing contracts are behaviourally unchanged (REQ-001) [EVIDENCE: `legacy-projection-surface-fold.ts` + `legacy-projection-types.ts`; `LegacyProjectionFormat` extended to `'json' | 'jsonl' | 'md'`; `legacy-projections.test.ts` still 14 passed]
- [x] CHK-004 [P1] Comments carry the durable why; no spec paths, packet numbers, or task ids in code comments [EVIDENCE: scan of `lib/legacy-projections/` and `scripts/check-projection-coverage.cjs` for spec paths and `ADR-`/`REQ-`/`CHK-`/`SC-`/`T-NNN` ids returns 0 matches; comment-hygiene pre-commit gate enforces the same invariant]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-005 [P0] Each of the six built contracts has a materialization test that folds events and asserts the projected bytes (REQ-005, SC-002) [EVIDENCE: `deep-review-state-contract.vitest.ts`, `deep-review-deltas-contract.vitest.ts`, `deep-research-deltas-contract.vitest.ts`, `deep-alignment-state-deltas-contract.vitest.ts`, `deep-improvement-ledgers-contract.vitest.ts`, `deep-ai-council-config-state-contract.vitest.ts` — byte proofs over folded events]
- [x] CHK-006 [P0] For each contract, the real consumer reads the projected file(s) and reduces without a corruption warning (REQ-003, SC-003) [EVIDENCE: `reduceReviewState` (review-state); `loadDeltaPayloads`/`buildRegistry` with `openFindingsCount===2` (review-deltas); `verify-iteration.cjs` `ok:true` (research-deltas); `reduceAlignmentState` with `iterationsRun=2` (alignment); `deep-improvement/scripts/shared/reduce-state.cjs` (improvement); `replay-graph-from-artifacts.cjs`/`advise-council-completion.cjs`/`round-state-jsonl.cjs` (council)]
- [x] CHK-007 [P0] Every contract carries a negative control that goes red when its fold is broken and green when restored (SC-002) [EVIDENCE: each contract's test toggles one condition off → byte proof and consumer proof both RED; restore → GREEN. Foundation negative control: `legacy-projection-surface-fold.vitest.ts` flip→RED, restore→GREEN]
- [x] CHK-008 [P0] `check-projection-coverage.cjs` reports `modeOwned.uncovered = 0` with both cross-check constants balanced (REQ-004, SC-001) [EVIDENCE: `node scripts/check-projection-coverage.cjs` from the runtime dir → `{"ok":true,"projectable":19,"covered":7,"uncovered":12,"breakdown":{"modeOwned":{"total":7,"uncovered":0},"infrastructure":{"total":12,"uncovered":12}}}`, exit 0. Constants `UNCOVERED_DECLARED_COUNT=12` and `MODE_OWNED_EXPECTED_COUNT=7` balanced. Negative control on the checker: flipping one reclassified surface back to `project` → `modeOwned.uncovered=1` + `UNDECLARED_UNCOVERED_SURFACE` + exit 2; restored → `modeOwned.uncovered=0`, exit 0]
- [x] CHK-009 [P1] The coverage checker's own test seeds all seven covered contracts [EVIDENCE: `tests/unit/check-projection-coverage.vitest.ts` had a stale fixture builder seeded only with the review-state contract; corrected to seed all seven so case 5 (`MISSING_CONTRACT_EXPORT`) observes exactly the one violation it induces]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-010 [P0] The three reclassified surfaces are `retain-legacy-input` by design, not fabricated contracts (REQ-001) [EVIDENCE: `research-strategy-inbox` (authored `deep-research-strategy.md` prose + `inbox.jsonl` operator input; ledger carries only `strategyDigest`+`focusRef`), `review-projections` and `research-projections` (reducer output from projected state and deltas, not ledger folds) — manifest disposition `retain-legacy-input`, `serializerId` null, `refreshBoundary` null, non-null `nonProjectableReason` + `laterOwner`. No contract file written for these surfaces]
- [x] CHK-011 [P0] `ai-council-config.json` is honestly omitted from the council contract (REQ-002) [EVIDENCE: `deep-ai-council-config-state-contract.ts` projects `ai-council-state.jsonl` + `session-state.jsonl`; the config file is operator input and the ledger carries only its digest; the consumer tolerates its absence]
- [x] CHK-012 [P0] Every new contract's identity fields agree with its manifest row (REQ-006, SC-004) [EVIDENCE: contract-manifest agreement check; `foldId`, `serializerId`, `legacyWriter`, `readers` match the manifest row]
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-013 [P0] No authority record changed during this phase (REQ-007, SC-005) [EVIDENCE: `.opencode/skills/.authority-state/` byte-identical to its pre-phase state — 009 changed no authority record]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-014 [P1] `implementation-summary.md` records the foundation, the six contracts, the three reclassifications, the coverage proof, and the suite delta [EVIDENCE: `implementation-summary.md` §2 (what was built), §5 (verification), §6 (known limitations)]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-015 [P2] The scoped diff touches only projection-contract surfaces, the manifest, tests, and the coverage checker; no authority/runtime-contract drift [EVIDENCE: this phase added six contract files, the surface-fold foundation, the coverage checker constants, and per-contract tests; the authority store is unchanged]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

- [x] CHK-016 [P0] `validate.sh` on this folder with `--strict` reports Errors: 0 (SC-006) [EVIDENCE: `validate.sh --strict` on this folder — Errors: 0, after aligning the docs to Level 2 and regenerating the metadata]
- [x] CHK-017 [P0] Every item above is `[x]` with evidence, or the phase is not complete [EVIDENCE: all 17 items are `[x]`. Six ledger-fold contracts are built and proven; three non-foldable surfaces are honestly reclassified; `modeOwned.uncovered=0`; the one pre-existing suite failure is out of scope and named honestly; the authority store is byte-identical]
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

|| Role | Condition |
|------|-----------|
| Builder | Six contracts built and proven; three surfaces reclassified; coverage at zero |
| Verifier | Re-ran the coverage checker and its negative control, and the real consumers, independently |
<!-- /ANCHOR:sign-off -->
