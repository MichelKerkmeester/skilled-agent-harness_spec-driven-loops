Deep-agent-improvement reducer + end-to-end executor (RD-017..019 + E2E-020..024, 8 scenarios). Repo root (cwd): /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public. You have --sandbox workspace-write.

GUARDRAIL: write ONLY under /tmp or disposable copies. Do NOT modify repo files; read freely. Scenarios run deterministic node .cjs scripts + python3/jq assertions.

Context: the deep-agent-improvement vitest suite (8 files / 99 tests) PASSES. The E2E scenarios drive `/deep:start-agent-improvement-loop` (a slash command needing an AI runtime). If a scenario's loop step cannot run non-interactively here, run its VERIFICATION block (node reduce-state.cjs / mutation-coverage.cjs / trade-off-detector.cjs / candidate-lineage.cjs + python3/jq asserts) against any existing/fixture runtime artifacts, AND inspect the cited runtime source + matching vitest test. Verdict PASS if the signal is proven, PARTIAL if only the live-loop step is blocked (proven-via-helper/schema), SKIP only on a concrete blocker. "UNAUTOMATABLE" is NOT valid. Prefer copying any existing runtime/fixture dirs into /tmp and running the reducer/consumers there.

Read EVERY `NNN-*.md` (numeric order) in BOTH:
- .opencode/skills/deep-agent-improvement/manual_testing_playbook/05--reducer-dimensions/   (017-no-dimensions, 018-with-dimensions, 019-plateau-detection -> RD-017,RD-018,RD-019)
- .opencode/skills/deep-agent-improvement/manual_testing_playbook/06--end-to-end-loop/       (020-full-pipeline, 021-any-agent, 022-mutation-coverage-graph-tracking, 023-trade-off-detection, 024-candidate-lineage -> E2E-020..E2E-024)

For each scenario: run the documented command sequence (or its runnable verification portion) + python3/jq asserts; capture exit codes; verdict PASS/PARTIAL/FAIL/SKIP with the decisive command + evidence excerpt + exit code. Note the matching vitest test where relevant (reduce-state / mutation-coverage / trade-off-detector / candidate-lineage .vitest.ts). Use available fixtures under .opencode/skills/deep-agent-improvement/scripts/tests/fixtures/ when a live loop run is required but not runnable.

Use sequential reasoning internally. Return ONLY:

### BATCH VERDICTS: deep-agent-improvement/05-reducer+06-e2e
| Scenario ID | Verdict | Decisive command | Evidence excerpt (<=8 lines) | exit code | Notes |
|---|---|---|---|---|---|
(one row each: RD-017, RD-018, RD-019, E2E-020, E2E-021, E2E-022, E2E-023, E2E-024)

### BATCH SUMMARY: <p> PASS / <pa> PARTIAL / <f> FAIL / <s> SKIP
