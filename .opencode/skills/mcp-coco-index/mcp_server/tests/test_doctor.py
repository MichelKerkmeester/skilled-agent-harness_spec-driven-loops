"""Tests for the `ccc doctor` operator health report."""

from __future__ import annotations

import json
from pathlib import Path

import pytest
from typer.testing import CliRunner

from cocoindex_code import cli
from cocoindex_code.config import Config
from cocoindex_code.protocol import ProjectStatusResponse


runner = CliRunner()


def _static_pass_check(check_id: str, name: str) -> cli.DoctorCheck:
    return cli.DoctorCheck(
        id=check_id,
        name=name,
        status="PASS",
        message="ok",
        remediation="No action needed.",
        details={},
    )


def _status(chunks: int = 0) -> ProjectStatusResponse:
    return ProjectStatusResponse(
        indexing=False,
        total_chunks=chunks,
        total_files=0,
        languages={},
        index_exists=True,
    )


@pytest.fixture
def deterministic_doctor(monkeypatch: pytest.MonkeyPatch, tmp_path: Path) -> None:
    monkeypatch.setattr(cli, "_check_cli_parity", lambda: _static_pass_check("CHECK-1", "Global-vs-venv CLI parity"))
    monkeypatch.setattr(
        cli,
        "_check_sentence_transformers_version",
        lambda: _static_pass_check("CHECK-2", "Sentence-transformers freshness"),
    )
    monkeypatch.setattr(cli, "_project_status_if_available", lambda: (_status(), str(tmp_path), None))


def test_doctor_passes_on_clean_state(
    monkeypatch: pytest.MonkeyPatch,
    deterministic_doctor: None,
) -> None:
    monkeypatch.setenv("COCOINDEX_RERANK_MODEL", "BAAI/bge-reranker-v2-m3")

    result = runner.invoke(cli.app, ["doctor"])

    assert result.exit_code == 0
    assert "CHECK-1 PASS" in result.output
    assert "CHECK-6 PASS" in result.output


def test_doctor_warns_on_cc_by_nc_reranker(
    monkeypatch: pytest.MonkeyPatch,
    deterministic_doctor: None,
) -> None:
    monkeypatch.setenv("COCOINDEX_RERANK_MODEL", "jinaai/jina-reranker-v3")

    result = runner.invoke(cli.app, ["doctor"])

    assert result.exit_code == 1
    assert "CHECK-4 WARN" in result.output
    assert "jinaai/jina-reranker-v3 is CC BY-NC 4.0" in result.output


def test_doctor_fails_on_commercial_safe_profile_with_nc_reranker(
    monkeypatch: pytest.MonkeyPatch,
    deterministic_doctor: None,
) -> None:
    monkeypatch.setenv("COCOINDEX_COMMERCIAL_SAFE_PROFILE", "true")
    monkeypatch.setenv("COCOINDEX_RERANK_MODEL", "jinaai/jina-reranker-v3")

    result = runner.invoke(cli.app, ["doctor"])

    assert result.exit_code == 2
    assert "CHECK-4 FAIL" in result.output
    assert "BAAI/bge-reranker-v2-m3" in result.output


def test_doctor_json_output(
    monkeypatch: pytest.MonkeyPatch,
    deterministic_doctor: None,
) -> None:
    monkeypatch.setenv("COCOINDEX_RERANK_MODEL", "BAAI/bge-reranker-v2-m3")

    result = runner.invoke(cli.app, ["doctor", "--json"])

    assert result.exit_code == 0
    payload = json.loads(result.output)
    assert len(payload["checks"]) == 7
    assert payload["summary"]["total"] == 7


def test_commercial_safe_profile_blocks_jina_v3(
    monkeypatch: pytest.MonkeyPatch,
    tmp_path: Path,
) -> None:
    monkeypatch.setenv("COCOINDEX_CODE_ROOT_PATH", str(tmp_path))
    monkeypatch.setenv("COCOINDEX_COMMERCIAL_SAFE_PROFILE", "true")
    monkeypatch.setenv("COCOINDEX_RERANK_MODEL", "jinaai/jina-reranker-v3")

    with pytest.raises(ValueError, match="COCOINDEX_COMMERCIAL_SAFE_PROFILE_MODEL_BLOCKED"):
        Config.from_env()


def test_reindex_cost_estimator() -> None:
    assert cli.estimate_reindex_seconds(80_000, "sbert/nomic-ai/CodeRankEmbed") == 25 * 60
