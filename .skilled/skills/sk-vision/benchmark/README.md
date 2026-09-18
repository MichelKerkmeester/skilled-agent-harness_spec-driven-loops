---
title: "sk-vision Benchmark"
description: "Layout of the frozen sk-vision benchmark runs, produced by the retired Lane C corpus runner and scenario wrapper."
trigger_phrases:
  - "sk-vision benchmark"
  - "sk-vision Lane C"
  - "sk-vision scenario run"
importance_tier: "normal"
contextType: "general"
version: 1.0.0.0
---

# sk-vision Benchmark

> Archive status: the Lane C harness that produced these reports was retired with the skill-benchmark lane, so none of them can be re-run from the current tree. They stay as frozen historical evidence.
This directory is the output home for executed sk-vision scenarios. The `manual-testing-playbook/` corpus is the **input**; this directory holds the **output**. Runs never rewrite the playbook corpus.

---

## 1. OVERVIEW

| Path | Owner | Contents |
|---|---|---|
| `benchmark/README.md` | This file | Layout of the frozen runs |
| `benchmark/reports/README.md` | Run index | One row per dated run folder, append-only |
| `benchmark/reports/<YYYY-MM-DD>--<subject>--<variant>/` | Harness (renderer-owned) | Per-run artifacts: never hand-authored |

---

## 2. LAYOUT

```text
benchmark/
├── README.md                 # this file
└── reports/
    ├── README.md             # append-only run index
    └── <YYYY-MM-DD>--<subject>--<variant>/
        ├── README.md                  # run index entry (harness)
        ├── skill-benchmark-report.json # renderer-owned
        ├── skill-benchmark-report.md   # renderer-owned
        ├── results.csv
        ├── failed-runs.md
        ├── findings-and-recommendations.md
        └── source.md                   # names the packet/evidence that produced the run
```

---

## 3. REFERENCE

- Corpus: `manual-testing-playbook/manual-testing-playbook.md`
- Wrapper: the retired scenario-persistence wrapper
