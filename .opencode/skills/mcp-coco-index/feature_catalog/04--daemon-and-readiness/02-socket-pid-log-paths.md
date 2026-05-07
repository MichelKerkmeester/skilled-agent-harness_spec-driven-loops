---
title: "02. Socket, PID and log paths"
description: "Defines daemon runtime paths under the user settings directory."
---

# 02. Socket, PID and log paths

Defines daemon runtime paths under the user settings directory. Daemon runtime files live with user-level CocoIndex settings so the process can outlive individual project commands.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Daemon runtime files live with user-level CocoIndex settings so the process can outlive individual project commands.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

Unix uses a socket file under the daemon directory. Windows uses a named pipe with a hash of the daemon directory so environment overrides can create isolated daemon instances. PID and log files share the same directory.
Patch 4 writes `daemon.pid` inside the lock-held startup region at `daemon.py:631-635`. Patch 5 uses `RotatingFileHandler` with 10 MB per file and 5 backups, which caps daemon logs at 60 MB total. Patch 6 sets `Listener(backlog=128)` so connection storms queue before handler dispatch.
A live daemon now leaves 5 daemon-directory files under `~/.cocoindex_code/`: `daemon.pid`, `daemon.sock`, `daemon.log`, `daemon.lock` and `daemon.spawn-lock`. The two lock files are 0-byte placeholders. Operators can read `daemon.pid` without lock awareness.
<!-- /ANCHOR:current-reality -->

---

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:149` | Daemon | Defines the daemon directory. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:159` | Daemon | Defines socket or pipe addressing. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:171` | Daemon | Defines the PID path. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:176` | Daemon | Defines the log path. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:176` | Daemon | `daemon_lock_path` defines the lifetime singleton lock path. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:188` | Daemon | `daemon_spawn_lock_path` defines the client-side spawn coordination lock path. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:631` | Daemon | Acquires the startup lock before writing `daemon.pid`. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:643` | Daemon | Configures the rotating daemon log handler. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:696` | Daemon | Sets listener backlog to 128 queued clients. |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.opencode/skills/mcp-coco-index/tests/test_client.py:36` | Unit | Patches daemon paths for client tests. |
| `.opencode/skills/mcp-coco-index/manual_testing_playbook/manual_testing_playbook.md:367` | Manual playbook | Checks daemon status plus PID and socket files. |

<!-- /ANCHOR:source-files -->

---

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Daemon and readiness
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `04--daemon-and-readiness/02-socket-pid-log-paths.md`

<!-- /ANCHOR:source-metadata -->
