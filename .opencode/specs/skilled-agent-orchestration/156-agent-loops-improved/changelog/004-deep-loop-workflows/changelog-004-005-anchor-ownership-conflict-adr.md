---
title: "Changelog: Anchor-Ownership and Injected-Question Conflict Merge ADR [004-deep-loop-workflows/005-anchor-ownership-conflict-adr]"
description: "Chronological changelog for the Anchor-Ownership and Injected-Question Conflict Merge ADR phase."
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

> Spec folder: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/004-deep-loop-workflows/005-anchor-ownership-conflict-adr` (Level 1)
> Parent packet: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/004-deep-loop-workflows`

### Summary

Added resolveQuestionConflicts() to deep-research reduce-state.cjs and treat key-questions as a generated projection (+ strategy + reducer-registry docs + yaml). Tests pass; parity green; hygiene/drift clean.

### Added

- No new additions recorded.

### Changed

- Added resolveQuestionConflicts() to deep-research reduce-state.cjs and treat key-questions as a generated projection (+ strategy + reducer-registry docs + yaml). Tests pass; parity green; hygiene/drift clean.

### Fixed

- No fixes recorded.

### Verification

- Unit tests (vitest) - PASS
- validate.sh --strict - PASS
- Scope - Only the files above changed

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs` | Modified | anchor-ownership conflict resolution |
| `.opencode/skills/deep-loop-workflows/deep-research/assets/deep_research_strategy.md` | Modified | anchor-ownership conflict resolution |
| `.opencode/skills/deep-loop-workflows/deep-research/references/state/state_reducer_registry.md` | Modified | anchor-ownership conflict resolution |
| `.opencode/commands/deep/assets/deep_research_auto.yaml` | Modified | anchor-ownership conflict resolution |
| `.opencode/skills/deep-loop-runtime/tests/unit/deep-research-reduce-state.vitest.ts` | Modified | anchor-ownership conflict resolution |

### Follow-Ups

- Create project structure
- Install dependencies
- [P] Configure development tools
- [Implement core feature 1]
- [Implement core feature 2]
- [Implement core feature 3]
