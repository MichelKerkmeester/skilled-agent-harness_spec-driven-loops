#!/usr/bin/env python3
# ---------------------------------------------------------------------------
# COMPONENT: Rename Tooling Fixture Harness Core
# ---------------------------------------------------------------------------
"""Run semantic rename and reference-checker scenarios in disposable Git repositories.

The harness accepts only declarative fixture data. Rename apply and rollback are
disabled unless the caller explicitly opts in, and even then the engine is
invoked only for repositories created beneath the harness-owned temporary root.
"""

from __future__ import annotations

import hashlib
import json
import os
import stat
import subprocess
import sys
import tempfile
from pathlib import Path, PurePosixPath
from typing import Any, Mapping, Sequence

from rename_engine_core import (
    DISPOSABLE_CONFIG_KEY,
    DISPOSABLE_MARKER,
    DISPOSABLE_MARKER_CONTENT,
)


# ---------------------------------------------------------------------------
# 1. CONSTANTS
# ---------------------------------------------------------------------------

SCRIPT_DIRECTORY = Path(__file__).resolve().parent
SK_DOC_ROOT = SCRIPT_DIRECTORY.parents[1]
SEMANTIC_ENGINE = SCRIPT_DIRECTORY / "semantic_rename_engine.py"
REFERENCE_CHECKER = SCRIPT_DIRECTORY / "reference_checker.py"
REFERENCE_REWRITE_EXECUTOR = SCRIPT_DIRECTORY / "reference_rewrite_executor.py"
DEFAULT_CORPUS = (
    SK_DOC_ROOT / "scripts" / "tests" / "fixtures" / "rename-tooling" / "corpus.json"
)
FIXED_AUTHOR_DATE = "2026-01-01T00:00:00+00:00"
FIXED_DRIFT_DATE = "2026-01-01T00:01:00+00:00"

REQUIRED_COVERAGE = {
    "semantic_names": {
        "explicit-targets",
        "leading-underscore",
        "double-underscore",
        "leading-hyphen",
        "similar-names",
    },
    "collisions": {"exact", "casefold", "nfc"},
    "batching": {"dependency-closure", "mixed-extension-scc"},
    "references": {
        "js-module",
        "markdown-link",
        "config-path",
        "registry-path",
        "shell-source",
        "shell-executable",
        "symlink-target",
        "dynamic-require",
        "dynamic-source",
        "dynamic-glob",
    },
    "filesystem": {"symlink-120000", "executable-100755"},
    "states": {"dry-run", "apply", "idempotent-rerun", "rollback", "cas-regeneration"},
    "failure_gates": {
        "ambiguous-reference",
        "missing-source",
        "undispositioned-dynamic-site",
        "zero-file-scan",
        "map-drift",
        "dirty-tree",
        "head-drift",
        "operation-order-drift",
        "external-target-rejection",
    },
    "exemptions": {
        "python-file",
        "python-package-directory",
        "vendored-tree",
        "generated-output",
        "lockfile-output",
        "tool-mandated-name",
        "test-runner-magic",
        "frozen-surface",
    },
}


# ---------------------------------------------------------------------------
# 2. ERRORS AND SERIALIZATION
# ---------------------------------------------------------------------------


class HarnessError(RuntimeError):
    """The fixture corpus or an observed tool result violated the harness contract."""


def _require(condition: bool, message: str) -> None:
    """Raise a stable harness error when a required condition is false."""
    if not condition:
        raise HarnessError(message)


def _canonical_json(value: Any) -> bytes:
    """Serialize evidence deterministically for repeat-run comparison."""
    return json.dumps(
        value,
        ensure_ascii=False,
        separators=(",", ":"),
        sort_keys=True,
    ).encode("utf-8")


def _sha256_json(value: Any) -> str:
    """Return a deterministic evidence digest."""
    return hashlib.sha256(_canonical_json(value)).hexdigest()


def _git_blob_hash(content: bytes) -> str:
    """Return the Git object identity for file content without writing an object."""
    preimage = f"blob {len(content)}\0".encode("ascii") + content
    return hashlib.sha1(preimage).hexdigest()


def _parse_json_output(result: subprocess.CompletedProcess[str], label: str) -> dict[str, Any]:
    """Parse one tool's JSON stdout and preserve its stderr for assertion failures."""
    try:
        payload = json.loads(result.stdout)
    except json.JSONDecodeError as error:
        raise HarnessError(
            f"{label} did not emit JSON: exit={result.returncode}, stderr={result.stderr.strip()}"
        ) from error
    if not isinstance(payload, dict):
        raise HarnessError(f"{label} JSON root must be an object")
    return payload


# ---------------------------------------------------------------------------
# 3. GIT SNAPSHOTS AND DISPOSABLE REPOSITORIES
# ---------------------------------------------------------------------------


def _run_git(
    root: Path,
    arguments: Sequence[str],
    *,
    check: bool = True,
    environment: Mapping[str, str] | None = None,
) -> subprocess.CompletedProcess[bytes]:
    """Run Git without a shell so path operands remain distinct argv elements."""
    result = subprocess.run(
        ["git", "-C", str(root), *arguments],
        check=False,
        capture_output=True,
        env=dict(environment) if environment is not None else None,
    )
    if check and result.returncode != 0:
        detail = result.stderr.decode("utf-8", errors="replace").strip()
        raise HarnessError(detail or f"git {' '.join(arguments)} exited {result.returncode}")
    return result


def _hash_physical_path(digest: Any, root: Path, relative_path: PurePosixPath) -> None:
    """Hash a file or symlink without following a symlink target."""
    physical = root.joinpath(*relative_path.parts)
    digest.update(relative_path.as_posix().encode("utf-8", errors="surrogateescape"))
    digest.update(b"\0")
    if physical.is_symlink():
        digest.update(b"symlink\0")
        digest.update(os.readlink(physical).encode("utf-8", errors="surrogateescape"))
    else:
        digest.update(b"file\0")
        try:
            digest.update(physical.read_bytes())
        except FileNotFoundError as error:
            raise HarnessError(f"snapshot path disappeared: {relative_path}") from error
    digest.update(b"\0")


