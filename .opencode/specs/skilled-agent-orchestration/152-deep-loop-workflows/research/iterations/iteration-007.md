# Deep-Research Iteration 007: Lane A/B modes and loop-host unification

> Engine: openai/gpt-5.5 --variant xhigh (read-only seat) · orchestrator-written.

Low-blast, read-only research iteration. I’ll first load the established context and routing signals, then inspect the concrete deep-improvement and runtime files before making a recommendation.
The memory/advisor MCP calls both failed due transport errors (`Not connected` and `Connection closed`). I’m using the local skill-advisor fallback and then direct file reads only.
SKILL ROUTING: local advisor returned multiple deep-loop skills above threshold; I’m treating `deep-improvement` as the controlling domain skill for this angle and staying read-only per the user’s explicit constraint.
The controlling skill confirms deep-improvement is already lane-structured and that Lane B’s benchmark hub is the foreign `sk-prompt-small-model` tree. I’m now reading the established context report and the requested runtime scripts with line-level evidence.
The requested files show the key tension: `loop-host.cjs` already provides a lane-local `--mode` router, while the other loop workflows route through runtime CLI scripts using `--loop-type`. I’m checking the command YAMLs and runtime dispatcher now to decide whether to merge, wrap, or preserve both layers.
The command layer confirms Lane B’s hub path is command-owned, not hardcoded into `sweep-benchmark.cjs`; the scripts are path-agnostic and accept `--outputs-dir`. I’m reading the benchmark runner/reducer and the exact YAML snippets to keep the recommendation implementable.
The runtime `convergence.cjs` accepts only `research|review|council|context`, while improvement’s reducer and command YAML carry their own plateau/benchmark-stop logic. I’m checking the mutating agent surface and metadata so the mode recommendation does not accidentally open promotion to read-only modes.
There is a material contradiction to call out: current Lane B YAML and SKILL text still include an optional `promote-candidate.cjs` path, while the target constraint says Lane A is the only mutating loop. I’m checking the regression tests so the recommendation distinguishes default parity from this optional branch.
**Recommendation**
Yes: make Lane A `agent-improvement` and Lane B `model-benchmark` first-class modes of `deep-loop-workflows`, but do not turn them into `deep-loop-runtime --loop-type` values yet. Use a two-tier routing contract:

`workflowMode` is the merged skill’s public mode key. `runtimeLoopType` exists only for graph-backed modes: `context`, `research`, `review`, `council`. Improvement-derived modes keep the existing local host: `loop-host.cjs --mode=agent-improvement|model-benchmark|skill-benchmark|non-dev-ai-system-refine`.

That is the lowest-risk path that preserves byte-identical default artifacts. It avoids forcing improvement’s plateau, journal, reducer, promotion, and foreign benchmark-output behavior into the graph-backed runtime convergence model.

**Evidence**
The baseline report already identifies the relevant split: `deep-loop-runtime` owns backend primitives and scripts, while `deep-improvement` is the outlier with its own `loop-host.cjs`, reducer, promotion, and four lanes (`.opencode/specs/skilled-agent-orchestration/152-deep-loop-workflows/context/context-report.md:26-29`). It also flags this exact problem as high risk: improvement is really four modes, has no `loopType`, and Lane B writes to the foreign benchmark hub (`context-report.md:145-149`).

`deep-loop-runtime/scripts/convergence.cjs` only accepts `research`, `review`, `council`, and `context` as `--loop-type` values (`.opencode/skills/deep-loop-runtime/scripts/convergence.cjs:305-312`). Its non-council path computes coverage-graph signals and graph blockers (`convergence.cjs:337-390`). That does not match improvement’s non-graph plateau and benchmark-stop reducer logic.

`deep-improvement/scripts/shared/loop-host.cjs` already provides the correct local mode seam. It defaults missing or unknown mode to `agent-improvement`, with an explicit byte-compatibility contract for the default path (`.opencode/skills/deep-improvement/scripts/shared/loop-host.cjs:13-15`, `169-174`). It has closed local modes for `agent-improvement`, `model-benchmark`, `skill-benchmark`, and `non-dev-ai-system-refine` (`loop-host.cjs:45`). Lane B plans materialize-before-run-benchmark (`loop-host.cjs:191-219`), while Lane A stays a single `score-candidate.cjs` step (`loop-host.cjs:251-258`).

