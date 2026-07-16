---
title: "mobbin-mcp"
description: "The hosted remote Mobbin MCP for the mcp-mobbin skill, reached through this project's Code Mode via the mcp-remote bridge from the registered mobbin manual (discovery and OAuth pending). A hosted service pointer, not a vendored server."
trigger_phrases:
  - "mobbin mcp server"
  - "mobbin mcp-remote"
  - "mobbin code mode"
---

# mobbin-mcp

> The hosted remote Mobbin MCP for the mcp-mobbin skill. Nothing is installed here and nothing can be: the provider is a hosted service with no local source, and the local `mobbin` manual is registered in `.utcp_config.json` — this folder is a pointer, not a vendored server.

---

## 1. OVERVIEW

The Mobbin MCP is a **remote, paid, hosted** design-research service at `https://api.mobbin.com/mcp` (provider transport: **Streamable HTTP**), exposing one publicly documented tool, `search_screens`. The official repository (`mobbin/mobbin-mcp-server`, manifest identity `com.mobbin/mobbin` v1.0.1) contains registration and metadata artifacts only — README, `mcp.json`, `server.json`, `rules/`, `.cursor-plugin/` — so there is no server to clone, build, or install, and this folder holds only this pointer.

The local wiring is **registered**: a `mobbin` manual launching `npx -y mcp-remote https://api.mobbin.com/mcp` over stdio with an empty `env`, applied to `.utcp_config.json` on 2026-07-16 (operator-owned; reference shape kept in [`../../assets/utcp_mobbin_manual.md`](../../assets/utcp_mobbin_manual.md)). Discovery pends a fresh Code Mode session; OAuth pends the operator. Access is plan-gated (Pro, Team, or Enterprise; Free has no MCP access) and authenticated by **browser OAuth only** — no API key exists for MCP; unauthenticated requests return HTTP 401. Auth state persists under `~/.mcp-auth` and is never touched by the skill. The service enforces 60 requests per 60 seconds per user.

---

## 2. QUICK START

This provider needs no local install. In a fresh Code Mode session (manuals load at startup), confirm it is reachable through Code Mode instead:

```ts
// Discover the live tool set before calling anything
const tools = await list_tools();
const info = await tool_info({ tool_name: "mobbin.mobbin_search_screens" });
```

Expected result: `list_tools()` includes the `mobbin` manual's tools, and `tool_info()` returns a concrete schema — both work pre-auth (confirmed 2026-07-16: three tools listed, `mobbin.mobbin.{search_screens,search_flows,search_sections}`; fixture `references/discovery_fixture_2026-07-16.json`). Authenticated CALLS still require completed operator OAuth on a paid account. Fail closed if tools are missing, renamed, or expanded beyond the fixture three-tool baseline, and refuse any mutation-capable tool.

---

## 3. CONFIGURATION

| Option | Value | Notes |
|---|---|---|
| Manual name | `mobbin` | REGISTERED in `.utcp_config.json` (2026-07-16); discovery pends a fresh Code Mode session; OAuth pends the operator |
| Transport | stdio, `npx -y mcp-remote https://api.mobbin.com/mcp` | Local bridge to the hosted Streamable HTTP provider; HTTP-first, SSE fallback only after a 404; `mcp-remote` unpinned/experimental; Node 18+ |
| Auth | Browser OAuth only (DCR RFC 7591, PKCE S256, `openid`) | Operator-only; **no API key or auth env var exists**; `env` stays empty; state in `~/.mcp-auth`; end-to-end OAuth Inferred |
| Call syntax | `mobbin.mobbin_search_screens` (also `_search_flows`, `_search_sections`) | CONFIRMED 2026-07-16 (registry names dotted `mobbin.mobbin.<tool>`; fixture `references/discovery_fixture_2026-07-16.json`); re-confirm via `tool_info` per session |
| Plan | Mobbin Pro, Team, or Enterprise | Free has no MCP access; rate limit 60 req/60 s/user |

---

## 4. TROUBLESHOOTING

| What You See | Cause | Fix |
|---|---|---|
| No `mobbin.*` tools in Code Mode | Session predates the registration (manuals load at startup), OAuth incomplete, or the registration broke | Reconnect Code Mode in a fresh session, then re-run discovery; a missing manual is escalated to the operator |
| HTTP 401 on every call | Not authenticated; the empty `env` is correct, not the problem | Operator completes browser OAuth on a paid account. Never add an API key — none exists |
| Callable name differs from the fixture baseline | Provider surface drift since the 2026-07-16 discovery | Use the name `tool_info` returns; fail closed, save a fresh dated fixture, and update the packet docs |
| HTTP 429 | 60 requests / 60 seconds / user exceeded | Honor `Retry-After`, then exponential backoff with jitter |

---

## 5. RELATED RESOURCES

### Related Documents

| Document | Purpose |
|---|---|
| [`../../references/mcp_wiring.md`](../../references/mcp_wiring.md) | Full wiring: the registered manual, OAuth/DCR/PKCE, inferred naming, and discovery |
| [`../../references/tool_surface.md`](../../references/tool_surface.md) | The single-tool contract, intent workflows, plan gating, and rate limit |
| [`../../assets/utcp_mobbin_manual.md`](../../assets/utcp_mobbin_manual.md) | The registered manual's reference shape and the post-registration checklist |
| [`../../SKILL.md`](../../SKILL.md) | Runtime contract for the mcp-mobbin skill |

### Source

- Service: `https://api.mobbin.com/mcp` (paid, hosted; docs at docs.mobbin.com/mcp; not vendored). Registration metadata: [mobbin/mobbin-mcp-server](https://github.com/mobbin/mobbin-mcp-server)
- Official skills: [mobbin/skills](https://github.com/mobbin/skills) (MIT; single `mobbin-search` skill; guidance only, not a substitute for the manual or OAuth)
- Bridge: [`mcp-remote`](https://github.com/geelen/mcp-remote) (npm, unpinned, experimental per its own description; Node 18+)
