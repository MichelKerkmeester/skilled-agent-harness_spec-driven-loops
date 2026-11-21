# Iteration 002 - Frontier node F-1-003: correctness

## Dispatcher
- Lineage: opus (fan-out), session fanout-opus-1795201537192-sq1ivw, generation 1
- Frontier node: F-1-003 (depth 1), dimension correctness, picked by the reducer's next focus
- Sources read before work: lineage steer.md (absent), frontier block for F-1-003

## Files Reviewed
- .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:68-110, 474-520, 1000-1055, 1450-1460, 4406-4440 (signal forwarding, parent watch, --stop, writeStoppedSummary)
- .skilled/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs:265-282, 298-345, 364-421 (retry counts, liveness, open/orphan detection)
- .skilled/skills/system-deep-loop/runtime/tests/unit/fanout-stop.vitest.ts:143-200
- .skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md:135-142

## Findings by Severity

### P0 Findings
None.

### P1 Findings
1. **A SIGHUP, SIGTERM or parent-death stop leaves every lineage open in the ledger, so the next run requeues each one as an orphan and charges it a retry** -- .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4418 -- The runner's own stop path, `writeStoppedSummary`, kills the lineage groups and appends one run-level row `{event:'stopped', signal, at, gauges}` with no `label` and no `rerun_command` (fanout-run.cjs:4406-4423), then exits synchronously, so no per-lineage terminal row is ever written. `collectOpenLineages` skips every row without a string label (fanout-pool.cjs:328-331) and closes a lineage only on its own labelled `stopped` row (:337-343). After a hangup, a closed terminal or a SIGKILL of the bootstrap, every started lineage therefore stays open. The next run's `markOrphanedLineages` (fanout-run.cjs:4288, fanout-pool.cjs:404-419) appends `orphan_requeued` for each one, and `readRetryCountsFromLedger` counts that row as a spent attempt (fanout-pool.cjs:271-279). The pool comment added in this same commit says this is the charge a stopped lineage must not pay (fanout-pool.cjs:340-342). Only `--stop` writes the per-lineage `stopped` row with a rerun command (fanout-run.cjs:1037-1047). The tests check only the run-level row for SIGHUP and parent death (fanout-stop.vitest.ts:157, :171).
   Finding class: cross-consumer
   Scope proof: writeStoppedSummary is the only handler for FORWARDED_SIGNALS and the parent watch (fanout-run.cjs:505-520, 4440); collectOpenLineages feeds both detectLiveLineages and detectOrphanedLineages (fanout-pool.cjs:366, 388)
   Affected surface hints: fanout-run.cjs writeStoppedSummary; fanout-pool.cjs collectOpenLineages and readRetryCountsFromLedger; fanout-stop.vitest.ts SIGHUP and parent-death cases
   Case: an operator's SSH session drops mid-run with maxRetries 1, and the rerun requeues both lineages as orphans with their only retry already spent and no rerun command on record.

```json
{"type":"claim-adjudication","findingId":"OPUS-F003-P1-001","claim":"The in-runner stop path writes no per-lineage terminal row, so a rerun charges each stopped lineage a retry as an orphan and records no rerun command","evidenceRefs":[".skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4418",".skilled/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs:328",".skilled/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs:337",".skilled/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs:276"],"counterevidenceSought":"Checked whether detectOrphanedLineages or collectOpenLineages treat a label-less stopped row as closing all lineages (they skip it), whether the pool writes failed rows before exit (process.exit in the signal handler leaves no event-loop turn), and whether the orchestration summary is read back for retry counts (it is not)","alternativeExplanation":"The run-level row plus the summary's stopped:true may be meant as the stopped outcome, with the orphan charge accepted for signal stops; the pool comment and the --stop per-lineage rows contradict that reading","finalSeverity":"P1","confidence":0.8,"downgradeTrigger":"Evidence that a rerun reads orchestration-summary.json stopped:true to reset retry counts, or that maxRetries is unbounded by default"}
```

### P2 Findings
None.

## Traceability Checks
- feature catalog fanout-run.md:135-142 says to pass `--stop` with the run's own arguments, which matches how the rerun command is built from the stop process's argv (fanout-run.cjs:1037). Consistent; recorded as context, not as a protocol result.

## Integration Evidence
- fanout-pool.cjs `isLineageAlive` probes the group first, then the pid (:318-321), so `--stop` waits for the whole group, not only the leader.
- `--stop` signals the runner before the lineage groups (fanout-run.cjs:1028-1031), so the runner cannot retry a lineage killed under it; the test confirms exit 143 (fanout-stop.vitest.ts:189).

## Edge Cases
- `--stop` builds the rerun command from its own argv, so a stop invoked with fewer arguments than the run yields an incomplete rerun command. The catalog documents the requirement, so this is not raised.
- `fanoutRunnerPidOf` matches the parent's command line on the script basename (fanout-run.cjs:1008-1015). A non-fanout parent whose command includes `fanout-run.cjs`, such as an editor, would be sent SIGTERM. That needs a live lineage whose parent is that process, so it is not raised.

## Confirmed-Clean Surfaces
- Exit code mapping: SIGHUP 129, SIGINT 130, otherwise 143 (fanout-run.cjs:476-480), used by both the bootstrap and the child.
- Parent watch reads ppid at module load and polls once a second with an unref'd timer (fanout-run.cjs:74, 492-499).

## Ruled Out
- A pool `failed` row closing the lineages after a signal: process.exit runs inside the handler, before any child close event is processed.

## Next Focus
- Dimension: per reducer next focus (F-1-005 correctness expected)
- Focus area: convergence.cjs blocked-stop recording and the dry-run read-only binding in both workflows
- Reason: round-robin across the lineage's frontier nodes
- Rotation status: F-1-001 correctness, F-1-003 correctness done
- Required evidence: file:line for the --read-only and --record-blocked-stop paths

Review verdict: CONDITIONAL
