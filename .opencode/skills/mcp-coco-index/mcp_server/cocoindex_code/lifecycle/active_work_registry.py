"""Thread-safe active index work registry."""

from __future__ import annotations

import os
import logging
import threading
import time
from dataclasses import dataclass, field
from typing import Literal
from collections.abc import Callable

from .cancel_protocol import CancelRequest, CancelStatus, match_cancel_request

ActiveWorkStatus = Literal["running", "cancelling", "complete"]
logger = logging.getLogger(__name__)


class BoundedSet:
    """Insertion-ordered set with a fixed maximum size."""

    def __init__(self, max_size: int) -> None:
        self.max_size = max_size
        self._values: dict[str, None] = {}

    def __contains__(self, value: object) -> bool:
        return value in self._values

    def __len__(self) -> int:
        return len(self._values)

    def add(self, value: str) -> bool:
        if value in self._values:
            return True
        if len(self._values) >= self.max_size:
            logger.warning("set-overflow: stale identity cap reached (%s)", self.max_size)
            return False
        self._values[value] = None
        return True

    def clear(self) -> None:
        self._values.clear()


@dataclass
class ActiveWorkRow:
    req_id: str
    index_id: str | None
    started_at: float
    status: ActiveWorkStatus
    cancel_event: threading.Event
    project_key: str


@dataclass
class DrainResult:
    project_key: str
    drained: bool
    timed_out: bool
    force_removed: bool
    waited_seconds: float
    remaining: list[ActiveWorkRow] = field(default_factory=list)


class ActiveWorkRegistry:
    """Tracks active and recently completed index work by exact identity."""

    def __init__(self) -> None:
        self._lock = threading.RLock()
        self._condition = threading.Condition(self._lock)
        self._rows: list[ActiveWorkRow] = []
        self._completed_order: list[tuple[str, str | None]] = []
        self._max_completed_rows = 512
        self._max_stale_identities = 1000
        self._removing_projects: set[str] = set()
        self._stale_req_ids = BoundedSet(self._max_stale_identities)
        self._stale_index_ids = BoundedSet(self._max_stale_identities)

    def add(self, row: ActiveWorkRow) -> None:
        with self._condition:
            if row.project_key in self._removing_projects:
                raise RuntimeError(f"project removal in progress: {row.project_key}")
            self._rows.append(row)
            self._condition.notify_all()

    def begin_removing(self, project_key: str) -> None:
        with self._condition:
            self._removing_projects.add(project_key)
            self._condition.notify_all()

    def end_removing(self, project_key: str) -> None:
        with self._condition:
            self._removing_projects.discard(project_key)
            self._condition.notify_all()

    def is_removing(self, project_key: str) -> bool:
        with self._lock:
            return project_key in self._removing_projects

    def cancel(
        self,
        req: CancelRequest,
        *,
        allow_remove_in_progress: bool = False,
    ) -> CancelStatus:
        with self._condition:
            for row in self._rows:
                if not match_cancel_request(req, row):
                    continue
                if row.project_key in self._removing_projects and not allow_remove_in_progress:
                    return CancelStatus.REMOVE_IN_PROGRESS
                if row.status == "complete":
                    return CancelStatus.ALREADY_COMPLETE
                row.status = "cancelling"
                row.cancel_event.set()
                self._condition.notify_all()
                return CancelStatus.CANCELLED

            if self._matches_stale(req):
                return CancelStatus.STALE
            return CancelStatus.NOT_FOUND

    def cancel_project(self, project_key: str) -> list[ActiveWorkRow]:
        with self._condition:
            rows = [row for row in self._rows if row.project_key == project_key]
            for row in rows:
                if row.status != "complete":
                    row.status = "cancelling"
                    row.cancel_event.set()
            self._condition.notify_all()
            return list(rows)

    def mark_complete(self, req: CancelRequest, *, retain_stale: bool = True) -> bool:
        with self._condition:
            for row in list(self._rows):
                if not match_cancel_request(req, row):
                    continue
                row.status = "complete"
                if not retain_stale:
                    self._remember_stale(row)
                    self._rows.remove(row)
                else:
                    self._remember_completed(row)
                self._condition.notify_all()
                return True
            return False

    def await_drain(self, project_key: str, timeout_seconds: float) -> DrainResult:
        started = time.monotonic()
        deadline = started + max(timeout_seconds, 0.0)
        with self._condition:
            while True:
                remaining = [
                    row
                    for row in self._rows
                    if row.project_key == project_key and row.status != "complete"
                ]
                if not remaining:
                    return DrainResult(
                        project_key=project_key,
                        drained=True,
                        timed_out=False,
                        force_removed=False,
                        waited_seconds=time.monotonic() - started,
                    )
                now = time.monotonic()
                if now >= deadline:
                    return DrainResult(
                        project_key=project_key,
                        drained=False,
                        timed_out=True,
                        force_removed=True,
                        waited_seconds=now - started,
                        remaining=list(remaining),
                    )
                self._condition.wait(timeout=min(0.05, deadline - now))

    async def async_await_drain(self, project_key: str, timeout_seconds: float) -> DrainResult:
        import asyncio

        started = time.monotonic()
        deadline = started + max(timeout_seconds, 0.0)
        while True:
            with self._condition:
                remaining = [
                    row
                    for row in self._rows
                    if row.project_key == project_key and row.status != "complete"
                ]
                if not remaining:
                    return DrainResult(
                        project_key=project_key,
                        drained=True,
                        timed_out=False,
                        force_removed=False,
                        waited_seconds=time.monotonic() - started,
                    )
                now = time.monotonic()
                if now >= deadline:
                    return DrainResult(
                        project_key=project_key,
                        drained=False,
                        timed_out=True,
                        force_removed=True,
                        waited_seconds=now - started,
                        remaining=list(remaining),
                    )
            await asyncio.sleep(0.05)

    def clear_project(self, project_key: str, *, remember_stale: bool = True) -> None:
        with self._condition:
            kept: list[ActiveWorkRow] = []
            for row in self._rows:
                if row.project_key == project_key:
                    if remember_stale:
                        self._remember_stale(row)
                    continue
                kept.append(row)
            self._rows = kept
            self._condition.notify_all()

    def list(self, project_key: str | None = None) -> list[ActiveWorkRow]:
        with self._lock:
            if project_key is None:
                return list(self._rows)
            return [row for row in self._rows if row.project_key == project_key]

    def reset(self) -> None:
        with self._condition:
            self._rows.clear()
            self._completed_order.clear()
            self._removing_projects.clear()
            self._stale_req_ids.clear()
            self._stale_index_ids.clear()
            self._condition.notify_all()

    def _matches_stale(self, req: CancelRequest) -> bool:
        req_matches = req.req_id is None or req.req_id in self._stale_req_ids
        index_matches = req.index_id is None or req.index_id in self._stale_index_ids
        return req_matches and index_matches

    def _remember_stale(self, row: ActiveWorkRow) -> None:
        self._stale_req_ids.add(row.req_id)
        if row.index_id is not None:
            self._stale_index_ids.add(row.index_id)

    def _remember_completed(self, row: ActiveWorkRow) -> None:
        identity = (row.req_id, row.index_id)
        self._completed_order.append(identity)
        while len(self._completed_order) > self._max_completed_rows:
            req_id, index_id = self._completed_order.pop(0)
            for old_row in list(self._rows):
                if old_row.req_id == req_id and old_row.index_id == index_id and old_row.status == "complete":
                    self._remember_stale(old_row)
                    self._rows.remove(old_row)
                    break


