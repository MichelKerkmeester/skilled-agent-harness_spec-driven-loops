---
title: "Refero MCP Wiring (via Code Mode)"
description: "Wiring the Refero MCP through this project's Code Mode: the already-registered refero manual, the mcp-remote bridge, OAuth and Bearer authentication, the doubled-prefix callable naming, and the mandatory discovery-first contract."
trigger_phrases:
  - "refero mcp wiring"
  - "refero utcp manual"
  - "refero oauth"
  - "mcp-remote refero"
  - "refero code mode"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Refero MCP Wiring (via Code Mode)

> **IMPORTANT:** The `refero` manual is **already registered** in `.utcp_config.json` and is **validated as-is: verify it, never re-add it, never edit it**. Live discovery ran 2026-07-16 ([`discovery_fixture_2026-07-16.json`](./discovery_fixture_2026-07-16.json)): all eight tools listed pre-auth under the dotted doubled registry names `refero.refero.refero_<tool>`. Before invoking any Refero tool, still **discover first** (`list_tools` / `tool_info`) per session and confirm the exact doubled-prefix callable names. Never claim OAuth works end-to-end; it is **Inferred** pending an operator-completed authorization (discovery is pre-auth; calls are not).

---

## 1. OVERVIEW

Wiring here means the agent reaches Refero's remote, paid, read-only MCP (`https://api.refero.design/mcp`) through this project's **Code Mode** transport. Code Mode consumes stdio; Refero speaks remote HTTP; the `mcp-remote` bridge connects them. Nothing needs to be installed and nothing needs to be configured for the base path: the manual exists, and the only missing piece for live use is **operator authentication on a Pro (or higher) plan**.

Claims below are tagged **[CONFIRMED]** (read from this repo's config or from the cited primary docs at research time), **[INFERRED]** (supported but not exercised end-to-end), or **[UNKNOWN]** (requires authenticated access or unpublished provider policy).

---

## 2. THE REGISTERED `refero` MANUAL

Present in `.utcp_config.json` under `manual_call_templates[]`. **[CONFIRMED: read from `.utcp_config.json`]** The manual is the correct shape for the job and no source found any needed change:

```json
{
  "name": "refero",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "refero": {
        "transport": "stdio",
        "command": "npx",
        "args": [
          "-y",
          "mcp-remote",
          "https://api.refero.design/mcp"
        ],
        "env": {}
      }
    }
  }
}
```

- `mcp-remote` presents a local stdio MCP to Code Mode and proxies to Refero's remote HTTP endpoint. The default transport strategy is **HTTP-first with SSE fallback only after HTTP 404**; do not force SSE. **[CONFIRMED: mcp-remote docs]**
- The manual intentionally uses **unpinned** `mcp-remote` (researched npm version 0.1.38; the project self-describes as experimental). Document, don't pin, unless separately requested. **[CONFIRMED: npm]**
- The **empty `env` does NOT mean anonymous access**. Refero documents OAuth or `Authorization: Bearer <token>`; access is plan- and account-dependent. **[CONFIRMED: Refero getting-started docs]**
- Code Mode owns the stdio process launch (`npx`), so this packet has no shell role in starting the bridge.

A byte-preserved snapshot of this manual, plus the Bearer alternative, lives in [`../assets/utcp_refero_manual.md`](../assets/utcp_refero_manual.md).

---

## 3. AUTHENTICATION

### Default: browser OAuth (operator-only)

With no custom header, first use triggers a **browser OAuth** flow with a localhost callback (port 3334 by default, another free port if occupied; 30-second default callback timeout). **[CONFIRMED: mcp-remote docs]** Auth data (client info, tokens, PKCE state) persists under `MCP_REMOTE_CONFIG_DIR` or `~/.mcp-auth`, namespaced by package version and a server-derived hash. **[CONFIRMED: mcp-remote source]**

That auth state is **operator-owned**: the packet must never inspect, clear, or repair it, and never auto-delete `~/.mcp-auth` as a "fix".

**Live unauthenticated observation** [CONFIRMED at research time]: direct GET and JSON-RPC `initialize` against the endpoint both returned **HTTP 401** advertising Bearer auth, scope `files:read`, and a protected-resource metadata URL. That URL (`/.well-known/oauth-protected-resource`) returned **404** during research, but current `mcp-remote` treats a 404 as a discovery miss and tries alternate well-known locations; `/.well-known/oauth-authorization-server` IS available and advertises authorization-code and client-credentials grants, dynamic registration, token/revocation endpoints, and `read`/`files:read` scopes.

**End-to-end OAuth completion, refresh, and dynamic registration through this bridge is [INFERRED]** until an operator completes it. The strongest available evidence that the wiring functions is a prior **live-verified invocation through this exact manual** with a paid, OAuth-completed account, recorded in this repo's design-reference catalog. Ephemeral runtimes without a persistent home may require re-authentication; headless/CI environments likely need the Bearer path [INFERRED].

### Alternative: static Bearer header (env-backed, never in the base manual)

Documented upstream for `mcp-remote`. See the verbatim snippet in [`../assets/utcp_refero_manual.md`](../assets/utcp_refero_manual.md). Key rules:

- The token lives in the manual entry's `env` block and is referenced as `${AUTH_TOKEN}`; it never goes into calls, skill files, or the base manual.
- For clients that mishandle spaces in an argument, upstream documents the `Authorization:${AUTH_HEADER}` form with `AUTH_HEADER` containing `Bearer <token>`. **[CONFIRMED: mcp-remote custom-headers docs]**
- If a token is wired via env under Code Mode, environment variables are **prefixed with the manual name**: `refero_<NAME>`. **[CONFIRMED: Code Mode env-prefix rule]**
- How an operator obtains a Refero Bearer token is **[UNKNOWN]** (account/dashboard access required).
- Troubleshooting flags (`--debug`, `--transport`, `--auth-timeout`, `--resource`, `MCP_REMOTE_CONFIG_DIR`) are environment-specific and do not belong in the minimal base manual.

---

## 4. CALLABLE NAMING (THE DOUBLED PREFIX) AND DISCOVERY

Code Mode's naming convention is `{manual}.{manual}_{tool}`. Because every Refero tool's own name already begins with `refero_`, the convention yields a **doubled prefix**:

| Form | Shape | Example |
|---|---|---|
| Discovery name (dotted) | `refero.refero.refero_<tool>` | `refero.refero.refero_search_styles` |
| Callable name | `refero.refero_refero_<tool>(...)` | `refero.refero_refero_search_styles({...})` |

The doubled form is **CONFIRMED by live registry evidence, 2026-07-16** ([`discovery_fixture_2026-07-16.json`](./discovery_fixture_2026-07-16.json)): `list_tools` through CodeMode-MCP returned all eight dotted registry names `refero.refero.refero_{search_styles,search_screens,get_style,get_similar_screens,get_screen_image,get_screen,search_flows,get_flow}`, and the fixture's `Access as:` line shows the TS callable `refero.refero_refero_search_styles(args)`. Notably, **discovery worked pre-auth** — `tools/list` needed no OAuth; authenticated CALLS remain operator-gated. The single-prefix derivation (`refero.refero_<tool>`) that circulated in the research record is a **misapplication of the convention** (it collapses the tool's own `refero_` prefix into the manual prefix) and is now refuted by the live registry. Regardless of which form a document asserts, the operating rule is:

