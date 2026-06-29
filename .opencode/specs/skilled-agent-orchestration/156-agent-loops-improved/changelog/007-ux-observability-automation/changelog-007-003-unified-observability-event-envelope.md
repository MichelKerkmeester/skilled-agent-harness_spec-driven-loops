---
title: "Changelog: Unified Observability Event Envelope [007-ux-observability-automation/003-unified-observability-event-envelope]"
description: "Chronological changelog for the Unified Observability Event Envelope phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-29

> Spec folder: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/007-ux-observability-automation/003-unified-observability-event-envelope` (Level 1)
> Parent packet: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/007-ux-observability-automation`

### Summary

New observability-events.cjs (normalizeObservabilityEvent/appendObservabilityEvent) with the 5 emitters (fanout-run, convergence, status, council round-state, research yaml) routed through it. Additive; parity + envelope tests 20/20; drift clean.

### Added

- No new additions recorded.

### Changed

- New observability-events.cjs (normalizeObservabilityEvent/appendObservabilityEvent) with the 5 emitters (fanout-run, convergence, status, council round-state, research yaml) routed through it. Additive; parity + envelope tests 20/20; drift clean.

### Fixed

- No fixes recorded.

### Verification

- Unit tests (vitest) - PASS
- validate.sh --strict - PASS
- Scope - Only the files above changed

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/observability-events.cjs` | Modified | unified observability event envelope |
| `.opencode/skills/deep-loop-runtime/lib/council/round-state-jsonl.cjs` | Modified | unified observability event envelope |
| `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs` | Modified | unified observability event envelope |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | Modified | unified observability event envelope |
| `.opencode/skills/deep-loop-runtime/scripts/status.cjs` | Modified | unified observability event envelope |
| `.opencode/commands/deep/assets/deep_research_auto.yaml` | Modified | unified observability event envelope |
| `.opencode/skills/deep-loop-runtime/tests/unit/observability-events.vitest.ts` | Modified | unified observability event envelope |
| `.opencode/skills/deep-loop-runtime/tests/integration/status-script.vitest.ts` | Modified | unified observability event envelope |

### Follow-Ups

- Create project structure
- Install dependencies
- [P] Configure development tools
- [Implement core feature 1]
- [Implement core feature 2]
- [Implement core feature 3]
