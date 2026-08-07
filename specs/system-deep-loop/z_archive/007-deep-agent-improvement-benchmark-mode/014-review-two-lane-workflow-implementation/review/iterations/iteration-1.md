[
  {
    "id": "correctness-1-1",
    "severity": "P0",
    "dimension": "correctness",
    "title": "Lane B YAML flags parse as booleans",
    "file": ".opencode/skills/deep-agent-improvement/scripts/shared/loop-host.cjs",
    "line": 68,
    "evidence": "parseArgs only captures --key=value; when a flag has no '=' it stores true at line 71 and ignores the following argv token. The Lane B YAML commands use space-separated flags like --profile {profile} and --outputs-dir {spec_folder}/improvement/benchmark-outputs.",
    "fix": "Teach loop-host parseArgs to support both --key=value and --key value, then add a regression test using the exact YAML command shape."
  },
  {
    "id": "correctness-1-2",
    "severity": "P0",
    "dimension": "correctness",
    "title": "Model benchmark never dispatches a model",
    "file": ".opencode/skills/deep-agent-improvement/scripts/shared/loop-host.cjs",
    "line": 112,
    "evidence": "The model-benchmark plan contains only materialize-benchmark-fixtures.cjs followed by run-benchmark.cjs; dispatch-model.cjs is never invoked before scoring existing {fixture.id}.md outputs.",
    "fix": "Insert a dispatch step that runs each fixture through dispatch-model.cjs with the selected executor/model and writes real model outputs before run-benchmark scores them; keep materialized fixture inputs separate from scored outputs."
  },
  {
    "id": "correctness-1-3",
    "severity": "P1",
    "dimension": "correctness",
    "title": "Lane B emits invalid session outcome",
    "file": ".opencode/commands/deep/assets/deep_start-model-benchmark-loop_auto.yaml",
    "line": 181,
    "evidence": "The session_end command emits \"sessionOutcome\":\"benchmark-complete\", but SKILL.md freezes valid SESSION_OUTCOMES to keptBaseline, promoted, rolledBack, and advisoryOnly; the journal helper validates this enum.",
    "fix": "Use a valid outcome such as advisoryOnly for benchmark-only runs, or extend the journal enum and SKILL contract; apply the same fix to the confirm YAML."
  },
  {
    "id": "correctness-1-4",
    "severity": "P1",
    "dimension": "correctness",
    "title": "LLM executor fields are dropped",
    "file": ".opencode/commands/deep/start-model-benchmark-loop.md",
    "line": 299,
    "evidence": "The command contract says executor/model are required when grader=llm, but the runtime command block passes only --profile, --outputs-dir, --scorer, and --grader.",
    "fix": "Thread --executor and --model through the YAML, loop-host, run-benchmark, and the grader/dispatcher path when grader=llm."
  },
  {
    "id": "correctness-1-5",
    "severity": "P1",
    "dimension": "correctness",
    "title": "Benchmark plateau stop is not implemented",
    "file": ".opencode/skills/deep-agent-improvement/scripts/shared/reduce-state.cjs",
    "line": 773,
    "evidence": "stopOnDimensionPlateau only inspects bucket.dimensionScores; Lane B benchmark aggregate scores live in bucket.benchmarkRuns and are never checked, despite the Lane B YAML promising stop on 3+ identical aggregate scores.",
    "fix": "Add a benchmark aggregate plateau check over recent bucket.benchmarkRuns aggregateScore values and include a stop reason for benchmark plateau."
  },
  {
    "id": "correctness-1-6",
    "severity": "P1",
    "dimension": "correctness",
    "title": "Profile IDs fail before run-benchmark",
    "file": ".opencode/skills/deep-agent-improvement/scripts/shared/loop-host.cjs",
    "line": 112,
    "evidence": "loop-host forwards --profiles-dir only to run-benchmark, while the required first step materialize-benchmark-fixtures.cjs receives only --profile and --outputs-dir; a profile ID or custom profiles-dir cannot resolve before scoring starts.",
    "fix": "Forward --profiles-dir to the materializer and share the same profile path-or-id resolution logic used by run-benchmark."
  }
]