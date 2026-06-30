# Iteration 3: Multi-dimensional scoring (deterministic + LLM-judge)

- **Executor**: cli-codex gpt-5.5, reasoning=high, service_tier=fast, sandbox=read-only
- **Dispatch exit code**: 0
- **Tokens used**: 115,159

---

## Codex findings (verbatim)

Read-only investigation complete. The current reusable path should be an adapter layer around existing scorers, not a rewrite.

**1. Existing 5-Dim Scorer**
`score-model-variant.cjs` scores five dimensions through `DEFAULT_RUBRIC`: `D1` acceptance weight `0.25`, `D2` bundle gate weight `0.30`, `D3` cwd/path correctness weight `0.20`, `D4` grader/hallucination weight `0.15`, `D5` pre-planning weight `0.10` ([score-model-variant.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs:39)). The names are comments in this entrypoint; the name-bearing ancestor config calls them `Acceptance`, `Bundle-gate`, `Path/CWD`, `Hallucination`, and `Pre-plan` with the same weights ([eval-loop-config.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/098-cli-opencode-minimax-optimization/003-minimax-prompt-framework-benchmark/eval-loop/state/eval-loop-config.json:5)).

`graderKind` works as: `noop` returns constant D4 `1.0`; `llm` maps to harness mode `real`; anything else maps to harness mode `mock` ([score-model-variant.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs:172)). The grader call passes `fixture`, output text, `candidateHash` as `variant_hash`, rubric version, mode, and mock mode into `harness.gradeD4` ([score-model-variant.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs:237)).

`cache.cjs` supports two cache kinds: `det` and `grader`, under `cache/<kind>/index.jsonl` plus `<key>.out.md` blobs ([cache.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/scorer/lib/cache.cjs:6)). Deterministic keys are derived from `variant_hash`, `fixture_id`, `check_name`, and `check_version` ([cache.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/scorer/lib/cache.cjs:57)). Grader keys are derived from rubric version, `variant_hash`, `fixture_id`, `dim_id`, SWE output hash, and grader model build hash ([cache.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/scorer/lib/cache.cjs:71)). In the current entrypoint, `candidateHash` becomes the grader `variant_hash`; if missing, it is derived from output text ([score-model-variant.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs:237)). The harness currently reads/writes the `grader` cache path ([harness.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/scorer/grader/harness.cjs:224)).

**2. Deterministic Checks**
`bundle-gate.cjs`: D2 hard gate. It checks import plausibility, export well-formedness/no duplicate names, and an optional smoke-run command under fixture cwd; score is `1.0/0.6/0.3/0.0` by layers passed, and environment failures can set `hard_gate_failed` ([bundle-gate.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/scorer/deterministic/bundle-gate.cjs:4), [bundle-gate.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/scorer/deterministic/bundle-gate.cjs:202)).

`cwd-check.cjs`: D3 path discipline. It extracts path-like tokens, classifies them as in-cwd, outside, bare-relative, or traversal, and scores `1.0`, `0.7`, or `0.0` ([cwd-check.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/scorer/deterministic/cwd-check.cjs:4), [cwd-check.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/scorer/deterministic/cwd-check.cjs:111)).

`hallucination-flag.cjs`: deterministic D4 cross-check. It extracts CLI flags and function-call symbols, compares them to fixture allowlists plus common builtins, and scores by unverified claim count ([hallucination-flag.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/scorer/deterministic/hallucination-flag.cjs:4), [hallucination-flag.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/scorer/deterministic/hallucination-flag.cjs:116)).

`preplanning-regex.cjs`: D5 structure. It requires a `<pre-plan>` block, at least three numbered steps, and acceptance plus verification signals per step ([preplanning-regex.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/scorer/deterministic/preplanning-regex.cjs:4), [preplanning-regex.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/scorer/deterministic/preplanning-regex.cjs:87)).

**3. 126/004 And 120/003 Metrics**
The 126/004 MiMo harness computes `assertion_pass_rate`, `format_adherent`, `output_chars`, `output_words`, and `ms` per dispatch ([run-mimo-bench.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/101-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/run-mimo-bench.cjs:193)). Hidden assertions run one child process per test and return `pass_rate` ([runtests.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/101-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/runtests.cjs:34)). Format adherence means “only code” after extraction/unfencing, with prose outside code rejected ([extract.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/101-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/extract.cjs:66)). Its final ranking sorts by mean pass rate, then lower average words; format is printed/tracked but not in the sort ([run-mimo-bench.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/101-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/run-mimo-bench.cjs:252)).

The 120/003 scorer adds the fuller 5-dim structure: deterministic acceptance, bundle gate, cwd check, preplanning, deterministic hallucination flag, plus D4 grader, hard gate, optional extraction, and interaction terms ([score-variant.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/098-cli-opencode-minimax-optimization/003-minimax-prompt-framework-benchmark/eval-loop/scripts/score-variant.cjs:170)). `preplanning_density` is a mutation axis/profile variable, not directly a score dimension; D5 scores pre-plan structure in the produced output ([eval-loop-config.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/098-cli-opencode-minimax-optimization/003-minimax-prompt-framework-benchmark/eval-loop/state/eval-loop-config.json:70), [v-004-tidd-ec.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/098-cli-opencode-minimax-optimization/003-minimax-prompt-framework-benchmark/eval-loop/variants/v-004-tidd-ec.md:16)).

