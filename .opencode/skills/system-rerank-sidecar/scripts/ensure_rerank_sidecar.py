#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: ENSURE RERANK SIDECAR (PYTHON SIBLING)
# ───────────────────────────────────────────────────────────────
"""Ensure the local rerank sidecar is running for MCP launchers.

Mirrors the contract of .opencode/bin/lib/ensure-rerank-sidecar.cjs for
CocoIndex's Python MCP entry point. Probes /health; spawns the sidecar
detached if absent; attaches as an HTTP client if present. Port-bind
EADDRINUSE is the atomicity primitive (mirrors packet 010/012 lease
pattern at the port level).

Usage: invoked by .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py::mcp
       before daemon connection.
"""

from __future__ import annotations

import os
import signal
import socket
import subprocess
import sys
import tempfile
import time
import urllib.error
import urllib.request
import hashlib
from pathlib import Path
from typing import Any

try:
    from scripts.sidecar_ledger import (
        SidecarLedgerRow,
        add_sidecar_row,
        default_state_dir,
        find_reusable_sidecar,
        now_iso,
    )
except ModuleNotFoundError:  # pragma: no cover - direct script execution
    from sidecar_ledger import (  # type: ignore[no-redef]
        SidecarLedgerRow,
        add_sidecar_row,
        default_state_dir,
        find_reusable_sidecar,
        now_iso,
    )

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


def _owner_token(skill_path: Path) -> str:
    explicit = os.environ.get("RERANK_SIDECAR_OWNER_TOKEN", "").strip()
    if explicit:
        return explicit
    project_root = os.environ.get("SPECKIT_PROJECT_ROOT", "").strip() or str(skill_path)
    return hashlib.sha256(str(Path(project_root).expanduser().resolve()).encode("utf-8")).hexdigest()


def _canonical_config_hash(port: int) -> str:
    config = {
        "port": str(port),
        "model": os.environ.get("RERANK_MODEL_NAME", "Qwen/Qwen3-Reranker-0.6B"),
        "revision": os.environ.get(
            "RERANK_MODEL_REVISION",
            "e61197ed45024b0ed8a2d74b80b4d909f1255473",
        ),
        "allowed": os.environ.get("RERANK_ALLOWED_MODELS", ""),
        "revisions": os.environ.get("RERANK_MODEL_REVISIONS", ""),
        "device": os.environ.get("RERANK_DEVICE", ""),
        "dtype": os.environ.get("RERANK_TORCH_DTYPE", ""),
    }
    stable = "\n".join(f"{key}={config[key]}" for key in sorted(config))
    return hashlib.sha256(stable.encode("utf-8")).hexdigest()


def _find_available_port(preferred_port: int) -> int:
    for candidate in range(preferred_port, preferred_port + 100):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            try:
                sock.bind(("127.0.0.1", candidate))
            except OSError:
                continue
            return candidate
    raise RuntimeError(f"no available rerank sidecar port near {preferred_port}")


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

    skill_path = Path(sidecar_skill_path).resolve() if sidecar_skill_path else SIDECAR_SKILL_PATH
    owner_token = _owner_token(skill_path)
    config_hash = _canonical_config_hash(resolved_port)
    state_dir = default_state_dir()
    reusable, classifications = find_reusable_sidecar(
        state_dir,
        expected_owner_token=owner_token,
        canonical_config_hash=config_hash,
        health_check=lambda ledger_port: is_healthy(ledger_port, timeout_seconds=2.0),
    )
    if reusable is not None:
        return {
            "spawned": False,
            "port": reusable.port,
            "ownerPid": reusable.pid,
            "ledger": "healthy-reusable",
        }

    if is_healthy(resolved_port, timeout_seconds=2.0):
        resolved_port = _find_available_port(resolved_port + 1)
        config_hash = _canonical_config_hash(resolved_port)

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

    row = SidecarLedgerRow(
        pid=proc.pid,
        port=resolved_port,
        ownerToken=owner_token,
        startedAtIso=now_iso(),
        lastHealthIso=now_iso(),
        executablePath=sys.executable,
        canonicalConfigHash=config_hash,
    )
    add_sidecar_row(state_dir, row)

    _log(f"sidecar spawned PID={proc.pid} listening on :{resolved_port}")
    return {
        "spawned": True,
        "port": resolved_port,
        "ownerPid": proc.pid,
        "ledger": "recorded",
        "classifications": [
            {"pid": item.row.pid, "port": item.row.port, "classification": item.classification}
            for item in classifications
        ],
    }
