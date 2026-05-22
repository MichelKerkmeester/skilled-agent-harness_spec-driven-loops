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
import json
from pathlib import Path
from typing import Any

try:
    from scripts.sidecar_ledger import (
        SidecarLedgerRow,
        add_sidecar_row,
        default_state_dir,
        find_reusable_sidecar,
        load_or_create_owner_token,
        now_iso,
        reclaim_stale,
    )
except ModuleNotFoundError:  # pragma: no cover - direct script execution
    from sidecar_ledger import (  # type: ignore[no-redef]
        SidecarLedgerRow,
        add_sidecar_row,
        default_state_dir,
        find_reusable_sidecar,
        load_or_create_owner_token,
        now_iso,
        reclaim_stale,
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


def _owner_token_digest(owner_token: str) -> str:
    return hashlib.sha256(owner_token.encode("utf-8")).hexdigest()


def health_payload(port: int, timeout_seconds: float = 2.0) -> dict[str, Any] | None:
    url = f"http://127.0.0.1:{port}/health"
    try:
        with urllib.request.urlopen(url, timeout=timeout_seconds) as response:
            body = response.read(8192)
            if response.status != 200:
                return None
            parsed = json.loads(body.decode("utf-8"))
            return parsed if isinstance(parsed, dict) else None
    except (OSError, urllib.error.URLError, TimeoutError):
        return None
    except (UnicodeDecodeError, json.JSONDecodeError):
        return None


def is_healthy(
    port: int,
    timeout_seconds: float = 2.0,
    *,
    expected_owner_token: str | None = None,
    expected_config_hash: str | None = None,
) -> bool:
    payload = health_payload(port, timeout_seconds=timeout_seconds)
    if payload is None:
        return False
    if expected_owner_token is not None and payload.get("owner_token_sha256") != _owner_token_digest(expected_owner_token):
        return False
    if expected_config_hash is not None and payload.get("canonical_config_hash") != expected_config_hash:
        return False
    return True


def wait_for_healthy(
    port: int,
    deadline: float,
    *,
    expected_owner_token: str | None = None,
    expected_config_hash: str | None = None,
) -> bool:
    while time.monotonic() < deadline:
        if is_healthy(
            port,
            timeout_seconds=2.0,
            expected_owner_token=expected_owner_token,
            expected_config_hash=expected_config_hash,
        ):
            return True
        time.sleep(0.5)
    return False


def _owner_token(skill_path: Path, state_dir: Path) -> str:
    explicit = os.environ.get("RERANK_SIDECAR_OWNER_TOKEN", "").strip()
    if explicit:
        return explicit
    return load_or_create_owner_token(state_dir)


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


def _terminate_process_group(proc: subprocess.Popen[Any], grace_seconds: float = 2.0) -> str:
    """Terminate a spawned sidecar session before returning degraded fallback."""
    try:
        if sys.platform != "win32":
            os.killpg(proc.pid, signal.SIGTERM)
        else:
            proc.terminate()
    except OSError:
        return "already-exited"
    try:
        proc.wait(timeout=grace_seconds)
        return "terminated"
    except subprocess.TimeoutExpired:
        try:
            if sys.platform != "win32":
                os.killpg(proc.pid, signal.SIGKILL)
            else:
                proc.kill()
        except OSError:
            return "sigkill-missed"
        try:
            proc.wait(timeout=grace_seconds)
            return "killed"
        except subprocess.TimeoutExpired:
            return "kill-timeout"


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
    state_dir = default_state_dir()
    owner_token = _owner_token(skill_path, state_dir)
    config_hash = _canonical_config_hash(resolved_port)
    reusable, classifications = find_reusable_sidecar(
        state_dir,
        expected_owner_token=owner_token,
        canonical_config_hash=config_hash,
        health_check=lambda ledger_port: is_healthy(
            ledger_port,
            timeout_seconds=2.0,
            expected_owner_token=owner_token,
            expected_config_hash=config_hash,
        ),
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
    env = {
        **os.environ,
        "RERANK_SIDECAR_PORT": str(resolved_port),
        "RERANK_SIDECAR_OWNER_TOKEN": owner_token,
        "RERANK_SIDECAR_CONFIG_HASH": config_hash,
    }
    proc = subprocess.Popen(
        ["bash", str(start_script)],
        stdin=subprocess.DEVNULL,
        stdout=log_file,
        stderr=log_file,
        env=env,
        start_new_session=True,
    )
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

    ok = wait_for_healthy(
        resolved_port,
        time.monotonic() + float(health_timeout_seconds),
        expected_owner_token=owner_token,
        expected_config_hash=config_hash,
    )
    if not ok:
        termination = _terminate_process_group(proc)
        reclaim_stale(state_dir)
        _log(f"sidecar warmup timed out after {health_timeout_seconds}s")
        return {
            "spawned": False,
            "port": resolved_port,
            "ownerPid": proc.pid,
            "fallback": "warmup-timeout",
            "termination": termination,
            "ledger": "recorded-before-warmup",
        }
    if proc.poll() is not None:
        reclaim_stale(state_dir)
        return {
            "spawned": False,
            "port": resolved_port,
            "ownerPid": proc.pid,
            "fallback": "spawned-process-exited",
            "ledger": "recorded-before-warmup",
        }

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
