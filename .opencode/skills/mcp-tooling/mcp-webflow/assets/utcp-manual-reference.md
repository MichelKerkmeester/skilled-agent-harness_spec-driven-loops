---
title: "Webflow MCP Registered Manual Reference"
description: "Reference shape of the registered webflow Code Mode manual in .utcp_config.json — verify, never re-add, never edit."
trigger_phrases:
  - "webflow manual reference"
  - "webflow utcp manual"
  - "webflow manual shape"
importance_tier: normal
contextType: implementation
version: 1.1.0.0
---

# Webflow MCP Registered Manual Reference - Reference Shape

Reference shape of the `webflow` Code Mode manual registered in `.utcp_config.json`.

---

## 1. OVERVIEW

### Purpose

Provide the canonical reference shape of the registered `webflow` manual so operators can verify
the live entry without re-adding or editing it. The live config is authoritative; this asset
documents what the entry should look like and why each field is fixed.

### Usage

- Compare the live `webflow` entry in `.utcp_config.json` against the reference shape below.
- On drift, record it and verify the intended change with the operator — never silently re-add or
  edit the entry.
- The env placeholder resolves from the operator's environment; `.env.example` documents the
  namespaced `webflow_WEBFLOW_TOKEN` name only.

---

## 2. REFERENCE SHAPE

```json
{
  "name": "webflow",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "webflow": {
        "transport": "stdio",
        "command": "npx",
        "args": ["-y", "webflow-mcp-server@latest"],
        "env": { "WEBFLOW_TOKEN": "${WEBFLOW_TOKEN}" }
      }
    }
  }
}
```

---

## 3. FIELD GUIDELINES

**`transport`**:
- Fixed to `stdio` — Code Mode consumes stdio; the official server ships as a Node CLI.

**`command` / `args`**:
- `npx` resolving `webflow-mcp-server@latest` — pin the exact version after the first verified
  session and record it in `../mcp-servers/webflow-mcp/README.md`.

**`env`**:
- `WEBFLOW_TOKEN` bound from the operator environment — the value never lives in the repository.

**Server runtime**:
- Node 22.3.0+ (verified by `../scripts/doctor.sh`).

---

## 4. RELATED RESOURCES

- [`../scripts/doctor.sh`](../scripts/doctor.sh) — verify-only manual check
- [`../references/mcp-wiring.md`](../references/mcp-wiring.md) — wiring details and auth
- [`../mcp-servers/webflow-mcp/README.md`](../mcp-servers/webflow-mcp/README.md) — server pointer
