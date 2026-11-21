# Iteration 003 - Frontier node F-1-005: correctness

## Dispatcher
- Lineage: opus (fan-out), session fanout-opus-1795201537192-sq1ivw, generation 1
- Frontier node: F-1-005 (depth 1), dimension correctness
- Sources read before work: lineage steer.md (absent), frontier block for F-1-005, convergence decision for iteration 2 (CONTINUE)

## Files Reviewed
- .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:57-80, 869-875, 994-1000, 1862-2200 (range diff), 2199-2221, 2361, 2440-2452
- .skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-review-state-contract.ts:49, 216-230
- .skilled/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/deep-review-ledger-schema.ts:777, 866, 975-981, isGateResults
- .skilled/commands/deep/assets/deep-review.yaml:96-105, 1149-1165, 1282-1288
- .skilled/commands/deep/assets/deep-research.yaml:278-288, 1100-1101, 1179-1187

## Findings by Severity

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
1. **The blocked-stop event reports every active finding as adjudicated, including when the claim-adjudication gate is the blocker** -- .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:2031 -- `buildReviewBlockedStopEvent` sets `activeFindingCounts.adjudicated` to `p0 + p1 + p2`, the same value as `candidates`, whatever the gates say. When `blockedGateIds` holds `claimAdjudicationGate`, the same ledger event therefore states that every candidate is adjudicated and that the stop is blocked because some are not. It also counts P2 findings, which need no adjudication. The schema accepts this because it checks only the field set (deep-review-ledger-schema.ts:777), so a reader of the ledger gets a self-contradicting count.
   Finding class: instance-only
   Scope proof: buildReviewBlockedStopEvent is the only producer of deep_review.blocked_stop_recorded from the script (convergence.cjs:2023-2045)
   Affected surface hints: convergence.cjs buildReviewBlockedStopEvent activeFindingCounts; deep-review-ledger-schema.ts finding-counts rule
   Case: one active P1 with no claim-adjudication packet blocks the stop on claimAdjudicationGate, and the recorded event says candidates 1, adjudicated 1.

## Traceability Checks
- Workflow binding matches the script: both YAMLs bind `--read-only` on a dry run and `--record-blocked-stop` on a live run (deep-review.yaml:96-105, deep-research.yaml:278-288), and the script refuses the two together (convergence.cjs:2205).

## Integration Evidence
- `--read-only` suppresses snapshot persistence (convergence.cjs:2361), so the research workflow's unconditional `--persist-snapshot` (deep-research.yaml:1100) is inert on a dry run. It also suppresses the observability append on both graph paths (:2278, :2438). The graph-failure path records only when `--record-blocked-stop` was passed (:2446), so a dry run writes nothing there either.
- The review projection maps `deep_review.blocked_stop_recorded` to a `blocked_stop` row with `run = num(scope.iterationId)` and `blockedBy = blockedGateIds` (deep-review-state-contract.ts:216-224). Those are exactly the fields `recordBlockedStop`'s repeat check reads, so a recomputed decision with the same blockers records nothing again.
- Skipped gates (`candidateCoverageGate`, `graphlessFallbackGate` when v1) are reported as `status:'unknown'`, `reasonCode:'gate-skipped'` (convergence.cjs blocked-stop gate rows), and the ledger accepts `unknown` (isGateResults).

## Edge Cases
- On a dry run that computes BLOCKED, `step_emit_blocked_stop` still logs "Blocked STOP recorded" (deep-review.yaml:1286, deep-research.yaml:1183) although `--read-only` recorded nothing. The log text overstates the result, but the step writes nothing, so this is not raised.
- A gate that both passed and is `skipped:true` reports `unknown` rather than `pass`, which is the intended meaning.

## Confirmed-Clean Surfaces
- Ledger stem semantic check requires at least one `fail` row and a non-zero appendPosition (deep-review-ledger-schema.ts:975-980). A graph-only block passes every gate, so the script adds a failing row per graph blocker. That makes it valid.

## Ruled Out
- A dry run persisting the research snapshot through `--persist-snapshot`: overridden by readOnly at convergence.cjs:2361.

## Next Focus
- Dimension: security, next uncovered dimension per reducer
- Focus area: reducer-picked node (F-2-006 correctness or F-1-001 security)
- Reason: frontier round-robin
- Rotation status: all three seed nodes have correctness
- Required evidence: file:line

Review verdict: PASS
