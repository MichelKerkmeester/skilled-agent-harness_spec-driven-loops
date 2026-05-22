from __future__ import annotations

import concurrent.futures
import asyncio
import threading
import time

from cocoindex_code.lifecycle.active_work_registry import (
    ActiveWorkRegistry,
    ActiveWorkRow,
    active_work_registry,
    remove_project_with_drain,
)
from cocoindex_code.lifecycle.cancel_protocol import CancelRequest, CancelStatus
from cocoindex_code.lifecycle.daemon_task_registry import DaemonTaskRegistry


def _row(project_key: str, req_id: str = "req-1", index_id: str = "idx-1") -> ActiveWorkRow:
    return ActiveWorkRow(
        req_id=req_id,
        index_id=index_id,
        started_at=time.monotonic(),
        status="running",
        cancel_event=threading.Event(),
        project_key=project_key,
    )


def setup_function() -> None:
    active_work_registry.reset()


def teardown_function() -> None:
    active_work_registry.reset()


def test_remove_during_index_cancels_and_waits_before_close(monkeypatch) -> None:
    monkeypatch.setenv("REMOVE_PROJECT_TIMEOUT_SECONDS", "1")
    project_key = "/tmp/project"
    row = _row(project_key)
    active_work_registry.add(row)
    closed_at: list[float] = []
    loaded_projects = {project_key: object()}

    def pop_and_close(key: str) -> bool:
        was_loaded = key in loaded_projects
        loaded_projects.pop(key, None)
        closed_at.append(time.monotonic())
        return was_loaded

    remove_thread = threading.Thread(
        target=lambda: remove_project_with_drain(project_key, pop_and_close)
    )
    remove_thread.start()

    deadline = time.monotonic() + 1
    while time.monotonic() < deadline and not row.cancel_event.is_set():
        time.sleep(0.01)

    assert row.cancel_event.is_set()
    assert closed_at == []

    active_work_registry.mark_complete(CancelRequest(req_id="req-1"))
    remove_thread.join(timeout=1)

    assert not remove_thread.is_alive()
    assert closed_at != []
    assert project_key not in loaded_projects


def test_load_time_cancel_task_transitions_to_complete() -> None:
    async def _run() -> None:
        task_registry = DaemonTaskRegistry()
        cancel_seen = asyncio.Event()

        async def load_time_index() -> None:
            try:
                while True:
                    await asyncio.sleep(0.01)
            except asyncio.CancelledError:
                cancel_seen.set()
                raise

        task = asyncio.create_task(load_time_index())
        task_registry.add_task(
            task,
            task_id="idx-load",
            kind="load-time-index",
            project_key="/tmp/project",
        )
        await asyncio.sleep(0)
        task_registry.cancel("idx-load")
        await task_registry.shutdown(timeout_seconds=0.5)
        await asyncio.wait_for(cancel_seen.wait(), timeout=0.5)

        rows = task_registry.list()
        assert rows[0].status == "complete"
        assert rows[0].error == "cancelled"

    asyncio.run(_run())


def test_stale_cancel_identity_returns_stale_or_complete() -> None:
    registry = ActiveWorkRegistry()
    registry.add(_row("/tmp/project"))
    registry.mark_complete(CancelRequest(req_id="req-1"), retain_stale=False)

    assert registry.cancel(CancelRequest(req_id="req-1")) == CancelStatus.STALE


def test_cancel_during_remove_returns_remove_in_progress() -> None:
    registry = ActiveWorkRegistry()
    registry.add(_row("/tmp/project"))
    registry.begin_removing("/tmp/project")

    assert registry.cancel(CancelRequest(req_id="req-1")) == CancelStatus.REMOVE_IN_PROGRESS


def test_threadpool_shutdown_cancels_or_completes_futures() -> None:
    task_registry = DaemonTaskRegistry()
    started = threading.Event()
    release = threading.Event()

    def blocking_work() -> str:
        started.set()
        release.wait(timeout=0.5)
        return "done"

    executor = concurrent.futures.ThreadPoolExecutor(max_workers=1)
    try:
        future = executor.submit(blocking_work)
        task_registry.add_future(
            future,
            task_id="future-1",
            kind="mcp-threadpool",
            project_key="/tmp/project",
        )
        assert started.wait(timeout=0.5)
        task_registry.cancel()
        release.set()
        task_registry.shutdown_sync(timeout_seconds=1)
        executor.shutdown(wait=True, cancel_futures=True)
    finally:
        executor.shutdown(wait=True, cancel_futures=True)

    assert future.cancelled() or future.done()
    assert task_registry.list()[0].status == "complete"


def test_post_remove_same_project_key_can_be_used_again(monkeypatch) -> None:
    monkeypatch.setenv("REMOVE_PROJECT_TIMEOUT_SECONDS", "0.1")
    project_key = "/tmp/project"
    loaded_projects = {project_key: object()}

    assert remove_project_with_drain(
        project_key,
        lambda key: loaded_projects.pop(key, None) is not None,
    ) is True

    active_work_registry.add(_row(project_key, req_id="req-new", index_id="idx-new"))
    assert [row.req_id for row in active_work_registry.list(project_key)] == ["req-new"]
