"""CLI entry point for cocoindex-code (ccc command)."""

# Modified by spec-kit-skilled-agent-orchestration: 009 packet REQ-001..006 (see ../NOTICE)
# Modified by 014-local-embeddings-setup-a / 003-mcp-config-rollout:
# load project-local .env.local / .env at startup so override env vars
# (COCOINDEX_CODE_EMBEDDING_MODEL etc.) take effect without committing them to
# shared MCP runtime configs. Both files are gitignored by default.
from __future__ import annotations

import importlib.metadata as _importlib_metadata
import json as _json
import os as _os
import re as _re
import shutil as _shutil
import subprocess as _subprocess
import sys as _sys
import urllib.error as _urllib_error
import urllib.request as _urllib_request
from dataclasses import asdict as _asdict
from dataclasses import dataclass as _dataclass
from pathlib import Path
from typing import TYPE_CHECKING

# Project-local env override loader. Existing process.env wins (override=False).
# Search upward from CWD for .env.local first (Setup A overrides), then .env (project defaults).
try:
    from dotenv import load_dotenv as _load_dotenv
    _cwd = Path(_os.getcwd()).resolve()
    for _ancestor in (_cwd, *_cwd.parents):
        _local = _ancestor / ".env.local"
        _shared = _ancestor / ".env"
        if _local.exists():
            _load_dotenv(_local, override=False)
        if _shared.exists():
            _load_dotenv(_shared, override=False)
        # Stop at first ancestor that has either file (or at filesystem root).
        if _local.exists() or _shared.exists():
            break
except ImportError:
    # python-dotenv not installed in this venv — skip; env vars must be set externally.
    pass

import typer as _typer

if TYPE_CHECKING:
    from .client import DaemonClient

from .protocol import IndexingProgress, ProjectStatusResponse, SearchResponse
from .search_budget import SearchBudgetExceeded, validate_search_budget
from .settings import (
    default_project_settings,
    default_user_settings,
    find_parent_with_marker,
    find_project_root,
    save_project_settings,
    save_user_settings,
    user_settings_path,
)
from ._version import __version__

app = _typer.Typer(
    name="ccc",
    help="CocoIndex Code — index and search codebases.",
    no_args_is_help=True,
)

daemon_app = _typer.Typer(name="daemon", help="Manage the daemon process.")
app.add_typer(daemon_app, name="daemon")


def _version_callback(value: bool) -> None:
    if value:
        _typer.echo(__version__)
        raise _typer.Exit()


@app.callback()
def cli_callback(
    version: bool = _typer.Option(
        False,
        "--version",
        help="Show the ccc version and exit.",
        callback=_version_callback,
        is_eager=True,
    ),
) -> None:
    del version


# ---------------------------------------------------------------------------
# Shared CLI helpers
# ---------------------------------------------------------------------------


def require_project_root() -> Path:
    """Find the project root by walking up from CWD.

    Exits with code 1 if not found.
    """
    root = find_project_root(Path.cwd())
    if root is None:
        _typer.echo(
            "Error: Not in an initialized project directory.\n"
            "Run `ccc init` in your project root to get started.",
            err=True,
        )
        raise _typer.Exit(code=1)
    return root


def require_daemon_for_project() -> tuple[DaemonClient, str]:
    """Resolve project root, then connect to daemon (auto-starting if needed).

    Returns ``(client, project_root_str)``. Exits on failure.
    """
    from .client import ensure_daemon

    project_root = require_project_root()
    try:
        client = ensure_daemon()
    except Exception as e:
        _typer.echo(f"Error: Failed to connect to daemon: {e}", err=True)
        raise _typer.Exit(code=1)
    return client, str(project_root)


def resolve_default_path(project_root: Path) -> str | None:
    """Compute default ``--path`` filter from CWD relative to project root."""
    cwd = Path.cwd().resolve()
    try:
        rel = cwd.relative_to(project_root)
    except ValueError:
        return None
    if rel == Path("."):
        return None
    return f"{rel.as_posix()}/*"


def _format_progress(progress: IndexingProgress) -> str:
    """Format an IndexingProgress snapshot as a human-readable string."""
    return (
        f"{progress.num_execution_starts} files listed"
        f" | {progress.num_adds} added, {progress.num_deletes} deleted,"
        f" {progress.num_reprocesses} reprocessed,"
        f" {progress.num_unchanged} unchanged,"
        f" error: {progress.num_errors}"
    )


def print_project_header(project_root: str) -> None:
    """Print the project root directory."""
    _typer.echo(f"Project: {project_root}")


