"""Typed cancellation identity for index work."""

from __future__ import annotations

from dataclasses import dataclass
from enum import Enum
from typing import Protocol


class CancelStatus(str, Enum):
    CANCELLED = "cancelled"
    ALREADY_COMPLETE = "already-complete"
    STALE = "stale"
    NOT_FOUND = "not-found"
    REMOVE_IN_PROGRESS = "remove-in-progress"


@dataclass(frozen=True)
class CancelRequest:
    req_id: str | None = None
    index_id: str | None = None

    def __post_init__(self) -> None:
        if not self.req_id and not self.index_id:
            raise ValueError("CancelRequest requires req_id or index_id")


class _ActiveRow(Protocol):
    req_id: str
    index_id: str | None


def match_cancel_request(req: CancelRequest, active_row: _ActiveRow) -> bool:
    """Return True when either supplied cancellation identity matches a row."""
    return (req.req_id is not None and req.req_id == active_row.req_id) or (
        req.index_id is not None and req.index_id == active_row.index_id
    )
