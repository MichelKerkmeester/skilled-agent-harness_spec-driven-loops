---
title: "Deep-Alignment Scripts: state-machine engine"
description: "Single-shot CLI scripts implementing each deep-alignment state-machine step."
---

# Deep-Alignment Scripts

---

## 1. OVERVIEW

Runtime engine for the deep-alignment loop, one script per state-machine step. Each script answers one question once per call and returns. None of them loop or dispatch themselves. The owning command workflow (`/deep:alignment`, via `.opencode/commands/deep/assets/deep-alignment-auto.yaml`) invokes a script, reads its JSON output and decides the next state.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `scoping.cjs` | SCOPE state. Resolves `--lane-config` or interactive selections into validated `{authority, artifactClass, scope}` lane tuples |
| `partition-corpus.cjs` | ITERATE state. Returns the next lane's next unaudited artifact slice, rotating lanes round robin |
| `check-convergence.cjs` | CONVERGE state. Decides whether coverage and dry-run stability have cleared their thresholds |
| `remediate-hook.cjs` | REMEDIATE state hook point. Enters the state and does nothing until an operator opts in to real remediation logic |

Subfolders: `adapters/` holds the per-authority DISCOVER and CHECK adapters, `command-benchmark/` holds the command-behavior-matrix scheduler, `tests/` holds the regression suite for this folder. Each has its own README.

## 3. TESTS

```bash
node .opencode/skills/system-deep-loop/deep-alignment/scripts/tests/state-machine-wiring.test.cjs
```

Drives SCOPE through REMEDIATE against a synthetic fixture and proves the wiring between these scripts. Run any other file under `tests/` the same way.

## 4. RELATED

- [`SKILL.md`](../SKILL.md)
- [`adapters/README.md`](adapters/README.md)
- [`command-benchmark/README.md`](command-benchmark/README.md)
- [`tests/README.md`](tests/README.md)
