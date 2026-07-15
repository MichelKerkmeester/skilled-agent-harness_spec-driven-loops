---
title: "Changelog: Launcher Concurrency Spawn & Bridge Investigation (deep-research) [003-memory-and-causal-runtime/027-launcher-concurrency-spawn-and-bridge-investigation]"
description: "Chronological changelog for the Launcher Concurrency Spawn & Bridge Investigation (deep-research) phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-15

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/027-launcher-concurrency-spawn-and-bridge-investigation` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime`

### Summary

Read-only deep-research packet investigating two root causes in the spec-kit launcher-coordination layer, both surfaced by the owner's heavy concurrent-session workflow. Canonical research output lives in research/research.md; this spec.md records the investigation ask, scope, and open questions.

### Added

- None. This is a read-only research phase; no code or configuration was introduced.

### Changed

- Investigated two launcher-coordination root causes under concurrent multi-session use: T1 (hf-local model server spurious spawn via a boot-time liveness probe misinterpreted as an embed demand) and T2 (mk_code_index and mk_skill_advisor secondary-session disconnect because the daemon IPC bridge socket is not serving at runtime).
- Produced a unified design-conformance fix plan grounded in the 006-mcp-launcher-concurrency design history (packets 010, 012, 007) and ADR-013/014 embedder design.

### Fixed

- None. This phase is research-only; no code was changed.

### Verification

- No explicit verification recorded (read-only investigation).

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- Actual code fixes for T1 and T2 are deferred to a follow-up phase implementing the unified design-conformance fix plan from research/research.md.
