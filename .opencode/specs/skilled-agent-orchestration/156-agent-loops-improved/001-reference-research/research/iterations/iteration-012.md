# Iteration 12: S2-04 Time-Decayed Observation Weighting

## Focus

[S2-04] How kasper applies time-decay half-life weighting so stale observations fade, mapped to `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts`.

## Actions Taken

1. Loaded the deep-research and spec-kit contracts for iteration output and packet write discipline.
2. Searched the vendored kasper repo for `decay`, `ageDays`, `decayDays`, `0.5`, and `weight =`.
3. Read kasper's decay helper, config/default docs, decay regression test, and live running aggregate path.
4. Read our coverage graph signal implementation to identify the exact target surface.
5. Checked prior research state for S2-04 duplication; prior iterations mention S2-04 only as pending.

## Findings

### Finding S2-04A: Half-life weighting is a compact per-observation evidence multiplier

Reference mechanism: kasper computes `ageDays` from `Date.now() - e.timestamp`, then applies `weight = 0.5 ** (ageDays / decayDays)` when `decayDays > 0`; weakness and strength frequency maps accumulate that fractional weight before ranking. [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/state.ts:74`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/state.ts:79`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/state.ts:82`]

Exact OUR target file: `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts`.

Why it helps: `computeNodeSignals` currently sums stored edge weights as-is, and `computeGraphNoveltyDelta` counts eligible nodes/edges as raw items. A local helper like `timeDecayWeight(createdAt, decayDays, now)` would let graph evidence fade by age without changing the coverage graph schema. [TARGET: `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts:351`] [TARGET: `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts:560`]

Port difficulty: med. Tag: quick-win.

### Finding S2-04B: Decay should affect actionability/ranking, not raw historical coverage

Reference mechanism: kasper keeps `total_sessions` and `avg_score` raw while applying decay only to weakness/strength frequency evidence. The helper's denominator for average score is still unweighted session count, but the stale weakness ranking fades. [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/state.ts:58`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/state.ts:69`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/state.ts:90`]

Exact OUR target file: `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts`.

Why it helps: our research signals use raw counts for question coverage and graph novelty. Porting kasper's distinction means keeping historical coverage truthful while adding decayed evidence strength for STOP/actionability decisions, so an old source still counts as discovered but no longer carries the same convergence force. [TARGET: `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts:379`] [TARGET: `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts:547`]

Port difficulty: med. Tag: deep-rewrite.

### Finding S2-04C: The config contract is simple: default 30 days, zero disables decay

Reference mechanism: kasper exposes `weakness_decay_days`, documents `0` as decay-disabled, and defaults it to 30 days. [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/config.ts:227`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/README.md:82`]

Exact OUR target file: `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts`.

Why it helps: the signals layer can accept an optional `decayDays` value, default to no decay for backward compatibility, and use `30` only when the loop config explicitly enables age-weighted evidence. That avoids surprising old convergence runs while giving new loops a direct freshness control.

Port difficulty: easy. Tag: quick-win.

### Finding S2-04D: Do not copy kasper blindly; its live aggregate path appears to bypass the decay helper

Reference mechanism: the tested `computeStats` helper applies decay, and the regression test proves an old repeated weakness drops below a recent issue. [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/tests/state.test.ts:178`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/tests/state.test.ts:203`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/tests/state.test.ts:209`]

Reference caveat: the current running aggregate path rebuilds and increments weakness frequencies with weight `1`, then ranks direct counts. That means the formula is reliable as a mechanism, but the live wiring should be treated as a cautionary example. [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/state.ts:690`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/state.ts:694`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/state.ts:740`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/state.ts:744`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/state.ts:804`]

Exact OUR target file: `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts`.

Why it helps: when porting, put decay in the actual signal computation path and add a fixture that proves older evidence contributes less to signal/actionability output. The backlog item should be "wire age weighting into graph signal math", not merely "add a helper".

Port difficulty: easy. Tag: quick-win.

## Questions Answered

[S2-04] answered. Kasper's reusable mechanism is exponential half-life weighting per observation timestamp, with a config window in days and a zero-disable path. The extra source-mining caveat is that the current live aggregate path appears to preserve raw integer running counts, so our port should deliberately wire the decay into the active coverage graph signal path.

## Questions Remaining

The next useful angle is D2 target-mapping: decide exactly which graph metrics should stay raw and which should gain decayed companion metrics. The likely follow-up is the angle-bank item asking whether `computeGraphNoveltyDelta` should weight graph evidence by age so old FINDING/SOURCE nodes stop contributing full convergence pressure.

## Next Focus

Advance beyond S2-04 to the next D2 mapping focus for age-weighted coverage graph novelty/actionability in `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts`.
