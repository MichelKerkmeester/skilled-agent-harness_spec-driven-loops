# Iteration 4: Statistical rigor (multi-sample, noise floor, significance)

- **Executor**: cli-codex gpt-5.5, reasoning=high, service_tier=fast, sandbox=read-only
- **Dispatch exit code**: 0
- **Tokens used**: 75,654

---

## Codex findings (verbatim)

**Confirmed**
126/004 is effectively single-sample per scored cell.

Evidence:
- The harness defaults to `repeat: 1`, only increases samples if `--repeat` is passed, and builds combos as `framework × fixture × rep`: [run-mimo-bench.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/101-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/run-mimo-bench.cjs:33), [run-mimo-bench.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/101-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/run-mimo-bench.cjs:117).
- `results-mimo-high.json` and `results-minimax-high.json` both have top-level `"repeat": 1`, and every row repeats that: [results-mimo-high.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/101-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/results-mimo-high.json:6), [results-minimax-high.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/101-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/results-minimax-high.json:6).
- The synthesis says: “Single sample per (framework × fixture)” and says the COSTAR/RACE margin is inside single-sample noise: [synthesis.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/101-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/synthesis.md:57).
- The high-reasoning synthesis extends that to model/reasoning cells: “Single sample per (model × reasoning × framework × fixture)”: [synthesis-high-reasoning.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/101-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/synthesis-high-reasoning.md:113).

Tie handling is informal today. The harness console summary sorts by mean pass, then shorter average words, with no confidence model: [run-mimo-bench.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/101-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/run-mimo-bench.cjs:264), [run-mimo-bench.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/101-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/run-mimo-bench.cjs:268). The synthesis correctly downgrades close leads to ties, e.g. the 2-word RCAF/COSTAR gap is called noise: [synthesis-high-reasoning.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/101-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/synthesis-high-reasoning.md:33), [synthesis-high-reasoning.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/101-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/synthesis-high-reasoning.md:105).

**Statistical Design**
1. Multi-sample: make `samplesPerCell` first-class in the profile and result JSON. A cell is `(model, variant/reasoning, framework, fixture)`, and each cell has `sample: 1..N`. This extends the existing `repeat` mechanism rather than inventing a new loop.
Correctness should aggregate as mean pass rate for pass@1, plus pass@k only if the actual downstream system retries. Format should aggregate as a Bernoulli rate. Efficiency should report median words/tokens for robustness, mean for expected cost, and p90 for budget risk. Best-of-n should only be used when runtime actually selects the best of multiple calls; otherwise it overstates production behavior.

2. Noise floor: add a calibration block that repeats the same config several times and estimates intrinsic variance. For composite/words, use MAD or standard deviation over repeated same-config samples; for binary format/correctness, use observed flip rate. The existing `deep-improvement` profile has `"repeatabilityTolerance": 0`: [default.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/assets/model-benchmark/benchmark-profiles/default.json:15). That is brittle because this repo already documents single-sample noise as large enough to erase nominal winners.

3. Significance: implement paired bootstrap in plain `.cjs`. For each A/B comparison, build paired deltas across shared `(fixture, sample)` points, resample those deltas 5,000 times with a deterministic seeded PRNG, and compute a 90% CI over mean delta. No SciPy needed. Paired comparison is better than independent CIs here because A and B share fixtures.

4. Trustworthiness gate: declare `WINNER` only when `N >= k`, `margin > noiseFloor`, and paired 90% CI lower bound is above zero. Otherwise report `TIE` if both are within the noise floor, or `INCONCLUSIVE` if N/fixture coverage is too low. For 126/004 as stored, this gate would report the close RCAF/COSTAR and RACE/TIDD-EC cases as ties, matching the synthesis language.

5. Sample cost: current high rig is 5 frameworks × 2 fixtures = 10 dispatches per cell: [synthesis-high-reasoning.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/101-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/synthesis-high-reasoning.md:10). Because dispatches are real OpenCode CLI calls, N multiplies cost directly; the harness explicitly describes real dispatches and persisted raw responses: [run-mimo-bench.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/101-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/run-mimo-bench.cjs:4). Defaults I’d use: `N=1` smoke, `N=3` normal ranking, `N=5` release decision, `N=10` publication/audit.

6. Reuse from 120/003 convergence: the hill-climb loop already has plateau and MAD concepts. `plateauSignal` checks recent score movement against `plateau_delta_threshold`: [converge.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/098-cli-opencode-minimax-optimization/003-minimax-prompt-framework-benchmark/eval-loop/scripts/converge.cjs:27). `madSignal` detects when recent score dispersion hits a noise floor: [converge.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/098-cli-opencode-minimax-optimization/003-minimax-prompt-framework-benchmark/eval-loop/scripts/converge.cjs:54). Reuse the idea, not the whole stop rule: benchmark stabilization should track winner margin and CI width over incremental samples, not mutation exhaustion.

**Proposals**
1. Add profile fields: `samplesPerCell`, `minSamplesForWinner`, `confidenceLevel`, `bootstrapIterations`, `noiseFloorStrategy`, and nonzero `repeatabilityTolerance`.
2. Change result schema from flat `repeat` to explicit per-row `sample`, while preserving `repeat` as a backward-compatible alias.
3. Add `stats.cjs` with dependency-free `mean`, `median`, `mad`, `quantile`, `seededRandom`, `bootstrapPairedDeltaCi`, and `pairedWinRate`.
4. Change synthesis generation to emit `WINNER`, `TIE`, or `INCONCLUSIVE`, with reason fields: `insufficient_n`, `inside_noise_floor`, `ci_overlaps_zero`, or `trusted_margin`.
5. Add a stabilization check adapted from `converge.cjs`: stop sampling early only when top-pair margin and CI width stabilize for a configured window.
6. Report cost before dispatch: total calls = models × variants × frameworks × fixtures × samples, plus retry budget.

```json
[
  {
    "priority": "P0",
    "target": "eval/run-mimo-bench.cjs",
    "change": "Make samplesPerCell/repeat a required statistical dimension in outputs and compute per-cell aggregates instead of treating repeat as a manual rerun knob.",
    "confidence": 0.93
  },
  {
    "priority": "P0",
    "target": "eval/stats.cjs",
    "change": "Add dependency-free paired bootstrap CI, MAD noise-floor estimation, median/mean/p90 aggregators, and deterministic seeded resampling.",
    "confidence": 0.88
  },
  {
    "priority": "P0",
    "target": "eval/synthesis*.md generation",
    "change": "Gate winner claims behind N>=k, margin>noiseFloor, and positive paired 90% CI; otherwise emit TIE or INCONCLUSIVE.",
    "confidence": 0.91
  },
  {
    "priority": "P1",
    "target": ".opencode/skills/deep-improvement/assets/model-benchmark/benchmark-profiles/default.json",
    "change": "Replace repeatabilityTolerance=0 with a nonzero profile default or an explicit calibration mode; zero tolerance contradicts observed single-sample noise.",
    "confidence": 0.86
  },
  {
    "priority": "P1",
    "target": ".opencode/skills/deep-improvement/scripts/model-benchmark/run-benchmark.cjs",
    "change": "Promote repeatabilityTolerance from passive report metadata into an active pass/fail or trustworthiness threshold.",
    "confidence": 0.82
  },
  {
    "priority": "P2",
    "target": "120/003 eval-loop convergence logic",
    "change": "Reuse plateau/MAD concepts for benchmark stabilization, but adapt the signal to top-pair margin and CI-width stability rather than mutation exhaustion.",
    "confidence": 0.79
  }
]
```
