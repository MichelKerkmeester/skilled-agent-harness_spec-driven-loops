#!/usr/bin/env python3
"""Tests for sk-create-repo-rule's rule-experiment.py: schedule balance, transcript scoring and arm edits."""

import importlib.util
import json
from collections import Counter
from pathlib import Path

import pytest

HARNESS = Path(__file__).resolve().parents[2] / "sk-create-repo-rule" / "scripts" / "rule-experiment.py"
spec = importlib.util.spec_from_file_location("rule_experiment", HARNESS)
rx = importlib.util.module_from_spec(spec)
spec.loader.exec_module(rx)

TABLE_REPLY = "Here is the answer.\n\n| Option | Cost |\n|---|---|\n| A | 1 |\n\n" + "More detail. " * 40


def devin_export(path: Path, run_dir: str, steps: list) -> str:
    path.write_text(json.dumps({"steps": [{"source": "user", "message": "prompt"}] + steps}))
    return str(path)


def read_step(file_path: str) -> dict:
    return {"source": "agent", "tool_calls": [{"function_name": "read", "arguments": {"file_path": file_path}}]}


def test_schedule_gives_every_arm_every_prompt_equally_and_is_seeded() -> None:
    prompts = [{"id": f"p{i}"} for i in range(5)]
    jobs = rx.schedule(["a", "b"], prompts, repeat=2, seed=7)

    counts = Counter((arm, prompt["id"]) for arm, prompt, _ in jobs)
    assert len(jobs) == 20 and set(counts.values()) == {2}
    assert jobs == rx.schedule(["a", "b"], prompts, repeat=2, seed=7)
    assert jobs != rx.schedule(["a", "b"], prompts, repeat=2, seed=8)


def test_devin_reply_after_reading_the_rule_scores_table_and_delivery(tmp_path: Path) -> None:
    run_dir = str(tmp_path / "run")
    rules = f"{run_dir}/.skilled/repo-rules"
    export = devin_export(tmp_path / "t.json", run_dir, [
        read_step(f"{rules}/communication.md"),
        read_step(f"{rules}/communication-prose.md"),
        {"source": "agent", "message": TABLE_REPLY},
    ])
    record = {"exit": 0, "transcript": export, "run_dir": run_dir, "executor": "deepseek", "asked_table": False}

    scored = rx.score_run(record, {})

    assert scored["checks"]["table"] is True
    assert scored["communication_delivered"] and scored["reply_rules_delivered"]
    assert scored["wrote"] is False


def test_write_before_the_router_is_read_counts_as_a_gate5_miss(tmp_path: Path) -> None:
    run_dir = str(tmp_path / "run")
    export = devin_export(tmp_path / "t.json", run_dir, [
        {"source": "agent", "tool_calls": [{"function_name": "edit", "arguments": {"file_path": f"{run_dir}/src/a.py"}}]},
        read_step(f"{run_dir}/REPO RULES.md"),
        {"source": "agent", "message": "Done. " * 80},
    ])
    record = {"exit": 0, "transcript": export, "run_dir": run_dir, "executor": "deepseek"}

    scored = rx.score_run(record, {})

    assert scored["wrote"] is True and scored["gate5_ok"] is False
    assert rx.summarize([scored])["gate5_miss"]["k"] == 1


def test_failed_run_is_unscorable(tmp_path: Path) -> None:
    assert rx.score_run({"exit": "timeout", "transcript": None, "run_dir": str(tmp_path), "executor": "luna"}, {}) is None


def test_arm_edit_refuses_an_ambiguous_match(tmp_path: Path) -> None:
    (tmp_path / "rule.md").write_text("same\nsame\n")

    with pytest.raises(SystemExit, match="found 2"):
        rx.apply_edit(str(tmp_path), {"file": "rule.md", "replace": [["same", "other"]]}, str(tmp_path))


def test_newcombe_matches_the_published_worked_example() -> None:
    # Newcombe (1998), method 10: 56/70 minus 48/80 is 0.2000 with interval 0.0524 to 0.3339.
    diff = rx.newcombe(48, 80, 56, 70)

    assert round(diff["d"], 4) == 0.2
    assert [round(bound, 4) for bound in diff["ci95"]] == [0.0524, 0.3339]
    assert rx.newcombe(0, 0, 1, 2) is None


def test_rule_read_after_the_final_reply_is_not_delivered(tmp_path: Path) -> None:
    run_dir = str(tmp_path / "run")
    export = devin_export(tmp_path / "t.json", run_dir, [
        {"source": "agent", "message": "Interim note. " * 40},
        read_step(f"{run_dir}/.skilled/repo-rules/communication.md"),
        {"source": "agent", "message": TABLE_REPLY},
    ])
    early = rx.score_run({"exit": 0, "transcript": export, "run_dir": run_dir, "executor": "deepseek"}, {})
    assert early["communication_delivered"] is True

    late = devin_export(tmp_path / "late.json", run_dir, [
        {"source": "agent", "message": TABLE_REPLY},
        {"source": "agent", "tool_calls": [{"function_name": "read",
                                            "arguments": {"file_path": f"{run_dir}/.skilled/repo-rules/communication.md"}}]},
    ])
    scored = rx.score_run({"exit": 0, "transcript": late, "run_dir": run_dir, "executor": "deepseek"}, {})
    assert scored["communication_delivered"] is False


def test_quota_failures_are_not_recorded_and_stop_the_run(tmp_path: Path, monkeypatch) -> None:
    arms = tmp_path / "arms.json"
    arms.write_text(json.dumps({"arms": [{"name": "a"}, {"name": "b"}]}))
    prompts = tmp_path / "prompts.json"
    prompts.write_text(json.dumps({"prompts": [{"id": f"p{i}", "text": "q"} for i in range(10)]}))
    calls = []

    def quota_run(executor, template, run_dir, prompt, suffix):
        calls.append(prompt["id"])
        return {"run_dir": run_dir, "exit": 1, "seconds": 0.1,
                "error": "Your limit will reset in 43 minutes (at 05:11 UTC). \"cognition.ai/errorKind\": \"unavailable\""}

    monkeypatch.setattr(rx, "run_one", quota_run)
    out = tmp_path / "runs.jsonl"
    args = rx.argparse.Namespace(arms=str(arms), envs=str(tmp_path / "envs"), prompts=str(prompts), executor="luna",
                                 out=str(out), repeat=1, jobs=1, seed=1, limit=0)

    rx.run(args)

    assert out.read_text() == ""
    assert len(calls) < 20


def test_opencode_stream_scores_router_read_before_the_edit(tmp_path: Path) -> None:
    run_dir = str(tmp_path / "run")

    def tool(name, **arguments):
        return json.dumps({"type": "tool_use", "part": {"tool": name, "state": {"input": arguments}}})

    stream = tmp_path / "run.opencode.jsonl"
    stream.write_text("\n".join([
        tool("read", filePath=f"{run_dir}/REPO RULES.md"),
        tool("read", filePath=f"{run_dir}/.skilled/repo-rules/communication.md"),
        tool("edit", filePath=f"{run_dir}/src/orbit/cache.py"),
        json.dumps({"type": "text", "part": {"text": TABLE_REPLY}}),
    ]) + "\n")
    record = {"exit": 0, "transcript": str(stream), "run_dir": run_dir, "executor": "deepseek-oc"}

    scored = rx.score_run(record, {})

    assert scored["wrote"] and scored["gate5_ok"] and scored["communication_delivered"]
    assert scored["checks"]["table"] is True
