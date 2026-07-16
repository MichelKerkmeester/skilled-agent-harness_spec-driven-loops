---
title: "Resource Map — Refero MCP developer surface for the mcp-refero transport packet (fan-out consolidation: sol + glm + luna)"
description: "Consolidated research resource map merged from fan-out lineage resource maps and lineage-cited source inventories."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 13 local + 17 external
- **By category**: READMEs=1, Documents=8, Commands=0, Agents=0, Skills=0, Specs=0, Scripts=0, Tests=0, Config=4, Meta=0 (external URLs listed separately)
- **Missing on disk**: 0 (all 13 local paths re-verified present at consolidation time)
- **Scope**: fan-out research convergence output for `001-research` (3 lineages)
- **Generated**: 2026-07-16 (synthesis step)

> **Consolidation note:** this map is consolidated from lineage resource maps rather than produced by the base-dir reducer, because the reducer does not apply to the fan-out layout. Inputs: `lineages/sol/resource-map.md` (7 entries), `lineages/luna/resource-map.md` (emitted but **empty** — 0 entries), and **glm emitted no resource map** — its cited-source inventory was extracted from `lineages/glm/research.md` §15 instead. Entries deduplicated; sol's auto-generated `MISSING` statuses corrected to `OK` after re-verification against the repository root.

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 1. READMEs

| Path | Action | Status | Note |
|------|--------|--------|------|
| file:.opencode/skills/mcp-code-mode/README.md | Cited | OK | Code Mode manual-prefix naming rule ([CONFLICT-1] evidence); sol |

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| file:.opencode/skills/mcp-code-mode/SKILL.md | Cited | OK | Discovery-first, error handling, timeout, Bash-boundary contracts; sol (map) + glm |
| file:.opencode/skills/mcp-tooling/SKILL.md | Cited | OK | Hub identity; transport-vs-mode boundary; sol |
| file:.opencode/skills/mcp-tooling/mcp-figma/SKILL.md | Cited | OK | Transport-packet precedent; glm + sol |
| file:.opencode/skills/mcp-tooling/mcp-figma/manual_testing_playbook/manual_testing_playbook.md | Cited | OK | Manual-test scenario convention (PASS/PARTIAL/FAIL/SKIP); sol (map) |
| file:.opencode/skills/sk-design/SKILL.md | Cited | OK | Judgment-pairing contract; taste-authority boundary; sol (map) + glm + luna |
| file:.opencode/skills/sk-design/shared/context_loading_contract.md | Cited | OK | sk-design context loading; sol |
| file:.opencode/skills/sk-design/design-interface/references/mcp_tooling/refero_tools.md | Cited | OK | Live-verified doubled-prefix invocation, Node 24 constraint, tool catalog to de-duplicate; sol; re-verified during synthesis |
| file:.opencode/skills/sk-design/design-interface/references/design_grounding/design_references_mcp.md | Cited | OK | One-reference/no-chooser/no-copy judgment discipline; sol |

## 9. Config

> Machine-readable configuration: `.json`, `.jsonc`, `.yaml`, `.yml`, `.toml`, `.env.example`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| file:.utcp_config.json | Cited | OK | Existing `refero` manual (stdio, `npx -y mcp-remote https://api.refero.design/mcp`, empty env); cited by all 3 lineages; validated as-is |
| file:.opencode/skills/mcp-tooling/mode-registry.json | Cited | OK | Registry identity target for phase 002 (mode entry, transport axis, crossHubPairing); sol (map) |
| file:.opencode/skills/mcp-tooling/hub-router.json | Cited | OK | Router signals/tie-break target for phase 002; sol (map) |
| file:.opencode/skills/mcp-tooling/graph-metadata.json | Cited | OK | Hub projection to synchronize on packet addition; sol (map) |

## 10. External Sources

> URLs cited across lineage research; not tracked on disk. Lineage attribution in parentheses.

| URL | Role | Lineages |
|-----|------|----------|
| https://doc.refero.design/mcp/getting-started | Endpoint, OAuth/Bearer, Pro 8,000/mo quota | sol, luna |
| https://doc.refero.design/mcp/tools | Authoritative eight-tool surface + deprecations | sol, luna |
| https://doc.refero.design/mcp/data-model | UUID vs numeric IDs; pagination; growable fields | sol, luna |
| https://doc.refero.design/mcp/examples | Workflow recipes; sparse-flow reconstruction | sol, luna |
| https://doc.refero.design/mcp/business | Business usage/pricing illustration | sol, luna |
| https://doc.refero.design/help/plans | Tier gating (Free excluded; Lifetime wording) | sol, luna |
| https://api.refero.design/mcp | Live unauthenticated 401 observation | sol |
| https://api.refero.design/.well-known/oauth-authorization-server | OAuth AS metadata (grants, scopes, registration) | sol |
| https://refero.design/mcp (+ root, /pricing) | Pinned product page; SPA — title only via fetch (negative knowledge) | glm |
| https://github.com/referodesign/refero_skill | Official skill repo (methodology, MIT, master @ f78b4ecc…) | sol, glm, luna |
| https://raw.githubusercontent.com/referodesign/refero_skill/master/SKILL.md | Research-first methodology, tool routing | sol, glm, luna |
| https://raw.githubusercontent.com/referodesign/refero_skill/master/references/mcp-tools.md | Authoritative tool inventory + common mistakes | sol, glm, luna |
| https://raw.githubusercontent.com/referodesign/refero_skill/master/references/visual-workflow.md | Visual workflow adopt/reject inputs | sol |
| https://github.com/geelen/mcp-remote | Bridge behavior: OAuth, headers, transports, troubleshooting | sol, glm, luna |
| https://github.com/geelen/mcp-remote/blob/main/src/lib/mcp-auth-config.ts | Auth-state storage internals | sol |
| https://github.com/geelen/mcp-remote/blob/main/src/lib/protected-resource-metadata.ts | 404-tolerant OAuth discovery | sol |
| https://www.npmjs.com/package/mcp-remote | Version 0.1.38, unpinned/experimental status | sol |

---
