---
title: "MagicPath Credential Setup"
description: "Wiring the MagicPath credential through this project's Code Mode: the already-registered magicpath manual, the magicpath-ai login browser flow, the MAGICPATH_TOKEN environment variable wired as magicpath_MAGICPATH_TOKEN in .env, and the unauthenticated failure shape."
trigger_phrases:
  - "magicpath credential"
  - "magicpath token"
  - "magicpath login"
  - "magicpath auth"
  - "magicpath not authenticated"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# MagicPath Credential Setup

> **IMPORTANT:** The `magicpath` manual is **already registered** in `.utcp_config.json` and is **validated as-is: verify it, never re-add it, never edit it**. Before invoking any MagicPath tool, still **discover first** (`list_tools` / `tool_info`) per session and confirm the exact `magicpath.<tool>` callable names. Credential state is **operator-owned**: never inspect, print, cache, or repair it.

---

## 1. OVERVIEW

Wiring here means the agent reaches the `magicpath-ai` Node CLI through this project's **Code Mode** UTCP `cli` transport. The manual is registered; the only missing piece for live use beyond `info` is **operator authentication**.

Claims below are tagged **[CONFIRMED]** (read from this repo's config or the registered manual), **[INFERRED]** (supported but not exercised end-to-end), or **[UNKNOWN]** (requires authenticated access or unpublished provider policy).

---

## 2. THE REGISTERED `magicpath` MANUAL

Present in `.utcp_config.json` under `manual_call_templates[]`. **[CONFIRMED: read from `.utcp_config.json`]** The manual is the correct shape and no source found any needed change:

```json
{
  "name": "magicpath",
  "call_template_type": "cli",
  "commands": [
    {
      "command": "node .opencode/bin/magicpath-utcp-manual.cjs",
      "append_to_final_output": true
    }
  ],
  "env_vars": {
    "MAGICPATH_TOKEN": "${magicpath_MAGICPATH_TOKEN}"
  }
}
```

- The manual is a **`cli` transport**, not `mcp`. The manual command (`node .opencode/bin/magicpath-utcp-manual.cjs`) prints the UTCP manual that lists the fourteen tools; each tool call is executed by `node .opencode/bin/magicpath-utcp-exec.cjs`, which shells out to the `magicpath-ai` binary. **[CONFIRMED: the registered manual and the wrapper source]**
- The `env_vars` block maps the CLI's `MAGICPATH_TOKEN` to `${magicpath_MAGICPATH_TOKEN}`. Under Code Mode, environment variables are **prefixed with the manual name** (`magicpath_<NAME>`), so the token is set in `.env` as `magicpath_MAGICPATH_TOKEN` and exposed to the CLI as `MAGICPATH_TOKEN`. **[CONFIRMED: Code Mode env-prefix rule]**
- A byte-preserved snapshot of this manual lives in [`../assets/utcp-magicpath-manual.md`](../assets/utcp-magicpath-manual.md).

---

## 3. AUTHENTICATION

### Default: `magicpath-ai login` (browser, operator-only)

With no token, the operator runs `magicpath-ai login`, which opens a browser to complete authentication. **[CONFIRMED: the established phase-002 facts]** The resulting credential state is **operator-owned**: the packet must never inspect, clear, or repair it, and never accept, print, or cache a token.

### Alternative: `MAGICPATH_TOKEN` environment variable

The CLI also reads the `MAGICPATH_TOKEN` environment variable. Under Code Mode this is wired as `magicpath_MAGICPATH_TOKEN` in `.env`, which the manual's `env_vars` block maps to the CLI's `MAGICPATH_TOKEN`. **[CONFIRMED: the registered manual]**

Key rules:

- The token lives in `.env` as `magicpath_MAGICPATH_TOKEN`; it never goes into calls, skill files, or the base manual.
- How an operator obtains a MagicPath token is **[UNKNOWN]** (account/dashboard access required).
- Never paste a token literal into output or evidence.

### Unauthenticated failure shape

Without a credential, a call returns structured JSON **[CONFIRMED: the established phase-002 facts]**:

```json
{
  "error": "Not authenticated. Set MAGICPATH_TOKEN or run `magicpath-ai login`.",
  "code": "NOT_AUTHENTICATED",
  "suggestion": "..."
}
```

`info` is the **exception**: it answers without credentials and reports authentication state, the signed-in user, teams, projects, and the CLI version, so it is the cheapest reachability and setup check. `whoami` returns the authenticated user and **fails when no credential is present**.

---

## 4. CALLABLE NAMING AND DISCOVERY

Code Mode's naming convention is `{manual}.{tool}`. The manual is named `magicpath` and the tool names have no `magicpath_` prefix of their own, so the callable form applies the prefix once:

| Form | Shape | Example |
|---|---|---|
| Discovery name | `magicpath.<tool>` | `magicpath.search_components` |
| Callable name | `magicpath.<tool>(...)` | `magicpath.search_components({...})` |

> **Confirm actual callable names via `list_tools` / `tool_info` at install and first use, and fail closed on drift.** Never hard-code a callable name as ground truth.

```javascript
call_tool_chain({
  code: `
    var info = tool_info({ tool_name: "magicpath.search_components" });
    var res = magicpath.search_components({ query: "button", limit: "5" });
    return { info: info, count: (res && res.records) ? res.records.length : 0 };
  `
});
```

Notes:

- Manuals load at Code Mode startup, so a freshly registered manual needs a reconnect before its tools resolve.
- Allowlist exactly the **fourteen** underlying tools; if the live catalog is missing, renamed, or expanded, report the drift and stop. New provider tools require a reviewed packet update.
- Calls are **synchronous**: no `await`, no top-level `await`, no returned Promise. Plain JavaScript only.

---

## 5. LOCAL RUNTIME CONSTRAINT

Code Mode must currently run on **Node 24**: isolated-vm has no Node 25 build, so `call_tool_chain` SIGSEGVs and drops the connection under Node 25 (`-32000 Connection closed`). **[CONFIRMED: local operational evidence, not a server property]** Whether this persists after future Code Mode / isolated-vm releases is **[UNKNOWN]**; re-test on runtime upgrades.

---

## 6. WHAT THIS WIRING NEVER DOES

- Never edits `.utcp_config.json` or adds a second MagicPath manual.
- Never accepts, prints, caches, or clears credentials or auth state.
- Never inspects or repairs the operator's login state.
- Never grants workspace mutation: this is a `mutatesWorkspace: false` transport, and Write/Edit/Task are forbidden tools.
- Never runs the bridge command itself; the transport wrapper owns the CLI launch.

---

## 7. RELATED RESOURCES

- [tool-surface.md](tool-surface.md) - the 14-tool contract, the read funnel, and the stale-`cli.commands` warning.
- [mutation-boundary.md](mutation-boundary.md) - the registered read-only surface versus the deliberately unregistered write surface.
- [utcp-magicpath-manual.md](../assets/utcp-magicpath-manual.md) - the verified manual snapshot and the env-var wiring.
- [SKILL.md](../SKILL.md) - the runtime contract these references support.
- Code Mode mechanics (naming, prefixed env, discovery): [mcp-code-mode SKILL.md](../../../mcp-code-mode/SKILL.md).
