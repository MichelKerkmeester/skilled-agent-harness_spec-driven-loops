---
title: Deep-Research Behavior Benchmark — Claude Baseline
description: >-
  Per-scenario Claude baseline checkpoints for the deep-research behavior
  benchmark package. Captured 2026-07-02, claude-cli leg, single-sample.
trigger_phrases:
  - deep-research baseline
  - RSB baseline
importance_tier: high
contextType: implementation
---

## BASELINE TABLE

Checkpoints in milliseconds; `—` = not reached (no dispatch, or run killed before
that checkpoint). Full-run research cells (RSB-001/007/008) target
`fx-002-research-target`, which carries the `Open Questions` + `Research Context`
host anchors that deep-research INIT requires; the anchor-less `fx-001` makes
research INIT fail closed (correct workflow behavior), so it is NOT used for
full-run research cells.

| Scenario | tFirstOutputMs | tSetupMs | tFirstDispatchMs | tTerminalMs | Classification |
| --- | --- | --- | --- | --- | --- |
| RSB-001 | 1578 | 36449 | 431184 | 1124367 | pass (10/10, te=1) |
| RSB-002 | 2079 | 22895 | — | 114266 | pass |
| RSB-003 | 2297 | — | — | 362845 | pass |
| RSB-004 | 2265 | — | — | 46533 | partial (D2 1/2) |
| RSB-005 | 1941 | — | 76362 | 306624 | pass (10/10, te=2) |
| RSB-006 | 1626 | 20401 | — | 51556 | pass |
| RSB-007 | 1637 | 26359 | 543789 | 1247662 | pass (10/10, te=1, rp=2) |
| RSB-008 | 2686 | 39287 | 405345 | 901061 | timeout_latency* |

\* RSB-008 dispatched correctly (te=1, D3 2/2) but the full iteration did not
finish inside the 900000 ms (15 min) budget — a correct-but-budget-bound
**ceiling**, not a behavioral failure. Its full-run siblings RSB-001/007 carry a
25-minute budget and finished at ~18.7/20.8 min; RSB-008 was under-provisioned at
15 min. Treat its tTerminal as a lower bound; the budget-tier inconsistency is a
phase-005 framework backlog item.

## CAPTURE PROVENANCE

- **Captured**: 2026-07-02, leg `claude-cli` (claude CLI v2.1.198), single-sample
  per the framework rerun policy.
- **Host confound**: the baseline runs the `claude` binary while measured GPT legs
  run `opencode`; host bootstrap overhead is folded into every latency ratio this
  baseline anchors. Not removable on this install (no Anthropic provider in
  opencode).
- **Round note**: the first baseline round rate-limited on the Claude session quota
  (9 cells rejected pre-prompt); those were quarantined as `env_error` and this
  table is the clean re-run after the quota reset. Baseline classification: 7 pass,
  1 partial (RSB-004), 1 timeout ceiling (RSB-008).
