"""Daemon process: listener loop, project registry, request dispatch."""

# Modified by spec-kit-skilled-agent-orchestration: 009 packet REQ-001..006 (see ../NOTICE)
from __future__ import annotations

import asyncio
import logging
from logging.handlers import RotatingFileHandler
import os
import signal
import sqlite3
import sys
import threading
import time
from collections.abc import AsyncIterator, Callable
from multiprocessing.connection import Connection, Listener
from pathlib import Path
from typing import Any, TextIO

from cocoindex.connectors import sqlite as coco_sqlite

from ._version import __version__
from .observability.index_metadata import (
    IndexCompatibilityError,
    build_current_index_metadata,
    check_index_compatibility,
)
from .observability.observability import (
    RetrievalDiagnostics,
    build_index_fingerprint,
    elapsed_ms,
    ipc_debug_enabled,
    log_json,
    log_msgspec_decode_error,
    log_response_size,
    log_stage,
    monotonic_ms,
    new_request_id,
    read_index_meta,
    resolve_mcp_request_timeout_ms,
)
from .core.project import Project
from .core.protocol import (
    DaemonProjectInfo,
    DaemonStatusRequest,
    DaemonStatusResponse,
    ErrorResponse,
    HandshakeRequest,
    HandshakeResponse,
    IndexCancelRequest,
    IndexCancelResponse,
    IndexingProgress,
    IndexProgressUpdate,
    IndexRequest,
    IndexResponse,
    IndexStreamResponse,
    IndexWaitingNotice,
    IndexFingerprintPayload,
    ProjectStatusRequest,
    ProjectStatusResponse,
    RemoveProjectRequest,
    RemoveProjectResponse,
    Request,
    Response,
    SearchRequest,
    SearchResponse,
    SearchResult,
    SearchStreamResponse,
    RetrievalDiagnosticsPayload,
    StopRequest,
    StopResponse,
    decode_request,
    encode_response,
)
from .lifecycle.active_work_registry import (
    ActiveWorkRow,
    active_work_registry,
    async_remove_project_with_drain,
    remove_project_with_drain,
)
from .lifecycle.cancel_protocol import CancelRequest
from .lifecycle.daemon_task_registry import daemon_task_registry
from .retrieval.query import query_codebase
from .config.settings import (
    PROJECT_SETTINGS,
    global_settings_mtime_us,
    load_project_settings,
    load_user_settings,
    user_settings_dir,
)
from .core import shared
from .core.shared import EMBEDDER, QUERY_PROMPT_NAME, SQLITE_DB, Embedder, create_embedder

logger = logging.getLogger(__name__)
_client_disconnect_count = 0
_client_disconnect_lock = threading.Lock()


def _ipc_debug_enabled() -> bool:
    return ipc_debug_enabled()


def _increment_client_disconnect_count() -> int:
    global _client_disconnect_count
    with _client_disconnect_lock:
        _client_disconnect_count += 1
        return _client_disconnect_count


def _get_client_disconnect_count() -> int:
    with _client_disconnect_lock:
        return _client_disconnect_count


def _safe_send_bytes(
    conn: Connection,
    payload: bytes,
    *,
    label: str = "response",
    req_id: str | None = None,
) -> None:
    """Send bytes over a multiprocessing connection, swallowing pipe errors.

    Logs once at INFO if the client disconnected. Never raises.
    """
    if _ipc_debug_enabled():
        log_json(
            logger,
            event="cocoindex_ipc_send",
            reqId=req_id,
            label=label,
            bytes=len(payload),
            first200Hex=payload[:200].hex(),
        )
    try:
        conn.send_bytes(payload)
    except (BrokenPipeError, ConnectionResetError):
        count = _increment_client_disconnect_count()
        log_json(
            logger,
            event="cocoindex_client_disconnect",
            reqId=req_id,
            message="client disconnected before response could be sent",
            count=count,
        )
    except Exception:
        logger.exception("ipc_send failed label=%s bytes=%d", label, len(payload))
        raise


def _response_result_count(resp: Response) -> int:
    if isinstance(resp, SearchResponse):
        return len(resp.results)
    if isinstance(resp, IndexProgressUpdate):
        return 1
    return 0


def _diagnostics_payload(diagnostics: RetrievalDiagnostics) -> RetrievalDiagnosticsPayload:
    return RetrievalDiagnosticsPayload(**diagnostics.dump())


def _fingerprint_payload(payload: dict[str, Any] | None) -> IndexFingerprintPayload:
    if not payload:
        return IndexFingerprintPayload()
    allowed = set(IndexFingerprintPayload.__struct_fields__)
    return IndexFingerprintPayload(**{key: value for key, value in payload.items() if key in allowed})


def _send_response(conn: Connection, resp: Response, *, req_id: str) -> None:
    stage_start = monotonic_ms()
    payload = encode_response(resp)
    log_stage(
        logger,
        req_id=req_id,
        stage="response_serialization",
        duration_ms=elapsed_ms(stage_start),
        result_count=_response_result_count(resp),
    )
    log_response_size(
        logger,
        req_id=req_id,
        byte_count=len(payload),
        stage="msgspec_response",
    )
    _safe_send_bytes(conn, payload, label=type(resp).__name__, req_id=req_id)


def _pid_alive(pid: int) -> bool:
    """Return True if *pid* is still running."""
    if sys.platform == "win32":
        import ctypes

        kernel32 = getattr(ctypes, "windll").kernel32
        handle = kernel32.OpenProcess(0x1000, False, pid)
        if handle:
            kernel32.CloseHandle(handle)
            return True
        return False
    try:
        os.kill(pid, 0)
        return True
    except ProcessLookupError:
        return False
    except PermissionError:
        return True


