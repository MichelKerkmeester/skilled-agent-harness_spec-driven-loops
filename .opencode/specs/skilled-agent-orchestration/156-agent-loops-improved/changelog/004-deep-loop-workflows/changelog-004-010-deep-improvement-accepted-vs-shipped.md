---
title: "Changelog: Deep-Improvement Candidate Accepted vs Canonical Shipped Split [004-deep-loop-workflows/010-deep-improvement-accepted-vs-shipped]"
description: "Chronological changelog for the Deep-Improvement Candidate Accepted vs Canonical Shipped Split phase."
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

> Spec folder: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/004-deep-loop-workflows/010-deep-improvement-accepted-vs-shipped` (Level 1)
> Parent packet: `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/004-deep-loop-workflows`

### Summary

Two-phase promotion (accept vs ship) with branch-preserved failure + a new rollback-candidate.cjs, in promote-candidate.cjs (+ promotion gate/rules docs + config). 388 deep-improvement tests pass; hygiene/drift clean.

### Added

- No new additions recorded.

### Changed

- Two-phase promotion (accept vs ship) with branch-preserved failure + a new rollback-candidate.cjs, in promote-candidate.cjs (+ promotion gate/rules docs + config). 388 deep-improvement tests pass; hygiene/drift clean.

### Fixed

- No fixes recorded.

### Verification

- Unit tests (vitest) - PASS
- validate.sh --strict - PASS
- Scope - Only the files above changed

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/promote-candidate.cjs` | Modified | accepted-vs-shipped promotion split |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/rollback-candidate.cjs` | Modified | accepted-vs-shipped promotion split |
| `.opencode/skills/deep-loop-workflows/deep-improvement/references/shared/promotion_gate_contract.md` | Modified | accepted-vs-shipped promotion split |
| `.opencode/skills/deep-loop-workflows/deep-improvement/references/shared/promotion_rules.md` | Modified | accepted-vs-shipped promotion split |
| `.opencode/skills/deep-loop-workflows/deep-improvement/assets/agent_improvement/improvement_config.json` | Modified | accepted-vs-shipped promotion split |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/tests/promote-candidate-benchmark.vitest.ts` | Modified | accepted-vs-shipped promotion split |

### Follow-Ups

- Create project structure
- Install dependencies
- [P] Configure development tools
- [Implement core feature 1]
- [Implement core feature 2]
- [Implement core feature 3]