def print_index_stats(status: ProjectStatusResponse) -> None:
    """Print formatted index statistics."""
    if status.progress is not None:
        _typer.echo(f"Indexing in progress: {_format_progress(status.progress)}")
    if not status.index_exists:
        _typer.echo("\nIndex not created yet. Run `ccc index` to build the index.")
        return
    _typer.echo("\nIndex stats:")
    _typer.echo(f"  Chunks: {status.total_chunks}")
    _typer.echo(f"  Files:  {status.total_files}")
    if status.languages:
        _typer.echo("  Languages:")
        for lang, count in sorted(status.languages.items(), key=lambda x: -x[1]):
            _typer.echo(f"    {lang}: {count} chunks")
    print_fingerprint(status)


def print_fingerprint(status: ProjectStatusResponse) -> None:
    fp = status.fingerprint
    if fp.effective_config_hash is None:
        return
    _typer.echo("\nRetrieval fingerprint:")
    _typer.echo(f"  Embedder: {fp.embedder_name} ({fp.embedder_provider}, dim={fp.embedder_dim})")
    _typer.echo(f"  Query prompt: {fp.query_prompt_name}")
    _typer.echo(f"  Document prompt: {fp.document_prompt_name}")
    _typer.echo(
        f"  Reranker: {fp.reranker_name} "
        f"(enabled={fp.reranker_enabled}, license={fp.reranker_license})"
    )
    _typer.echo(
        f"  Chunking: {fp.chunking_policy} "
        f"(size={fp.chunk_size}, overlap={fp.chunk_overlap})"
    )
    _typer.echo(
        f"  RRF: K={fp.rrf_K}, V={fp.rrf_V}, F={fp.rrf_F}; "
        f"boost_path={fp.hybrid_boost_path}, boost_canonical={fp.hybrid_boost_canonical}"
    )
    _typer.echo(f"  Corpus: {fp.corpus_root}")
    _typer.echo(f"  Hash: {fp.effective_config_hash}")
    if fp.indexed_effective_config_hash:
        _typer.echo(f"  Indexed hash: {fp.indexed_effective_config_hash}")
    if fp.fingerprint_warning:
        _typer.echo(f"  Warning: {fp.fingerprint_warning}")


# ---------------------------------------------------------------------------
# Doctor helpers
# ---------------------------------------------------------------------------

_CHECK_STATUS_RC = {"PASS": 0, "INFO": 0, "WARN": 1, "FAIL": 2}
_REINDEX_SECONDS_PER_CHUNK = (25 * 60) / 80_000


@_dataclass(frozen=True)
class DoctorCheck:
    id: str
    name: str
    status: str
    message: str
    remediation: str
    details: dict[str, object]


def estimate_reindex_seconds(chunk_count: int, embedder: str) -> int:
    """Estimate model-swap reindex time from the 80k chunks ~= 25 min benchmark."""
    del embedder
    return max(0, round(chunk_count * _REINDEX_SECONDS_PER_CHUNK))


def _format_duration(seconds: int) -> str:
    if seconds < 60:
        return f"{seconds}s"
    minutes = seconds / 60
    if minutes < 60:
        return f"{minutes:.1f} min"
    return f"{minutes / 60:.1f} h"


def _python_from_console_script(script_path: str | None) -> str:
    if not script_path:
        return _sys.executable
    try:
        first_line = Path(script_path).read_text(errors="ignore").splitlines()[0]
    except (OSError, IndexError):
        return _sys.executable
    if not first_line.startswith("#!"):
        return _sys.executable
    shebang = first_line[2:].strip()
    if shebang.startswith("/usr/bin/env "):
        parts = shebang.split()
        if len(parts) >= 2:
            resolved = _shutil.which(parts[1])
            return resolved or _sys.executable
    return shebang.split()[0] if shebang else _sys.executable


def _python_imports_tree_sitter(python_executable: str) -> tuple[bool, str]:
    try:
        proc = _subprocess.run(
            [python_executable, "-c", "import tree_sitter"],
            capture_output=True,
            check=False,
            text=True,
            timeout=10,
        )
    except (OSError, _subprocess.TimeoutExpired) as exc:
        return False, str(exc)
    if proc.returncode == 0:
        return True, "tree_sitter import succeeded"
    return False, (proc.stderr or proc.stdout or "tree_sitter import failed").strip()


