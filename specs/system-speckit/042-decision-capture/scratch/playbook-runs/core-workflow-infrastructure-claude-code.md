# core-workflow-infrastructure on Claude Code

- CLI: Claude Code, native (this orchestrator session). cli-claude-code refuses self-invocation because CLAUDECODE=1 is set, and its contract routes a Claude Code run to native execution.
- Model: claude-opus-5-5
- Date: 2026-11-01
- Scenario: .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/core-workflow-infrastructure.md
- Exact prompt: `Validate Core Workflow Infrastructure against cd .skilled/skills/system-spec-kit/runtime/cli && npx vitest run tests/post-save-review.vitest.ts tests/quality-scorer-calibration.vitest.ts tests/generate-context-cli-authority.vitest.ts and report cited pass/fail evidence.`
- Verdict: **FAIL**

## Result

The scenario command exits 1 with "No test files found": npx vitest from runtime/cli picks the package root config, whose root project excludes runtime/cli/**. The three suites pass when run under the cli project, so the defect is the scenario command, not the code.

## Evidence

```text
RUN  v4.1.11 /Users/michelkerkmeester/MEGA/Development/Skilled/.skilled/skills/system-spec-kit

No test files found, exiting with code 1

filter: tests/post-save-review.vitest.ts, tests/quality-scorer-calibration.vitest.ts, tests/generate-context-cli-authority.vitest.ts
include: runtime/tests/**/*.{vitest,test}.ts, ../system-deep-loop/runtime/tests/**/*.{vitest,test}.ts
exclude:  runtime/cli/**


Re-run under the cli project for comparison (not the scenario command): ../../node_modules/.bin/vitest run --config ../../vitest.config.ts --project cli <same 3 files> -> Test Files 3 passed, Tests 24 passed.
```
