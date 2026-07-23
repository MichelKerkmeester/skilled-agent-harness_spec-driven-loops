---
title: "Command Benchmark: behavior-matrix scheduler"
description: "Scheduler that verifies frozen fixtures, runs declared matrix cells and reconciles the results."
---

# Command Benchmark

---

## 1. OVERVIEW

Scheduler for the deep-alignment command-behavior-matrix, invoked by `/deep:command-benchmark`. It verifies the frozen fixtures a matrix cell depends on, runs the declared cells and writes a reconciliation file the command reads back.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `run-command-behavior-matrix.cjs` | Verifies fixture hashes, runs each declared matrix cell and reconciles output against `command-behavior-matrix.reconciliation.json` |

## 3. CONSUMERS

- `.opencode/commands/deep/assets/deep-command-benchmark-auto.yaml` and `deep-command-benchmark-confirm.yaml`

## 4. TESTS

```bash
node .opencode/skills/system-deep-loop/deep-alignment/scripts/tests/command-behavior-matrix.test.cjs
```

## 5. RELATED

- [`../README.md`](../README.md)
