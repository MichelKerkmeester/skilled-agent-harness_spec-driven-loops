#!/usr/bin/env python3
"""Persistent ownership ledger for rerank sidecar processes."""

from __future__ import annotations

import errno
import fcntl
import json
import os
import secrets
import subprocess
import sys
import tempfile
from contextlib import contextmanager
from dataclasses import dataclass, field, replace
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Callable, Literal, TypedDict

LEDGER_FILE_NAME = ".sidecar-ledger.json"
OWNER_TOKEN_FILE_NAME = ".sidecar-owner-token"
LEDGER_VERSION = 2
DEFAULT_REAPER_POLICY = {
    "policyVersion": 1,
    "heartbeatSeconds": 45,
    "idleTimeoutSeconds": 1800,
}

SidecarClassification = Literal[
    "healthy-reusable",
    "unknown-owner-refuse",
    "stale-pid-reclaim",
    "eperm-unknown",
    "port-unreachable",
    "config-hash-mismatch",
]
ProcessLivenessReason = Literal[
    "pid-1-orphaned",
    "kill-0-eperm",
    "kill-0-esrch",
    "pid-recycled",
    "ok",
    "unknown",
]

HealthChecker = Callable[[int], bool]
ProcessLivenessChecker = Callable[..., dict[str, Any]]


class ProcessLiveness(TypedDict, total=False):
    alive: bool
    reason: ProcessLivenessReason
    errorCode: str


@dataclass(frozen=True)
class ProcessIdentity:
    create_timestamp: str
    comm: str


@dataclass(frozen=True)
class SidecarOwner:
    pid: int
    createTimestamp: str | None
    comm: str | None
    ownerId: str
    registeredAtIso: str
    lastSeenIso: str
    source: str

    @classmethod
    def from_dict(cls, value: dict[str, Any]) -> "SidecarOwner | None":
        try:
            pid = int(value["pid"])
        except (KeyError, TypeError, ValueError):
            return None
        if pid <= 0:
            return None

        create_timestamp = _optional_str(value.get("createTimestamp", value.get("create_timestamp")))
        comm = _optional_str(value.get("comm"))
        source = str(value.get("source") or "unknown")
        registered_at = str(value.get("registeredAtIso") or value.get("registered_at_iso") or now_iso())
        last_seen = str(value.get("lastSeenIso") or value.get("last_seen_iso") or registered_at)
        owner_id = str(
            value.get("ownerId")
            or value.get("owner_id")
            or owner_identity_id(source, pid, create_timestamp, comm)
        )
        return cls(
            pid=pid,
            createTimestamp=create_timestamp,
            comm=comm,
            ownerId=owner_id,
            registeredAtIso=registered_at,
            lastSeenIso=last_seen,
            source=source,
        )

    def identity_key(self) -> tuple[int, str | None, str | None]:
        return (self.pid, self.createTimestamp, self.comm)

    def to_dict(self) -> dict[str, Any]:
        return {
            "ownerId": self.ownerId,
            "pid": self.pid,
            "createTimestamp": self.createTimestamp,
            "comm": self.comm,
            "registeredAtIso": self.registeredAtIso,
            "lastSeenIso": self.lastSeenIso,
            "source": self.source,
        }


@dataclass(frozen=True)
class SidecarLedgerRow:
    pid: int
    port: int
    ownerToken: str
    startedAtIso: str
    lastHealthIso: str
    executablePath: str
    canonicalConfigHash: str
    owners: tuple[SidecarOwner, ...] = ()
    reaper: dict[str, Any] = field(default_factory=lambda: dict(DEFAULT_REAPER_POLICY))

    @classmethod
    def from_dict(cls, value: dict[str, Any]) -> "SidecarLedgerRow | None":
        try:
            row = cls(
                pid=int(value["pid"]),
                port=int(value["port"]),
                ownerToken=str(value.get("ownerToken", value.get("owner_token"))),
                startedAtIso=str(value.get("startedAtIso", value.get("started_at_iso", now_iso()))),
                lastHealthIso=str(value.get("lastHealthIso", value.get("last_health_iso", now_iso()))),
                executablePath=str(value.get("executablePath", value.get("executable_path", ""))),
                canonicalConfigHash=str(value.get("canonicalConfigHash", value.get("canonical_config_hash", ""))),
                owners=_parse_owners(value.get("owners")),
                reaper=_parse_reaper(value.get("reaper")),
            )
        except (KeyError, TypeError, ValueError):
            return None
        if row.pid <= 0 or row.port <= 0 or not row.ownerToken or row.ownerToken == "None":
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
            "owners": [owner.to_dict() for owner in self.owners],
            "reaper": dict(self.reaper),
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