def _try_acquire_pid_lock(lock_path: Path) -> TextIO | None:
    """Acquire an advisory lock on lock_path, returning the open fd on success."""
    fd = open(lock_path, "a+")
    try:
        if sys.platform == "win32":
            import msvcrt

            msvcrt.locking(fd.fileno(), msvcrt.LK_NBLCK, 1)
        else:
            import fcntl

            fcntl.flock(fd.fileno(), fcntl.LOCK_EX | fcntl.LOCK_NB)
        return fd
    except (BlockingIOError, OSError):
        fd.close()
        return None


def _unlink_stale_socket(socket_path: Path, pid_path: Path) -> None:
    """Unlink the daemon socket only when no live sibling owns the PID file."""
    try:
        pid_text = pid_path.read_text().strip()
        if pid_text:
            stored_pid = int(pid_text)
            if _pid_alive(stored_pid) and stored_pid != os.getpid():
                raise RuntimeError(
                    f"daemon already running at PID {stored_pid}; refusing to unlink socket"
                )
    except (FileNotFoundError, ValueError):
        pass
    socket_path.unlink(missing_ok=True)


class SearchResults(list[SearchResult]):
    """Search results with response-level dedup telemetry."""

    dedupedAliases: int
    uniqueResultCount: int
    diagnostics: RetrievalDiagnostics

    def __init__(
        self,
        results: list[SearchResult],
        *,
        deduped_aliases: int,
        unique_result_count: int,
        diagnostics: RetrievalDiagnostics | None = None,
    ) -> None:
        super().__init__(results)
        self.dedupedAliases = deduped_aliases
        self.uniqueResultCount = unique_result_count
        self.diagnostics = diagnostics or RetrievalDiagnostics()


class SearchOnlyContext:
    """Minimal context provider for read-only searches against target_sqlite.db."""

    def __init__(self, values: dict[Any, Any]) -> None:
        self._values = values

    def get_context(self, key: Any) -> Any:
        return self._values[key]


def _validate_project_root(claimed: str) -> str:
    """Resolve and constrain client-supplied project roots to the user's home."""
    raw_path = Path(claimed).expanduser()
    if ".." in raw_path.parts:
        raise ValueError(f"project_root must not contain '..' segments: rejected {claimed}")

    project_root = raw_path.resolve()
    home = Path.home().resolve()
    try:
        project_root.relative_to(home)
    except ValueError as exc:
        raise ValueError(f"project_root must be inside home: rejected {project_root}") from exc
    return str(project_root)


# ---------------------------------------------------------------------------
# Daemon paths
# ---------------------------------------------------------------------------


def daemon_dir() -> Path:
    """Return the daemon directory (``~/.cocoindex_code/``)."""
    return user_settings_dir()


def _connection_family() -> str:
    """Return the multiprocessing connection family for this platform."""
    return "AF_PIPE" if sys.platform == "win32" else "AF_UNIX"


def daemon_socket_path() -> str:
    """Return the daemon socket/pipe address."""
    if sys.platform == "win32":
        import hashlib

        # Hash the daemon dir so COCOINDEX_CODE_DIR overrides create unique pipe names,
        # preventing conflicts between different daemon instances (tests, users, etc.)
        dir_hash = hashlib.md5(str(daemon_dir()).encode()).hexdigest()[:12]
        return rf"\\.\pipe\cocoindex_code_{dir_hash}"
    return str(daemon_dir() / "daemon.sock")


def daemon_pid_path() -> Path:
    """Return the path for the daemon's PID file."""
    return daemon_dir() / "daemon.pid"


def daemon_lock_path() -> Path:
    """Return the path for the daemon's lifetime lock file.

    Patch 11: held by the daemon process for its entire lifetime. Fences
    sibling daemons that try to start while one is alive. Separate from
    daemon.pid so operator scripts can read the PID file without lock
    awareness, and separate from daemon.spawn-lock so client and daemon
    do not contend on the same fd during startup.
    """
    return daemon_dir() / "daemon.lock"


def daemon_spawn_lock_path() -> Path:
    """Return the path for the client-side spawn-coordination lock file.

    Patch 12: held briefly by the client during spawn-and-wait-for-claim.
    Separate from daemon.lock so the spawned daemon can acquire its own
    long-lived lock without contending against the client's coordination fd.
    """
    return daemon_dir() / "daemon.spawn-lock"


def daemon_log_path() -> Path:
    """Return the path for the daemon's log file."""
    return daemon_dir() / "daemon.log"


# ---------------------------------------------------------------------------
# Project Registry
# ---------------------------------------------------------------------------


