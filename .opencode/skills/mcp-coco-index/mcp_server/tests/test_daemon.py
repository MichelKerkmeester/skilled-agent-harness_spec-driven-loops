#!/usr/bin/env python3
"""Unit tests for daemon-resilience helpers (Patches 1-3 from packet 026/011).

Exercises the lock acquisition, safe-send wrapper, and socket-unlink guard in
isolation. Integration coverage of the run_daemon flow lives in
test_e2e_daemon.py.
"""
import asyncio
import logging
import os
import sys
from unittest.mock import AsyncMock, MagicMock

import pytest

# Skip msvcrt-only tests on POSIX, fcntl-only tests on Windows
posix_only = pytest.mark.skipif(sys.platform == "win32", reason="POSIX-only")
win_only = pytest.mark.skipif(sys.platform != "win32", reason="Win32-only")


def test_try_acquire_pid_lock_first_call_succeeds(tmp_path):
    from cocoindex_code.core.client import _try_acquire_pid_lock

    lock_path = tmp_path / "test.pid"
    fd = _try_acquire_pid_lock(lock_path)
    assert fd is not None
    fd.close()


def test_try_acquire_pid_lock_second_call_blocks(tmp_path):
    from cocoindex_code.core.client import _try_acquire_pid_lock

    lock_path = tmp_path / "test.pid"
    fd1 = _try_acquire_pid_lock(lock_path)
    fd2 = _try_acquire_pid_lock(lock_path)
    assert fd1 is not None
    assert fd2 is None
    fd1.close()


def test_try_acquire_pid_lock_releases_on_close(tmp_path):
    from cocoindex_code.core.client import _try_acquire_pid_lock

    lock_path = tmp_path / "test.pid"
    fd1 = _try_acquire_pid_lock(lock_path)
    assert fd1 is not None
    fd1.close()
    fd2 = _try_acquire_pid_lock(lock_path)
    assert fd2 is not None
    fd2.close()


def test_safe_send_bytes_swallows_broken_pipe(caplog):
    from cocoindex_code.daemon import _safe_send_bytes

    conn = MagicMock()
    conn.send_bytes.side_effect = BrokenPipeError("pipe closed")
    with caplog.at_level(logging.INFO, logger="cocoindex_code.daemon"):
        _safe_send_bytes(conn, b"payload")
    assert any("disconnected" in record.message for record in caplog.records)


def test_safe_send_bytes_swallows_connection_reset(caplog):
    from cocoindex_code.daemon import _safe_send_bytes

    conn = MagicMock()
    conn.send_bytes.side_effect = ConnectionResetError("reset")
    with caplog.at_level(logging.INFO, logger="cocoindex_code.daemon"):
        _safe_send_bytes(conn, b"payload")
    assert any("disconnected" in record.message for record in caplog.records)


def test_safe_send_bytes_normal_path():
    from cocoindex_code.daemon import _safe_send_bytes

    conn = MagicMock()
    _safe_send_bytes(conn, b"hello")
    conn.send_bytes.assert_called_once_with(b"hello")


@posix_only
def test_socket_unlink_guard_alive_sibling(tmp_path, monkeypatch):
    """If a sibling daemon is alive, unlink guard raises RuntimeError."""
    from cocoindex_code import daemon as daemon_module

    pid_path = tmp_path / "daemon.pid"
    socket_path = tmp_path / "daemon.sock"
    pid_path.write_text("99999")
    socket_path.touch()
    monkeypatch.setattr(daemon_module, "_pid_alive", lambda pid: pid == 99999)

    with pytest.raises(RuntimeError, match="refusing to unlink socket"):
        daemon_module._unlink_stale_socket(socket_path, pid_path)
    assert socket_path.exists()


@posix_only
def test_socket_unlink_guard_dead_sibling(tmp_path, monkeypatch):
    """If the sibling PID is dead, the unlink proceeds normally."""
    from cocoindex_code import daemon as daemon_module

    pid_path = tmp_path / "daemon.pid"
    socket_path = tmp_path / "daemon.sock"
    pid_path.write_text("99999")
    socket_path.touch()
    monkeypatch.setattr(daemon_module, "_pid_alive", lambda pid: False)

    daemon_module._unlink_stale_socket(socket_path, pid_path)
    assert not socket_path.exists()


def test_handle_connection_six_sites_parameterized_placeholder():
    """Coverage marker for the six safe-send connection paths."""
    from cocoindex_code.daemon import _safe_send_bytes

    conn = MagicMock()
    conn.send_bytes.side_effect = BrokenPipeError("pipe closed")
    for _ in range(6):
        _safe_send_bytes(conn, b"payload")
    assert conn.send_bytes.call_count == 6


