# Iteration 011 - Frontier node F-1-005: traceability

## Dispatcher
- Lineage: opus (fan-out), session fanout-opus-1795201537192-sq1ivw, generation 1
- Frontier node: F-1-005 (depth 1), dimension traceability
- Sources read before work: lineage steer.md (absent), frontier block for F-1-005 traceability, convergence decision for iteration 10 (CONTINUE, stuckCount 1)

## Files Reviewed
- .skilled/skills/system-deep-loop/deep-review/references/convergence/convergence.md:140-175, 456
- .skilled/skills/system-deep-loop/deep-review/references/state/state-jsonl.md:198
- .skilled/skills/system-deep-loop/deep-research/references/state/state-jsonl.md:263
- .skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md:232
- .skilled/skills/system-deep-loop/runtime/references/script-interface-contract.md:63-66, 94-100
- .skilled/skills/system-deep-loop/runtime/feature-catalog/script-entry-points/convergence-script.md:61, 81-82
- Code side: deep-review-state-contract.ts:216-230 (blocked_stop projection), convergence.cjs blocked-stop gate rows and buildReviewBlockedStopEvent

## Findings by Severity

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
1. **The documented review `blocked_stop` row is not the row the projection emits, and the skipped-gate `unknown` never reaches the state log** -- .skilled/skills/system-deep-loop/deep-review/references/convergence/convergence.md:142 -- The reference shows the row `convergence.cjs` records with `mode`, `sessionId` and `generation`, and says the reducer reads `gateResults` verbatim (convergence.md:142-171). The projection that builds the row from `deep_review.blocked_stop_recorded` emits `type`, `event`, `iteration`, `run`, `blockedBy`, `stopReason`, `gateResults`, `graphBlockerDetail`, `recoveryStrategy` and `timestamp`, with no `mode`, `sessionId` or `generation` (deep-review-state-contract.ts:217-229). Its `gateResults` is the event's `gateDetail`, the raw gate objects (:226). In those objects a skipped gate is still `{pass: true, skipped: true}` (convergence.cjs:998-999). The change "record a skipped gate as unknown" reaches only the ledger's `gateResults` rows, where the skipped gate carries `status: 'unknown'`. The state row the reducer and the reference describe still reads it as a pass, and the reference repeats "pass trivially" for the two v2 gates (convergence.md:174).
   Finding class: cross-consumer
   Scope proof: deep-review-state-contract.ts:216 is the only projection of deep_review.blocked_stop_recorded; convergence.md:142 is the canonical row reference
   Affected surface hints: deep-review/references/convergence/convergence.md blocked_stop row; deep-review-state-contract.ts blocked_stop projection; convergence.cjs gateDetail vs gateResults
   Case: a v1 review blocks on dimensionCoverageGate, and its ledger event reports candidateCoverageGate as unknown while the state row the reducer reads shows candidateCoverageGate pass:true and carries no sessionId.

## Traceability Checks
- spec_code: partial (carried from iteration 9). The packet has no requirement for the script-recorded blocked stop.
- feature_catalog_code: pass for convergence-script.md:61. It says the flag needs `--stop-decision` and a positive `--iteration` and is refused with `--read-only`, which matches convergence.cjs:2201-2210.
- Dry-run wording is consistent across all five references: "live run only; a dry run passes `--read-only` instead, so it appends no blocked-stop row, persists no snapshot and writes no observability event". The code backs it at convergence.cjs:2361, 2278 and 2438.

## Integration Evidence
- script-interface-contract.md:66 says `--read-only` disables `--persist-snapshot`, which matches convergence.cjs:2361.

## Edge Cases
- The review YAML note says the script records "once per iteration and blocker set" (deep-review.yaml step_graph_convergence note). The research YAML says "once per run". Research rows key `run` on the iteration, so the two say the same thing in different words.

## Confirmed-Clean Surfaces
- convergence-script.md:81-82 test table matches the two integration suites the range adds.

## Ruled Out
- Dry-run wording drift between references: consistent.

## Next Focus
- Dimension: traceability
- Focus area: F-2-006 traceability
- Reason: last node without traceability
- Rotation status: F-1-005 has correctness, security and traceability
- Required evidence: file:line

Review verdict: PASS
