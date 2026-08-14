# Iteration 032 — maintainability

- Executor: cli-codex gpt-5.6-luna effort=xhigh service_tier=fast sandbox=read-only
- Completed: 2026-07-30T08:44:07.531Z
- New findings: 7 (of 7 reported; prior total 120)
- Coverage: {"filesExamined":18,"keyPaths":[".opencode/skills/system-deep-loop/runtime/scripts/query.cjs",".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs",".opencode/skills/system-deep-loop/runtime/scripts/reduce-state.cjs",".opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs",".opencode/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs",".opencode/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs",".opencode/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs",".opencode/skills/system-deep-loop/runtime/scripts/lib/cli-guards.cjs",".opencode/skills/system-deep-loop/runtime/references/script-interface-contract.md"]}

## Summary
I inspected 18 runtime CLI and adapter implementations plus their interface documentation and tests. The strongest risks are malformed arguments being silently defaulted, misclassified, or applied to the wrong output directory. Fanout merge also accepts context mode while using research artifact names. Several usage surfaces remain inconsistent with the supported command and loop modes.

## Findings
- [P1] F-032-01 Malformed query bounds return success with incorrect data @ .opencode/skills/system-deep-loop/runtime/scripts/query.cjs:100
  - evidence: `limit` is computed with `Number(args.limit || 50)` and no finite/integer validation; `--limit nope` produces `NaN`, which is passed to array slicing while the script still emits status ok. `maxDepth` repeats the same pattern at lines 131 and 218.
  - recommendation: Validate numeric options before opening the database and return INPUT_VALIDATION with exit code 3 for non-finite or invalid values.
- [P1] F-032-02 Invalid fanout schemas are reported as generic script failures @ .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2062
  - evidence: `parseFanoutConfig(rawConfig)` throws `ExecutorConfigError`, but that error has no `code`; the final handler delegates to `classifyExitCode`, which maps only INPUT_VALIDATION to 3 and otherwise returns 1/SCRIPT_ERROR.
  - recommendation: Wrap configuration-schema failures as INPUT_VALIDATION or teach the shared classifier to recognize ExecutorConfigError.
- [P1] F-032-03 Misspelled reducer flags silently redirect writes @ .opencode/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2181
  - evidence: The CLI searches only for an exact `--artifact-dir`, filters all flag-looking tokens out of positional arguments, and ignores unknown flags and extra positionals. A typo such as `--artifcat-dir <path>` therefore leaves `artifactDir` undefined and writes to the default artifact root while exiting successfully.
  - recommendation: Use a strict parser with an allowlist, required values, and rejection of unknown flags or extra positional arguments before invoking the reducer.
- [P1] F-032-04 Missing or unreadable event files produce SCRIPT_ERROR instead of input validation @ .opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs:131
  - evidence: A valueless `--events` becomes boolean `true`; `readEvents` then calls `path.resolve(true)`, and a nonexistent path throws ENOENT. Neither error is converted to INPUT_VALIDATION, so the catch path returns exit 1 instead of the documented input-error code 3.
  - recommendation: Require a string value during argument parsing and translate file-read failures for user-supplied event paths into structured INPUT_VALIDATION errors.
- [P1] F-032-05 Context merge mode silently reads research artifacts @ .opencode/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:1097
  - evidence: The CLI accepts `context` at line 1061, but selects `findings-registry.json`, `deep-research-findings-registry.json`, and `deep-research-state.jsonl`, then calls `mergeResearchRegistries` at line 1146. A context tree can therefore return success with missing or misinterpreted research-shaped output.
  - recommendation: Reject context with INPUT_VALIDATION until a context-specific artifact map exists, or implement a dedicated context merge path.
- [P2] F-032-06 verify-iteration help advertises an unsupported loop type @ .opencode/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs:178
  - evidence: Help lists `review|research|context|alignment`, but `LEAF_BY_LOOP` contains only review, research, and alignment. Passing `--loop-type context` is rejected at line 182.
  - recommendation: Generate usage text from LEAF_BY_LOOP or add actual context support.
- [P2] F-032-07 Command renderer help omits a supported command @ .opencode/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs:216
  - evidence: `COMMANDS` includes `deep/alignment` at lines 33-37, but `printHelp()` lists only ai-council, review, and research.
  - recommendation: Generate the command list dynamically from Object.keys(COMMANDS) so help cannot drift.