class ProjectRegistry:
    """Manages loaded projects and their indexes."""

    _projects: dict[str, Project]
    _index_locks: dict[str, asyncio.Lock]
    _embedder: Embedder

    def __init__(self, embedder: Embedder) -> None:
        self._projects = {}
        self._index_locks = {}
        self._load_time_done: dict[str, asyncio.Event] = {}
        self._embedder = embedder
        self._embedder_by_config_hash: dict[str, Embedder] = {}
        self._project_effective_config_hash: dict[str, str] = {}
        self._current_index_meta: dict[str, dict[str, Any] | None] = {}

    async def get_project(self, project_root: str, *, suppress_auto_index: bool = False) -> Project:
        """Get or create a Project for the given root. Lazy initialization.

        When a project is newly loaded and *suppress_auto_index* is False,
        a background indexing task (load-time indexing) is fired so the project
        is indexed immediately.  Callers that will index right away (e.g.
        IndexRequest, SearchRequest with refresh) should pass
        ``suppress_auto_index=True``.
        """
        if project_root in self._projects:
            self._refresh_project_if_config_changed(project_root)
        if project_root not in self._projects:
            root = Path(project_root)
            project_settings = load_project_settings(root)
            embedder = self._embedder_for_project(project_root)
            project = await Project.create(root, project_settings, embedder)
            self._projects[project_root] = project
            self._index_locks[project_root] = asyncio.Lock()
            self._load_time_done[project_root] = asyncio.Event()
            if not suppress_auto_index:
                index_id = self._new_index_id()
                task = asyncio.create_task(
                    self._run_index(
                        project_root,
                        req_id=index_id,
                        index_id=index_id,
                    )
                )
                daemon_task_registry.add_task(
                    task,
                    task_id=index_id,
                    kind="load-time-index",
                    project_key=project_root,
                )
        return self._projects[project_root]

    def _new_index_id(self) -> str:
        return f"idx-{new_request_id()}"

    def _runtime_metadata(self, project_root: str) -> dict[str, Any]:
        embedding_model, embedding_provider = self._embedding_settings()
        query_prompt, document_prompt = self._embedding_prompt_names()
        return build_current_index_metadata(
            project_root=Path(project_root),
            embedding_model=embedding_model,
            embedding_provider=embedding_provider,
            query_prompt_name=query_prompt,
            document_prompt_name=document_prompt,
        ).dump()

    def _embedder_for_project(self, project_root: str) -> Embedder:
        runtime_meta = self._runtime_metadata(project_root)
        effective_hash = str(runtime_meta.get("effective_config_hash"))
        self._current_index_meta[project_root] = read_index_meta(Path(project_root))
        if effective_hash not in self._embedder_by_config_hash:
            try:
                settings = load_user_settings()
                self._embedder_by_config_hash[effective_hash] = create_embedder(settings.embedding)
            except Exception:
                logger.exception("Failed to create project-scoped embedder for %s", project_root)
                raise
        self._project_effective_config_hash[project_root] = effective_hash
        return self._embedder_by_config_hash[effective_hash]

    def _refresh_project_if_config_changed(self, project_root: str) -> None:
        if project_root in self._projects and project_root not in self._project_effective_config_hash:
            return
        runtime_meta = self._runtime_metadata(project_root)
        effective_hash = str(runtime_meta.get("effective_config_hash"))
        if self._project_effective_config_hash.get(project_root) == effective_hash:
            return
        project = self._projects.pop(project_root, None)
        if project is not None:
            project.close()
        self._project_effective_config_hash.pop(project_root, None)

    def should_wait_for_indexing(self, project_root: str) -> bool:
        """Check if search should wait before querying.

        Returns True if the index lock is held (indexing actively running)
        or the initial indexing hasn't completed yet (covers the window
        between task creation and lock acquisition).
        """
        lock = self._index_locks.get(project_root)
        if lock is not None and lock.locked():
            return True
        event = self._load_time_done.get(project_root)
        return event is not None and not event.is_set()

    async def wait_for_indexing_done(self, project_root: str) -> None:
        """Wait until no indexing is in progress and initial indexing is complete."""
        # Wait for the initial indexing to complete (if pending)
        event = self._load_time_done.get(project_root)
        if event is not None:
            await event.wait()
        # Wait for any ongoing indexing to finish (lock released)
        lock = self._index_locks.get(project_root)
        if lock is not None and lock.locked():
            await lock.acquire()
            lock.release()

    async def _run_index(
        self,
        project_root: str,
        on_progress: Callable[[IndexingProgress], None] | None = None,
        req_id: str | None = None,
        index_id: str | None = None,
    ) -> None:
        """Run indexing for a project, acquiring and releasing the per-project lock.

        This is the single place where indexing actually happens.  It is used
        both as a fire-and-forget background task (load-time indexing) and as a
        spawned task inside ``update_index`` (client-driven indexing).

        On completion (success or failure) it marks load-time as done
        (idempotent) and releases the lock.
        """
        req_id = req_id or new_request_id()
        index_id = index_id or self._new_index_id()
        cancel_event = threading.Event()
        row = ActiveWorkRow(
            req_id=req_id,
            index_id=index_id,
            started_at=time.monotonic(),
            status="running",
            cancel_event=cancel_event,
            project_key=project_root,
        )
        active_work_registry.add(row)
        project = self._projects[project_root]
        lock = self._index_locks[project_root]

        acquired = False
        try:
            await lock.acquire()
            acquired = True
            if cancel_event.is_set():
                raise asyncio.CancelledError()
            await project.update_index(
                on_progress=on_progress,
                cancel_event=cancel_event,
            )
            self._write_index_metadata(project_root)
        except asyncio.CancelledError:
            logger.info(
                "Indexing cancelled for %s reqId=%s indexId=%s",
                project_root,
                req_id,
                index_id,
            )
            raise
        except Exception:
            logger.exception("Indexing failed for %s", project_root)
            raise
        finally:
            active_work_registry.mark_complete(
                CancelRequest(req_id=req_id, index_id=index_id)
            )
            event = self._load_time_done.get(project_root)
            if event is not None:
                event.set()
            if acquired:
                lock.release()

    def _embedding_settings(self) -> tuple[str | None, str | None]:
        try:
            settings = load_user_settings()
        except Exception:
            return None, None
        return settings.embedding.model, settings.embedding.provider

    def _embedding_prompt_names(self) -> tuple[str | None, str | None]:
        try:
            settings = load_user_settings()
        except Exception:
            return shared.query_prompt_name, shared.document_prompt_name
        model = settings.embedding.model
        stripped_model = model[len("sbert/") :] if model.startswith("sbert/") else model
        query_prompt = (
            settings.embedding.query_params.get("prompt_name")
            if settings.embedding.query_params is not None
            else shared.resolve_query_prompt_name(stripped_model)
        )
        document_prompt = (
            settings.embedding.indexing_params.get("prompt_name")
            if settings.embedding.indexing_params is not None
            else shared.resolve_document_prompt_name(stripped_model)
        )
        return query_prompt, document_prompt

    def _index_counts(self, project_root: str) -> tuple[int, int]:
        target_db = Path(project_root) / ".cocoindex_code" / "target_sqlite.db"
        if not target_db.exists():
            return 0, 0
        try:
            import sqlite_vec

            conn = sqlite3.connect(f"file:{target_db}?mode=ro", uri=True)
            try:
                conn.enable_load_extension(True)
                sqlite_vec.load(conn)
                total_chunks = conn.execute("SELECT COUNT(*) FROM code_chunks_vec").fetchone()[0]
                total_files = conn.execute(
                    "SELECT COUNT(DISTINCT file_path) FROM code_chunks_vec"
                ).fetchone()[0]
                return int(total_chunks), int(total_files)
            finally:
                conn.close()
        except Exception:
            logger.exception("Failed to read index counts for %s", project_root)
            return 0, 0

    def _current_fingerprint_payload(
        self,
        project_root: str,
        *,
        chunk_count: int = 0,
        file_count: int = 0,
    ) -> dict[str, Any]:
        embedding_model, embedding_provider = self._embedding_settings()
        query_prompt, document_prompt = self._embedding_prompt_names()
        fingerprint = build_index_fingerprint(
            project_root=Path(project_root),
            chunk_count=chunk_count,
            file_count=file_count,
            embedding_model=embedding_model,
            embedding_provider=embedding_provider,
            query_prompt_name=query_prompt,
            document_prompt_name=document_prompt,
        )
        return fingerprint.dump()

    def _write_index_metadata(self, project_root: str) -> None:
        chunk_count, file_count = self._index_counts(project_root)
        embedding_model, embedding_provider = self._embedding_settings()
        from .indexer.indexer import write_index_metadata

        write_index_metadata(
            Path(project_root),
            chunk_count=chunk_count,
            file_count=file_count,
            embedding_model=embedding_model,
            embedding_provider=embedding_provider,
        )

    def _status_fingerprint(self, project_root: str, chunk_count: int, file_count: int) -> dict[str, Any]:
        current = self._current_fingerprint_payload(
            project_root,
            chunk_count=chunk_count,
            file_count=file_count,
        )
        indexed = read_index_meta(Path(project_root))
        if indexed and indexed.get("effective_config_hash") != current.get("effective_config_hash"):
            current["indexed_effective_config_hash"] = indexed.get("effective_config_hash")
            current["fingerprint_warning"] = "INDEX_FINGERPRINT_MISMATCH"
        elif indexed:
            current["indexed_effective_config_hash"] = indexed.get("effective_config_hash")
        return current

    def _warn_if_fingerprint_mismatch(self, project_root: str, *, req_id: str | None = None) -> None:
        current = self._current_fingerprint_payload(project_root)
        indexed = read_index_meta(Path(project_root))
        self._current_index_meta[project_root] = indexed
        indexed_hash = indexed.get("effective_config_hash") if indexed else None
        current_hash = current.get("effective_config_hash")
        if indexed_hash == current_hash:
            return
        log_json(
            logger,
            event="INDEX_FINGERPRINT_MISMATCH",
            reqId=req_id,
            projectRoot=project_root,
            indexedHash=indexed_hash,
            currentHash=current_hash,
        )

    def _check_search_compatibility(self, project_root: str) -> None:
        embedding_model, embedding_provider = self._embedding_settings()
        query_prompt, document_prompt = self._embedding_prompt_names()
        expected = build_current_index_metadata(
            project_root=Path(project_root),
            embedding_model=embedding_model,
            embedding_provider=embedding_provider,
            query_prompt_name=query_prompt,
            document_prompt_name=document_prompt,
        )
        result = check_index_compatibility(Path(project_root), expected)
        self._current_index_meta[project_root] = read_index_meta(Path(project_root))
        for warning in result.soft_warnings:
            log_json(
                logger,
                event="INDEX_FINGERPRINT_SOFT_WARN",
                projectRoot=project_root,
                field=warning.field,
                expected=warning.expected,
                actual=warning.actual,
            )
        result.raise_for_hard_refusal()

    async def update_index(
        self,
        project_root: str,
        *,
        suppress_auto_index: bool = True,
        req_id: str | None = None,
        index_id: str | None = None,
    ) -> AsyncIterator[IndexStreamResponse]:
        """Update index, yielding progress updates and a final IndexResponse.

        Streams ``IndexProgressUpdate`` messages while indexing is in progress,
        ending with a terminal ``IndexResponse``.  If the lock is already held,
        yields ``IndexWaitingNotice`` first.

        The actual indexing runs in a separate task (``_run_index``) so that
        client disconnects (``GeneratorExit``) do not abort the indexing.
        """
        await self.get_project(project_root, suppress_auto_index=suppress_auto_index)
        lock = self._index_locks[project_root]

        # If lock is already held, notify the client before blocking
        if lock.locked():
            yield IndexWaitingNotice()

        req_id = req_id or new_request_id()
        index_id = index_id or self._new_index_id()
        progress_queue: asyncio.Queue[IndexingProgress] = asyncio.Queue()
        index_task = asyncio.create_task(
            self._run_index(
                project_root,
                on_progress=lambda p: progress_queue.put_nowait(p),
                req_id=req_id,
                index_id=index_id,
            )
        )
        daemon_task_registry.add_task(
            index_task,
            task_id=index_id,
            kind="explicit-index",
            project_key=project_root,
        )

        try:
            # Drain the queue until the task completes
            while not index_task.done():
                try:
                    progress = await asyncio.wait_for(progress_queue.get(), timeout=0.1)
                    yield IndexProgressUpdate(progress=progress)
                except TimeoutError:
                    continue

            # Drain any remaining items
            while not progress_queue.empty():
                yield IndexProgressUpdate(progress=progress_queue.get_nowait())

            # Propagate any exception from the index task
            index_task.result()

            yield IndexResponse(success=True, reqId=req_id, indexId=index_id)
        except GeneratorExit:
            # Client disconnected — _run_index continues in background and
            # handles cleanup (release lock, clear _indexing) when done.
            return
        except asyncio.CancelledError:
            yield IndexResponse(
                success=False,
                message="cancelled",
                reqId=req_id,
                indexId=index_id,
            )
        except Exception as e:
            yield IndexResponse(success=False, message=str(e), reqId=req_id, indexId=index_id)

    async def search(
        self,
        project_root: str,
        query: str,
        languages: list[str] | None = None,
        paths: list[str] | None = None,
        limit: int = 5,
        offset: int = 0,
        req_id: str | None = None,
    ) -> SearchResults:
        """Search within a project."""
        project_root = _validate_project_root(project_root)
        self._refresh_project_if_config_changed(project_root)
        active_embedder = self._embedder_for_project(project_root)
        self._warn_if_fingerprint_mismatch(project_root, req_id=req_id)
        self._check_search_compatibility(project_root)
        root = Path(project_root)
        target_db = root / ".cocoindex_code" / "target_sqlite.db"
        project = self._projects.get(project_root)
        db_to_close: Any | None = None
        if project is None:
            project_settings = load_project_settings(root)
            db_to_close = coco_sqlite.connect(str(target_db), load_vec=True)
            env: Any = SearchOnlyContext(
                {
                    SQLITE_DB: db_to_close,
                    EMBEDDER: active_embedder,
                    QUERY_PROMPT_NAME: shared.query_prompt_name,
                    PROJECT_SETTINGS: project_settings,
                }
            )
        else:
            env = project.env
        try:
            results = await query_codebase(
                query=query,
                target_sqlite_db_path=target_db,
                env=env,
                limit=limit,
                offset=offset,
                languages=languages,
                paths=paths,
                req_id=req_id,
            )
        finally:
            if db_to_close is not None:
                db_to_close.close()
        search_results = [
            SearchResult(
                file_path=r.file_path,
                language=r.language,
                content=r.content,
                start_line=r.start_line,
                end_line=r.end_line,
                score=r.score,
                raw_score=r.raw_score,
                path_class=r.path_class,
                rankingSignals=r.rankingSignals,
                fts5_score=r.fts5_score,
                rrf_score=r.rrf_score,
                pre_rerank_score=r.pre_rerank_score,
                reranker_score=r.reranker_score,
            )
            for r in results
        ]
        return SearchResults(
            search_results,
            deduped_aliases=results.dedupedAliases,
            unique_result_count=results.uniqueResultCount,
            diagnostics=results.diagnostics,
        )

    def get_status(self, project_root: str) -> ProjectStatusResponse:
        """Get index stats for a project."""
        project_root = _validate_project_root(project_root)
        project = self._projects.get(project_root)
        if project is None:
            target_db = Path(project_root) / ".cocoindex_code" / "target_sqlite.db"
            if target_db.exists():
                try:
                    import sqlite_vec

                    conn = sqlite3.connect(f"file:{target_db}?mode=ro", uri=True)
                    try:
                        conn.enable_load_extension(True)
                        sqlite_vec.load(conn)
                        total_chunks = conn.execute("SELECT COUNT(*) FROM code_chunks_vec").fetchone()[0]
                        total_files = conn.execute(
                            "SELECT COUNT(DISTINCT file_path) FROM code_chunks_vec"
                        ).fetchone()[0]
                        lang_rows = conn.execute(
                            "SELECT language, COUNT(*) as cnt FROM code_chunks_vec"
                            " GROUP BY language ORDER BY cnt DESC"
                        ).fetchall()
                        return ProjectStatusResponse(
                            indexing=False,
                            total_chunks=total_chunks,
                            total_files=total_files,
                            languages={lang: cnt for lang, cnt in lang_rows},
                            index_exists=True,
                            fingerprint=_fingerprint_payload(
                                self._status_fingerprint(project_root, total_chunks, total_files)
                            ),
                        )
                    finally:
                        conn.close()
                except Exception:
                    logger.exception("Failed to read unloaded project sqlite status for %s", project_root)
                    logger.warning(
                        "0 chunks reported; project not loaded — call ccc index to refresh"
                    )
            return ProjectStatusResponse(
                indexing=False,
                total_chunks=0,
                total_files=0,
                languages={},
                index_exists=target_db.exists(),
                fingerprint=_fingerprint_payload(
                    self._status_fingerprint(project_root, 0, 0)
                ),
            )

        db = project.env.get_context(SQLITE_DB)
        index_exists = True
        try:
            with db.readonly() as conn:
                total_chunks = conn.execute("SELECT COUNT(*) FROM code_chunks_vec").fetchone()[0]
                total_files = conn.execute(
                    "SELECT COUNT(DISTINCT file_path) FROM code_chunks_vec"
                ).fetchone()[0]
                lang_rows = conn.execute(
                    "SELECT language, COUNT(*) as cnt FROM code_chunks_vec"
                    " GROUP BY language ORDER BY cnt DESC"
                ).fetchall()
        except sqlite3.OperationalError:
            index_exists = False
            total_chunks = 0
            total_files = 0
            lang_rows = []

        lock = self._index_locks.get(project_root)
        is_indexing = lock is not None and lock.locked()
        progress = project.indexing_stats if is_indexing else None
        return ProjectStatusResponse(
            indexing=is_indexing,
            total_chunks=total_chunks,
            total_files=total_files,
            languages={lang: cnt for lang, cnt in lang_rows},
            progress=progress,
            index_exists=index_exists,
            fingerprint=_fingerprint_payload(
                self._status_fingerprint(project_root, total_chunks, total_files)
            ),
        )

    def _log_remove_timeout(self, project_root: str, remaining: list[ActiveWorkRow]) -> None:
        for row in remaining:
            log_json(
                logger,
                event="cocoindex_remove_project_force_removed",
                pid=os.getpid(),
                projectRoot=project_root,
                reqId=row.req_id,
                indexId=row.index_id,
                status=row.status,
            )

    def _pop_and_close_project(self, project_root: str) -> bool:
        import gc

        was_loaded = project_root in self._projects
        project = self._projects.pop(project_root, None)
        self._index_locks.pop(project_root, None)
        self._load_time_done.pop(project_root, None)
        self._project_effective_config_hash.pop(project_root, None)
        self._current_index_meta.pop(project_root, None)
        if project is not None:
            project.close()
            del project
            gc.collect()
        return was_loaded

    def remove_project(self, project_root: str) -> bool:
        """Remove a project from the registry. Returns True if it was loaded."""
        return remove_project_with_drain(
            project_root,
            self._pop_and_close_project,
            on_timeout=self._log_remove_timeout,
        )

    async def remove_project_async(self, project_root: str) -> bool:
        """Async remove path used by daemon dispatch so index tasks can drain."""
        return await async_remove_project_with_drain(
            project_root,
            self._pop_and_close_project,
            on_timeout=self._log_remove_timeout,
        )

    def cancel_index(self, req: CancelRequest) -> str:
        """Cancel a specific active index request."""
        return active_work_registry.cancel(req).value

    def close_all(self) -> None:
        """Close all loaded projects and release resources."""
        import gc

        for project in self._projects.values():
            project.close()
        self._projects.clear()
        self._index_locks.clear()
        self._load_time_done.clear()
        gc.collect()

    def list_projects(self) -> list[DaemonProjectInfo]:
        """List all loaded projects with their indexing state."""
        return [
            DaemonProjectInfo(
                project_root=root,
                indexing=self._index_locks[root].locked(),
            )
            for root in self._projects
        ]


