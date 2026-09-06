---
title: "240 -- Core Workflow Infrastructure"
description: "This scenario validates core workflow infrastructure for `240`. It focuses on confirming the shared post-save review, scoring, and workflow helper modules through targeted regression suites."
version: 3.6.0.12
id: tooling-and-scripts-core-workflow-infrastructure
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 240 -- Core Workflow Infrastructure

## 1. OVERVIEW

This scenario validates core workflow infrastructure for `240`. It focuses on confirming the shared post-save review, scoring, and workflow helper modules through targeted regression suites.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm the shared workflow layer remains stable across review, scoring, and CLI authority tests.
- Real user request: `Please validate Core Workflow Infrastructure against cd .opencode/skills/system-spec-kit/runtime/cli && npx vitest run tests/post-save-review.vitest.ts tests/quality-scorer-calibration.vitest.ts tests/generate-context-cli-authority.vitest.ts and tell me whether the expected signals are present: all targeted Vitest suites pass; post-save review assertions stay intact; scoring and trigger-index freshness regressions do not fail.`
- Prompt: `Validate Core Workflow Infrastructure against cd .opencode/skills/system-spec-kit/runtime/cli && npx vitest run tests/post-save-review.vitest.ts tests/quality-scorer-calibration.vitest.ts tests/generate-context-cli-authority.vitest.ts and report cited pass/fail evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: all targeted Vitest suites pass; post-save review assertions stay intact; scoring and trigger-index freshness regressions do not fail
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the shared workflow module suites pass together without unexpected skips or failures

---

## 3. TEST EXECUTION

### Prompt

```
Validate Core Workflow Infrastructure against cd .opencode/skills/system-spec-kit/runtime/cli && npx vitest run tests/post-save-review.vitest.ts tests/quality-scorer-calibration.vitest.ts tests/generate-context-cli-authority.vitest.ts and report cited pass/fail evidence.
```

### Commands

1. `cd .opencode/skills/system-spec-kit/runtime/cli && npx vitest run tests/post-save-review.vitest.ts tests/quality-scorer-calibration.vitest.ts tests/generate-context-cli-authority.vitest.ts`

### Expected

All targeted Vitest suites pass with no failing assertions across weighting, review, scoring, authority, or workflow seams

### Evidence

Capture, for every step in the Commands sequence above:

- The exact command or tool call issued, its full output, and its exit status.
- The output lines that carry each expected signal listed in section 3.
- Any deviation from the expected result, quoted verbatim from the output.
- The resolved path of every file or log the run reads or writes.

### Pass / Fail

- **Pass**: The shared workflow module suites pass together without unexpected skips or failures.
- **Fail**: The Pass condition above is not met, or any command in the sequence errors unexpectedly.

### Failure Triage

Inspect `runtime/cli/core/memory-indexer.ts`, `post-save-review.ts`, `quality-scorer.ts`, `config.ts`, and workflow entrypoints if any targeted suite fails

---

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [tooling-and-scripts/core-workflow-infrastructure.md](../../feature-catalog/tooling-and-scripts/core-workflow-infrastructure.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 240
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `tooling-and-scripts/core-workflow-infrastructure.md`
