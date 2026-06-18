---
title: "Changelog: Command surface repoint [147-deep-loop-workflows/004-command-surface-repoint]"
description: "Chronological changelog for the command surface repoint phase."
trigger_phrases:
  - "phase changelog"
  - "command surface"
  - "deep commands"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-18

> Spec folder: `.opencode/specs/skilled-agent-orchestration/147-deep-loop-workflows/004-command-surface-repoint` (Level 2)
> Parent packet: `.opencode/specs/skilled-agent-orchestration/147-deep-loop-workflows`

### Summary

This phase moved the `/deep` command surface off five old skill paths and onto the merged `deep-loop-workflows` packet. The external command and agent names stayed stable. Only the skill references moved, so users kept the same commands while the framework stopped depending on the old skill layout.

### Added

- None.

### Changed

- Repointed the `/deep` command surface off the five old skill paths and onto the merged `deep-loop-workflows` packet.
- Kept command and agent names stable while moving only skill references.

### Fixed

- None.

### Verification

| Check | Result |
|-------|--------|
| Explicit verification | NOT RECORDED: No explicit verification was recorded. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| N/A | N/A | No file-level detail recorded. |

### Follow-Ups

- CHK-001 Predecessor: phase 003 green and continuity read.
- CHK-002 Phase-001 parity baseline available.
- CHK-010 Edits stay in this phase's frozen scope, with no adjacent cleanup.
- CHK-011 Changes follow existing project conventions.
- CHK-020 Phase-003 `deep-loop-workflows` hub, mode packets and `mode-registry.json` exist before edits.
- CHK-021 Per-mode `graph-metadata.json` files are absent. Only hub graph metadata survives.