def _check_cli_parity() -> DoctorCheck:
    ccc_path = _shutil.which("ccc")
    current_ok, current_msg = _python_imports_tree_sitter(_sys.executable)
    if ccc_path is None:
        return DoctorCheck(
            id="CHECK-1",
            name="Global-vs-venv CLI parity",
            status="INFO",
            message="No ccc executable found on PATH; current Python tree_sitter import checked only.",
            remediation="Install the project venv console script or invoke `.venv/bin/ccc` directly.",
            details={"current_python": _sys.executable, "current_tree_sitter": current_ok},
        )

    ccc_python = _python_from_console_script(ccc_path)
    ccc_ok, ccc_msg = _python_imports_tree_sitter(ccc_python)
    if current_ok and ccc_ok:
        status = "PASS"
        message = "PATH ccc and current Python can import tree_sitter."
        remediation = "No action needed."
    else:
        status = "FAIL"
        message = "ccc resolves to a Python environment that cannot import tree_sitter."
        remediation = "Use `.venv/bin/ccc`, reinstall the console script, or put the venv bin first on PATH."
    return DoctorCheck(
        id="CHECK-1",
        name="Global-vs-venv CLI parity",
        status=status,
        message=message,
        remediation=remediation,
        details={
            "which_ccc": ccc_path,
            "ccc_python": ccc_python,
            "ccc_tree_sitter": ccc_ok,
            "ccc_tree_sitter_message": ccc_msg,
            "current_python": _sys.executable,
            "current_tree_sitter": current_ok,
            "current_tree_sitter_message": current_msg,
        },
    )


def _version_tuple(version: str) -> tuple[int, int, int]:
    nums = [int(part) for part in _re.findall(r"\d+", version)[:3]]
    while len(nums) < 3:
        nums.append(0)
    return tuple(nums[:3])  # type: ignore[return-value]


def _latest_pypi_version(package_name: str) -> str | None:
    url = f"https://pypi.org/pypi/{package_name}/json"
    try:
        with _urllib_request.urlopen(url, timeout=5) as response:
            payload = _json.load(response)
    except (OSError, _urllib_error.URLError, TimeoutError, _json.JSONDecodeError):
        return None
    version = payload.get("info", {}).get("version")
    return version if isinstance(version, str) else None


def _check_sentence_transformers_version() -> DoctorCheck:
    try:
        current = _importlib_metadata.version("sentence-transformers")
    except _importlib_metadata.PackageNotFoundError:
        return DoctorCheck(
            id="CHECK-2",
            name="Sentence-transformers freshness",
            status="INFO",
            message="sentence-transformers is not installed in this environment.",
            remediation="Install the local extra if you need on-device embedding checks.",
            details={},
        )
    latest = _latest_pypi_version("sentence-transformers")
    if latest is None:
        return DoctorCheck(
            id="CHECK-2",
            name="Sentence-transformers freshness",
            status="INFO",
            message=f"Installed sentence-transformers {current}; PyPI latest was unavailable.",
            remediation="Re-run with network access to compare against PyPI.",
            details={"installed": current},
        )

    current_v = _version_tuple(current)
    latest_v = _version_tuple(latest)
    behind = latest_v[0] > current_v[0] or (
        latest_v[0] == current_v[0] and latest_v[1] - current_v[1] > 1
    )
    return DoctorCheck(
        id="CHECK-2",
        name="Sentence-transformers freshness",
        status="WARN" if behind else "PASS",
        message=(
            f"sentence-transformers {current} is more than one minor behind latest {latest}."
            if behind
            else f"sentence-transformers {current} is within one minor of latest {latest}."
        ),
        remediation="Upgrade and re-run the retrieval fixture before changing production defaults."
        if behind
        else "No action needed.",
        details={"installed": current, "latest": latest},
    )


def _active_models_from_env() -> tuple[str, str, bool, bool]:
    from .registered_embedders import DEFAULT_EMBEDDER_NAME, DEFAULT_RERANKER_NAME

    embedder = _os.environ.get("COCOINDEX_CODE_EMBEDDING_MODEL", DEFAULT_EMBEDDER_NAME).strip()
    reranker = _os.environ.get("COCOINDEX_RERANK_MODEL", DEFAULT_RERANKER_NAME).strip()
    rerank_enabled = _os.environ.get("COCOINDEX_RERANK", "true").strip().lower() not in {
        "0",
        "false",
        "no",
        "off",
    }
    commercial_profile = _os.environ.get("COCOINDEX_COMMERCIAL_SAFE_PROFILE", "").strip().lower() in {
        "1",
        "true",
        "yes",
        "on",
    }
    return embedder, reranker, rerank_enabled, commercial_profile


