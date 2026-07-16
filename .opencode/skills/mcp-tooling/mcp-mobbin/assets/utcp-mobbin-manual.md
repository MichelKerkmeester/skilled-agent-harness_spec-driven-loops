---
title: "Mobbin Code Mode Manual - registered reference shape"
description: "The REGISTERED mobbin .utcp_config.json manual entry (registered 2026-07-16), kept byte-identical to the researched drafts: stdio npx mcp-remote bridge to the hosted Mobbin MCP with an intentionally empty env, plus the post-registration checklist with doc-side items executed and live items pending."
trigger_phrases:
  - "mobbin utcp config"
  - "mobbin manual snippet"
  - "mobbin mcp-remote manual"
  - "mobbin registered manual"
importance_tier: normal
contextType: implementation
version: 1.1.0.0
---

# Mobbin Code Mode Manual - registered reference shape

The `mobbin` manual entry for this repo's `.utcp_config.json`, exactly as produced by the completed research (two independent lineages authored **byte-identical** JSON drafts; the adopted draft was applied verbatim). This asset now exists as the **reference shape** for the registered manual: it is the byte-for-byte record the live config is checked against.

> **REGISTERED — 2026-07-16.** The manual **is present** in `.utcp_config.json` (`manual_call_templates[]`), registered by an operator with the exact shape below (stdio `npx -y mcp-remote https://api.mobbin.com/mcp`, empty `env`). Discovery has **NOT** run yet (it needs a fresh Code Mode session — manuals load at startup), operator browser OAuth has **NOT** been completed, and the callable name therefore remains **Inferred** until `tool_info` confirms it. Manual **absence** is now a failure symptom (a broken or reverted registration), not an expected state.

---

## 1. THE REGISTERED MANUAL (REFERENCE SHAPE; NEVER EDITED FROM THIS PACKET)

**Key Points**:
- Manual `name` is `mobbin`. Live discovery (2026-07-16, `../references/discovery-fixture-2026-07-16.json`) **confirmed** the convention: dotted discovery names `mobbin.mobbin.{search_screens,search_flows,search_sections}`, TS callables `mobbin.mobbin_search_screens(...)` etc.
- Transport is `stdio`: Code Mode launches `npx -y mcp-remote https://api.mobbin.com/mcp`, which bridges stdio to Mobbin's hosted **Streamable HTTP** endpoint (HTTP-first; SSE fallback only after HTTP 404). The provider itself is never stdio or SSE.
- The `env` block is **intentionally empty and must stay empty**: Mobbin MCP authentication is browser OAuth (DCR, PKCE S256, `openid`). **No `MOBBIN_API_KEY` or any auth env var exists** — no credential of any kind goes into `.utcp_config.json` or `.env`. No `.env` line is required for this manual.
- `mcp-remote` is intentionally **unpinned** (experimental, externally versioned; Node 18+ and working `npx` are prerequisites). Do not pin it here unless separately requested.
- The local Code Mode config surface documents `stdio`/`sse` manual shapes only, which is why this manual bridges through `mcp-remote`. If Code Mode later validates direct Streamable HTTP, prefer the direct URL after validating its OAuth behavior.

**Reference shape** (registered verbatim; kept exactly as researched):

```json
{
  "name": "mobbin",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "mobbin": {
        "transport": "stdio",
        "command": "npx",
        "args": [
          "-y",
          "mcp-remote",
          "https://api.mobbin.com/mcp"
        ],
        "env": {}
      }
    }
  }
}
```

If this asset and the live `.utcp_config.json` ever disagree, **the live config wins** and this asset must be re-synced from it; never the other way around. As of 2026-07-16 the two match byte-for-byte on every field (verified by parsing the live config and comparing `transport`/`command`/`args`/`env`).

---

## 2. POST-REGISTRATION CHECKLIST (DOC-SIDE ITEMS EXECUTED; LIVE ITEMS PENDING)

