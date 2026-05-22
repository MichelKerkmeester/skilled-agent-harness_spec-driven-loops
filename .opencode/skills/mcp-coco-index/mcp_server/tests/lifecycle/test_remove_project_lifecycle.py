from __future__ import annotations

import concurrent.futures
import asyncio
import threading
import time
import sys
import types
from pathlib import Path
from types import SimpleNamespace

import pytest

MCP_SERVER_DIR = Path(__file__).resolve().parents[2]
if str(MCP_SERVER_DIR) not in sys.path:
    sys.path.insert(0, str(MCP_SERVER_DIR))

if "cocoindex" not in sys.modules:
    cocoindex_stub = types.ModuleType("cocoindex")

    class _Settings:
        @staticmethod
        def from_env(path):
            return object()

    class _AppConfig:
        def __init__(self, **kwargs):
            self.kwargs = kwargs

    class _Environment:
        def __init__(self, *args, **kwargs):
            self.args = args
            self.kwargs = kwargs

    class _App:
        def __init__(self, *args, **kwargs):
            self.args = args
            self.kwargs = kwargs

        @classmethod
        def __class_getitem__(cls, item):
            return cls

    class _ContextProvider:
        def provide(self, key, value):
            return None

    cocoindex_stub.Settings = _Settings
    cocoindex_stub.AppConfig = _AppConfig
    cocoindex_stub.Environment = _Environment
    cocoindex_stub.App = _App
    cocoindex_stub.ContextProvider = _ContextProvider
    connectors_stub = types.ModuleType("cocoindex.connectors")
    sqlite_stub = types.ModuleType("cocoindex.connectors.sqlite")
    sqlite_stub.connect = lambda *args, **kwargs: object()
    connectors_stub.sqlite = sqlite_stub
    sys.modules["cocoindex"] = cocoindex_stub
    sys.modules["cocoindex.connectors"] = connectors_stub
    sys.modules["cocoindex.connectors.sqlite"] = sqlite_stub

indexer_stub = types.ModuleType("cocoindex_code.indexer.indexer")
indexer_stub.indexer_main = lambda *args, **kwargs: None
sys.modules.setdefault("cocoindex_code.indexer.indexer", indexer_stub)

protocol_stub = types.ModuleType("cocoindex_code.core.protocol")

class _ProtocolStruct:
    def __init__(self, **kwargs):
        for key, value in kwargs.items():
            setattr(self, key, value)

for _name in (
    "DaemonProjectInfo",
    "DaemonStatusRequest",
    "DaemonStatusResponse",
    "ErrorResponse",
    "HandshakeRequest",
    "HandshakeResponse",
    "IndexCancelRequest",
    "IndexCancelResponse",
    "IndexingProgress",
    "IndexProgressUpdate",
    "IndexRequest",
    "IndexResponse",
    "IndexStreamResponse",
    "IndexWaitingNotice",
    "IndexFingerprintPayload",
    "ProjectStatusRequest",
    "ProjectStatusResponse",
    "RemoveProjectRequest",
    "RemoveProjectResponse",
    "Request",
    "Response",
    "SearchRequest",
    "SearchResponse",
    "SearchResult",
    "SearchStreamResponse",
    "RetrievalDiagnosticsPayload",
    "StopRequest",
    "StopResponse",
):
    setattr(protocol_stub, _name, type(_name, (_ProtocolStruct,), {}))
protocol_stub.decode_request = lambda data: data
protocol_stub.decode_response = lambda data: data
protocol_stub.encode_request = lambda req: b""
protocol_stub.encode_response = lambda resp: b""
sys.modules.setdefault("cocoindex_code.core.protocol", protocol_stub)

query_stub = types.ModuleType("cocoindex_code.retrieval.query")
query_stub.query_codebase = lambda *args, **kwargs: []
sys.modules.setdefault("cocoindex_code.retrieval.query", query_stub)

settings_stub = types.ModuleType("cocoindex_code.config.settings")
settings_stub.PROJECT_SETTINGS = object()
settings_stub.ProjectSettings = type("ProjectSettings", (), {})
settings_stub.EmbeddingSettings = type("EmbeddingSettings", (), {})
settings_stub.load_gitignore_spec = lambda root: None
settings_stub.load_project_settings = lambda root: object()
settings_stub.load_user_settings = lambda: SimpleNamespace(
    envs={},
    embedding=SimpleNamespace(
        model="model",
        provider="sentence-transformers",
        query_params=None,
        indexing_params=None,
    ),
)
settings_stub.user_settings_dir = lambda: Path("/tmp/cocoindex-code-test")
settings_stub.global_settings_mtime_us = lambda: 0
sys.modules.setdefault("cocoindex_code.config.settings", settings_stub)

