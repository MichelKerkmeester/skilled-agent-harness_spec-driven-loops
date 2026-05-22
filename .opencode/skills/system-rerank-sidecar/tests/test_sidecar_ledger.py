from __future__ import annotations

import json
import os
import sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

SKILL_DIR = Path(__file__).resolve().parent.parent
if str(SKILL_DIR) not in sys.path:
    sys.path.insert(0, str(SKILL_DIR))

from scripts.sidecar_ledger import (  # noqa: E402
    SidecarLedgerRow,
    add_sidecar_row,
    classify_sidecar_owner,
    find_reusable_sidecar,
    ledger_path,
    reclaim_stale,
    read_ledger,
)
from scripts import ensure_rerank_sidecar as ensure_module  # noqa: E402


def _row(
    *,
    pid: int = 100,
    port: int = 8765,
    owner: str = "owner-a",
    config_hash: str = "hash-a",
) -> SidecarLedgerRow:
    return SidecarLedgerRow(
        pid=pid,
        port=port,
        ownerToken=owner,
        startedAtIso="2026-05-22T00:00:00Z",
        lastHealthIso="2026-05-22T00:00:00Z",
        executablePath="/usr/bin/python3",
        canonicalConfigHash=config_hash,
    )


def test_healthy_matching_owner_reuses_and_refreshes_health_timestamp(tmp_path):
    add_sidecar_row(tmp_path, _row())

    reusable, classifications = find_reusable_sidecar(
        tmp_path,
        expected_owner_token="owner-a",
        canonical_config_hash="hash-a",
        health_check=lambda port: port == 8765,
        process_liveness_check=lambda pid: "alive",
        current_time_iso="2026-05-22T01:00:00Z",
    )

    assert reusable is not None
    assert reusable.pid == 100
    assert reusable.lastHealthIso == "2026-05-22T01:00:00Z"
    assert [item.classification for item in classifications] == ["healthy-reusable"]
    assert read_ledger(tmp_path)[0].lastHealthIso == "2026-05-22T01:00:00Z"


def test_unknown_owner_refuses_reuse_and_preserves_row(tmp_path):
    row = _row(owner="somebody-else")
    add_sidecar_row(tmp_path, row)

    reusable, classifications = find_reusable_sidecar(
        tmp_path,
        expected_owner_token="owner-a",
        canonical_config_hash="hash-a",
        health_check=lambda port: True,
        process_liveness_check=lambda pid: "alive",
    )

    assert reusable is None
    assert classifications[0].classification == "unknown-owner-refuse"
    assert read_ledger(tmp_path) == [row]


def test_stale_exact_pid_cleanup_reclaims_dead_row(tmp_path):
    add_sidecar_row(tmp_path, _row(pid=111))
    add_sidecar_row(tmp_path, _row(pid=222, port=8766))

    kept = reclaim_stale(
        tmp_path,
        process_liveness_check=lambda pid: "dead" if pid == 111 else "alive",
    )

    assert [row.pid for row in kept] == [222]
    assert [row.pid for row in read_ledger(tmp_path)] == [222]


def test_eperm_alive_is_unknown_and_not_reclaimed(tmp_path):
    row = _row()
    assert (
        classify_sidecar_owner(
            row,
            expected_owner_token="owner-a",
            canonical_config_hash="hash-a",
            health_check=lambda port: True,
            process_liveness_check=lambda pid: "eperm",
        )
        == "eperm-unknown"
    )


def test_port_down_but_pid_alive_preserves_row(tmp_path):
    row = _row()
    add_sidecar_row(tmp_path, row)

    reusable, classifications = find_reusable_sidecar(
        tmp_path,
        expected_owner_token="owner-a",
        canonical_config_hash="hash-a",
        health_check=lambda port: False,
        process_liveness_check=lambda pid: "alive",
    )

    assert reusable is None
    assert classifications[0].classification == "port-unreachable"
    assert read_ledger(tmp_path) == [row]


def test_config_hash_mismatch_preserves_row(tmp_path):
    row = _row(config_hash="hash-old")
    add_sidecar_row(tmp_path, row)

    reusable, classifications = find_reusable_sidecar(
        tmp_path,
        expected_owner_token="owner-a",
        canonical_config_hash="hash-new",
        health_check=lambda port: True,
        process_liveness_check=lambda pid: "alive",
    )

    assert reusable is None
    assert classifications[0].classification == "config-hash-mismatch"
    assert read_ledger(tmp_path) == [row]


def test_atomic_write_uses_expected_schema(tmp_path):
    add_sidecar_row(tmp_path, _row())

    payload = json.loads(ledger_path(tmp_path).read_text(encoding="utf-8"))
    assert payload["version"] == 1
    assert payload["sidecars"][0]["ownerToken"] == "owner-a"


def test_concurrent_sidecar_adds_do_not_lose_rows(tmp_path):
    rows = [_row(pid=100 + idx, port=8765 + idx) for idx in range(8)]

    with ThreadPoolExecutor(max_workers=8) as pool:
        list(pool.map(lambda row: add_sidecar_row(tmp_path, row), rows))

    ledger_pids = {row.pid for row in read_ledger(tmp_path)}
    assert ledger_pids == {row.pid for row in rows}


