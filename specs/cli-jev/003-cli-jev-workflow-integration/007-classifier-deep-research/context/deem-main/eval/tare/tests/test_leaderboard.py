"""Tests for the Tare leaderboard ingest, validation and ranking."""

import json

import pytest

import leaderboard
from leaderboard import (
    LeaderboardError,
    load_entry,
    load_entries,
    rank,
    render_markdown,
)


def _write(path, data):
    path.write_text(json.dumps(data), encoding="utf-8")
    return path


class TestNativeEntryIngest:
    def test_extraction_from_synthetic_artifacts(self, tmp_path):
        root = tmp_path
        art = _write(root / "results.json", {
            "n_eval_rows": 3,
            "v9": {
                "per_dataset": {
                    "a": {"n": 2, "accuracy": 0.5, "ece": 0.0},
                    "b": {"n": 1, "accuracy": 1.0, "ece": 0.2},
                },
                "avg_accuracy": 0.75,
                "avg_ece": 0.1,
            },
        })
        entry_path = _write(root / "entry.json", {
            "model": "m",
            "adapters": {"eval": {"artifact": "results.json", "key": "v9"}},
        })
        entry = load_entry(entry_path, repo_root=root)
        assert entry["metrics"]["macro_accuracy"]["value"] == pytest.approx(0.75)
        assert entry["metrics"]["macro_ece_pre_scaling"]["value"] == pytest.approx(0.1)
        # every metric cites the artifact it came from
        assert entry["metrics"]["macro_accuracy"]["artifact"] == "results.json"
        assert art.exists()

    def test_missing_artifact_rejected(self, tmp_path):
        entry_path = _write(tmp_path / "entry.json", {
            "model": "m",
            "adapters": {"eval": {"artifact": "nope.json", "key": "v9"}},
        })
        with pytest.raises(LeaderboardError, match="artifact not found"):
            load_entry(entry_path, repo_root=tmp_path)

    def test_missing_key_rejected(self, tmp_path):
        _write(tmp_path / "results.json", {"v9": {"per_dataset": {}}})
        entry_path = _write(tmp_path / "entry.json", {
            "model": "m",
            "adapters": {"eval": {"artifact": "results.json", "key": "v8"}},
        })
        with pytest.raises(LeaderboardError, match="no key 'v8'"):
            load_entry(entry_path, repo_root=tmp_path)

    def test_metric_cited_twice_rejected(self, tmp_path):
        # a genuine clash: two adapters that both emit macro_accuracy
        _write(tmp_path / "results.json", {
            "n_eval_rows": 3,
            "v9": {
                "per_dataset": {"a": {"n": 1, "accuracy": 0.5, "ece": 0.0}},
                "avg_accuracy": 0.5,
                "avg_ece": 0.0,
            },
        })
        _write(tmp_path / "rlcd.json", {
            "v9": {
                "exact_laws": {"macro_brier": 0.1, "macro_accuracy": 0.9},
                "dev_sample": {"macro_accuracy": 0.5},
            },
        })
        entry_path = _write(tmp_path / "entry2.json", {
            "model": "m",
            "adapters": {
                "eval": {"artifact": "results.json", "key": "v9"},
                "rlcd_eval": {"artifact": "rlcd.json", "key": "v9"},
            },
        })
        with pytest.raises(LeaderboardError, match="twice"):
            load_entry(entry_path, repo_root=tmp_path)

    def test_unknown_adapter_rejected(self, tmp_path):
        entry_path = _write(tmp_path / "entry.json", {
            "model": "m",
            "adapters": {"bogus": {"artifact": "x.json", "key": "k"}},
        })
        with pytest.raises(LeaderboardError, match="unknown adapter"):
            load_entry(entry_path, repo_root=tmp_path)

    def test_v6_calibration_adapter(self, tmp_path):
        _write(tmp_path / "results_v6.json", {
            "chosen_arm": "b_temp",
            "eval": {
                "raw": {"accuracy": 0.5, "ece": 0.2, "per_dataset": {}},
                "b_temp": {
                    "accuracy": 0.75,
                    "ece": 0.05,
                    "per_dataset": {
                        "a": {"n": 10, "accuracy": 0.8, "ece": 0.04,
                              "argmax_flips": 1},
                    },
                },
            },
        })
        entry_path = _write(tmp_path / "entry.json", {
            "model": "m",
            "adapters": {
                "v6_calibration": {
                    "artifact": "results_v6.json", "key": "eval",
                },
            },
        })
        entry = load_entry(entry_path, repo_root=tmp_path)
        m = entry["metrics"]
        assert m["macro_accuracy"]["value"] == pytest.approx(0.75)
        assert m["macro_ece_pre_scaling"]["value"] == pytest.approx(0.2)
        assert m["macro_ece_post_scaling"]["value"] == pytest.approx(0.05)

    def test_v6_calibration_without_chosen_arm_rejected(self, tmp_path):
        _write(tmp_path / "results_v6.json", {
            "eval": {"raw": {"accuracy": 0.5, "ece": 0.2, "per_dataset": {}}},
        })
        entry_path = _write(tmp_path / "entry.json", {
            "model": "m",
            "adapters": {
                "v6_calibration": {
                    "artifact": "results_v6.json", "key": "eval",
                },
            },
        })
        with pytest.raises(LeaderboardError, match="chosen_arm"):
            load_entry(entry_path, repo_root=tmp_path)


