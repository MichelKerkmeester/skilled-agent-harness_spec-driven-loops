---
title: "Changelog: GPT-vs-Claude Benchmark [031-deep-loop-issues-with-gpt-opencode/012-gpt-claude-benchmark]"
description: "Chronological changelog for the GPT-vs-Claude Benchmark phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-07-01

> Spec folder: `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/012-gpt-claude-benchmark` (Level 2)
> Parent packet: `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode`

### Summary

Confirmed the external-shell precondition that had blocked phase 005 (this Claude Code shell is genuinely `OPENCODE_PID`-free), then ran live smoke-level dispatches across 4 deep modes x 2 models, finding zero Mode-D recurrences, zero route mismatches, a measured 3-10x GPT latency gap, and one inconsistent GPT "Command-only" enforcement observation.

### Added

- No new capability — evidence/documentation phase.

### Changed

- No production code changed — measurement phase.

### Fixed

- No fixes recorded — measurement phase.

### Verification

- External-shell precondition — PASS (`OPENCODE_PID` unset, `opencode` v1.17.11 reachable).
- Claude-native leg: 4/4 modes PASS, 2.3-6.5s.
- GPT direct dispatch (context/review/ai-council): PASS, ~21-22s.
- GPT `/deep:research` command Phase-0: PASS (`general_agent_verified = TRUE` observed live), but the full command run hit `timeout_latency` (>100s).
- GPT `/deep:review` command Phase-0: inconclusive/timeout (>70s).
- Classification: 7 pass / 2 timeout_latency / 0 Mode-D / 0 route_mismatch / 0 missing_artifact.
- `validate.sh --strict` — PASS, 0 errors / 0 warnings.
- Checklist: P0 8/8, P1 5/5, P2 1/1.

### Files Changed

| File | Action | What changed |
|---|---|---|
| `benchmark-results.md` | Created | Full cell-by-cell results, classification, gate-relevant summary |

### Follow-Ups

- No full multi-iteration convergence run executed — smoke-level only, explicitly scoped.
- `/deep:review` command-level Phase-0 check was genuinely inconclusive and not retried with a longer window.
- GPT's inconsistent Command-only enforcement (refused a `deep-research` direct dispatch, allowed an identical `deep-review` one) observed but not root-caused.
- ai-council's GPT-leg latency not separately re-timed this run.
