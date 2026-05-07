from __future__ import annotations

import asyncio
import logging
import multiprocessing
import os
import shutil
import subprocess
import sys
import time
from logging.handlers import RotatingFileHandler
from multiprocessing.connection import Client, Listener
from pathlib import Path

import pytest

from cocoindex_code import client, daemon
from cocoindex_code._version import __version__
from cocoindex_code.protocol import HandshakeRequest, StopRequest, decode_response, encode_request


def _wait_for_socket(socket_path: Path, timeout: float = 5.0) -> None:
    deadline = time.monotonic() + timeout
    while time.monotonic() < deadline:
        if socket_path.exists():
            return
        time.sleep(0.05)
    raise TimeoutError(f"socket not ready: {socket_path}")


def _short_relative_coco_dir() -> Path:
    path = Path(f".cidx-test-{os.getpid()}-{time.monotonic_ns()}")
    path.mkdir()
    return path


def _skip_if_af_unix_bind_unavailable() -> None:
    probe_dir = _short_relative_coco_dir()
    try:
        listener = Listener(str(probe_dir / "probe.sock"), family="AF_UNIX")
        listener.close()
    except PermissionError:
        pytest.skip("sandbox does not permit AF_UNIX socket bind")
    finally:
        shutil.rmtree(probe_dir, ignore_errors=True)


def _run_async_daemon(coco_dir: str, write_pid: bool = False) -> None:
    os.environ["COCOINDEX_CODE_DIR"] = coco_dir
    daemon.daemon_dir().mkdir(parents=True, exist_ok=True)
    if write_pid:
        daemon.daemon_pid_path().write_text(str(os.getpid()))
    asyncio.run(daemon._async_daemon_main(object(), None))  # type: ignore[arg-type]


def _locked_start_worker(coco_dir: str, marker_path: str) -> None:
    from cocoindex_code import client as worker_client
    from cocoindex_code import daemon as worker_daemon

    marker = Path(marker_path)
    os.environ["COCOINDEX_CODE_DIR"] = coco_dir
    worker_daemon.daemon_dir().mkdir(parents=True, exist_ok=True)

    def _spawn() -> None:
        marker.write_text(marker.read_text() + "x" if marker.exists() else "x")
        time.sleep(0.2)

    worker_client._spawn_daemon_process = _spawn  # type: ignore[method-assign]
    worker_client.start_daemon()


def _version_restart_worker(pid_path: str, stop_restart_count: multiprocessing.Value) -> None:
    fd = client._try_acquire_pid_lock(Path(pid_path))
    if fd is None:
        return
    try:
        with stop_restart_count.get_lock():
            stop_restart_count.value += 1
        time.sleep(0.2)
    finally:
        fd.close()


def _stop_async_daemon(coco_dir: Path) -> None:
    conn = Client(str(coco_dir / "daemon.sock"), family="AF_UNIX")
    conn.send_bytes(encode_request(HandshakeRequest(version=__version__)))
    decode_response(conn.recv_bytes())
    conn.send_bytes(encode_request(StopRequest()))
    decode_response(conn.recv_bytes())
    conn.close()


@pytest.mark.skipif(sys.platform == "win32", reason="POSIX-only")
def test_concurrency_stress_eight_processes(tmp_path: Path) -> None:
    marker = tmp_path / "spawn-count"
    processes = [
        multiprocessing.Process(target=_locked_start_worker, args=(str(tmp_path), str(marker)))
        for _ in range(8)
    ]
    for process in processes:
        process.start()
    for process in processes:
        process.join(timeout=5)
        assert process.exitcode == 0

    assert marker.read_text() == "x"


@pytest.mark.skipif(sys.platform == "win32", reason="POSIX-only")
def test_version_mismatch_three_callers(tmp_path: Path) -> None:
    pid_path = tmp_path / "daemon.pid"
    stop_restart_count = multiprocessing.Value("i", 0)
    processes = [
        multiprocessing.Process(
            target=_version_restart_worker,
            args=(str(pid_path), stop_restart_count),
        )
        for _ in range(3)
    ]
    for process in processes:
        process.start()
    for process in processes:
        process.join(timeout=5)
        assert process.exitcode == 0

    assert stop_restart_count.value == 1


@pytest.mark.skipif(sys.platform == "win32", reason="POSIX-only")
def test_backlog_sixteen_simultaneous(tmp_path: Path) -> None:
    del tmp_path
    _skip_if_af_unix_bind_unavailable()
    short_path = _short_relative_coco_dir()
    try:
        process = multiprocessing.Process(target=_run_async_daemon, args=(str(short_path),))
        process.start()
        try:
            _wait_for_socket(short_path / "daemon.sock")
            conns = [Client(str(short_path / "daemon.sock"), family="AF_UNIX") for _ in range(16)]
            for conn in conns:
                conn.send_bytes(encode_request(HandshakeRequest(version=__version__)))
            responses = [decode_response(conn.recv_bytes()) for conn in conns]
            for conn in conns:
                conn.close()
            assert all(getattr(resp, "ok", False) for resp in responses)
            _stop_async_daemon(short_path)
            process.join(timeout=5)
            assert process.exitcode == 0
        finally:
            if process.is_alive():
                process.terminate()
                process.join(timeout=5)
    finally:
        shutil.rmtree(short_path, ignore_errors=True)


def test_log_rotation_eleven_megabytes(tmp_path: Path) -> None:
    logger = logging.getLogger("cocoindex_code.tests.rotation")
    logger.handlers.clear()
    logger.propagate = False
    logger.setLevel(logging.INFO)
    handler = RotatingFileHandler(
        tmp_path / "daemon.log",
        maxBytes=10 * 1024 * 1024,
        backupCount=5,
        encoding="utf-8",
    )
    logger.addHandler(handler)
    try:
        chunk = "x" * 1024
        for _ in range(11 * 1024):
            logger.info(chunk)
    finally:
        handler.close()
        logger.handlers.clear()

    assert (tmp_path / "daemon.log.1").exists()
    assert (tmp_path / "daemon.log").stat().st_size < 10 * 1024 * 1024


@pytest.mark.skipif(sys.platform == "win32", reason="POSIX-only")
def test_socket_unlink_guard_two_processes(tmp_path: Path) -> None:
    del tmp_path
    _skip_if_af_unix_bind_unavailable()
    short_path = _short_relative_coco_dir()
    try:
        process = multiprocessing.Process(target=_run_async_daemon, args=(str(short_path), True))
        process.start()
        try:
            socket_path = short_path / "daemon.sock"
            _wait_for_socket(socket_path)
            before_mtime = socket_path.stat().st_mtime_ns

            probe = subprocess.run(
                [
                    sys.executable,
                    "-c",
                    (
                        "import os; "
                        "from pathlib import Path; "
                        "from cocoindex_code import daemon; "
                        f"os.environ['COCOINDEX_CODE_DIR'] = {str(short_path)!r}; "
                        "daemon._unlink_stale_socket("
                        "Path(daemon.daemon_socket_path()), daemon.daemon_pid_path())"
                    ),
                ],
                cwd=Path(__file__).resolve().parents[1],
                text=True,
                capture_output=True,
                check=False,
            )

            assert probe.returncode != 0
            assert "refusing to unlink socket" in probe.stderr
            assert socket_path.stat().st_mtime_ns == before_mtime
            _stop_async_daemon(short_path)
            process.join(timeout=5)
            assert process.exitcode == 0
        finally:
            if process.is_alive():
                process.terminate()
                process.join(timeout=5)
    finally:
        shutil.rmtree(short_path, ignore_errors=True)
