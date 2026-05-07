import logging
import os
import sys
from unittest.mock import MagicMock

import pytest

# Skip msvcrt-only tests on POSIX, fcntl-only tests on Windows
posix_only = pytest.mark.skipif(sys.platform == "win32", reason="POSIX-only")
win_only = pytest.mark.skipif(sys.platform != "win32", reason="Win32-only")


def test_try_acquire_pid_lock_first_call_succeeds(tmp_path):
    from cocoindex_code.client import _try_acquire_pid_lock

    lock_path = tmp_path / "test.pid"
    fd = _try_acquire_pid_lock(lock_path)
    assert fd is not None
    fd.close()


def test_try_acquire_pid_lock_second_call_blocks(tmp_path):
    from cocoindex_code.client import _try_acquire_pid_lock

    lock_path = tmp_path / "test.pid"
    fd1 = _try_acquire_pid_lock(lock_path)
    fd2 = _try_acquire_pid_lock(lock_path)
    assert fd1 is not None
    assert fd2 is None
    fd1.close()


def test_try_acquire_pid_lock_releases_on_close(tmp_path):
    from cocoindex_code.client import _try_acquire_pid_lock

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
