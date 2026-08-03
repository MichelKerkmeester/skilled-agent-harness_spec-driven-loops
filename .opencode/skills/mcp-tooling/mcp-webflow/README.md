---
title: mcp-webflow
description: Webflow MCP 2.0 transport for the mcp-tooling hub: operate sites, pages, CMS, components, variables, assets, scripts, and workflows through the official Webflow MCP server via Code Mode, under a frozen safety contract with sk-design pairing.
trigger_phrases:
  - "webflow"
  - "webflow mcp"
  - "webflow cms"
  - "webflow publish"
  - "webflow designer"
version: 1.3.0.0
---

# mcp-webflow

> Webflow MCP 2.0 transport mode: operate Webflow sites, pages, CMS, components, variables,
> assets, scripts, and workflows through Webflow's official MCP server via Code Mode. The
> transport executes; the hub orchestrates; `sk-design` owns taste.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Reading and mutating Webflow sites/pages/CMS/components/variables/assets/scripts/workflows; Designer-family edits (paired with `sk-design`); gated publish/deploy |
| **Invoke with** | "webflow", "webflow mcp", "webflow cms", "webflow publish", or hub routing on Webflow signals |
| **Works on** | The official `webflow-mcp-server` (local stdio, `WEBFLOW_TOKEN`) or the remote Webflow MCP service (OAuth) |
| **Surface** | Remote: 31 tools / 220 actions (docs, 2026-08-03); local OSS: 18 modules |
| **Needs** | Operator `WEBFLOW_TOKEN` + dedicated test site for live calls (currently BLOCKED — recorded) |

## 2. OVERVIEW

Webflow MCP 2.0 exposes Webflow's Data API v2 and Designer API as bounded combined tools. This
packet documents the complete remote surface (31 tools / 220 actions with required parameters),
the local OSS baseline (18 modules), the frozen risk classes (RO/DW/DS/PB/DP/UNKNOWN) and their
gates, the least-privilege auth model, and 16 deterministic manual-testing scenarios. The
transport never mutates this workspace (`mutatesWorkspace: false`; Write/Edit/Task forbidden);
all mutations land in Webflow's cloud under the frozen gates. Designer-family operations always
pair with `sk-design`.

## 3. QUICK START

1. Follow [`INSTALL-GUIDE.md`](INSTALL-GUIDE.md): create a least-privilege Site Token, export
   `WEBFLOW_TOKEN` (name documented in `.env.example` as `webflow_WEBFLOW_TOKEN`).
2. Run `bash scripts/doctor.sh` (verify-only; token presence as boolean, never values).
3. Discover per session: `list_tools()` filtered to the `webflow.webflow.*` namespace; compare
   against [`references/action-reference.md`](references/action-reference.md) (remote) and
   [`references/tool-surface.md`](references/tool-surface.md) (local OSS).
4. Classify every call against the frozen matrix; DS/PB/DP require operator confirmation.

## 4. DOCUMENTATION MAP

| Doc | Purpose |
|---|---|
| [`SKILL.md`](SKILL.md) | Mode contract: routing, classes, gates, execution protocol, safety rules |
| [`INSTALL-GUIDE.md`](INSTALL-GUIDE.md) | Operator setup: token, scopes, verification, version pinning |
| [`references/action-reference.md`](references/action-reference.md) | Complete remote action reference (31 tools / 220 actions, params) |
| [`references/tool-surface.md`](references/tool-surface.md) | Local OSS 18-module baseline with risk classes |
| [`references/mcp-wiring.md`](references/mcp-wiring.md) | Wiring, auth, scope model, rate limits, Bridge App boundary |
| [`references/troubleshooting.md`](references/troubleshooting.md) | Failure modes and never-list |
| [`feature-catalog/`](feature-catalog/feature-catalog.md) | Capability cards (9) covering the full surface |
| [`manual-testing-playbook/`](manual-testing-playbook/manual-testing-playbook.md) | 16 scenarios across discovery, read, draft, safety, pairing, negative |
| [`scripts/`](scripts/README.md) | `doctor.sh` + `install.sh` |
| [`assets/`](assets/utcp-manual-reference.md) | Registered-manual reference shape + payload examples + examples/ |

## 5. TROUBLESHOOTING

See [`references/troubleshooting.md`](references/troubleshooting.md): auth/403 causes, discovery
failures, 429/`Retry-After`, publish queue, Designer Bridge App, surface drift, redaction rules.
Run `bash scripts/doctor.sh` first.

## 6. VERIFICATION

- Skill package: `validate_skill_package.py` PASS; `package_skill.py --check` PASS (strict leaves
  only the hub-wide `INSTALL-GUIDE.md` naming convention, identical to mcp-obsidian).
- Hub: `ci-skill-root-metadata` 11/11; leaf-manifest fresh; routing benchmark 12/12.
- Live discovery + smoke: BLOCKED pending operator token/test site (recorded in the packet).

## 7. RELATED DOCUMENTS

- Official MCP tool docs: developers.webflow.com/mcp/tools/* (data, designer, utility)
- Official server: github.com/webflow/mcp-server (local OSS baseline)
- Research base: `../../specs/mcp-tooling/015-mcp-webflow/001-deep-research/research/research.md`
- Changelog: [`changelog/`](changelog/v1.3.0.0.md)