def snapshot_git_worktree(root: Path) -> str:
    """Hash HEAD, index, tracked bytes, symlinks, modes, status, and untracked bytes."""
    requested = root.resolve()
    discovered = Path(
        _run_git(requested, ["rev-parse", "--show-toplevel"]).stdout.decode("utf-8").strip()
    ).resolve()
    if requested != discovered:
        raise HarnessError(
            f"protected root must be the exact Git worktree root: {requested} != {discovered}"
        )

    digest = hashlib.sha256()
    digest.update(_run_git(requested, ["rev-parse", "HEAD"]).stdout)
    digest.update(_run_git(requested, ["status", "--porcelain=v1", "-z", "--untracked-files=all"]).stdout)
    manifest = _run_git(requested, ["ls-files", "--stage", "-z"]).stdout
    digest.update(manifest)
    tracked_paths: set[str] = set()
    for record in manifest.split(b"\0"):
        if not record:
            continue
        try:
            _, raw_path = record.split(b"\t", 1)
        except ValueError as error:
            raise HarnessError("Git returned a malformed tracked manifest") from error
        relative = PurePosixPath(raw_path.decode("utf-8", errors="surrogateescape"))
        tracked_paths.add(relative.as_posix())
        _hash_physical_path(digest, requested, relative)

    untracked = _run_git(
        requested,
        ["ls-files", "--others", "--exclude-standard", "-z"],
    ).stdout
    for raw_path in sorted(path for path in untracked.split(b"\0") if path):
        relative = PurePosixPath(raw_path.decode("utf-8", errors="surrogateescape"))
        if relative.as_posix() not in tracked_paths:
            _hash_physical_path(digest, requested, relative)
    return digest.hexdigest()


def assert_fixture_boundary(repo_root: Path, workspace_root: Path, protected_root: Path) -> None:
    """Require an opted-in disposable repository strictly outside the protected worktree."""
    repo = repo_root.resolve()
    workspace = workspace_root.resolve()
    protected = protected_root.resolve()
    if repo == protected or repo in protected.parents or protected in repo.parents:
        raise HarnessError("fixture repository overlaps the protected worktree")
    try:
        repo.relative_to(workspace)
    except ValueError as error:
        raise HarnessError("fixture repository is outside the harness-owned temporary root") from error
    marker = repo / DISPOSABLE_MARKER
    if marker.read_text(encoding="utf-8") != DISPOSABLE_MARKER_CONTENT:
        raise HarnessError("fixture repository lacks the exact disposable marker")
    configured = _run_git(repo, ["config", "--local", "--get", DISPOSABLE_CONFIG_KEY])
    if configured.stdout.decode("utf-8").strip().lower() != "true":
        raise HarnessError("fixture repository lacks the disposable Git opt-in")


