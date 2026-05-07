---
title: "01. Daemon auto-start"
description: "Connects to an existing daemon or starts one when commands need it."
---

# 01. Daemon auto-start

Connects to an existing daemon or starts one when commands need it. Most user-facing commands do not ask operators to start the daemon manually. They call a client helper that connects, restarts stale daemons or starts a new process.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Most user-facing commands do not ask operators to start the daemon manually. They call a client helper that connects, restarts stale daemons or starts a new process.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

`ensure_daemon` first tries an existing socket. If the daemon is missing, version-stale or settings-stale, it starts or restarts the process and retries the handshake.
Patch 1 added lock-based atomic spawn around daemon startup. `start_daemon()` creates the daemon directory, takes the spawn coordination lock, checks `_pid_alive()` for any stored PID, removes stale runtime files through `_cleanup_stale_files()` and then calls `_spawn_daemon_process()`. POSIX uses `fcntl.flock(fd, LOCK_EX | LOCK_NB)`. Win32 uses `msvcrt.locking(fd, LK_NBLCK, 1)`. Concurrent `ensure_daemon` callers never spawn duplicate daemon processes.
Patch 8 added a sibling-check before the daemon writes its own PID. A live sibling raises `RuntimeError("daemon already running at PID N; refusing to start")`. Patches 11 and 12 split daemon locking across `daemon.lock` and `daemon.spawn-lock`, then hold spawn coordination until `daemon.pid` contains a live PID or the spawned process exits. `daemon.pid` is now informational.
<!-- /ANCHOR:current-reality -->

---

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/client.py:446` | Client | Ensures a usable daemon exists. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/client.py:193` | Client | Starts the daemon process under the PID-file lock. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/client.py:253` | Client | `_try_acquire_pid_lock` implements non-blocking advisory locking. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/client.py:283` | Client | `_pid_alive` checks stored daemon PIDs across POSIX and Win32. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/client.py:382` | Client | `_cleanup_stale_files` removes stale PID and socket files after death confirmation. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/client.py:217` | Client | `_spawn_daemon_process` starts the detached daemon subprocess. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/client.py:264` | Client | `_wait_for_daemon_claim` waits until `daemon.pid` contains a live PID or the spawned process exits. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:188` | Daemon | `daemon_spawn_lock_path` defines the client-side spawn coordination lock. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:631` | Daemon | Patch 8 sibling-check rejects startup when an alive sibling owns `daemon.pid`. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/client.py:430` | Client | Detects restart requirements. |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_daemon.py:13` | Unit | Covers `_try_acquire_pid_lock` first-call success. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_daemon.py:22` | Unit | Covers `_try_acquire_pid_lock` second-call blocking. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_daemon.py:33` | Unit | Covers lock release on close. |
| `.opencode/skills/mcp-coco-index/tests/test_e2e.py:338` | End-to-end | Covers auto-start after a daemon stop. |
| `.opencode/skills/mcp-coco-index/manual_testing_playbook/manual_testing_playbook.md:354` | Manual playbook | Defines daemon auto-start manual validation. |

<!-- /ANCHOR:source-files -->

---

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Daemon and readiness
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `04--daemon-and-readiness/01-daemon-auto-start.md`

<!-- /ANCHOR:source-metadata -->
