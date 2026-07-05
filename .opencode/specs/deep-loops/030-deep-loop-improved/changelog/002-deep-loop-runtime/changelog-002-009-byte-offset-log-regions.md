---
title: "Changelog: Byte-Offset Transcript Log Regions [002-deep-loop-runtime/009-byte-offset-log-regions]"
description: "Chronological changelog for the Byte-Offset Transcript Log Regions phase."
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

> Spec folder: `.opencode/specs/deep-loops/030-deep-loop-improved/002-deep-loop-runtime/009-byte-offset-log-regions` (Level 1)
> Parent packet: `.opencode/specs/deep-loops/030-deep-loop-improved/002-deep-loop-runtime`

### Summary

Stamp logOffset/logSize/logPath on iteration records (post-dispatch-validate.ts) + optional schema fields (deep_research_auto.yaml) + dashboard surfacing in reduce-state.cjs. 23 vitest + workflows node test pass; typecheck green. Corrected two wrong spec paths (reduce-state lives in deep-loop-workflows; auto yaml in commands/deep/assets).

### Added

- No new additions recorded.

### Changed

- Stamp logOffset/logSize/logPath on iteration records (post-dispatch-validate.ts) + optional schema fields (deep_research_auto.yaml) + dashboard surfacing in reduce-state.cjs. 23 vitest + workflows node test pass; typecheck green. Corrected two wrong spec paths (reduce-state lives in deep-loop-workflows; auto yaml in commands/deep/assets).

### Fixed

- No fixes recorded.

### Verification

- Unit tests (vitest) - PASS
- validate.sh --strict - PASS
- Scope - Only the files above changed

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts` | Modified | byte-offset log regions |
| `.opencode/commands/deep/assets/deep_research_auto.yaml` | Modified | byte-offset log regions |
| `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs` | Modified | byte-offset log regions |
| `.opencode/skills/deep-loop-runtime/tests/unit/post-dispatch-validate.vitest.ts` | Modified | byte-offset log regions |
| `.opencode/skills/deep-loop-runtime/tests/unit/deep-research-reduce-state.vitest.ts` | Modified | byte-offset log regions |
| `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state-sparkline.test.cjs` | Modified | byte-offset log regions |

### Follow-Ups

- Create project structure
- Install dependencies
- [P] Configure development tools
- [Implement core feature 1]
- [Implement core feature 2]
- [Implement core feature 3]