class FixtureRepository:
    """A deterministic Git repository contained inside one harness-owned directory."""

    def __init__(self, workspace: Path, name: str, *, disposable: bool = True) -> None:
        self.workspace = workspace.resolve()
        self.root = self.workspace / name / "repo"
        self.evidence = self.workspace / name / "evidence"
        self.root.mkdir(parents=True)
        self.evidence.mkdir(parents=True)
        _run_git(self.root, ["init", "--quiet"])
        _run_git(self.root, ["config", "user.email", "fixture@example.invalid"])
        _run_git(self.root, ["config", "user.name", "Rename Tooling Fixture"])
        _run_git(self.root, ["config", "commit.gpgSign", "false"])
        hooks = self.workspace / name / "hooks-disabled"
        hooks.mkdir()
        _run_git(self.root, ["config", "core.hooksPath", str(hooks)])
        if disposable:
            _run_git(self.root, ["config", DISPOSABLE_CONFIG_KEY, "true"])
            self.write(DISPOSABLE_MARKER, DISPOSABLE_MARKER_CONTENT)

    def write(self, relative_path: str, content: str, *, executable: bool = False) -> None:
        """Create or replace one UTF-8 fixture file."""
        path = self.root.joinpath(*PurePosixPath(relative_path).parts)
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")
        if executable:
            path.chmod(path.stat().st_mode | stat.S_IXUSR | stat.S_IXGRP | stat.S_IXOTH)

    def symlink(self, relative_path: str, target: str) -> None:
        """Create one fixture symlink without following its target."""
        path = self.root.joinpath(*PurePosixPath(relative_path).parts)
        path.parent.mkdir(parents=True, exist_ok=True)
        path.symlink_to(target)

    def commit(
        self,
        message: str,
        *,
        allow_empty: bool = False,
        commit_date: str = FIXED_AUTHOR_DATE,
    ) -> str:
        """Commit the fixture tree with deterministic author and committer metadata."""
        _run_git(self.root, ["add", "--", "."])
        arguments = ["commit", "--quiet", "-m", message]
        if allow_empty:
            arguments.append("--allow-empty")
        environment = os.environ.copy()
        environment["GIT_AUTHOR_DATE"] = commit_date
        environment["GIT_COMMITTER_DATE"] = commit_date
        _run_git(self.root, arguments, environment=environment)
        return self.head()

    def head(self) -> str:
        """Return the fixture repository's immutable current commit identity."""
        return _run_git(self.root, ["rev-parse", "HEAD"]).stdout.decode("ascii").strip()

    def snapshot(self) -> str:
        """Return the complete deterministic fixture worktree snapshot."""
        return snapshot_git_worktree(self.root)

    def write_map(
        self,
        entries: Sequence[Mapping[str, Any]],
        base_sha: str,
        *,
        name: str = "semantic-map.json",
    ) -> Path:
        """Write one explicit semantic map outside the scanned repository."""
        path = self.evidence / name
        path.write_text(
            json.dumps(
                {"schema_version": 1, "base_sha": base_sha, "entries": list(entries)},
                ensure_ascii=False,
                indent=2,
            )
            + "\n",
            encoding="utf-8",
        )
        return path

    def write_json(self, name: str, value: Any) -> Path:
        """Write deterministic tool input outside the scanned repository."""
        path = self.evidence / name
        path.write_text(
            json.dumps(value, ensure_ascii=False, indent=2, sort_keys=True) + "\n",
            encoding="utf-8",
        )
        return path

    def run_engine(
        self,
        map_path: Path,
        *,
        action: str = "dry-run",
        plan_path: Path | None = None,
        journal_path: Path | None = None,
    ) -> subprocess.CompletedProcess[str]:
        """Invoke the committed rename engine CLI without a shell."""
        command = [
            sys.executable,
            str(SEMANTIC_ENGINE),
            "--repo",
            str(self.root),
            "--map",
            str(map_path),
        ]
        if action != "dry-run":
            _require(action in {"apply", "rollback"}, f"unsupported engine action: {action}")
            _require(plan_path is not None and journal_path is not None, "apply needs plan and journal")
            command.extend(
                [
                    f"--{action}",
                    "--plan",
                    str(plan_path),
                    "--journal",
                    str(journal_path),
                ]
            )
        environment = os.environ.copy()
        environment["PYTHONPYCACHEPREFIX"] = str(self.evidence / "pycache")
        return subprocess.run(
            command,
            cwd=self.root,
            check=False,
            capture_output=True,
            text=True,
            env=environment,
        )

    def run_checker(
        self,
        map_path: Path,
        expected_base: str,
        *,
        dispositions: Path | None = None,
    ) -> subprocess.CompletedProcess[str]:
        """Invoke the committed read-only reference checker CLI."""
        command = [
            sys.executable,
            str(REFERENCE_CHECKER),
            "--repo",
            str(self.root),
            "--map",
            str(map_path),
            "--expected-base",
            expected_base,
            "--state",
            "pre",
        ]
        if dispositions is not None:
            command.extend(["--dispositions", str(dispositions)])
        environment = os.environ.copy()
        environment["PYTHONPYCACHEPREFIX"] = str(self.evidence / "pycache")
        return subprocess.run(
            command,
            cwd=self.root,
            check=False,
            capture_output=True,
            text=True,
            env=environment,
        )

    def run_rewrite_executor(
        self,
        map_path: Path,
        ledger_path: Path,
        batch_id: str,
        *,
        action: str = "dry-run",
        plan_path: Path | None = None,
        journal_path: Path | None = None,
        inject_drift_file: str | None = None,
    ) -> subprocess.CompletedProcess[str]:
        """Invoke the committed reference-rewrite executor without a shell."""
        command = [
            sys.executable,
            str(REFERENCE_REWRITE_EXECUTOR),
            "--repo",
            str(self.root),
            "--map",
            str(map_path),
            "--ledger",
            str(ledger_path),
            "--batch",
            batch_id,
        ]
        if action != "dry-run":
            _require(action in {"apply", "rollback"}, f"unsupported rewrite action: {action}")
            _require(plan_path is not None and journal_path is not None, "rewrite needs plan and journal")
            command.extend(
                [
                    f"--{action}",
                    "--plan",
                    str(plan_path),
                    "--journal",
                    str(journal_path),
                ]
            )
        if inject_drift_file is not None:
            _require(action == "apply", "rewrite drift injection requires apply")
            command.extend(["--inject-drift-file", inject_drift_file])
        environment = os.environ.copy()
        environment["PYTHONPYCACHEPREFIX"] = str(self.evidence / "pycache")
        return subprocess.run(
            command,
            cwd=self.root,
            check=False,
            capture_output=True,
            text=True,
            env=environment,
        )

    def index_mode(self, relative_path: str) -> str:
        """Return the stage-zero Git mode for one exact path operand."""
        output = _run_git(
            self.root,
            ["ls-files", "--stage", "--", relative_path],
        ).stdout.decode("utf-8")
        if not output.strip():
            raise HarnessError(f"path is missing from the fixture index: {relative_path}")
        return output.split(" ", 1)[0]

    def current_blob_hash(self, relative_path: str) -> str:
        """Return the current worktree content's Git blob identity."""
        path = self.root.joinpath(*PurePosixPath(relative_path).parts)
        content = (
            os.readlink(path).encode("utf-8", errors="surrogateescape")
            if path.is_symlink()
            else path.read_bytes()
        )
        return _git_blob_hash(content)


def _seed_repository(
    workspace: Path,
    scenario: Mapping[str, Any],
    *,
    name: str | None = None,
    disposable: bool = True,
) -> FixtureRepository:
    """Create one repository from explicit file and symlink declarations."""
    repository = FixtureRepository(workspace, name or str(scenario["id"]), disposable=disposable)
    for file_spec in scenario.get("files", []):
        repository.write(
            file_spec["path"],
            file_spec["content"],
            executable=bool(file_spec.get("executable", False)),
        )
    for symlink_spec in scenario.get("symlinks", []):
        repository.symlink(symlink_spec["path"], symlink_spec["target"])
    return repository


# ---------------------------------------------------------------------------
# 4. CORPUS VALIDATION
# ---------------------------------------------------------------------------