def remove_project_timeout_seconds() -> float:
    raw = os.environ.get("REMOVE_PROJECT_TIMEOUT_SECONDS", "30")
    try:
        return max(float(raw), 0.0)
    except ValueError:
        return 30.0


active_work_registry = ActiveWorkRegistry()


def remove_project_with_drain(
    project_key: str,
    pop_and_close: Callable[[str], bool],
    *,
    registry: ActiveWorkRegistry = active_work_registry,
    timeout_seconds: float | None = None,
    on_timeout: Callable[[str, list[ActiveWorkRow]], None] | None = None,
) -> bool:
    registry.begin_removing(project_key)
    try:
        registry.cancel_project(project_key)
        drain = registry.await_drain(
            project_key,
            remove_project_timeout_seconds() if timeout_seconds is None else timeout_seconds,
        )
        if drain.timed_out and on_timeout is not None:
            on_timeout(project_key, drain.remaining)
        return pop_and_close(project_key)
    finally:
        registry.clear_project(project_key)
        registry.end_removing(project_key)


async def async_remove_project_with_drain(
    project_key: str,
    pop_and_close: Callable[[str], bool],
    *,
    registry: ActiveWorkRegistry = active_work_registry,
    timeout_seconds: float | None = None,
    on_timeout: Callable[[str, list[ActiveWorkRow]], None] | None = None,
) -> bool:
    registry.begin_removing(project_key)
    try:
        registry.cancel_project(project_key)
        drain = await registry.async_await_drain(
            project_key,
            remove_project_timeout_seconds() if timeout_seconds is None else timeout_seconds,
        )
        if drain.timed_out and on_timeout is not None:
            on_timeout(project_key, drain.remaining)
        return pop_and_close(project_key)
    finally:
        registry.clear_project(project_key)
        registry.end_removing(project_key)