def _license_check(
    *,
    check_id: str,
    name: str,
    model_kind: str,
    model_name: str,
    license_name: str | None,
    commercial_safe: bool | None,
    commercial_profile: bool,
    alternatives: list[str],
) -> DoctorCheck:
    if license_name is None or commercial_safe is None:
        return DoctorCheck(
            id=check_id,
            name=name,
            status="WARN",
            message=f"Active {model_kind} {model_name} is not in the license registry.",
            remediation="Add the model to the registry with license metadata before relying on it.",
            details={"model": model_name},
        )
    if commercial_safe:
        return DoctorCheck(
            id=check_id,
            name=name,
            status="PASS",
            message=f"Active {model_kind} {model_name} is commercial-safe ({license_name}).",
            remediation="No action needed.",
            details={"model": model_name, "license": license_name, "commercial_safe": True},
        )
    status = "FAIL" if commercial_profile else "WARN"
    return DoctorCheck(
        id=check_id,
        name=name,
        status=status,
        message=f"Active {model_kind} {model_name} uses non-commercial license {license_name}.",
        remediation=(
            "Commercial-safe profile is enabled; switch to "
            f"{', '.join(alternatives) or 'a commercial-safe registered model'}."
        )
        if commercial_profile
        else "For commercial use, switch to a commercial-safe registered alternative.",
        details={
            "model": model_name,
            "license": license_name,
            "commercial_safe": False,
            "alternatives": alternatives,
        },
    )


def _check_active_embedder_license(embedder: str, commercial_profile: bool) -> DoctorCheck:
    from .registered_embedders import commercial_safe_embedder_alternatives, get_embedder_metadata

    metadata = get_embedder_metadata(embedder)
    return _license_check(
        check_id="CHECK-3",
        name="Active embedder license",
        model_kind="embedder",
        model_name=embedder,
        license_name=metadata.license if metadata is not None else None,
        commercial_safe=metadata.commercial_safe if metadata is not None else None,
        commercial_profile=commercial_profile,
        alternatives=commercial_safe_embedder_alternatives(),
    )


def _check_active_reranker_license(
    reranker: str,
    *,
    rerank_enabled: bool,
    commercial_profile: bool,
) -> DoctorCheck:
    from .registered_embedders import commercial_safe_reranker_alternatives, get_reranker_metadata

    if not rerank_enabled:
        return DoctorCheck(
            id="CHECK-4",
            name="Active reranker license",
            status="INFO",
            message="Rerank is disabled; no active reranker license to evaluate.",
            remediation="No action needed.",
            details={"rerank_enabled": False},
        )
    metadata = get_reranker_metadata(reranker)
    check = _license_check(
        check_id="CHECK-4",
        name="Active reranker license",
        model_kind="reranker",
        model_name=reranker,
        license_name=metadata.license if metadata is not None else None,
        commercial_safe=metadata.commercial_safe if metadata is not None else None,
        commercial_profile=commercial_profile,
        alternatives=commercial_safe_reranker_alternatives(),
    )
    if reranker.startswith("jinaai/jina-reranker-v3") and check.status in {"WARN", "FAIL"}:
        return DoctorCheck(
            **{
                **_asdict(check),
                "message": check.message
                + " jinaai/jina-reranker-v3 is CC BY-NC 4.0; commercial/on-prem use needs a different model or license.",
            }
        )
    return check


def _project_status_if_available() -> tuple[ProjectStatusResponse | None, str | None, str | None]:
    project_root = find_project_root(Path.cwd())
    if project_root is None:
        return None, None, "Not in an initialized project directory."
    try:
        from .client import ensure_daemon

        client = ensure_daemon()
        return client.project_status(str(project_root)), str(project_root), None
    except Exception as exc:
        return None, str(project_root), str(exc)


def _check_fingerprint(status: ProjectStatusResponse | None, project_root: str | None, error: str | None) -> DoctorCheck:
    if status is None:
        return DoctorCheck(
            id="CHECK-5",
            name="Index fingerprint vs daemon config",
            status="INFO",
            message=f"Fingerprint unavailable: {error or 'project status unavailable'}.",
            remediation="Run `ccc status` after daemon startup to inspect the fingerprint.",
            details={"project_root": project_root},
        )
    fp = status.fingerprint
    if fp.effective_config_hash is None:
        return DoctorCheck(
            id="CHECK-5",
            name="Index fingerprint vs daemon config",
            status="INFO",
            message="Daemon status does not expose a retrieval fingerprint.",
            remediation="Reindex with the 023C fingerprint surface available.",
            details={"project_root": project_root},
        )
    mismatch = fp.fingerprint_warning == "INDEX_FINGERPRINT_MISMATCH"
    return DoctorCheck(
        id="CHECK-5",
        name="Index fingerprint vs daemon config",
        status="WARN" if mismatch else "PASS",
        message="Indexed fingerprint differs from active daemon config." if mismatch else "Index fingerprint matches active daemon config.",
        remediation="Run `ccc reset && ccc index`; keep the previous index until the new one validates."
        if mismatch
        else "No action needed.",
        details={
            "effective_config_hash": fp.effective_config_hash,
            "indexed_effective_config_hash": fp.indexed_effective_config_hash,
            "fingerprint_warning": fp.fingerprint_warning,
        },
    )


