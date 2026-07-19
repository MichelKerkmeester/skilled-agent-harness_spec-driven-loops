---
title: Deep-AI-Council Behavior Benchmark — Claude Baseline
description: >-
  Per-scenario Claude baseline checkpoints for the deep-ai-council behavior
  benchmark package. Captured 2026-07-02, claude-cli leg, single-sample.
trigger_phrases:
  - deep-ai-council baseline
  - ACB baseline
importance_tier: high
contextType: implementation
---

## BASELINE TABLE

Checkpoints in milliseconds; `—` = not reached. Fixture: `fx-003-council-target`.
Council delegation evidence is distinct seat ids in the persisted `ai-council/`
artifacts (not task dispatch); `seats` below is the baseline seat count.

| Scenario | tFirstOutputMs | tSetupMs | tFirstDispatchMs | tTerminalMs | Classification | seats |
| --- | --- | --- | --- | --- | --- | --- |
| ACB-001 | 1440 | 26059 | 331003 | 693059 | pass (10/10) | 4 |
| ACB-002 | 1125 | 20656 | — | 67090 | pass (halt) | 0 |
| ACB-003 | 1814 | — | — | 84570 | partial* | 0 |
| ACB-004 | 1564 | 91513 | 335625 | 1041693 | pass (10/10) | 3 |
| ACB-005 | 1919 | 51645 | — | 425835 | missing_artifact† | 0 |

\* ACB-003 (vague design ask) answered inline without convening a council — a
soft routing miss (absorption not forbidden), not a failure. Same inline-routing
pattern as the vague research/improvement asks.

† ACB-005 is a **council setup-confirm halt** (corrected reading): Claude bound
the topic and presented a `:confirm` setup awaiting go-ahead rather than running
autonomously. Not a production failure — the bucket fired because an autonomous
run was expected and no artifacts were written.

## CAPTURE PROVENANCE

- **Captured**: 2026-07-02, leg `claude-cli` (claude CLI v2.1.198), single-sample.
- **Host confound**: baseline runs the `claude` binary; measured GPT legs run
  `opencode`. Host bootstrap folds into every latency ratio.
- **Council routing**: Claude convenes seats for explicit, bounded asks
  (ACB-001/004), answers inline for vague design questions (ACB-003), and halts
  at a confirm-setup for the "run it yourself" framing (ACB-005).