class TestThirdPartyEntryIngest:
    def test_url_artifact_accepted(self, tmp_path):
        entry_path = _write(tmp_path / "entry.json", {
            "model": "third-party-model",
            "submitter": "someone",
            "metrics": {
                "macro_accuracy": {
                    "value": 0.6,
                    "artifact": "https://example.com/results.json",
                },
            },
        })
        entry = load_entry(entry_path, repo_root=tmp_path)
        assert entry["metrics"]["macro_accuracy"]["value"] == pytest.approx(0.6)

    def test_metric_without_artifact_rejected(self, tmp_path):
        entry_path = _write(tmp_path / "entry.json", {
            "model": "m",
            "metrics": {"macro_accuracy": {"value": 0.6}},
        })
        with pytest.raises(LeaderboardError, match="cites no artifact"):
            load_entry(entry_path, repo_root=tmp_path)

    def test_unknown_metric_rejected(self, tmp_path):
        entry_path = _write(tmp_path / "entry.json", {
            "model": "m",
            "metrics": {
                "macro_accurcy": {
                    "value": 0.6,
                    "artifact": "https://example.com/r.json",
                },
            },
        })
        with pytest.raises(LeaderboardError, match="unknown metric"):
            load_entry(entry_path, repo_root=tmp_path)

    def test_non_numeric_value_rejected(self, tmp_path):
        entry_path = _write(tmp_path / "entry.json", {
            "model": "m",
            "metrics": {
                "macro_accuracy": {
                    "value": "0.6",
                    "artifact": "https://example.com/r.json",
                },
            },
        })
        with pytest.raises(LeaderboardError, match="numeric"):
            load_entry(entry_path, repo_root=tmp_path)


class TestEntryValidation:
    def test_neither_adapters_nor_metrics_rejected(self, tmp_path):
        entry_path = _write(tmp_path / "entry.json", {"model": "m"})
        with pytest.raises(LeaderboardError, match="nothing to score"):
            load_entry(entry_path, repo_root=tmp_path)

    def test_both_rejected(self, tmp_path):
        entry_path = _write(tmp_path / "entry.json", {
            "model": "m",
            "adapters": {},
            "metrics": {},
        })
        with pytest.raises(LeaderboardError, match="both"):
            load_entry(entry_path, repo_root=tmp_path)

    def test_model_required(self, tmp_path):
        entry_path = _write(tmp_path / "entry.json", {"metrics": {}})
        with pytest.raises(LeaderboardError, match="model"):
            load_entry(entry_path, repo_root=tmp_path)