def load_corpus(path: Path = DEFAULT_CORPUS) -> dict[str, Any]:
    """Load and validate the declarative fixture corpus."""
    try:
        document = json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as error:
        raise HarnessError(f"fixture corpus not found: {path}") from error
    except json.JSONDecodeError as error:
        raise HarnessError(f"fixture corpus JSON is invalid at line {error.lineno}: {error.msg}") from error
    if not isinstance(document, dict) or document.get("schema_version") != 1:
        raise HarnessError("fixture corpus must be a schema-version 1 object")
    for field in ("corpus_id", "program_base_sha", "seed"):
        if not isinstance(document.get(field), str) or not document[field]:
            raise HarnessError(f"fixture corpus requires non-empty {field}")
    scenarios = document.get("scenarios")
    if not isinstance(scenarios, list) or not scenarios:
        raise HarnessError("fixture corpus must declare a non-zero scenario list")
    scenario_ids = [scenario.get("id") for scenario in scenarios if isinstance(scenario, dict)]
    if len(scenario_ids) != len(scenarios) or any(not value for value in scenario_ids):
        raise HarnessError("every fixture scenario requires a non-empty id")
    if len(set(scenario_ids)) != len(scenario_ids):
        raise HarnessError("fixture scenario ids must be unique")

    declared = document.get("required_coverage")
    if not isinstance(declared, dict):
        raise HarnessError("fixture corpus requires a coverage contract")
    for category, required_values in REQUIRED_COVERAGE.items():
        raw_values = declared.get(category)
        if not isinstance(raw_values, list) or any(not isinstance(value, str) for value in raw_values):
            raise HarnessError(f"coverage category {category} must be an array of strings")
        actual_values = set(raw_values)
        if actual_values != required_values:
            missing = sorted(required_values - actual_values)
            extra = sorted(actual_values - required_values)
            raise HarnessError(
                f"coverage category {category} differs: missing={missing}, extra={extra}"
            )
    return document


# ---------------------------------------------------------------------------
# 5. SCENARIO RUNNERS
# ---------------------------------------------------------------------------