# ---------------------------------------------------------------------------
# Connection handler
# ---------------------------------------------------------------------------


async def handle_connection(
    conn: Connection,
    registry: ProjectRegistry,
    start_time: float,
    shutdown_event: asyncio.Event,
    settings_mtime_us: int | None,
    request_timeout_ms: int,
) -> None:
    """Handle a single client connection."""
    loop = asyncio.get_event_loop()
    handshake_done = False

    def _recv() -> bytes:
        """Blocking recv that also checks for shutdown."""
        # Use poll with a timeout so we can check shutdown_event periodically
        while not shutdown_event.is_set():
            if conn.poll(0.5):
                return conn.recv_bytes()
        raise EOFError("shutdown")

    try:
        while not shutdown_event.is_set():
            try:
                data: bytes = await loop.run_in_executor(None, _recv)
            except (EOFError, OSError):
                break

            try:
                stage_start = monotonic_ms()
                req = decode_request(data)
            except Exception as e:
                log_msgspec_decode_error(
                    logger,
                    direction="request",
                    data=data,
                    error=e,
                )
                req_id = new_request_id()
                resp: Response = ErrorResponse(message=f"Invalid request: {e}", reqId=req_id)
                _send_response(conn, resp, req_id=req_id)
                continue
            req_id = getattr(req, "reqId", None) or new_request_id()
            log_stage(
                logger,
                req_id=req_id,
                stage="parse",
                duration_ms=elapsed_ms(stage_start),
            )

            if not handshake_done:
                if not isinstance(req, HandshakeRequest):
                    resp = ErrorResponse(
                        message="First message must be a handshake",
                        reqId=req_id,
                    )
                    _send_response(conn, resp, req_id=req_id)
                    break

                ok = req.version == __version__
                resp = HandshakeResponse(
                    ok=ok,
                    daemon_version=__version__,
                    global_settings_mtime_us=settings_mtime_us,
                )
                _send_response(conn, resp, req_id=req_id)
                if not ok:
                    break
                handshake_done = True
                continue

            try:
                result = await asyncio.wait_for(
                    _dispatch(req, registry, start_time, shutdown_event, req_id=req_id),
                    timeout=request_timeout_ms / 1000,
                )
            except asyncio.TimeoutError:
                resp = ErrorResponse(
                    message=f"Request timed out after {request_timeout_ms}ms",
                    reqId=req_id,
                )
                _send_response(conn, resp, req_id=req_id)
                continue
            if isinstance(result, AsyncIterator):
                try:
                    async for resp in result:
                        _send_response(conn, resp, req_id=req_id)
                except Exception as exc:
                    logger.info("error during streaming response: %s", exc)
                    error_resp = ErrorResponse(message=str(exc), reqId=req_id)
                    _send_response(conn, error_resp, req_id=req_id)
            else:
                _send_response(conn, result, req_id=req_id)

            if isinstance(req, StopRequest):
                break
    except Exception as exc:
        logger.info("error handling connection: %s", exc)
    finally:
        try:
            conn.close()
        except Exception:
            pass


