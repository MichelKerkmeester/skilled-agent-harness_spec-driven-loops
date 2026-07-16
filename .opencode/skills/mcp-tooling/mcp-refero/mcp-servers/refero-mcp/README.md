---
title: "refero-mcp"
description: "The remote Refero MCP for the mcp-refero skill, reached through this project's Code Mode via the mcp-remote bridge. A manual registration, not a vendored server."
trigger_phrases:
  - "refero mcp server"
  - "refero mcp-remote"
  - "refero code mode"
---

# refero-mcp

> The remote Refero MCP for the mcp-refero skill, reached through this project's Code Mode. Nothing is installed here: it is a manual registration bridging to a paid remote service, not a vendored server.

---

## 1. OVERVIEW

The Refero MCP is a **remote, paid, read-only** design-reference search service at `https://api.refero.design/mcp`, exposing eight tools across three layers (styles, screens, flows). It is already registered as the `refero` manual in the repo's `.utcp_config.json`, which launches `npx -y mcp-remote https://api.refero.design/mcp` as a stdio bridge, so no install step happens in this folder. The manual is validated as-is: verify, never re-add, never edit.

Access is plan-gated: the Free plan has **no MCP access at all**, Pro is the first tier with MCP (8,000 tool calls per month), and unauthenticated requests return HTTP 401. Authentication (browser OAuth, or the documented env-backed Bearer alternative) is **operator-only**; auth state persists under `~/.mcp-auth` and is never touched by the skill.

---

## 2. QUICK START

This manual needs no local install. Confirm it is reachable through Code Mode instead:

```ts
// Discover the live tool set before calling anything
const tools = await list_tools();
const info = await tool_info({ tool_name: "refero.refero_refero_search_styles" });
```

Expected result: `list_tools()` includes the `refero` manual's tools, and `tool_info()` returns a concrete schema for the doubled-prefix callable (requires completed operator auth). Fail closed if the eight documented tools are missing, renamed, or expanded.

---

## 3. CONFIGURATION

| Option | Value | Notes |
|---|---|---|
| Manual name | `refero` | Set in `.utcp_config.json`; validated as-is |
| Transport | stdio, `npx -y mcp-remote https://api.refero.design/mcp` | HTTP-first bridge; SSE fallback only after a 404; `mcp-remote` intentionally unpinned |
| Auth | Browser OAuth (default) or env-backed Bearer header (alternative) | Operator-only; state in `~/.mcp-auth`; end-to-end OAuth is Inferred, not verified |
| Call syntax | `refero.refero_refero_<tool>` | DOUBLED prefix (the tools' own names already start with `refero_`); confirm via `tool_info` |
| Plan | Refero Pro or higher | Free has no MCP access; Pro quota is 8,000 calls/month |

---

## 4. TROUBLESHOOTING

| What You See | Cause | Fix |
|---|---|---|
| HTTP 401 on every call | Not authenticated; the empty manual `env` is not anonymous access | Operator completes browser OAuth on a Pro (or higher) account, or wires the documented Bearer alternative |
| `refero.refero_<tool>` not found | Single-prefix name; the convention doubles the prefix | Use `refero.refero_refero_<tool>` and confirm with `tool_info` first |
| `-32000 Connection closed` from Code Mode | Code Mode running on Node 25 (isolated-vm SIGSEGV) | Run Code Mode on Node 24 |
| Tools missing after wiring changes | Manuals load at Code Mode startup | Reconnect Code Mode, then re-run discovery |

---

## 5. RELATED RESOURCES

### Related Documents

| Document | Purpose |
|---|---|
| [`../../references/mcp_wiring.md`](../../references/mcp_wiring.md) | Full wiring: the registered manual, OAuth/Bearer, naming, and discovery |
| [`../../references/tool_surface.md`](../../references/tool_surface.md) | The eight-tool contract, funnel, and plan gating |
| [`../../assets/utcp_refero_manual.md`](../../assets/utcp_refero_manual.md) | The byte-preserved manual snapshot and the Bearer alternative |
| [`../../SKILL.md`](../../SKILL.md) | Runtime contract for the mcp-refero skill |

### Source

- Service: [refero.design/mcp](https://refero.design/mcp) (docs: doc.refero.design; paid, read-only, not vendored)
- Bridge: [`mcp-remote`](https://www.npmjs.com/package/mcp-remote) (npm, unpinned, experimental per its own description)