def _run_lifecycle(
    workspace: Path,
    protected_root: Path,
    scenario: Mapping[str, Any],
    *,
    exercise_apply: bool,
    exercise_rollback: bool,
) -> dict[str, Any]:
    repository = _seed_repository(workspace, scenario)
    base_sha = repository.commit("semantic lifecycle fixture")
    assert_fixture_boundary(repository.root, workspace, protected_root)
    map_path = repository.write_map(scenario["map_entries"], base_sha)
    baseline = repository.snapshot()

    first_result = repository.run_engine(map_path)
    second_result = repository.run_engine(map_path)
    _require(first_result.returncode == 0, first_result.stdout + first_result.stderr)
    _require(second_result.returncode == 0, second_result.stdout + second_result.stderr)
    first_plan = _parse_json_output(first_result, "rename dry-run")
    second_plan = _parse_json_output(second_result, "repeated rename dry-run")
    _require(first_plan == second_plan, "repeated rename dry-runs produced different plans")
    _require(repository.snapshot() == baseline, "rename dry-run changed the disposable repository")
    _require(first_plan.get("mode") == "dry-run", "rename engine did not default to dry-run")
    _require(
        first_plan.get("summary") == scenario["expected"]["plan_summary"],
        "rename plan summary differs from the declared fixture expectation",
    )

    expected_scc = sorted(scenario["expected"]["scc_members"])
    scc_batch = next(
        (
            batch
            for batch in first_plan["batches"]
            if sorted(batch.get("members", [])) == expected_scc
        ),
        None,
    )
    _require(scc_batch is not None, "mixed-extension dependency SCC is missing from the rename plan")

    pending_result = repository.run_checker(map_path, base_sha)
    _require(pending_result.returncode == 2, "undispositioned dynamic sites did not block the checker")
    pending_ledger = _parse_json_output(pending_result, "pending reference checker")
    _require(repository.snapshot() == baseline, "reference checker changed the disposable repository")
    dynamic_rows = [
        row for row in pending_ledger["rows"] if row.get("row_type") == "dynamic-site"
    ]
    observed_dynamic = {
        (row["file"], row["reference_kind"], row["expression"]) for row in dynamic_rows
    }
    expected_dynamic = {
        (row["file"], row["reference_kind"], row["expression"])
        for row in scenario["expected"]["dynamic_sites"]
    }
    _require(
        observed_dynamic == expected_dynamic,
        f"dynamic reference matrix differs: observed={sorted(observed_dynamic)}",
    )
    dispositions = {
        row["site_key"]: {
            "disposition": "producer-routed",
            "rationale": "The fixture producer owns this dynamic path expression",
            "evidence": [f"reviewed:{row['site_id']}"],
        }
        for row in dynamic_rows
        if row["status"] == "pending"
    }
    disposition_path = repository.write_json("dynamic-dispositions.json", dispositions)
    accepted_result = repository.run_checker(
        map_path,
        base_sha,
        dispositions=disposition_path,
    )
    _require(accepted_result.returncode == 0, accepted_result.stdout + accepted_result.stderr)
    ledger = _parse_json_output(accepted_result, "accepted reference checker")
    _require(ledger.get("accepted") is True, "reference ledger did not reach an accepted state")
    _require(repository.snapshot() == baseline, "accepted checker scan changed the repository")
    _require(ledger["scan"]["tracked_file_count"] > 0, "accepted checker scan reported zero files")

    map_rows = {
        row["map_id"]: row
        for row in ledger["rows"]
        if row.get("row_type") == "map-entry"
    }
    static_kinds = {
        site["reference_kind"]
        for row in map_rows.values()
        for site in row["reference_sites"]
    }
    _require(
        static_kinds == set(scenario["expected"]["static_reference_kinds"]),
        f"static reference kinds differ: {sorted(static_kinds)}",
    )
    for row in map_rows.values():
        for site in row["reference_sites"]:
            _require(
                site["cas_rule"] == "regenerate-on-preimage-drift",
                f"static site lacks the CAS regeneration rule: {site['site_key']}",
            )
            _require(
                repository.current_blob_hash(site["file"]) == site["preimage_blob_hash"],
                f"static site preimage does not match the scanned blob: {site['site_key']}",
            )

    ledger_path = repository.write_json("accepted-ledger.json", ledger)
    runtime_batch = next(
        (
            batch
            for batch in ledger["reference_graph"]["scc_batches"]
            if sorted(batch.get("map_ids", [])) == expected_scc
        ),
        None,
    )
    _require(runtime_batch is not None, "checker ledger omitted the engine dependency SCC")
    rewrite_first_result = repository.run_rewrite_executor(
        map_path,
        ledger_path,
        runtime_batch["batch_id"],
    )
    rewrite_second_result = repository.run_rewrite_executor(
        map_path,
        ledger_path,
        runtime_batch["batch_id"],
    )
    _require(
        rewrite_first_result.returncode == 0,
        rewrite_first_result.stdout + rewrite_first_result.stderr,
    )
    _require(
        rewrite_second_result.returncode == 0,
        rewrite_second_result.stdout + rewrite_second_result.stderr,
    )
    rewrite_plan = _parse_json_output(rewrite_first_result, "reference rewrite dry-run")
    repeated_rewrite_plan = _parse_json_output(
        rewrite_second_result,
        "repeated reference rewrite dry-run",
    )
    _require(rewrite_plan == repeated_rewrite_plan, "rewrite dry-runs produced different plans")
    _require(repository.snapshot() == baseline, "rewrite dry-run changed the disposable repository")
    _require(rewrite_plan.get("mode") == "dry-run", "rewrite executor did not default to dry-run")
    _require(rewrite_plan["batch"]["batch_rule"] == "reference-graph-scc", "rewrite batch is not an SCC")
    _require(rewrite_plan["base_sha"] == base_sha, "rewrite plan BASE differs from the fixture")
    _require(rewrite_plan["map_hash"] == ledger["plan_identity"]["map_hash"], "rewrite map hash differs")
    _require(rewrite_plan["summary"]["pending_rewrites"] > 0, "rewrite plan contains zero sites")
    rewrite_kinds = {site["reference_kind"] for site in rewrite_plan["sites"]}
    _require(
        rewrite_kinds == set(scenario["expected"]["static_reference_kinds"]),
        f"rewrite reference kinds differ: {sorted(rewrite_kinds)}",
    )
    _require(
        any(state.get("state") == "routed-to-producer" for state in rewrite_plan["site_states"]),
        "rewrite plan omitted the routed dynamic-site state",
    )

    leading_operation = next(
        operation
        for operation in ledger["plan_identity"]["ordered_operations"]
        if operation["map_id"] == "m-leading"
    )
    _require(
        leading_operation["safe_argv"] == scenario["expected"]["leading_hyphen_safe_argv"],
        "leading-hyphen path is not option-terminated",
    )
    for source, expected_mode in scenario["expected"]["source_modes"].items():
        _require(
            first_plan["mode_manifest_before"].get(source) == expected_mode,
            f"source mode differs for {source}",
        )

    apply_state = "not-requested"
    rerun_state = "not-requested"
    rollback_state = "not-requested"
    rewrite_apply_state = "not-requested"
    rewrite_rerun_pending: int | str = "not-requested"
    rewrite_rollback_state = "not-requested"
    cross_batch_unchanged: bool | str = "not-requested"
    baseline_restored = repository.snapshot() == baseline
    if exercise_apply:
        rewrite_plan_path = repository.write_json("reviewed-rewrite-plan.json", rewrite_plan)
        rewrite_journal_path = repository.evidence / "rewrite-journal.json"
        cross_batch_path = repository.root.joinpath(
            *PurePosixPath(scenario["expected"]["cross_batch_file"]).parts
        )
        cross_batch_before = cross_batch_path.read_bytes()
        rewrite_apply_result = repository.run_rewrite_executor(
            map_path,
            ledger_path,
            runtime_batch["batch_id"],
            action="apply",
            plan_path=rewrite_plan_path,
            journal_path=rewrite_journal_path,
        )
        _require(
            rewrite_apply_result.returncode == 0,
            rewrite_apply_result.stdout + rewrite_apply_result.stderr,
        )
        rewrite_applied = _parse_json_output(rewrite_apply_result, "fixture rewrite apply")
        rewrite_apply_state = rewrite_applied["state"]
        _require(rewrite_apply_state == "applied", "fixture rewrite did not reach applied state")
        rewrite_rerun_result = repository.run_rewrite_executor(
            map_path,
            ledger_path,
            runtime_batch["batch_id"],
        )
        _require(
            rewrite_rerun_result.returncode == 0,
            rewrite_rerun_result.stdout + rewrite_rerun_result.stderr,
        )
        rewrite_rerun = _parse_json_output(rewrite_rerun_result, "fixture rewrite rerun")
        rewrite_rerun_pending = rewrite_rerun["summary"]["pending_rewrites"]
        _require(rewrite_rerun_pending == 0, "fixture rewrite rerun was not idempotent")
        cross_batch_unchanged = cross_batch_path.read_bytes() == cross_batch_before
        _require(cross_batch_unchanged, "rewrite changed a file owned by another SCC")
        rewrite_rollback_result = repository.run_rewrite_executor(
            map_path,
            ledger_path,
            runtime_batch["batch_id"],
            action="rollback",
            plan_path=rewrite_plan_path,
            journal_path=rewrite_journal_path,
        )
        _require(
            rewrite_rollback_result.returncode == 0,
            rewrite_rollback_result.stdout + rewrite_rollback_result.stderr,
        )
        rewrite_rollback = _parse_json_output(rewrite_rollback_result, "fixture rewrite rollback")
        rewrite_rollback_state = rewrite_rollback["state"]
        _require(rewrite_rollback_state == "reverted", "fixture rewrite rollback did not revert")
        _require(repository.snapshot() == baseline, "fixture rewrite rollback did not restore baseline")

        plan_path = repository.write_json("reviewed-plan.json", first_plan)
        journal_path = repository.evidence / "rename-journal.json"
        apply_result = repository.run_engine(
            map_path,
            action="apply",
            plan_path=plan_path,
            journal_path=journal_path,
        )
        _require(apply_result.returncode == 0, apply_result.stdout + apply_result.stderr)
        applied = _parse_json_output(apply_result, "fixture apply")
        apply_state = applied["state"]
        _require(apply_state == "applied", "explicit fixture apply did not reach applied state")

        rerun_result = repository.run_engine(
            map_path,
            action="apply",
            plan_path=plan_path,
            journal_path=journal_path,
        )
        _require(rerun_result.returncode == 0, rerun_result.stdout + rerun_result.stderr)
        rerun = _parse_json_output(rerun_result, "fixture idempotent rerun")
        rerun_state = rerun["state"]
        _require(rerun_state == "already-at-target", "fixture apply rerun was not idempotent")

        entry_by_source = {
            entry["source"]: entry
            for entry in scenario["map_entries"]
            if entry["classification"] == "rename"
        }
        for source, expected_mode in scenario["expected"]["source_modes"].items():
            target = entry_by_source[source]["target"]
            _require(repository.index_mode(target) == expected_mode, f"target mode differs for {target}")

        if exercise_rollback:
            rollback_result = repository.run_engine(
                map_path,
                action="rollback",
                plan_path=plan_path,
                journal_path=journal_path,
            )
            _require(rollback_result.returncode == 0, rollback_result.stdout + rollback_result.stderr)
            rollback = _parse_json_output(rollback_result, "fixture rollback")
            rollback_state = rollback["state"]
            _require(rollback_state == "reverted", "explicit fixture rollback did not revert")
            baseline_restored = repository.snapshot() == baseline
            _require(baseline_restored, "fixture rollback did not restore the complete baseline")

    return {
        "id": scenario["id"],
        "status": "passed",
        "fixture_base_sha": base_sha,
        "plan_id": first_plan["plan_id"],
        "map_hash": first_plan["map_sha256"],
        "plan_summary": first_plan["summary"],
        "dependency_scc": expected_scc,
        "reference_kinds": sorted(static_kinds),
        "dynamic_site_count": len(dynamic_rows),
        "tracked_file_count": ledger["scan"]["tracked_file_count"],
        "regular_file_count": ledger["scan"]["regular_file_count"],
        "symlink_count": ledger["scan"]["symlink_count"],
        "ledger_hash": ledger["ledger_hash"],
        "rewrite_plan_id": rewrite_plan["plan_id"],
        "rewrite_pending": rewrite_plan["summary"]["pending_rewrites"],
        "rewrite_reference_kinds": sorted(rewrite_kinds),
        "rewrite_dynamic_routed": True,
        "rewrite_apply_state": rewrite_apply_state,
        "rewrite_rerun_pending": rewrite_rerun_pending,
        "rewrite_rollback_state": rewrite_rollback_state,
        "cross_batch_unchanged": cross_batch_unchanged,
        "apply_state": apply_state,
        "idempotent_state": rerun_state,
        "rollback_state": rollback_state,
        "baseline_restored": baseline_restored,
    }


