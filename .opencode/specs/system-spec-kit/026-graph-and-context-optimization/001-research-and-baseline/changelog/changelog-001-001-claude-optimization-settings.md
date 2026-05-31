---
title: "Phase 001: Claude Optimization Settings (Reddit Field-Report Audit)"
description: "13-iteration deep-research run that audited a Reddit primary-source field report against Code_Environment/Public. Produced 24 findings (F1-F24) across four prioritization tiers: 11 adopt-now, 11 prototype-later, 2 reject."
trigger_phrases:
  - "claude optimization settings research"
  - "reddit field report audit"
  - "enable tool search research"
  - "token waste findings"
  - "f1-f24 recommendation set"
importance_tier: "important"
contextType: "research"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-07

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/001-claude-optimization-settings` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline`

### Summary

`Code_Environment/Public` had no evidence-anchored baseline for which Claude Code token-waste patterns were most prevalent. There was no map of which configuration changes were already adopted or which hook and behavioral interventions to prioritize. A Reddit field report covering 858-926 sessions was the only available primary-source evidence. A 13-iteration deep-research loop audited that post against the repo's actual `.claude/settings.local.json` and `CLAUDE.md`.

The headline finding: the post's highest-leverage configuration recommendation (`ENABLE_TOOL_SEARCH=true`) was already present in this repo before the research began. That discovery shifted the work from a config-flip exercise to a ranked taxonomy exercise. The loop produced 24 findings (F1-F24) across four tiers. Eleven were labeled adopt-now, eleven prototype-later. Two were reject. The most actionable wins were documentation and rule clarity rather than new code. No settings were changed. No hooks were written. No auditor was built. The deliverable is a decision layer that downstream phases can act on.

The core loop ran eight iterations via `cli-copilot` `gpt-5.4` with `reasoning_effort=high`. The user extended the loop to 13 iterations via `cli-codex` `gpt-5.4` high reasoning to add an independent skeptical pass before closeout. Iterations 009-013 added validation experiment design (F18-F20), skeptical quantitative corrections (F21-F22) and prototype-design prerequisites (F23-F24). A final amendment landing pass refreshed `research/research.md`.

### Added

- None. Research-only phase.

### Changed

- None. Research-only phase.

### Fixed

- None. Research-only phase.

### Verification

- `research/research.md` contains 24 findings (F1-F24) with source anchors: PASS
- Every finding cites a specific `external/reddit_post.md` passage via "Source passage anchor" and "Source quote" fields: PASS
- Every finding carries a recommendation label (11 adopt-now, 11 prototype-later, 2 reject): PASS
- Cross-check table against `.claude/settings.local.json` and `CLAUDE.md` present in `research/research.md` §3 with 5 rows: PASS
- Phase 005-claudest boundary explicit in `research/research.md` §9 with no implementation content in this phase: PASS
- Source discrepancies preserved in `research/research.md` §2 discrepancy table and `decision-record.md` ADR-002: PASS
- Config-change checklist present in `research/research.md` §5 with `alreadyInRepo`, `recommendedAdditions`, `outOfScope` buckets: PASS
- `ENABLE_TOOL_SEARCH=true` identified as already present (F1 adopt-now, already implemented): PASS
- Convergence report present in `research/research.md` §12 with full trajectory and stop-reason: PASS
- `validate.sh --strict`: exited 2 with Errors: 0 and the intentional `ANCHORS_VALID` warning only: PASS
- Memory save via `generate-context.js`: PASS (HIGH trigger-phrase issue patched manually after save)
- 13 iteration files (`iteration-001` through `iteration-013`) in `research/iterations/`: PASS
- `findings-registry.json` deduplicated cross-iteration finding ledger: PASS
- `deep-research-state.jsonl` externalized loop state with 16 records: PASS

### Files Changed

| File | What changed |
|------|--------------|
| `research/research.md` (NEW) | 577-line canonical synthesis covering 12 sections: source framing, discrepancy table, repo cross-check, 24 findings, config checklist, hook conflict matrix, adopt-now rules, audit methodology, phase boundary, risks, open questions, convergence report |
| `research/deep-research-strategy.md` (NEW) | Research strategy document: topic, 5 key questions, non-goals, stop conditions and known-context cross-checks |
| `research/deep-research-config.json` (NEW) | Run configuration with iteration cap (10), convergence threshold (0.05), runner config |
| `research/deep-research-state.jsonl` (NEW) | Externalized JSONL loop state, 16 records across 13 iterations |
| `research/deep-research-dashboard.md` (NEW) | Reducer-generated convergence tracking dashboard |
| `research/findings-registry.json` (NEW) | Deduplicated cross-iteration finding ledger, 24 canonical findings from 56 raw findings |
| `research/iterations/iteration-001` through `iteration-013` (NEW) | Per-iteration evidence files forming the audit trail for `research/research.md` |

### Follow-Ups

- Resolve the 926-vs-858 session count and 18,903-vs-11,357 turns denominator discrepancies preserved from `external/reddit_post.md` (ADR-002). Exact prevalence extrapolations are bounded by this uncertainty until the source resolves them.
- Conduct local A/B measurement for deferred-loading ergonomics (Q2 exhausted without closure). The post proves smaller upfront tool payload but provides no latency or discoverability benchmark for this repo's startup environment.
- Partition root causes for the 31 edit-retry chains (Q8 exhausted without closure). The post reports the count but does not split across prompt quality, workflow design and guardrail messaging.
- Complete phase 005-claudest prerequisites before validating prototype-lane findings. `research/research.md` §9 keeps F14 in phase 005 and F5 and F15 as separate later-phase work.
- Treat any future auditor's JSONL ingest as a guarded adapter with coverage counters. The JSONL format depends on an undocumented local format that can change silently (F16).
- Require runtime validation before any rollout of the `UserPromptSubmit` blocking-flow UX. The post itself notes the UX still needs more thought (F5).
