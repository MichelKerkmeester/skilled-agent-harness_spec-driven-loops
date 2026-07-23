---
title: "Scripts: Open Design Local Readiness Checks"
description: "Bash scripts that verify the Open Design desktop app and bundled od CLI without ever starting the daemon or wiring MCP."
---

# Scripts: Open Design Local Readiness Checks

---

## 1. OVERVIEW

`design-mcp-open-design/scripts/` owns the local readiness scripts for the Open Design transport. `od` is not an npm package or a global binary, it ships inside the Open Design desktop app, so these scripts locate and verify the bundled CLI rather than installing anything. Both entrypoint scripts are read-only or verify-only: neither starts the daemon, wires MCP, or downloads a remote installer.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `_common.sh` | Shared helpers sourced by `doctor.sh` and `install.sh`: colored log helpers (`log`, `info`, `ok`, `warn`, `err`), `od_app_path()` to locate the desktop app in `/Applications` or `~/Applications`, `od_bin()` to locate the bundled `daemon-cli.mjs`, and `node_major()` for the Node version check. Not meant to run directly. |
| `doctor.sh` | Report-only diagnostics: platform, Node version, desktop app presence, running-process check, bundled CLI presence, and whether Code Mode's `.utcp_config.json`, native `opencode.json`, or `~/.claude.json` already reference `open-design`. Changes nothing and never starts the daemon. |
| `install.sh` | Verifies prerequisites (macOS, Node >=18), locates the desktop app and bundled CLI, and optionally runs `--version`/`--help` against it. Prints manual next steps for MCP wiring, never wires MCP itself, and never starts the daemon. Accepts `--skip-verify` and `--verbose`. |

## 3. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `install.sh` | CLI | First local check: confirms the desktop app and bundled `od` CLI are present and runnable. |
| `doctor.sh` | CLI | Follow-up diagnostics: reports platform, runtime, app state, and existing MCP config references. |

## 4. VALIDATION

Run from the repository root.

```bash
.opencode/skills/sk-design/design-mcp-open-design/scripts/install.sh
.opencode/skills/sk-design/design-mcp-open-design/scripts/doctor.sh
```

Expected result: a `==` section report ending in `ok`/`warn`/`info` lines and manual next steps, never an automatic MCP wiring action.

## 5. RELATED

- [`../SKILL.md`](../SKILL.md) - design-mcp-open-design transport mode.
- `references/mcp-wiring.md` - the gated manual wiring steps these scripts point to.
