---
title: "Command-Flow Stress Tests: deep-review CP-05x scenarios"
description: "Sandboxed scenarios validating the /deep:review command-level entrypoint, write boundary and leaf refusal behavior."
version: 1.11.0.1
---

# Command-Flow Stress Tests

---

## 1. OVERVIEW

Category 15 of the `deep-review` manual testing playbook, six `CP-0xx` scenarios. Each scenario enters through `/deep:review` and checks a command-owned behavior: setup binding, resource-map coverage, the three-artifact iteration contract, synthesis and save boundaries, nested-dispatch refusal or the write boundary around reducer-owned files. All scenarios run under `/tmp/cp-0xx-sandbox/` and `/tmp/cp-0xx-spec/`.

---

## 2. SCOPE

Six scenarios, CP-052 to CP-057, plus the sandbox setup script. All six enter through `/deep:review`. They check command-owned behavior: setup binding, resource-map coverage, the three-artifact iteration contract, synthesis and save boundaries, nested-dispatch refusal and the write boundary around reducer-owned files.

---

## 3. SCENARIO CONTRACT

Each scenario is one Markdown file named for its topic. Its sections follow the per-feature order: OVERVIEW, SCENARIO CONTRACT, TEST EXECUTION, SOURCE FILES and SOURCE METADATA. The table lists each file with its CP ID and the claim it proves.

| File | Scenario |
|------|----------|
| `setup-yaml-handoff.md` | CP-052. Proves target, mode, dimensions, spec folder, max iterations and convergence bind before the auto YAML workflow loads |
| `three-artifact-iteration-contract.md` | CP-053. Proves a valid iteration leaves iteration markdown, state-log JSONL and per-iteration delta JSONL, not a transcript summary |
| `resource-map-coverage-gate.md` | CP-054. Proves a spec's `resource-map.md` is treated as a first-class audit input |
| `synthesis-save-boundary.md` | CP-055. Proves synthesis writes reducer-owned review artifacts and routes continuity through `generate-context.js`, not retired memory paths |
| `leaf-only-nested-dispatch-refusal.md` | CP-056. Proves the `@deep-review` body refuses a request to spawn another reviewer |
| `write-boundary-reducer-owned-files.md` | CP-057. Proves `@deep-review` refuses to "fix" the review target or reducer-owned files during review |
| `setup-cp-sandbox.sh` | Builds the shared `/tmp/cp-deep-review-sandbox` fixture tree these scenarios run against |

---

## 4. TEST ENVIRONMENTS

Scenarios run under `/tmp/cp-0xx-sandbox/` and `/tmp/cp-0xx-spec/`, against a synthetic spec folder. Provision the shared fixture tree with `setup-cp-sandbox.sh` before the first run, as the root playbook index describes. The script builds `/tmp/cp-deep-review-sandbox` by default and takes `--sandbox-dir PATH` to build it elsewhere.

---

## 5. TEST EXECUTION

Run each scenario's exact command sequence, which sits under TEST EXECUTION in its file. Record a `PASS`, `FAIL` or `SKIP` verdict with the evidence another operator needs to reproduce it. A `SKIP` must name a documented sandbox blocker. The execution and evidence policy is in [`../manual-testing-playbook.md`](../manual-testing-playbook.md).

---

## 6. SOURCE METADATA

### See Also

- Root playbook index: [`../manual-testing-playbook.md`](../manual-testing-playbook.md)
- Command router: `.skilled/commands/deep/review.md`
