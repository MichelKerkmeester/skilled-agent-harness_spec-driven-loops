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