The tests make that contract load-bearing. `loop-host.vitest.ts` asserts default and explicit `agent-improvement` plans are identical (`.opencode/skills/deep-improvement/scripts/shared/tests/loop-host.vitest.ts:69-88`), and Lane B must plan `materialize-benchmark-fixtures.cjs` before `run-benchmark.cjs` (`loop-host.vitest.ts:109-123`).

Lane B’s foreign-tree write contract is command-owned, not hardcoded in `sweep-benchmark.cjs`. The model-benchmark YAML binds `benchmark_root` to `.opencode/skills/sk-prompt-small-model/benchmarks/{run_label}` and passes that path as `--outputs-dir` to `loop-host.cjs --mode=model-benchmark` (`.opencode/commands/deep/assets/deep_start-model-benchmark-loop_auto.yaml:102-111`, `162-168`). The changelog confirms the hub path is command routing and the `.cjs` scripts are intentionally path-agnostic (`.opencode/skills/deep-improvement/changelog/v1.13.0.0.md:10-24`). `sweep-benchmark.cjs` itself resolves an output dir from `opts.outDir` or profile config, then writes `results.json`, `aggregate.json`, and `synthesis.md` there (`.opencode/skills/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:369-376`, `516-539`).

The reducer already treats Lane A and Lane B as separate mode records. It initializes mode counters for `agent-improvement` and `model-benchmark` (`.opencode/skills/deep-improvement/scripts/shared/reduce-state.cjs:601-630`, `680-687`), defaults unknown historical records to `agent-improvement` for ledger stability (`reduce-state.cjs:722-730`), and has Lane B benchmark-aggregate plateau stop logic separate from Lane A dimension plateau (`reduce-state.cjs:887-937`). `reduce-state-mode-mix.vitest.ts` asserts the registry and dashboard expose that mode mix (`.opencode/skills/deep-improvement/scripts/shared/tests/reduce-state-mode-mix.vitest.ts:25-91`).

**Concrete Implementation Shape**
Create `deep-loop-workflows` as the only workflow skill folder and move the improvement Lane A/B surfaces into it with minimal root-prefix rewrites:

`.opencode/skills/deep-loop-workflows/SKILL.md`

`.opencode/skills/deep-loop-workflows/graph-metadata.json`

`.opencode/skills/deep-loop-workflows/assets/agent_improvement/**`

`.opencode/skills/deep-loop-workflows/assets/model_benchmark/**`

`.opencode/skills/deep-loop-workflows/references/agent_improvement/**`

`.opencode/skills/deep-loop-workflows/references/model_benchmark/**`

`.opencode/skills/deep-loop-workflows/scripts/agent-improvement/**`

`.opencode/skills/deep-loop-workflows/scripts/model-benchmark/**`

`.opencode/skills/deep-loop-workflows/scripts/shared/loop-host.cjs`

`.opencode/skills/deep-loop-workflows/scripts/shared/reduce-state.cjs`

`.opencode/skills/deep-loop-workflows/scripts/shared/materialize-benchmark-fixtures.cjs`

`.opencode/skills/deep-loop-workflows/scripts/shared/improvement-journal.cjs`

`.opencode/skills/deep-loop-workflows/scripts/shared/mutation-coverage.cjs`

Keep `.opencode/skills/deep-loop-runtime/**` unchanged. Do not add `improvement` or `model-benchmark` to `deep-loop-runtime/scripts/convergence.cjs` as part of this migration.

Update the command surfaces by root-prefix rewrite, not behavioral rewrite:

`.opencode/commands/deep/start-agent-improvement-loop.md`

`.opencode/commands/deep/start-model-benchmark-loop.md`

`.opencode/commands/deep/assets/deep_start-agent-improvement-loop_auto.yaml`

`.opencode/commands/deep/assets/deep_start-agent-improvement-loop_confirm.yaml`

`.opencode/commands/deep/assets/deep_start-model-benchmark-loop_auto.yaml`

`.opencode/commands/deep/assets/deep_start-model-benchmark-loop_confirm.yaml`

The command YAML should continue to pass Lane B output paths as `.opencode/skills/sk-prompt-small-model/benchmarks/{run_label}`. Do not make spec-local fallback possible.

Keep the native agent name `deep-improvement` unless the agent-surface angle decides otherwise. The existing agent is proposal-only and says it never scores, promotes, benchmarks, or edits canonical targets (`.opencode/agents/deep-improvement.md:24-27`, `40-46`). If kept, repoint its skill references across the real mirrors:

