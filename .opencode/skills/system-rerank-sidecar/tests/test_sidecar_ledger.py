#!/usr/bin/env python3
"""Tests for rerank sidecar ledger v2 owner identity helpers."""

from __future__ import annotations

import errno
import json
import sys
from pathlib import Path
from types import SimpleNamespace
from typing import Any

import pytest

SKILL_DIR = Path(__file__).resolve().parent.parent
if str(SKILL_DIR) not in sys.path:
    sys.path.insert(0, str(SKILL_DIR))

from scripts import sidecar_ledger as ledger  # noqa: E402
from scripts.sidecar_ledger import (  # noqa: E402
    ProcessIdentity,
    SidecarLedgerRow,
    SidecarOwner,
    add_sidecar_row,
    ledger_path,
    locked_prune_dead_owners,
    locked_register_owner,
    parse_process_identity_output,
    process_liveness,
    read_ledger,
    should_reap_row,
    write_ledger_atomic,
)

FIXTURE_PATH = Path(__file__).resolve().parent / "fixtures" / "reaper-ledger-cases.json"


def _owner(
    *,
    pid: int = 1001,
    create_timestamp: str | None = "Sat May 23 10:01:02 2026",
    comm: str | None = "node",
    source: str = "pytest",
) -> SidecarOwner:
    return SidecarOwner(
        pid=pid,
        createTimestamp=create_timestamp,
        comm=comm,
        ownerId=ledger.owner_identity_id(source, pid, create_timestamp, comm),
        registeredAtIso="2026-05-23T10:01:03Z",
        lastSeenIso="2026-05-23T10:01:03Z",
        source=source,
    )


def _row(
    *,
    pid: int = 5001,
    port: int = 8765,
    owner_token: str = "owner-a",
    owners: tuple[SidecarOwner, ...] = (),
) -> SidecarLedgerRow:
    return SidecarLedgerRow(
        pid=pid,
        port=port,
        ownerToken=owner_token,
        startedAtIso="2026-05-23T10:00:00Z",
        lastHealthIso="2026-05-23T10:00:00Z",
        executablePath="/usr/bin/python3",
        canonicalConfigHash="hash-a",
        owners=owners,
    )


def _rows_from_fixture_state(state: dict[str, Any]) -> list[SidecarLedgerRow]:
    rows = []
    for raw in state["rows"]:
        row = SidecarLedgerRow.from_dict(raw)
        assert row is not None
        rows.append(row)
    return rows


def _install_process_table(monkeypatch: pytest.MonkeyPatch, table: dict[str, Any]) -> None:
    def fake_kill(pid: int, signal_number: int) -> None:
        del signal_number
        entry = table.get(str(pid))
        mode = entry.get("kill") if entry else "esrch"
        if mode == "ok":
            return
        if mode == "eperm":
            raise PermissionError(errno.EPERM, "mock eperm")
        if mode == "unknown":
            raise OSError(int(entry.get("errno", errno.EIO)), "mock unknown")
        raise ProcessLookupError(errno.ESRCH, "mock esrch")

    def fake_run(args: list[str], **kwargs: Any) -> SimpleNamespace:
        del kwargs
        pid = str(args[args.index("-p") + 1])
        entry = table.get(pid)
        if not entry or "ps_create_timestamp" not in entry:
            return SimpleNamespace(returncode=1, stdout="", stderr="")
        stdout = f"{entry['ps_create_timestamp']} {entry['ps_comm']}\n"
        return SimpleNamespace(returncode=0, stdout=stdout, stderr="")

    monkeypatch.setattr(ledger.os, "kill", fake_kill)
    monkeypatch.setattr(ledger.subprocess, "run", fake_run)


def _fixture_cases() -> list[dict[str, Any]]:
    payload = json.loads(FIXTURE_PATH.read_text(encoding="utf-8"))
    assert payload["version"] == 1
    return payload["cases"]