def test_daemon_lock_path_is_separate_from_pid_path():
    """Patch 11: daemon.lock and daemon.pid are different files."""
    from cocoindex_code.daemon import daemon_lock_path, daemon_pid_path

    assert daemon_lock_path() != daemon_pid_path()
    assert daemon_lock_path().name == "daemon.lock"
    assert daemon_pid_path().name == "daemon.pid"
    assert daemon_lock_path().parent == daemon_pid_path().parent


def test_async_daemon_main_closes_lifetime_lock_on_shutdown(monkeypatch):
    from cocoindex_code import daemon as daemon_module

    class FakeEvent:
        def is_set(self):
            return True

        def set(self):
            return None

        async def wait(self):
            return None

    class FakeListener:
        closed = False

        def __init__(self, *args, **kwargs):
            pass

        def close(self):
            self.closed = True

    class FakeFd:
        closed = False

        def close(self):
            self.closed = True

    fake_fd = FakeFd()
    monkeypatch.setattr(daemon_module.asyncio, "Event", FakeEvent)
    monkeypatch.setattr(daemon_module, "Listener", FakeListener)
    monkeypatch.setattr(daemon_module, "daemon_socket_path", lambda: "unused.sock")

    asyncio.run(daemon_module._async_daemon_main(MagicMock(), None, fake_fd))

    assert fake_fd.closed is True


def test_update_index_reports_project_update_failure(tmp_path):
    """A project.update_index exception must surface as success=False."""
    from cocoindex_code.daemon import ProjectRegistry
    from cocoindex_code.core.protocol import IndexResponse

    async def _run():
        project_root = str(tmp_path)
        registry = ProjectRegistry(embedder=MagicMock())
        project = MagicMock()
        project.update_index = AsyncMock(side_effect=RuntimeError("boom"))
        registry._projects[project_root] = project
        registry._index_locks[project_root] = asyncio.Lock()
        registry._load_time_done[project_root] = asyncio.Event()

        return [response async for response in registry.update_index(project_root)]

    responses = asyncio.run(_run())

    assert isinstance(responses[-1], IndexResponse)
    assert responses[-1].success is False
    assert responses[-1].message == "boom"


def test_wait_for_daemon_claim_returns_when_pid_appears(tmp_path, monkeypatch):
    """Patch 12: returns as soon as daemon.pid contains a live PID."""
    from cocoindex_code.core import client as client_module

    pid_path = tmp_path / "daemon.pid"
    spawned = MagicMock()
    spawned.poll = MagicMock(return_value=None)  # spawn still running

    # Drop the live PID partway through. _pid_alive is patched to True.
    monkeypatch.setattr(client_module, "_pid_alive", lambda pid: True)
    pid_path.write_text(str(os.getpid()))

    import time as _time

    start = _time.monotonic()
    client_module._wait_for_daemon_claim(pid_path, spawned, timeout=2.0)
    duration = _time.monotonic() - start
    assert duration < 0.5, f"should have returned immediately on alive PID, took {duration:.2f}s"


def test_wait_for_daemon_claim_returns_when_spawn_dies(tmp_path):
    """Patch 12: returns when the spawned process exits, even if PID never appears."""
    from cocoindex_code.core import client as client_module

    pid_path = tmp_path / "daemon.pid"  # never populated
    spawned = MagicMock()
    spawned.poll = MagicMock(return_value=1)  # already exited

    import time as _time

    start = _time.monotonic()
    client_module._wait_for_daemon_claim(pid_path, spawned, timeout=2.0)
    duration = _time.monotonic() - start
    assert duration < 0.5, f"should have returned on dead spawn, took {duration:.2f}s"


def test_wait_for_daemon_claim_returns_at_timeout(tmp_path, monkeypatch):
    """Patch 12: bounded wait when neither claim happens nor spawn dies."""
    from cocoindex_code.core import client as client_module

    pid_path = tmp_path / "daemon.pid"  # never populated
    spawned = MagicMock()
    spawned.poll = MagicMock(return_value=None)  # spawn still running

    import time as _time

    start = _time.monotonic()
    client_module._wait_for_daemon_claim(pid_path, spawned, timeout=0.5)
    duration = _time.monotonic() - start
    assert duration >= 0.4, f"should have waited ~0.5s, took {duration:.2f}s"
    assert duration < 1.0, f"should not exceed timeout budget, took {duration:.2f}s"