`.opencode/agents/deep-improvement.md`

`.claude/agents/deep-improvement.md`

`.codex/agents/deep-improvement.toml`

**Rejected Alternatives**
Reject adding `--loop-type improvement` and `--loop-type model-benchmark` to `deep-loop-runtime` now. The runtime convergence code is graph-backed and only knows research/review/context/council semantics (`convergence.cjs:308-386`). Improvement’s stop conditions live in `reduce-state.cjs`, not the coverage graph (`reduce-state.cjs:841-945`). Porting this now would be a behavior change, not a rename.

Reject a universal `loop-host.cjs --mode=context|research|review|council|agent-improvement|model-benchmark` that drives every loop. The other modes’ YAMLs do more than call runtime scripts: they create mode-specific artifacts, dispatch agents/seats, write reports, and call reducers. Reimplementing that in one Node host risks flattening the exact per-mode behavior the migration must preserve.

Reject nesting Lane A and Lane B under a single public `improvement` mode. The existing reducer, tests, command files, and SKILL already expose `agent-improvement` and `model-benchmark` as distinct modes with different state, artifacts, and output roots (`SKILL.md:243-306`, `loop-host.cjs:191-258`, `reduce-state-mode-mix.vitest.ts:25-91`).

**Important Conflict**
There is one real contradiction to resolve before implementation: current Lane B still has a benchmark-mode promotion path.

`promote-candidate.cjs` treats omitted `--score` as benchmark mode and copies `candidate` over `target` after benchmark gates pass (`.opencode/skills/deep-improvement/scripts/shared/promote-candidate.cjs:156-166`, `346-386`). The Lane B YAMLs expose that path (`deep_start-model-benchmark-loop_auto.yaml:192-195`, `deep_start-model-benchmark-loop_confirm.yaml:210-214`). The test proves it mutates the canonical target (`.opencode/skills/deep-improvement/scripts/shared/tests/promote-candidate-benchmark.vitest.ts:98-114`).

Given the user’s hard constraint that Lane A is the only mutating loop, the migration should classify `model-benchmark` as artifact-writing but canonical-read-only. That means no read-only or benchmark-only mode should invoke `promote-candidate.cjs` or `rollback-candidate.cjs`; promotion should be a Lane A handoff. This preserves default single-executor Lane B benchmark artifacts, but it is not byte-identical for the optional Lane B promotion branch. If byte-identical acceptance covers that optional branch, the constraints conflict and need an explicit spec decision.

**Risks**
The largest risk is terminology drift: `--mode` in `loop-host.cjs` and `--loop-type` in runtime scripts sound equivalent but are not. The merged skill should document them as `workflowMode`, `hostMode`, and `runtimeLoopType`.

The second risk is accidentally losing Lane B’s foreign output root. The scripts are path-agnostic, so a missed YAML/presentation rewrite could silently send outputs elsewhere.

The third risk is overexposing mutators. `promote-candidate.cjs` and `rollback-candidate.cjs` should be reachable only from mutation-authorized mode metadata and Lane A workflow steps.

The fourth risk is test and metadata hardcoding. The tests import `.opencode/skills/deep-improvement/...` directly (`loop-host.vitest.ts:10-13`, `reduce-state-mode-mix.vitest.ts:10-13`, `promote-candidate-benchmark.vitest.ts:16-20`), and `graph-metadata.json` is hard-bound to `skill_id: deep-improvement` (`.opencode/skills/deep-improvement/graph-metadata.json:1-4`).

**Depends On**
This decision depends on the broader layout decision: root-prefix preservation versus `modes/<mode>/` reorganization. For Lane A/B, root-prefix preservation is safer because existing paths are already mode-separated under `scripts/agent-improvement` and `scripts/model-benchmark`.

It also depends on the agent-surface decision: keep `@deep-improvement` as the proposal-only Lane A agent, or rename/consolidate agents. Keeping it is lower risk and consistent with the context report’s note that agent names need not match skill names.

It depends on advisor metadata migration: `deep-loop-workflows` needs a new `graph-metadata.json` with `skill_id: deep-loop-workflows`, and aliases/triggers must route old names to the new folder.

It depends on a spec decision for the Lane B promotion conflict described above.
