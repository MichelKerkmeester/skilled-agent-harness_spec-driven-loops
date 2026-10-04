---
title: "Pi transport tests"
description: "Node test cases for the Pi transport comparison, covering the zero-call census, the baseline reader, the replay plan, the metrics, the keep rule and both live arms."
trigger_phrases:
  - "pi transport tests"
  - "score-pi-transport tests"
  - "pi transport census tests"
---

# Pi transport tests

---

## 1. OVERVIEW

`tests/` contains one `node --test` file for `../score-pi-transport.mjs`. The cases cover the zero-call census and its line order, the baseline reader and its refusals, the question construction, the probability readers and mean maps, the replay plan, the metrics, the keep rule, both arm gates and the end-to-end `main` runs that write `report.json`.

The cases build their option text and rotations with the CLI's own builders, inject the classifier runtime as a fake object and put stub executables in the OS temp directory first on `PATH`. No case reaches a real backend and no case opens a socket.

---

## 2. CONTENTS

| File | Responsibility |
|---|---|
| `score-pi-transport.test.mjs` | 46 cases for `../score-pi-transport.mjs`: the PATH lookup, the baseline reader, the census lines, the invocation guards, the criteria map and classifier context, the probability readers, the mean maps, the replay plan, the metrics, the judge outcomes, the verdict and column lines, both arm gates and the end-to-end runs. Runs with `node --test`. |

---

## 3. VALIDATION

Run from the repository root:

```bash
node --test .skilled/skills/cli-classifier/benchmark/pi-transport/tests/score-pi-transport.test.mjs
```

Expected result: every case passes and the runner exits 0. Fixtures live in the OS temp directory, so no case reaches a real backend and no case opens a socket.

---

## 4. RELATED

- [`Pi transport`](../README.md)
- [`cli-classifier Benchmark Artifacts`](../../README.md)
