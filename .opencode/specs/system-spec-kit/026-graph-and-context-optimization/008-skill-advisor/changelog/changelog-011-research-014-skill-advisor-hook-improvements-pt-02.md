---
title: "Research 011/014: Skill advisor hook improvements pt-02"
description: "10-iteration deep research confirming improvement work centers on parity, threshold observability, MCP-surface consistency, and live-feedback blind spots."
trigger_phrases:
  - "research 011/014 pt-02 changelog"
  - "hook improvements research pt-02"
importance_tier: "normal"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-24

> Spec folder: `026-graph-and-context-optimization/008-skill-advisor/011-skill-advisor-hook-improvements/research/014-skill-advisor-hook-improvements-pt-02` (Level 2)
> Parent packet: `026-graph-and-context-optimization/008-skill-advisor`

### Summary

Packet-02 confirmed that the remaining skill-advisor improvement work is no longer centered on the already-closed CF-019 scorer bug. It is centered on parity, threshold observability, MCP-surface consistency, and live-feedback blind spots. The highest-signal drift is branch-specific: OpenCode splits threshold handling between native and fallback bridge routes, while Codex preserves a bespoke prompt-time path outside the shared build-and-render contract. The public MCP surface is more asymmetric than docs imply. Telemetry remains prompt-safe but lacks outcome signals.

### Added

None - research-only phase.

### Changed

None - research-only phase.

### Fixed

None - research-only phase.

### Verification

- Research output: `research/014-skill-advisor-hook-improvements-pt-02/research.md`
- 10 iteration narratives: `research/014-skill-advisor-hook-improvements-pt-02/iterations/iteration-01.md` through `iteration-10.md`
- Convergence: novelty moved from 0.32 to 0.04 across 10 iterations. Hit `max_iterations` before two-consecutive-below-threshold early-stop.
- Primary findings: OpenCode threshold split, Codex fast path bypass, MCP surface asymmetry, telemetry lacks outcome signals, validator missing runtime-parity slice, promotion claims ahead of implementation, operator doc drift

### Files Changed

| File | What changed |
|------|--------------|
| (none) | Research-only phase produced no file modifications. |

### Follow-Ups

- Unify threshold defaults across shared hooks, OpenCode, and the bridge.
- Normalize Codex prompt-time path onto shared brief pipeline.
- Add outcome signals to telemetry (accepted/corrected/ignored).
