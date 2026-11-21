# Iteration 006 - Frontier node F-1-003: security

## Dispatcher
- Lineage: opus (fan-out), session fanout-opus-1795201537192-sq1ivw, generation 1
- Frontier node: F-1-003 (depth 1), dimension security
- Sources read before work: lineage steer.md (absent), frontier block for F-1-003 security, convergence decision for iteration 5 (CONTINUE)

## Files Reviewed
- .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1000-1050 (fanoutRunnerPidOf, stopLiveFanoutRun), 3952-3962 (--status), 4795-4808 (spawned row)
- .skilled/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs:298-321 (isLineageAlive), 364-384 (detectLiveLineages)
- .gitignore change in 83800c3bfa2 (orchestration-status.log committed)

## Findings by Severity

### P0 Findings
None.

### P1 Findings
1. **`--stop` signals the process group of whatever process now holds a pid the ledger recorded, with no check that it is still a lineage** -- .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1030 -- A lineage's identity in the ledger is its bare pid (the `spawned` row at fanout-run.cjs:4801-4808 records label, attempt, pid and time only). `detectLiveLineages` treats an open lineage as live when `kill(-pid, 0)` or `kill(pid, 0)` answers (fanout-pool.cjs:373-375, 318-321), and `stopLiveFanoutRun` then sends SIGTERM to `-pid` (fanout-run.cjs:1029-1031). The runner pid is verified against its command line because, in the code's own words, a pid "written down earlier ... may since belong to an unrelated process" (fanout-run.cjs:997-1015). The lineage pid gets no such check. Lineages are left open whenever a run ends by signal or crash (iteration 2 finding OPUS-F003-P1-001). Since 83800c3bfa2 the ledger is also committed (`!specs/**/orchestration-status.log`), so its pids outlive reboots and travel to other checkouts. After pid reuse, `--stop` sends SIGTERM to an unrelated process group when the reused pid leads one, such as a shell or an app started from a terminal. When it does not lead one, the process is counted live, survives, and `--stop` exits 2 after 10 s. The same detection makes a new run refuse to start while that unrelated process lives.
   Finding class: cross-consumer
   Scope proof: detectLiveLineages is the only liveness source for --stop and the live-run refusal (fanout-pool.cjs:364); the spawned row is the only pid record (fanout-run.cjs:4801)
   Affected surface hints: fanout-run.cjs stopLiveFanoutRun and the spawned row; fanout-pool.cjs detectLiveLineages and isLineageAlive; .gitignore orchestration-status.log exception
   Case: a run is ended by a closed terminal, the machine reboots, pid 61009 from the ledger is now a terminal shell's group leader, and the operator's `fanout-run.cjs --stop` sends SIGTERM to that shell's process group.

```json
{"type":"claim-adjudication","findingId":"OPUS-F003-P1-002","claim":"--stop SIGTERMs the process group of a reused pid because lineage liveness is judged by pid alone","evidenceRefs":[".skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1030",".skilled/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs:373",".skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4805"],"counterevidenceSought":"Looked for a start-time, command-line or nonce check on the lineage pid (none; only the runner pid is checked), and for a closing row the signal path writes per lineage (none, per OPUS-F003-P1-001)","alternativeExplanation":"The operator is expected to run --stop only while the run is really live, when the pids are still the lineages","finalSeverity":"P1","confidence":0.7,"downgradeTrigger":"A per-lineage identity check such as process start time or command line before signalling, or the signal path closing every lineage row so no stale open row survives"}
```

### P2 Findings
None.

## Traceability Checks
- None run this iteration.

## Integration Evidence
- `--status` returns before spec-folder validation, config reads and every write: it reads `orchestration-status.log` under `--base-artifact-dir` and prints the table (fanout-run.cjs:3955-3961). It is read-only, which answers that part of F-1-003. It reads any path given, but it only reads.

## Edge Cases
- A pid owned by another user answers the probe with EPERM and counts as live (fanout-pool.cjs:309-310). The SIGTERM then fails silently and `--stop` reports a survivor. There is no harm, only a false partial.

## Confirmed-Clean Surfaces
- `fanoutRunnerPidOf` accepts a parent only when its command line contains this script's basename (fanout-run.cjs:1014).

## Ruled Out
- --status writing to the run directory: it returns before any write.

## Next Focus
- Dimension: security
- Focus area: F-1-005 security
- Reason: frontier round-robin
- Rotation status: F-1-003 correctness and security done
- Required evidence: file:line

Review verdict: CONDITIONAL
