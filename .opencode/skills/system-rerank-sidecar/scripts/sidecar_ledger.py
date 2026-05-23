#!/usr/bin/env python3
"""Persistent ownership ledger for rerank sidecar processes."""

from __future__ import annotations

import json
import os
import secrets
import tempfile
import fcntl
from contextlib import contextmanager
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Callable, Literal

LEDGER_FILE_NAME = ".sidecar-ledger.json"
OWNER_TOKEN_FILE_NAME = ".sidecar-owner-token"
SidecarClassification = Literal[
    "healthy-reusable",
    "unknown-owner-refuse",
    "stale-pid-reclaim",
    "eperm-unknown",
    "port-unreachable",
    "config-hash-mismatch",
]

HealthChecker = Callable[[int], bool]
ProcessLivenessChecker = Callable[[int], dict[str, Any]]


@dataclass(frozen=True)
class SidecarLedgerRow:
    pid: int
    port: int
    ownerToken: str
    startedAtIso: str
    lastHealthIso: str
    executablePath: str
    canonicalConfigHash: str

    @classmethod
    def from_dict(cls, value: dict[str, Any]) -> "SidecarLedgerRow | None":
        try:
            row = cls(
                pid=int(value["pid"]),
                port=int(value["port"]),
                ownerToken=str(value["ownerToken"]),
                startedAtIso=str(value["startedAtIso"]),
                lastHealthIso=str(value["lastHealthIso"]),
                executablePath=str(value["executablePath"]),
                canonicalConfigHash=str(value["canonicalConfigHash"]),
            )
        except (KeyError, TypeError, ValueError):
            return None
        if row.pid <= 0 or row.port <= 0 or not row.ownerToken:
            return None
        return row

    def to_dict(self) -> dict[str, Any]:
        return {
            "pid": self.pid,
            "port": self.port,
            "ownerToken": self.ownerToken,
            "startedAtIso": self.startedAtIso,
            "lastHealthIso": self.lastHealthIso,
            "executablePath": self.executablePath,
            "canonicalConfigHash": self.canonicalConfigHash,
        }


@dataclass(frozen=True)
class ClassifiedSidecar:
    row: SidecarLedgerRow
    classification: SidecarClassification


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def ledger_path(state_dir: str | Path) -> Path:
    return Path(state_dir).expanduser().resolve() / LEDGER_FILE_NAME


def ledger_lock_path(state_dir: str | Path) -> Path:
    return Path(state_dir).expanduser().resolve() / f"{LEDGER_FILE_NAME}.lock"


def owner_token_path(state_dir: str | Path) -> Path:
    return Path(state_dir).expanduser().resolve() / OWNER_TOKEN_FILE_NAME


@contextmanager
def _locked_ledger(state_dir: str | Path):
    target_dir = Path(state_dir).expanduser().resolve()
    target_dir.mkdir(parents=True, exist_ok=True)
    lock_path = ledger_lock_path(target_dir)
    with lock_path.open("a+", encoding="utf-8") as handle:
        fcntl.flock(handle.fileno(), fcntl.LOCK_EX)
        try:
            yield
        finally:
            fcntl.flock(handle.fileno(), fcntl.LOCK_UN)


def default_state_dir() -> Path:
    configured = os.environ.get("RERANK_SIDECAR_STATE_DIR", "").strip()
    if configured:
        return Path(configured).expanduser()
    return Path.home() / ".cache" / "mk-reranker"