async def _search_with_wait(
    registry: ProjectRegistry, req: SearchRequest, *, req_id: str
) -> AsyncIterator[SearchStreamResponse]:
    """Stream search response, waiting for ongoing indexing first."""
    yield IndexWaitingNotice()
    await registry.wait_for_indexing_done(req.project_root)
    try:
        results = await registry.search(
            project_root=req.project_root,
            query=req.query,
            languages=req.languages,
            paths=req.paths,
            limit=req.limit,
            offset=req.offset,
            req_id=req_id,
        )
        yield SearchResponse(
            success=True,
            results=results,
            total_returned=len(results),
            offset=req.offset,
            dedupedAliases=results.dedupedAliases,
            uniqueResultCount=results.uniqueResultCount,
            diagnostics=_diagnostics_payload(results.diagnostics),
        )
    except IndexCompatibilityError as e:
        yield ErrorResponse(
            message=str(e),
            reqId=req_id,
            code="INDEX_FINGERPRINT_MISMATCH",
            details=e.details(),
        )
    except Exception as e:
        yield ErrorResponse(message=str(e), reqId=req_id)


async def _dispatch(
    req: Request,
    registry: ProjectRegistry,
    start_time: float,
    shutdown_event: asyncio.Event,
    *,
    req_id: str,
) -> Response | AsyncIterator[IndexStreamResponse] | AsyncIterator[SearchStreamResponse]:
    """Dispatch a request to the appropriate handler.

    Returns a single Response for most requests, or an AsyncIterator for
    streaming requests (IndexRequest, or SearchRequest when waiting for
    load-time indexing).
    """
    try:
        if isinstance(req, IndexRequest):
            return registry.update_index(
                req.project_root,
                req_id=req.reqId or req_id,
                index_id=req.indexId,
            )

        if isinstance(req, IndexCancelRequest):
            try:
                cancel_req = CancelRequest(req_id=req.reqId, index_id=req.indexId)
            except ValueError as exc:
                return ErrorResponse(message=str(exc), reqId=req_id)
            status = registry.cancel_index(cancel_req)
            return IndexCancelResponse(status=status, reqId=req.reqId, indexId=req.indexId)

        if isinstance(req, SearchRequest):
            # If load-time indexing is in progress, return a streaming response
            if registry.should_wait_for_indexing(req.project_root):
                return _search_with_wait(registry, req, req_id=req_id)

            results = await registry.search(
                project_root=req.project_root,
                query=req.query,
                languages=req.languages,
                paths=req.paths,
                limit=req.limit,
                offset=req.offset,
                req_id=req_id,
            )
            return SearchResponse(
                success=True,
                results=results,
                total_returned=len(results),
                offset=req.offset,
                dedupedAliases=results.dedupedAliases,
                uniqueResultCount=results.uniqueResultCount,
                diagnostics=_diagnostics_payload(results.diagnostics),
            )

        if isinstance(req, ProjectStatusRequest):
            return registry.get_status(req.project_root)

        if isinstance(req, DaemonStatusRequest):
            return DaemonStatusResponse(
                version=__version__,
                uptime_seconds=time.monotonic() - start_time,
                projects=registry.list_projects(),
                clientDisconnects=_get_client_disconnect_count(),
            )

        if isinstance(req, RemoveProjectRequest):
            await registry.remove_project_async(req.project_root)
            return RemoveProjectResponse(ok=True)

        if isinstance(req, StopRequest):
            shutdown_event.set()
            return StopResponse(ok=True)

        return ErrorResponse(message=f"Unknown request type: {type(req).__name__}", reqId=req_id)
    except IndexCompatibilityError as e:
        logger.info("Search refused by index compatibility check: %s", e)
        return ErrorResponse(
            message=str(e),
            reqId=req_id,
            code="INDEX_FINGERPRINT_MISMATCH",
            details=e.details(),
        )
    except Exception as e:
        logger.exception("Error dispatching request")
        return ErrorResponse(message=str(e), reqId=req_id)