shared_stub = types.ModuleType("cocoindex_code.core.shared")
shared_stub.CODEBASE_DIR = object()
shared_stub.EMBEDDER = object()
shared_stub.EXT_LANG_OVERRIDE_MAP = object()
shared_stub.GITIGNORE_SPEC = object()
shared_stub.DOCUMENT_PROMPT_NAME = object()
shared_stub.QUERY_PROMPT_NAME = object()
shared_stub.SQLITE_DB = object()
shared_stub.Embedder = object
shared_stub.query_prompt_name = None
shared_stub.document_prompt_name = None
shared_stub.resolve_query_prompt_name = lambda model: None
shared_stub.resolve_document_prompt_name = lambda model: None
shared_stub.create_embedder = lambda settings: object()
sys.modules.setdefault("cocoindex_code.core.shared", shared_stub)

index_metadata_stub = types.ModuleType("cocoindex_code.observability.index_metadata")

class _IndexCompatibilityError(Exception):
    def details(self):
        return {}

class _Metadata:
    def dump(self):
        return {"effective_config_hash": "hash"}

class _Compatibility:
    soft_warnings: list[object] = []

    def raise_for_hard_refusal(self):
        return None

index_metadata_stub.IndexCompatibilityError = _IndexCompatibilityError
index_metadata_stub.build_current_index_metadata = lambda **kwargs: _Metadata()
index_metadata_stub.check_index_compatibility = lambda *args, **kwargs: _Compatibility()
sys.modules.setdefault("cocoindex_code.observability.index_metadata", index_metadata_stub)

observability_stub = types.ModuleType("cocoindex_code.observability.observability")
observability_stub.RetrievalDiagnostics = type("RetrievalDiagnostics", (), {"dump": lambda self: {}})
observability_stub.build_index_fingerprint = lambda **kwargs: _Metadata()
observability_stub.elapsed_ms = lambda start: 0
observability_stub.ipc_debug_enabled = lambda: False
observability_stub.log_json = lambda *args, **kwargs: None
observability_stub.log_msgspec_decode_error = lambda *args, **kwargs: None
observability_stub.log_response_size = lambda *args, **kwargs: None
observability_stub.log_stage = lambda *args, **kwargs: None
observability_stub.monotonic_ms = lambda: 0
observability_stub.new_request_id = lambda: "req-test"
observability_stub.read_index_meta = lambda root: {"effective_config_hash": "old"}
observability_stub.resolve_mcp_request_timeout_ms = lambda: 1000
sys.modules.setdefault("cocoindex_code.observability.observability", observability_stub)

import cocoindex_code.core.project as project_module
import cocoindex_code.core.client as client_module
import cocoindex_code.daemon as daemon_module
from cocoindex_code.core.project import Project
from cocoindex_code.lifecycle.active_work_registry import (
    ActiveWorkRegistry,
    ActiveWorkRow,
    active_work_registry,
    remove_project_with_drain,
)
from cocoindex_code.lifecycle.cancel_protocol import CancelRequest, CancelStatus
from cocoindex_code.lifecycle.daemon_task_registry import (
    DaemonTaskRegistry,
    DuplicateTaskIdError,
    daemon_task_registry,
)


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
    daemon_task_registry.reset()


def teardown_function() -> None:
    active_work_registry.reset()
    daemon_task_registry.reset()


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
    registry.mark_complete(CancelRequest(req_id="req-1"), retain_completed_row=False)

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


def test_project_update_cancel_skips_fts_and_initial_done(monkeypatch) -> None:
    class FakeHandle:
        async def watch(self):
            yield SimpleNamespace(
                stats=SimpleNamespace(by_component={"process_file": SimpleNamespace(
                    num_execution_starts=1,
                    num_unchanged=0,
                    num_adds=1,
                    num_deletes=0,
                    num_reprocesses=0,
                    num_errors=0,
                )})
            )

    class FakeApp:
        def update(self):
            return FakeHandle()

    class FakeEnv:
        def get_context(self, key):
            raise AssertionError("cancelled update must not open the DB for FTS sync")

    sync_calls: list[object] = []
    monkeypatch.setattr(project_module, "sync_fts_from_code_chunks", lambda conn: sync_calls.append(conn))

    project = Project.__new__(Project)
    project._app = FakeApp()
    project._env = FakeEnv()
    project._indexing_stats = None
    project._initial_index_done = False
    project._closed = False
    cancel_event = threading.Event()

    def cancel_on_progress(progress) -> None:
        cancel_event.set()

    with pytest.raises(asyncio.CancelledError):
        asyncio.run(project.update_index(on_progress=cancel_on_progress, cancel_event=cancel_event))

    assert sync_calls == []
    assert project.is_initial_index_done is False
    assert project.indexing_stats is None


def test_project_close_is_retryable_after_failed_close() -> None:
    class FakeDb:
        def __init__(self) -> None:
            self.calls = 0

        def close(self) -> None:
            self.calls += 1
            if self.calls == 1:
                raise RuntimeError("close failed")

    db = FakeDb()

    class FakeEnv:
        def get_context(self, key):
            return db

    project = Project.__new__(Project)
    project._env = FakeEnv()
    project._closed = False
    project.close_status = "open"

    project.close()
    assert project._closed is False
    assert project.close_status == "degraded"

    project.close()
    assert project._closed is True
    assert project.close_status == "closed"
    assert db.calls == 2


