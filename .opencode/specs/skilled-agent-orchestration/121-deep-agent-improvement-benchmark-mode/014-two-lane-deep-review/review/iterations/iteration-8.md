[
  {
    "id": "maintainability-8-1",
    "severity": "P2",
    "dimension": "maintainability",
    "title": "Benchmark option schema is split",
    "file": ".opencode/skills/deep-agent-improvement/scripts/shared/loop-host.cjs",
    "line": 99,
    "evidence": "planInvocation builds benchArgs by hand and forwards only output, state-log, label, profiles-dir, scorer, and grader, while run-benchmark.cjs separately supports --integration-report.",
    "fix": "Define one shared model-benchmark option schema for loop-host and run-benchmark, then either forward --integration-report through loop-host or remove the orphaned runner option."
  },
  {
    "id": "maintainability-8-2",
    "severity": "P2",
    "dimension": "maintainability",
    "title": "Router assets are not lane-aware",
    "file": ".opencode/skills/deep-agent-improvement/SKILL.md",
    "line": 133,
    "evidence": "RUNTIME_ASSETS always lists only assets/agent-improvement/improvement_config.json and target_manifest.jsonc, despite the same router defining a MODEL_BENCHMARK intent and physically separated model-benchmark assets.",
    "fix": "Split runtime assets by lane, e.g. AGENT_IMPROVEMENT and MODEL_BENCHMARK, and select the model-benchmark profile/fixture assets when MODEL_BENCHMARK wins."
  },
  {
    "id": "maintainability-8-3",
    "severity": "P2",
    "dimension": "maintainability",
    "title": "Infra failure emission is duplicated",
    "file": ".opencode/skills/deep-agent-improvement/scripts/agent-improvement/score-candidate.cjs",
    "line": 423,
    "evidence": "main repeats the same infra_failure object plus outputPath/writeJson/stdout/process.exit pattern for candidate read, manifest parse, profile generation, baseline read, and baseline profile failures.",
    "fix": "Extract a single emitInfraFailure helper that accepts the variable fields and handles output writing/stdout plus exit code."
  },
  {
    "id": "maintainability-8-4",
    "severity": "P2",
    "dimension": "maintainability",
    "title": "Dispatcher CLI hides failure diagnostics",
    "file": ".opencode/skills/deep-agent-improvement/scripts/model-benchmark/dispatch-model.cjs",
    "line": 311,
    "evidence": "main prints only ok, exit_code, attempts, and paused, then a STDOUT section, even though dispatchReal returns stderr and error fields for failed executor runs.",
    "fix": "Include error and stderr in the CLI JSON or add a STDERR section so executor failures are diagnosable without instrumenting the module."
  },
  {
    "id": "maintainability-8-5",
    "severity": "P2",
    "dimension": "maintainability",
    "title": "Integration scoring comments contradict code",
    "file": ".opencode/skills/deep-agent-improvement/scripts/model-benchmark/run-benchmark.cjs",
    "line": 282,
    "evidence": "The comments say command and skill coverage are worth 10 pts, but commandScore and skillScore are assigned 100 and then weighted at 20 percent each in the integrationScore calculation.",
    "fix": "Replace the stale point comments with named constants for normalized scores and weights, or update the comments to describe the 0-100 normalized scale."
  }
]