def _check_reindex_cost(
    status: ProjectStatusResponse | None,
    project_root: str | None,
    embedder: str,
) -> DoctorCheck:
    chunk_count = status.total_chunks if status is not None else None
    if chunk_count is None and project_root is not None:
        from .observability import read_index_meta

        meta = read_index_meta(Path(project_root))
        if meta is not None and isinstance(meta.get("chunk_count"), int):
            chunk_count = meta["chunk_count"]
    if chunk_count is None:
        return DoctorCheck(
            id="CHECK-6",
            name="Model swap reindex cost",
            status="INFO",
            message="Chunk count unavailable; cannot estimate model-swap reindex cost.",
            remediation="Run `ccc index` or `ccc status` first, then re-run doctor.",
            details={"project_root": project_root},
        )
    seconds = estimate_reindex_seconds(chunk_count, embedder)
    return DoctorCheck(
        id="CHECK-6",
        name="Model swap reindex cost",
        status="PASS",
        message=f"Reindex estimate for {chunk_count} chunks is approximately {_format_duration(seconds)}.",
        remediation="Before swapping models, keep the old index until the new fingerprint validates.",
        details={"chunk_count": chunk_count, "estimated_seconds": seconds, "embedder": embedder},
    )


def _run_doctor_checks() -> list[DoctorCheck]:
    embedder, reranker, rerank_enabled, commercial_profile = _active_models_from_env()
    status, project_root, status_error = _project_status_if_available()
    return [
        _check_cli_parity(),
        _check_sentence_transformers_version(),
        _check_active_embedder_license(embedder, commercial_profile),
        _check_active_reranker_license(
            reranker,
            rerank_enabled=rerank_enabled,
            commercial_profile=commercial_profile,
        ),
        _check_fingerprint(status, project_root, status_error),
        _check_reindex_cost(status, project_root, embedder),
    ]


def _doctor_summary(checks: list[DoctorCheck]) -> dict[str, int]:
    summary = {"PASS": 0, "INFO": 0, "WARN": 0, "FAIL": 0}
    for check in checks:
        summary[check.status] += 1
    return summary


def _doctor_exit_code(checks: list[DoctorCheck]) -> int:
    return max(_CHECK_STATUS_RC[check.status] for check in checks)


def print_search_results(response: SearchResponse) -> None:
    """Print formatted search results."""
    if not response.success:
        _typer.echo(f"Search failed: {response.message}", err=True)
        return

    if not response.results:
        _typer.echo("No results found.")
        return

    _typer.echo(
        f"dedupedAliases: {response.dedupedAliases} | "
        f"uniqueResultCount: {response.uniqueResultCount}"
    )

    for i, r in enumerate(response.results, 1):
        _typer.echo(
            f"\n--- Result {i} (score: {r.score:.3f}, raw_score: {r.raw_score:.3f}) ---"
        )
        _typer.echo(
            f"File: {r.file_path}:{r.start_line}-{r.end_line} "
            f"[{r.language}, {r.path_class}]"
        )
        if r.rankingSignals:
            _typer.echo(f"rankingSignals: {', '.join(r.rankingSignals)}")
        if r.rrf_score is not None or r.fts5_score is not None:
            _typer.echo(f"rrf_score: {r.rrf_score} | fts5_score: {r.fts5_score}")
        if r.reranker_score is not None or r.pre_rerank_score is not None:
            _typer.echo(
                f"reranker_score: {r.reranker_score} | "
                f"pre_rerank_score: {r.pre_rerank_score}"
            )
        _typer.echo(r.content)


