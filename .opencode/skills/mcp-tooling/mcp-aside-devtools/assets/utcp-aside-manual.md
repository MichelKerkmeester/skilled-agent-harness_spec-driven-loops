---
title: "Aside Code Mode Manual - registered snapshot"
description: "The REGISTERED aside .utcp_config.json manual entry (registered 2026-07-16 - verify with jq, do not re-add), kept byte-true to the live config: stdio aside mcp with an intentionally empty env, plus the post-registration checklist and the open single-vs-dual-manual question."
trigger_phrases:
  - "aside utcp config"
  - "aside manual snippet"
  - "aside mcp manual"
  - "registered aside manual"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Aside Code Mode Manual - registered snapshot

Reference snapshot of the registered Aside Code Mode manual.

## 1. OVERVIEW

### Purpose

The `aside` manual entry as it stands **registered** in this repo's `.utcp_config.json` `manual_call_templates[]`. This asset exists so consumers can verify the registered shape and so any future re-registration pastes a verified object rather than improvising one.

### Usage

Use the snapshot and verification command below to compare the live registration without re-adding or editing it.

> **REGISTERED — 2026-07-16.** This manual is live in `.utcp_config.json`. **Verify with jq, do not re-add**: `jq '.manual_call_templates[] | select(.name == "aside")' .utcp_config.json` must return exactly the object below. **Callable discovery is DONE (2026-07-16)** via a direct stdio MCP probe of CodeMode-MCP (fixture: [`../references/discovery-fixture-2026-07-16.json`](../references/discovery-fixture-2026-07-16.json)): the registry/discovery name is **`aside.aside.repl`** (dot-separated, NOT the previously predicted `aside.aside_repl` registry form); inside `call_tool_chain` TypeScript the callable is **`aside.aside_repl(args)`** per the fixture's `Access as:` line and mcp-code-mode's `{manual_name}.{manual_name}_{tool_name}` convention.

---

## 2. THE REGISTERED MANUAL (SNAPSHOT, DO NOT RE-APPLY)

**Key Points**:
- Manual `name` is `aside`. Live discovery (2026-07-16, `../references/discovery-fixture-2026-07-16.json`) returned exactly one aside entry, registry name **`aside.aside.repl`** (dot-separated `{manual}.{server}.{tool}`); the TypeScript call surface inside `call_tool_chain` is **`aside.aside_repl(args)`** (fixture `Access as:` line; `{manual_name}.{manual_name}_{tool_name}` per `mcp-code-mode/references/naming_convention.md`).
- Transport is `stdio`: Code Mode spawns `aside mcp` directly from the installed binary. There is no URL, port, or remote endpoint; the server inherits the logged-in CLI account/provider context.
- The `env` block is **intentionally empty and must stay empty**: Aside MCP auth is account/session-based. No API key or auth env var exists for this transport — no credential of any kind goes into `.utcp_config.json` or `.env`.
- `command: "aside"` assumes PATH; if the Code Mode server's PATH differs, resolve the absolute path via `command -v aside` under that environment and substitute — as a reviewed config change, not an improvised one.

**Snapshot** (byte-true to `jq '.manual_call_templates[] | select(.name == "aside")' .utcp_config.json`):

```json
{
  "name": "aside",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "aside": {
        "transport": "stdio",
        "command": "aside",
        "args": [
          "mcp"
        ],
        "env": {}
      }
    }
  }
}
```

If this snapshot and the live `.utcp_config.json` ever disagree, **the live config wins** and this asset must be re-synced from it; never the other way around.

---

## 3. POST-REGISTRATION CHECKLIST (REMAINING STEPS)

Registration is done; these confirmation steps remain:

- [ ] `jq empty .utcp_config.json` — syntax gate — and the jq select above returns the snapshot object. [evidence: probe ran with `UTCP_CONFIG_FILE=.utcp_config.json`, `../references/discovery-fixture-2026-07-16.json` `utcpConfig` field]
- [] Run discovery in a session that loaded the registered manual. DONE 2026-07-16 via direct stdio MCP probe of CodeMode-MCP (`initialize`, `tools/call`: `list_tools`, `search_tools`, `tool_info`). Actual registry name: `aside.aside.repl`; TS callable `aside.aside_repl(args)`. [evidence: `../references/discovery-fixture-2026-07-16.json` `discoveredCallableNames` + `tool_info_first`]
- [ ] Confirm the live tool set against the version-pinned baseline (one `repl` tool on `1.26.626.1517`) — re-confirmed live 2026-07-16: `aside.aside.repl` is the only `aside.*` entry in `list_tools`. Still runtime evidence (`tools.listChanged: true`), never a permanent contract. [evidence: fixture `list_tools` payload]
- [ ] Run one smoke invocation inside `call_tool_chain()` with try/catch, an explicit timeout (the `repl` tool advertises 120 s), and cleanup in `finally`; verify any artifact independently of the tool response.
- [ ] Confirm no credential of any kind was added anywhere (`env` still empty; no `.env` line).
- [ ] Update this packet's references with the dated discovery results; drift means a reviewed packet update, not an improvised call. [evidence: this packet's `../changelog/v1.0.0.0.md` initial-release entry records the 2026-07-16 discovery results]

### OPEN QUESTION: Single vs Dual Manual

Exactly **one** `aside` manual is registered, deliberately. The dual-manual layout (`aside_1`/`aside_2`, mirroring `chrome_devtools_1/2`) remains an unresolved research question: Aside has no `--isolated=true` equivalent and no isolation guarantee, so the posture is one manual plus a single-writer rule per account/profile. A controlled multi-client isolation test must precede any second manual, as a separate decision. Full detail: [`../references/mcp-wiring.md`](../references/mcp-wiring.md) ("UNRESOLVED: Single vs Dual Manual").

---

## 4. RELATED RESOURCES

- [mcp-wiring.md](../references/mcp-wiring.md) - the full wiring reference: transport, handshake, rediscovery mandate, and registration notes.
- [session-management.md](../references/session-management.md) - the binding and concurrency model behind the single-writer posture.
- [aside-mcp/README.md](../mcp-servers/aside-mcp/README.md) - the server-package pointer that mirrors this registered entry.
