"""Daemon and MCP background task ownership registry."""

from __future__ import annotations

import asyncio
import atexit
import concurrent.futures
import logging
import threading
import time
from dataclasses import dataclass
from typing import Any, Coroutine

logger = logging.getLogger(__name__)


@dataclass
class DaemonTaskRow:
    task_id: str
    kind: str
    project_key: str | None
    started_at: float
    task: asyncio.Task[Any] | None = None
    future: concurrent.futures.Future[Any] | None = None
    cancel_event: threading.Event | None = None
    status: str = "running"
    error: str | None = None


class DaemonTaskRegistry:
    """Owns async tasks and threadpool futures spawned in the daemon/MCP layer."""

    def __init__(self) -> None:
        self._lock = threading.RLock()
        self._rows: dict[str, DaemonTaskRow] = {}
        self._completed_order: list[str] = []
        self._max_completed_rows = 256

    def create_task(
        self,
        coro: Coroutine[Any, Any, Any],
        *,
        task_id: str,
        kind: str,
        project_key: str | None = None,
        cancel_event: threading.Event | None = None,
    ) -> asyncio.Task[Any]:
        task = asyncio.create_task(coro)
        self.add_task(
            task,
            task_id=task_id,
            kind=kind,
            project_key=project_key,
            cancel_event=cancel_event,
        )
        return task

    def add_task(
        self,
        task: asyncio.Task[Any],
        *,
        task_id: str,
        kind: str,
        project_key: str | None = None,
        cancel_event: threading.Event | None = None,
    ) -> None:
        row = DaemonTaskRow(
            task_id=task_id,
            kind=kind,
            project_key=project_key,
            started_at=time.monotonic(),
            task=task,
            cancel_event=cancel_event,
        )
        with self._lock:
            self._rows[task_id] = row
        task.add_done_callback(lambda done, ident=task_id: self._mark_task_done(ident, done))

    def add_future(
        self,
        future: concurrent.futures.Future[Any],
        *,
        task_id: str,
        kind: str,
        project_key: str | None = None,
        cancel_event: threading.Event | None = None,
    ) -> None:
        row = DaemonTaskRow(
            task_id=task_id,
            kind=kind,
            project_key=project_key,
            started_at=time.monotonic(),
            future=future,
            cancel_event=cancel_event,
        )
        with self._lock:
            self._rows[task_id] = row
        future.add_done_callback(lambda done, ident=task_id: self._mark_future_done(ident, done))

    def cancel(self, task_id: str | None = None) -> list[DaemonTaskRow]:
        with self._lock:
            rows = [
                row
                for row in self._rows.values()
                if task_id is None or row.task_id == task_id
            ]
            for row in rows:
                row.status = "cancelling"
                if row.cancel_event is not None:
                    row.cancel_event.set()
                if row.task is not None:
                    row.task.cancel()
                if row.future is not None:
                    row.future.cancel()
            return list(rows)

    async def shutdown(self, timeout_seconds: float = 10.0) -> list[DaemonTaskRow]:
        rows = self.cancel()
        tasks = [row.task for row in rows if row.task is not None]
        if tasks:
            try:
                await asyncio.wait_for(
                    asyncio.gather(*tasks, return_exceptions=True),
                    timeout=timeout_seconds,
                )
            except asyncio.TimeoutError:
                logger.warning("daemon task shutdown timed out after %.1fs", timeout_seconds)
        deadline = time.monotonic() + max(timeout_seconds, 0.0)
        while time.monotonic() < deadline:
            futures = [row.future for row in self.list() if row.future is not None]
            if not futures or all(future.done() or future.cancelled() for future in futures):
                break
            await asyncio.sleep(0.05)
        return self.list()

    def shutdown_sync(self, timeout_seconds: float = 10.0) -> list[DaemonTaskRow]:
        rows = self.cancel()
        futures = [row.future for row in rows if row.future is not None]
        if futures:
            concurrent.futures.wait(futures, timeout=timeout_seconds)
        return self.list()

    def list(self) -> list[DaemonTaskRow]:
        with self._lock:
            return list(self._rows.values())

    def reset(self) -> None:
        with self._lock:
            self._rows.clear()

    def _mark_task_done(self, task_id: str, task: asyncio.Task[Any]) -> None:
        with self._lock:
            row = self._rows.get(task_id)
            if row is None:
                return
            row.status = "complete"
            if task.cancelled():
                row.error = "cancelled"
            else:
                try:
                    exc = task.exception()
                except asyncio.CancelledError:
                    row.error = "cancelled"
                else:
                    if exc is not None:
                        row.error = repr(exc)
                        logger.error("background task failed taskId=%s error=%r", task_id, exc)
            self._remember_completed(task_id)

    def _mark_future_done(
        self,
        task_id: str,
        future: concurrent.futures.Future[Any],
    ) -> None:
        with self._lock:
            row = self._rows.get(task_id)
            if row is None:
                return
            row.status = "complete"
            if future.cancelled():
                row.error = "cancelled"
            else:
                exc = future.exception()
                if exc is not None:
                    row.error = repr(exc)
                    logger.error("background future failed taskId=%s error=%r", task_id, exc)
            self._remember_completed(task_id)

    def _remember_completed(self, task_id: str) -> None:
        self._completed_order.append(task_id)
        while len(self._completed_order) > self._max_completed_rows:
            old_task_id = self._completed_order.pop(0)
            old_row = self._rows.get(old_task_id)
            if old_row is not None and old_row.status == "complete":
                self._rows.pop(old_task_id, None)


daemon_task_registry = DaemonTaskRegistry()
_mcp_threadpool = concurrent.futures.ThreadPoolExecutor(
    max_workers=4,
    thread_name_prefix="cocoindex-mcp",
)


def get_mcp_threadpool() -> concurrent.futures.ThreadPoolExecutor:
    return _mcp_threadpool


def shutdown_mcp_threadpool(wait: bool = True) -> None:
    _mcp_threadpool.shutdown(wait=wait, cancel_futures=True)


def _shutdown_at_exit() -> None:
    try:
        daemon_task_registry.shutdown_sync(timeout_seconds=5.0)
    finally:
        shutdown_mcp_threadpool(wait=True)


atexit.register(_shutdown_at_exit)