def _run_index_with_progress(client: DaemonClient, project_root: str) -> None:
    """Run indexing with streaming progress display. Exits on failure."""
    from rich.console import Console as _Console
    from rich.live import Live as _Live
    from rich.spinner import Spinner as _Spinner

    err_console = _Console(stderr=True)
    last_progress_line: str | None = None

    with _Live(_Spinner("dots", "Indexing..."), console=err_console, transient=True) as live:

        def _on_waiting() -> None:
            live.update(
                _Spinner(
                    "dots",
                    "Another indexing is ongoing, waiting for it to finish...",
                )
            )

        def _on_progress(progress: IndexingProgress) -> None:
            nonlocal last_progress_line
            last_progress_line = f"Indexing: {_format_progress(progress)}"
            live.update(_Spinner("dots", last_progress_line))

        try:
            resp = client.index(project_root, on_progress=_on_progress, on_waiting=_on_waiting)
        except RuntimeError as e:
            live.stop()
            _typer.echo(f"Indexing failed: {e}", err=True)
            raise _typer.Exit(code=1)

    # Print the final progress line so it remains visible after the spinner clears
    if last_progress_line is not None:
        _typer.echo(last_progress_line, err=True)

    if not resp.success:
        _typer.echo(f"Indexing failed: {resp.message}", err=True)
        raise _typer.Exit(code=1)


def _search_with_wait_spinner(
    client: DaemonClient,
    project_root: str,
    query: str,
    languages: list[str] | None = None,
    paths: list[str] | None = None,
    limit: int = 10,
    offset: int = 0,
) -> SearchResponse:
    """Run search, showing a spinner if waiting for load-time indexing."""
    from rich.console import Console as _Console
    from rich.live import Live as _Live
    from rich.spinner import Spinner as _Spinner

    err_console = _Console(stderr=True)

    with _Live(_Spinner("dots", "Searching..."), console=err_console, transient=True) as live:

        def _on_waiting() -> None:
            live.update(
                _Spinner("dots", "Waiting for indexing to complete..."),
                refresh=True,
            )

        resp = client.search(
            project_root=project_root,
            query=query,
            languages=languages,
            paths=paths,
            limit=limit,
            offset=offset,
            on_waiting=_on_waiting,
        )

    return resp


_GITIGNORE_COMMENT = "# CocoIndex Code (ccc)"
_GITIGNORE_ENTRY = "/.cocoindex_code/"


def add_to_gitignore(project_root: Path) -> None:
    """Add ``/.cocoindex_code/`` to ``.gitignore`` if ``.git`` exists.

    Creates ``.gitignore`` if it doesn't exist.  Skips if the entry is already
    present.
    """
    if not (project_root / ".git").is_dir():
        return

    gitignore = project_root / ".gitignore"
    if gitignore.is_file():
        content = gitignore.read_text()
        if _GITIGNORE_ENTRY in content.splitlines():
            return  # already present
        # Ensure a trailing newline before appending
        if content and not content.endswith("\n"):
            content += "\n"
        content += f"{_GITIGNORE_COMMENT}\n{_GITIGNORE_ENTRY}\n"
        gitignore.write_text(content)
    else:
        gitignore.write_text(f"{_GITIGNORE_COMMENT}\n{_GITIGNORE_ENTRY}\n")


def remove_from_gitignore(project_root: Path) -> None:
    """Remove ``/.cocoindex_code/`` entry and its comment from ``.gitignore``."""
    gitignore = project_root / ".gitignore"
    if not gitignore.is_file():
        return

    lines = gitignore.read_text().splitlines(keepends=True)
    new_lines: list[str] = []
    i = 0
    while i < len(lines):
        stripped = lines[i].rstrip("\n\r")
        if stripped == _GITIGNORE_ENTRY:
            # Skip this line; also remove preceding comment if it matches
            if new_lines and new_lines[-1].rstrip("\n\r") == _GITIGNORE_COMMENT:
                new_lines.pop()
            i += 1
            continue
        new_lines.append(lines[i])
        i += 1
    gitignore.write_text("".join(new_lines))


# ---------------------------------------------------------------------------
# Commands
# ---------------------------------------------------------------------------