def load_or_create_owner_token(state_dir: str | Path) -> str:
    """Return a persistent, high-entropy owner token for this state directory."""
    explicit = os.environ.get("RERANK_SIDECAR_OWNER_TOKEN", "").strip()
    if explicit:
        return explicit

    target_dir = Path(state_dir).expanduser().resolve()
    target_dir.mkdir(parents=True, exist_ok=True)
    path = owner_token_path(target_dir)
    try:
        existing = path.read_text(encoding="utf-8").strip()
        if existing:
            return existing
    except FileNotFoundError:
        pass

    token = secrets.token_urlsafe(24)
    try:
        fd = os.open(path, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
    except FileExistsError:
        existing = path.read_text(encoding="utf-8").strip()
        if existing:
            return existing
        raise
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as handle:
            handle.write(f"{token}\n")
    except Exception:
        try:
            path.unlink()
        except OSError:
            pass
        raise
    return token


def process_liveness(pid: int) -> dict[str, Any]:
    """Check process liveness with structured return matching JS contract.
    
    Returns dict with keys: alive (bool), reason (str), errorCode (str | None).
    Mirrors ensure-rerank-sidecar.cjs:192-202 contract.
    """
    if pid <= 0:
        return {"alive": False, "reason": "invalid-pid"}
    try:
        os.kill(pid, 0)
        return {"alive": True, "reason": "kill-success"}
    except ProcessLookupError:
        return {"alive": False, "reason": "esrch"}
    except PermissionError:
        return {"alive": True, "reason": "eperm-other-owner"}
    except OSError as e:
        sys.stderr.write(f"[processLiveness] unexpected error code {e.errno} for pid {pid}\n")
        return {"alive": True, "reason": "unknown-default-alive", "errorCode": str(e.errno)}


def read_ledger(state_dir: str | Path) -> list[SidecarLedgerRow]:
    return _read_ledger_unlocked(state_dir)


def _read_ledger_unlocked(state_dir: str | Path) -> list[SidecarLedgerRow]:
    path = ledger_path(state_dir)
    try:
        parsed = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return []

    raw_rows = parsed.get("sidecars") if isinstance(parsed, dict) else parsed
    if not isinstance(raw_rows, list):
        return []
    rows: list[SidecarLedgerRow] = []
    for raw in raw_rows:
        if isinstance(raw, dict):
            row = SidecarLedgerRow.from_dict(raw)
            if row is not None:
                rows.append(row)
    return rows


def write_ledger_atomic(state_dir: str | Path, rows: list[SidecarLedgerRow]) -> Path:
    with _locked_ledger(state_dir):
        return _write_ledger_atomic_unlocked(state_dir, rows)


def _write_ledger_atomic_unlocked(state_dir: str | Path, rows: list[SidecarLedgerRow]) -> Path:
    target_dir = Path(state_dir).expanduser().resolve()
    target_dir.mkdir(parents=True, exist_ok=True)
    path = ledger_path(target_dir)
    payload = {"version": 1, "sidecars": [row.to_dict() for row in rows]}
    fd, temp_name = tempfile.mkstemp(
        prefix=f"{LEDGER_FILE_NAME}.tmp.{os.getpid()}.",
        dir=str(target_dir),
        text=True,
    )
    temp_path = Path(temp_name)
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as handle:
            json.dump(payload, handle, indent=2, sort_keys=True)
            handle.write("\n")
            handle.flush()
            os.fsync(handle.fileno())
        os.replace(temp_path, path)
        try:
            dir_fd = os.open(target_dir, os.O_RDONLY)
            try:
                os.fsync(dir_fd)
            finally:
                os.close(dir_fd)
        except OSError:
            pass
    except Exception:
        try:
            temp_path.unlink()
        except OSError:
            pass
        raise
    return path


def add_sidecar_row(state_dir: str | Path, row: SidecarLedgerRow) -> list[SidecarLedgerRow]:
    with _locked_ledger(state_dir):
        rows = [existing for existing in _read_ledger_unlocked(state_dir) if existing.pid != row.pid]
        rows.append(row)
        _write_ledger_atomic_unlocked(state_dir, rows)
        return rows


def classify_sidecar_owner(
    row: SidecarLedgerRow,
    *,
    expected_owner_token: str,
    canonical_config_hash: str,
    health_check: HealthChecker,
    process_liveness_check: ProcessLivenessChecker = process_liveness,
) -> SidecarClassification:
    liveness = process_liveness_check(row.pid)
    if not liveness["alive"]:
        return "stale-pid-reclaim"
    if liveness["reason"] == "eperm-other-owner":
        return "eperm-unknown"
    if row.ownerToken != expected_owner_token:
        return "unknown-owner-refuse"
    if row.canonicalConfigHash != canonical_config_hash:
        return "config-hash-mismatch"
    if not health_check(row.port):
        return "port-unreachable"
    return "healthy-reusable"


def reclaim_stale(
    state_dir: str | Path,
    *,
    process_liveness_check: ProcessLivenessChecker = process_liveness,
) -> list[SidecarLedgerRow]:
    with _locked_ledger(state_dir):
        rows = _read_ledger_unlocked(state_dir)
        kept = [row for row in rows if process_liveness_check(row.pid)["alive"]]
        if len(kept) != len(rows):
            _write_ledger_atomic_unlocked(state_dir, kept)
        return kept


def find_reusable_sidecar(
    state_dir: str | Path,
    *,
    expected_owner_token: str,
    canonical_config_hash: str,
    health_check: HealthChecker,
    process_liveness_check: ProcessLivenessChecker = process_liveness,
    current_time_iso: str | None = None,
) -> tuple[SidecarLedgerRow | None, list[ClassifiedSidecar]]:
    with _locked_ledger(state_dir):
        rows = _read_ledger_unlocked(state_dir)
        classifications: list[ClassifiedSidecar] = []
        kept: list[SidecarLedgerRow] = []
        reusable: SidecarLedgerRow | None = None

        for row in rows:
            classification = classify_sidecar_owner(
                row,
                expected_owner_token=expected_owner_token,
                canonical_config_hash=canonical_config_hash,
                health_check=health_check,
                process_liveness_check=process_liveness_check,
            )
            classifications.append(ClassifiedSidecar(row=row, classification=classification))
            if classification == "stale-pid-reclaim":
                continue
            if classification == "healthy-reusable" and reusable is None:
                reusable = SidecarLedgerRow(
                    pid=row.pid,
                    port=row.port,
                    ownerToken=row.ownerToken,
                    startedAtIso=row.startedAtIso,
                    lastHealthIso=current_time_iso or now_iso(),
                    executablePath=row.executablePath,
                    canonicalConfigHash=row.canonicalConfigHash,
                )
                kept.append(reusable)
                continue
            kept.append(row)

        if len(kept) != len(rows) or reusable is not None:
            _write_ledger_atomic_unlocked(state_dir, kept)
        return reusable, classifications
