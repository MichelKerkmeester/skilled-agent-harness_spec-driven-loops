---
title: "Command-Flow Stress Tests: deep-research CP-04x/05x scenarios"
description: "Sandboxed scenarios validating the /deep:research command-level entrypoint separately from the leaf iteration body."
version: 1.15.0.1
---

# Command-Flow Stress Tests

---

## 1. OVERVIEW

Category 07 of the `deep-research` manual testing playbook, six `CP-0xx` scenarios. Each scenario enters through `/deep:research` or `/deep:research:auto` and checks a command-owned behavior, setup binding, pause handling, spec writeback, resource-map toggling or leaf output contract, rather than research quality. All scenarios run under `/tmp/cp-0xx-sandbox/` and `/tmp/cp-0xx-spec/`.

---

## 2. SCOPE

Six scenarios, CP-046 to CP-051, plus the sandbox setup script. All six enter through `/deep:research` or `/deep:research:auto`. They check command-owned behavior: setup binding, pause handling, spec writeback, resource-map toggling and the leaf output contract. They do not grade research quality.

---

## 3. SCENARIO CONTRACT

Each scenario is one Markdown file named for its topic. Its sections follow the per-feature order: OVERVIEW, SCENARIO CONTRACT, TEST EXECUTION, SOURCE FILES and SOURCE METADATA. The table lists each file with its CP ID and the claim it proves.

| File | Scenario |
|------|----------|
| `setup-yaml-handoff.md` | CP-046. Proves setup inputs resolve before the auto YAML workflow loads |
| `spec-fence-writeback.md` | CP-047. Proves spec mutation stays inside the lock and the generated findings fence |
| `resource-map-toggle.md` | CP-048. Proves `--no-resource-map` is parsed and honored end to end |
| `pause-sentinel-halt.md` | CP-049. Proves a packet-local `.deep-research-pause` sentinel halts the command before any iteration write |
| `iteration-citation-jsonl.md` | CP-050. Proves the leaf writes a cited iteration file and exactly one schema-rich JSONL record |
| `exhausted-approach-respect.md` | CP-051. Proves a resumed run does not retry a strategy already marked BLOCKED |
| `setup-cp-sandbox.sh` | Builds the shared `/tmp/cp-deep-research-sandbox` fixture tree these scenarios run against |

---

## 4. TEST ENVIRONMENTS

Scenarios run under `/tmp/cp-0xx-sandbox/` and `/tmp/cp-0xx-spec/`. Provision the shared fixture tree with `setup-cp-sandbox.sh` before the first run, as the root playbook index directs. The script builds `/tmp/cp-deep-research-sandbox` by default and takes `--sandbox-dir PATH` to build it elsewhere.

---

## 5. TEST EXECUTION

Run each scenario's exact command sequence, which sits under TEST EXECUTION in its file. Record a `PASS`, `FAIL` or `SKIP` verdict with the evidence another operator needs to reproduce it. A `SKIP` must name a documented sandbox blocker. The execution and evidence policy is in [`../manual-testing-playbook.md`](../manual-testing-playbook.md).

---

## 6. SOURCE METADATA

### See Also

- Root playbook index: [`../manual-testing-playbook.md`](../manual-testing-playbook.md)
- Command router: `.skilled/commands/deep/research.md`