@app.command()
def init(
    force: bool = _typer.Option(False, "-f", "--force", help="Skip parent directory warning"),
) -> None:
    """Initialize a project for cocoindex-code."""
    from .settings import project_settings_path as _project_settings_path

    cwd = Path.cwd().resolve()
    settings_file = _project_settings_path(cwd)

    # Check if already initialized
    if settings_file.is_file():
        _typer.echo("Project already initialized.")
        return

    # Check parent directories for markers
    if not force:
        parent = find_parent_with_marker(cwd)
        if parent is not None and parent != cwd:
            _typer.echo(
                f"Warning: A parent directory has a project marker: {parent}\n"
                "You might want to run `ccc init` there instead.\n"
                "Use `ccc init -f` to initialize here anyway."
            )
            raise _typer.Exit(code=1)

    # Create user settings if missing
    user_path = user_settings_path()
    if not user_path.is_file():
        save_user_settings(default_user_settings())
        _typer.echo(f"Created user settings: {user_path}")

    # Create project settings
    save_project_settings(cwd, default_project_settings())
    _typer.echo(f"Created project settings: {settings_file}")

    # Add to .gitignore
    add_to_gitignore(cwd)

    _typer.echo("You can edit the settings files to customize indexing behavior.")
    _typer.echo("Run `ccc index` to build the index.")


@app.command()
def index() -> None:
    """Create/update index for the codebase."""
    client, project_root = require_daemon_for_project()
    print_project_header(project_root)

    _run_index_with_progress(client, project_root)

    status = client.project_status(project_root)
    print_index_stats(status)


@app.command()
def doctor(
    json_output: bool = _typer.Option(False, "--json", help="Emit machine-readable JSON report"),
) -> None:
    """Run operator health checks for CLI parity, licenses, fingerprint, and reindex cost."""
    checks = _run_doctor_checks()
    summary = _doctor_summary(checks)
    exit_code = _doctor_exit_code(checks)
    if json_output:
        _typer.echo(
            _json.dumps(
                {
                    "checks": [_asdict(check) for check in checks],
                    "summary": {**summary, "rc": exit_code, "total": len(checks)},
                },
                indent=2,
                sort_keys=True,
            )
        )
    else:
        _typer.echo("CocoIndex doctor")
        for check in checks:
            _typer.echo(f"{check.id} {check.status} {check.name}: {check.message}")
            _typer.echo(f"  Remediation: {check.remediation}")
        _typer.echo(
            "Summary: "
            f"PASS={summary['PASS']} INFO={summary['INFO']} "
            f"WARN={summary['WARN']} FAIL={summary['FAIL']} rc={exit_code}"
        )
    raise _typer.Exit(code=exit_code)


@app.command()
def search(
    query: list[str] = _typer.Argument(..., help="Search query"),
    lang: list[str] = _typer.Option([], "--lang", help="Filter by language"),
    path: str | None = _typer.Option(None, "--path", help="Filter by file path glob"),
    offset: int = _typer.Option(0, "--offset", help="Number of results to skip"),
    limit: int = _typer.Option(10, "--limit", help="Maximum results to return"),
    refresh: bool = _typer.Option(False, "--refresh", help="Refresh index before searching"),
) -> None:
    """Semantic search across the codebase."""
    project_root_path = require_project_root()
    project_root = str(project_root_path)
    query_str = " ".join(query)

    paths: list[str] | None = None
    if path is not None:
        paths = [path]
    else:
        default = resolve_default_path(project_root_path)
        if default is not None:
            paths = [default]
    try:
        budgeted = validate_search_budget(
            limit=limit,
            offset=offset,
            languages=lang or None,
            paths=paths,
        )
    except SearchBudgetExceeded as exc:
        _typer.echo(f"Search failed: {exc}", err=True)
        raise _typer.Exit(code=1)

    from .client import ensure_daemon

    try:
        client = ensure_daemon()
    except Exception as e:
        _typer.echo(f"Error: Failed to connect to daemon: {e}", err=True)
        raise _typer.Exit(code=1)

    if refresh:
        _run_index_with_progress(client, project_root)

    resp = _search_with_wait_spinner(
        client,
        project_root=project_root,
        query=query_str,
        languages=budgeted.languages,
        paths=budgeted.paths,
        limit=budgeted.limit,
        offset=budgeted.offset,
    )
    print_search_results(resp)


@app.command()
def status() -> None:
    """Show project status."""
    client, project_root = require_daemon_for_project()
    print_project_header(project_root)
    resp = client.project_status(project_root)
    print_index_stats(resp)


