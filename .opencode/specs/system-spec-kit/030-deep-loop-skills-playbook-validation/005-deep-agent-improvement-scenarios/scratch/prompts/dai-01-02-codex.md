Deep-agent-improvement script-invocation executor (IS-001..004, PG-005..008). Repo root (cwd): /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public. You have --sandbox workspace-write.

GUARDRAIL: write ONLY under /tmp or disposable spec folders the scenarios name. Do NOT modify repo files (.opencode/ etc.); read them freely. These scenarios are deterministic `node .opencode/skills/deep-agent-improvement/scripts/*.cjs` runs piped to `python3` JSON assertions, corroborated by exit codes — RUN them for real.

Scenarios (read each in full) under .opencode/skills/deep-agent-improvement/manual_testing_playbook/:
  01--integration-scanner/001-*.md  (IS-001: scan known agent debug)
  01--integration-scanner/002-*.md  (IS-002: scan missing/nonexistent agent)
  01--integration-scanner/003-*.md  (IS-003: scan diverse agent)
  01--integration-scanner/004-*.md  (IS-004: JSON output via --output flag)
  02--profile-generator/005-*.md     (PG-005: ALWAYS/NEVER rules extraction)
  02--profile-generator/006-*.md     (PG-006: OUTPUT VERIFICATION checklist extraction)
  02--profile-generator/007-*.md     (PG-007: inline NEVER rules fallback)
  02--profile-generator/008-*.md     (PG-008: profile JSON --output)

Each scenario's "## 3. TEST EXECUTION" table has an "Exact Command Sequence" (a `node ...cjs ...` command + a `python3 -c "..."` assertion) + "Expected Signals" + "Pass/Fail Criteria". For each ID: run the exact command sequence, run the python3 assertion, capture stdout + exit code, compare to Expected Signals, and verdict PASS/PARTIAL/FAIL/SKIP with the decisive command + evidence excerpt + exit code.

Use sequential reasoning internally. Return ONLY:

### BATCH VERDICTS: deep-agent-improvement/01-02
| Scenario ID | Verdict | Decisive command | Evidence excerpt (<=8 lines) | exit code | Notes |
|---|---|---|---|---|---|
(one row each IS-001, IS-002, IS-003, IS-004, PG-005, PG-006, PG-007, PG-008)

### BATCH SUMMARY: <p> PASS / <pa> PARTIAL / <f> FAIL / <s> SKIP
