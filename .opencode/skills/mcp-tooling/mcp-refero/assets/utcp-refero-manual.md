---
title: "Refero Code Mode Manual - verified snippet"
description: "The EXISTING validated refero .utcp_config.json manual entry (already registered: verify, do not re-add, do not edit), plus the documented env-backed Bearer-header alternative, verbatim and marked alternative-only."
trigger_phrases:
  - "refero utcp config"
  - "refero manual snippet"
  - "refero mcp-remote manual"
  - "refero bearer header"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Refero Code Mode Manual - verified snippet

The `refero` manual entry as it exists in this repo's `.utcp_config.json`, plus the documented Bearer-header alternative. This asset exists so the wiring can be **verified** without opening the whole config, and so the alternative is quoted from its source rather than improvised.

---

## 1. THE REGISTERED MANUAL (ALREADY REGISTERED — VERIFY, DO NOT RE-ADD)

**Key Points**:
- This entry is **already present** in `manual_call_templates[]` of `.utcp_config.json` and is **validated as-is**. Verify its presence read-only (grep, or `scripts/doctor.sh`); never re-add it, never edit it, never add a second Refero manual.
- Manual `name` is `refero`, so callables resolve with the doubled prefix `refero.refero_refero_<tool>` (the tools' own names already begin with `refero_`), and any env var would be prefixed `refero_`.
- Transport is `stdio`: Code Mode launches `npx -y mcp-remote https://api.refero.design/mcp`, which bridges stdio to Refero's remote HTTP endpoint (HTTP-first; SSE fallback only after HTTP 404).
- The empty `env` does **not** mean anonymous access. First use triggers browser OAuth (operator-only); live MCP access requires a Pro (or higher) plan.
- `mcp-remote` is intentionally **unpinned** (0.1.38 at research time, self-described experimental). Do not pin it here unless separately requested.

**Snapshot** (byte-preserved from `.utcp_config.json`):

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

If this snapshot and the live `.utcp_config.json` ever disagree, **the live config wins** and this asset must be re-synced from it; never the other way around.

---

## 2. ALTERNATIVE: ENV-BACKED BEARER HEADER (DOCUMENTED, NEVER IN THE BASE MANUAL)

**Key Points**:
- This is the **alternative** authentication path documented upstream for `mcp-remote` custom headers: a static `Authorization: Bearer` header backed by an env var. It is **not** part of the registered manual and must never replace it or be merged into it.
- The draft below is quoted **verbatim** from the research record (it is a server-block fragment, not a full manual entry). Adapting it into a full manual entry is an operator decision, not a default.
- How an operator obtains a Refero Bearer token is UNKNOWN (account/dashboard access required); end-to-end behavior of this path is unexercised here.
- Under Code Mode, env vars are prefixed with the manual name (`refero_<NAME>`); never put a token literal into calls, skill files, or the base manual.

**Draft** (verbatim, alternative-only):

```json
{
  "command": "npx",
  "args": [
    "-y", "mcp-remote", "https://api.refero.design/mcp",
    "--header", "Authorization: Bearer ${AUTH_TOKEN}"
  ],
  "env": { "AUTH_TOKEN": "<token>" }
}
```

For clients that mishandle spaces in an argument, upstream documents the `Authorization:${AUTH_HEADER}` form with `AUTH_HEADER` containing `Bearer <token>`.

---

## 3. RELATED RESOURCES

- [mcp-wiring.md](../references/mcp-wiring.md) - the full wiring reference: bridge behavior, OAuth, auth state, naming, and discovery.
- [tool-surface.md](../references/tool-surface.md) - the eight-tool contract the manual exposes.
- [troubleshooting.md](../references/troubleshooting.md) - failure modes, including auth and entitlement denials.
