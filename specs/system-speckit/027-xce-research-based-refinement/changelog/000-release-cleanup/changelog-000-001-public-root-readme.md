---
title: "Changelog: 001-public-root-readme"
description: "Release-capstone rewrite of the repository root README to match the current framework state, shipped surfaces, CLI front doors, and memory/code/advisor tool counts."
trigger_phrases:
  - "000 001 public root readme changelog"
  - "release cleanup readme changelog"
  - "root README current framework state"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-10

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/001-public-root-readme` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup`

### Summary

The public root `README.md` was rewritten as the release capstone. It now describes the current AI-assistant framework, Spec Kit workflow, memory system, MCP-to-CLI dual-stack, Code Graph, Skill Advisor, checked-in skills, commands, agents, install path, configuration files, and next-document pointers. The pass removed stale counts and stale external-provider claims.

### Added

- Current pointers for the memory, code-graph, and skill-advisor surfaces, including the 37/8/9 tool counts and the three daemon-backed CLI front doors.

### Changed

- Rewrote `README.md` to current-state onboarding prose instead of release-packet history.
- Reconciled this child phase's `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, `description.json`, and `graph-metadata.json` to completed state.

### Fixed

- Removed stale 22-skill, 11-agent, 24-command, stale docs-index, and stale external-provider claims from the public overview.

### Verification

| Check | Result |
|-------|--------|
| Surface-count spot checks | PASS: implementation summary records 21 skills, 12 OpenCode agents, 28 commands, 5 MCP servers, and 3 CLI front doors |
| MCP/tool count spot checks | PASS: 37/8/9 tool counts verified against current docs and runtime config |
| Strict validation | PASS: child phase `validate.sh --strict` exited 0 |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `README.md` | Rewritten | Public framework overview aligned to shipped reality |
| `001-public-root-readme/{spec.md,plan.md,tasks.md,implementation-summary.md}` | Updated | Phase status and completion evidence reconciled |

### Follow-Ups

- Monitor README drift as shipped surfaces evolve.
