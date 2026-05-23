from __future__ import annotations

import json
import os
import sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

SKILL_DIR = Path(__file__).resolve().parent.parent
if str(SKILL_DIR) not in sys.path:
    sys.path.insert(0, str(SKILL_DIR))

from scripts.sidecar_ledger import (  # noqa: E402
    SidecarLedgerRow,
    add_sidecar_row,
    classify_sidecar_owner,
    find_reusable_sidecar,
    ledger_path,
    load_or_create_owner_token,
    reclaim_stale,
    read_ledger,
)
from scripts import ensure_rerank_sidecar as ensure_module  # noqa: E402


def _row(
    *,
    pid: int = 100,
    port: int = 8765,
    owner: str = "owner-a",
    config_hash: str = "hash-a",
) -> SidecarLedgerRow:
    return SidecarLedgerRow(
        pid=pid,
        port=port,
        ownerToken=owner,
        startedAtIso="2026-05-22T00:00:00Z",
        lastHealthIso="2026-05-22T00:00:00Z",
        executablePath="/usr/bin/python3",
        canonicalConfigHash=config_hash,
    )


def test_healthy_matching_owner_reuses_and_refreshes_health_timestamp(tmp_path):
    add_sidecar_row(tmp_path, _row())

    reusable, classifications = find_reusable_sidecar(
        tmp_path,
        expected_owner_token="owner-a",
        canonical_config_hash="hash-a",
        health_check=lambda port: port == 8765,
        process_liveness_check=lambda pid: {"alive": True, "reason": "kill-success"},
        current_time_iso="2026-05-22T01:00:00Z",
    )

    assert reusable is not None
    assert reusable.pid == 100
    assert reusable.lastHealthIso == "2026-05-22T01:00:00Z"
    assert [item.classification for item in classifications] == ["healthy-reusable"]
    assert read_ledger(tmp_path)[0].lastHealthIso == "2026-05-22T01:00:00Z"


def test_unknown_owner_refuses_reuse_and_preserves_row(tmp_path):
    row = _row(owner="somebody-else")
    add_sidecar_row(tmp_path, row)

    reusable, classifications = find_reusable_sidecar(
        tmp_path,
        expected_owner_token="owner-a",
        canonical_config_hash="hash-a",
        health_check=lambda port: True,
        process_liveness_check=lambda pid: {"alive": True, "reason": "kill-success"},
    )

    assert reusable is None
    assert classifications[0].classification == "unknown-owner-refuse"
    assert read_ledger(tmp_path) == [row]


def test_stale_exact_pid_cleanup_reclaims_dead_row(tmp_path):
    add_sidecar_row(tmp_path, _row(pid=111))
    add_sidecar_row(tmp_path, _row(pid=222, port=8766))

    kept = reclaim_stale(
        tmp_path,
        process_liveness_check=lambda pid: {"alive": pid != 111, "reason": "dead" if pid == 111 else "kill-success"},
    )

    assert [row.pid for row in kept] == [222]
    assert [row.pid for row in read_ledger(tmp_path)] == [222]


def test_eperm_alive_is_unknown_and_not_reclaimed(tmp_path):
    row = _row()
    assert (
        classify_sidecar_owner(
            row,
            expected_owner_token="owner-a",
            canonical_config_hash="hash-a",
            health_check=lambda port: True,
            process_liveness_check=lambda pid: {"alive": True, "reason": "eperm-other-owner"},
        )
        == "eperm-unknown"
    )


def test_port_down_but_pid_alive_preserves_row(tmp_path):
    row = _row()
    add_sidecar_row(tmp_path, row)

    reusable, classifications = find_reusable_sidecar(
        tmp_path,
        expected_owner_token="owner-a",
        canonical_config_hash="hash-a",
        health_check=lambda port: False,
        process_liveness_check=lambda pid: {"alive": True, "reason": "kill-success"},
    )

    assert reusable is None
    assert classifications[0].classification == "port-unreachable"
    assert read_ledger(tmp_path) == [row]


def test_config_hash_mismatch_preserves_row(tmp_path):
    row = _row(config_hash="hash-old")
    add_sidecar_row(tmp_path, row)

    reusable, classifications = find_reusable_sidecar(
        tmp_path,
        expected_owner_token="owner-a",
        canonical_config_hash="hash-new",
        health_check=lambda port: True,
        process_liveness_check=lambda pid: {"alive": True, "reason": "kill-success"},
    )

    assert reusable is None
    assert classifications[0].classification == "config-hash-mismatch"
    assert read_ledger(tmp_path) == [row]