def _run_collision(workspace: Path, scenario: Mapping[str, Any]) -> dict[str, Any]:
    repository = _seed_repository(workspace, scenario)
    base_sha = repository.commit(str(scenario["id"]))
    map_path = repository.write_map(scenario["map_entries"], base_sha)
    baseline = repository.snapshot()
    result = repository.run_engine(map_path)
    combined = result.stdout + result.stderr
    _require(result.returncode != 0, f"{scenario['id']} unexpectedly succeeded")
    _require(scenario["expected_error"] in combined, f"{scenario['id']} failed for the wrong reason")
    _require(repository.snapshot() == baseline, f"{scenario['id']} changed the fixture repository")
    return {
        "id": scenario["id"],
        "status": "expected-failure",
        "exit_code": result.returncode,
        "reason": scenario["expected_error"],
    }


def _run_checker_failure(workspace: Path, scenario: Mapping[str, Any]) -> dict[str, Any]:
    repository = _seed_repository(workspace, scenario)
    base_sha = repository.commit(str(scenario["id"]))
    map_path = repository.write_map(scenario["map_entries"], base_sha)
    baseline = repository.snapshot()
    result = repository.run_checker(map_path, base_sha)
    combined = result.stdout + result.stderr
    _require(result.returncode != 0, f"{scenario['id']} unexpectedly succeeded")
    _require(scenario["expected_error"] in combined, f"{scenario['id']} failed for the wrong reason")
    _require(repository.snapshot() == baseline, f"{scenario['id']} changed the fixture repository")
    return {
        "id": scenario["id"],
        "status": "expected-failure",
        "exit_code": result.returncode,
        "reason": scenario["expected_error"],
    }


def _run_zero_scan(workspace: Path, scenario: Mapping[str, Any]) -> dict[str, Any]:
    repository = _seed_repository(workspace, scenario, disposable=False)
    base_sha = repository.commit(str(scenario["id"]), allow_empty=True)
    map_path = repository.write_map(scenario["map_entries"], base_sha)
    result = repository.run_checker(map_path, base_sha)
    _require(result.returncode != 0, "zero-file scan unexpectedly succeeded")
    _require(scenario["expected_error"] in result.stderr, "zero-file scan failed for the wrong reason")
    return {
        "id": scenario["id"],
        "status": "expected-failure",
        "exit_code": result.returncode,
        "reason": scenario["expected_error"],
    }


def _run_plan_revalidation(
    workspace: Path,
    protected_root: Path,
    scenario: Mapping[str, Any],
    *,
    exercise_apply: bool,
) -> dict[str, Any]:
    if not exercise_apply:
        return {
            "id": scenario["id"],
            "status": "not-requested",
            "cases": [],
        }

    case_results = []
    for case in scenario["cases"]:
        repository = _seed_repository(
            workspace,
            scenario,
            name=f"{scenario['id']}-{case['id']}",
        )
        base_sha = repository.commit(f"plan revalidation {case['id']}")
        assert_fixture_boundary(repository.root, workspace, protected_root)
        map_path = repository.write_map(scenario["map_entries"], base_sha)
        dry_result = repository.run_engine(map_path)
        _require(dry_result.returncode == 0, dry_result.stdout + dry_result.stderr)
        plan = _parse_json_output(dry_result, f"plan revalidation {case['id']}")
        plan_path = repository.write_json("reviewed-plan.json", plan)
        journal_path = repository.evidence / "journal.json"
        source = repository.root / "docs" / "source_name.md"
        source_before = source.read_bytes()

        mutation = case["mutation"]
        if mutation == "map":
            map_path.write_text(map_path.read_text(encoding="utf-8") + "\n", encoding="utf-8")
        elif mutation == "dirty":
            repository.write("untracked.txt", "dirty\n")
        elif mutation == "head":
            repository.write("later.txt", "later\n")
            repository.commit("head drift", commit_date=FIXED_DRIFT_DATE)
        elif mutation == "order":
            plan["operation_order"][0]["target"] = "docs/tampered.md"
            plan_path = repository.write_json("reviewed-plan.json", plan)
        else:
            raise HarnessError(f"unknown plan revalidation mutation: {mutation}")

        result = repository.run_engine(
            map_path,
            action="apply",
            plan_path=plan_path,
            journal_path=journal_path,
        )
        combined = result.stdout + result.stderr
        _require(result.returncode != 0, f"{case['id']} unexpectedly applied a stale plan")
        _require(case["expected_error"] in combined, f"{case['id']} failed for the wrong reason")
        _require(source.exists() and source.read_bytes() == source_before, f"{case['id']} wrote before abort")
        _require(not (repository.root / "docs" / "source-name.md").exists(), f"{case['id']} moved source")
        case_results.append(
            {
                "id": case["id"],
                "exit_code": result.returncode,
                "reason": case["expected_error"],
            }
        )
    return {
        "id": scenario["id"],
        "status": "expected-failures",
        "cases": case_results,
    }


