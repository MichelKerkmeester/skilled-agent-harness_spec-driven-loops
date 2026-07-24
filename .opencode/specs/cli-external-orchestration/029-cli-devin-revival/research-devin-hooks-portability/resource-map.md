---
title: "Resource Map — devin-hooks-claude-opencode-plugin-portability: Investigate every Claude Code hook and every OpenCode plugin currently defined in this repo (.claude settings hooks, .opencode plugin registrations, the 7 repo guard hooks referenced by cli-codex hook-contract.md: spec-gate-enforce/classify, dispatch-preflight-lint, post-edit-quality, code-graph-freshness, dispatch-audit, completion-evidence-sentinel, mcp-route-guard) against Devin CLI real current hook contract (PreToolUse/PostToolUse/PermissionRequest/UserPromptSubmit/Stop/PostCompaction/SessionStart/SessionEnd via .devin/hooks.v1.json, confirmed in 001-devin-contract-pin/implementation-summary.md). For each hook or plugin determine: portable 1:1, needs adaptation, or cannot port and why. Also evaluate whether Devin native read_config_from.claude:true import could substitute for some ports instead of hand-built adapters. Produce a concrete per-hook per-plugin port verdict table with rationale, to directly inform phase 004-devin-hook-adapter-layer ADR-001."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 1
- **By category**: READMEs=0, Documents=0, Commands=0, Agents=0, Skills=0, Specs=0, Scripts=0, Tests=0, Config=1, Meta=0
- **Missing on disk**: 0
- **Scope**: research convergence output for 029-cli-devin-revival
- **Generated**: 2026-07-24T05:07:04.622Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 9. Config

> Machine-readable configuration: `.json`, `.jsonc`, `.yaml`, `.yml`, `.toml`, `.env.example`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .claude/settings.json | Cited | OK | Citations=1; Iterations=1 |

---