def test_atomic_write_uses_expected_schema(tmp_path):
    add_sidecar_row(tmp_path, _row())

    payload = json.loads(ledger_path(tmp_path).read_text(encoding="utf-8"))
    assert payload["version"] == 1
    assert payload["sidecars"][0]["ownerToken"] == "owner-a"


def test_concurrent_sidecar_adds_do_not_lose_rows(tmp_path):
    rows = [_row(pid=100 + idx, port=8765 + idx) for idx in range(8)]

    with ThreadPoolExecutor(max_workers=8) as pool:
        list(pool.map(lambda row: add_sidecar_row(tmp_path, row), rows))

    ledger_pids = {row.pid for row in read_ledger(tmp_path)}
    assert ledger_pids == {row.pid for row in rows}


def test_owner_token_is_random_persistent_and_not_path_hash(tmp_path, monkeypatch):
    monkeypatch.delenv("RERANK_SIDECAR_OWNER_TOKEN", raising=False)
    monkeypatch.setenv("SPECKIT_PROJECT_ROOT", str(tmp_path))

    token = load_or_create_owner_token(tmp_path)
    again = load_or_create_owner_token(tmp_path)

    assert token == again
    assert len(token) >= 32
    assert token != ensure_module.hashlib.sha256(str(tmp_path.resolve()).encode("utf-8")).hexdigest()


def test_health_probe_requires_owner_and_config_proof(monkeypatch):
    owner = "owner-a"
    config_hash = "hash-a"
    monkeypatch.setattr(
        ensure_module,
        "health_payload",
        lambda port, timeout_seconds=2.0: {
            "status": "ok",
            "owner_token_sha256": ensure_module._owner_token_digest(owner),
            "canonical_config_hash": config_hash,
        },
    )

    assert ensure_module.is_healthy(8765, expected_owner_token=owner, expected_config_hash=config_hash)
    assert not ensure_module.is_healthy(8765, expected_owner_token="owner-b", expected_config_hash=config_hash)
    assert not ensure_module.is_healthy(8765, expected_owner_token=owner, expected_config_hash="hash-b")


def test_ensure_reuses_healthy_ledger_owner(tmp_path, monkeypatch):
    monkeypatch.setenv("RERANK_SIDECAR_STATE_DIR", str(tmp_path))
    monkeypatch.setenv("RERANK_SIDECAR_OWNER_TOKEN", "owner-a")
    config_hash = ensure_module._canonical_config_hash(8765)
    add_sidecar_row(tmp_path, _row(pid=os.getpid(), config_hash=config_hash))

    monkeypatch.setattr(ensure_module, "is_healthy", lambda port, timeout_seconds=2.0, **kwargs: True)

    result = ensure_module.ensure_rerank_sidecar(
        port=8765,
        sidecar_skill_path=SKILL_DIR,
        skip_if_disabled=False,
    )

    assert result["spawned"] is False
    assert result["ownerPid"] == os.getpid()
    assert result["ledger"] == "healthy-reusable"


def test_ensure_unknown_owner_spawns_on_different_port(tmp_path, monkeypatch):
    monkeypatch.setenv("RERANK_SIDECAR_STATE_DIR", str(tmp_path))
    monkeypatch.setenv("RERANK_SIDECAR_OWNER_TOKEN", "owner-a")
    add_sidecar_row(
        tmp_path,
        _row(pid=os.getpid(), owner="owner-b", config_hash=ensure_module._canonical_config_hash(8765)),
    )
    spawned_ports: list[str] = []

    class FakeProc:
        pid = 999

        def poll(self):
            return None

    monkeypatch.setattr(ensure_module, "is_healthy", lambda port, timeout_seconds=2.0, **kwargs: port == 8765)
    monkeypatch.setattr(ensure_module, "wait_for_healthy", lambda port, deadline, **kwargs: True)
    monkeypatch.setattr(ensure_module, "_find_available_port", lambda preferred_port: 8766)
    monkeypatch.setattr(ensure_module, "_open_sidecar_log", lambda: None)

    def fake_popen(*args, **kwargs):
        spawned_ports.append(kwargs["env"]["RERANK_SIDECAR_PORT"])
        assert kwargs["env"]["RERANK_SIDECAR_OWNER_TOKEN"] == "owner-a"
        assert kwargs["env"]["RERANK_SIDECAR_CONFIG_HASH"] == ensure_module._canonical_config_hash(8766)
        return FakeProc()

    monkeypatch.setattr(ensure_module.subprocess, "Popen", fake_popen)

    result = ensure_module.ensure_rerank_sidecar(
        port=8765,
        sidecar_skill_path=SKILL_DIR,
        skip_if_disabled=False,
    )

    assert result["spawned"] is True
    assert result["port"] == 8766
    assert spawned_ports == ["8766"]
    assert {row.pid for row in read_ledger(tmp_path)} == {os.getpid(), 999}


