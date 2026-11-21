# Iteration 010 - Frontier node F-1-003: traceability

## Dispatcher
- Lineage: opus (fan-out), session fanout-opus-1795201537192-sq1ivw, generation 1
- Frontier node: F-1-003 (depth 1), dimension traceability
- Sources read before work: lineage steer.md (absent), frontier block for F-1-003 traceability, convergence decision for iteration 9 (CONTINUE)

## Files Reviewed
- .skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md:78-90, 123-151 (progress rows, Status and Stop, SIGHUP)
- .skilled/skills/system-deep-loop/runtime/manual-testing-playbook/fanout/fanout-run-cli-lineage-spawn.md:3, 17-25, 58-80
- .skilled/commands/deep/review.md and research.md (searched for `--stop` and `--status`)
- Code side from iterations 2 and 6: fanout-run.cjs:1025-1047, 3955-3961, 4406-4423; fanout-pool.cjs:337-343

## Findings by Severity

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
None.

## Traceability Checks
- feature_catalog_code: pass for Status and Stop. The `--status` text, "needs only `--base-artifact-dir`, ... exits 0 before any config, lineage or ledger write", matches fanout-run.cjs:3955-3961. The `--stop` text matches stopLiveFanoutRun in five points: the runner goes first through the parent link, then the groups, a 10 s confirm, labelled `stopped` rows with `rerun_command`, and exit 0/2 (fanout-run.cjs:1025-1050). The SIGHUP and parent-death text promises only that lineages stop and the exit code (fanout-run.md:146-151), which the code does.
- playbook_capability: partial. The playbook drives `--status` and `--stop` by hand and through fanout-status/fanout-stop tests (fanout-run-cli-lineage-spawn.md:58-59). No scenario reruns a run after a SIGHUP or parent-death stop and checks the retry count or orphan rows. That is the check that would expose OPUS-F003-P1-001.
- skill_agent and agent_cross_runtime: not run; this node has no agent surface.

## Integration Evidence
- The catalog sentence "The pool reads a `stopped` row as a closed lineage, so its rerun is not requeued as an orphan or charged a retry" (fanout-run.md, Status and Stop) is accurate for the labelled rows `--stop` writes. It does not hold for the label-less row the signal path writes (fanout-run.cjs:4418). Placed beside the SIGHUP paragraph, a reader can take it to cover both. This is the documentation side of OPUS-F003-P1-001 and is carried there, not raised again.
- The operator command docs (review.md, research.md) do not mention `--status` or `--stop`. They are script-level controls, documented in the runtime catalog, scripts/README.md:49 and the playbook, which is the documented home for script flags.

## Edge Cases
- Playbook failure line 80 confirms the documented requirement that `--stop` is passed with the run's own arguments, which matches the rerun-command design.

## Confirmed-Clean Surfaces
- Playbook failure lines 78-79 name the two regressions an operator would see: `--status` writing, and `--stop` survivors from a stale pid.

## Ruled Out
- Catalog drift on `--status` or `--stop` behavior: matches code.

## Next Focus
- Dimension: traceability
- Focus area: F-1-005 traceability (references and compiled contracts for the blocked stop and dry run)
- Reason: frontier round-robin
- Rotation status: F-1-003 has correctness, security and traceability
- Required evidence: file:line

Review verdict: PASS
