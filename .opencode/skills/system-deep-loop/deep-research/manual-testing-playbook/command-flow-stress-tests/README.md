---
title: "Command-Flow Stress Tests: deep-research CP-04x/05x scenarios"
description: "Sandboxed scenarios validating the /deep:research command-level entrypoint separately from the leaf iteration body."
---

# Command-Flow Stress Tests

---

## 1. OVERVIEW

Category 07 of the `deep-research` manual testing playbook, six `CP-0xx` scenarios. Each scenario enters through `/deep:research` or `/deep:research:auto` and checks a command-owned behavior, setup binding, pause handling, spec writeback, resource-map toggling or leaf output contract, rather than research quality. All scenarios run under `/tmp/cp-0xx-sandbox/` and `/tmp/cp-0xx-spec/`.

## 2. CONTENTS

| File | Scenario |
|------|----------|
| `setup-yaml-handoff.md` | CP-046. Proves setup inputs resolve before the auto YAML workflow loads |
| `spec-fence-writeback.md` | CP-047. Proves spec mutation stays inside the lock and the generated findings fence |
| `resource-map-toggle.md` | CP-048. Proves `--no-resource-map` is parsed and honored end to end |
| `pause-sentinel-halt.md` | CP-049. Proves a packet-local `.deep-research-pause` sentinel halts the command before any iteration write |
| `iteration-citation-jsonl.md` | CP-050. Proves the leaf writes a cited iteration file and exactly one schema-rich JSONL record |
| `exhausted-approach-respect.md` | CP-051. Proves a resumed run does not retry a strategy already marked BLOCKED |
| `setup-cp-sandbox.sh` | Builds the shared `/tmp/cp-deep-research-sandbox` fixture tree these scenarios run against |

## 3. RELATED

- [`../manual-testing-playbook.md`](../manual-testing-playbook.md)
