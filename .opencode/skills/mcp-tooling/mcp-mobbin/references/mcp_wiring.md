---
title: "Mobbin MCP Wiring (via Code Mode)"
description: "Wiring the Mobbin MCP through this project's Code Mode: the REGISTERED mobbin manual (registered 2026-07-16; discovery and OAuth pending), the mcp-remote stdio bridge to the hosted Streamable HTTP endpoint, browser OAuth with DCR and PKCE, the inferred callable naming, and the mandatory discovery-first contract."
trigger_phrases:
  - "mobbin mcp wiring"
  - "mobbin utcp manual"
  - "mobbin oauth"
  - "mcp-remote mobbin"
  - "mobbin code mode"
importance_tier: normal
contextType: implementation
version: 1.1.0.0
---

# Mobbin MCP Wiring (via Code Mode)

> **IMPORTANT:** The `mobbin` manual **IS REGISTERED** in `.utcp_config.json` (registered 2026-07-16 by an operator; this packet never edits the config itself). The registered entry matches the reference shape in [`../assets/utcp_mobbin_manual.md`](../assets/utcp_mobbin_manual.md) byte-for-byte. Discovery has **NOT** run yet — it needs a fresh Code Mode session (manuals load at startup) — so always **discover first** (`list_tools` / `tool_info`) and confirm the exact callable names: the predicted `mobbin.mobbin_search_screens` form is **Inferred**, not observed. Never claim OAuth works end-to-end; it is **Inferred** pending an operator-completed authorization.

---

## 1. OVERVIEW

Wiring here means the agent reaches Mobbin's remote, paid, hosted MCP (`https://api.mobbin.com/mcp`) through this project's **Code Mode** transport. The provider is a **hosted remote server over Streamable HTTP** — there is no local package to install; the official repository (`mobbin/mobbin-mcp-server`, manifest identity `com.mobbin/mobbin` v1.0.1) contains registration and metadata artifacts only (README, `mcp.json`, `server.json`, `rules/`, `.cursor-plugin/`). Code Mode consumes stdio; Mobbin speaks remote Streamable HTTP; the `mcp-remote` bridge connects them.

Claims below are tagged **[CONFIRMED]** (read from the cited primary docs, manifests, or live unauthenticated probes at research time, 2026-07-16), **[INFERRED]** (supported but not exercised end-to-end), or **[UNKNOWN]** (requires authenticated access or unpublished provider policy).

---

## 2. TRANSPORT AND INSTALL MODEL

| Concern | Contract | Packet implication |
|---------|----------|--------------------|
| Server URL | `https://api.mobbin.com/mcp` | Single remote endpoint **[CONFIRMED]** |
| Provider transport | Streamable HTTP (`server.json` `remotes:[{type:"streamable-http",...}]`) | Never describe Mobbin itself as stdio or SSE **[CONFIRMED]** |
| Provider install | None — hosted service; the repo is metadata-only | Do not clone, build, or install a Mobbin server **[CONFIRMED]** |
| Local adapter | `mcp-remote` launched over stdio via `npx -y` | Bridges remote HTTP/OAuth into the current Code Mode stdio manual shape **[CONFIRMED shape; end-to-end run INFERRED]** |
| Runtime | Node.js 18+ and working `npx` | `scripts/doctor.sh` checks both before any OAuth attempt |
| Network | Outbound HTTPS plus a localhost OAuth callback | Headless sessions need operator-visible escalation |

`mcp-remote` defaults to **HTTP-first with SSE fallback only on HTTP 404**; Mobbin requires Streamable HTTP, so no forced-SSE flag is needed. The adapter self-describes as experimental and is externally versioned — static compatibility does not equal a completed local OAuth/discovery run. **[CONFIRMED: mcp-remote docs; round trip INFERRED]**

The local Code Mode config surface documents `stdio`/`sse` manual shapes only (no direct streamable-http shape today), which is why the registered manual bridges through `mcp-remote`. If Code Mode later validates direct Streamable HTTP, the direct URL becomes preferable — after validating its OAuth behavior. **[CONFIRMED: local Code Mode configuration contract]**

---

## 3. THE REGISTERED `mobbin` MANUAL

The registered entry, kept exactly as researched (two independent lineages produced byte-identical JSON; the operator applied it verbatim on 2026-07-16), is mirrored as the reference shape in [`../assets/utcp_mobbin_manual.md`](../assets/utcp_mobbin_manual.md):

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

- The `env` block is **intentionally empty and stays empty**: no `MOBBIN_API_KEY`, no REST workspace key, no token, no client secret — in `.utcp_config.json` or `.env`. **There is no auth env var to name; that question is answered in the negative, not open.** **[CONFIRMED: Mobbin MCP docs]**
- Registration was an **operator action** (the entry now sits in `manual_call_templates[]` of `.utcp_config.json`); this packet verified the applied shape read-only and never edits the config itself. Manual absence is now a **failure symptom** — a broken or reverted registration to escalate, never to repair from this packet.
- An eliminated alternative from the research record: a direct url-only `streamable-http` manual was sketched by one lineage but explicitly not grounded in the local config surface; it was not adopted.

---

## 4. AUTHENTICATION (BROWSER OAUTH; NO API KEY)

**Browser OAuth; no API key.** On first use the client opens a browser, the user signs in and authorizes, and the client receives OAuth access/refresh tokens. Custom integrations use OAuth protected-resource metadata, **Dynamic Client Registration (RFC 7591)**, the **authorization-code flow with PKCE S256**, and the **`openid`** scope. Client access is revocable from Mobbin Account Settings -> MCP. **[CONFIRMED: docs.mobbin.com/mcp/introduction, /build-an-integration, /disconnect]**

