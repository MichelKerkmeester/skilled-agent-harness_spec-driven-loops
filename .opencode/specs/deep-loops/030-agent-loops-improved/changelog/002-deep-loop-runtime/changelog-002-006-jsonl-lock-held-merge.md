---
title: "Changelog: Phase 6: JSONL Repair — Lock-Held Read-Merge-Write Set-Union [002-deep-loop-runtime/006-jsonl-lock-held-merge]"
description: "Chronological changelog for the Phase 6: JSONL Repair — Lock-Held Read-Merge-Write Set-Union phase."
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

> Spec folder: `.opencode/specs/deep-loops/030-agent-loops-improved/002-deep-loop-runtime/006-jsonl-lock-held-merge` (Level 1)
> Parent packet: `.opencode/specs/deep-loops/030-agent-loops-improved/002-deep-loop-runtime`

### Summary

Added mergeJsonlUnderLock to jsonl-repair.ts (reread-under-lock + set-union dedupe by stable record identity, atomic write) and wired fanout-salvage.cjs through it instead of bare append. Tests pass (19); typecheck green. Spec path for fanout-salvage corrected (scripts/, not lib/deep-loop/).

### Added

- No new additions recorded.

### Changed

- Added mergeJsonlUnderLock to jsonl-repair.ts (reread-under-lock + set-union dedupe by stable record identity, atomic write) and wired fanout-salvage.cjs through it instead of bare append. Tests pass (19); typecheck green. Spec path for fanout-salvage corrected (scripts/, not lib/deep-loop/).

### Fixed

- No fixes recorded.

### Verification

- Unit tests (vitest) - PASS
- validate.sh --strict - PASS
- Scope - Only the files above changed

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts` | Modified | JSONL lock-held merge for fan-out salvage |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-salvage.cjs` | Modified | JSONL lock-held merge for fan-out salvage |
| `.opencode/skills/deep-loop-runtime/tests/unit/jsonl-repair.vitest.ts` | Modified | JSONL lock-held merge for fan-out salvage |

### Follow-Ups

- Create project structure
- Install dependencies
- [P] Configure development tools
- [Implement core feature 1]
- [Implement core feature 2]
- [Implement core feature 3]