def _run_cas_drift(
    workspace: Path,
    scenario: Mapping[str, Any],
    *,
    exercise_apply: bool,
) -> dict[str, Any]:
    repository = _seed_repository(workspace, scenario)
    first_base = repository.commit("CAS preimage fixture")
    first_map = repository.write_map(scenario["map_entries"], first_base, name="map-before.json")
    first_result = repository.run_checker(first_map, first_base)
    _require(first_result.returncode == 0, first_result.stdout + first_result.stderr)
    first_ledger = _parse_json_output(first_result, "initial CAS ledger")
    expected = scenario["expected"]
    first_row = next(
        row
        for row in first_ledger["rows"]
        if row.get("row_type") == "map-entry" and row.get("map_id") == expected["map_id"]
    )
    first_site = next(
        site for site in first_row["reference_sites"] if site["file"] == expected["reference_file"]
    )
    _require(first_site["cas_rule"] == expected["cas_rule"], "initial CAS rule differs")
    _require(
        repository.current_blob_hash(expected["reference_file"]) == first_site["preimage_blob_hash"],
        "initial CAS preimage does not match",
    )

    repository.write(scenario["drift"]["path"], scenario["drift"]["content"])
    second_base = repository.commit("CAS content drift", commit_date=FIXED_DRIFT_DATE)
    second_map = repository.write_map(scenario["map_entries"], second_base, name="map-after.json")
    second_result = repository.run_checker(second_map, second_base)
    _require(second_result.returncode == 0, second_result.stdout + second_result.stderr)
    second_ledger = _parse_json_output(second_result, "regenerated CAS ledger")
    second_row = next(
        row
        for row in second_ledger["rows"]
        if row.get("row_type") == "map-entry" and row.get("map_id") == expected["map_id"]
    )
    second_site = next(
        site for site in second_row["reference_sites"] if site["file"] == expected["reference_file"]
    )
    current_blob = repository.current_blob_hash(expected["reference_file"])
    _require(
        current_blob != first_site["preimage_blob_hash"],
        "drifted content still matches the stale CAS preimage",
    )
    _require(
        current_blob == second_site["preimage_blob_hash"],
        "regenerated ledger does not match the drifted blob",
    )
    _require(second_site["cas_rule"] == expected["cas_rule"], "regenerated CAS rule differs")
    second_ledger_path = repository.write_json("ledger-after.json", second_ledger)
    rewrite_batch = next(
        batch
        for batch in second_ledger["reference_graph"]["scc_batches"]
        if batch["map_ids"] == [expected["map_id"]]
    )
    rewrite_result = repository.run_rewrite_executor(
        second_map,
        second_ledger_path,
        rewrite_batch["batch_id"],
    )
    _require(rewrite_result.returncode == 0, rewrite_result.stdout + rewrite_result.stderr)
    rewrite_plan = _parse_json_output(rewrite_result, "CAS rewrite dry-run")
    _require(rewrite_plan["summary"]["pending_rewrites"] == 1, "CAS rewrite plan must own one site")
    _require(
        rewrite_plan["sites"][0]["current_preimage_blob_hash"] == current_blob,
        "CAS rewrite plan did not bind the current blob",
    )

    executor_apply_state = "not-requested"
    executor_regenerated: bool | str = "not-requested"
    executor_rollback_state = "not-requested"
    if exercise_apply:
        rewrite_plan_path = repository.write_json("reviewed-CAS-rewrite-plan.json", rewrite_plan)
        rewrite_journal_path = repository.evidence / "CAS-rewrite-journal.json"
        apply_result = repository.run_rewrite_executor(
            second_map,
            second_ledger_path,
            rewrite_batch["batch_id"],
            action="apply",
            plan_path=rewrite_plan_path,
            journal_path=rewrite_journal_path,
            inject_drift_file=expected["reference_file"],
        )
        _require(apply_result.returncode == 0, apply_result.stdout + apply_result.stderr)
        applied = _parse_json_output(apply_result, "CAS rewrite apply")
        executor_apply_state = applied["state"]
        executor_regenerated = applied["regenerated"]
        _require(executor_apply_state == "applied", "CAS rewrite apply did not complete")
        _require(executor_regenerated is True, "CAS rewrite apply did not regenerate drifted sites")
        rewritten = repository.root.joinpath(
            *PurePosixPath(expected["reference_file"]).parts
        ).read_text(encoding="utf-8")
        _require(rewritten.startswith("fixture drift\n"), "CAS fixture drift was not preserved")
        _require("./new-module" in rewritten, "CAS rewrite did not use the explicit target")
        rollback_result = repository.run_rewrite_executor(
            second_map,
            second_ledger_path,
            rewrite_batch["batch_id"],
            action="rollback",
            plan_path=rewrite_plan_path,
            journal_path=rewrite_journal_path,
        )
        _require(rollback_result.returncode == 0, rollback_result.stdout + rollback_result.stderr)
        rolled_back = _parse_json_output(rollback_result, "CAS rewrite rollback")
        executor_rollback_state = rolled_back["state"]
        _require(executor_rollback_state == "reverted", "CAS rewrite rollback did not revert")
        restored = repository.root.joinpath(
            *PurePosixPath(expected["reference_file"]).parts
        ).read_text(encoding="utf-8")
        _require(restored.startswith("fixture drift\n"), "CAS rollback discarded concurrent content")
        _require("./old_module" in restored, "CAS rollback did not restore the source reference")
    return {
        "id": scenario["id"],
        "status": "passed",
        "first_base_sha": first_base,
        "second_base_sha": second_base,
        "stale_preimage_rejected": True,
        "regenerated_preimage_matches": True,
        "first_preimage": first_site["preimage_blob_hash"],
        "second_preimage": second_site["preimage_blob_hash"],
        "first_map_hash": first_ledger["plan_identity"]["map_hash"],
        "second_map_hash": second_ledger["plan_identity"]["map_hash"],
        "executor_plan_id": rewrite_plan["plan_id"],
        "executor_pending": rewrite_plan["summary"]["pending_rewrites"],
        "executor_apply_state": executor_apply_state,
        "executor_regenerated": executor_regenerated,
        "executor_rollback_state": executor_rollback_state,
    }


