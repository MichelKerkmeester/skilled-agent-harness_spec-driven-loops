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
    from scripts import sidecar_ledger
    from scripts.sidecar_ledger import (
        SidecarLedgerRow,
        add_sidecar_row,
        current_owner_identity,
        default_state_dir,
        find_reusable_sidecar,
        locked_register_owner,
        load_or_create_owner_token,
        now_iso,
        process_liveness,
        reclaim_stale,
        should_reap_row,
    )
except ModuleNotFoundError:  # pragma: no cover - direct script execution
    import sidecar_ledger  # type: ignore[no-redef]
    from sidecar_ledger import (  # type: ignore[no-redef]
        SidecarLedgerRow,
        add_sidecar_row,
        current_owner_identity,
        default_state_dir,
        find_reusable_sidecar,
        locked_register_owner,
        load_or_create_owner_token,
        now_iso,
        process_liveness,
        reclaim_stale,
        should_reap_row,
    )

DEFAULT_PORT = 8765
DEFAULT_HEALTH_TIMEOUT_SECONDS = 20.0
DEFAULT_REAP_HEALTH_TIMEOUT_SECONDS = 0.1
MAX_HEALTH_BODY_BYTES = 65536  # 64KB to match JS ensure-rerank-sidecar.cjs
SCRIPT_DIR = Path(__file__).resolve().parent
SIDECAR_SKILL_PATH = SCRIPT_DIR.parent
START_SCRIPT_PATH = SCRIPT_DIR / "start.sh"
OWNER_SOURCE = "ensure_rerank_sidecar.py"


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
            body = response.read(MAX_HEALTH_BODY_BYTES)
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
    # Empty string is treated as "not set" to match JS behavior (|| operator)
    # JS sibling mirrors this contract in ensure-rerank-sidecar.cjs:135-150
    revision_env = os.environ.get("RERANK_MODEL_REVISION", "").strip()
    revision = revision_env if revision_env else "e61197ed45024b0ed8a2d74b80b4d909f1255473"
    config = {
        "port": str(port),
        "model": os.environ.get("RERANK_MODEL_NAME", "Qwen/Qwen3-Reranker-0.6B"),
        "revision": revision,
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


def _reaper_health_timeout_seconds() -> float:
    try:
        parsed = float(os.environ.get("RERANK_SIDECAR_REAPER_HEALTH_TIMEOUT_MS", "")) / 1000.0
    except ValueError:
        return DEFAULT_REAP_HEALTH_TIMEOUT_SECONDS
    return parsed if parsed > 0 else DEFAULT_REAP_HEALTH_TIMEOUT_SECONDS


def _reaper_telemetry_path(state_dir: Path) -> Path:
    configured = os.environ.get("RERANK_SIDECAR_REAPER_TELEMETRY_PATH", "").strip()
    if configured:
        return Path(configured).expanduser().resolve()
    return Path.home() / "Library" / "Logs" / "spec-kit" / "sidecar-reaper.jsonl"


def _write_reaper_telemetry(state_dir: Path, event: dict[str, Any]) -> None:
    target = _reaper_telemetry_path(state_dir)
    try:
        target.parent.mkdir(parents=True, exist_ok=True)
        with target.open("a", encoding="utf-8") as handle:
            handle.write(json.dumps(event, sort_keys=True) + "\n")
    except OSError:
        return


def _raw_ledger_payload(state_dir: Path) -> Any:
    try:
        return json.loads(sidecar_ledger.ledger_path(state_dir).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return {"version": sidecar_ledger.LEDGER_VERSION, "sidecars": []}


def _raw_rows(payload: Any) -> list[Any]:
    if isinstance(payload, list):
        return payload
    if not isinstance(payload, dict):
        return []
    if isinstance(payload.get("sidecars"), list):
        return payload["sidecars"]
    if isinstance(payload.get("rows"), list):
        return payload["rows"]
    return []


def _row_pid(raw: Any) -> int | None:
    if not isinstance(raw, dict):
        return None
    try:
        pid = int(raw.get("pid", raw.get("sidecar_pid")))
    except (TypeError, ValueError):
        return None
    return pid if pid > 0 else None


def _raw_rows_missing_owners(raw_rows: list[Any]) -> set[int]:
    missing: set[int] = set()
    for raw in raw_rows:
        pid = _row_pid(raw)
        if pid is not None and isinstance(raw, dict) and "owners" not in raw:
            missing.add(pid)
    return missing


def _write_raw_ledger_atomic_unlocked(state_dir: Path, raw_rows: list[Any]) -> None:
    state_dir.mkdir(parents=True, exist_ok=True)
    target = sidecar_ledger.ledger_path(state_dir)
    fd, temp_name = tempfile.mkstemp(
        prefix=f"{sidecar_ledger.LEDGER_FILE_NAME}.tmp.{os.getpid()}.",
        dir=str(state_dir),
        text=True,
    )
    temp_path = Path(temp_name)
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as handle:
            json.dump({"version": sidecar_ledger.LEDGER_VERSION, "sidecars": raw_rows}, handle, indent=2, sort_keys=True)
            handle.write("\n")
            handle.flush()
            os.fsync(handle.fileno())
        os.replace(temp_path, target)
    except Exception:
        try:
            temp_path.unlink()
        except OSError:
            pass
        raise


def preflight_reap_sidecars(state_dir: Path) -> list[SidecarLedgerRow]:
    """Reap ledger-managed sidecars whose registered owners are dead and health is unreachable."""
    timeout_seconds = _reaper_health_timeout_seconds()
    with sidecar_ledger._locked_ledger(state_dir):  # type: ignore[attr-defined]
        payload = _raw_ledger_payload(state_dir)
        raw_rows = _raw_rows(payload)
        missing_owner_rows = _raw_rows_missing_owners(raw_rows)
        rows = sidecar_ledger._read_ledger_unlocked(state_dir)  # type: ignore[attr-defined]
        reaped: list[SidecarLedgerRow] = []
        reaped_pids: set[int] = set()

        for row in rows:
            if row.pid in missing_owner_rows:
                continue
            if not should_reap_row(row, owner_liveness_check=process_liveness):
                continue
            if is_healthy(row.port, timeout_seconds=timeout_seconds):
                continue
            try:
                os.kill(row.pid, signal.SIGTERM)
            except OSError:
                pass
            reaped.append(row)
            reaped_pids.add(row.pid)
            _write_reaper_telemetry(
                state_dir,
                {
                    "timestamp": now_iso(),
                    "event": "launcher-preflight-reap",
                    "pid": row.pid,
                    "port": row.port,
                    "owner_count": len(row.owners),
                    "reason": "owners-dead-health-unreachable",
                },
            )

        if reaped_pids:
            kept_raw_rows = [raw for raw in raw_rows if _row_pid(raw) not in reaped_pids]
            _write_raw_ledger_atomic_unlocked(state_dir, kept_raw_rows)
        return reaped


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
    owner = current_owner_identity(source=OWNER_SOURCE)
    preflight_reap_sidecars(state_dir)
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
        locked_register_owner(state_dir, sidecar_pid=reusable.pid, source=OWNER_SOURCE)
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
        owners=(owner,),
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
