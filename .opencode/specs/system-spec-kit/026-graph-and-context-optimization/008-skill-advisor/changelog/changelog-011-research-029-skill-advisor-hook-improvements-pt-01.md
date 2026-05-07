---
title: "Research 011/029: Skill advisor hook improvements pt-01"
description: "10-iteration deep research finding 5 P1 and 3 P2 gaps in parity, observability, and telemetry beyond the closed CF-019 fix."
trigger_phrases:
  - "research 011/029 pt-01 changelog"
  - "hook improvements research pt-01"
importance_tier: "normal"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-24

> Spec folder: `026-graph-and-context-optimization/008-skill-advisor/011-skill-advisor-hook-improvements/research/029-skill-advisor-hook-improvements-pt-01` (Level 2)
> Parent packet: `026-graph-and-context-optimization/008-skill-advisor`

### Summary

This packet found multiple net-new gaps beyond the already-closed CF-019 threshold-refresh issue. The highest-signal problems are parity and observability drifts that emerged after the shared hook surface landed. OpenCode diverges from the shared runtime contract in both threshold handling and cache invalidation. Codex has a separate native fast path that bypasses the shared brief pipeline. The MCP and telemetry surfaces overstate how much live state they expose. The recommendation-quality loop remains mostly offline.

### Added

None - research-only phase.

### Changed

None - research-only phase.

### Fixed

None - research-only phase.

### Verification

- Research output: `research/029-skill-advisor-hook-improvements-pt-01/research.md`
- 10 iteration narratives with evidence anchored to `path:line` references
- Findings: 5 P1, 3 P2
- P1-001: OpenCode uses 0.7 default threshold vs 0.8 shared runtime, native bridge ignores `thresholdConfidence`.
- P1-002: OpenCode cache invalidation keyed to bridge build files instead of freshness/generation.
- P1-003: Codex native-hook mode bypasses shared brief pipeline.
- P1-004: `advisor_status.laneWeights` is static default despite promotion code modeling richer state.
- P1-005: Hook telemetry is write-only: no durable consumer, no runtime outcome signal.
- P2-006: `advisor_validate` missing runtime-parity slice.
- P2-007: Promotion telemetry/persistence claims ahead of implementation.
- P2-008: Operator docs reference old `.opencode/plugins/` bridge path.

### Files Changed

| File | What changed |
|------|--------------|
| (none) | Research-only phase produced no file modifications. |

### Follow-Ups

- Unify threshold defaults and cache invalidation across all runtimes.
- Wire outcome signals into telemetry.
- Fix operator doc bridge path references.
