
### 5D-051 | Unknown Grader Exit and Zero-Call D4 Census

#### Description
`run-benchmark.cjs` refuses an unknown `--grader` value before any profile loads, and `score-d4-agreement.cjs` prints its census without a model call and skips a stub backend by name.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, validate that an unknown grader kind stops the benchmark runner at startup, that the D4 agreement census makes no model call and that a stub Deem backend is skipped by name. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.

Expected signals: The runner exits 2 and names `'jev'` with the usage line. The plain census exits 0 with `allowlist: 0 of 21` and `stop: fewer than 30 labeled outputs` and calls no stub. The `--deem` run adds only `deem arm skipped: stub backend`.

#### Test Execution
> **Feature File:** [5D-051](../manual-testing-playbook/five-d-scorer/unknown-grader-and-d4-census.md)
