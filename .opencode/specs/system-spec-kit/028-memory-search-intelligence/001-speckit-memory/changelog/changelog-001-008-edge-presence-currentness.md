---
title: "Changelog: Edge-Presence Currentness & Temporal Recall (028/001 impl phase) [001-speckit-memory/008-edge-presence-currentness]"
description: "Chronological changelog for the Edge-Presence Currentness & Temporal Recall (028/001 impl phase) phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-19

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory/008-edge-presence-currentness` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory`

### Summary

This is a re-plan: no production code has been shipped in this phase. The deliverable is the Level-3 planning set (spec, plan, tasks, checklist, decision-record) that converts the 028 research roadmap into a sequenced, gate-aware implementation plan for the five edge-presence-currentness candidates.

### Added

- CHK-003 Candidate seams identified before implementation.

### Changed

- CHK-004 Wave-0 done-evidence cross-checked; all five candidates confirmed PENDING.
- CHK-050 plan.md covers all five candidates + the C3-B substrate dependency.
- CHK-051 tasks.md has a task per candidate with its gate.
- CHK-052 decision-record.md records the load-bearing decisions.
- CHK-054 description.json / graph-metadata.json regeneration deferred to generate-context.js.
- CHK-060 Only this phase's scoped docs are authored.

### Fixed

- No fixes recorded.

### Verification

- Packet docs - validate.sh --strict on this phase
- Wave-0 done-evidence - git log --oneline 1ecc531431..ab5459fb6d filtered for temporal/history/unforget
- Code verification - n/a

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- CHK-001 C3-B four-timestamp window status confirmed in the sibling phase (substrate prerequisite).
- CHK-002 Canonical supersede writer designated (lineage); causal invalid_at confirmed derived.
- CHK-010 Memory MCP typecheck passes after each candidate.
- CHK-011 Memory MCP build passes after each candidate.
- CHK-012 Current-mode recall is byte-identical to baseline.
- CHK-020 C3-A read-side getValidEdges currentness filter implemented and tested.
