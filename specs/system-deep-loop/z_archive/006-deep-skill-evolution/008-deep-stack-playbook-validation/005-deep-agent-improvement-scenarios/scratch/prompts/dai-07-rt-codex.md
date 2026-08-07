Deep-agent-improvement runtime-truth executor (RT-025..034, CRITICAL category). Repo root (cwd): /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public. You have --sandbox workspace-write.

GUARDRAIL: write ONLY under /tmp or disposable spec folders. Do NOT modify repo files; read freely. Scenarios run deterministic node .cjs scripts + python3 assertions.

Context: the deep-agent-improvement vitest suite (8 files / 99 tests) PASSES, covering runtime-truth behaviors. Some RT scenarios drive `/deep:start-agent-improvement-loop` (a slash command needing an AI runtime). If a scenario's loop step cannot run non-interactively here, run its VERIFICATION block (node improvement-journal.cjs / runtime scripts + python3 asserts) against any produced/existing journal, AND inspect the cited runtime source + matching vitest test; verdict PASS if the runtime-truth signal is proven, PARTIAL if only the loop step is blocked (verification-via-schema), SKIP only on a concrete blocker. "UNAUTOMATABLE" is NOT valid.

Read EVERY `NNN-*.md` (numeric order) in: .opencode/skills/deep-agent-improvement/manual_testing_playbook/07--runtime-truth/
IDs RT-025..034: stop-reason taxonomy, audit journal lifecycle, fresh-session continuation, legal-stop gate blocking, benchmark stability, dimension trajectory, parallel-candidates default, journal wiring boundary, insufficient-sample propagation, replay consumer artifact.

For each RT-NNN: run the documented command sequence (or its runnable verification portion) + python3 asserts; capture exit codes; verdict PASS/PARTIAL/FAIL/SKIP with the decisive command + evidence + exit code. Note the matching vitest test where relevant.

Use sequential reasoning internally. Return ONLY:

### BATCH VERDICTS: deep-agent-improvement/07-runtime-truth
| Scenario ID | Verdict | Decisive command | Evidence excerpt (<=8 lines) | exit code | Notes |
|---|---|---|---|---|---|
(one row each RT-025..RT-034)

### BATCH SUMMARY: <p> PASS / <pa> PARTIAL / <f> FAIL / <s> SKIP
