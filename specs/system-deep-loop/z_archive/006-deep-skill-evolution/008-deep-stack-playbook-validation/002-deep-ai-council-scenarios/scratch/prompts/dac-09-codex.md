Council-graph value-comparison adjudicator for deep-ai-council (DAC-027..032). Repo root (cwd): /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public. Sandbox is READ-ONLY — read files and run read-only commands (rg/cat/sed); do NOT attempt to write or seed databases.

Scenarios (read each in full) under .opencode/skills/deep-ai-council/manual_testing_playbook/09--council-graph-value-comparison/:
  001-unresolved-disagreement-triage-graph-vs-baseline.md           (DAC-027)
  002-decision-provenance-audit-graph-vs-baseline.md                (DAC-028)
  003-convergence-safety-under-critical-disagreement-graph-vs-baseline.md (DAC-029)
  004-stalled-council-blocker-ranking-graph-vs-baseline.md          (DAC-030)
  005-hot-topic-discovery-graph-vs-baseline.md                      (DAC-031)
  006-mid-run-interruption-recovery-graph-vs-baseline.md            (DAC-032)

Each scenario compares a no-graph baseline (operator reads many ai-council/** artifacts) vs a with-graph workflow (one runtime query CLI call). It PASSES iff both return the SAME answer set AND the graph uses materially fewer reads (>=10x).

Deterministic anchors (READ these; do not run vitest — it may write temp DBs):
  - .opencode/skills/deep-loop-runtime/tests/integration/council-graph-value-scenarios.vitest.ts  (tests named "DAC-0NN graph beats no-graph baseline")
  - .opencode/skills/deep-loop-runtime/tests/council-graph-value-report.json  (measured baseline-vs-graph read ratios per scenario)
Note (independent fact from the orchestrator): the full council-graph vitest suite was just run and ALL 21 tests passed, including council-graph-value-scenarios.vitest.ts. Use the report.json measured ratios + the test assertions as your evidence.

Task — for each DAC-027..032:
1. Read the scenario's Expected + Pass/Fail.
2. Read the matching vitest test assertion AND the value-report.json entry for that scenario id.
3. Judge: PASS if the report/test show the with-graph workflow returns the documented answer set AND achieves >=10x fewer reads than the baseline; PARTIAL if the value holds but evidence is incomplete; FAIL if answers diverge, ratio <10x, or the entry is missing.
4. Cite the report ratio + the test name per verdict.

Use sequential reasoning internally. Return ONLY:

### BATCH VERDICTS: deep-ai-council/09-value-comparison
| Scenario ID | Verdict | report ratio (baseline reads : graph calls) | matching vitest test | Evidence excerpt (<=6 lines) | Notes |
|---|---|---|---|---|---|
(one row each DAC-027, DAC-028, DAC-029, DAC-030, DAC-031, DAC-032)

### BATCH SUMMARY: <p> PASS / <pa> PARTIAL / <f> FAIL / <s> SKIP
