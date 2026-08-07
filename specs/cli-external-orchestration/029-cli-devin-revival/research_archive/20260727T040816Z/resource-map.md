---
title: "Resource Map — devin-as-mcp-host-feasibility: Investigate whether Devin CLI can genuinely host this repos MCP servers (spec-kit-memory, code-graph, skill-advisor) as referenced by Devin-as-MCP-host in project INSTALL_GUIDEs (a surface the original cli-devin deprecation explicitly left untouched, per z_archive/022-cli-devin-deprecation/context/context-report.md). Confirm Devin real devin mcp add/list/get/remove/login/logout/enable/disable surface (docs.devin.ai/cli/extensibility/mcp/overview.md and configuration.md) against what these 3 MCP servers actually require (stdio vs http transport, env vars, auth, working directory). Determine whether bringing this into scope for the cli-devin revival (029-cli-devin-revival) is worthwhile, and if so what a new phase would need to cover. This directly resolves Open Question 3 in the parent spec.md (currently scoped OUT by default)."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 3
- **By category**: READMEs=0, Documents=0, Commands=0, Agents=0, Skills=2, Specs=0, Scripts=0, Tests=0, Config=1, Meta=0
- **Missing on disk**: 2
- **Scope**: research convergence output for 029-cli-devin-revival
- **Generated**: 2026-07-24T05:58:54.299Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 5. Skills

> `.opencode/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `mcp-server/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/skills/system-skill-advisor/mcp-server/advisor-server.ts | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/system-spec-kit/mcp-server/tool-schemas.ts:413-415; context-server.ts | Cited | MISSING | Citations=1; Iterations=1 |

---

## 9. Config

> Machine-readable configuration: `.json`, `.jsonc`, `.yaml`, `.yml`, `.toml`, `.env.example`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| opencode.json:47-66; .mcp.json | Cited | MISSING | Citations=1; Iterations=1 |

---
