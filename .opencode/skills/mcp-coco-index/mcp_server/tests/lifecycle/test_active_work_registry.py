from __future__ import annotations

import threading
import time
import sys
from pathlib import Path

import pytest

MCP_SERVER_DIR = Path(__file__).resolve().parents[2]
if str(MCP_SERVER_DIR) not in sys.path:
    sys.path.insert(0, str(MCP_SERVER_DIR))

from cocoindex_code.lifecycle.active_work_registry import (
    ActiveWorkRegistry,
    ActiveWorkRow,
)
from cocoindex_code.lifecycle.cancel_protocol import CancelRequest, CancelStatus


def _row(project_key: str = "project", req_id: str = "req-1", index_id: str = "idx-1") -> ActiveWorkRow:
    return ActiveWorkRow(
        req_id=req_id,
        index_id=index_id,
        started_at=time.monotonic(),
        status="running",
        cancel_event=threading.Event(),
        project_key=project_key,
    )


def test_add_cancel_and_status() -> None:
    registry = ActiveWorkRegistry()
    row = _row()
    registry.add(row)

    status = registry.cancel(CancelRequest(req_id="req-1"))

    assert status == CancelStatus.CANCELLED
    assert row.status == "cancelling"
    assert row.cancel_event.is_set()
    assert registry.list("project") == [row]


def test_await_drain_after_completion() -> None:
    registry = ActiveWorkRegistry()
    registry.add(_row())
    registry.cancel(CancelRequest(index_id="idx-1"))
    registry.mark_complete(CancelRequest(req_id="req-1"))

    result = registry.await_drain("project", timeout_seconds=0.2)

    assert result.drained is True
    assert result.timed_out is False
    assert result.remaining == []


def test_await_drain_timeout_is_bounded() -> None:
    registry = ActiveWorkRegistry()
    registry.add(_row())

    started = time.monotonic()
    result = registry.await_drain("project", timeout_seconds=0.05)

    assert time.monotonic() - started < 0.5
    assert result.drained is False
    assert result.timed_out is True
    assert result.force_removed is True
    assert [row.req_id for row in result.remaining] == ["req-1"]


def test_concurrent_add_during_drain_is_rejected() -> None:
    registry = ActiveWorkRegistry()
    registry.add(_row())
    registry.begin_removing("project")

    with pytest.raises(RuntimeError, match="project removal in progress"):
        registry.add(_row(req_id="req-2", index_id="idx-2"))

    registry.cancel_project("project")
    registry.mark_complete(CancelRequest(req_id="req-1"))
    result = registry.await_drain("project", timeout_seconds=0.2)

    assert result.drained is True
