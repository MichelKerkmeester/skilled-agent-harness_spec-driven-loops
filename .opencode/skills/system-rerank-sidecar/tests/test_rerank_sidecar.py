#!/usr/bin/env python3
"""Tests for rerank sidecar HTTP behavior, self-reaper gates, and telemetry."""

import asyncio
import importlib
import json
import sys
import types
from datetime import timedelta
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

SKILL_DIR = Path(__file__).resolve().parent.parent
if str(SKILL_DIR) not in sys.path:
    sys.path.insert(0, str(SKILL_DIR))


class FakeCrossEncoder:
    def __init__(self, *_args, **_kwargs):
        pass

    def predict(self, pairs):
        return [1.0 - index for index, _pair in enumerate(pairs)]


def install_fake_sentence_transformers(monkeypatch):
    fake_module = types.ModuleType("sentence_transformers")
    fake_module.CrossEncoder = FakeCrossEncoder
    monkeypatch.setitem(sys.modules, "sentence_transformers", fake_module)


def load_sidecar_module(monkeypatch, **env):
    install_fake_sentence_transformers(monkeypatch)
    for key in [
        "RERANK_API_KEY",
        "RERANK_RATE_LIMIT_PER_MIN",
        "RERANK_MAX_DOCUMENT_BYTES",
        "RERANK_LOG_PATH",
        "RERANK_LOG_RAW_QUERIES",
        "RERANK_ALLOWED_MODELS",
        "RERANK_MODEL_REVISIONS",
        "RERANK_SIDECAR_PORT",
        "RERANK_SIDECAR_STATE_DIR",
        "RERANK_SIDECAR_REAPER_DISABLE",
        "RERANK_SIDECAR_REAPER_HEARTBEAT_SECONDS",
        "RERANK_SIDECAR_IDLE_TIMEOUT_SECONDS",
        "RERANK_SIDECAR_REAPER_TELEMETRY_PATH",
    ]:
        monkeypatch.delenv(key, raising=False)
    if "RERANK_SIDECAR_REAPER_DISABLE" not in env:
        monkeypatch.setenv("RERANK_SIDECAR_REAPER_DISABLE", "1")
    for key, value in env.items():
        monkeypatch.setenv(key, str(value))
    sys.modules.pop("scripts.rerank_sidecar", None)
    return importlib.import_module("scripts.rerank_sidecar")


def make_owner(module, pid=4242, source="pytest"):
    return module.sidecar_ledger.SidecarOwner(
        pid=pid,
        createTimestamp="Sat May 23 10:01:02 2026",
        comm="pytest",
        ownerId=f"{source}:{pid}",
        registeredAtIso=module.sidecar_ledger.now_iso(),
        lastSeenIso=module.sidecar_ledger.now_iso(),
        source=source,
    )


def write_sidecar_row(module, state_dir, owners):
    row = module.sidecar_ledger.SidecarLedgerRow(
        pid=9999,
        port=module.PORT,
        ownerToken="owner-token",
        startedAtIso=module.sidecar_ledger.now_iso(),
        lastHealthIso=module.sidecar_ledger.now_iso(),
        executablePath=sys.executable,
        canonicalConfigHash="config-hash",
        owners=tuple(owners),
    )
    module.sidecar_ledger.write_ledger_atomic(state_dir, [row])


def run(coro):
    return asyncio.run(coro)


def test_health_before_model_load(monkeypatch):
    module = load_sidecar_module(monkeypatch)
    client = TestClient(module.app)

    response = client.get("/health")

    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] == "ok"
    assert payload["model_loaded"] is False
    assert "uptime_s" in payload


def test_rerank_basic_sigmoid_bounds(monkeypatch):
    module = load_sidecar_module(monkeypatch)
    client = TestClient(module.app)

    response = client.post(
        "/rerank",
        json={"query": "apple", "documents": ["apple", "quantum chromodynamics"]},
    )

    assert response.status_code == 200
    payload = response.json()
    assert len(payload["results"]) == 2
    assert payload["results"][0]["index"] == 0
    for item in payload["results"]:
        assert 0.0 <= item["relevance_score"] <= 1.0


def test_rerank_concurrent_requests_serialized(monkeypatch):
    module = load_sidecar_module(monkeypatch)

    async def hit():
        req = module.RerankRequest(query="test", documents=["a", "b", "c"])
        return await module.rerank(req)

    async def run_all():
        return await asyncio.gather(*[hit() for _ in range(5)])

    results = run(run_all())

    assert len(results) == 5
    for result in results:
        assert len(result.results) == 3
        for item in result.results:
            assert 0.0 <= item.relevance_score <= 1.0


