#!/usr/bin/env python3
"""Ensure the local rerank sidecar is running for MCP launchers."""

from __future__ import annotations

import os
import signal
import subprocess
import sys
import tempfile
import time
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any

DEFAULT_PORT = 8765
DEFAULT_HEALTH_TIMEOUT_SECONDS = 20.0
SCRIPT_DIR = Path(__file__).resolve().parent
SIDECAR_SKILL_PATH = SCRIPT_DIR.parent
START_SCRIPT_PATH = SCRIPT_DIR / "start.sh"


def _log(message: str) -> None:
    print(f"[ensure-rerank-sidecar] {message}", file=sys.stderr)


def _resolve_port(value: Any, fallback: int = DEFAULT_PORT) -> int:
    try:
        parsed = int(value)
    except (TypeError, ValueError):
        return fallback
    return parsed if parsed > 0 else fallback


def is_healthy(port: int, timeout_seconds: float = 2.0) -> bool:
    url = f"http://127.0.0.1:{port}/health"
    try:
        with urllib.request.urlopen(url, timeout=timeout_seconds) as response:
            response.read(1)
            return response.status == 200
    except (OSError, urllib.error.URLError, TimeoutError):
        return False


def wait_for_healthy(port: int, deadline: float) -> bool:
    while time.monotonic() < deadline:
        if is_healthy(port, timeout_seconds=2.0):
            return True
        time.sleep(0.5)
    return False


def _open_sidecar_log():
    for cache_dir in (
        Path.home() / ".cache" / "mk-reranker",
        Path(tempfile.gettempdir()) / "mk-reranker",
    ):
        try:
            cache_dir.mkdir(parents=True, exist_ok=True)
            return (cache_dir / "sidecar.log").open("ab")
        except OSError:
            continue
    return subprocess.DEVNULL


def ensure_rerank_sidecar(
    *,
    port: int | None = None,
    sidecar_skill_path: str | Path | None = None,
    health_timeout_seconds: float = DEFAULT_HEALTH_TIMEOUT_SECONDS,
    skip_if_disabled: bool = True,
) -> dict[str, Any]:
    """Probe, spawn, and wait for the rerank sidecar with degraded fallback."""

    resolved_port = _resolve_port(port or os.environ.get("RERANK_SIDECAR_PORT"))
    cross_encoder_enabled = os.environ.get("SPECKIT_CROSS_ENCODER", "").lower() == "true"
    if skip_if_disabled and not cross_encoder_enabled:
        return {
            "spawned": False,
            "port": resolved_port,
            "fallback": "cross-encoder-disabled",
        }

    if is_healthy(resolved_port, timeout_seconds=2.0):
        return {"spawned": False, "port": resolved_port, "ownerPid": None}

    skill_path = Path(sidecar_skill_path).resolve() if sidecar_skill_path else SIDECAR_SKILL_PATH
    start_script = skill_path / "scripts" / "start.sh"
    if not start_script.exists():
        _log(f"sidecar skill missing at {start_script}; degrading to positional fallback")
        return {"spawned": False, "port": resolved_port, "fallback": "no-sidecar-skill"}

    log_file = _open_sidecar_log()
    env = {**os.environ, "RERANK_SIDECAR_PORT": str(resolved_port)}
    proc = subprocess.Popen(
        ["bash", str(start_script)],
        stdin=subprocess.DEVNULL,
        stdout=log_file,
        stderr=log_file,
        env=env,
        start_new_session=True,
    )

    ok = wait_for_healthy(resolved_port, time.monotonic() + float(health_timeout_seconds))
    if not ok:
        try:
            os.kill(proc.pid, signal.SIGTERM)
        except OSError:
            pass
        _log(f"sidecar warmup timed out after {health_timeout_seconds}s")
        return {"spawned": False, "port": resolved_port, "fallback": "warmup-timeout"}

    _log(f"sidecar spawned PID={proc.pid} listening on :{resolved_port}")
    return {"spawned": True, "port": resolved_port, "ownerPid": proc.pid}
