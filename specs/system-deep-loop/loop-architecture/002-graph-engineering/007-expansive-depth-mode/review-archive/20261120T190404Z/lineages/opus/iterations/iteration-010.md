# Iteration 010 - Frontier node F-1-002: maintainability

## Dispatcher

- Lineage: opus (fan-out), iteration 10 of 24, dimension maintainability, frontier node F-1-002 (depth 1 of 3)
- Stop check before dispatch: `convergence.cjs --stop-decision` returned STUCK_RECOVERY (`stuckThresholdReached`). Ratios of iterations 8 and 9 were 0 and 0.036, both at or under the review no-progress cutoff.
- Workflow action taken, per `step_handle_convergence.if_stuck_recovery.if_expansive_open_node` (`deep-review.yaml:1598-1620`): closed the active node F-1-004 as `exhausted` with reason `stuck` at iteration 10, re-ran the reducer, appended `deep_review.recovery_started` through the gateway (ledger sequence 12), and rebound the active node from the refreshed registry to F-1-002, next dimension maintainability.
- Sources read: config, registry, strategy; steer.md absent

## Dimension

Maintainability of the admission engine, with the overengineering lens of the operator focus; plus the stuck-recovery behavior this lineage just executed, because it decides whether a frontier node can ever be answered.

## Files Reviewed

- `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1340-1392` (loop counters), `:1151-1153` (stuck branch)
- `.skilled/commands/deep/assets/deep-review.yaml:1598-1620` (expansive stuck recovery), `:1287-1300` (stop order)
- `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:56-121,339-375,925-983` (constants, band budget, block rendering)
- `.skilled/commands/deep/review.md:100` (486-word `--depth-mode` cell), `.skilled/commands/deep/assets/deep-review.yaml:334-361,926-951` (two seed steps)
- This lineage's state log ratios for iterations 1-9

## Findings by Severity

### P0 Findings

None.

### P1 Findings

1. **Under expansive depth, stuck recovery counts only finding novelty, so two clean dimension passes close a node `exhausted` while it is one dimension from `answered`** -- .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1389 -- `loopCounters` raises `stuckCount` for every review iteration whose `newFindingsRatio` is at or below the no-progress cutoff and resets it only on an `insight` status or a recovery event (`:1359-1390`). It never looks at frontier progress. In an expansive review each iteration covers a new dimension on a node, which is exactly the depth the mode exists to buy, yet a clean pass on clean code has ratio 0. Once two such passes land, the stop decision returns STUCK_RECOVERY ahead of every other candidate (`:1151-1153`, stop order step 2 at `deep-review.yaml:1293`), and the expansive branch closes the active node `exhausted` with reason `stuck` (`deep-review.yaml:1612-1613`). This lineage hit it live: F-1-004 had correctness, security and traceability covered with findings on record and was closed exhausted before its maintainability pass. Because `frontier_drained` needs at least one `answered` node (`convergence.cjs:1169-1175`), a review of clean code can exhaust every node in turn and never form that candidate, so it runs to the cap. The recovery-event reset (`deep-review.yaml:1610` note) only spaces the closes two iterations apart; it does not stop them.
   - Finding class: cross-consumer
   - Scope proof: `stuckCount` is computed only in `loopCounters` (`convergence.cjs:1338-1392`); the expansive close is the only consumer that destroys frontier progress (`deep-review.yaml:1612`); research has the same counter shape on `newInfoRatio`.
   - Affected surface hints: convergence.cjs loopCounters (treat an iteration that covered a new frontier dimension as progress under expansive, or skip stuck accounting while the active node has uncovered dimensions); deep-review.yaml if_expansive_open_node; REQ-009 wording in the review-frontier child.
   - Case: an expansive review whose second and third dimension passes on a node find nothing new; iteration N+1 closes that node exhausted instead of reviewing its last dimension.

