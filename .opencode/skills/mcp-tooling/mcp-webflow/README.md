# mcp-webflow

Webflow MCP 2.0 transport mode for the `mcp-tooling` hub: operate Webflow sites, pages, CMS, components, variables, assets, scripts, and workflows through Webflow's official MCP server via Code Mode — under a frozen safety contract.

## What this mode is

- **Transport**, not a workflow: mutations land in Webflow's cloud; the hub orchestrates; `sk-design` owns design judgment.
- Official server: `webflow-mcp-server` (npm), reached through the `webflow` Code Mode manual (`WEBFLOW_TOKEN` from the environment).
- Bounded surface: 18 tool modules with per-action risk classes.

## When to use

- Reading Webflow sites/pages/CMS/components/variables/assets.
- Draft-safe edits (content, settings, components, variables).
- Destructive, publish, and deploy operations — **only with operator confirmation** and rollback evidence.
- Designer-family changes — always paired with `sk-design`.

## Safety model (frozen)

| Class | Gate |
|---|---|
| Read-only | none (scope check) |
| Draft-write | none (scope check) |
| Destructive | operator confirmation + rollback |
| Publish | operator confirmation + staging-first (`publishToWebflowSubdomain`) |
| Deploy | operator confirmation |

- Nothing auto-publishes; never publish to production `customDomains` from smoke flows.
- Workspace tokens are read-only; token values never enter the repository.
- Discover tools first per session (`list_tools`); expected callables follow the Code Mode convention `webflow.webflow.<tool>` / `webflow.webflow_<tool>` — UNVERIFIED until authenticated discovery.

## Documentation map

| Doc | Purpose |
|---|---|
| `SKILL.md` | Mode entry contract and operation classes |
| `INSTALL-GUIDE.md` | Operator setup: token, scopes, verification, version pinning |
| `references/mcp-wiring.md` | Code Mode wiring, auth, discovery-first contract, remote OAuth alternative |
| `references/action-reference.md` | Complete remote-surface action reference (31 tools / 216 actions with params) |
| `references/tool-surface.md` | Local OSS 18-module tool inventory with risk classes (re-discover live) |
| `references/mcp-wiring.md` | Code Mode wiring, auth, scope model, rate limits, Bridge App boundary |
| `references/troubleshooting.md` | Failure modes and never-list |
| `feature-catalog/` | Capability cards: cms, publish-deploy, designer, site-pages-scripts, agent-instructions, analyze, localization-fonts-forms, sitemap-scripts-assets-whtml |
| `manual-testing-playbook/` | 16 scenarios across discovery, read, draft, safety gates, pairing, negative |
| `scripts/` | `doctor.sh` (verify-only) + `install.sh` |
| `assets/utcp-webflow-manual.md` | Registered manual reference shape |
| `examples/` | Worked scenarios per operation class |
| `changelog/` | Version history |
| `feature-catalog/` | Feature inventory |
| `manual-testing-playbook/` | Safe manual test scenarios |
