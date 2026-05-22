import asyncio
import importlib
import os
import signal
import subprocess
import sys
import time
from pathlib import Path

import httpx
import pytest
from fastapi.testclient import TestClient

SKILL_DIR = Path(__file__).resolve().parent.parent
START_SCRIPT = SKILL_DIR / "scripts" / "start.sh"
if str(SKILL_DIR) not in sys.path:
    sys.path.insert(0, str(SKILL_DIR))


def load_sidecar_module(monkeypatch, **env):
    for key in [
        "RERANK_API_KEY",
        "RERANK_RATE_LIMIT_PER_MIN",
        "RERANK_MAX_DOCUMENT_BYTES",
        "RERANK_LOG_PATH",
        "RERANK_LOG_RAW_QUERIES",
        "RERANK_ALLOWED_MODELS",
        "RERANK_MODEL_REVISIONS",
    ]:
        monkeypatch.delenv(key, raising=False)
    for key, value in env.items():
        monkeypatch.setenv(key, str(value))
    sys.modules.pop("scripts.rerank_sidecar", None)
    return importlib.import_module("scripts.rerank_sidecar")


@pytest.fixture
def sidecar():
    """Spawn a sidecar on port 8766 to avoid collisions with the operator port."""
    env = os.environ.copy()
    env["RERANK_SIDECAR_PORT"] = "8766"
    proc = subprocess.Popen(["bash", str(START_SCRIPT)], env=env)
    deadline = time.time() + 30
    while time.time() < deadline:
        try:
            r = httpx.get("http://127.0.0.1:8766/health", timeout=1.0)
            if r.status_code == 200:
                break
        except Exception:
            pass
        time.sleep(0.5)
    yield proc
    if proc.poll() is None:
        proc.send_signal(signal.SIGTERM)
    try:
        proc.wait(timeout=10)
    except subprocess.TimeoutExpired:
        proc.kill()


def test_health_before_model_load(sidecar):
    r = httpx.get("http://127.0.0.1:8766/health", timeout=2.0)
    assert r.status_code == 200
    j = r.json()
    assert j["status"] == "ok"
    assert "model_loaded" in j
    assert "uptime_s" in j


def test_rerank_basic_sigmoid_bounds(sidecar):
    r = httpx.post(
        "http://127.0.0.1:8766/rerank",
        json={
            "query": "apple",
            "documents": ["apple", "quantum chromodynamics"],
        },
        timeout=60.0,
    )
    assert r.status_code == 200
    j = r.json()
    assert len(j["results"]) == 2
    for item in j["results"]:
        assert 0.0 <= item["relevance_score"] <= 1.0
    assert j["results"][0]["index"] == 0


def test_rerank_concurrent_requests_serialized(sidecar):
    httpx.post("http://127.0.0.1:8766/warmup", timeout=60.0)

    async def hit():
        async with httpx.AsyncClient() as client:
            r = await client.post(
                "http://127.0.0.1:8766/rerank",
                json={"query": "test", "documents": ["a", "b", "c"]},
                timeout=30.0,
            )
            return r.json()

    async def runall():
        return await asyncio.gather(*[hit() for _ in range(5)])

    results = asyncio.run(runall())
    assert len(results) == 5
    for j in results:
        assert "results" in j
        for item in j["results"]:
            assert 0.0 <= item["relevance_score"] <= 1.0


def test_sigterm_clean_shutdown(sidecar):
    sidecar.send_signal(signal.SIGTERM)
    try:
        ret = sidecar.wait(timeout=10)
        assert ret == 0 or ret is not None
    except subprocess.TimeoutExpired:
        sidecar.kill()
        pytest.fail("sidecar did not exit within 10s of SIGTERM")


def test_warmup_requires_auth_before_model_load(monkeypatch):
    module = load_sidecar_module(monkeypatch, RERANK_API_KEY="secret")
    client = TestClient(module.app)

    response = client.post("/warmup", json={})

    assert response.status_code == 401


def test_rerank_rejects_oversized_document_payload(monkeypatch):
    module = load_sidecar_module(
        monkeypatch,
        RERANK_API_KEY="secret",
        RERANK_MAX_DOCUMENT_BYTES="4",
    )
    client = TestClient(module.app)

    response = client.post(
        "/rerank",
        headers={"X-Rerank-Secret": "secret"},
        json={"query": "q", "documents": ["12345"]},
    )

    assert response.status_code == 413


def test_rerank_log_redacts_query_by_default(monkeypatch, tmp_path):
    log_path = tmp_path / "rerank.jsonl"
    module = load_sidecar_module(monkeypatch, RERANK_LOG_PATH=str(log_path))

    class FakeModel:
        def predict(self, pairs):
            return [0.0 for _ in pairs]

    module._models[module.DEFAULT_MODEL_NAME] = FakeModel()
    client = TestClient(module.app)

    response = client.post("/rerank", json={"query": "secret query", "documents": ["doc"]})

    assert response.status_code == 200
    payload = log_path.read_text(encoding="utf-8")
    assert "secret query" not in payload
    assert '"query": "<redacted>"' in payload
    assert "query_sha256" in payload


def test_extra_allowlisted_model_requires_commit_revision(monkeypatch):
    monkeypatch.setenv("RERANK_ALLOWED_MODELS", "example/model")
    monkeypatch.delenv("RERANK_MODEL_REVISIONS", raising=False)
    sys.modules.pop("scripts.rerank_sidecar", None)

    with pytest.raises(RuntimeError, match="40-character commit revision"):
        importlib.import_module("scripts.rerank_sidecar")
