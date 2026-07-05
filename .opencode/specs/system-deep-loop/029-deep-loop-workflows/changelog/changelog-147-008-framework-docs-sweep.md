---
title: "Changelog: Framework documentation sweep [147-deep-loop-workflows/008-framework-docs-sweep]"
description: "Chronological changelog for the framework documentation sweep phase."
trigger_phrases:
  - "phase changelog"
  - "framework docs"
  - "two-skill model"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-18

> Spec folder: `.opencode/specs/deep-loops/029-deep-loop-workflows/008-framework-docs-sweep` (Level 2)
> Parent packet: `.opencode/specs/deep-loops/029-deep-loop-workflows`

### Summary

This phase updated the framework documentation so the docs named the shipped architecture. The old model had five public `deep-*` loop skills. The new model has one `deep-loop-workflows` hub with modes plus the frozen MCP-free `deep-loop-runtime` backend, and the merged skill received a version stamp.

### Added

- None.

### Changed

- Rewrote cross-repo framework documentation from the five-skill model to the two-skill model.
- Documented one `deep-loop-workflows` hub with modes plus the frozen MCP-free `deep-loop-runtime` backend.
- Version-stamped the merged skill.

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

- CHK-001 Predecessor: phase 007 green and continuity read.
- CHK-002 Phase-001 parity baseline available.
- CHK-010 Edits stay in this phase's frozen scope, with no adjacent cleanup.
- CHK-011 Changes follow existing project conventions.
- CHK-020 Phase 007 dependency preflight is green.
- CHK-021 `deep-loop-workflows` `mode-registry.json` is the terminology source.