def parse_process_identity_output(output: str) -> ProcessIdentity | None:
    """Parse macOS/BSD `ps -o lstart= -o comm=` output."""
    first_line = next((line for line in output.splitlines() if line.strip()), "")
    if len(first_line) < 24:
        return None
    create_timestamp = first_line[:24].strip()
    comm = first_line[24:].strip()
    if not create_timestamp or not comm:
        return None
    return ProcessIdentity(create_timestamp=create_timestamp, comm=comm)


def read_process_identity(pid: int) -> ProcessIdentity | None:
    """Read process identity using the ADR-002 macOS/BSD `ps` command."""
    try:
        completed = subprocess.run(
            ["ps", "-p", str(pid), "-o", "lstart=", "-o", "comm="],
            check=False,
            capture_output=True,
            text=True,
        )
    except OSError:
        return None
    if completed.returncode != 0:
        return None
    return parse_process_identity_output(completed.stdout)


def owner_identity_id(source: str, pid: int, create_timestamp: str | None, comm: str | None) -> str:
    return f"{source}:{pid}:{create_timestamp or 'unknown'}:{comm or 'unknown'}"


def current_owner_identity(
    *,
    source: str,
    owner_pid: int | None = None,
    current_time_iso: str | None = None,
    process_identity_reader: Callable[[int], ProcessIdentity | None] = read_process_identity,
) -> SidecarOwner:
    pid = owner_pid or os.getpid()
    identity = process_identity_reader(pid)
    create_timestamp = identity.create_timestamp if identity else None
    comm = identity.comm if identity else None
    timestamp = current_time_iso or now_iso()
    return SidecarOwner(
        pid=pid,
        createTimestamp=create_timestamp,
        comm=comm,
        ownerId=owner_identity_id(source, pid, create_timestamp, comm),
        registeredAtIso=timestamp,
        lastSeenIso=timestamp,
        source=source,
    )


def process_liveness(
    pid: int,
    recorded_create_timestamp: str | None = None,
    recorded_comm: str | None = None,
) -> ProcessLiveness:
    """Check process liveness with PID identity verification."""
    if pid == 1:
        return {"alive": False, "reason": "pid-1-orphaned"}
    if pid <= 0:
        return {"alive": False, "reason": "kill-0-esrch"}

    kill_reason: ProcessLivenessReason = "ok"
    try:
        os.kill(pid, 0)
    except ProcessLookupError:
        return {"alive": False, "reason": "kill-0-esrch"}
    except PermissionError:
        kill_reason = "kill-0-eperm"
    except OSError as error:
        if error.errno == errno.ESRCH:
            return {"alive": False, "reason": "kill-0-esrch"}
        if error.errno == errno.EPERM:
            kill_reason = "kill-0-eperm"
        else:
            error_code = str(error.errno) if error.errno is not None else "unknown"
            sys.stderr.write(f"[process_liveness] unexpected error code {error_code} for pid {pid}\n")
            return {"alive": True, "reason": "unknown", "errorCode": error_code}

    if recorded_create_timestamp is None or recorded_comm is None:
        return {"alive": True, "reason": "unknown"}

    identity = read_process_identity(pid)
    if identity is None:
        return {"alive": True, "reason": "unknown"}
    if identity.create_timestamp != recorded_create_timestamp or identity.comm != recorded_comm:
        return {"alive": False, "reason": "pid-recycled"}
    return {"alive": True, "reason": kill_reason}


def read_ledger(state_dir: str | Path) -> list[SidecarLedgerRow]:
    return _read_ledger_unlocked(state_dir)


def _read_ledger_unlocked(state_dir: str | Path) -> list[SidecarLedgerRow]:
    path = ledger_path(state_dir)
    try:
        parsed = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return []

    raw_rows = _raw_rows_from_payload(parsed)
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
    payload = {"version": LEDGER_VERSION, "sidecars": [row.to_dict() for row in rows]}
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


def locked_register_owner(
    state_dir: str | Path,
    *,
    sidecar_pid: int,
    source: str,
    owner_pid: int | None = None,
    current_time_iso: str | None = None,
    process_identity_reader: Callable[[int], ProcessIdentity | None] = read_process_identity,
) -> list[SidecarLedgerRow]:
    """Register the current owner identity on a sidecar row under ledger lock."""
    owner = current_owner_identity(
        source=source,
        owner_pid=owner_pid,
        current_time_iso=current_time_iso,
        process_identity_reader=process_identity_reader,
    )
    with _locked_ledger(state_dir):
        rows = _read_ledger_unlocked(state_dir)
        updated: list[SidecarLedgerRow] = []
        changed = False
        for row in rows:
            if row.pid != sidecar_pid:
                updated.append(row)
                continue

            owners = list(row.owners)
            for index, existing in enumerate(owners):
                if existing.identity_key() == owner.identity_key():
                    owners[index] = replace(existing, lastSeenIso=owner.lastSeenIso)
                    changed = True
                    break
            else:
                owners.append(owner)
                changed = True
            updated.append(replace(row, owners=tuple(owners)))

        if changed:
            _write_ledger_atomic_unlocked(state_dir, updated)
        return updated


