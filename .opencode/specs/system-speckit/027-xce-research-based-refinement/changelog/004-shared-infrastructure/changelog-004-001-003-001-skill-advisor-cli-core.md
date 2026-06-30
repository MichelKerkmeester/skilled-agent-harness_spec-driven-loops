---
title: "Changelog: 003-skill-advisor-cli / 001-cli-core"
description: "Skill-advisor CLI core shipped: manifest-backed 9-command CLI with byte-identical schemas, trusted-mutation gate, isolated daemon smoke, exit taxonomy 0/1/64/69/75, and stale-dist guard."
trigger_phrases:
  - "skill-advisor cli core changelog"
  - "skill-advisor phase 1 changelog"
  - "skill-advisor shim changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-09

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/001-cli-core` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli`

### Summary

The skill-advisor CLI core shipped as a manifest-backed CLI layer over the existing advisor daemon contract. The CLI exposes 9 commands with byte-identical schemas to `TOOL_DEFINITIONS`, enforces a trusted-mutation rejection gate on graph-mutating commands both CLI-side and daemon-side, maps exits to 0/1/64/69/75, and guards stale dist with a dev override. The Python facade `skill_advisor.py` was intentionally left untouched for later facade reconciliation fixtures.

### Added

- `.opencode/skills/system-skill-advisor/mcp_server/skill-advisor-cli.ts` — CLI dispatcher, trusted-mutation gate, output contracts, and exit taxonomy
- `.opencode/skills/system-skill-advisor/mcp_server/skill-advisor-cli-manifest.ts` — manifest-backed command registry from `TOOL_DEFINITIONS`
- `.opencode/bin/skill-advisor.cjs` — stable shim with dist-freshness guard and `MK_SKILL_ADVISOR_CLI_DEV_ALLOW_STALE` override

### Changed

- `.opencode/skills/system-skill-advisor/mcp_server/tsconfig.build.json` — includes CLI and manifest files in the build

### Fixed

- None

### Verification

| Check | Result |
|-------|--------|
| Clean build (TypeScript 5.9.3) | PASS |
| Manifest parity | 9 commands with byte-identical schemas to `TOOL_DEFINITIONS` |
| Daemon smoke (`advisor_status`) | PASS (isolated) |
| Trusted mutation gate | Rebuild, scan, propagate-apply rejected untrusted callers: exit 64 (CLI-side and daemon-side) |
| Exit taxonomy | 0/1/64/69/75 verified |
| Dist freshness | Stale dist: exit 69; dev override verified |

### Files Changed

| File | Action | Purpose |
|------|---------|---------|
| `.opencode/skills/system-skill-advisor/mcp_server/skill-advisor-cli.ts` | Added | CLI dispatcher, trusted-mutation gate, output contracts, exits |
| `.opencode/skills/system-skill-advisor/mcp_server/skill-advisor-cli-manifest.ts` | Added | Manifest-backed 9-command registry |
| `.opencode/bin/skill-advisor.cjs` | Added | Stable shim with dist-freshness guard and dev override |
| `.opencode/skills/system-skill-advisor/mcp_server/tsconfig.build.json` | Updated | CLI and manifest included in build |

### Follow-Ups

- Facade reconciliation fixtures for `skill_advisor.py` remain phase 002 work