Registration landed 2026-07-16. Items an agent can verify from the repo are marked done with evidence; items that need a fresh Code Mode session, an operator browser round-trip, or an authenticated paid account stay open as valid SKIPs with the exact command each one needs.

- [x] Validate the config JSON parses and the `mobbin` entry matches the reference shape (stdio, `npx -y mcp-remote https://api.mobbin.com/mcp`, empty `env`). [evidence: `python3 -c "json.load(open('.utcp_config.json'))"` parses; 1 `mobbin` entry; `transport: stdio`, `args: ['-y','mcp-remote','https://api.mobbin.com/mcp']`, `env: {}` — field-for-field match, 2026-07-16]
- [ ] Reconnect Code Mode — manuals load at startup, so this registration needs a fresh Code Mode session before its tools resolve. [SKIP-valid: restart/reconnect the Code Mode MCP server, then verify with `list_tools()` inside Code Mode]
- [ ] Complete the **operator-only** browser OAuth on a paid account (Pro, Team, or Enterprise; Free has no MCP access). Auth state persists under `~/.mcp-auth` (or `MCP_REMOTE_CONFIG_DIR`) and stays operator-owned. [SKIP-valid: trigger any first `mobbin.*` call in a fresh Code Mode session and complete the browser authorization; no agent-side command exists]
- [x] Run discovery: DONE 2026-07-16, pre-auth, via direct stdio MCP probe of CodeMode-MCP. Actual names: registry `mobbin.mobbin.{search_screens,search_flows,search_sections}` (dotted), TS callables `mobbin.mobbin_search_screens(...)` etc. — THREE tools, superseding the one-tool baseline. [evidence: `../references/discovery-fixture-2026-07-16.json` `discoveredCallableNames` + `tool_info_first`]
- [x] Confirm the live tool set against the documented baseline: DONE 2026-07-16 — three tools listed (`search_screens`, `search_flows`, `search_sections`), superseding the one-tool baseline via a reviewed packet update; all read-only, mutation-refusal check passed. Future drift from the fixture three-tool baseline still fails closed. [evidence: `../references/discovery-fixture-2026-07-16.json` `list_tools` + `discoveredCallableNames`]
- [x] Check the live schema for the open items: RESOLVED 2026-07-16 — `deep` IS a client-settable input (`mode?: "deep" | "standard" | "fast"` on `search_screens`), and the schema exposes `exclude_screen_ids` and `image_format` beyond `query`/`platform`/`limit`. [evidence: `../references/discovery-fixture-2026-07-16.json` `tool_info_first` schema]
- [ ] Run one `limit: 1` smoke search and verify inline images actually arrive through `call_tool_chain` (their fidelity through Code Mode is UNKNOWN until observed). [SKIP-valid: `call_tool_chain` with the confirmed callable, `{ query: "onboarding", platform: "ios", limit: 1 }`, then check for the inline image block]
- [x] Confirm no credential of any kind was added anywhere (`env` still empty; no `.env` line). [evidence: registered entry carries `"env": {}`; `.env` contains no `mobbin`/`MOBBIN_API_KEY` entry — grep clean, 2026-07-16]
- [x] Update this packet's references with the registered-state truth; live-discovery results still land here after discovery runs, and drift means a reviewed packet update, not an improvised call. [evidence: packet docs flipped to registered-state truth in v1.1.0.0 (this changelog); dated live-discovery results remain pending the discovery items above]

---

## 3. RELATED RESOURCES

- [mcp-wiring.md](../references/mcp-wiring.md) - the full wiring reference: bridge behavior, OAuth/DCR/PKCE, auth state, inferred naming, and discovery.
- [tool-surface.md](../references/tool-surface.md) - the single-tool contract the manual exposes.
- [troubleshooting.md](../references/troubleshooting.md) - failure modes, including the expected pre-auth 401 and entitlement denials.
