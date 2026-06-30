# Iteration 39: S5-10 Loop-Quality Benchmark From Score Delta

## Focus

[S5-10] How would kasper's score-delta become a loop-quality benchmark to measure whether a runtime change actually improves outcomes across fixtures, not just passes unit tests?

Dimension: D3 cross-cutting. This builds on prior S2-01 and S3-06 work without repeating the raw `score_before` / `outcome_score_delta` mechanism. The new angle is benchmark harness design: baseline fixture matrix before a runtime change, post-change fixture matrix after it, then helped/hurt/regression gates for deep-loop runtime changes.

## Actions Taken

1. Read the deep-research state and strategy files to confirm S5-10 is the active focus and that S2-01/S3-06 already covered the raw score-delta mechanism.
2. Re-read kasper's improvement delta source path: `ImprovementRecord`, `closePendingScoreDeltas()`, one-time `setImprovementDelta()`, and helped/hurt reporting.
3. Inspected our model-benchmark and skill-benchmark command surfaces, the model benchmark runner, reducer, promotion gate, and existing benchmark-stability helper.
4. Mapped kasper's causal delta idea onto our existing benchmark runner instead of proposing a new runner.

## Findings

### 1. Add before/after fixture-matrix delta to model benchmark reports

Reference mechanism: kasper records `score_before` plus pending `outcome_score_delta` on each improvement record, then computes `after - score_before` once later aggregate state is refreshed [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/types.ts:229`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/types.ts:237`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/types.ts:238`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/evaluate.ts:33`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/evaluate.ts:49`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/evaluate.ts:53`].

OUR target file: `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/model-benchmark/run-benchmark.cjs`.

Why it helps: this runner already scores fixture rows, computes `aggregateScore`, writes `totals.delta`, snapshots reports, and appends `benchmark_run` records [TARGET: `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:586`; `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:597`; `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:610`; `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:626`; `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:665`; `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:679`]. The current `totals.delta` is headroom above a static profile threshold, not causal before/after improvement effect. Add optional `baselineReport` / `baselineSnapshot` input and emit `outcomeScoreDelta`, `fixtureDeltas[]`, `helped`, `hurt`, and `unchanged` against the same fixture ids.

Port difficulty: med. Tag: quick-win.

### 2. Teach the reducer to summarize benchmark outcome delta, not only best aggregate score

Reference mechanism: kasper closes pending deltas immediately after recording a session and refreshing aggregate state [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/evaluate.ts:308`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/evaluate.ts:319`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/evaluate.ts:340`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/evaluate.ts:345`], and the status handler reports average delta plus helped/hurt counts [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/handlers.ts:283`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/handlers.ts:287`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/handlers.ts:289`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/handlers.ts:292`].

OUR target file: `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/reduce-state.cjs`.

Why it helps: the reducer already buckets `benchmark_run` records, tracks benchmark pass/fail counts, and selects `bestBenchmarkRecord` by absolute aggregate [TARGET: `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/reduce-state.cjs:666`; `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/reduce-state.cjs:733`; `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/reduce-state.cjs:739`; `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/reduce-state.cjs:743`]. Add `benchmarkOutcomeDelta` metrics per profile so dashboards can show "runtime change helped 7 fixtures, hurt 2, net +4.2" instead of only "latest aggregate 84".

Port difficulty: med. Tag: quick-win.

### 3. Gate benchmark promotion on improvement over baseline, not only benchmark-pass

Reference mechanism: kasper's delta persistence is one-time and guarded: `setImprovementDelta()` only writes when the improvement has no existing `outcome_score_delta`, then marks state dirty [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/state.ts:378`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/state.ts:380`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/state.ts:381`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/state.ts:382`]. The helped/hurt summary makes negative deltas visible rather than hiding them behind absolute acceptability [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/handlers.ts:283`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/handlers.ts:292`].

OUR target file: `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/promote-candidate.cjs`.

