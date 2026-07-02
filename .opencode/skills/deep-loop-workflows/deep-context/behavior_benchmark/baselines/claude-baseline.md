---
title: Deep-Context Behavior Benchmark — Claude Baseline
description: >-
  Per-scenario Claude baseline checkpoints for the deep-context behavior
  benchmark package. Captured 2026-07-02, claude-cli leg, single-sample.
trigger_phrases:
  - deep-context baseline
  - CXB baseline
importance_tier: high
contextType: implementation
---

## BASELINE TABLE

Checkpoints in milliseconds; `—` = not reached (no dispatch, or run killed before
that checkpoint). Context scenarios target `fx-001-review-target` (context INIT
does not require the research host anchors).

| Scenario | tFirstOutputMs | tSetupMs | tFirstDispatchMs | tTerminalMs | Classification |
| --- | --- | --- | --- | --- | --- |
| CXB-001 | 2285 | 19562 | 325371 | 1030452 | pass (10/10, te=2) |
| CXB-002 | 2412 | 21270 | — | 119475 | pass |
| CXB-003 | 2509 | — | — | 76753 | pass |
| CXB-004 | 2583 | — | — | 119129 | pass |
| CXB-005 | 1805 | — | 29357 | 154452 | pass (10/10, te=1) |
| CXB-006 | 1818 | 28321 | — | 88297 | pass |

Baseline classification: 6/6 pass. CXB-001 and CXB-005 dispatch to the
`deep-context` leaf (te=2 and te=1 respectively); the remaining cells complete
inline per their contracts.

## CAPTURE PROVENANCE

- **Captured**: 2026-07-02, leg `claude-cli` (claude CLI v2.1.198), single-sample
  per the framework rerun policy.
- **Host confound**: the baseline runs the `claude` binary while measured GPT legs
  run `opencode`; host bootstrap overhead is folded into every latency ratio this
  baseline anchors. Not removable on this install (no Anthropic provider in
  opencode).
- **Round note**: the first baseline round rate-limited on the Claude session quota
  (rejected pre-prompt); those cells were quarantined as `env_error` and this table
  is the clean re-run after the quota reset.
