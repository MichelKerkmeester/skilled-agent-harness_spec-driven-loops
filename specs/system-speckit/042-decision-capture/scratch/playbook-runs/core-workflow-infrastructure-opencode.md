# core-workflow-infrastructure on OpenCode

- CLI: OpenCode
- Model: llmgateway/deepseek-v4.1-flash-1017#max
- Date: 2026-11-01
- Scenario: .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/core-workflow-infrastructure.md
- Exact prompt: `Validate Core Workflow Infrastructure against cd .skilled/skills/system-spec-kit/runtime/cli && npx vitest run tests/post-save-review.vitest.ts tests/quality-scorer-calibration.vitest.ts tests/generate-context-cli-authority.vitest.ts and report cited pass/fail evidence.`
- Verdict: **FAIL**

## Result

The command as written exits 1 without running a single test. From `runtime/cli`, Vitest selects the parent `runtime/vitest.config.ts`, whose `include` is `runtime/tests/**/*.{vitest,test}.ts` and whose `exclude` is `runtime/cli/**`, so it reports `No test files found, exiting with code 1` and lists the three requested filters as unmatched. The expected signal "all targeted Vitest suites pass" is therefore not observable through the documented command. A supplementary run that adds the package's own `--config ../../vitest.config.ts --project cli` does pass: 3 test files and 24 tests passed, exit 0, so the suites themselves are healthy and the failure is in the scenario command's config resolution.

## Evidence

```text
$ cd /Users/michelkerkmeester/MEGA/Development/Skilled/.skilled/skills/system-spec-kit/runtime/cli && npx vitest run tests/post-save-review.vitest.ts tests/quality-scorer-calibration.vitest.ts tests/generate-context-cli-authority.vitest.ts
exit=1
 RUN  v4.1.11 /Users/michelkerkmeester/MEGA/Development/Skilled/.skilled/skills/system-spec-kit
No test files found, exiting with code 1
filter: tests/post-save-review.vitest.ts, tests/quality-scorer-calibration.vitest.ts, tests/generate-context-cli-authority.vitest.ts
include: runtime/tests/**/*.{vitest,test}.ts, ../system-deep-loop/runtime/tests/**/*.vitest.ts
exclude:  runtime/cli/**

Supplementary run with the CLI package's own project config:
$ cd .skilled/skills/system-spec-kit/runtime/cli && npx vitest run --config ../../vitest.config.ts --project cli tests/post-save-review.vitest.ts tests/quality-scorer-calibration.vitest.ts tests/generate-context-cli-authority.vitest.ts
exit=0
 RUN  v4.1.11 /Users/michelkerkmeester/MEGA/Development/Skilled/.skilled/skills/system-spec-kit/runtime/cli
 Test Files  3 passed (3)
      Tests  24 passed (24)
   Start at  14:34:16
   Duration  643ms
```
