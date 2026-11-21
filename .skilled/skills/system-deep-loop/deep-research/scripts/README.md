---
title: "Deep-research scripts"
description: "Code-facing entrypoints for research pivots, state reduction, runtime capability checks and YAML path validation."
trigger_phrases:
  - "deep-research scripts"
  - "research script entrypoints"
version: 1.0.1.0
---

# Deep-research scripts

---

## 1. OVERVIEW

This folder contains the code entrypoints used by the deep-research workflow. The modules cover divergent research pivots, state reduction and sparkline output, runtime capability reporting and YAML-backed script path checks.

---

## 2. CONTENTS

| File | Responsibility |
|---|---|
| `divergent-research-pivot.ts` | Library module with no CLI. `buildResearchPivotPreparationInput` derives bounded pivot candidates, prior directions, usage, identity and mandates from research state. `renderResearchPivotSeatPrompt` renders the parseable result contract for one research Council seat. |
| `reduce-state-sparkline.test.cjs` | Tests the state-reduction sparkline behavior. |
| `reduce-state.cjs` | Research state reducer. Reads the loop state for a spec folder and writes the findings registry, dashboard and strategy files, plus the resource map when asked. |
| `runtime-capabilities.cjs` | Reports runtime capabilities used by the research workflow. |
| `verify-yaml-script-paths.sh` | Validates script paths referenced by YAML workflow assets. |

---

## 3. ENTRYPOINTS

`reduce-state.cjs` runs as a CLI:

```bash
node .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs <spec-folder> [--artifact-dir <path>] [--lenient] [--emit-resource-map] [--fanout-resource-map-only] [--require-existing-state]
```

It also accepts `--create-missing-anchors` without acting on it. On success it prints a JSON summary of the written paths and counts.

| Exit | Meaning |
|---|---|
| `0` | State reduced and written |
| `1` | No spec folder given, or `--artifact-dir` without a path |
| `2` | Corrupt state without `--lenient`, or a refused state recovery |
| `3` | Unknown option, or the reducer failed |

---

## 4. BOUNDARIES

The folder owns research-specific script entrypoints and their focused test. Workflow routing and loop policy remain in the owning skill documentation.

---

## 5. VALIDATION

Run from the repository root.

```bash
node .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state-sparkline.test.cjs
bash .skilled/skills/system-deep-loop/deep-research/scripts/verify-yaml-script-paths.sh
```

Expected: the first prints `renderSparkline tests passed`. The second prints `PASS checked <n> script references across <n> workflow YAMLs` and exits `0`.

---

## 6. RELATED

- [`Deep-research skill`](../SKILL.md)
