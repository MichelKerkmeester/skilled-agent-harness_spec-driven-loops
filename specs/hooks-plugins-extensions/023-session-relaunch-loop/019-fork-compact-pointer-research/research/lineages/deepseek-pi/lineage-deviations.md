# Lineage deviations and residual notes

Recorded so the parent run can see what this lineage deliberately did not do.

1. **Advisory lock not acquired.** `step_acquire_lock` was skipped. This lineage ran as a single dispatched worker against its own directory, so the single-writer protection the lock exists for had no second contender. No lock file was created, and none was released.

2. **Spec write-back steps not run.** `step_preinit_spec_branch`, `step_validate_preinit_spec_doc`, `step_writeback_spec_findings` and `step_validate_post_synthesis_spec_doc` all write into `{spec_folder}/spec.md`, outside this lineage's write authority. They were left unrun; the packet's `spec.md` synthesis and its strict validation remain the parent run's step.

3. **Synthesis event scope names the lineage directory.** `synthesis-closeout.cjs` derives `scope.runId` from `basename(dirname(stateLog))`, so the committed synthesis record carries `runId: "deepseek-pi"` rather than the run's session id. The record's `stopReason` is `maxIterationsReached` and `totalIterations` is 10, which is what the terminal contract checks. A lineage-scoped `--run-id` flag on the closeout would remove the discrepancy.

4. **Convergence was telemetry only.** `stopPolicy: max-iterations` with `maxIterations: 10`; the ratio fell to 0.2 by iteration 10 and the loop still ran the full cap, broadening from the hook gate to the family-wide session-keyed state hazard instead of synthesizing early.

5. **One value stayed UNKNOWN.** A fork's `transcript_path` is recorded nowhere on this machine. The recommended fix is neutral to it, and the report says so rather than guessing.
