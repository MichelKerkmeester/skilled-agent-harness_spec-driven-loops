---
title: "240 -- Core Workflow Infrastructure"
description: "This scenario validates core workflow infrastructure for `240`. It focuses on confirming the shared indexing, post-save review, scoring, and workflow helper modules through targeted regression suites."
version: 3.6.0.12
id: tooling-and-scripts-core-workflow-infrastructure
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 240 -- Core Workflow Infrastructure

## 1. OVERVIEW

This scenario validates core workflow infrastructure for `240`. It focuses on confirming the shared indexing, post-save review, scoring, and workflow helper modules through targeted regression suites.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm the shared workflow layer remains stable across indexing, review, scoring, and end-to-end workflow tests.
- Real user request: `Please validate Core Workflow Infrastructure against cd .opencode/skills/system-spec-kit/scripts && npx vitest run tests/memory-indexer-weighting.vitest.ts tests/post-save-review.vitest.ts tests/quality-scorer-calibration.vitest.ts tests/generate-context-cli-authority.vitest.ts tests/workflow-e2e.vitest.ts and tell me whether the expected signals are present: all targeted Vitest suites pass; post-save review assertions stay intact; indexing/scoring regressions do not fail.`
- Prompt: `Validate Core Workflow Infrastructure against cd .opencode/skills/system-spec-kit/scripts && npx vitest run tests/memory-indexer-weighting.vitest.ts tests/post-save-review.vitest.ts tests/quality-scorer-calibration.vitest.ts tests/generate-context-cli-authority.vitest.ts tests/workflow-e2e.vitest.ts and report cited pass/fail evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: all targeted Vitest suites pass; post-save review assertions stay intact; indexing/scoring regressions do not fail
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the shared workflow module suites pass together without unexpected skips or failures

---

## 3. TEST EXECUTION

### Prompt

```
Validate Core Workflow Infrastructure against cd .opencode/skills/system-spec-kit/scripts && npx vitest run tests/memory-indexer-weighting.vitest.ts tests/post-save-review.vitest.ts tests/quality-scorer-calibration.vitest.ts tests/generate-context-cli-authority.vitest.ts tests/workflow-e2e.vitest.ts and report cited pass/fail evidence.
```

### Commands

1. `cd .opencode/skills/system-spec-kit/scripts && npx vitest run tests/memory-indexer-weighting.vitest.ts tests/post-save-review.vitest.ts tests/quality-scorer-calibration.vitest.ts tests/generate-context-cli-authority.vitest.ts tests/workflow-e2e.vitest.ts`

### Expected

All targeted Vitest suites pass with no failing assertions across weighting, review, scoring, authority, or workflow seams

### Evidence

Command executed from `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/scripts`:

```text
npx vitest run tests/memory-indexer-weighting.vitest.ts tests/post-save-review.vitest.ts tests/quality-scorer-calibration.vitest.ts tests/generate-context-cli-authority.vitest.ts tests/workflow-e2e.vitest.ts
```

Observed Vitest transcript:

```text
 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/scripts

{"timestamp":"2026-07-02T21:00:39.362Z","level":"info","message":"memory_metric","metric_name":"memory_save_overview_length_histogram","metric_value":0,"labels":{"input_mode":"file","save_mode":"json"}}
{"timestamp":"2026-07-02T21:00:39.364Z","level":"info","message":"memory_metric","metric_name":"memory_save_overview_length_histogram","metric_value":0,"labels":{"input_mode":"file","save_mode":"json"}}
(node:95217) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
(node:95217) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 beforeExit listeners added to [process]. MaxListeners is 10. Use emitter.setMaxListeners() to increase limit

 Test Files  3 passed (3)
      Tests  24 passed (24)
   Start at  23:00:39
   Duration  1.71s (transform 853ms, setup 0ms, import 214ms, tests 1.59s, environment 0ms)
```

Target file presence check for the five command arguments found only these three files:

```text
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/scripts/tests/quality-scorer-calibration.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/scripts/tests/post-save-review.vitest.ts
```

Missing command targets in the current repo state:

```text
tests/memory-indexer-weighting.vitest.ts
tests/workflow-e2e.vitest.ts
```

### Pass / Fail

- **BLOCKED**: the Vitest command exited successfully with `Test Files  3 passed (3)` and `Tests  24 passed (24)`, but the scenario expects all five targeted suites to be present and pass; `tests/memory-indexer-weighting.vitest.ts` and `tests/workflow-e2e.vitest.ts` are missing in the current repo state, so the full expected signal cannot be verified.

### Failure Triage

Inspect `scripts/core/memory-indexer.ts`, `post-save-review.ts`, `quality-scorer.ts`, `config.ts`, and workflow entrypoints if any targeted suite fails

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [tooling_and_scripts/core_workflow_infrastructure.md](../../feature_catalog/tooling_and_scripts/core_workflow_infrastructure.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 240
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `tooling_and_scripts/core_workflow_infrastructure.md`