Why it helps: Lane B currently promotes on `benchmark-complete`, `benchmark-pass`, aggregate gate, and repeatability report [TARGET: `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/promote-candidate.cjs:219`; `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/promote-candidate.cjs:224`; `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/promote-candidate.cjs:229`; `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/promote-candidate.cjs:239`], while explicitly skipping Lane A score-delta gates for benchmark mode [TARGET: `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/promote-candidate.cjs:274`; `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/promote-candidate.cjs:277`; `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/promote-candidate.cjs:297`; `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/promote-candidate.cjs:299`]. Add a benchmark-mode gate that requires `outcomeScoreDelta >= profile.benchmark.requiredOutcomeDelta` and either `hurt === 0` or `hurt <= allowedRegressionCount`.

Port difficulty: med. Tag: quick-win.

### 4. Extend skill/model benchmark profiles into loop-quality runtime-change fixtures

Reference mechanism: kasper scopes the after-score to the changed target: agent prompt changes use per-agent aggregate, while global changes use global average [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/evaluate.ts:49`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/evaluate.ts:50`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/evaluate.ts:51`; `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/evaluate.ts:52`].

OUR target files: `.opencode/commands/deep/skill-benchmark.md`, `.opencode/commands/deep/model-benchmark.md`, and `.opencode/commands/deep/assets/deep_model-benchmark_auto.yaml`.

Why it helps: `/deep:skill-benchmark` already frames skill benchmarking as real-world routing/discovery/efficiency/usefulness with optional live playbook mode [TARGET: `.opencode/commands/deep/skill-benchmark.md:6`; `.opencode/commands/deep/skill-benchmark.md:8`; `.opencode/commands/deep/skill-benchmark.md:65`; `.opencode/commands/deep/skill-benchmark.md:69`; `.opencode/commands/deep/skill-benchmark.md:110`; `.opencode/commands/deep/skill-benchmark.md:114`]. `/deep:model-benchmark` already binds profile-driven fixtures, scorer, grader, and output paths [TARGET: `.opencode/commands/deep/model-benchmark.md:68`; `.opencode/commands/deep/model-benchmark.md:73`; `.opencode/commands/deep/model-benchmark.md:166`; `.opencode/commands/deep/model-benchmark.md:168`], and the auto workflow records a baseline and reruns benchmark/reducer cycles [TARGET: `.opencode/commands/deep/assets/deep_model-benchmark_auto.yaml:150`; `.opencode/commands/deep/assets/deep_model-benchmark_auto.yaml:162`; `.opencode/commands/deep/assets/deep_model-benchmark_auto.yaml:173`; `.opencode/commands/deep/assets/deep_model-benchmark_auto.yaml:176`]. Add a `runtime-change` profile family whose fixtures replay deep-research/deep-review/deep-context packet scenarios and compare pre-change versus post-change benchmark reports per loop type.

Port difficulty: hard. Tag: deep-rewrite.

## Questions Answered

- S5-10 answered: kasper's score-delta should become a benchmark-level before/after outcome delta layered onto the existing model/skill benchmark harness. The first port should not touch unit tests; it should add report fields and reducer/promotion gates that prove a runtime change improved a repeated fixture corpus.
- The local target is not `convergence.cjs` this time. S2-01/S3-06 already mapped score-delta into convergence. For S5-10 the highest-value targets are `run-benchmark.cjs`, `reduce-state.cjs`, `promote-candidate.cjs`, and the `skill-benchmark` / `model-benchmark` command surfaces.

## Questions Remaining

- What should be the default baseline source: an explicit `--baseline-report`, the previous immutable report snapshot in `report-history/`, or a workflow-owned pre-change benchmark pass?
- Should `hurt` be a hard zero-regression gate for runtime changes, or should profiles allow a small regression budget when aggregate improvement clears a higher threshold?
- Which loop fixtures become the initial runtime-change corpus: deep-research reducer fixtures, deep-review blocked-stop sessions, deep-context manual playbook scenarios, or all three?

## Next Focus

S5-11: runtime tests should adopt loop-cli-style HOME/temp-dir isolation so `loop-lock.ts`, `atomic-state.ts`, and `fanout-pool.cjs` tests never touch real runtime state and can run hermetically in parallel.