```json
{"type":"claim-adjudication","findingId":"OPUS-F004-P1-002","claim":"Expansive review stuck detection ignores frontier coverage progress, so consecutive clean dimension passes close a node exhausted one dimension before it would be answered, and a clean review can exhaust every node and never form frontier_drained.","evidenceRefs":[".skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1389",".skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1151",".skilled/commands/deep/assets/deep-review.yaml:1612",".skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1175"],"counterevidenceSought":"Read loopCounters for any frontier or coverage reset; read the expansive stuck branch note; checked whether recovery_started prevents the next close; observed the live sequence in this lineage (iterations 8-9 ratios 0 and 0.036, STUCK_RECOVERY at 10).","alternativeExplanation":"REQ-009 deliberately closes the active node on stuck, treating two low-yield passes as a spent branch; on that reading a clean node is meant to end exhausted rather than answered.","finalSeverity":"P1","confidence":0.65,"downgradeTrigger":"Downgrade to P2 if the design record states that a node with no new findings for two consecutive dimension passes should be exhausted rather than answered, and that frontier_drained is not expected to form on clean code."}
```

### P2 Findings

1. **The `--depth-mode` flag row is a 486-word table cell, and the seed step is written out twice in the review YAML** -- .skilled/commands/deep/review.md:100 -- The cell restates the admission order, the caps, the band split, the budget formula, the fan-out lineage defaults, the stop precedence and a timing note, all of which also live in loop-protocol (`deep-review/references/protocol/loop-protocol.md:464-474`), convergence.md (`:105`), the presentation (`:83`) and the YAML. Iterations 2, 3 and 9 found the same rule stale in nine of those copies. Separately, `step_frontier_seed` appears twice in `deep-review.yaml` (`:334-361` before fan-out and `:926-951` in `phase_init`) with the same 15-line decomposition instruction and command; only `description`, `skip_when` and a three-line fan-out note differ. Collapse: keep one sentence plus a link in the flag cell and move the mechanics to loop-protocol only; define the seed instruction once (a YAML anchor or one shared step body) and keep the two `skip_when` lines.
   - Finding class: algorithm
   - Scope proof: `wc -w` of `review.md:100` is 486; `diff` of the two seed blocks shows only description, skip and the fan-out note differ.
   - Affected surface hints: review.md flag table; research.md mirror row; deep-review.yaml and deep-research.yaml seed steps.
   - Case: the next change to the budget rule has to be made in every copy, and the copies already disagree after the last such change.

## Traceability Checks

No protocol run this iteration (maintainability pass).

## Integration Evidence

- Live evidence from this lineage's own run: ledger sequence 12 holds `deep_review.recovery_started`; the node store holds an F-1-004 row with status `exhausted`, reason `stuck`, iteration 10; the registry frontier now reports one exhausted node and active F-1-002.

## Edge Cases

- F-1-004 will not receive its maintainability visit as a node. Its overengineering angle is covered above under P2-1 so the node's surface is still reviewed for this dimension, but the node itself stays `exhausted`.
- `applyBandBudget` falls back to a cap of 10 (`frontier-admit.cjs:94,346`) when no budget is passed, the research default, while the review default is 7 (`:71`); both reducers always pass the config budget, so the fallback is unreached today.

## Confirmed-Clean Surfaces

- `frontier-admit.cjs` structure: one module, numbered sections, every exported symbol has a named caller (reducers, fan-out run and merge, tests). No unused option or flag found among the 12 `VALUE_FLAGS` (`:1065-1078`).
- The review and research prompt-block strings (`:976-980`) differ in substance (review names the target containment), so they are not a collapse candidate.

## Ruled Out

- Dead exports in frontier-admit: each export has a caller.
- `checkCycle` removal: spec-mandated sixth check (ruled out in iteration 1).

## Operator Focus Coverage

- Overengineering: P2-1 names what to collapse (flag cell to one sentence plus link; one seed step body).
- Operator UX: the stuck close (P1) is invisible to an operator except through a log line; a node silently changes from three covered dimensions to `exhausted`.
- Cross-CLI parity: the stuck counter is executor-independent; every executor and both loops share it.

## Next Focus

- Dimension: maintainability
- Focus area: F-1-006 maintainability (doc and playbook restatement, playbook dependencies), then the open depth-2 node F-2-007
- Reason: registry.frontier rotation after recovery
- Rotation status: F-1-002 covers its fourth dimension this iteration; F-1-004 exhausted by stuck recovery
- Required evidence: file:line

Review verdict: CONDITIONAL
