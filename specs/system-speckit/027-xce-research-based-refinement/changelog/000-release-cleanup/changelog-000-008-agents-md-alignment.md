---
title: "Changelog: 008-agents-md-alignment"
description: "Aligned root AGENTS.md governance to current schema, flag, CLI-front-door, and constitutional-rule reality while preserving immutable Four Laws and Gate text."
trigger_phrases:
  - "000 008 AGENTS.md changelog"
  - "root governance alignment"
  - "Four Laws unchanged"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-10

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/008-agents-md-alignment` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup`

### Summary

Root `AGENTS.md` was reconciled to shipped governance reality without changing the Four Laws or any Gate text. The update added current pointers for schema v37, opt-in feature flags, daemon-backed CLI front doors, and advisory constitutional memory rules.

### Added

- Current Spec Kit Memory schema v37 and default-off/opt-in rollout flag pointer.
- Daemon-backed CLI front-door relationship for the three daemon MCP systems.
- Constitutional-rule pointer for the advisory memory invariants.

### Changed

- Updated root governance prose outside immutable sections.
- Reconciled this phase's spec docs and metadata to complete.

### Fixed

- Confirmed `CLAUDE.md` remains a symlink to root `AGENTS.md` and left existing completion-freshness and Logic-Sync governance unchanged.

### Verification

| Check | Result |
|-------|--------|
| Shipped schema check | PASS: `SCHEMA_VERSION = 37` |
| Rollout flag check | PASS |
| Constitutional rules check | PASS |
| CLI front-door check | PASS |
| Four Laws unchanged | PASS: before/after hash stable |
| Gates unchanged | PASS: before/after hash stable |
| Strict validation | PASS: child phase `validate.sh --strict` exited 0 |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `AGENTS.md` | Modified | Additive governance alignment |
| `008-agents-md-alignment/{spec.md,plan.md,tasks.md,implementation-summary.md}` | Updated | Phase completion evidence reconciled |

### Follow-Ups

- None for this child phase.
