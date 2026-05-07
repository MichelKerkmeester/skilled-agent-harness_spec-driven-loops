---
title: "Research 011/031: Skill advisor gap investigation pt-01"
description: "Gap investigation found 8 missed interconnected files outside packet 014's implementation target set. 6 P1, 2 P2 findings on downstream docs, playbooks, and test gaps."
trigger_phrases:
  - "research 011/031 pt-01 changelog"
  - "skill advisor gap investigation"
importance_tier: "normal"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-24

> Spec folder: `026-graph-and-context-optimization/008-skill-advisor/011-skill-advisor-hook-improvements/research/031-skill-advisor-gap-investigation-pt-01` (Level 2)
> Parent packet: `026-graph-and-context-optimization/008-skill-advisor`

### Summary

This gap investigation found 8 genuinely missed interconnected files outside packet 014's `resource-map.md` and outside the packet's explicit implementation target set. Packet 014 updated the narrow code-facing surfaces but left adjacent feature-catalog and manual-playbook leaves stale. Bridge relocation created a split-brain doc problem: code and plugin README moved to `.opencode/plugin-helpers/`, but operator-facing docs still reference the older `.opencode/plugins/` vocabulary.

### Added

None - research-only phase.

### Changed

None - research-only phase.

### Fixed

None - research-only phase.

### Verification

- Research output: `research/031-skill-advisor-gap-investigation-pt-01/research.md`
- Findings: 6 P1, 2 P2
- P1: 4 feature-catalog/playbook files still point to old bridge path and 0.7 threshold wording.
- P1: 2 feature-catalog/playbook files omit 014 public output fields and telemetry contract.
- P2: `advisor-recommend.vitest.ts` does not assert `workspaceRoot` or `effectiveThresholds`.
- P2: `SET-UP_GUIDE.md` uses stale shorthand for bridge helper location.
- Missed files table documents all 8 paths with relevance, category, and update need.

### Files Changed

| File | What changed |
|------|--------------|
| (none) | Research-only phase produced no file modifications. |

### Follow-Ups

- Update 6 downstream docs/playbooks with current bridge path and threshold wording.
- Add focused regression for `workspaceRoot` and `effectiveThresholds` to `advisor-recommend.vitest.ts`.
- Clean up setup-guide bridge path drift.
