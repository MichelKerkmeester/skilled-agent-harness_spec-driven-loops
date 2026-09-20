---
title: "cli-jev Benchmark Artifacts"
description: "Benchmark tree for cli-jev holding playbook-derived validation reports, indexed by run label, newest first."
trigger_phrases:
  - "cli-jev benchmark"
  - "cli-jev validation report"
  - "cli-jev manual testing playbook benchmark"
importance_tier: "normal"
contextType: "general"
version: 1.0.0.0
---

# cli-jev Benchmark Artifacts

> Curated, derived-after-the-fact reports for `cli-jev` manual-testing-playbook validation runs,
> kept beside the CLI they measure. This file indexes the tree; `reports/README.md` carries the
> per-run index.

---

## 1. OVERVIEW

This `benchmark/` tree holds reports derived from manual-testing-playbook validation runs. It is not
the deep-improvement Lane C skill-benchmark harness, and no dimension scoring applies. Every file
inside a run-label folder carries the marker `_Derived after the fact from this run's stored record,
not written at run time._`

A run folder holds the run's evidence and its verdict. Raw transcripts stay in the session that
produced them; the report names where they came from.

---

## 2. LAYOUT

```text
benchmark/
  README.md                    # this index
  reports/
    README.md                  # per-run index, newest first
    <YYYY-MM-DD>-<label>/      # one folder per validation run
```

---

## 3. WHAT A REPORT CONTAINS

- The scenario set executed, and which scenarios were skipped with their blockers.
- Per-scenario verdicts in the three-state discipline: PASS, FAIL, or SKIP with a specific blocker.
- The commands actually run, their exit status, and the observable each check read.
- The delta against the previous run, including the checks that did not move.

The baseline for this packet is its first run. `cli-jev` ships no prior report, so the first run's
report is the comparison point for every later one, and a later run that reports "no regressions"
must name that baseline.