def test_config_refresh_skips_close_while_active_indexing(monkeypatch) -> None:
    monkeypatch.setenv("REMOVE_PROJECT_TIMEOUT_SECONDS", "0.01")
    project_key = "/tmp/project"
    close_calls: list[str] = []

    class FakeProject:
        def close(self) -> None:
            close_calls.append("closed")

    registry = daemon_module.ProjectRegistry(embedder=object())
    registry._projects[project_key] = FakeProject()
    registry._project_effective_config_hash[project_key] = "old"
    monkeypatch.setattr(registry, "_runtime_metadata", lambda key: {"effective_config_hash": "new"})

    active_work_registry.add(_row(project_key))
    registry._refresh_project_if_config_changed(project_key)

    assert close_calls == []
    assert project_key in registry._projects


def test_daemon_client_index_cancel_round_trips_typed_transport(monkeypatch) -> None:
    sent_requests: list[object] = []

    class FakeConnection:
        def send_bytes(self, payload: bytes) -> None:
            assert payload == b"encoded-index-cancel"

        def recv_bytes(self) -> bytes:
            return b"encoded-index-cancel-response"

    def encode_request(req: object) -> bytes:
        sent_requests.append(req)
        return b"encoded-index-cancel"

    def decode_response(payload: bytes) -> object:
        assert payload == b"encoded-index-cancel-response"
        return protocol_stub.IndexCancelResponse(
            status="cancelled",
            reqId="req-transport",
            indexId="idx-transport",
        )

    monkeypatch.setattr(client_module, "encode_request", encode_request)
    monkeypatch.setattr(client_module, "decode_response", decode_response)

    client = client_module.DaemonClient(FakeConnection())
    response = client.index_cancel(req_id="req-transport", index_id="idx-transport")

    assert len(sent_requests) == 1
    assert isinstance(sent_requests[0], protocol_stub.IndexCancelRequest)
    assert sent_requests[0].reqId == "req-transport"
    assert sent_requests[0].indexId == "idx-transport"
    assert response.status == "cancelled"
    assert response.reqId == "req-transport"
    assert response.indexId == "idx-transport"


def test_remove_project_cancels_queued_index_future_before_close(monkeypatch) -> None:
    monkeypatch.setenv("REMOVE_PROJECT_TIMEOUT_SECONDS", "0.1")
    project_key = "/tmp/project"
    release_running = threading.Event()
    close_observations: list[bool] = []

    class FakeProject:
        def close(self) -> None:
            close_observations.append(queued_future.cancelled())

    def blocking_work() -> None:
        release_running.wait(timeout=1)

    def queued_work() -> None:
        raise AssertionError("queued index work must be cancelled before it starts")

    executor = concurrent.futures.ThreadPoolExecutor(max_workers=1)
    try:
        running_future = executor.submit(blocking_work)
        queued_future = executor.submit(queued_work)
        daemon_task_registry.add_future(
            queued_future,
            task_id="idx-queued",
            kind="explicit-index",
            project_key=project_key,
        )

        registry = daemon_module.ProjectRegistry(embedder=object())
        registry._projects[project_key] = FakeProject()
        registry._index_locks[project_key] = object()
        registry._load_time_done[project_key] = object()

        assert registry.remove_project(project_key) is True
        assert close_observations == [True]
        assert queued_future.cancelled()
        assert daemon_task_registry.list()[0].status == "complete"
        assert daemon_task_registry.list()[0].error == "cancelled"
    finally:
        release_running.set()
        executor.shutdown(wait=True, cancel_futures=True)


def test_shutdown_cancel_leaves_completed_rows_untouched() -> None:
    async def _run() -> None:
        task_registry = DaemonTaskRegistry()
        done_task = asyncio.create_task(asyncio.sleep(0))
        task_registry.add_task(done_task, task_id="done", kind="unit")
        await done_task
        await asyncio.sleep(0)

        running_task = asyncio.create_task(asyncio.sleep(10))
        task_registry.add_task(running_task, task_id="running", kind="unit")
        rows = task_registry.cancel()

        try:
            by_id = {row.task_id: row for row in task_registry.list()}
            assert "done" not in {row.task_id for row in rows}
            assert by_id["done"].status == "complete"
            assert by_id["running"].status == "cancelling"
        finally:
            running_task.cancel()
            await asyncio.gather(running_task, return_exceptions=True)

    asyncio.run(_run())


def test_duplicate_task_id_registration_raises() -> None:
    async def _run() -> None:
        task_registry = DaemonTaskRegistry()
        first = asyncio.create_task(asyncio.sleep(10))
        second = asyncio.create_task(asyncio.sleep(10))
        try:
            task_registry.add_task(first, task_id="dup", kind="unit")
            with pytest.raises(DuplicateTaskIdError):
                task_registry.add_task(second, task_id="dup", kind="unit")
        finally:
            first.cancel()
            second.cancel()
            await asyncio.gather(first, second, return_exceptions=True)

    asyncio.run(_run())
