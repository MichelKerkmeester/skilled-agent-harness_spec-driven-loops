---
title: "Connect and daemon"
description: "Bring up and maintain the terminal-to-Figma-Desktop link: safe plugin connect by default, the gated yolo app.asar patch, and read-only daemon health on 127.0.0.1:3456."
trigger_phrases:
  - "figma connect"
  - "figma-ds-cli connect --safe"
  - "figma daemon status"
  - "figma yolo connect"
  - "figma unpatch"
importance_tier: "important"
version: 1.0.0.2
---

# Connect and daemon (figma-ds-cli connect / daemon)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Brings up and maintains the link between the terminal and Figma Desktop. Safe plugin mode is the default and applies no patch; the yolo patch that edits Figma's `app.asar` is gated behind explicit consent and a stated rollback. This is the foundation every other capability depends on.

The connection drives Figma Desktop (open with a file) with no Figma API key, over a local HTTP daemon. A typical caller connects once with `connect --safe`, then checks daemon health read-only before any read or gated write. The failure mode this area guards against is a blind yolo patch or a leaked daemon token.

---

## 2. HOW IT WORKS

### Safe connect, yolo connect, and unpatch

Safe connect (`figma-ds-cli connect --safe`) runs the FigCli plugin bridge with no patch: import `plugin/manifest.json` once, then keep `Plugins → Development → FigCli` open in Figma. This is the default path. The yolo connect (`figma-ds-cli connect`) patches Figma's `app.asar`, codesigns the bundle, and opens CDP port 9222, so it is MUTATING at the app level and is reached only behind explicit consent plus a stated rollback. The rollback is `figma-ds-cli unpatch`, which restores the original `app.asar` string. The agent never falls back from safe to yolo without consent.

### Daemon model and health

The daemon is a local HTTP server on `127.0.0.1:3456` (not a Unix socket), authed with `X-Daemon-Token` from `~/.figma-ds-cli/.daemon-token`, idle around 60 minutes, and not reboot-persistent. The status and diagnose verbs (`figma-ds-cli status`, `figma-ds-cli diagnose`, `figma-ds-cli daemon status [--debug]`, `figma-ds-cli daemon diagnose`) are read-only: they report health and cause without changing app or daemon state. The start, stop, restart, and reconnect verbs (`figma-ds-cli daemon start [--force] | stop | restart`, `figma-ds-cli daemon reconnect`) change daemon state and are MUTATING at the app level. For an "Unauthorized" result the recovery is diagnose then restart, never token deletion, and the token is never printed into output. `init-agent` (`figma-ds-cli init-agent [--tool claude|cursor|both] [--force]`) writes `AGENTS.md` and `.cursor/rules/figma-cli.mdc` into the repo and is off by default, and it is never run as part of normal connect flow.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/mcp-wiring.md` | Shared | Connect modes, daemon model, and the safe-vs-yolo gate |
| `references/figma-cli-reference.md` | Shared | Connect, daemon, and init-agent verb surface |
| `scripts/connect-safe.sh` | Script | Safe plugin-bridge connect helper |
| `scripts/connect-yolo.sh` | Script | Gated yolo patch helper (consent-only) |
| `scripts/unpatch.sh` | Script | Rollback that restores the original `app.asar` |
| `scripts/daemon.sh` | Script | Daemon status/health helper |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual-testing-playbook/detection-setup/safe-connect.md` | Manual playbook | Safe connect runs the plugin bridge with no patch |
| `manual-testing-playbook/daemon-health/daemon-status-diagnose.md` | Manual playbook | Daemon health is read-only and the token stays private |

---

## 4. SOURCE METADATA

- Group: Connect and Daemon
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `connect-and-daemon/connect-and-daemon.md`

Related references:
- [inspect.md](../inspect/inspect.md) covers the read-only verbs that run after a connection is up
- [optional-mcp-context.md](../../feature-catalog/optional-mcp/optional-mcp-context.md) covers the opt-in Code Mode path that does not depend on the CLI daemon