SCENARIO_RUNNERS = {
    "collision": _run_collision,
    "checker-failure": _run_checker_failure,
    "zero-scan": _run_zero_scan,
}


def _run_once(
    corpus: Mapping[str, Any],
    workspace: Path,
    protected_root: Path,
    *,
    exercise_apply: bool,
    exercise_rollback: bool,
) -> list[dict[str, Any]]:
    """Run every declared scenario exactly once."""
    results = []
    for scenario in corpus["scenarios"]:
        kind = scenario["kind"]
        if kind == "lifecycle":
            result = _run_lifecycle(
                workspace,
                protected_root,
                scenario,
                exercise_apply=exercise_apply,
                exercise_rollback=exercise_rollback,
            )
        elif kind == "plan-revalidation":
            result = _run_plan_revalidation(
                workspace,
                protected_root,
                scenario,
                exercise_apply=exercise_apply,
            )
        elif kind == "cas-drift":
            result = _run_cas_drift(
                workspace,
                scenario,
                exercise_apply=exercise_apply,
            )
        else:
            runner = SCENARIO_RUNNERS.get(kind)
            if runner is None:
                raise HarnessError(f"unknown fixture scenario kind: {kind}")
            result = runner(workspace, scenario)
        results.append(result)
    _require(len(results) > 0, "fixture harness executed zero scenarios")
    return results


# ---------------------------------------------------------------------------
# 6. HARNESS ENTRY POINT
# ---------------------------------------------------------------------------


def run_harness(
    *,
    corpus_path: Path = DEFAULT_CORPUS,
    protected_root: Path,
    repeat: int = 2,
    exercise_apply: bool = False,
    exercise_rollback: bool = False,
) -> dict[str, Any]:
    """Run the corpus and prove deterministic evidence plus protected-root non-mutation."""
    if repeat < 1:
        raise HarnessError("repeat must be at least one")
    if exercise_rollback and not exercise_apply:
        raise HarnessError("rollback exercise requires explicit apply exercise")
    corpus = load_corpus(corpus_path)
    protected = protected_root.resolve()
    protected_before = snapshot_git_worktree(protected)
    evidence_runs = []
    evidence_hashes = []

    for _ in range(repeat):
        with tempfile.TemporaryDirectory(prefix="rename-tooling-fixtures-") as raw_workspace:
            workspace = Path(raw_workspace).resolve()
            try:
                assert_fixture_boundary(protected, workspace, protected)
            except HarnessError as error:
                _require(
                    "overlaps the protected worktree" in str(error),
                    "protected-root boundary self-test failed for the wrong reason",
                )
            else:
                raise HarnessError("protected worktree was accepted as a fixture target")
            scenarios = _run_once(
                corpus,
                workspace,
                protected,
                exercise_apply=exercise_apply,
                exercise_rollback=exercise_rollback,
            )
            evidence = {
                "corpus_id": corpus["corpus_id"],
                "program_base_sha": corpus["program_base_sha"],
                "seed": corpus["seed"],
                "mode": "fixture-apply" if exercise_apply else "dry-run",
                "rollback_requested": exercise_rollback,
                "boundary": "protected-root-rejected",
                "scenarios": scenarios,
            }
            evidence_runs.append(evidence)
            evidence_hashes.append(_sha256_json(evidence))
        current_protected = snapshot_git_worktree(protected)
        _require(
            current_protected == protected_before,
            "fixture harness changed the protected worktree",
        )

    _require(
        len(set(evidence_hashes)) == 1,
        f"repeated fixture runs were non-deterministic: {evidence_hashes}",
    )
    protected_after = snapshot_git_worktree(protected)
    _require(protected_after == protected_before, "protected worktree changed during harness run")
    return {
        "schema_version": 1,
        "corpus_id": corpus["corpus_id"],
        "program_base_sha": corpus["program_base_sha"],
        "seed": corpus["seed"],
        "mode": "fixture-apply" if exercise_apply else "dry-run",
        "rollback_requested": exercise_rollback,
        "repeat": repeat,
        "scenario_count": len(corpus["scenarios"]),
        "scenario_results": evidence_runs[0]["scenarios"],
        "evidence_hash": evidence_hashes[0],
        "repeat_hashes": evidence_hashes,
        "protected_before": protected_before,
        "protected_after": protected_after,
        "protected_unchanged": True,
        "boundary": "protected-root-rejected",
    }


__all__ = [
    "DEFAULT_CORPUS",
    "HarnessError",
    "assert_fixture_boundary",
    "load_corpus",
    "run_harness",
    "snapshot_git_worktree",
]