def test_ensure_reclaims_stale_dead_pid_before_fresh_spawn(tmp_path, monkeypatch):
    monkeypatch.setenv("RERANK_SIDECAR_STATE_DIR", str(tmp_path))
    monkeypatch.setenv("RERANK_SIDECAR_OWNER_TOKEN", "owner-a")
    add_sidecar_row(
        tmp_path,
        _row(pid=987654321, config_hash=ensure_module._canonical_config_hash(8765)),
    )

    class FakeProc:
        pid = 202

        def poll(self):
            return None

    monkeypatch.setattr(ensure_module, "is_healthy", lambda port, timeout_seconds=2.0, **kwargs: False)
    monkeypatch.setattr(ensure_module, "wait_for_healthy", lambda port, deadline, **kwargs: True)
    monkeypatch.setattr(ensure_module, "_open_sidecar_log", lambda: None)
    monkeypatch.setattr(ensure_module.subprocess, "Popen", lambda *args, **kwargs: FakeProc())

    result = ensure_module.ensure_rerank_sidecar(
        port=8765,
        sidecar_skill_path=SKILL_DIR,
        skip_if_disabled=False,
    )

    assert result["spawned"] is True
    assert result["ownerPid"] == 202
    assert [row.pid for row in read_ledger(tmp_path)] == [202]


def test_ensure_records_spawned_sidecar_before_warmup_timeout(tmp_path, monkeypatch):
    monkeypatch.setenv("RERANK_SIDECAR_STATE_DIR", str(tmp_path))
    monkeypatch.setenv("RERANK_SIDECAR_OWNER_TOKEN", "owner-a")
    observed_during_warmup: list[int] = []
    sent_signals: list[tuple[int, int]] = []

    class FakeProc:
        pid = 303

        def __init__(self) -> None:
            self.wait_calls = 0

        def wait(self, timeout):
            self.wait_calls += 1
            if self.wait_calls == 1:
                raise ensure_module.subprocess.TimeoutExpired("sidecar", timeout)
            return 0

    fake_proc = FakeProc()

    def fake_wait_for_healthy(port, deadline, **kwargs):
        assert kwargs["expected_owner_token"] == "owner-a"
        assert kwargs["expected_config_hash"] == ensure_module._canonical_config_hash(8765)
        observed_during_warmup.extend(row.pid for row in read_ledger(tmp_path))
        return False

    monkeypatch.setattr(ensure_module, "is_healthy", lambda port, timeout_seconds=2.0: False)
    monkeypatch.setattr(ensure_module, "wait_for_healthy", fake_wait_for_healthy)
    monkeypatch.setattr(ensure_module, "_open_sidecar_log", lambda: None)
    monkeypatch.setattr(ensure_module.subprocess, "Popen", lambda *args, **kwargs: fake_proc)
    monkeypatch.setattr(ensure_module.os, "killpg", lambda pid, sig: sent_signals.append((pid, sig)))

    result = ensure_module.ensure_rerank_sidecar(
        port=8765,
        sidecar_skill_path=SKILL_DIR,
        skip_if_disabled=False,
        health_timeout_seconds=0.01,
    )

    assert observed_during_warmup == [303]
    assert result["fallback"] == "warmup-timeout"
    assert result["ledger"] == "recorded-before-warmup"
    assert result["termination"] == "killed"
    assert sent_signals == [
        (303, ensure_module.signal.SIGTERM),
        (303, ensure_module.signal.SIGKILL),
    ]
    assert read_ledger(tmp_path) == []


