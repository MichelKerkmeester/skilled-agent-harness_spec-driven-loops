"""MCP server for codebase indexing and querying.

Supports two modes:
1. Daemon-backed: ``create_mcp_server(client, project_root)`` — lightweight MCP
   server that delegates to the daemon via a ``DaemonClient``.
2. Legacy entry point: ``main()`` — backward-compatible ``cocoindex-code`` CLI that
   auto-creates settings from env vars and delegates to the daemon.
"""

# Modified by spec-kit-skilled-agent-orchestration: 009 packet REQ-001..006 (see ../NOTICE)
from __future__ import annotations

import asyncio
import json
import logging
import os
from pathlib import Path
from typing import TYPE_CHECKING

from mcp.server.fastmcp import FastMCP
from pydantic import BaseModel, Field

if TYPE_CHECKING:
    from .core.client import DaemonClient

from .observability.observability import (
    elapsed_ms,
    log_json,
    log_response_size,
    log_stage,
    monotonic_ms,
    new_request_id,
    resolve_mcp_request_timeout_ms,
)
from .lifecycle.daemon_task_registry import daemon_task_registry, get_mcp_threadpool
from .core.protocol import IndexingProgress
from .retrieval.search_budget import SearchBudgetExceeded, validate_search_budget

_MCP_INSTRUCTIONS = (
    "Code search and codebase understanding tools."
    "\n"
    "Use when you need to find code, understand how something works,"
    " locate implementations, or explore an unfamiliar codebase."
    "\n"
    "Provides semantic search that understands meaning --"
    " unlike grep or text matching,"
    " it finds relevant code even when exact keywords are unknown."
)
logger = logging.getLogger(__name__)


# === Pydantic Models for Tool Inputs/Outputs ===


class CodeChunkResult(BaseModel):
    """A single code chunk result."""

    file_path: str = Field(description="Relative path to the file")
    language: str = Field(description="Programming language")
    content: str = Field(description="The code content")
    start_line: int = Field(description="Starting line number (1-indexed)")
    end_line: int = Field(description="Ending line number (1-indexed)")
    score: float = Field(description="Similarity score (0-1, higher is better)")
    raw_score: float = Field(description="Raw vector similarity score before reranking")
    path_class: str = Field(description="Source path class used for bounded reranking")
    rankingSignals: list[str] = Field(
        default_factory=list,
        description="Ranking boosts or penalties applied to this result",
    )
    fts5_score: float | None = Field(default=None, description="FTS5 BM25 score when hybrid search is enabled")
    rrf_score: float | None = Field(default=None, description="RRF fused score when hybrid search is enabled")
    pre_rerank_score: float | None = Field(default=None, description="Score before cross-encoder reranking")
    reranker_score: float | None = Field(default=None, description="Raw cross-encoder reranker score")


class RetrievalDiagnosticsModel(BaseModel):
    vec_candidates_count: int = 0
    fts_candidates_count: int = 0
    overlap_count: int = 0
    post_dedup_count: int = 0
    rerank_input_count: int = 0
    rerank_output_count: int = 0
    boost_flip_count: int = 0
    reranker_fallback_used: bool = False
    reranker_fallback_reason: str = "none"


class SearchResultModel(BaseModel):
    """Result from search tool."""

    success: bool
    reqId: str | None = None
    results: list[CodeChunkResult] = Field(default_factory=list)
    total_returned: int = Field(default=0)
    offset: int = Field(default=0)
    dedupedAliases: int = Field(default=0)
    uniqueResultCount: int = Field(default=0)
    diagnostics: RetrievalDiagnosticsModel = Field(default_factory=RetrievalDiagnosticsModel)
    message: str | None = None


class RefreshIndexResultModel(BaseModel):
    """Result from explicit refresh_index tool."""

    success: bool
    reqId: str | None = None
    paths: list[str] | None = None
    message: str | None = None


class CancelIndexResultModel(BaseModel):
    """Result from index_cancel tool."""

    status: str
    reqId: str | None = None
    indexId: str | None = None
    message: str | None = None