def test_lifespan_cleans_models_on_shutdown(monkeypatch):
    module = load_sidecar_module(monkeypatch)
    module._models[module.DEFAULT_MODEL_NAME] = FakeCrossEncoder()

    with TestClient(module.app):
        assert module._models

    assert module._models == {}


def test_warmup_requires_auth_before_model_load(monkeypatch):
    module = load_sidecar_module(monkeypatch, RERANK_API_KEY="secret")
    client = TestClient(module.app)

    response = client.post("/warmup", json={})

    assert response.status_code == 401
    assert module._models == {}


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
    client = TestClient(module.app)

    response = client.post("/rerank", json={"query": "secret query", "documents": ["doc"]})

    assert response.status_code == 200
    payload = log_path.read_text(encoding="utf-8")
    assert "secret query" not in payload
    assert '"query": "<redacted>"' in payload
    assert "query_sha256" in payload


def test_extra_allowlisted_model_requires_commit_revision(monkeypatch):
    install_fake_sentence_transformers(monkeypatch)
    monkeypatch.setenv("RERANK_ALLOWED_MODELS", "example/model")
    monkeypatch.delenv("RERANK_MODEL_REVISIONS", raising=False)
    sys.modules.pop("scripts.rerank_sidecar", None)

    with pytest.raises(RuntimeError, match="40-character commit revision"):
        importlib.import_module("scripts.rerank_sidecar")


def test_in_flight_gate_blocks_reap(monkeypatch, tmp_path):
    telemetry_path = tmp_path / "reaper.jsonl"
    module = load_sidecar_module(
        monkeypatch,
        RERANK_SIDECAR_REAPER_DISABLE="0",
        RERANK_SIDECAR_STATE_DIR=str(tmp_path),
        RERANK_SIDECAR_REAPER_TELEMETRY_PATH=str(telemetry_path),
    )
    write_sidecar_row(module, tmp_path, [make_owner(module)])
    monkeypatch.setattr(
        module.sidecar_ledger,
        "process_liveness",
        lambda *_args, **_kwargs: {"alive": False, "reason": "kill-0-esrch"},
    )
    kills = []
    monkeypatch.setattr(module.os, "kill", lambda pid, sig: kills.append((pid, sig)))

    async def scenario():
        await module.in_flight_gate.enter()
        try:
            fired = await module.evaluate_reaper_once()
            assert fired is False
            assert kills == []
            assert module._shutdown_pending is not None
        finally:
            await module.in_flight_gate.exit()
        await module._maybe_exit_after_request_drained()

    run(scenario())

    assert kills == [(module.os.getpid(), module.signal.SIGTERM)]
    event = json.loads(telemetry_path.read_text(encoding="utf-8").splitlines()[-1])
    assert event["event_type"] == "reap"
    assert event["reason"] == "all-owners-dead"


def test_health_does_not_refresh_idle(monkeypatch, tmp_path):
    telemetry_path = tmp_path / "reaper.jsonl"
    module = load_sidecar_module(
        monkeypatch,
        RERANK_SIDECAR_REAPER_DISABLE="0",
        RERANK_SIDECAR_STATE_DIR=str(tmp_path),
        RERANK_SIDECAR_IDLE_TIMEOUT_SECONDS="0.001",
        RERANK_SIDECAR_REAPER_TELEMETRY_PATH=str(telemetry_path),
    )
    module._last_request_at = module._utcnow() - timedelta(seconds=5)
    client = TestClient(module.app)
    kills = []
    monkeypatch.setattr(module.os, "kill", lambda pid, sig: kills.append((pid, sig)))

    for _ in range(3):
        assert client.get("/health").status_code == 200

    run(module.evaluate_reaper_once())

    assert kills == [(module.os.getpid(), module.signal.SIGTERM)]
    event = json.loads(telemetry_path.read_text(encoding="utf-8").splitlines()[-1])
    assert event["event_type"] == "idle-exit"
    assert event["idle_seconds"] >= 5


