---
title: "sk-vision Benchmark"
description: "Run layout and execution guidance for sk-vision benchmark scenarios: the Lane C corpus runner and the manual playbook scenario wrapper."
trigger_phrases:
  - "sk-vision benchmark"
  - "sk-vision Lane C"
  - "sk-vision scenario run"
importance_tier: "normal"
contextType: "general"
version: 1.0.0.0
---

# sk-vision Benchmark

This directory is the output home for executed sk-vision scenarios. The `manual-testing-playbook/` corpus is the **input**; this directory holds the **output**. Runs never rewrite the playbook corpus.

---

## 1. OVERVIEW

| Path | Owner | Contents |
|---|---|---|
| `benchmark/README.md` | This file | Layout + how to run |
| `benchmark/reports/README.md` | Run index | One row per dated run folder, append-only |
| `benchmark/reports/<YYYY-MM-DD>--<subject>--<variant>/` | Harness (renderer-owned) | Per-run artifacts — never hand-authored |

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

## 3. HOW TO RUN

### Lane C — full corpus

```bash
node .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs \
  --skill .opencode/skills/sk-vision
```

### Manual playbook scenario — single scenario

```bash
node .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-manual-playbook-scenario.cjs \
  --skill .opencode/skills/sk-vision \
  --scenario VSN-012 \
  --variant status-first-run \
  --verdict PASS \
  --reason "status returns model_loaded with device and vram fields" \
  --stage routing \
  --evidence <comma-separated absolute evidence paths>
```

Rules:

1. Verdicts are `PASS`, `FAIL`, or `SKIP` — nothing else. A `SKIP` must name its blocker.
2. Every `PASS` persists through `--outcome-json` with `executionContext.requireDurableEvidence: true` and one controlled evidence class (`unit`, `adapter-driven`, `registered-path`, or `native-host-delivered`); evidence paths must be non-symlink regular files beneath the evidence root.
3. Report files (`skill-benchmark-report.{json,md}`, `results.csv`, `failed-runs.md`, `findings-and-recommendations.md`) are renderer-owned and never hand-authored.

---

## 4. REFERENCE

- Corpus: `manual-testing-playbook/manual-testing-playbook.md`
- Wrapper: `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-manual-playbook-scenario.cjs`
- Runner: `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs`
