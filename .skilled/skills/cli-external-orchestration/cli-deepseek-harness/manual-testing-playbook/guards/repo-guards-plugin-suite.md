---
title: "GRD-001 -- Repo-guards plugin suite"
description: "This scenario validates that the repo-guards plugin test suite passes with no adapter, policy or loader failure for `GRD-001`."
version: 1.0.0.0
---

# GRD-001 -- Repo-guards plugin suite

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `GRD-001`.

---

## 1. OVERVIEW

This scenario validates the bundle that carries the shared guard cores into a dsh child. It focuses on the adapter contracts, the per-adapter error policy and the anchored message loader.

### Why This Matters

The guards patch can load the bundle and still leave a broken adapter. The suite exercises each adapter against fixtures, including the deny and fail-open paths. A passing suite is the evidence that a guard verdict has a tested core behind it. It does not prove a live model tool call, because no keyed run has happened.

---

## 2. SCENARIO CONTRACT

- Objective: Prove every repo-guards adapter test passes on the current tree.
- Real user request: `Run the guard plugin tests before we rely on the guards patch. I want to know whether every adapter still passes, including the error paths.`
- Prompt: `Run the repo-guards plugin test suite and tell me whether every adapter test passes. Do not change the plugin.`
- Expected execution process: Run the whole test directory from the repository root -> read the summary counts -> confirm zero failures and zero skipped tests -> confirm the exit code.
- Expected signals: The runner prints a test count, a pass count equal to that count, `fail 0` and a zero exit code. The suite covers the dispatch, spec-gate, completion, task-dispatch, post-edit, MCP route, classifier, goal, session-start, prompt-advisor, git-preflight, git-message and message-loader paths.
- Desired user-visible outcome: A clear statement that the plugin suite passes, with the counts and exit code.
- Pass/fail: PASS if the suite exits `0` with `fail 0`. FAIL if any test fails, the runner cannot load the tests or the exit code is non-zero.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Run the test directory, not a single file, so a new adapter test is included.
2. Read the summary block at the end.
3. Confirm `fail 0` and the exit code.
4. Do not edit the plugin to make a test pass.

### Commands

```bash
node --test .dsh/plugins/repo-guards/tests/
```

### Recorded Result

- Verdict: `PASS`.
- Observed: exit `0`, 37 tests, 37 pass, 0 fail, 0 skipped, 0 todo.
- The bundle README and this run both report 37 tests. Grade on `fail 0`, not on a fixed number.
- The suite includes `mcp-route-guard.test.mjs` beside the main adapter suite.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| GRD-001 | Repo-guards plugin suite | Prove every adapter test passes | `Run the repo-guards plugin test suite and tell me whether every adapter test passes. Do not change the plugin.` | 1. `node --test .dsh/plugins/repo-guards/tests/` -> 2. read the summary block -> 3. record the pass, fail and skipped counts with the exit code | Step 1: exit `0`. Step 2: 37 tests, 37 pass, 0 fail, 0 skipped | The observed runner transcript with the summary counts and exit code | PASS if the suite exits `0` with `fail 0`. FAIL if any test fails or the runner cannot load the tests | 1. Read the first failing test name and its assertion. 2. Check whether a shared guard core export changed. 3. Run the suite from the repository root so the anchored loader resolves |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Verdict rules and evidence policy |
| `../../SKILL.md` | Guard delivery and the tested-core boundary |
| `../../references/guards-and-hooks.md` | Fourteen adapters, error policies and deferred adapters |
| `.dsh/plugins/repo-guards/README.md` | Adapter inventory, configuration and validation commands |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.dsh/plugins/repo-guards/index.mjs` | Registers the adapter set |
| `.dsh/plugins/repo-guards/adapters/` | Adapter implementations |
| `.dsh/plugins/repo-guards/tests/repo-guards.test.mjs` | Main adapter suite |
| `.dsh/plugins/repo-guards/tests/mcp-route-guard.test.mjs` | MCP route guard suite |

---

## 5. SOURCE METADATA

- Group: Guard Suites
- Playbook ID: GRD-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `guards/repo-guards-plugin-suite.md`
