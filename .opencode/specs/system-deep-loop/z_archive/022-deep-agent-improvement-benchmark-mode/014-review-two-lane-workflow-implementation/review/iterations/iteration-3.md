[
  {
    "id": "traceability-3-1",
    "severity": "P1",
    "dimension": "traceability",
    "title": "Lane B config path is split",
    "file": ".opencode/commands/deep/assets/deep_start-model-benchmark-loop_auto.yaml",
    "line": 102,
    "evidence": "The YAML state_paths.config points to {spec_folder}/improvement/agent-improvement-config.json, while start-model-benchmark-loop.md says Lane B setup persists {spec_folder}/improvement/model-benchmark-config.json; the confirm YAML has the same agent-improvement-config path at line 107 and reduce-state reads agent-improvement-config.json.",
    "fix": "Pick one canonical Lane B config artifact. Either update both Lane B YAMLs and reduce-state to read model-benchmark-config.json, or change the command docs/setup to write agent-improvement-config.json with lane/scorer/grader/executor/model fields."
  },
  {
    "id": "traceability-3-2",
    "severity": "P1",
    "dimension": "traceability",
    "title": "Failure reports lose scorer provenance",
    "file": ".opencode/skills/deep-agent-improvement/scripts/model-benchmark/run-benchmark.cjs",
    "line": 426,
    "evidence": "The catch-path failure object records status/profileId/evaluationMode/mode/outputsDir/error/failureModes, but omits scoringMethod and grader; the infra_failure JSONL record below also omits them, so a failed 5dim/mock/llm run is indistinguishable from a pattern/noop failure.",
    "fix": "Add scoringMethod: scorer and grader: graderKind to both the failure report and infra_failure ledger row; include executor/model too when those are bound."
  },
  {
    "id": "traceability-3-3",
    "severity": "P1",
    "dimension": "traceability",
    "title": "Explicit Lane B can be shadowed",
    "file": ".opencode/commands/deep/start-agent-improvement-loop.md",
    "line": 127,
    "evidence": "The lane resolver first routes to agent-improvement when an agent path is present OR --lane=agent-improvement is present; the --lane=model-benchmark branch is checked only afterward, so conflicting explicit Lane B input with an agent path is silently traced as Lane A.",
    "fix": "Resolve explicit --lane or marker lane before agent-path inference; if an agent path conflicts with lane=model-benchmark, fail fast or ask one disambiguation question instead of silently choosing Lane A."
  },
  {
    "id": "traceability-3-4",
    "severity": "P2",
    "dimension": "traceability",
    "title": "Agent note uses old script paths",
    "file": ".opencode/agents/deep-agent-improvement.md",
    "line": 44,
    "evidence": "The Lane awareness note references scripts/loop-host.cjs, scripts/dispatch-model.cjs, and scripts/run-benchmark.cjs, but the shipped files are under scripts/shared/loop-host.cjs and scripts/model-benchmark/{dispatch-model,run-benchmark}.cjs.",
    "fix": "Update the Lane awareness note to the lane-separated paths so dispatch traces from the agent surface land on real files."
  },
  {
    "id": "traceability-3-5",
    "severity": "P2",
    "dimension": "traceability",
    "title": "Pause resume hint points nowhere",
    "file": ".opencode/skills/deep-agent-improvement/scripts/model-benchmark/dispatch-model.cjs",
    "line": 121,
    "evidence": "writePauseSentinel writes resume_via as rm state/.benchmark-pause && re-run loop-host.cjs --mode=model-benchmark, but PAUSE_SENTINEL is under the skill state directory and loop-host now lives in scripts/shared/loop-host.cjs.",
    "fix": "Write a repo-relative resume command that removes .opencode/skills/deep-agent-improvement/state/.benchmark-pause and invokes node .opencode/skills/deep-agent-improvement/scripts/shared/loop-host.cjs with the needed benchmark args."
  },
  {
    "id": "traceability-3-6",
    "severity": "P2",
    "dimension": "traceability",
    "title": "Spawn path mapping is untested",
    "file": ".opencode/skills/deep-agent-improvement/scripts/tests/loop-host.vitest.ts",
    "line": 10,
    "evidence": "The test imports parseArgs, resolveMode, planInvocation, and VALID_MODES, then asserts the bare TST-1 plan script names; it never imports or asserts resolveScriptPath, so the byte-identical plan can pass while spawn-time lane path resolution drifts.",
    "fix": "Import resolveScriptPath and add assertions that score-candidate.cjs resolves under scripts/agent-improvement and run-benchmark.cjs resolves under scripts/model-benchmark, while keeping planInvocation assertions byte-identical."
  }
]