**4. Unified Contract**
Use a profile-configurable vector:

```json
{
  "scoring": {
    "mode": "hybrid",
    "correctness_policy": "gate_then_rank",
    "dimensions": [
      {"id":"correctness","scorer_type":"deterministic","weight":0.0,"gate":{"min":1.0},"params":{"kind":"hidden_assertions|acceptance"}},
      {"id":"format_scope","scorer_type":"deterministic+graded","weight":0.30,"params":{"regex_checks":["format_adherence","cwd-check","bundle-gate"],"judge":"scope_discipline"}},
      {"id":"brevity_efficiency","scorer_type":"deterministic","weight":0.30,"params":{"length_metric":"output_words","latency_metric":"ms","cost_metric":"UNKNOWN"}},
      {"id":"reasoning_quality","scorer_type":"graded","weight":0.40,"params":{"graderKind":"noop|mock|llm","prompt":"profile-specific"}}
    ]
  }
}
```

Per fixture: run gates first. If a hard gate fails, mark fixture failed and either set score `0` or exclude it from survivor ranking, depending on profile. For survivors, normalize each dimension to `0..1`, combine as `sum(weight * score) / sum(active_weights)`, and preserve raw sub-scores. Aggregate by mean fixture score plus pass rate, matching the existing runner’s mean aggregation pattern ([run-benchmark.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:438), [loop.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/098-cli-opencode-minimax-optimization/003-minimax-prompt-framework-benchmark/eval-loop/scripts/loop.cjs:153)). Weights are already overridable in `score()` via `opts.rubric`, but `run-benchmark.cjs` does not currently pass profile rubric into `scoreFixture5dim` ([score-model-variant.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs:193), [run-benchmark.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:274)).

**5. Anti-Saturation**
Correctness should become a gate once it saturates. The 126 results demonstrate the problem: all ten `assertion_pass_rate` rows are `1`, while format and word count still vary ([results.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/101-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/results.json:20), [results.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/101-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/results.json:65), [results.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/101-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/results.json:322)). Recommendation: use correctness as `required pass_rate >= threshold`; rank survivors on efficiency, format/scope, and reasoning. That preserves correctness without letting a saturated column flatten the benchmark.

**6. Lane B Fit**
Lane B’s 5-dim scorer should become one pluggable scorer family, not the universal contract. `run-benchmark.cjs` already has scorer selection between `pattern` and `5dim` ([run-benchmark.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:389)). Extend that seam to scorer plugins: `function_assertion`, `format`, `efficiency`, `5dim`, and `graded_reasoning`. Reuse the deterministic scripts and grader harness; add adapters that map profile fixtures into the shared dimension vector.

**Proposals**
1. Add `scorer/plugins/*` adapters with a shared `{score, passed, raw, evidence}` result shape.
2. Promote correctness to a configurable gate when pass-rate variance is near zero.
3. Pass `profile.scoring.rubric` into `scoreFixture5dim` so weights live in profiles, not hardcoded runner defaults.
4. Fold `hallucination-flag` into `format_scope` or `reasoning_quality` as an independent deterministic cross-check, because it is computed but not in the current weighted vector.
5. Add an efficiency scorer using `output_words`, `output_chars`, `ms`, and later token/cost fields when dispatchers expose them.
6. Keep grader modes `noop|mock|llm`; default `noop` for hermetic runs and require explicit `llm` for judge-backed benchmarks.

```json
[
  {
    "priority": "P1",
    "target": ".opencode/skills/deep-improvement/scripts/model-benchmark/scorer/",
    "change": "Introduce a reusable dimension-vector scoring contract and plugin registry around existing deterministic checks and grader harness.",
    "confidence": "high"
  },
  {
    "priority": "P1",
    "target": ".opencode/skills/deep-improvement/scripts/model-benchmark/run-benchmark.cjs",
    "change": "Replace scorer enum pattern|5dim with profile-configurable scorer plugins and pass profile rubric/weights into scorer calls.",
    "confidence": "high"
  },
  {
    "priority": "P1",
    "target": ".opencode/specs/skilled-agent-orchestration/z_archive/101-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/",
    "change": "Adapt hidden assertion pass rate, format adherence, output length, and latency into reusable deterministic scorers.",
    "confidence": "high"
  },
  {
    "priority": "P2",
    "target": ".opencode/skills/deep-improvement/scripts/model-benchmark/scorer/grader/",
    "change": "Generalize D4-only grader harness into named graded dimensions while preserving prompt-specific JSON contracts and cache keys.",
    "confidence": "medium"
  },
  {
    "priority": "P2",
    "target": "benchmark profiles",
    "change": "Add anti-saturation policy: correctness as gate once saturated, then rank survivors by efficiency, format/scope, and graded reasoning.",
    "confidence": "high"
  },
  {
    "priority": "P3",
    "target": "dispatch result schema",
    "change": "Expose token and dollar cost fields for true token-efficiency scoring; currently only words/chars/ms are evidenced.",
    "confidence": "medium"
  }
]
```
