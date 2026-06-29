## Dimension

Correctness - logic correctness: benchmark/promote/rollback/reduce, accepted-vs-shipped.

## Files Reviewed

- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-workflows/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:1-855`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/promote-candidate.cjs:1-703`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/reduce-state.cjs:1-1445`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/rollback-candidate.cjs:1-172`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs:1-374`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs:1-398`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs:1-427`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/loop-host.cjs:108-220`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-workflows/deep-improvement/scripts/lib/mirror-sync-verify.cjs:1-239`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs:1-451`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/deep/assets/deep_model-benchmark_auto.yaml:162-195`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/deep/assets/deep_model-benchmark_confirm.yaml:184-214`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/deep/assets/deep_agent-improvement_confirm.yaml:228-248`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-workflows/mode-registry.json:34-95`

## Findings by Severity

### P0

None.

### P1

1. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/deep/assets/deep_model-benchmark_auto.yaml:165` - Normal non-reviewer model-benchmark runs do not pass `--state-log` to `loop-host`, while the outputs dir is `.opencode/skills/sk-prompt-models/benchmarks/{run_label}`. `run-benchmark.cjs` only appends a `benchmark_run` row when `--state-log` is present or when `inferStateLogPath()` finds an ancestor named `improvement` (`run-benchmark.cjs:114`, `run-benchmark.cjs:587`, `run-benchmark.cjs:782`). That inference cannot work for the configured outputs dir, so the report can be written while `{spec_folder}/improvement/agent-improvement-state.jsonl` never receives the benchmark row that `reduce-state.cjs` later reads at `reduce-state.cjs:1381`.
   Suggested fix direction: pass `--state-log {spec_folder}/improvement/agent-improvement-state.jsonl` through both model-benchmark YAML commands, or make `loop-host` derive it from the spec folder and fail closed when no ledger path is available.

2. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/promote-candidate.cjs:92` - The accepted-vs-shipped flow is implemented but not used by the normal promotion commands. `normalizePhase()` defaults a missing phase to `promote`, and the legacy branch still copies `candidate` over `target` directly (`promote-candidate.cjs:643`). The confirm/model-benchmark workflow commands omit `--phase` (`deep_agent-improvement_confirm.yaml:248`, `deep_model-benchmark_auto.yaml:195`, `deep_model-benchmark_confirm.yaml:214`), so selecting "promote accepted candidate/variant" bypasses the acceptance file and ship-time drift checks.
   Suggested fix direction: split workflow promotion into explicit `--phase=accept --acceptance-file=...` and `--phase=ship --acceptance-file=...` steps, or require an explicit phase so the legacy immediate mutation path cannot be reached accidentally.

3. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/promote-candidate.cjs:541` - Agent-definition promotion checks mirror sync before applying the accepted candidate. For a target such as `.opencode/agents/name.md`, `verifyMirrorSync()` includes that target and the sibling runtime mirrors in its comparison set (`mirror-sync-verify.cjs:17`), but promotion does not copy the accepted snapshot to the target until later (`promote-candidate.cjs:633`; legacy copy at `promote-candidate.cjs:645`). A legitimate candidate that differs from the current target is therefore rejected as mirror drift before it can be shipped.
   Suggested fix direction: separate preflight mirror health from post-mutation mirror verification. Either stage all runtime mirrors before running the all-in-sync gate, or verify current mirrors against the current target before copy and verify candidate mirrors after copy.

4. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/rollback-candidate.cjs:120` - Rollback trusts the accepted-state backup path without validating the accepted-state status or the stored backup hash. `promote-candidate.cjs` records `status: "accepted"` and `preAcceptTargetHash` when it creates the acceptance state (`promote-candidate.cjs:182`, `promote-candidate.cjs:189`), but rollback only checks that the backup file exists before copying it over the canonical target (`rollback-candidate.cjs:153`, `rollback-candidate.cjs:158`). A modified or stale backup file can silently corrupt the canonical target during recovery.
   Suggested fix direction: require `acceptedState.status === "accepted"` when an acceptance file is provided, hash `backup` against `acceptedState.preAcceptTargetHash` before copying, and fail closed on mismatch.

### P2

1. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs:207` - The hub packet-name drift check reads `mode.packetSkillName`, but the live registry schema stores the value under `advisorRouting.packetSkillName` (`mode-registry.json:42`, `mode-registry.json:58`). The regression fixture uses a top-level `packetSkillName` (`skill-benchmark.vitest.ts:154`), so the test does not exercise the shipped schema and a live packet-name mismatch would be missed.
   Suggested fix direction: read `mode.packetSkillName ?? mode.advisorRouting?.packetSkillName` and add a fixture with the nested live registry shape.

## Verdict

CONDITIONAL

## Notes

No P0 issue found in this slice. The active P1s are real workflow/guard bugs: one loses benchmark state in the reducer path, two prevent or bypass the intended accepted-vs-shipped semantics, and one makes rollback trust mutable recovery evidence despite having a recorded hash.
