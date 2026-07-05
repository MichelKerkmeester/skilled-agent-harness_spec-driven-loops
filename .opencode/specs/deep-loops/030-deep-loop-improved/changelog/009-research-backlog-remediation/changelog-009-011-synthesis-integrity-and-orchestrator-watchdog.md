---
title: "Changelog: Synthesis Integrity and Orchestrator Watchdog [009-research-backlog-remediation/011-synthesis-integrity-and-orchestrator-watchdog]"
description: "Chronological changelog for the Synthesis Integrity and Orchestrator Watchdog phase."
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

> Spec folder: `.opencode/specs/deep-loops/030-deep-loop-improved/009-research-backlog-remediation/011-synthesis-integrity-and-orchestrator-watchdog` (Level 1)
> Parent packet: `.opencode/specs/deep-loops/030-deep-loop-improved/009-research-backlog-remediation`

### Summary

A lineage could narrate synthesis complete while its registry and output files never actually existed, and the fan-out orchestrator could hang indefinitely after a lineage's subprocess had already exited, both directly observed in production during this same remediation phase's own generation-2 research run. All three fixes close the gap: a real completion invariant, a genuinely new post-exit watchdog and the last missing registry-reconstruction counterpart.

### Added

- Add a synthesis-completion invariant to both `deep_research_auto.yaml` and `deep_review_auto.yaml`, an inline check that verifies artifacts exist and finding counts agree before logging synthesis complete, logging a new `synthesis_incomplete` event otherwise.
- Add a post-exit orchestrator watchdog, an injected liveness callback plus a bounded grace period in `fanout-pool.cjs`, fed real subprocess spawn and exit evidence from `fanout-run.cjs`.
- Add `reconstructResearchRegistryFromState()`, mirroring the already-shipped review-side function, wired into `mergeResearchRegistries()`.

### Changed

- No changes to the pre-existing lag-ceiling queue-lag mechanism. The new watchdog is a fully separate code path.

### Fixed

- Fixed the false-completion narration bug where a lineage's JSONL claimed synthesis complete while its registry, research output and dashboard were never written.
- Fixed the orchestrator hang bug where the top-level fan-out process stayed alive indefinitely after a lineage's subprocess had already exited with no completion event ever recorded.
- Fixed the last asymmetry between the review and research merge paths, closing the registry-reconstruction gap for a genuinely leaf-only research lineage.

### Verification

- 3 modified test files run directly, PASS, 68 of 68.
- Full `deep-loop-runtime` Vitest suite run, PASS, 570 of 572, the same pre-existing unrelated baseline failures noted throughout this remediation phase, up from a captured pre-change baseline of 563 of 565.
- Every diff independently reviewed against the actual repo state after the dispatched implementation's own background process was interrupted before it could deliver its final report.

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/commands/deep/assets/deep_research_auto.yaml` | Modified | Synthesis-completion invariant for research. |
| `.opencode/commands/deep/assets/deep_review_auto.yaml` | Modified | Synthesis-completion invariant for review. |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs` | Modified | Post-exit watchdog mechanism. |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | Modified | Real subprocess liveness tracking and grace-period default. |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs` | Modified | `reconstructResearchRegistryFromState()`. |

### Follow-Ups

- None identified. All 3 fixes are independently verified against the actual repo state, not accepted on the dispatch's own incomplete self-report.