## Leaf output (verbatim JSON)
```json
{
  "iteration": 32,
  "dimension": "maintainability",
  "summary": "I inspected 18 runtime CLI and adapter implementations plus their interface documentation and tests. The strongest risks are malformed arguments being silently defaulted, misclassified, or applied to the wrong output directory. Fanout merge also accepts context mode while using research artifact names. Several usage surfaces remain inconsistent with the supported command and loop modes.",
  "findings": [
    {
      "severity": "P1",
      "dimension": "maintainability",
      "title": "Malformed query bounds return success with incorrect data",
      "file": ".opencode/skills/system-deep-loop/runtime/scripts/query.cjs",
      "line": 100,
      "evidence": "`limit` is computed with `Number(args.limit || 50)` and no finite/integer validation; `--limit nope` produces `NaN`, which is passed to array slicing while the script still emits status ok. `maxDepth` repeats the same pattern at lines 131 and 218.",
      "recommendation": "Validate numeric options before opening the database and return INPUT_VALIDATION with exit code 3 for non-finite or invalid values."
    },
    {
      "severity": "P1",
      "dimension": "maintainability",
      "title": "Invalid fanout schemas are reported as generic script failures",
      "file": ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs",
      "line": 2062,
      "evidence": "`parseFanoutConfig(rawConfig)` throws `ExecutorConfigError`, but that error has no `code`; the final handler delegates to `classifyExitCode`, which maps only INPUT_VALIDATION to 3 and otherwise returns 1/SCRIPT_ERROR.",
      "recommendation": "Wrap configuration-schema failures as INPUT_VALIDATION or teach the shared classifier to recognize ExecutorConfigError."
    },
    {
      "severity": "P1",
      "dimension": "maintainability",
      "title": "Misspelled reducer flags silently redirect writes",
      "file": ".opencode/skills/system-deep-loop/runtime/scripts/reduce-state.cjs",
      "line": 2181,
      "evidence": "The CLI searches only for an exact `--artifact-dir`, filters all flag-looking tokens out of positional arguments, and ignores unknown flags and extra positionals. A typo such as `--artifcat-dir <path>` therefore leaves `artifactDir` undefined and writes to the default artifact root while exiting successfully.",
      "recommendation": "Use a strict parser with an allowlist, required values, and rejection of unknown flags or extra positional arguments before invoking the reducer."
    },
    {
      "severity": "P1",
      "dimension": "maintainability",
      "title": "Missing or unreadable event files produce SCRIPT_ERROR instead of input validation",
      "file": ".opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs",
      "line": 131,
      "evidence": "A valueless `--events` becomes boolean `true`; `readEvents` then calls `path.resolve(true)`, and a nonexistent path throws ENOENT. Neither error is converted to INPUT_VALIDATION, so the catch path returns exit 1 instead of the documented input-error code 3.",
      "recommendation": "Require a string value during argument parsing and translate file-read failures for user-supplied event paths into structured INPUT_VALIDATION errors."
    },
    {
      "severity": "P1",
      "dimension": "maintainability",
      "title": "Context merge mode silently reads research artifacts",
      "file": ".opencode/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs",
      "line": 1097,
      "evidence": "The CLI accepts `context` at line 1061, but selects `findings-registry.json`, `deep-research-findings-registry.json`, and `deep-research-state.jsonl`, then calls `mergeResearchRegistries` at line 1146. A context tree can therefore return success with missing or misinterpreted research-shaped output.",
      "recommendation": "Reject context with INPUT_VALIDATION until a context-specific artifact map exists, or implement a dedicated context merge path."
    },
    {
      "severity": "P2",
      "dimension": "maintainability",
      "title": "verify-iteration help advertises an unsupported loop type",
      "file": ".opencode/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs",
      "line": 178,
      "evidence": "Help lists `review|research|context|alignment`, but `LEAF_BY_LOOP` contains only review, research, and alignment. Passing `--loop-type context` is rejected at line 182.",
      "recommendation": "Generate usage text from LEAF_BY_LOOP or add actual context support."
    },
    {
      "severity": "P2",
      "dimension": "maintainability",
      "title": "Command renderer help omits a supported command",
      "file": ".opencode/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs",
      "line": 216,
      "evidence": "`COMMANDS` includes `deep/alignment` at lines 33-37, but `printHelp()` lists only ai-council, review, and research.",
      "recommendation": "Generate the command list dynamically from Object.keys(COMMANDS) so help cannot drift."
    }
  ],
  "refutations": [
    {
      "id": "F-030-02",
      "verdict": "confirmed",
      "reason": "The inspected playbook still prescribes `cd .opencode/skills/runtime/`, while the runtime is located under `.opencode/skills/system-deep-loop/runtime/`; the stale path appears at coverage-graph-fuzzy-merge.md:45."
    }
  ],
  "coverage": {
    "filesExamined": 18,
    "keyPaths": [
      ".opencode/skills/system-deep-loop/runtime/scripts/query.cjs",
      ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs",
      ".opencode/skills/system-deep-loop/runtime/scripts/reduce-state.cjs",
      ".opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs",
      ".opencode/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs",
      ".opencode/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs",
      ".opencode/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs",
      ".opencode/skills/system-deep-loop/runtime/scripts/lib/cli-guards.cjs",
      ".opencode/skills/system-deep-loop/runtime/references/script-interface-contract.md"
    ]
  }
}
```