---
title: "Daemon model and tool-surface verification"
description: "Locate the od CLI inside the app bundle, confirm the socket-discovered daemon is reachable, and verify the live tools/list before relying on any tool."
trigger_phrases:
  - "od daemon model"
  - "locate od cli"
  - "tools list verification"
  - "open design socket discovery"
  - "od daemon not running"
importance_tier: "important"
version: 1.4.0.1
---

# Daemon model and tool-surface verification (locate CLI, confirm daemon, verify tools/list)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Establishes the two facts every other capability depends on: where the `od` CLI actually is, and that the daemon behind it is reachable. The desktop app hosts the daemon, so the app must be open for any tool call to work.

These foundations exist because the obvious assumptions are wrong. There is no global `od` on PATH, the daemon is not on a fixed port, and the help text undercounts the real tool set. Each of those is a documented accuracy risk the skill hedges by checking live.

---

## 2. HOW IT WORKS

### Locate the CLI and confirm the daemon

The CLI is `app/prebundled/daemon/daemon-cli.mjs` run under Node or the bundled Electron, not the bundled `vela` binary (vela is the cloud auth client). Bare `od` is the unrelated `/usr/bin/od` octal-dump tool, so the CLI is always invoked by its bundle path.

```bash
APP="/Applications/Open Design.app"
OD_BIN="$APP/Contents/Resources/app/prebundled/daemon/daemon-cli.mjs"   # this is od
node "$OD_BIN" --help
ELECTRON_RUN_AS_NODE=1 "$APP/Contents/MacOS/Open Design" "$OD_BIN" --help
```

Every tool call proxies to a local daemon that the desktop app runs, so the app must be open. The daemon is discovered over a Unix socket (`OD_SIDECAR_IPC_PATH=/tmp/open-design/ipc/release-stable/daemon.sock`) on an ephemeral loopback port, not a fixed `127.0.0.1:7456`. That port is only the default for a standalone `od --no-open` daemon, which is the headless fallback when the desktop app is closed.

### Verify the live tool set

The `od mcp --help` text lists only a documentation subset of about 8 tools, but the running server registers roughly 18, including `write_file`, `create_project`, `start_run`, and the destructive `delete_file` and `delete_project`. The live `tools/list` is always verified before promising a tool exists or is read-only, and every mutating or destructive entry is gated. If a verb returns an auth error, that is surfaced as a requirement rather than worked around.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/od-cli-reference.md` | Shared | Locating the CLI, the daemon socket model, and the verb surface |
| `references/tool-surface.md` | Shared | The roughly 18 tools and the live-verification requirement |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual-testing-playbook/failure-paths/daemon-not-running.md` | Manual playbook | The daemon-not-running and app-closed failure path |

---

## 4. SOURCE METADATA

- Group: Daemon Transport
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `transport/daemon-and-verification.md`

Related references:
- [od-mcp-install.md](../wiring/od-mcp-install.md) covers the wiring that points at this daemon socket
- [headless-runs.md](../runs/headless-runs.md) covers gating the mutating verbs this verification surfaces
