[
  {
    "id": "traceability-7-1",
    "severity": "P1",
    "dimension": "traceability",
    "title": "Cached scores can point at the wrong candidate",
    "file": ".opencode/skills/deep-agent-improvement/scripts/agent-improvement/score-candidate.cjs",
    "line": 558,
    "evidence": "The cache input hash includes candidateContent, baselineContent, targetPath, manifest/profile/integration data, but not candidatePath or baselinePath; cache hits are emitted unchanged while result payloads persist candidate and baseline paths.",
    "fix": "Include candidatePath and baselinePath in the cache key, or rewrite path-bearing fields on cache hit and add explicit cacheHit provenance."
  },
  {
    "id": "traceability-7-2",
    "severity": "P1",
    "dimension": "traceability",
    "title": "Benchmark reports are overwritten across iterations",
    "file": ".opencode/skills/deep-agent-improvement/scripts/model-benchmark/run-benchmark.cjs",
    "line": 316,
    "evidence": "outputPath defaults to path.join(outputsDir, 'report.json'), and state-log rows later persist that same report path, so multiple loop iterations point historical ledger rows at a mutable latest report.",
    "fix": "Write iteration- or label-scoped immutable reports, pass --output per iteration, and persist that immutable report path in the state log."
  },
  {
    "id": "traceability-7-3",
    "severity": "P1",
    "dimension": "traceability",
    "title": "Pause state is not packet-local",
    "file": ".opencode/skills/deep-agent-improvement/scripts/model-benchmark/dispatch-model.cjs",
    "line": 36,
    "evidence": "STATE_DIR is derived from the skill directory and PAUSE_SENTINEL is written under that shared skill state, while the benchmark workflows define run state under {spec_folder}/improvement.",
    "fix": "Accept/pass a runtime state directory and write the pause sentinel under {spec_folder}/improvement with the sentinel path recorded in the failure report and ledger."
  },
  {
    "id": "traceability-7-4",
    "severity": "P1",
    "dimension": "traceability",
    "title": "Lane B promotion gate references Lane A artifacts",
    "file": ".opencode/commands/deep/assets/deep_start-model-benchmark-loop_confirm.yaml",
    "line": 202,
    "evidence": "The promotion condition checks benchmark_recommendation == 'candidate-better' and the command uses {candidate_path}, {target_path}, {score_output_path}, agent-improvement-config.json, and target_manifest.jsonc, none of which are established by the model-benchmark setup contract.",
    "fix": "Remove Lane B promotion until it has a defined benchmark-variant artifact schema, or bind explicit Lane B candidate/target/score/config fields and align the recommendation enum."
  },
  {
    "id": "traceability-7-5",
    "severity": "P2",
    "dimension": "traceability",
    "title": "Benchmark result omits profile provenance",
    "file": ".opencode/skills/deep-agent-improvement/scripts/model-benchmark/run-benchmark.cjs",
    "line": 371,
    "evidence": "loadedProfile.path is available when the profile is loaded, but the report records only profileId, family, and target; the state-log row likewise lacks profilePath, profile version, fixtureDir, and fixture file provenance.",
    "fix": "Persist profilePath, profile.version, fixtureDir, and resolved fixture file refs in both report.json and benchmark_run ledger rows."
  },
  {
    "id": "traceability-7-6",
    "severity": "P2",
    "dimension": "traceability",
    "title": "Ledger writer ownership is ambiguous",
    "file": ".opencode/commands/deep/assets/deep_start-model-benchmark-loop_auto.yaml",
    "line": 151,
    "evidence": "The workflow has a step_append_ledger action telling the orchestrator to append benchmark records, while run-benchmark.cjs already appends benchmark_run rows when it can infer the state log path.",
    "fix": "Make run-benchmark the sole ledger writer and change the YAML step to verify the appended row, or disable runner auto-append and make the workflow pass an explicit --state-log writer path."
  }
]