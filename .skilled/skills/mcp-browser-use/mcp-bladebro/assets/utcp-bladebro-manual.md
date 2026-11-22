---
title: "Bladebro Code Mode Manual - registered snapshot"
description: "The registered bladebro .utcp_config.json manual entry, kept byte-true to the live config: stdio bladebro mcp with an empty env, plus the check that proves it and the steps still open."
trigger_phrases:
  - "bladebro utcp config"
  - "bladebro manual snippet"
  - "registered bladebro manual"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Bladebro Code Mode Manual - registered snapshot

The one place this packet states the `bladebro` manual JSON. Other files link here instead of copying it.

---

## 1. OVERVIEW

### Purpose

This asset holds the `bladebro` entry exactly as it stands in this repository's `.utcp_config.json` `manual_call_templates[]`. Readers compare the live registration against it, and a future re-registration pastes this verified object instead of writing a new one.

### Usage

The manual was registered on 2026-11-21, when the Bladebro mode was added. Check it with jq and do not add it again:

```bash
jq '.manual_call_templates[] | select(.name == "bladebro")' .utcp_config.json
```

The command must print exactly the object in section 2. When the live config and this snapshot disagree, the live config wins and this file is re-synced from it.

---

## 2. THE REGISTERED MANUAL

Code Mode spawns `bladebro mcp` from the installed binary over stdio. There is no URL, port or remote endpoint. The `env` block is empty because the server needs no credential. Add `BLADE_HOME` or `BLADE_FRESH` there only for a task that needs an isolated data root, as a reviewed config change.

`command: "bladebro"` assumes the binary is on the Code Mode server's PATH. When that PATH differs, resolve the absolute path with `command -v bladebro` in that environment and substitute it as a reviewed config change.

Snapshot, byte-true to the jq command above:

```json
{
  "name": "bladebro",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "bladebro": {
        "transport": "stdio",
        "command": "bladebro",
        "args": [
          "mcp"
        ],
        "env": {}
      }
    }
  }
}
```

---

## 3. CHECKS

- [x] The manual is registered. The jq command returns the object above.
- [x] Discovery ran in a Code Mode session on 2026-11-21. It found `bladebro.bladebro_{act,see,state,run,vision}`, and the call had to be synchronous. Evidence: `../benchmark/reports/2026-11-21--manual-testing-playbook--macos-live/`.
- [x] `scripts/doctor.sh` checks the registration and runs a stdio handshake that lists the five tools.
- [ ] Callable names can change with the installed version. Confirm them with `search_tools("bladebro")` and `tool_info()` in each session before calling one.

---

## 4. RELATED RESOURCES

- [`mcp-wiring.md`](../references/mcp-wiring.md): when the MCP lane applies and the discovery steps.
- [`install-and-verify.md`](../references/install-and-verify.md): the install steps and the MCP probe.
- [`scripts/doctor.sh`](../scripts/doctor.sh): the read-only check of this registration.