def test_all_owners_dead_triggers_reap(monkeypatch, tmp_path):
    telemetry_path = tmp_path / "reaper.jsonl"
    module = load_sidecar_module(
        monkeypatch,
        RERANK_SIDECAR_REAPER_DISABLE="0",
        RERANK_SIDECAR_STATE_DIR=str(tmp_path),
        RERANK_SIDECAR_REAPER_TELEMETRY_PATH=str(telemetry_path),
    )
    write_sidecar_row(module, tmp_path, [make_owner(module, pid=5001), make_owner(module, pid=5002)])
    monkeypatch.setattr(
        module.sidecar_ledger,
        "process_liveness",
        lambda *_args, **_kwargs: {"alive": False, "reason": "kill-0-esrch"},
    )
    kills = []
    monkeypatch.setattr(module.os, "kill", lambda pid, sig: kills.append((pid, sig)))

    fired = run(module.evaluate_reaper_once())

    assert fired is True
    assert kills == [(module.os.getpid(), module.signal.SIGTERM)]
    event = json.loads(telemetry_path.read_text(encoding="utf-8").splitlines()[-1])
    assert event["owners_state"] == [
        {"pid": 5001, "alive": False, "reason": "kill-0-esrch"},
        {"pid": 5002, "alive": False, "reason": "kill-0-esrch"},
    ]


def test_partial_owner_death_no_reap(monkeypatch, tmp_path):
    module = load_sidecar_module(
        monkeypatch,
        RERANK_SIDECAR_REAPER_DISABLE="0",
        RERANK_SIDECAR_STATE_DIR=str(tmp_path),
    )
    write_sidecar_row(module, tmp_path, [make_owner(module, pid=5001), make_owner(module, pid=5002)])

    def liveness(pid, *_args):
        if pid == 5001:
            return {"alive": False, "reason": "kill-0-esrch"}
        return {"alive": True, "reason": "ok"}

    monkeypatch.setattr(module.sidecar_ledger, "process_liveness", liveness)
    kills = []
    monkeypatch.setattr(module.os, "kill", lambda pid, sig: kills.append((pid, sig)))

    fired = run(module.evaluate_reaper_once())

    assert fired is False
    assert kills == []


def test_idle_timeout_fires(monkeypatch, tmp_path):
    telemetry_path = tmp_path / "reaper.jsonl"
    module = load_sidecar_module(
        monkeypatch,
        RERANK_SIDECAR_REAPER_DISABLE="0",
        RERANK_SIDECAR_STATE_DIR=str(tmp_path),
        RERANK_SIDECAR_IDLE_TIMEOUT_SECONDS="0.001",
        RERANK_SIDECAR_REAPER_TELEMETRY_PATH=str(telemetry_path),
    )
    module._last_request_at = module._utcnow() - timedelta(seconds=2)
    kills = []
    monkeypatch.setattr(module.os, "kill", lambda pid, sig: kills.append((pid, sig)))

    fired = run(module.evaluate_reaper_once())

    assert fired is True
    assert kills == [(module.os.getpid(), module.signal.SIGTERM)]
    event = json.loads(telemetry_path.read_text(encoding="utf-8").splitlines()[-1])
    assert event["event_type"] == "idle-exit"
    assert event["reason"] == "idle-timeout"


def test_telemetry_jsonl_written(monkeypatch, tmp_path):
    telemetry_path = tmp_path / "reaper.jsonl"
    module = load_sidecar_module(
        monkeypatch,
        RERANK_SIDECAR_REAPER_TELEMETRY_PATH=str(telemetry_path),
    )

    module.write_reaper_event(
        "reap",
        "all-owners-dead",
        {
            "owners_state": [{"pid": 123, "alive": False, "reason": "kill-0-esrch"}],
            "in_flight_count": 0,
            "idle_seconds": 42,
        },
    )

    lines = telemetry_path.read_text(encoding="utf-8").splitlines()
    assert len(lines) == 1
    event = json.loads(lines[0])
    assert event["event_type"] == "reap"
    assert event["sidecar_pid"] == module.os.getpid()
    assert event["port"] == module.PORT
    assert event["owners_state"] == [{"pid": 123, "alive": False, "reason": "kill-0-esrch"}]
    assert event["in_flight_count"] == 0
    assert event["idle_seconds"] == 42
    assert event["reason"] == "all-owners-dead"


def test_manual_debug_opt_out(monkeypatch):
    module = load_sidecar_module(monkeypatch, RERANK_SIDECAR_REAPER_DISABLE="1")

    async def fail_reaper_loop():
        raise AssertionError("reaper task should not start when disabled")

    monkeypatch.setattr(module, "reaper_loop", fail_reaper_loop)

    with TestClient(module.app) as client:
        assert client.get("/health").status_code == 200
