# Iteration 1: Inventory + gaps

- **Executor**: cli-codex gpt-5.5, reasoning=high, service_tier=fast, sandbox=read-only
- **Dispatch exit code**: 0
- **Tokens used**: 110,209

---

## Codex findings (verbatim)

Path correction: the 126 files are not under `126-mimo-fast-validation`; they exist under `126-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/`.

**1. Lane B Reuse**
- Profile-driven fixtures already exist. [default.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/assets/model-benchmark/benchmark-profiles/default.json:2) defines `"profileId"`, `"id"`, `"version"`, `"family"`, `"targetPath"`, `"fixtureDir"`, `"fixtures"`, `"outputsDir"`, `"metrics"`, `"thresholdDelta"`, and `"benchmark"` thresholds.
- Fixture loading is parameterized by profile. [run-benchmark.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:96) reads `profile.fixtureDir || profile.benchmark?.fixtureDir`, and `profile.fixtures || profile.benchmark?.fixtures`; otherwise it loads all JSON files in the fixture dir.
- The current fixture schema is reusable for artifact-contract scoring: the three fixtures carry `id`, `title`, `description`, `requiredHeadings`, `requiredPatterns`, `forbiddenPatterns`, and `content`. Evidence: [fixture-baseline.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/assets/model-benchmark/benchmark-fixtures/fixture-baseline.json:2), [fixture-improved.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/assets/model-benchmark/benchmark-fixtures/fixture-improved.json:2), [fixture-edge.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/assets/model-benchmark/benchmark-fixtures/fixture-edge.json:2).
- Scoring has two selectable paths. [run-benchmark.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:389) accepts `--scorer pattern|5dim`; [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/README.md:20) names `pattern` as default and `5dim` as opt-in.
- The 5-dim scorer has a useful hook shape. [score-model-variant.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs:22) exposes `score({ candidateId, candidateHash, outputText, criteria, rubric?, cwd, graderKind?, graderMode?, mockMode? })`; [same file](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs:39) has overridable `DEFAULT_RUBRIC`; [same file](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs:165) supports grader kinds `llm`, `mock`, and `noop`.
- Dispatch is executor-abstracted. [dispatch-model.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:13) documents dispatch parameters: `prompt_file`, `executor`, `model`, `agent`, `variant`, `state_dir`, `mock`, `mock_mode`, `cwd`, `timeout_ms`. [same file](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:105) supports `cli-opencode`, `cli-claude-code`, `cli-codex`, `cli-gemini`, and `cli-devin`.
- Reasoning/variant is partly parameterized. [dispatch-model.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:197) maps `variant` to OpenCode `--variant`; [same file](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:207) maps it to Claude `--effort`; [same file](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:215) maps it to Codex `model_reasoning_effort`.

**2. 126/004 One-Offs**
- Model dispatch is locally hard-coded around OpenCode. [run-mimo-bench.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/126-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/run-mimo-bench.cjs:31) sets `DEFAULT_MODEL = 'xiaomi-token-plan-ams/mimo-v2.5-pro'`; [same file](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/126-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/run-mimo-bench.cjs:72) shells through `gtimeout opencode run --model ... --format json --dir ...`.
- Frameworks are code, not config. [frameworks.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/126-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/frameworks.cjs:28) hard-codes five objects: `rcaf`, `race`, `cidi`, `tidd-ec`, and `costar`, each with a JS `render` function.
- Fixtures are code, not config. [fixtures.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/126-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/fixtures.cjs:8) hard-codes two fixtures, `chunk` and `parseRange`, with `fn_name`, `task`, `signature`, and hidden `tests`.
- Scoring is JS-function specific. [run-mimo-bench.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/126-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/run-mimo-bench.cjs:189) extracts a function, runs hidden assertions, scores `assertion_pass_rate`, checks `format_adherent`, and records output length.
- Reporting is framework-bake-off specific. [run-mimo-bench.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/126-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/run-mimo-bench.cjs:252) groups by framework and ranks by mean pass rate, then average words.