@app.command()
def reset(
    all_: bool = _typer.Option(False, "--all", help="Also remove settings and .gitignore entry"),
    force: bool = _typer.Option(False, "-f", "--force", help="Skip confirmation"),
) -> None:
    """Reset project databases and optionally remove settings."""
    project_root = require_project_root()
    cocoindex_dir = project_root / ".cocoindex_code"

    db_files = [
        cocoindex_dir / "cocoindex.db",
        cocoindex_dir / "target_sqlite.db",
    ]
    settings_file = cocoindex_dir / "settings.yml"

    # Determine what will be deleted
    to_delete = [f for f in db_files if f.exists()]
    if all_:
        if settings_file.exists():
            to_delete.append(settings_file)

    if not to_delete and not all_:
        _typer.echo("Nothing to reset.")
        return

    # Show what will be deleted
    if to_delete:
        _typer.echo("The following files will be deleted:")
        for f in to_delete:
            _typer.echo(f"  {f}")

    # Confirm
    if not force:
        if not _typer.confirm("Proceed?"):
            _typer.echo("Aborted.")
            raise _typer.Exit(code=0)

    # Remove project from daemon first so it releases file handles
    try:
        from .client import DaemonClient

        client = DaemonClient.connect()
        client.handshake()
        client.remove_project(str(project_root))
        client.close()
    except (ConnectionRefusedError, OSError, RuntimeError):
        pass  # Daemon not running — that's fine

    # Delete files/directories
    import shutil as _shutil

    for f in to_delete:
        if f.is_dir():
            _shutil.rmtree(f)
        else:
            f.unlink(missing_ok=True)

    if all_:
        # Remove .cocoindex_code/ if empty
        try:
            cocoindex_dir.rmdir()
        except OSError:
            pass  # Not empty

        # Remove from .gitignore
        remove_from_gitignore(project_root)
        _typer.echo("Project fully reset.")
    else:
        _typer.echo("Databases deleted.")
        if settings_file.exists():
            _typer.echo(
                "Settings file still exists. Run `ccc reset --all` to remove it too,\n"
                "or edit it manually."
            )


@app.command()
def mcp() -> None:
    """Run as MCP server (stdio mode)."""
    import asyncio

    client, project_root = require_daemon_for_project()

    async def _run_mcp() -> None:
        from .server import create_mcp_server

        mcp_server = create_mcp_server(client, project_root)
        # Trigger initial indexing in background
        asyncio.create_task(_bg_index(client, project_root))
        await mcp_server.run_stdio_async()

    asyncio.run(_run_mcp())


async def _bg_index(client, project_root: str) -> None:  # type: ignore[no-untyped-def]
    """Index in background, swallowing errors."""
    import asyncio

    loop = asyncio.get_event_loop()
    try:
        await loop.run_in_executor(None, client.index, project_root)
    except Exception:
        pass


# --- Daemon subcommands ---


@daemon_app.command("status")
def daemon_status() -> None:
    """Show daemon status."""
    from .client import ensure_daemon

    try:
        client = ensure_daemon()
    except Exception as e:
        _typer.echo(f"Error: {e}", err=True)
        raise _typer.Exit(code=1)

    resp = client.daemon_status()
    _typer.echo(f"Daemon version: {resp.version}")
    _typer.echo(f"Uptime: {resp.uptime_seconds:.1f}s")
    if resp.projects:
        _typer.echo("Projects:")
        for p in resp.projects:
            state = "indexing" if p.indexing else "idle"
            _typer.echo(f"  {p.project_root} [{state}]")
    else:
        _typer.echo("No projects loaded.")
    client.close()


@daemon_app.command("restart")
def daemon_restart() -> None:
    """Restart the daemon."""
    from .client import _wait_for_daemon, start_daemon, stop_daemon

    _typer.echo("Stopping daemon...")
    stop_daemon()

    _typer.echo("Starting daemon...")
    start_daemon()
    try:
        _wait_for_daemon()
        _typer.echo("Daemon restarted.")
    except TimeoutError:
        _typer.echo("Error: Daemon did not start in time.", err=True)
        raise _typer.Exit(code=1)


@daemon_app.command("stop")
def daemon_stop() -> None:
    """Stop the daemon."""
    from .client import is_daemon_running, stop_daemon
    from .daemon import daemon_pid_path

    pid_path = daemon_pid_path()
    if not pid_path.exists() and not is_daemon_running():
        _typer.echo("Daemon is not running.")
        return

    stop_daemon()

    # Wait for process to exit (check both pid file and socket)
    import time

    deadline = time.monotonic() + 5.0
    while time.monotonic() < deadline:
        if not pid_path.exists() and not is_daemon_running():
            break
        time.sleep(0.1)

    if pid_path.exists() or is_daemon_running():
        _typer.echo("Warning: daemon may not have stopped cleanly.", err=True)
    else:
        _typer.echo("Daemon stopped.")


@app.command("run-daemon", hidden=True)
def run_daemon_cmd() -> None:
    """Internal: run the daemon process."""
    from .daemon import run_daemon

    run_daemon()


# Allow running as module: python -m cocoindex_code.cli
if __name__ == "__main__":
    app()
