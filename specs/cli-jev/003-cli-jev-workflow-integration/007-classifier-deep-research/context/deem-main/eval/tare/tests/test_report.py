"""End-to-end tests for the Tare report generator."""

import json

import pytest

import report as report_mod


FIXTURE = [
    {"domain": "routing", "question_id": "r1",
     "probabilities": [0.9, 0.1], "correct_answer": 0},
    {"domain": "routing", "question_id": "r2",
     "probabilities": [0.2, 0.8], "correct_answer": 1},
    {"domain": "routing", "question_id": "r3",
     "probabilities": [0.6, 0.4], "correct_answer": 1},
    {"domain": "routing", "question_id": "n1", "kind": "negation",
     "p_a": 0.72, "p_not_a": 0.47, "ground_truth": True},
    {"domain": "routing", "question_id": "p1", "kind": "permutation",
     "predictions": [0, 0, 1]},
    {"domain": "routing", "question_id": "t1", "kind": "paraphrase",
     "predictions": [1, 1, 2]},
    {"domain": "extraction", "question_id": "e1",
     "probabilities": [1.0, 0.0], "correct_answer": 0},
]


def test_build_report_structure():
    out = report_mod.build_report(FIXTURE, 0.9)
    assert set(out.keys()) == {"routing", "extraction"}
    routing = out["routing"]
    assert routing["n_decisions"] == 3
    assert routing["accuracy"] == pytest.approx(2 / 3)
    assert "automation_at_0.9" in routing
    assert routing["negation"]["consistency_error"] == pytest.approx(0.19)
    assert routing["negation"]["paired_accuracy"] == 1.0
    assert routing["permutation"]["flip_rate"] == 1.0
    assert routing["paraphrase"]["consistency"] == pytest.approx(0.0)
    extraction = out["extraction"]
    assert extraction["n_decisions"] == 1
    assert "negation" not in extraction


def test_report_cli_json(tmp_path):
    path = tmp_path / "results.json"
    path.write_text(json.dumps(FIXTURE))
    got = json.loads(
        __import__("json").dumps(
            report_mod.build_report(
                json.loads(path.read_text()), 0.9
            )
        )
    )
    assert "routing" in got


def test_report_cli_text(tmp_path, capsys):
    path = tmp_path / "results.json"
    path.write_text(json.dumps(FIXTURE))
    code = report_mod.main([str(path)])
    assert code == 0
    out = capsys.readouterr().out
    assert "TARE" in out
    assert "routing" in out
    assert "negation" in out


def test_report_cli_json_flag(tmp_path, capsys):
    path = tmp_path / "results.json"
    path.write_text(json.dumps(FIXTURE))
    code = report_mod.main([str(path), "--format", "json"])
    assert code == 0
    out = capsys.readouterr().out
    parsed = json.loads(out)
    assert parsed["routing"]["accuracy"] == pytest.approx(2 / 3)


def test_report_cli_target_acc(tmp_path, capsys):
    path = tmp_path / "results.json"
    path.write_text(json.dumps(FIXTURE))
    report_mod.main([str(path), "--format", "json", "--target-acc", "0.5"])
    out = json.loads(capsys.readouterr().out)
    assert "automation_at_0.5" in out["routing"]


def test_report_rejects_non_list(tmp_path):
    path = tmp_path / "bad.json"
    path.write_text(json.dumps({"not": "a list"}))
    with pytest.raises(ValueError):
        report_mod.main([str(path)])


def test_report_rejects_record_without_domain(tmp_path):
    path = tmp_path / "bad.json"
    path.write_text(json.dumps([{"probabilities": [1.0]}]))
    with pytest.raises(ValueError):
        report_mod.main([str(path)])