class TestLedgerV2Schema:
    def test_atomic_write_uses_v2_schema_with_owner_identities(self, tmp_path: Path) -> None:
        row = _row(owners=(_owner(),))

        write_ledger_atomic(tmp_path, [row])

        payload = json.loads(ledger_path(tmp_path).read_text(encoding="utf-8"))
        assert payload["version"] == 2
        assert "sidecars" in payload
        assert payload["sidecars"][0]["ownerToken"] == "owner-a"
        assert payload["sidecars"][0]["owners"] == [
            {
                "ownerId": "pytest:1001:Sat May 23 10:01:02 2026:node",
                "pid": 1001,
                "createTimestamp": "Sat May 23 10:01:02 2026",
                "comm": "node",
                "registeredAtIso": "2026-05-23T10:01:03Z",
                "lastSeenIso": "2026-05-23T10:01:03Z",
                "source": "pytest",
            }
        ]
        assert payload["sidecars"][0]["reaper"]["policyVersion"] == 1
        assert payload["sidecars"][0]["reaper"]["heartbeatSeconds"] == 45
        assert payload["sidecars"][0]["reaper"]["idleTimeoutSeconds"] == 1800

    def test_read_accepts_fixture_snake_case_rows(self) -> None:
        raw = {
            "pid": 5001,
            "port": 8765,
            "owner_token": "owner-a",
            "owners": [
                {
                    "pid": 1001,
                    "create_timestamp": "Sat May 23 10:01:02 2026",
                    "comm": "node",
                }
            ],
        }

        row = SidecarLedgerRow.from_dict(raw)

        assert row is not None
        assert row.ownerToken == "owner-a"
        assert row.owners[0].createTimestamp == "Sat May 23 10:01:02 2026"
        assert row.owners[0].comm == "node"


class TestIdentityVerifiedLiveness:
    def test_identity_parser_uses_first_24_chars_for_lstart(self) -> None:
        parsed = parse_process_identity_output("Sat May 23 10:37:04 2026 /usr/local/bin/node\n")

        assert parsed == ProcessIdentity(
            create_timestamp="Sat May 23 10:37:04 2026",
            comm="/usr/local/bin/node",
        )

    def test_ok_when_kill_succeeds_and_identity_matches(self, monkeypatch: pytest.MonkeyPatch) -> None:
        _install_process_table(
            monkeypatch,
            {
                "1001": {
                    "kill": "ok",
                    "ps_create_timestamp": "Sat May 23 10:01:02 2026",
                    "ps_comm": "node",
                }
            },
        )

        assert process_liveness(1001, "Sat May 23 10:01:02 2026", "node") == {
            "alive": True,
            "reason": "ok",
        }

    def test_eperm_when_identity_matches(self, monkeypatch: pytest.MonkeyPatch) -> None:
        _install_process_table(
            monkeypatch,
            {
                "1002": {
                    "kill": "eperm",
                    "ps_create_timestamp": "Sat May 23 10:02:02 2026",
                    "ps_comm": "python",
                }
            },
        )

        assert process_liveness(1002, "Sat May 23 10:02:02 2026", "python") == {
            "alive": True,
            "reason": "kill-0-eperm",
        }

    def test_esrch_when_process_missing(self, monkeypatch: pytest.MonkeyPatch) -> None:
        _install_process_table(monkeypatch, {"1003": {"kill": "esrch"}})

        assert process_liveness(1003, "Sat May 23 10:03:02 2026", "node") == {
            "alive": False,
            "reason": "kill-0-esrch",
        }

    def test_pid_recycled_when_identity_mismatches(self, monkeypatch: pytest.MonkeyPatch) -> None:
        _install_process_table(
            monkeypatch,
            {
                "1004": {
                    "kill": "ok",
                    "ps_create_timestamp": "Sat May 23 10:14:02 2026",
                    "ps_comm": "zsh",
                }
            },
        )

        assert process_liveness(1004, "Sat May 23 10:04:02 2026", "node") == {
            "alive": False,
            "reason": "pid-recycled",
        }

    def test_pid_1_is_orphaned_without_kill(self, monkeypatch: pytest.MonkeyPatch) -> None:
        def fail_kill(pid: int, signal_number: int) -> None:
            raise AssertionError("PID 1 should short-circuit before kill")

        monkeypatch.setattr(ledger.os, "kill", fail_kill)

        assert process_liveness(1, "Sat May 23 10:05:02 2026", "launchd") == {
            "alive": False,
            "reason": "pid-1-orphaned",
        }

    def test_unknown_errno_logs_and_fails_open(self, monkeypatch: pytest.MonkeyPatch, capsys: pytest.CaptureFixture[str]) -> None:
        _install_process_table(monkeypatch, {"1006": {"kill": "unknown", "errno": 5}})

        assert process_liveness(1006, "Sat May 23 10:06:02 2026", "node") == {
            "alive": True,
            "reason": "unknown",
            "errorCode": "5",
        }
        assert "unexpected error code 5 for pid 1006" in capsys.readouterr().err