Live unauthenticated probe evidence **[CONFIRMED at research time]**:

```text
HTTP 401
WWW-Authenticate: Bearer resource_metadata="https://api.mobbin.com/.well-known/oauth-protected-resource/mcp"
{"error":{"code":"unauthorized","message":"Missing or invalid Authorization header"}}
```

The protected-resource document names resource `https://api.mobbin.com/mcp`, the Supabase authorization server, and `openid`; the authorization-server metadata publishes authorization/token/registration endpoints plus PKCE S256 (it also advertises `plain` — use S256 regardless). **[CONFIRMED: live well-known probes]**

**End-to-end OAuth completion, token refresh, and reconnect through the local Code Mode + `mcp-remote` bridge is [INFERRED]** until an operator completes it: no Mobbin login, OAuth exchange, or authenticated MCP call occurred in the research record.

### Security rules

- Keep the manual `env` empty; never add `MOBBIN_API_KEY`, the REST workspace key, tokens, or a client secret to `.utcp_config.json` or `.env`.
- Never accept credentials in prompts or tool arguments; never print Authorization headers, OAuth codes, token responses, adapter debug logs, or auth-cache contents.
- Treat adapter auth state (under `~/.mcp-auth` or `MCP_REMOTE_CONFIG_DIR`) as **operator-owned**; never auto-clear it — reauthorization is an explicit operator action.
- Interpret a pre-authorization 401 as the **expected** protected-resource challenge, not a missing-key error.
- The separate Mobbin REST API (Team/Enterprise, workspace Bearer key) must never be conflated with MCP; its key never appears anywhere in this wiring.

---

## 5. CALLABLE NAMING (CONFIRMED 2026-07-16) AND DISCOVERY

Code Mode's naming convention is `{manual}.{manual}_{tool}`. Live discovery on 2026-07-16 ([`discovery_fixture_2026-07-16.json`](./discovery_fixture_2026-07-16.json)) confirmed the convention held exactly, for all three live tools:

| Form | Observed shape | Status |
|---|---|---|
| Discovery name (dotted) | `mobbin.mobbin.search_screens` · `mobbin.mobbin.search_flows` · `mobbin.mobbin.search_sections` | **[CONFIRMED: fixture `list_tools`]** |
| Callable name | `mobbin.mobbin_search_screens(...)` etc. | **[CONFIRMED: fixture `Access as:` lines]** |

Notably, discovery ran **pre-auth** — `tools/list` and full schemas needed no OAuth (the endpoint gates calls, not listing). The operating rule stands:

> **Confirm actual callable names via `list_tools` / `tool_info` at install and first use, and fail closed on drift.** Never hard-code a name as ground truth — the fixture is a dated baseline, not a permanent contract.

Mandatory discovery-first sequence per session (authentication is needed for calls, not for discovery):

1. `list_tools()` or `search_tools({ task_description: "Mobbin screen design research", limit: 10 })`
2. Filter to the `mobbin` manual.
3. `tool_info()` on the exact dotted name.
4. Only then `call_tool_chain({ code })`.

Illustrative call (input schema confirmed by the 2026-07-16 fixture; the live response is unexercised pending operator OAuth):

```typescript
call_tool_chain({
  code: `
    const result = await mobbin.mobbin_search_screens({
      query: "iOS banking app onboarding identity verification",
      platform: "ios",
      limit: 5
    });
    return { success: true, data: result, errors: [], timestamp: new Date().toISOString() };
  `
});
```

Notes:

- Manuals load at Code Mode startup, so a freshly registered manual needs a reconnect before its tools resolve.
- Allowlist exactly the verified read/search tools; if the live catalog contains a mutation-capable tool, refuse it and report the surface expansion — the read-only guarantee is an authorization boundary, not an observation.
- Whether `call_tool_chain` faithfully passes the inline image content blocks is **[UNKNOWN]**; verify at install and plan a side-channel for visual inspection if needed.

---

## 6. WHAT THIS WIRING NEVER DOES

- Never edits or re-drafts the `mobbin` manual in `.utcp_config.json` (the registered entry is operator-owned; this packet verifies it read-only, and a broken registration is escalated, never repaired here).
- Never invents an API key, auth env var, or credential of any kind — none exists for Mobbin MCP.
- Never vendors, clones, or installs a Mobbin server (the provider is hosted; the repo is metadata-only).
- Never targets `docs.mobbin.com/mcp` (the separate Mintlify docs-search MCP).
- Never accepts, prints, caches, or clears credentials or auth state.
- Never grants workspace mutation: this is a `mutatesWorkspace: false` transport, and Write/Edit/Task are forbidden tools.
- Never runs `npx`/shell for the bridge itself; Code Mode owns the process launch of the registered manual.

---

## 7. RELATED RESOURCES

- [tool_surface.md](tool_surface.md) - the single-tool contract, the four query-intent workflows, plan gating, and the open questions.
- [troubleshooting.md](troubleshooting.md) - failure modes including the expected pre-auth 401 and tools-not-resolving.
- [utcp_mobbin_manual.md](../assets/utcp_mobbin_manual.md) - the registered manual's reference shape and the post-registration checklist (doc-side items executed; live items pending).
- [SKILL.md](../SKILL.md) - the runtime contract these references support.
- Code Mode mechanics (naming, discovery, manual shapes): [mcp-code-mode SKILL.md](../../../mcp-code-mode/SKILL.md).