def test_ensure_reuses_healthy_ledger_owner(tmp_path, monkeypatch):
    monkeypatch.setenv("RERANK_SIDECAR_STATE_DIR", str(tmp_path))
    monkeypatch.setenv("RERANK_SIDECAR_OWNER_TOKEN", "owner-a")
    config_hash = ensure_module._canonical_config_hash(8765)
    add_sidecar_row(tmp_path, _row(pid=os.getpid(), config_hash=config_hash))

    monkeypatch.setattr(ensure_module, "is_healthy", lambda port, timeout_seconds=2.0: True)

    result = ensure_module.ensure_rerank_sidecar(
        port=8765,
        sidecar_skill_path=SKILL_DIR,
        skip_if_disabled=False,
    )

    assert result["spawned"] is False
    assert result["ownerPid"] == os.getpid()
    assert result["ledger"] == "healthy-reusable"


def test_ensure_unknown_owner_spawns_on_different_port(tmp_path, monkeypatch):
    monkeypatch.setenv("RERANK_SIDECAR_STATE_DIR", str(tmp_path))
    monkeypatch.setenv("RERANK_SIDECAR_OWNER_TOKEN", "owner-a")
    add_sidecar_row(
        tmp_path,
        _row(pid=os.getpid(), owner="owner-b", config_hash=ensure_module._canonical_config_hash(8765)),
    )
    spawned_ports: list[str] = []

    class FakeProc:
        pid = 999

    monkeypatch.setattr(ensure_module, "is_healthy", lambda port, timeout_seconds=2.0: port == 8765)
    monkeypatch.setattr(ensure_module, "wait_for_healthy", lambda port, deadline: True)
    monkeypatch.setattr(ensure_module, "_find_available_port", lambda preferred_port: 8766)
    monkeypatch.setattr(ensure_module, "_open_sidecar_log", lambda: None)

    def fake_popen(*args, **kwargs):
        spawned_ports.append(kwargs["env"]["RERANK_SIDECAR_PORT"])
        return FakeProc()

    monkeypatch.setattr(ensure_module.subprocess, "Popen", fake_popen)

    result = ensure_module.ensure_rerank_sidecar(
        port=8765,
        sidecar_skill_path=SKILL_DIR,
        skip_if_disabled=False,
    )

    assert result["spawned"] is True
    assert result["port"] == 8766
    assert spawned_ports == ["8766"]
    assert {row.pid for row in read_ledger(tmp_path)} == {os.getpid(), 999}


def test_ensure_reclaims_stale_dead_pid_before_fresh_spawn(tmp_path, monkeypatch):
    monkeypatch.setenv("RERANK_SIDECAR_STATE_DIR", str(tmp_path))
    monkeypatch.setenv("RERANK_SIDECAR_OWNER_TOKEN", "owner-a")
    add_sidecar_row(
        tmp_path,
        _row(pid=987654321, config_hash=ensure_module._canonical_config_hash(8765)),
    )

    class FakeProc:
        pid = 202

    monkeypatch.setattr(ensure_module, "is_healthy", lambda port, timeout_seconds=2.0: False)
    monkeypatch.setattr(ensure_module, "wait_for_healthy", lambda port, deadline: True)
    monkeypatch.setattr(ensure_module, "_open_sidecar_log", lambda: None)
    monkeypatch.setattr(ensure_module.subprocess, "Popen", lambda *args, **kwargs: FakeProc())

    result = ensure_module.ensure_rerank_sidecar(
        port=8765,
        sidecar_skill_path=SKILL_DIR,
        skip_if_disabled=False,
    )

    assert result["spawned"] is True
    assert result["ownerPid"] == 202
    assert [row.pid for row in read_ledger(tmp_path)] == [202]


def test_ensure_records_spawned_sidecar_before_warmup_timeout(tmp_path, monkeypatch):
    monkeypatch.setenv("RERANK_SIDECAR_STATE_DIR", str(tmp_path))
    monkeypatch.setenv("RERANK_SIDECAR_OWNER_TOKEN", "owner-a")
    observed_during_warmup: list[int] = []
    sent_signals: list[tuple[int, int]] = []

    class FakeProc:
        pid = 303

        def __init__(self) -> None:
            self.wait_calls = 0

        def wait(self, timeout):
            self.wait_calls += 1
            if self.wait_calls == 1:
                raise ensure_module.subprocess.TimeoutExpired("sidecar", timeout)
            return 0

    fake_proc = FakeProc()

    def fake_wait_for_healthy(port, deadline):
        observed_during_warmup.extend(row.pid for row in read_ledger(tmp_path))
        return False

    monkeypatch.setattr(ensure_module, "is_healthy", lambda port, timeout_seconds=2.0: False)
    monkeypatch.setattr(ensure_module, "wait_for_healthy", fake_wait_for_healthy)
    monkeypatch.setattr(ensure_module, "_open_sidecar_log", lambda: None)
    monkeypatch.setattr(ensure_module.subprocess, "Popen", lambda *args, **kwargs: fake_proc)
    monkeypatch.setattr(ensure_module.os, "killpg", lambda pid, sig: sent_signals.append((pid, sig)))

    result = ensure_module.ensure_rerank_sidecar(
        port=8765,
        sidecar_skill_path=SKILL_DIR,
        skip_if_disabled=False,
        health_timeout_seconds=0.01,
    )

    assert observed_during_warmup == [303]
    assert result["fallback"] == "warmup-timeout"
    assert result["ledger"] == "recorded-before-warmup"
    assert result["termination"] == "killed"
    assert sent_signals == [
        (303, ensure_module.signal.SIGTERM),
        (303, ensure_module.signal.SIGKILL),
    ]
    assert read_ledger(tmp_path) == []