def _run_registered_thread(
    loop: asyncio.AbstractEventLoop,
    func,
    *,
    task_id: str,
    kind: str,
    project_root: str,
):
    future = get_mcp_threadpool().submit(func)
    daemon_task_registry.add_future(
        future,
        task_id=task_id,
        kind=kind,
        project_key=project_root,
    )
    return asyncio.wrap_future(future, loop=loop)


# === Daemon-backed MCP server factory ===


def create_mcp_server(client: DaemonClient, project_root: str) -> FastMCP:
    """Create a lightweight MCP server that delegates to the daemon."""
    mcp = FastMCP("cocoindex-code", instructions=_MCP_INSTRUCTIONS)
    request_timeout_ms = resolve_mcp_request_timeout_ms()
    log_json(
        logger,
        event="cocoindex_mcp_request_timeout_config",
        envVar="COCOINDEX_CODE_MCP_REQUEST_TIMEOUT_MS",
        timeoutMs=request_timeout_ms,
        minMs=1000,
        maxMs=600000,
    )

    @mcp.tool(
        name="search",
        description=(
            "Semantic code search across the entire codebase"
            " -- finds code by meaning, not just text matching."
            " Use this instead of grep/glob when you need to find implementations,"
            " understand how features work,"
            " or locate related code without knowing exact names or keywords."
            " Accepts natural language queries"
            " (e.g., 'authentication logic', 'database connection handling')"
            " or code snippets."
            " Returns matching code chunks with file paths,"
            " line numbers, and relevance scores."
            " Start with a small limit (e.g., 5);"
            " if most results look relevant, use offset to paginate for more."
        ),
    )
    async def search(
        query: str = Field(
            description=(
                "Natural language query or code snippet to search for."
                " Examples: 'error handling middleware',"
                " 'how are users authenticated',"
                " 'database connection pool',"
                " or paste a code snippet to find similar code."
            )
        ),
        limit: int = Field(
            default=5,
            ge=1,
            le=100,
            description="Maximum number of results to return (1-100)",
        ),
        offset: int = Field(
            default=0,
            ge=0,
            description="Number of results to skip for pagination",
        ),
        refresh_index: bool = Field(
            default=False,
            description=(
                "Whether to incrementally update the index before searching."
                " Defaults to False for predictable search latency."
                " Set to True only when this search must force a refresh first."
            ),
        ),
        languages: list[str] | None = Field(
            default=None,
            description="Filter by programming language(s). Example: ['python', 'typescript']",
        ),
        paths: list[str] | None = Field(
            default=None,
            description=(
                "Filter by file path pattern(s) using GLOB wildcards (* and ?)."
                " Example: ['src/utils/*', '*.py']"
            ),
        ),
    ) -> SearchResultModel:
        """Query the codebase index via the daemon."""
        req_id = new_request_id()
        stage_start = monotonic_ms()
        languages = languages or None
        paths = paths or None
        try:
            budgeted = validate_search_budget(
                limit=limit,
                offset=offset,
                languages=languages,
                paths=paths,
            )
        except SearchBudgetExceeded as exc:
            result = SearchResultModel(success=False, reqId=req_id, message=str(exc))
            _log_json_response_size(result, req_id=req_id)
            return result
        limit = budgeted.limit
        offset = budgeted.offset
        languages = budgeted.languages
        paths = budgeted.paths
        log_stage(
            logger,
            req_id=req_id,
            stage="parse",
            duration_ms=elapsed_ms(stage_start),
        )
        loop = asyncio.get_event_loop()
        try:
            async def _run_search_request() -> SearchResultModel:
                if refresh_index:
                    refresh_start = monotonic_ms()
                    await _run_registered_thread(
                        loop,
                        lambda: client.index(project_root, req_id=req_id),
                        task_id=f"mcp-refresh-{req_id}",
                        kind="mcp-refresh-index",
                        project_root=project_root,
                    )
                    log_stage(
                        logger,
                        req_id=req_id,
                        stage="refresh_index",
                        duration_ms=elapsed_ms(refresh_start),
                    )
                resp = await _run_registered_thread(
                    loop,
                    lambda: client.search(
                        project_root=project_root,
                        query=query,
                        languages=languages,
                        paths=paths,
                        limit=limit,
                        offset=offset,
                        req_id=req_id,
                    ),
                    task_id=f"mcp-search-{req_id}",
                    kind="mcp-search",
                    project_root=project_root,
                )
                return SearchResultModel(
                    success=resp.success,
                    reqId=req_id,
                    results=[
                        CodeChunkResult(
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
                        for r in resp.results
                    ],
                    total_returned=resp.total_returned,
                    offset=resp.offset,
                    dedupedAliases=resp.dedupedAliases,
                    uniqueResultCount=resp.uniqueResultCount,
                    diagnostics=RetrievalDiagnosticsModel(**{
                        field: getattr(resp.diagnostics, field)
                        for field in RetrievalDiagnosticsModel.model_fields
                    }),
                    message=resp.message,
                )

            result = await asyncio.wait_for(
                _run_search_request(),
                timeout=request_timeout_ms / 1000,
            )
            _log_json_response_size(result, req_id=req_id)
            return result
        except asyncio.TimeoutError:
            message = f"Query timed out after {request_timeout_ms}ms (reqId={req_id})"
            log_json(
                logger,
                event="cocoindex_request_timeout",
                reqId=req_id,
                timeoutMs=request_timeout_ms,
            )
            result = SearchResultModel(success=False, reqId=req_id, message=message)
            _log_json_response_size(result, req_id=req_id)
            return result
        except Exception as e:
            result = SearchResultModel(
                success=False,
                reqId=req_id,
                message=f"Query failed: {e!s} (reqId={req_id})",
            )
            _log_json_response_size(result, req_id=req_id)
            return result
    @mcp.tool(
        name="cocoindex_refresh_index",
        description=(
            "Incrementally refresh the CocoIndex code index without performing"
            " a semantic search. Use this when the codebase changed and you want"
            " the next MCP search to read a fresher index without spending the"
            " search request's latency budget on refresh work."
        ),
    )
    async def cocoindex_refresh_index(
        paths: list[str] | None = Field(
            default=None,
            description=(
                "Optional changed-path hint for callers. The current daemon refresh"
                " path is project-wide incremental indexing, so this value is"
                " accepted for the MCP contract but does not limit refresh scope."
            ),
        ),
    ) -> RefreshIndexResultModel:
        """Refresh the codebase index via the daemon without searching."""
        req_id = new_request_id()
        stage_start = monotonic_ms()
        paths = paths or None
        log_stage(
            logger,
            req_id=req_id,
            stage="parse",
            duration_ms=elapsed_ms(stage_start),
        )
        loop = asyncio.get_event_loop()
        try:
            async def _run_refresh_request() -> RefreshIndexResultModel:
                refresh_start = monotonic_ms()
                resp = await _run_registered_thread(
                    loop,
                    lambda: client.index(project_root, req_id=req_id),
                    task_id=f"mcp-refresh-{req_id}",
                    kind="mcp-refresh-index",
                    project_root=project_root,
                )
                log_stage(
                    logger,
                    req_id=req_id,
                    stage="refresh_index",
                    duration_ms=elapsed_ms(refresh_start),
                )
                message = resp.message or "Index refresh complete"
                if paths:
                    message = (
                        f"{message}; paths were accepted as hints,"
                        " refresh remains project-wide incremental"
                    )
                return RefreshIndexResultModel(
                    success=resp.success,
                    reqId=req_id,
                    paths=paths,
                    message=message,
                )

            result = await asyncio.wait_for(
                _run_refresh_request(),
                timeout=request_timeout_ms / 1000,
            )
            _log_json_response_size(result, req_id=req_id)
            return result
        except asyncio.TimeoutError:
            message = f"Refresh timed out after {request_timeout_ms}ms (reqId={req_id})"
            log_json(
                logger,
                event="cocoindex_request_timeout",
                reqId=req_id,
                timeoutMs=request_timeout_ms,
            )
            result = RefreshIndexResultModel(success=False, reqId=req_id, paths=paths, message=message)
            _log_json_response_size(result, req_id=req_id)
            return result
        except Exception as e:
            result = RefreshIndexResultModel(
                success=False,
                reqId=req_id,
                paths=paths,
                message=f"Refresh failed: {e!s} (reqId={req_id})",
            )
            _log_json_response_size(result, req_id=req_id)
            return result

    @mcp.tool(
        name="index_cancel",
        description=(
            "Cancel a specific CocoIndex indexing request by reqId or indexId"
            " without stopping the daemon."
        ),
    )
    async def index_cancel(
        reqId: str | None = Field(default=None, description="Client request id to cancel"),
        indexId: str | None = Field(default=None, description="Daemon index id to cancel"),
    ) -> CancelIndexResultModel:
        """Cancel a daemon indexing request via exact identity."""
        if not reqId and not indexId:
            return CancelIndexResultModel(
                status="not-found",
                reqId=reqId,
                indexId=indexId,
                message="index_cancel requires reqId or indexId",
            )
        loop = asyncio.get_event_loop()
        try:
            resp = await _run_registered_thread(
                loop,
                lambda: client.index_cancel(req_id=reqId, index_id=indexId),
                task_id=f"mcp-index-cancel-{reqId or indexId}",
                kind="mcp-index-cancel",
                project_root=project_root,
            )
            return CancelIndexResultModel(
                status=resp.status,
                reqId=resp.reqId,
                indexId=resp.indexId,
            )
        except Exception as e:
            return CancelIndexResultModel(
                status="not-found",
                reqId=reqId,
                indexId=indexId,
                message=f"Cancel failed: {e!s}",
            )

    return mcp


def _log_json_response_size(result: BaseModel, *, req_id: str) -> None:
    stage_start = monotonic_ms()
    payload = result.model_dump_json().encode("utf-8")
    log_stage(
        logger,
        req_id=req_id,
        stage="response_serialization",
        duration_ms=elapsed_ms(stage_start),
        result_count=getattr(result, "total_returned", 0),
    )
    log_response_size(
        logger,
        req_id=req_id,
        byte_count=len(payload),
        stage="json_response",
    )


# Keep the old `mcp` global for backward compatibility in __init__.py
mcp: FastMCP | None = None


# === Backward-compatible entry point ===


def _convert_embedding_model(env_model: str) -> tuple[str, str]:
    """Convert old COCOINDEX_CODE_EMBEDDING_MODEL to (provider, model)."""
    sbert_prefix = "sbert/"
    if env_model.startswith(sbert_prefix):
        return "sentence-transformers", env_model[len(sbert_prefix) :]
    return "litellm", env_model


def main() -> None:
    """Backward-compatible entry point for ``cocoindex-code`` CLI.

    Auto-detects/creates settings from env vars, then delegates to daemon.
    """
    import argparse

    from .core.client import ensure_daemon
    from .config.settings import (
        EmbeddingSettings,
        LanguageOverride,
        default_project_settings,
        default_user_settings,
        find_legacy_project_root,
        find_project_root,
        project_settings_path,
        save_project_settings,
        save_user_settings,
        user_settings_path,
    )

    parser = argparse.ArgumentParser(
        prog="cocoindex-code",
        description="MCP server for codebase indexing and querying.",
    )
    subparsers = parser.add_subparsers(dest="command")
    subparsers.add_parser("serve", help="Run the MCP server (default)")
    subparsers.add_parser("index", help="Build/refresh the index and report stats")
    args = parser.parse_args()

    # --- Discover project root ---
    cwd = Path.cwd()
    project_root = find_project_root(cwd)

    if project_root is None:
        # Try env var
        env_root = os.environ.get("COCOINDEX_CODE_ROOT_PATH")
        if env_root:
            project_root = Path(env_root).resolve()
        else:
            # Use marker-based discovery
            legacy_root = find_legacy_project_root(cwd)
            project_root = legacy_root if legacy_root is not None else cwd

    # --- Auto-create project settings if needed ---
    proj_settings_file = project_settings_path(project_root)
    if not proj_settings_file.is_file():
        ps = default_project_settings()

        # Migrate COCOINDEX_CODE_EXCLUDED_PATTERNS
        raw_excluded = os.environ.get("COCOINDEX_CODE_EXCLUDED_PATTERNS", "").strip()
        if raw_excluded:
            try:
                extra_excluded = json.loads(raw_excluded)
                if isinstance(extra_excluded, list):
                    ps.exclude_patterns.extend(
                        p.strip() for p in extra_excluded if isinstance(p, str) and p.strip()
                    )
            except json.JSONDecodeError:
                pass

        # Migrate COCOINDEX_CODE_EXTRA_EXTENSIONS
        raw_extra = os.environ.get("COCOINDEX_CODE_EXTRA_EXTENSIONS", "")
        for token in raw_extra.split(","):
            token = token.strip()
            if not token:
                continue
            if ":" in token:
                ext, lang = token.split(":", 1)
                ext = ext.strip()
                lang = lang.strip()
                ps.include_patterns.append(f"**/*.{ext}")
                if lang:
                    ps.language_overrides.append(LanguageOverride(ext=ext, lang=lang))
            else:
                ps.include_patterns.append(f"**/*.{token}")

        save_project_settings(project_root, ps)

    # --- Auto-create user settings if needed ---
    user_file = user_settings_path()
    if not user_file.is_file():
        us = default_user_settings()

        # Migrate COCOINDEX_CODE_EMBEDDING_MODEL
        env_model = os.environ.get("COCOINDEX_CODE_EMBEDDING_MODEL", "")
        if env_model:
            provider, model = _convert_embedding_model(env_model)
            us.embedding = EmbeddingSettings(provider=provider, model=model)

        # Migrate COCOINDEX_CODE_DEVICE
        env_device = os.environ.get("COCOINDEX_CODE_DEVICE")
        if env_device:
            us.embedding.device = env_device

        save_user_settings(us)

    # --- Delegate to daemon ---
    if args.command == "index":
        import sys

        from rich.console import Console
        from rich.live import Live
        from rich.spinner import Spinner

        from .cli import _format_progress

        client = ensure_daemon()
        err_console = Console(stderr=True)
        last_progress_line: str | None = None

        with Live(Spinner("dots", "Indexing..."), console=err_console, transient=True) as live:

            def _on_waiting() -> None:
                live.update(
                    Spinner(
                        "dots",
                        "Another indexing is ongoing, waiting for it to finish...",
                    )
                )

            def _on_progress(progress: IndexingProgress) -> None:
                nonlocal last_progress_line
                last_progress_line = f"Indexing: {_format_progress(progress)}"
                live.update(Spinner("dots", last_progress_line))

            resp = client.index(str(project_root), on_progress=_on_progress, on_waiting=_on_waiting)

        if last_progress_line is not None:
            print(last_progress_line, file=sys.stderr)

        if resp.success:
            status = client.project_status(str(project_root))
            print("\nIndex stats:")
            print(f"  Chunks: {status.total_chunks}")
            print(f"  Files:  {status.total_files}")
            if status.languages:
                print("  Languages:")
                for lang, count in sorted(status.languages.items(), key=lambda x: -x[1]):
                    print(f"    {lang}: {count} chunks")
        else:
            print(f"Indexing failed: {resp.message}")
        client.close()
    else:
        # Default: run MCP server
        client = ensure_daemon()
        mcp_server = create_mcp_server(client, str(project_root))

        async def _serve() -> None:
            req_id = new_request_id()
            task = asyncio.create_task(_bg_index(client, str(project_root)))
            daemon_task_registry.add_task(
                task,
                task_id=f"mcp-bg-index-task-{req_id}",
                kind="mcp-bg-index-task",
                project_key=str(project_root),
            )
            try:
                await mcp_server.run_stdio_async()
            finally:
                await daemon_task_registry.shutdown(timeout_seconds=10.0)

        asyncio.run(_serve())


async def _bg_index(client: DaemonClient, project_root: str) -> None:
    """Index in background."""
    loop = asyncio.get_event_loop()
    req_id = new_request_id()
    try:
        await _run_registered_thread(
            loop,
            lambda: client.index(project_root, req_id=req_id),
            task_id=f"mcp-bg-index-{req_id}",
            kind="mcp-bg-index",
            project_root=project_root,
        )
    except Exception:
        logger.exception("background MCP index failed")
