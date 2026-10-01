---
title: "Debug next check scorer"
description: "Operator-run census that scores the cheapest debug next check against the best constant answer, zero-call by default."
trigger_phrases:
  - "debug next check scorer"
  - "debug next check census"
  - "cheapest next check measurement"
---

# Debug next check scorer

---

## 1. OVERVIEW

`debug-next-check/` owns one operator-run census, `score-debug-next-check.mjs`. It measures offline whether a model choice of the cheapest next check for a debug hypothesis beats the best constant answer on operator-labeled rows.

Current state:

- The default run makes no model call. It searches tracked files outside the spec tree for the `next_check` seam and counts what the repository can mine.
- A model call starts only when an arm switch is set and that backend's gate passes. A failed gate prints a skip line and the other backend does not run in its place.
- A labeled fixture must sit outside the repository. A path inside, a row outside the schema or a duplicate id refuses the whole run before any line prints.
- The keep rule that decides a verdict is fixed before the first call and stored with every report. Verdicts come from exact integer counts.

---

## 2. CONTENTS

| File | Responsibility |
|---|---|
| `score-debug-next-check.mjs` | The census. Searches the seam, reads a fixture, scores the constant baselines, gates both backend arms and writes the report. |

---

## 3. USAGE

Run from the repository root. With no switches the census prints the seam hits and the mined counts, then stops.

```bash
node .skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/score-debug-next-check.mjs
```

| Switch | Behavior |
|---|---|
| `--fixture <path>` | Reads operator-labeled JSON Lines rows from a path outside the repository. Each row carries `id`, `symptom`, `claim`, `evidence`, `label` and `jev_ok`, and `label` is one of `read_code`, `run_test`, `reproduce` or `instrument`. |
| `--jev` | Adds the hosted Jev column once the pinned version and credential gate pass. Only rows marked `jev_ok` may leave the machine. |
| `--deem` | Adds the local Deem column once its health check passes. Nothing leaves the machine. |
| `--out <dir>` | Writes `report.json` in this directory. Required with `--jev` or `--deem`, so no call can run unrecorded, and a call also appends to `calls.jsonl`. |

No arm starts below 30 labeled rows or when the best constant is right on more than nine tenths of the rows, since no ten-point gain is left to measure. A refused command line or fixture exits 2. A printed census or a stopped gate exits 0.

---

## 4. VALIDATION

Run from the repository root.

```bash
cd .skilled/skills/system-spec-kit/runtime && npx vitest run tests/debug-next-check.vitest.ts
```

Expected result: the suite passes. It uses synthetic fixtures and stub `jev` and `cli-deem` binaries first on `PATH`, so no script run reaches a live backend.

---

## 5. RELATED

- [`Scripts`](../README.md)
- [`Runtime tests`](../../tests/README.md)
