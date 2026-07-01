---
title: "Changelog: Orchestrate Universal Routing [031-deep-loop-issues-with-gpt-opencode/009-orchestrate-universal-routing]"
description: "Chronological changelog for the Orchestrate Universal Routing phase."
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

> Spec folder: `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/009-orchestrate-universal-routing` (Level 2)
> Parent packet: `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode`

### Summary

Completed `orchestrate.md`'s Priority table with the 2 missing deep-mode rows (`@deep-context`, `@deep-review`), made the `Deep Route:` field an explicit registry lookup instead of free text, and added an NDP boundary forbidding Task-dispatching `@deep` itself, across both runtime mirrors, plus a later 8.3-8.4% bloat-reduction pass.

### Added

- No new files.

### Changed

- `.opencode/agents/orchestrate.md` and `.claude/agents/orchestrate.md` — Priority table (+2 rows), NDP LEAF list (+1), Agent Files table (+2), Deep Route registry-resolution rule, a 4th "Illegal Chain" NDP example.
- Follow-up bloat-reduction pass trimmed both files (891→817 lines OpenCode, 880→806 lines Claude) by removing a duplicated mermaid flowchart, consolidating NDP restatements, and compressing anti-patterns into a table.

### Fixed

- Missing `@deep-context`/`@deep-review` routing rows.
- Unresolved (non-registry-verifiable) `Deep Route:` field.
- Missing NDP boundary against dispatching `@deep` as a worker.

### Verification

- Manual trace of `/deep:context` and `/deep:review` via table lookup — PASS.
- Grep symmetric occurrence counts across both mirrors — PASS.
- Diff confirms non-deep rows byte-unchanged — PASS.
- `validate.sh --strict` — PASS, 0 errors / 0 warnings (re-verified after the bloat-reduction pass too).
- Checklist: P0 7/7, P1 8/8, P2 1/1.

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/agents/orchestrate.md` | Modified | Priority table, NDP list, registry rule, NDP boundary, later size trim |
| `.claude/agents/orchestrate.md` | Modified | Identical mirrored changes |

### Follow-Ups

- No live dispatch test in this phase — deferred to phase 012's benchmark.
- `@deep-context` vs `@context` / `@deep-review` vs `@review` disambiguation is documented in prose but not mechanically enforced — accepted residual risk.