def test_node_and_python_ensure_helpers_share_config_hash_contract(tmp_path, monkeypatch):
    monkeypatch.setenv("RERANK_MODEL_NAME", "Qwen/Qwen3-Reranker-0.6B")
    monkeypatch.setenv("RERANK_MODEL_REVISION", "e61197ed45024b0ed8a2d74b80b4d909f1255473")
    monkeypatch.setenv("RERANK_ALLOWED_MODELS", "")
    monkeypatch.setenv("RERANK_MODEL_REVISIONS", "")
    cjs_path = SKILL_DIR.parents[1] / "bin" / "lib" / "ensure-rerank-sidecar.cjs"
    node_script = (
        f"const helper = require({json.dumps(str(cjs_path))});"
        "console.log(helper.canonicalConfigHash(8765, process.env));"
    )

    node_hash = ensure_module.subprocess.check_output(["node", "-e", node_script], text=True).strip()

    assert node_hash == ensure_module._canonical_config_hash(8765)


def test_start_script_parses_dotenv_without_shell_eval_and_forwards_api_key(tmp_path):
    skill_dir = tmp_path / "skill"
    scripts_dir = skill_dir / "scripts"
    python_path = skill_dir / ".venv" / "bin" / "python"
    output_path = tmp_path / "env.json"
    marker_path = tmp_path / "pwned"
    scripts_dir.mkdir(parents=True)
    python_path.parent.mkdir(parents=True)
    (scripts_dir / "start.sh").write_text((SKILL_DIR / "scripts" / "start.sh").read_text(encoding="utf-8"), encoding="utf-8")
    python_path.write_text(
        "#!/usr/bin/env python3\n"
        "import json, os\n"
        f"open({json.dumps(str(output_path))}, 'w').write(json.dumps(dict(os.environ)))\n",
        encoding="utf-8",
    )
    python_path.chmod(0o755)
    (skill_dir / ".venv" / "bin" / "activate").write_text("", encoding="utf-8")
    (skill_dir / ".env.local").write_text(
        "\n".join(
            [
                "RERANK_API_KEY=secret-value",
                f"RERANK_MODEL_NAME=$(touch {marker_path})",
                "NODE_OPTIONS=--require bad.js",
            ]
        ),
        encoding="utf-8",
    )

    ensure_module.subprocess.run(["bash", str(scripts_dir / "start.sh")], check=True, cwd=skill_dir)
    captured = json.loads(output_path.read_text(encoding="utf-8"))

    assert captured["RERANK_API_KEY"] == "secret-value"
    assert captured["RERANK_MODEL_NAME"] == f"$(touch {marker_path})"
    assert "NODE_OPTIONS" not in captured
    assert not marker_path.exists()


def test_use_model_restarts_by_ledger_not_command_substring():
    script = (SKILL_DIR / "scripts" / "use-model.sh").read_text(encoding="utf-8")

    assert "pkill -TERM -f" not in script
    assert "read_ledger" in script
    assert "ownerToken != owner_token" in script


def test_process_liveness_returns_structured_dict_matching_js_contract():
    """F102: Python processLiveness returns structured dict matching JS contract."""
    from scripts.sidecar_ledger import process_liveness

    # Test alive case
    result = process_liveness(os.getpid())
    assert isinstance(result, dict)
    assert result["alive"] is True
    assert result["reason"] == "kill-success"
    assert "errorCode" not in result

    # Test invalid pid case
    result = process_liveness(-1)
    assert result["alive"] is False
    assert result["reason"] == "invalid-pid"

    # Test dead pid case (use a very high pid that shouldn't exist)
    result = process_liveness(999999999)
    assert result["alive"] is False
    assert result["reason"] == "esrch"


def test_health_payload_uses_64kb_cap_matching_js():
    """F101: Python health payload uses 64KB cap matching JS MAX_HEALTH_BODY_BYTES."""
    from scripts import ensure_rerank_sidecar as ensure_module

    assert ensure_module.MAX_HEALTH_BODY_BYTES == 65536  # 64KB


def test_empty_revision_treated_as_not_set_in_config_hash():
    """F1: Empty revision string is treated as 'not set' in config hash."""
    from scripts import ensure_rerank_sidecar as ensure_module

    # Both empty string and missing env should use the same default
    import os
    old_rev = os.environ.get("RERANK_MODEL_REVISION")
    try:
        os.environ["RERANK_MODEL_REVISION"] = ""
        hash_empty = ensure_module._canonical_config_hash(8765)
        
        del os.environ["RERANK_MODEL_REVISION"]
        hash_missing = ensure_module._canonical_config_hash(8765)
        
        # Both should use the default revision
        assert hash_empty == hash_missing
    finally:
        if old_rev is not None:
            os.environ["RERANK_MODEL_REVISION"] = old_rev
        elif "RERANK_MODEL_REVISION" in os.environ:
            del os.environ["RERANK_MODEL_REVISION"]
