Deep-agent-improvement script-invocation executor (5D-010/012/013, BI-014/015). Repo root (cwd): /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public. You have --sandbox workspace-write.

GUARDRAIL: write ONLY under /tmp or disposable spec folders the scenarios name. Do NOT modify repo files; read freely. Scenarios are deterministic `node .opencode/skills/deep-agent-improvement/scripts/*.cjs` runs piped to `python3` assertions + exit codes — RUN them for real.

Scenarios (read each in full) under .opencode/skills/deep-agent-improvement/manual_testing_playbook/:
  03--5d-scorer/   -> 5D-010 (dynamic 5D scoring on orchestrate agent), 5D-012 (dimension details array), 5D-013 (missing candidate -> infra_failure, not crash)
  04--benchmark-integration/ -> BI-014 (benchmark without integration report -> graceful), BI-015 (benchmark with integration report)

For each scenario: run the documented "Exact Command Sequence" (node ...cjs + python3 assertion), capture stdout + exit code, compare to Expected Signals + Pass/Fail Criteria, verdict PASS/PARTIAL/FAIL/SKIP with the decisive command + evidence + exit code.

Use sequential reasoning internally. Return ONLY:

### BATCH VERDICTS: deep-agent-improvement/03-04
| Scenario ID | Verdict | Decisive command | Evidence excerpt (<=8 lines) | exit code | Notes |
|---|---|---|---|---|---|
(one row each 5D-010, 5D-012, 5D-013, BI-014, BI-015)

### BATCH SUMMARY: <p> PASS / <pa> PARTIAL / <f> FAIL / <s> SKIP