# ---------------------------------------------------------------------------
# Daemon main
# ---------------------------------------------------------------------------


def run_daemon() -> None:
    """Main entry point for the daemon process (blocking)."""
    from .embedders.registry import validate_registry

    validate_registry()
    daemon_dir().mkdir(parents=True, exist_ok=True)

    # Load user settings and record mtime for staleness detection
    user_settings = load_user_settings()
    settings_mtime_us = global_settings_mtime_us()

    # Set environment variables from settings
    for key, value in user_settings.envs.items():
        os.environ[key] = value

    # Create embedder
    embedder = create_embedder(user_settings.embedding)

    pid_path = daemon_pid_path()
    # Patch 11: lock the dedicated daemon.lock file, not daemon.pid.
    startup_lock_fd = _try_acquire_pid_lock(daemon_lock_path())
    if startup_lock_fd is None:
        raise RuntimeError("daemon already running; refusing to start (lock contended)")

    # Patch 8: detect a live sibling daemon BEFORE overwriting the PID file.
    # The original Patch 1+3 left a window where two daemons could spawn,
    # both pass the lock at different times, and both unlink the socket plus
    # write their own PID. The check below reads the previous PID before we
    # claim the file, so a live sibling is detected and this daemon exits.
    try:
        existing_pid: int | None = None
        try:
            text = pid_path.read_text().strip()
            if text:
                existing_pid = int(text)
        except (FileNotFoundError, ValueError):
            pass
        if (
            existing_pid is not None
            and existing_pid != os.getpid()
            and _pid_alive(existing_pid)
        ):
            raise RuntimeError(
                f"daemon already running at PID {existing_pid}; refusing to start"
            )

        # Sibling check passed. Clean up any stale socket while still under lock.
        if sys.platform != "win32":
            Path(daemon_socket_path()).unlink(missing_ok=True)
        pid_path.write_text(str(os.getpid()))
    except BaseException:
        startup_lock_fd.close()
        raise

    # Set up logging to file. Patch 9: drop StreamHandler when stderr is not a
    # TTY. The spawned daemon's stderr is redirected to daemon.log by the
    # client launcher, so a StreamHandler would write every log line twice
    # (once via RotatingFileHandler, once via stderr-to-file).
    log_path = daemon_log_path()
    handlers: list[logging.Handler] = [
        RotatingFileHandler(
            str(log_path),
            maxBytes=10 * 1024 * 1024,
            backupCount=5,
            encoding="utf-8",
        ),
    ]
    if sys.stderr is not None and sys.stderr.isatty():
        handlers.append(logging.StreamHandler())
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(name)s: %(message)s",
        handlers=handlers,
        force=True,
    )

    request_timeout_ms = resolve_mcp_request_timeout_ms()
    logger.info("Daemon starting (PID %d, version %s)", os.getpid(), __version__)
    log_json(
        logger,
        event="cocoindex_mcp_request_timeout_config",
        envVar="COCOINDEX_CODE_MCP_REQUEST_TIMEOUT_MS",
        timeoutMs=request_timeout_ms,
        minMs=1000,
        maxMs=600000,
    )

    try:
        asyncio.run(
            _async_daemon_main(
                embedder,
                settings_mtime_us,
                startup_lock_fd,
                request_timeout_ms=request_timeout_ms,
            )
        )
    finally:
        # Clean up socket first, then PID file last.
        # The PID file is the authoritative "daemon is alive" indicator, so it
        # must be the very last thing removed to avoid races where a client
        # sees the PID gone but the socket (or process) is still lingering.
        if sys.platform != "win32":
            sock = daemon_socket_path()
            try:
                Path(sock).unlink(missing_ok=True)
            except Exception:
                pass
        # Only remove the PID file if it still contains *our* PID.
        # A new daemon may have already overwritten it during a restart race.
        try:
            stored = pid_path.read_text().strip()
            if stored == str(os.getpid()):
                pid_path.unlink(missing_ok=True)
        except Exception:
            pass
        logger.info("Daemon stopped")


