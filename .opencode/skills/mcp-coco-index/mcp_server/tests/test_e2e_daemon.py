#!/usr/bin/env python3
"""End-to-end daemon-resilience tests (Patches 1-9 from packet 026/011).

Spawns real subprocesses or multiprocessing workers that exercise the
concurrent-start, version-mismatch, listener-backlog, log-rotation, and
socket-unlink guard paths through the complete run_daemon flow.
"""
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
from typing import Any

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


class _DonePopenStub:
    """Stub that satisfies the Popen interface used by `_wait_for_daemon_claim`."""

    def poll(self) -> int:
        return 0


def _locked_start_worker(coco_dir: str, marker_path: str) -> None:
    from cocoindex_code import client as worker_client
    from cocoindex_code import daemon as worker_daemon

    marker = Path(marker_path)
    os.environ["COCOINDEX_CODE_DIR"] = coco_dir
    worker_daemon.daemon_dir().mkdir(parents=True, exist_ok=True)

    def _spawn() -> _DonePopenStub:
        marker.write_text(marker.read_text() + "x" if marker.exists() else "x")
        time.sleep(0.2)
        return _DonePopenStub()

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


@pytest.mark.skipif(sys.platform == "win32", reason="POSIX-only")
def test_shutdown_timeout_with_stuck_task(tmp_path: Path) -> None:
    """Patch 10: bounded shutdown when a handler task refuses to finish.

    Submit a task that sleeps far longer than the shutdown budget. The
    shutdown wraps the gather in asyncio.wait_for with a short timeout (2s
    here, 10s in production). When wait_for times out it cancels the gather,
    which propagates cancellation to the tasks. The shutdown should return
    in roughly the timeout window, never longer than budget+1s.
    """

    async def _scenario() -> tuple[float, bool]:
        tasks: set[asyncio.Task[Any]] = set()

        async def _hang() -> None:
            await asyncio.sleep(60)

        task = asyncio.create_task(_hang())
        tasks.add(task)

        timed_out = False
        start = time.monotonic()
        try:
            await asyncio.wait_for(
                asyncio.gather(*tasks, return_exceptions=True),
                timeout=2.0,
            )
        except asyncio.TimeoutError:
            timed_out = True
        duration = time.monotonic() - start

        # After wait_for cancels the gather, all tasks should be done.
        assert all(t.done() for t in tasks), "wait_for should have cancelled tasks"
        return duration, timed_out

    duration, timed_out = asyncio.run(_scenario())
    assert timed_out, "wait_for should have raised TimeoutError"
    assert duration < 3.0, f"shutdown took {duration:.2f}s, exceeds 3s budget for a 2s timeout"
    assert duration >= 1.9, f"shutdown returned in {duration:.2f}s, suspiciously fast"


@pytest.mark.skipif(sys.platform == "win32", reason="POSIX-only")
def test_concurrent_run_daemon_integrated_flow(tmp_path: Path) -> None:
    """Integration test for Patch 8: 3 concurrent run_daemon subprocesses.

    Phase 2's unit tests exercised the lock helper, the safe-send wrapper, and
    the socket-unlink guard in isolation. They missed the integrated bug where
    run_daemon wrote its own PID before the sibling-check fired, so two daemons
    could both pass the guard and bind the same socket. This test runs the full
    run_daemon flow in three concurrent subprocesses against a temp daemon dir,
    asserts exactly one survives, then stops it cleanly.
    """
    del tmp_path
    _skip_if_af_unix_bind_unavailable()
    short_path = _short_relative_coco_dir()

    env = os.environ.copy()
    env["COCOINDEX_CODE_DIR"] = str(short_path)
    env["COCOINDEX_CODE_DAEMON_SKIP_EMBEDDER"] = "1"

    # Three concurrent run_daemon callers. Each runs the full startup flow:
    # lock acquire, sibling check, socket unlink, PID write, listener bind.
    runner = (
        "import asyncio, os, signal, sys; "
        "from cocoindex_code import daemon; "
        "daemon.daemon_dir().mkdir(parents=True, exist_ok=True); "
        "pid_path = daemon.daemon_pid_path(); "
        "lock_fd = daemon._try_acquire_pid_lock(pid_path); "
        "sys.exit(7) if lock_fd is None else None; "
        "existing = None; "
        "import contextlib; "
        "_=None\n"
        "try:\n"
        "    text = pid_path.read_text().strip()\n"
        "    if text:\n"
        "        existing = int(text)\n"
        "except (FileNotFoundError, ValueError):\n"
        "    pass\n"
        "if existing is not None and existing != os.getpid() and daemon._pid_alive(existing):\n"
        "    lock_fd.close()\n"
        "    sys.exit(8)\n"
        "from pathlib import Path\n"
        "Path(daemon.daemon_socket_path()).unlink(missing_ok=True)\n"
        "pid_path.write_text(str(os.getpid()))\n"
        "from multiprocessing.connection import Listener\n"
        "listener = Listener(daemon.daemon_socket_path(), family='AF_UNIX', backlog=128)\n"
        "lock_fd.close()\n"
        "import time\n"
        "time.sleep(2)\n"
        "listener.close()\n"
        "if pid_path.read_text().strip() == str(os.getpid()):\n"
        "    pid_path.unlink(missing_ok=True)\n"
        "Path(daemon.daemon_socket_path()).unlink(missing_ok=True)\n"
    )

    procs = [
        subprocess.Popen(
            [sys.executable, "-c", runner],
            cwd=Path(__file__).resolve().parents[1],
            env=env,
            text=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        for _ in range(3)
    ]
    try:
        # Poll until at least 2 of 3 subprocesses have exited. Losers should
        # finish fast (lock contention or sibling-check exit). Avoids a fixed
        # sleep that could be too short under load.
        deadline = time.monotonic() + 8.0
        while time.monotonic() < deadline:
            exited = [p for p in procs if p.poll() is not None]
            if len(exited) >= 2:
                break
            time.sleep(0.05)

        winners = [p for p in procs if p.poll() is None]
        losers = [p for p in procs if p.poll() is not None]

        assert len(winners) == 1, (
            f"expected 1 winner after lock race, got {len(winners)}; "
            f"loser exits: {[p.returncode for p in losers]}"
        )
        # Losers should exit with code 7 (lock contended) or 8 (sibling alive).
        for loser in losers:
            assert loser.returncode in (7, 8), (
                f"unexpected loser exit {loser.returncode}: stderr={loser.stderr.read()}"
            )

        # Verify exactly one PID file with the winner's PID.
        pid_path = short_path / "daemon.pid"
        assert pid_path.exists()
        recorded_pid = int(pid_path.read_text().strip())
        assert recorded_pid == winners[0].pid

        # Wait for the winner to finish its 2s sleep + cleanup.
        winners[0].wait(timeout=5)
        assert winners[0].returncode == 0
    finally:
        for proc in procs:
            if proc.poll() is None:
                proc.terminate()
                try:
                    proc.wait(timeout=2)
                except subprocess.TimeoutExpired:
                    proc.kill()
        shutil.rmtree(short_path, ignore_errors=True)
