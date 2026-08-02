---
title: "mcp-webflow"
description: "Webflow MCP 2.0 transport mode: official Webflow Data/Designer API via the webflow Code Mode manual, with frozen safety classes (read-only, draft-write, destructive, publish, deploy) and sk-design pairing."
version: 1.0.0.0
---

# mcp-webflow

> Transport mode for operating Webflow through Webflow's official MCP 2.0 server, reached via Code Mode. The transport executes; the hub orchestrates; `sk-design` owns taste.

## When to use

- Any task that reads or mutates Webflow sites, pages, CMS collections, components, variables, assets, scripts, or workflows.
- Design changes: pair with `sk-design` (Designer-family operations require it).

## Operation classes (frozen)

| Class | Gate |
|---|---|
| Read-only | none (scope check) |
| Draft-write | none (scope check) |
| Destructive | operator confirmation + rollback |
| Publish | operator confirmation + staging-first |
| Deploy | operator confirmation |

## Wiring

- Transport: official `webflow-mcp-server` via the `webflow` Code Mode manual (`.utcp_config.json`), `WEBFLOW_TOKEN` from the environment.
- **Discover first, always**: `list_tools()` per session; per the Code Mode convention and the mobbin precedent the expected names are `webflow.webflow.<tool>` (registry) / `webflow.webflow_<tool>` (TypeScript) — UNVERIFIED until authenticated discovery.
- Docs: `INSTALL-GUIDE.md`, `references/mcp-wiring.md`, `references/tool-surface.md`, `references/troubleshooting.md`.

## Safety

- Nothing auto-publishes; publishing is always a separate explicit action.
- Smoke flows publish to `publishToWebflowSubdomain` only — never production `customDomains`.
- Honor `Retry-After` on 429; never blind-replay ambiguous non-idempotent writes.
- Workspace tokens are read-only; token values never enter the repository.