class TestRankingAndRendering:
    def _entry(self, name, acc):
        return {
            "model": name,
            "backbone": None,
            "date": None,
            "submitter": None,
            "notes": [],
            "metrics": (
                {"macro_accuracy": {
                    "value": acc, "artifact": "x", "protocol": "p",
                }}
            ),
            "extra": {},
        }

    def test_rank_best_accuracy_first(self):
        ranked = rank([
            self._entry("low", 0.5),
            self._entry("high", 0.9),
            self._entry("mid", 0.7),
        ])
        assert [e["model"] for e in ranked] == ["high", "mid", "low"]

    def test_rank_missing_accuracy_sorts_last(self):
        ranked = rank([
            {"model": "no-acc", "metrics": {}},
            self._entry("acc", 0.1),
        ])
        assert ranked[0]["model"] == "acc"
        assert ranked[1]["model"] == "no-acc"

    def test_render_markdown_contains_models_and_missing_marker(self):
        md = render_markdown([
            self._entry("alpha", 0.9),
            {"model": "beta", "metrics": {}, "backbone": None,
             "date": None, "submitter": None, "notes": [], "extra": {}},
        ])
        assert "alpha" in md
        assert "beta" in md
        assert leaderboard.MISSING in md


class TestShippedEntries:
    """The shipped entries must validate and reproduce published numbers."""

    ENTRIES_DIR = leaderboard.REPO_ROOT / "eval" / "tare" / "entries"

    def test_all_entries_load(self):
        entries = load_entries(self.ENTRIES_DIR)
        assert {e["model"] for e in entries} == {
            "deem-v2",
            "deem-v3",
            "deem-v4",
            "deem-v5",
            "deem-v6",
            "deem-rlcd-v1",
        }

    def test_v5_matches_ledger(self):
        entry = load_entry(self.ENTRIES_DIR / "deem-v5.json")
        m = entry["metrics"]
        # published in paper/RESULTS_LEDGER.md, 2026-09-21 SFT v5 entry
        assert m["macro_accuracy"]["value"] == pytest.approx(0.7627, abs=1e-4)
        assert m["macro_ece_post_scaling"]["value"] == pytest.approx(
            0.0612, abs=1e-4
        )
        assert m["exact_laws_brier"]["value"] == pytest.approx(0.0332, abs=1e-4)
        assert m["negation_consistency_error"]["value"] == pytest.approx(
            0.0073, abs=1e-4
        )

    def test_rlcd_matches_report(self):
        entry = load_entry(self.ENTRIES_DIR / "deem-rlcd-v1.json")
        m = entry["metrics"]
        # published in scripts/rl/RLCD_V1_REPORT.md (chosen lam10 1ep)
        assert m["exact_laws_brier"]["value"] == pytest.approx(0.0291, abs=1e-4)
        # full held-out test split, same protocol as deem-v5
        assert m["macro_accuracy"]["value"] == pytest.approx(0.7623, abs=1e-4)
        assert m["negation_consistency_error"]["value"] == pytest.approx(
            0.0071, abs=1e-4
        )
        # v6-style per-class calibrator (arm b_temp), fit on the dev half,
        # scored on the untouched eval half of the held-out split
        assert m["macro_ece_post_scaling"]["value"] == pytest.approx(
            0.0424, abs=1e-4
        )

    def test_v6_matches_report(self):
        entry = load_entry(self.ENTRIES_DIR / "deem-v6.json")
        m = entry["metrics"]
        # published in scripts/sft/SFT_V6_REPORT.md (chosen arm b_temp,
        # honest dev/eval split, eval half untouched)
        assert m["macro_accuracy"]["value"] == pytest.approx(0.7718, abs=1e-4)
        assert m["macro_ece_pre_scaling"]["value"] == pytest.approx(
            0.1219, abs=1e-4
        )
        assert m["macro_ece_post_scaling"]["value"] == pytest.approx(
            0.0433, abs=1e-4
        )
        # post-hoc calibrator: the raw-readout probes are the frozen
        # checkpoint's own numbers (byte-identical to deem-v5's)
        assert m["flip_rate"]["value"] == pytest.approx(0.0773, abs=1e-4)
        assert m["exact_laws_brier"]["value"] == pytest.approx(0.0332, abs=1e-4)

    def test_v2_flip_catastrophe_recorded(self):
        entry = load_entry(self.ENTRIES_DIR / "deem-v2.json")
        # published in paper/RESULTS_LEDGER.md, 2026-09-21 SFT v2 entry
        assert entry["metrics"]["flip_rate"]["value"] == pytest.approx(
            0.968, abs=1e-3
        )