> **Confirm actual callable names via `list_tools` / `tool_info` at install and first use, and fail closed on drift.** Never hard-code a callable name as ground truth.

```typescript
call_tool_chain({
  code: `
    // 1) Confirm the callable exists and matches the expected schema.
    const info = tool_info({ tool_name: "refero.refero_refero_search_styles" });
    // 2) Call synchronously inside the body (no top-level await).
    const res = refero.refero_refero_search_styles({
      query: "editorial monochrome saas landing page",
      response_format: "json"
    });
    return { info, count: (res.records || []).length };
  `
});
```

Notes:

- Manuals load at Code Mode startup, so a freshly registered manual needs a reconnect before its tools resolve.
- Allowlist exactly the **eight** underlying tools; if the live catalog is missing, renamed, or expanded, report the drift and stop. New provider tools require a reviewed packet update.
- Wrap multi-call chains defensively and never turn a partial multi-call failure into a successful design result. Bounded timeouts: about 30s for a simple call, 60s for a multi-call chain.

---

## 5. LOCAL RUNTIME CONSTRAINT

Code Mode must currently run on **Node 24**: isolated-vm has no Node 25 build, so `call_tool_chain` SIGSEGVs and drops the connection under Node 25 (`-32000 Connection closed`). **[CONFIRMED: local operational evidence, not a server property]** Whether this persists after future Code Mode / isolated-vm releases is **[UNKNOWN]**; re-test on runtime upgrades.

---

## 6. WHAT THIS WIRING NEVER DOES

- Never edits `.utcp_config.json` or adds a second Refero manual.
- Never replaces the manual with a direct Bearer setup (explicitly eliminated in research).
- Never vendors or mirrors the remote server.
- Never accepts, prints, caches, or clears credentials or auth state.
- Never grants workspace mutation: this is a `mutatesWorkspace: false` transport, and Write/Edit/Task are forbidden tools.
- Never runs `npx`/shell for the bridge itself; Code Mode owns the process launch.

---

## 7. RELATED RESOURCES

- [tool_surface.md](tool_surface.md) - the eight-tool contract, funnel, and plan gating.
- [troubleshooting.md](troubleshooting.md) - failure modes including 401, tools-not-resolving, and the Node 25 SIGSEGV.
- [utcp_refero_manual.md](../assets/utcp_refero_manual.md) - the verified manual snapshot and the Bearer alternative, verbatim.
- [SKILL.md](../SKILL.md) - the runtime contract these references support.
- Code Mode mechanics (naming, prefixed env, discovery): [mcp-code-mode SKILL.md](../../../mcp-code-mode/SKILL.md).
