---
title: "JEV-018 -- A jev mention in prose is not a dispatch"
description: "Confirm the dispatch audit does not resolve jev text that no shell would execute, for `JEV-018`."
version: 1.0.0.1
---

# JEV-018 -- A jev mention in prose is not a dispatch

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `JEV-018`.

---

## 1. OVERVIEW

The counterpart to JEV-017: commands that merely contain the string must resolve to nothing. An `echo`, a `grep`, a heredoc and a `node` log of the same text are the probes.

### Why This Matters

The shape list matches its pattern anywhere in the command, so a command that contains a dispatch reads as one — which is how a grep for the shape gets refused as though it were the shape. The tokenizer decides, and the jev rows must not regress it.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `JEV-018` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a quoted, grepped, heredoc'd or logged jev string resolves to no packet.
- Real user request: `Confirm that merely mentioning jev in a command does not trigger the packet.`
- Prompt: `describe the json value in this file`
- Expected execution process: run the command sequence in §3 from the repository root, read the runner's summary line, then judge the result against the pass/fail criteria below.
- Expected signals: the suite reports every test passing; every prose, grep, heredoc and log form resolves to `null`; the alias-narrowness reply expected by the routing goldens stays a deferral.
- Evidence: The test file path, the runner command, and the pass and fail counts from the summary line.
- Desired user-visible outcome: the count of do-not-govern shapes that resolved to nothing.
- Pass/fail: PASS when the suite reports zero failures and every prose shape resolves to no packet; FAIL when a quoted or logged string resolves to `cli-jev`; SKIP only when the runner cannot start — the missing runner is the blocker.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm the global preconditions in the root playbook, including the repository's installed dependencies.
3. Run the command sequence below exactly as written, from the repository root.
4. Read the summary line and confirm the do-not-govern assertions ran.
5. Judge the result against the pass/fail criteria and record the verdict with its evidence.

### Commands

```bash
npx vitest run .skilled/hooks/dispatch/lib/dispatch-audit.test.mjs
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| JEV-018 | Prose false positive | Confirm a quoted, grepped, heredoc'd or logged jev string resolves to no packet | `describe the json value in this file` | 1. `npx vitest run .skilled/hooks/dispatch/lib/dispatch-audit.test.mjs` | The suite reports every test passing; every prose, grep, heredoc and log form resolves to `null`; the alias-narrowness reply stays a deferral | The test file path, the runner command, and the pass and fail counts from the summary line | PASS when the suite reports zero failures and every prose shape resolves to no packet; FAIL when a quoted or logged string resolves to `cli-jev`; SKIP only when the runner cannot start, naming the missing runner as the blocker | A prose shape that resolves to the packet is a false positive that will block an unrelated command; narrow the row's pattern rather than the tokenizer. If the runner cannot start, install dependencies rather than editing the test |

### Recorded Result

Observed during phase 003: the suite ran the prose, grep, heredoc and log shapes alongside the command shapes and reported no failures. Verdict PASS.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `dispatch-guards/prose-mention-is-not-a-dispatch.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [dispatch-guards.md](../../feature-catalog/dispatch-guards/dispatch-guards.md) | The audit's recognition rule and its false-positive history |
| [transport-classification.md](../../feature-catalog/transport-classification/transport-classification.md) | The alias-narrowness replay this scenario shares a prompt with |

---

## 5. SOURCE METADATA

- Group: Dispatch Guards
- Playbook ID: JEV-018
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `dispatch-guards/prose-mention-is-not-a-dispatch.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