**3. Gaps**
- `fixture-source`: Lane B loads JSON fixtures from a profile directory, but 126 needs task fixtures with executable hidden tests. Evidence: Lane B fixture loading in [run-benchmark.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:96) versus 126 hidden tests in [fixtures.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/126-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/fixtures.cjs:20).
- `framework-source`: Lane B has no framework catalog or prompt-template matrix in profile; 126 has a hard-coded framework array with render functions. Evidence: Lane B [default.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/assets/model-benchmark/benchmark-profiles/default.json:2) has no framework keys; 126 [frameworks.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/126-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/frameworks.cjs:28) does.
- `dispatcher`: Lane B can dispatch one prompt file through several executors, but it does not own a framework x fixture x repeat dispatch loop. Evidence: [dispatch-model.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:13) accepts one `prompt_file`; 126 builds combos at [run-mimo-bench.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/126-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/run-mimo-bench.cjs:117).
- `scorer`: Lane B scores heading/pattern contracts or the existing 5-dim agent/code-output rubric; 126 needs configurable extractors, hidden tests, format scoring, length/efficiency metrics, and metric weights. Evidence: Lane B scoring in [run-benchmark.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:171) and [score-model-variant.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs:39); 126 scoring in [run-mimo-bench.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/126-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/run-mimo-bench.cjs:189).
- `reporter`: Lane B reports aggregate fixture pass/fail; 126 reports leaderboard rows by framework. Evidence: Lane B report shape in [run-benchmark.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:462); 126 framework summary in [run-mimo-bench.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/126-cli-opencode-mimo-pro-optimization/004-mimo-prompt-framework-benchmark/eval/run-mimo-bench.cjs:252).

**4. Framework Bake-Off?**
Lane B does not yet have a concrete prompt-technique/framework bake-off model. The README says it can “dispatch a model or prompt framework” [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/README.md:16), but the actual profile lacks framework definitions [default.json](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/assets/model-benchmark/benchmark-profiles/default.json:2), the dispatcher treats `variant` as executor/model reasoning metadata [dispatch-model.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:18), and scoring is keyed by fixture/candidate output rather than framework groups [run-benchmark.cjs](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:489). My read: Lane B has agent/model-variant scoring plus a dispatcher seam, not a first-class framework bake-off seam.

**Proposals**
1. Extend benchmark profiles with `matrix`: `models`, `executors`, `variants`, `frameworks`, `fixtures`, `repeats`, and `timeout`.
2. Move prompt frameworks into config as template strings with named slots, not JS `render` functions.
3. Add fixture-pack types: artifact-contract JSON, code-task-with-hidden-tests, and custom extractor/test runner adapters.
4. Split scorer config into metric plugins: `pattern`, `5dim`, `function_assertions`, `format_adherence`, `efficiency`, with weights.
5. Add a matrix reporter that emits raw combo runs, latest report, history snapshot, and grouped leaderboard.

```json
[
  {
    "priority": "P0",
    "target": "benchmark profile schema",
    "change": "Add a matrix section for models, executors, reasoning variants, prompt frameworks, fixtures, repeats, timeout, and scorer selection.",
    "confidence": 0.92
  },
  {
    "priority": "P0",
    "target": "framework-source seam",
    "change": "Represent RCAF/RACE/CIDI/TIDD-EC/COSTAR-style prompt techniques as config templates with shared output contracts and fixture variable interpolation.",
    "confidence": 0.9
  },
  {
    "priority": "P0",
    "target": "dispatcher seam",
    "change": "Promote dispatch from single prompt_file to framework x fixture x model x variant matrix orchestration while reusing dispatch-model.cjs executor mapping.",
    "confidence": 0.88
  },
  {
    "priority": "P1",
    "target": "scorer seam",
    "change": "Add configurable metric plugins for hidden JS assertions, extraction, format adherence, output length, pattern scoring, and 5dim scoring with profile-defined weights.",
    "confidence": 0.86
  },
  {
    "priority": "P1",
    "target": "reporter seam",
    "change": "Add leaderboard/group-by reporting for framework/model/variant axes while retaining Lane B report.json and report-history provenance.",
    "confidence": 0.84
  },
  {
    "priority": "P2",
    "target": "fixture-source seam",
    "change": "Support fixture packs beyond JSON artifact contracts, including code-task fixtures with hidden tests and extractor/test-runner adapter metadata.",
    "confidence": 0.8
  }
]
```
