[
  {
    "id": "security-6-1",
    "severity": "P0",
    "dimension": "security",
    "title": "Lane B workflow commands interpolate user input into shell strings",
    "file": ".opencode/commands/deep/assets/deep_start-model-benchmark-loop_auto.yaml",
    "line": 147,
    "evidence": "The command string injects {profile}, {spec_folder}, {scoring_method}, and {grader} directly into a shell command: `node ... --profile {profile} --outputs-dir {spec_folder}/... --scorer {scoring_method} --grader {grader}`. Other command fields also embed {profile}/{spec_folder} inside single-quoted JSON details.",
    "fix": "Do not render workflow commands as shell strings with raw placeholders. Use an argv-array execution form, or shell-escape every interpolated value and JSON-encode details out of band before execution; apply the same fix to the confirm YAML."
  },
  {
    "id": "security-6-2",
    "severity": "P0",
    "dimension": "security",
    "title": "LLM grader dispatch grants write-capable permissions",
    "file": ".opencode/skills/deep-agent-improvement/scripts/model-benchmark/dispatch-model.cjs",
    "line": 148,
    "evidence": "`buildSpawnSpec` runs external model executors with edit/write modes: Claude gets `--permission-mode acceptEdits`, Codex gets `--sandbox workspace-write`, and Devin gets `--permission-mode auto`.",
    "fix": "Run grader/model benchmark dispatch in read-only/no-edit modes by default, with an explicit opt-in for write-capable evaluation in an isolated temp workspace. Validate cwd stays inside the benchmark sandbox before spawning."
  },
  {
    "id": "security-6-3",
    "severity": "P1",
    "dimension": "security",
    "title": "Fixture IDs can escape the benchmark output directory",
    "file": ".opencode/skills/deep-agent-improvement/scripts/model-benchmark/run-benchmark.cjs",
    "line": 350,
    "evidence": "Fixture-controlled `fixture.id` is used in `path.join(outputsDir, `${fixture.id}.md`)` without validating that it is a basename or that the resolved path remains under `outputsDir`.",
    "fix": "Reject fixture IDs containing path separators, absolute-path syntax, or `..`; resolve the output path and assert it is inside the resolved outputs directory before reading or scoring it."
  },
  {
    "id": "security-6-4",
    "severity": "P1",
    "dimension": "security",
    "title": "Criteria shell execution defaults open",
    "file": ".opencode/skills/deep-agent-improvement/SKILL.md",
    "line": 276,
    "evidence": "The hardening note says `DEEP_AGENT_ALLOW_CRITERIA_EXEC=0` refuses criteria-driven shell execution, but both hardening gates default to permissive for backward compatibility.",
    "fix": "Fail closed: default criteria command execution to disabled and raw grader cache redaction to enabled. Require an explicit documented opt-in for trusted benchmark profiles."
  },
  {
    "id": "security-6-5",
    "severity": "P1",
    "dimension": "security",
    "title": "Score cache is trusted from a shared temp path",
    "file": ".opencode/skills/deep-agent-improvement/scripts/agent-improvement/score-candidate.cjs",
    "line": 149,
    "evidence": "`defaultCacheDir()` stores scores under `os.tmpdir()/deep-agent-improvement-score-cache`, and later cached JSON is trusted before rescoring.",
    "fix": "Move the score cache under the packet/runtime root with 0700 permissions, or validate owner/mode and use atomic no-follow writes. Treat unreadable or untrusted cache entries as cache misses."
  },
  {
    "id": "security-6-6",
    "severity": "P2",
    "dimension": "security",
    "title": "Benchmark fixtures can trigger regex DoS",
    "file": ".opencode/skills/deep-agent-improvement/scripts/model-benchmark/run-benchmark.cjs",
    "line": 107,
    "evidence": "`compilePatterns` constructs `new RegExp(value, 'i')` directly from profile/fixture `requiredPatterns` and `forbiddenPatterns`, then tests them against full model output.",
    "fix": "Treat fixture patterns as literals by default, or validate them with a safe-regex policy and length limits before compiling. Consider RE2 or bounded matching for authored regexes."
  }
]