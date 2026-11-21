# Iteration 017 - Recovery: traceability protocol replay (spec_code)

## Dispatcher
- Lineage: opus (fan-out), session fanout-opus-1795201537192-sq1ivw, generation 1
- Mode: STUCK_RECOVERY, strategy "Traceability protocol replay: re-run unresolved core checks"
- Trigger: convergence for iteration 16 returned STUCK_RECOVERY (stuckCount 7, stuckThreshold 2). Every frontier node in this lineage is answered. Once the graph upsert backfill was done, the graph decision moved to STOP_ALLOWED. dimensionCoverageGate still failed on `unfinishedCoreProtocols: ["spec_code"]`.
- Recovery event: `deep_review.recovery_started` recorded through the gateway (ledger sequence 18) before this iteration
- No frontier node is bound: every node is answered, so this record carries no frontierNodeId
- Sources read before work: lineage steer.md (absent)

## Files Reviewed
- specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/011-review-frontier-mode/spec.md:146, acceptance-criteria.md:62, tasks.md:86 (the only child hits for the range's vocabulary)
- specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/implementation-summary.md:78
- .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs reviewUnfinishedCoreProtocols (finished versus unfinished statuses)

## Findings by Severity

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
None.

## Traceability Checks
- spec_code: fail. The replay completes the search started in iteration 9. The packet root (spec.md, tasks.md, implementation-summary.md) and all 15 child folders hold no requirement for pass evidence, the claimed-stamp window, the runner-written lineage block, `--stop`, SIGHUP, parent death, `--status`, or the script-recorded blocked stop and its dry-run guard. The three child hits are REQ-006, AC-007 and T016 in 011-review-frontier-mode (spec.md:146, acceptance-criteria.md:62, tasks.md:86). They concern the Next Focus frontier assignment and mention blocked-stop text only as reducer input, so they govern none of this code. On the code side, the range's behavior lives in fanout-run.cjs:1025-1047 and 4406-4423, fanout-salvage.cjs:186-348 and convergence.cjs:1862-2200, with no spec to check them against. The result is the finished outcome "code with no governing requirement", not a partial check. It is the same gap as OPUS-F001-P2-004, which stays the finding of record. The catalog evidence is already counted under feature_catalog_code and is not reused here.

## Integration Evidence
- `reviewUnfinishedCoreProtocols` treats `''`, `pending`, `deferred`, `skipped`, `partial` and `blocked` as unfinished. `fail` is a finished status, so this honest result also closes the protocol for the stop gate. A pass was not claimed.

## Edge Cases
- Workflow gap recorded for synthesis: `step_graph_upsert` was not run after iterations 1-16. It was backfilled in iteration order before this iteration, using the workflow's command and `DEEP_LOOP_COVERAGE_DB_DIR` set to the lineage `graph-db/`. The `deep_review.graph_convergence_evaluated` events for iterations 1-16 were not appended and are not backfilled, because the gateway would stamp them now. From this iteration on, the event is appended after each convergence call.
- `deep_review.claim_adjudication` events were not appended after iterations 2 and 6. Both P1 findings carry typed packets. One passing event for the current active P0/P1 set is appended after this iteration.

## Confirmed-Clean Surfaces
- None new.

## Ruled Out
- Recording spec_code as pass on feature-catalog evidence: that would claim a packet requirement that does not exist.

## Next Focus
- Dimension: per convergence decision
- Focus area: if the stop is still not legal, run recovery passes inside this lineage's nodes only: line-level rereads of the two P1 sites and escalation checks on OPUS-F006-P2-002 and OPUS-F001-P2-003
- Reason: recovery
- Rotation status: frontier drained
- Required evidence: file:line

Review verdict: CONDITIONAL
