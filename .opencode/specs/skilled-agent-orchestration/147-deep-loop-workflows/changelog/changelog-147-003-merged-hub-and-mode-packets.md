---
title: "Changelog: Merged hub and mode packets [147-deep-loop-workflows/003-merged-hub-and-mode-packets]"
description: "Chronological changelog for the merged hub and mode packets phase."
trigger_phrases:
  - "phase changelog"
  - "merged hub"
  - "mode packets"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-18

> Spec folder: `.opencode/specs/skilled-agent-orchestration/147-deep-loop-workflows/003-merged-hub-and-mode-packets` (Level 2)
> Parent packet: `.opencode/specs/skilled-agent-orchestration/147-deep-loop-workflows`

### Summary

This phase introduced the new public shape: `deep-loop-workflows/` as one hub skill with five mode packets and one advisor identity. The hub routes by mode and carries no per-mode implementation logic. That made the consolidation visible as one skill while preserving mode-level behavior underneath.

### Added

- None.

### Changed

- Created `deep-loop-workflows/` as one public skill, five mode packets and one advisor identity.

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

- CHK-001 Predecessor: phase 002 green and continuity read.
- CHK-002 Phase-001 parity baseline available.
- CHK-010 Edits stay in this phase's frozen scope, with no adjacent cleanup.
- CHK-011 Changes follow existing project conventions.
- CHK-020 `deep-loop-workflows/` exists. Hub `SKILL.md` routes by mode with no per-mode logic, grep-verified.
- CHK-021 Hub `graph-metadata.json` has `skill_id`, `name` and folder equal to `deep-loop-workflows`, with `family=deep-loop`.
