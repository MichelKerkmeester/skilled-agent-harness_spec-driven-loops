# Iteration 013 - Recovery: severity re-examination (maintainability)

## Dispatcher

- Lineage: opus (fan-out), iteration 13 of 24
- Stop check before dispatch: STUCK_RECOVERY again (`stuckThresholdReached`). Iteration 11 had ratio 0 and iteration 12 had ratio 0.05, one new P2 against an accumulated weighted total of 20.
- Workflow action taken (`deep-review.yaml:1598-1620`): closed the active node F-2-007 `exhausted`, reason `stuck`, at iteration 13 after one of its four dimensions; re-ran the reducer; appended `deep_review.recovery_started` (ledger sequence 17). The refreshed registry holds no open or active node (2 answered, 2 exhausted), so `if_no_open_node` falls through to global recovery: strategy "escalate severity review: re-examine P2 findings for potential P1 upgrades", least-covered dimension maintainability (two passes, against three or four for the others).
- No frontier node is active, so this record carries no `frontierNodeId`.
- Sources read: config, registry, strategy; steer.md absent

## Dimension

Maintainability, as the recovery's least-covered dimension, applied as a severity re-examination of the open P2 findings and of the stuck rule that has now closed two of this lineage's four nodes.

## Files Reviewed

- `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:748-759` (review thresholds), `:1381-1390` (low-ratio test)
- `.skilled/skills/system-deep-loop/deep-review/references/convergence/convergence.md:222-230` (stuck pseudo-code)
- This lineage's state log, iterations 11 and 12
- Re-read of the evidence lines behind OPUS-F002-P2-003, OPUS-F006-P2-002 and OPUS-F007-P2-001

## Findings by Severity

### P0 Findings

None.

### P1 Findings

1. **The review novelty ratio divides by the accumulated weighted total, so late in an expansive run even an iteration that finds a new issue reads as no progress** -- .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1389 -- Refines OPUS-F004-P1-002 with a second live occurrence and its mechanism. `noProgressCutoff` is half the convergence threshold, 0.05 at the default 0.1 (`:757`), and the low test is inclusive (`ratio <= reviewThreshold`, `:1388`). The ratio is new weighted findings over the accumulated weighted total, so once the run holds a total of 20 (here two P1 and ten P2), one new P2 scores exactly 0.05 and counts as stuck. Iteration 12 found a real defect on F-2-007 and still counted; together with a clean iteration 11 that triggered STUCK_RECOVERY, and the workflow closed F-2-007 `exhausted` after one of four dimensions. Under expansive depth the frontier is supposed to fund each node's remaining dimensions, but the counter makes every node after roughly the tenth finding a two-iteration node.
   - Finding class: cross-consumer
   - Scope proof: as for OPUS-F004-P1-002; the threshold mapping is only `mapReviewThresholds` (`convergence.cjs:748-759`).
   - Affected surface hints: convergence.cjs loopCounters and mapReviewThresholds; deep-review.yaml if_expansive_open_node.
   - Case: an expansive review with 20 weighted findings on record; a node's second pass finds one P2, its third finds none, and the node is closed exhausted.

```json
{"type":"claim-adjudication","findingId":"OPUS-REC-P1-003","refines":"OPUS-F004-P1-002","claim":"Because the review novelty ratio is relative to the accumulated total and the no-progress test is inclusive at 0.05, a productive iteration late in an expansive run counts toward stuck, and stuck recovery then exhausts frontier nodes before their remaining dimensions are reviewed.","evidenceRefs":[".skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:757",".skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1388",".skilled/commands/deep/assets/deep-review.yaml:1612"],"counterevidenceSought":"Checked whether a frontier dimension advance or a new finding resets the counter (it does not; only insight status and recovery events do); compared the doc pseudo-code, which uses a strict comparison.","alternativeExplanation":"The ratio is meant to fall as a review converges, and closing nodes on low novelty may be the intended way to stop spending on a saturated target.","finalSeverity":"P1","confidence":0.65,"downgradeTrigger":"Downgrade to P2 if the design record states that expansive nodes are expected to close on global novelty rather than on per-node dimension coverage."}
```

### P2 Findings

1. **The stuck pseudo-code in the review convergence reference uses a strict comparison while the code is inclusive, and the boundary decided a node close in this run** -- .skilled/skills/system-deep-loop/deep-review/references/convergence/convergence.md:227 -- The reference counts an iteration as stuck when `newFindingsRatio < noProgressThreshold`; `loopCounters` uses `ratio <= reviewThreshold` (`convergence.cjs:1388`). Iteration 12's ratio was exactly 0.05, so under the documented rule it would not have counted and F-2-007 would have kept its node. Both lines predate this range (the base already had `<=`), but the expansive mode added in this range is what turns the boundary into a node close.
   - Finding class: instance-only
   - Scope proof: one pseudo-code block (`convergence.md:222-230`) and one code test (`convergence.cjs:1386-1389`).
   - Affected surface hints: convergence.md stuck pseudo-code or convergence.cjs low test, whichever is the intended rule.
   - Case: an iteration whose ratio lands exactly on 0.05.

## Traceability Checks

No protocol run this iteration (recovery pass).

## Integration Evidence

- Ledger: `deep_review.recovery_started` at sequences 12 and 17; node store rows `F-1-004 exhausted stuck @10` and `F-2-007 exhausted stuck @13`.

## Edge Cases

- Severity re-examination outcomes for the open P2 set: OPUS-F002-P2-003 (scope text reaches later FRONTIER blocks) stays P2, because it needs a leaf that already copied hostile text and the block text is bounded to 500 characters per scope entry with control characters stripped. OPUS-F006-P2-002 (playbooks wait for a non-existent pause) stays P2: a manual scenario, no runtime effect. OPUS-F007-P2-001 (open-ended ranges) stays P2: input outside the catalog's stated `base..tip` contract.
- With the frontier closed and two nodes answered, the next stop check can form `frontier_drained`; the legal-stop gates still decide it.

## Confirmed-Clean Surfaces

- `mapReviewThresholds` derives all three review cutoffs from one threshold (`convergence.cjs:748-759`); no second copy of the constants.

## Ruled Out

- Upgrading the three re-examined P2 findings: each lacks either reach inside the stated contract or runtime impact.

## Operator Focus Coverage

- Overengineering: none new.
- Operator UX: two nodes closed by the counter in thirteen iterations, each announced only by a log line; the dashboard shows `exhausted` with reason `stuck` and no hint that the node had uncovered dimensions left.
- Cross-CLI parity: shared counter; every executor sees the same closes.

## Next Focus

- Dimension: correctness
- Focus area: stop check; if `frontier_drained` is blocked, address the blocking gate; otherwise synthesis
- Reason: frontier holds no open node
- Rotation status: all four dimensions covered at run level; frontier closed
- Required evidence: gate output from convergence.cjs

Review verdict: CONDITIONAL
