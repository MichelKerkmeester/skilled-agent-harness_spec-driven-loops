# CocoIndex MCP Server (Soft-Fork)

> Vendored Python source for the CocoIndex Code daemon and CLI, soft-forked from upstream and patched per the local fork patch set.

---

## 1. OVERVIEW

This folder bundles a soft-fork of [`cocoindex-code`](https://github.com/cocoindex-io/cocoindex-code) v0.2.3 with patches from the local fork patch set. The vendored source ships in `cocoindex_code/` and installs as an editable Python package via `pyproject.toml`. The Rust-based upstream `cocoindex` runtime stays on PyPI as a regular dependency.

### Key Reference

| Field | Value |
|-------|-------|
| Upstream version forked | 0.2.3 |
| Current fork version | `0.2.3+spec-kit-fork.0.2.0` |
| License | Apache 2.0 (see [`cocoindex_code/LICENSE`](./cocoindex_code/LICENSE)) |
| Attribution | [`../NOTICE`](../NOTICE) |
| Changelog | [`../changelog/CHANGELOG.md`](../changelog/CHANGELOG.md) |
| Install | `bash ../scripts/install.sh` |
| Health check | `bash ../scripts/doctor.sh` |
| Manual reindex | `.venv/bin/ccc reset && .venv/bin/ccc index` |

### Modifications

The full list lives in [`../NOTICE`](../NOTICE). As of `spec-kit-fork.0.2.0` the vendored source carries:

- REQ-001: excludes `.gemini/`, `.codex/`, `.claude/`, and `.agents/` spec mirrors from indexing.
- REQ-002: adds `source_realpath` and `content_hash` chunk fields.
- REQ-003: query-time over-fetch with canonical-path dedup.
- REQ-004: `path_class` taxonomy (`implementation`, `tests`, `docs`, `spec_research`, `generated`, `vendor`).
- REQ-005: bounded path-class reranking for implementation-intent queries.
- REQ-006: `rankingSignals` telemetry per result row.

### Daemon resilience (post-fork patches 2026-05-07)

Commit `1bbe80986` added the daemon resilience patch set for packet `026/011-cocoindex-daemon-resilience`.

- **Patch 1**: Atomic idempotent `start_daemon()` via `_try_acquire_pid_lock`, with cross-platform `fcntl.flock` on POSIX and `msvcrt.locking` on Win32, plus `_pid_alive` pre-flight check.
  Files: `cocoindex_code/client.py:192-225`, `cocoindex_code/client.py:413-443`.
  New helpers: `_try_acquire_pid_lock`, `_pid_alive`, `_spawn_daemon_process`.
  Test: `tests/test_daemon.py::test_try_acquire_pid_lock_*`.
  Status: shipped in commit `1bbe80986`.
- **Patch 2**: `_safe_send_bytes` helper wraps all 6 `conn.send_bytes` call sites in `handle_connection`. It swallows `BrokenPipeError` and `ConnectionResetError`, then logs once at INFO.
  Files: `cocoindex_code/daemon.py:62`, `daemon.py:476`, `:482`, `:491`, `:501`, `:504`, `:506`.
  Result: eliminated the double-crash on client disconnect, which produced 564 BrokenPipeError lines in production logs before the fix.
  Test: `tests/test_daemon.py::test_safe_send_bytes_*`.
  Status: shipped in commit `1bbe80986`.
- **Patch 3**: `_unlink_stale_socket` guard reads `daemon.pid` before unlink and raises `RuntimeError` if a sibling daemon is alive.
  File: `cocoindex_code/daemon.py:114`.
  Result: prevented socket sabotage on concurrent daemon starts.
  Test: `tests/test_daemon.py::test_socket_unlink_guard_*`.
  Status: shipped in commit `1bbe80986`.
- **Patch 4**: `pid_path.write_text(str(os.getpid()))` moved inside the lock-held region established by `_try_acquire_pid_lock`.
  File: `cocoindex_code/daemon.py:629-632`.
  Guarantee: PID file exists if-and-only-if daemon is alive.
- **Patch 5**: `RotatingFileHandler` replaces `FileHandler`.
  File: `cocoindex_code/daemon.py:640`.
  Limit: 10 MB per file, 5 backups, 60 MB total cap.
  Result: prevented disk-fill on long-running daemon.
  Status: shipped in commit `1bbe80986`.
- **Patch 6**: `Listener(backlog=128)` replaces the stdlib default of 1.
  File: `cocoindex_code/daemon.py:693`.
  Result: handles concurrent client storms without queue overflow.
- **Patch 7**: Operator recovery procedure documented in `implementation-summary.md` Known Limitations.
  Reference: 6-step stale-daemon recovery for duplicate processes, stale runtime files and reachability checks.
- **Patch 8**: Sibling-check reads the previous PID from `daemon.pid` before the daemon writes its own PID. A live sibling raises `RuntimeError("daemon already running at PID N; refusing to start")`.
  File: `cocoindex_code/daemon.py:631-660`.
  Test: `tests/test_e2e_daemon.py::test_concurrent_run_daemon_integrated_flow`.
- **Patch 9**: `logging.StreamHandler` attaches only when `sys.stderr.isatty()` is true. Spawned daemon stderr already redirects to `daemon.log`, so file logs no longer receive duplicate lines.
  File: `cocoindex_code/daemon.py:666-684`.
- **Patch 10**: Shutdown task-join wraps `asyncio.gather(*tasks, return_exceptions=True)` in `asyncio.wait_for(..., timeout=10.0)`.
  File: `cocoindex_code/daemon.py:786-798`.
  Test: `tests/test_e2e_daemon.py::test_shutdown_timeout_with_stuck_task`.
- **Patch 11**: `daemon_lock_path()` and `daemon_spawn_lock_path()` split the lifetime singleton lock from client spawn coordination.
  File: `cocoindex_code/daemon.py:171-200`.
  Test: `tests/test_daemon.py::test_daemon_lock_path_is_separate_from_pid_path`.
- **Patch 12**: `_wait_for_daemon_claim()` holds spawn coordination until `daemon.pid` contains a live PID or the spawned process exits. `_spawn_daemon_process()` now returns the `subprocess.Popen` handle.
  File: `cocoindex_code/client.py:269-310`.
  Tests: `tests/test_daemon.py::test_wait_for_daemon_claim_returns_when_pid_appears`, `::test_wait_for_daemon_claim_returns_when_spawn_dies`, `::test_wait_for_daemon_claim_returns_at_timeout`.

---

## 2. STRUCTURE

```
mcp_server/
├── cocoindex_code/        # Vendored Python source (15 files, soft-fork)
│   ├── LICENSE            # Apache 2.0 (preserved with package)
│   ├── _version.py        # Fork version string
│   ├── indexer.py         # Patched: REQ-002 + REQ-004
│   ├── query.py           # Patched: REQ-003 + REQ-005 + REQ-006
│   ├── schema.py          # Patched: REQ-002 + REQ-004 fields
│   └── ...                # Unmodified upstream files
├── pyproject.toml         # Package metadata for editable install
├── MAINTENANCE.md         # Upstream sync workflow
├── README.md              # This file
└── .venv/                 # Isolated venv created by install.sh (gitignored)
```

### Key Files

| File | Purpose |
|------|---------|
| `pyproject.toml` | Package metadata, fork version pin, `ccc` console script entry |
| `cocoindex_code/_version.py` | Fork version string read by `ccc --version` |
| `cocoindex_code/indexer.py` | Document scanning and chunk storage with patched fields |
| `cocoindex_code/query.py` | Query path with patched dedup, reranking, and telemetry |
| `cocoindex_code/schema.py` | Result and chunk dataclasses with patched fields |
| `MAINTENANCE.md` | Step-by-step upstream sync workflow |

---

## 3. RELATED DOCUMENTS

| Document | Purpose |
|----------|---------|
| [`../NOTICE`](../NOTICE) | Apache 2.0 attribution and modification log |
| [`../changelog/CHANGELOG.md`](../changelog/CHANGELOG.md) | Per-version change history |
| [`./MAINTENANCE.md`](./MAINTENANCE.md) | Upstream sync workflow |
| [`../INSTALL_GUIDE.md`](../INSTALL_GUIDE.md) | End-to-end install instructions |
| [`../SKILL.md`](../SKILL.md) | Parent skill documentation |
| [Upstream repo](https://github.com/cocoindex-io/cocoindex-code) | Source project on GitHub |