class TestOwnerPruneAndRegister:
    def test_prune_drops_dead_owners_and_empty_rows(self, tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> None:
        add_sidecar_row(
            tmp_path,
            _row(
                pid=5001,
                owners=(
                    _owner(pid=1001, create_timestamp="Sat May 23 10:01:02 2026", comm="node"),
                    _owner(pid=1002, create_timestamp="Sat May 23 10:02:02 2026", comm="python"),
                ),
            ),
        )
        add_sidecar_row(
            tmp_path,
            _row(
                pid=5002,
                port=8766,
                owners=(_owner(pid=1003, create_timestamp="Sat May 23 10:03:02 2026", comm="node"),),
            ),
        )
        _install_process_table(
            monkeypatch,
            {
                "1001": {
                    "kill": "ok",
                    "ps_create_timestamp": "Sat May 23 10:01:02 2026",
                    "ps_comm": "node",
                },
                "1002": {"kill": "esrch"},
                "1003": {"kill": "esrch"},
            },
        )

        kept = locked_prune_dead_owners(tmp_path)

        assert [row.pid for row in kept] == [5001]
        assert [owner.pid for owner in kept[0].owners] == [1001]
        assert [row.pid for row in read_ledger(tmp_path)] == [5001]

    def test_register_owner_is_idempotent_for_same_identity(self, tmp_path: Path) -> None:
        add_sidecar_row(tmp_path, _row(pid=5001))

        def fake_identity(pid: int) -> ProcessIdentity:
            assert pid == 1001
            return ProcessIdentity("Sat May 23 10:01:02 2026", "python")

        locked_register_owner(
            tmp_path,
            sidecar_pid=5001,
            source="pytest",
            owner_pid=1001,
            current_time_iso="2026-05-23T10:01:03Z",
            process_identity_reader=fake_identity,
        )
        rows = locked_register_owner(
            tmp_path,
            sidecar_pid=5001,
            source="pytest",
            owner_pid=1001,
            current_time_iso="2026-05-23T10:01:04Z",
            process_identity_reader=fake_identity,
        )

        assert len(rows[0].owners) == 1
        assert rows[0].owners[0].registeredAtIso == "2026-05-23T10:01:03Z"
        assert rows[0].owners[0].lastSeenIso == "2026-05-23T10:01:04Z"


class TestV1BackwardCompat:
    def test_missing_version_array_payload_reads_as_legacy_rows(self, tmp_path: Path) -> None:
        legacy_row = _row().to_dict()
        legacy_row.pop("owners")
        legacy_row.pop("reaper")
        ledger_path(tmp_path).write_text(json.dumps([legacy_row]), encoding="utf-8")

        rows = read_ledger(tmp_path)

        assert len(rows) == 1
        assert rows[0].owners == ()
        assert rows[0].reaper["policyVersion"] == 1

    def test_version_1_payload_rewrites_as_v2_on_next_mutation(self, tmp_path: Path) -> None:
        legacy_row = _row().to_dict()
        legacy_row.pop("owners")
        legacy_row.pop("reaper")
        ledger_path(tmp_path).write_text(
            json.dumps({"version": 1, "sidecars": [legacy_row]}),
            encoding="utf-8",
        )

        add_sidecar_row(tmp_path, _row(pid=5002, port=8766))

        payload = json.loads(ledger_path(tmp_path).read_text(encoding="utf-8"))
        assert payload["version"] == 2
        assert len(payload["sidecars"]) == 2
        assert payload["sidecars"][0]["owners"] == []


class TestFixtureMatrix:
    @pytest.mark.parametrize("case", _fixture_cases(), ids=lambda case: case["name"])
    def test_fixture_liveness_and_reap_decision(self, case: dict[str, Any], monkeypatch: pytest.MonkeyPatch) -> None:
        _install_process_table(monkeypatch, case["process_table"])
        rows = _rows_from_fixture_state(case["ledger_state"])
        assert len(rows) == 1

        observed_liveness = {}
        for owner in rows[0].owners:
            result = process_liveness(owner.pid, owner.createTimestamp, owner.comm)
            observed_liveness[f"pid_{owner.pid}"] = result["reason"]

        assert observed_liveness == case["expected_liveness"]
        assert should_reap_row(rows[0]) is case["expected_reap_decision"]
