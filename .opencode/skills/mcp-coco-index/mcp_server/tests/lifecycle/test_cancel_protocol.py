from __future__ import annotations

import threading
import time
import sys
from pathlib import Path

import pytest

MCP_SERVER_DIR = Path(__file__).resolve().parents[2]
if str(MCP_SERVER_DIR) not in sys.path:
    sys.path.insert(0, str(MCP_SERVER_DIR))

from cocoindex_code.lifecycle.active_work_registry import ActiveWorkRegistry, ActiveWorkRow
from cocoindex_code.lifecycle.cancel_protocol import (
    CancelRequest,
    CancelStatus,
    match_cancel_request,
)


def _row() -> ActiveWorkRow:
    return ActiveWorkRow(
        req_id="req-1",
        index_id="idx-1",
        started_at=time.monotonic(),
        status="running",
        cancel_event=threading.Event(),
        project_key="project",
    )


def test_cancel_request_requires_identity() -> None:
    with pytest.raises(ValueError, match="requires req_id or index_id"):
        CancelRequest()


def test_match_by_req_id() -> None:
    assert match_cancel_request(CancelRequest(req_id="req-1"), _row()) is True


def test_match_by_index_id() -> None:
    assert match_cancel_request(CancelRequest(index_id="idx-1"), _row()) is True


def test_both_cancel_identities_must_match_same_row() -> None:
    row = _row()

    assert match_cancel_request(CancelRequest(req_id="req-1", index_id="idx-1"), row) is True
    assert match_cancel_request(CancelRequest(req_id="req-1", index_id="idx-old"), row) is False
    assert match_cancel_request(CancelRequest(req_id="req-old", index_id="idx-1"), row) is False


def test_not_found_status() -> None:
    registry = ActiveWorkRegistry()
    registry.add(_row())

    assert registry.cancel(CancelRequest(req_id="missing")) == CancelStatus.NOT_FOUND


def test_stale_status_after_row_is_forgotten() -> None:
    registry = ActiveWorkRegistry()
    registry.add(_row())
    registry.mark_complete(CancelRequest(req_id="req-1"), retain_completed_row=False)

    assert registry.cancel(CancelRequest(req_id="req-1")) == CancelStatus.STALE


def test_stale_status_requires_both_identities_when_both_are_supplied() -> None:
    registry = ActiveWorkRegistry()
    registry.add(_row())
    registry.mark_complete(CancelRequest(req_id="req-1", index_id="idx-1"), retain_completed_row=False)

    assert registry.cancel(CancelRequest(req_id="req-1", index_id="idx-old")) == CancelStatus.NOT_FOUND