def locked_prune_dead_owners(
    state_dir: str | Path,
    *,
    owner_liveness_check: ProcessLivenessChecker = process_liveness,
) -> list[SidecarLedgerRow]:
    """Prune dead owners and drop rows with no live owners under ledger lock."""
    with _locked_ledger(state_dir):
        rows = _read_ledger_unlocked(state_dir)
        kept: list[SidecarLedgerRow] = []
        changed = False

        for row in rows:
            live_owners = [
                owner
                for owner in row.owners
                if _owner_liveness(owner, owner_liveness_check).get("alive") is True
            ]
            if len(live_owners) != len(row.owners):
                changed = True
            if not live_owners:
                changed = True
                continue
            kept.append(replace(row, owners=tuple(live_owners)))

        if changed:
            _write_ledger_atomic_unlocked(state_dir, kept)
        return kept


def should_reap_row(
    row: SidecarLedgerRow,
    *,
    owner_liveness_check: ProcessLivenessChecker = process_liveness,
) -> bool:
    """Return true when a row has no live owners."""
    if not row.owners:
        return True
    return not any(
        _owner_liveness(owner, owner_liveness_check).get("alive") is True
        for owner in row.owners
    )


def classify_sidecar_owner(
    row: SidecarLedgerRow,
    *,
    expected_owner_token: str,
    canonical_config_hash: str,
    health_check: HealthChecker,
    process_liveness_check: ProcessLivenessChecker = process_liveness,
) -> SidecarClassification:
    liveness = _call_liveness(process_liveness_check, row.pid, None, None)
    if not liveness["alive"]:
        return "stale-pid-reclaim"
    if liveness["reason"] in {"kill-0-eperm", "eperm-other-owner"}:
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
        kept = [
            row for row in rows
            if _call_liveness(process_liveness_check, row.pid, None, None)["alive"]
        ]
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
                reusable = replace(row, lastHealthIso=current_time_iso or now_iso())
                kept.append(reusable)
                continue
            kept.append(row)

        if len(kept) != len(rows) or reusable is not None:
            _write_ledger_atomic_unlocked(state_dir, kept)
        return reusable, classifications


def _optional_str(value: Any) -> str | None:
    if value is None:
        return None
    text = str(value)
    return text if text else None


def _parse_owners(value: Any) -> tuple[SidecarOwner, ...]:
    if not isinstance(value, list):
        return ()
    owners = [SidecarOwner.from_dict(item) for item in value if isinstance(item, dict)]
    return tuple(owner for owner in owners if owner is not None)


def _parse_reaper(value: Any) -> dict[str, Any]:
    if not isinstance(value, dict):
        return dict(DEFAULT_REAPER_POLICY)
    merged = dict(DEFAULT_REAPER_POLICY)
    merged.update(value)
    return merged


def _raw_rows_from_payload(parsed: Any) -> Any:
    if isinstance(parsed, list):
        return parsed
    if not isinstance(parsed, dict):
        return []
    if isinstance(parsed.get("sidecars"), list):
        return parsed["sidecars"]
    if isinstance(parsed.get("rows"), list):
        return [_fixture_row_to_sidecar(row) for row in parsed["rows"]]
    return []


def _fixture_row_to_sidecar(row: Any) -> Any:
    if not isinstance(row, dict):
        return row
    if "owner_token" not in row:
        return row
    return {
        "pid": row.get("pid", row.get("sidecar_pid", 0)),
        "port": row.get("port", 0),
        "ownerToken": row.get("owner_token"),
        "startedAtIso": row.get("started_at_iso", now_iso()),
        "lastHealthIso": row.get("last_health_iso", now_iso()),
        "executablePath": row.get("executable_path", ""),
        "canonicalConfigHash": row.get("canonical_config_hash", ""),
        "owners": row.get("owners", []),
        "reaper": row.get("reaper", {}),
    }


def _owner_liveness(owner: SidecarOwner, checker: ProcessLivenessChecker) -> dict[str, Any]:
    return _call_liveness(checker, owner.pid, owner.createTimestamp, owner.comm)


def _call_liveness(
    checker: ProcessLivenessChecker,
    pid: int,
    recorded_create_timestamp: str | None,
    recorded_comm: str | None,
) -> dict[str, Any]:
    try:
        return checker(pid, recorded_create_timestamp, recorded_comm)
    except TypeError:
        return checker(pid)
