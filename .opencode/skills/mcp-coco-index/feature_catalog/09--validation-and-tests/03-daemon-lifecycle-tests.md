---
title: "03. Daemon lifecycle tests"
description: "Validates daemon handshake, status, indexing, search, removal and wait behavior."
---

# 03. Daemon lifecycle tests

Validates daemon handshake, status, indexing, search, removal and wait behavior. Daemon tests exercise the core process boundary between client and background registry.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Daemon tests exercise the core process boundary between client and background registry.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

The suite starts a daemon in test fixtures, handshakes with it, checks version mismatch behavior, indexes a sample project, searches results, validates project removal and proves search waits during active indexing.
The 13 daemon-resilience unit tests in `test_daemon.py` cover Patches 1-7 plus the Patch 11 and 12 lock split. The Phase 4 venv rebuild met the required runner path at `mcp_server/.venv/bin/python`.
<!-- /ANCHOR:current-reality -->

---

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_daemon.py:13` | Test | `test_try_acquire_pid_lock_first_call_succeeds` covers first lock acquisition. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_daemon.py:22` | Test | `test_try_acquire_pid_lock_second_call_blocks` covers competing lock acquisition. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_daemon.py:33` | Test | `test_try_acquire_pid_lock_releases_on_close` covers lock release. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_daemon.py:45` | Test | `test_safe_send_bytes_swallows_broken_pipe` covers broken-pipe disconnects. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_daemon.py:55` | Test | `test_safe_send_bytes_swallows_connection_reset` covers reset disconnects. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_daemon.py:65` | Test | `test_safe_send_bytes_normal_path` covers successful sends. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_daemon.py:74` | Test | `test_socket_unlink_guard_alive_sibling` covers live sibling protection. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_daemon.py:90` | Test | `test_socket_unlink_guard_dead_sibling` covers dead sibling cleanup. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_daemon.py:104` | Test | `test_handle_connection_six_sites_parameterized_placeholder` covers the 6 safe-send sites. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_daemon.py:122` | Test | `test_daemon_lock_path_is_separate_from_pid_path` covers the Patch 11 lock-file split. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_daemon.py:132` | Test | `test_wait_for_daemon_claim_returns_when_pid_appears` covers the Patch 12 live-PID claim path. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_daemon.py:152` | Test | `test_wait_for_daemon_claim_returns_when_spawn_dies` covers the Patch 12 dead-spawn path. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_daemon.py:168` | Test | `test_wait_for_daemon_claim_returns_at_timeout` covers the Patch 12 timeout path. |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:381` | Implementation | Handles client connections. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:481` | Implementation | Dispatches daemon requests. |

<!-- /ANCHOR:source-files -->

---

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Validation and tests
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `09--validation-and-tests/03-daemon-lifecycle-tests.md`

<!-- /ANCHOR:source-metadata -->
