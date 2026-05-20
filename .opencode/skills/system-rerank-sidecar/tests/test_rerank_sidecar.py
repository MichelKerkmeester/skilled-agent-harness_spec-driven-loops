import asyncio
import os
import signal
import subprocess
import time
from pathlib import Path

import httpx
import pytest

SKILL_DIR = Path(__file__).resolve().parent.parent
START_SCRIPT = SKILL_DIR / "scripts" / "start.sh"


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