async def _async_daemon_main(
    embedder: Embedder,
    settings_mtime_us: int | None,
    startup_lock_fd: TextIO | None = None,
    request_timeout_ms: int | None = None,
) -> None:
    """Async main loop for the daemon."""
    start_time = time.monotonic()
    resolved_request_timeout_ms = (
        request_timeout_ms
        if request_timeout_ms is not None
        else resolve_mcp_request_timeout_ms()
    )
    registry = ProjectRegistry(embedder)
    shutdown_event = asyncio.Event()

    sock_path = daemon_socket_path()
    # Patch 8: socket is already cleared in run_daemon under the lock and the
    # sibling-check has already raised if another daemon owns the PID file, so
    # we can create the listener directly. _unlink_stale_socket remains as a
    # defensive helper used by the unit tests.
    try:
        listener = Listener(sock_path, family=_connection_family(), backlog=128)
    except BaseException:
        if startup_lock_fd is not None:
            startup_lock_fd.close()
        raise
    logger.info("Listening on %s", sock_path)

    loop = asyncio.get_event_loop()

    # Handle signals for graceful shutdown (not supported on all platforms/contexts)
    try:
        for sig in (signal.SIGTERM, signal.SIGINT):
            loop.add_signal_handler(sig, shutdown_event.set)
    except (RuntimeError, NotImplementedError):
        pass  # Not in main thread, or not supported on this platform (e.g. Windows)

    tasks: set[asyncio.Task[Any]] = set()

    async def _spawn_handler(
        conn: Connection,
        reg: ProjectRegistry,
        st: float,
        evt: asyncio.Event,
        task_set: set[asyncio.Task[Any]],
    ) -> None:
        task = asyncio.create_task(
            handle_connection(
                conn,
                reg,
                st,
                evt,
                settings_mtime_us,
                resolved_request_timeout_ms,
            )
        )
        task_set.add(task)
        task.add_done_callback(task_set.discard)

    # Run accept loop in a thread so we can shut down cleanly
    def _accept_loop() -> None:
        while not shutdown_event.is_set():
            try:
                try:
                    listener._listener._socket.settimeout(0.5)  # type: ignore[attr-defined]
                except AttributeError:
                    pass  # AF_PIPE (Windows) doesn't expose ._socket
                conn = listener.accept()
                # Schedule the handler on the event loop
                asyncio.run_coroutine_threadsafe(
                    _spawn_handler(conn, registry, start_time, shutdown_event, tasks),
                    loop,
                )
            except OSError:
                if shutdown_event.is_set():
                    break
                # Socket timeout — just retry
                continue

    accept_thread = threading.Thread(target=_accept_loop, daemon=True)
    accept_thread.start()

    try:
        await shutdown_event.wait()
    finally:
        listener.close()
        if startup_lock_fd is not None:
            startup_lock_fd.close()
        accept_thread.join(timeout=2)
        await daemon_task_registry.shutdown(timeout_seconds=10.0)
        if tasks:
            # Patch 10: bound the shutdown wait. asyncio.wait_for cancels its
            # awaited future on timeout, which propagates to the gathered tasks.
            # A stuck handler task cannot block daemon exit beyond 10 seconds.
            try:
                await asyncio.wait_for(
                    asyncio.gather(*tasks, return_exceptions=True),
                    timeout=10.0,
                )
            except asyncio.TimeoutError:
                logger.warning(
                    "shutdown timeout: handler tasks did not finish in 10s; cancelled by wait_for"
                )
        registry.close_all()
