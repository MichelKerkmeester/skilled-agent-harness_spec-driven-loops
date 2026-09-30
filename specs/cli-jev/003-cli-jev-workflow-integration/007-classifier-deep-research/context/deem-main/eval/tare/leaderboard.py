"""Tare leaderboard — rank decision models on the Tare metrics.

Zero your scale. Measure decisions, not vibes.

The leaderboard ingests **entries** (JSON files in ``entries/``), validates
that every number traces to a results file, ranks the models, and emits
``leaderboard.md`` + ``leaderboard.json`` next to this script. No GPU, no
model weights: it reads the eval artifacts that already exist in the repo.

Entry formats
-------------

**Native entry** (our own checkpoints). Each adapter re-derives metrics
from a raw artifact in the repo, so no number can appear without a file
behind it::

    {
      "model": "deem-v5",
      "backbone": "Qwen3-1.7B-Base",
      "date": "2026-09-21",
      "notes": ["..."],
      "adapters": {
        "eval":        {"artifact": "scripts/sft/results_v5.json", "key": "v5"},
        "temperature": {"artifact": "scripts/sft/temperature_v5.json", "key": "v5"},
        "consistency": {"artifact": "scripts/sft/consistency_v5.json", "key": "v5"},
        "exact_laws":  {"artifact": "scripts/sft/exact_eval_v5.json", "key": "v5"}
      }
    }

Adapters:

* ``eval`` — 8-anchor eval JSON (``per_dataset`` + ``avg_accuracy`` /
  ``avg_ece`` under ``key``) → macro accuracy, pre-scaling macro ECE.
* ``temperature`` — temperature-scaling JSON (``per_dataset[key].ece_after``)
  → post-scaling macro ECE.
* ``consistency`` — probe JSON (``permutation_flip`` + ``boolq_negation``
  under ``key``) → mean flip rate, negation consistency error / paired acc.
* ``exact_laws`` — exact-laws eval JSON (``macro_brier`` under ``key``)
  → exact-laws Brier + accuracy.
* ``rlcd_eval`` — RLCD eval JSON (``exact_laws`` / ``flip`` /
  ``dev_sample`` under ``key``) → exact-laws Brier, flip rate, dev-sample
  macro accuracy.
* ``v6_calibration`` — v6 post-hoc calibration results JSON
  (``results_v6.json``: ``eval`` split under ``key``, arm picked by
  ``chosen_arm``) → macro accuracy (calibrated readout), ECE pre (raw)
  and post (chosen arm) on the untouched eval half; ``only`` restricts
  the emitted metrics, ``calibration`` overrides the calibrator-file
  path recorded in the extras.

**Third-party submission.** Every metric must cite an artifact (path or
URL) and carry a numeric value::

    {
      "model": "some-decision-model",
      "submitter": "Jane Doe <jane@example.com>",
      "date": "2026-10-01",
      "metrics": {
        "macro_accuracy": {"value": 0.75, "artifact": "https://example.com/results.json"}
      }
    }

Rules of honesty (enforced, not advisory):

1. every metric cites an existing artifact file (third-party URLs are
   recorded but not downloaded);
2. unknown metric keys are rejected (typos must not silently vanish);
3. values must be numeric.

Usage::

    python3 leaderboard.py                 # write leaderboard.md + .json
    python3 leaderboard.py --check         # validate entries, emit nothing
"""

from __future__ import annotations

import argparse
import datetime as _dt
import json
import sys
from pathlib import Path
from typing import Any

REPO_ROOT = Path(__file__).resolve().parents[2]

#: Metrics a leaderboard entry may carry. Every column of the table.
KNOWN_METRICS = (
    "macro_accuracy",
    "macro_ece_pre_scaling",
    "macro_ece_post_scaling",
    "flip_rate",
    "negation_consistency_error",
    "negation_paired_accuracy",
    "exact_laws_brier",
)

#: Column labels for the markdown table, in display order.
TABLE_COLUMNS = (
    "macro_accuracy",
    "macro_ece_pre_scaling",
    "macro_ece_post_scaling",
    "flip_rate",
    "negation_consistency_error",
    "negation_paired_accuracy",
    "exact_laws_brier",
)

COLUMN_HEADER = {
    "macro_accuracy": "Macro acc",
    "macro_ece_pre_scaling": "ECE (pre)",
    "macro_ece_post_scaling": "ECE (post)",
    "flip_rate": "Flip rate",
    "negation_consistency_error": "Neg err",
    "negation_paired_accuracy": "Neg paired acc",
    "exact_laws_brier": "Exact Brier",
}

#: Shown when a metric is absent — honest, not zero.
MISSING = "—"


class LeaderboardError(ValueError):
    """Entry is malformed or cannot be traced to a results file."""


# ---------------------------------------------------------------------------
# small helpers
# ---------------------------------------------------------------------------


def _mean(values) -> Any:
    values = list(values)
    if not values:
        return None
    return sum(values) / len(values)


def _load_json(path: Path) -> Any:
    try:
        with open(path, "r", encoding="utf-8") as fh:
            return json.load(fh)
    except FileNotFoundError:
        raise LeaderboardError(f"artifact not found: {path}") from None
    except json.JSONDecodeError as exc:
        raise LeaderboardError(f"artifact is not valid JSON: {path}: {exc}") from exc


def _artifact_path(spec: dict, repo_root: Path) -> Path:
    artifact = spec.get("artifact")
    if not isinstance(artifact, str) or not artifact.strip():
        raise LeaderboardError("adapter spec needs a non-empty 'artifact'")
    path = Path(artifact)
    if path.is_absolute():
        return path
    return repo_root / path


def _subkey(data: dict, spec: dict) -> Any:
    key = spec.get("key")
    if not isinstance(key, str) or not key:
        raise LeaderboardError(
            "adapter spec needs a 'key' naming the entry inside the artifact"
        )
    if key not in data:
        raise LeaderboardError(
            f"artifact has no key {key!r} (available: {sorted(data)})"
        )
    return data[key]


def _metric(value: Any, artifact: str, protocol: str) -> dict:
    if not isinstance(value, (int, float)) or isinstance(value, bool):
        raise LeaderboardError(f"metric value {value!r} is not numeric")
    return {
        "value": float(value),
        "artifact": artifact,
        "protocol": protocol,
    }


# ---------------------------------------------------------------------------
# native adapters — re-derive metrics from raw artifacts
# ---------------------------------------------------------------------------


def _adapt_eval(spec: dict, repo_root: Path) -> tuple[dict, dict]:
    path = _artifact_path(spec, repo_root)
    data = _load_json(path)
    sub = _subkey(data, spec)
    per = sub.get("per_dataset")
    if not isinstance(per, dict) or not per:
        raise LeaderboardError(f"no per_dataset table in {path} [{spec.get('key')}]")
    acc = sub.get("avg_accuracy")
    if acc is None:
        acc = _mean(d["accuracy"] for d in per.values())
    ece = sub.get("avg_ece")
    if ece is None:
        ece = _mean(d["ece"] for d in per.values())
    artifact = spec["artifact"]
    metrics = {
        "macro_accuracy": _metric(
            acc, artifact, "held-out test split (argmax, per-dataset macro)"
        ),
        "macro_ece_pre_scaling": _metric(
            ece, artifact, "held-out test split, before temperature scaling"
        ),
    }
    extra = {
        "n_eval_rows": data.get("n_eval_rows"),
        "per_dataset": {
            name: {k: d.get(k) for k in ("n", "accuracy", "ece")}
            for name, d in sorted(per.items())
        },
    }
    return metrics, extra


def _adapt_temperature(spec: dict, repo_root: Path) -> tuple[dict, dict]:
    path = _artifact_path(spec, repo_root)
    data = _load_json(path)
    sub = _subkey(data, spec)
    per = sub.get("per_dataset")
    if not isinstance(per, dict) or not per:
        raise LeaderboardError(
            f"no per_dataset table in {path} [{spec.get('key')}]"
        )
    ece = _mean(d.get("ece_after") for d in per.values())
    if ece is None:
        raise LeaderboardError(f"no ece_after in {path} [{spec.get('key')}]")
    metrics = {
        "macro_ece_post_scaling": _metric(
            ece,
            spec["artifact"],
            "after frozen temperature scaling (macro over per-dataset ECE)",
        )
    }
    return metrics, {"temperatures": {
        name: d.get("temperature") for name, d in sorted(per.items())
    }}


def _adapt_consistency(spec: dict, repo_root: Path) -> tuple[dict, dict]:
    path = _artifact_path(spec, repo_root)
    data = _load_json(path)
    sub = _subkey(data, spec)
    flip = sub.get("permutation_flip")
    if not isinstance(flip, dict) or not flip:
        raise LeaderboardError(
            f"no permutation_flip probes in {path} [{spec.get('key')}]"
        )
    flip_rate = _mean(d["flip_rate"] for d in flip.values())
    metrics = {}
    if flip_rate is not None:
        metrics["flip_rate"] = _metric(
            flip_rate,
            spec["artifact"],
            f"mean over {len(flip)} probe datasets: "
            + ", ".join(sorted(flip)),
        )
    neg = sub.get("boolq_negation")
    if neg:
        metrics["negation_consistency_error"] = _metric(
            neg["consistency_error"],
            spec["artifact"],
            "boolq negation probe, mean |P(a) - (1 - P(not a))|",
        )
        metrics["negation_paired_accuracy"] = _metric(
            neg["paired_accuracy"],
            spec["artifact"],
            "boolq negation probe, worse of the two directions",
        )
    extra = {"flip_datasets": sorted(flip)}
    return metrics, extra


def _adapt_exact_laws(spec: dict, repo_root: Path) -> tuple[dict, dict]:
    path = _artifact_path(spec, repo_root)
    data = _load_json(path)
    sub = _subkey(data, spec)
    if "macro_brier" not in sub:
        raise LeaderboardError(f"no macro_brier in {path} [{spec.get('key')}]")
    metrics = {
        "exact_laws_brier": _metric(
            sub["macro_brier"],
            spec["artifact"],
            "held-out exact-laws split (ground truth by construction)",
        )
    }
    extra = {"exact_laws_accuracy": sub.get("macro_accuracy")}
    return metrics, extra


def _adapt_rlcd_eval(spec: dict, repo_root: Path) -> tuple[dict, dict]:
    path = _artifact_path(spec, repo_root)
    data = _load_json(path)
    sub = _subkey(data, spec)
    metrics = {}
    extra: dict[str, Any] = {}
    exact = sub.get("exact_laws")
    if not isinstance(exact, dict) or "macro_brier" not in exact:
        raise LeaderboardError(f"no exact_laws.macro_brier in {path}")
    metrics["exact_laws_brier"] = _metric(
        exact["macro_brier"],
        spec["artifact"],
        "held-out exact-laws split (ground truth by construction)",
    )
    extra["exact_laws_accuracy"] = exact.get("macro_accuracy")
    flip = sub.get("flip", {})
    if flip:
        flip_rate = _mean(d["flip_rate"] for d in flip.values())
        if flip_rate is not None:
            metrics["flip_rate"] = _metric(
                flip_rate,
                spec["artifact"],
                f"drift check, mean over {len(flip)} probe datasets: "
                + ", ".join(sorted(flip)),
            )
        extra["flip_datasets"] = sorted(flip)
    dev = sub.get("dev_sample", {})
    if "macro_accuracy" in dev:
        metrics["macro_accuracy"] = _metric(
            dev["macro_accuracy"],
            spec["artifact"],
            "dev-sample drift check, 100 rows/dataset (not the full test split)",
        )
    return metrics, extra


def _adapt_v6_calibration(spec: dict, repo_root: Path) -> tuple[dict, dict]:
    """v6 post-hoc per-class calibrator (frozen v5 checkpoint).

    ``key`` names the split inside the results JSON (e.g. ``eval``, the
    half the calibrator never saw during fitting); the arm is taken from
    the artifact's own ``chosen_arm`` field, so the entry cannot cherry-
    pick an arm. An optional ``only`` list restricts the emitted metrics
    (for entries whose accuracy / pre-scaling ECE already come from
    another adapter), and ``calibration`` overrides the default
    calibrator-file path recorded in the extras.
    """
    path = _artifact_path(spec, repo_root)
    data = _load_json(path)
    sub = _subkey(data, spec)
    arm = data.get("chosen_arm")
    if not isinstance(arm, str) or arm not in sub:
        raise LeaderboardError(
            f"no chosen_arm inside {path} (available arms: {sorted(sub)})"
        )
    chosen = sub[arm]
    raw = sub.get("raw")
    if not isinstance(raw, dict) or "ece" not in raw:
        raise LeaderboardError(f"no raw (uncalibrated) baseline in {path}")
    protocol = (
        "v6 honest split: untouched eval half (calibrator fit on the dev "
        "half only), frozen v5 checkpoint + per-class calibrator"
    )
    metrics = {
        "macro_accuracy": _metric(
            chosen["accuracy"],
            spec["artifact"],
            protocol + "; calibrated readout",
        ),
        "macro_ece_pre_scaling": _metric(
            raw["ece"],
            spec["artifact"],
            protocol + "; raw (uncalibrated) readout",
        ),
        "macro_ece_post_scaling": _metric(
            chosen["ece"],
            spec["artifact"],
            protocol + f"; chosen arm {arm} (per-class calibration)",
        ),
    }
    only = spec.get("only")
    if only is not None:
        if (
            not isinstance(only, list)
            or not only
            or any(m not in metrics for m in only)
        ):
            raise LeaderboardError(
                f"invalid 'only' filter in {path} adapter spec "
                f"(known: {', '.join(metrics)})"
            )
        metrics = {name: metrics[name] for name in only}
    extra = {
        "calibrator": f"per-class temperature (arm {arm})",
        "calibration": spec.get(
            "calibration", "scripts/sft/calibration_v6.json"
        ),
    }
    if only is None:
        extra["per_dataset"] = {
            name: {k: d.get(k) for k in ("n", "accuracy", "ece", "argmax_flips")}
            for name, d in sorted(chosen.get("per_dataset", {}).items())
        }
    return metrics, extra


ADAPTERS = {
    "eval": _adapt_eval,
    "temperature": _adapt_temperature,
    "consistency": _adapt_consistency,
    "exact_laws": _adapt_exact_laws,
    "rlcd_eval": _adapt_rlcd_eval,
    "v6_calibration": _adapt_v6_calibration,
}


# ---------------------------------------------------------------------------
# entry loading & validation
# ---------------------------------------------------------------------------


def _validate_third_party_metrics(raw: dict, path: Path) -> dict:
    metrics_in = raw.get("metrics")
    if not isinstance(metrics_in, dict) or not metrics_in:
        raise LeaderboardError(f"{path}: 'metrics' must be a non-empty object")
    out: dict[str, dict] = {}
    for name, spec in metrics_in.items():
        if name not in KNOWN_METRICS:
            raise LeaderboardError(
                f"{path}: unknown metric {name!r} "
                f"(known: {', '.join(KNOWN_METRICS)})"
            )
        if not isinstance(spec, dict):
            raise LeaderboardError(f"{path}: metric {name} must be an object")
        value = spec.get("value")
        if isinstance(value, bool) or not isinstance(value, (int, float)):
            raise LeaderboardError(
                f"{path}: metric {name} needs a numeric 'value'"
            )
        artifact = spec.get("artifact")
        if not isinstance(artifact, str) or not artifact.strip():
            raise LeaderboardError(
                f"{path}: metric {name} cites no artifact — every number on "
                "the Tare leaderboard must trace to a results file"
            )
        out[name] = _metric(value, artifact, spec.get("protocol", "third-party"))
    return out


def load_entry(path: Path, repo_root: Path | None = None) -> dict:
    """Load and validate one entry file. Raises ``LeaderboardError``."""
    repo_root = repo_root or REPO_ROOT
    path = Path(path)
    raw = _load_json(path)
    if not isinstance(raw, dict):
        raise LeaderboardError(f"{path}: entry must be a JSON object")

    model = raw.get("model")
    if not isinstance(model, str) or not model.strip():
        raise LeaderboardError(f"{path}: entry needs a non-empty 'model'")
    if "adapters" in raw and "metrics" in raw:
        raise LeaderboardError(
            f"{path}: entry has both 'adapters' and 'metrics' — pick one"
        )

    extra: dict[str, Any] = {}
    metrics: dict[str, dict] = {}

    if "adapters" in raw:
        adapters = raw["adapters"]
        if not isinstance(adapters, dict) or not adapters:
            raise LeaderboardError(
                f"{path}: 'adapters' must be a non-empty object"
            )
        seen: set[str] = set()
        for name, spec in adapters.items():
            if name not in ADAPTERS:
                raise LeaderboardError(
                    f"{path}: unknown adapter {name!r} "
                    f"(known: {', '.join(ADAPTERS)})"
                )
            if not isinstance(spec, dict):
                raise LeaderboardError(f"{path}: adapter {name} must be an object")
            artifact = spec.get("artifact", "")
            if not isinstance(artifact, str) or not artifact.strip():
                raise LeaderboardError(
                    f"{path}: adapter {name} cites no artifact"
                )
            if not artifact.startswith(("http://", "https://")) and not (
                repo_root / artifact
            ).exists():
                raise LeaderboardError(
                    f"{path}: artifact not found: {artifact}"
                )
            new_metrics, new_extra = ADAPTERS[name](spec, repo_root)
            extra.update(new_extra)
            for metric_name, metric in new_metrics.items():
                if metric_name in seen:
                    raise LeaderboardError(
                        f"{path}: metric {metric_name} produced twice"
                    )
                seen.add(metric_name)
                metrics[metric_name] = metric
    elif "metrics" in raw:
        metrics = _validate_third_party_metrics(raw, path)
    else:
        raise LeaderboardError(
            f"{path}: entry needs 'adapters' (native) or 'metrics' "
            "(third-party) — nothing to score"
        )

    notes = raw.get("notes", [])
    if isinstance(notes, str):
        notes = [notes]
    return {
        "model": model,
        "backbone": raw.get("backbone"),
        "date": raw.get("date"),
        "submitter": raw.get("submitter"),
        "notes": notes,
        "metrics": metrics,
        "extra": extra,
    }


def load_entries(entries_dir: Path, repo_root: Path | None = None) -> list[dict]:
    """Load and validate every ``*.json`` entry in ``entries_dir``."""
    entries_dir = Path(entries_dir)
    if not entries_dir.is_dir():
        raise LeaderboardError(f"entries directory not found: {entries_dir}")
    paths = sorted(entries_dir.glob("*.json"))
    if not paths:
        raise LeaderboardError(f"no entries in {entries_dir}")
    return [load_entry(p, repo_root) for p in paths]


# ---------------------------------------------------------------------------
# ranking & rendering
# ---------------------------------------------------------------------------


def rank(entries: list[dict]) -> list[dict]:
    """Order entries: best macro accuracy first; missing metrics last."""

    def sort_key(entry: dict):
        metric = entry["metrics"].get("macro_accuracy")
        value = metric["value"] if metric else float("-inf")
        return (-value, entry["model"])

    return sorted(entries, key=sort_key)


def _fmt(entry_metrics: dict, name: str) -> str:
    metric = entry_metrics.get(name)
    if metric is None:
        return MISSING
    return f"{metric['value']:.4f}"


def render_markdown(entries: list[dict]) -> str:
    ranked = rank(entries)
    lines: list[str] = [
        "# Tare leaderboard",
        "",
        "*Zero your scale. Measure decisions, not vibes.*",
        "",
        "Every number below is re-derived from a results file in this repo at",
        "build time (or, for third-party submissions, cited to an artifact",
        "supplied by the submitter). Entries whose numbers cannot be traced",
        "are rejected — see `leaderboard.py`.",
        "",
        "| # | Model | Backbone | "
        + " | ".join(COLUMN_HEADER[c] for c in TABLE_COLUMNS)
        + " |",
        "|---|---|---|"
        + "|".join("---" for _ in TABLE_COLUMNS)
        + "|",
    ]
    for i, entry in enumerate(ranked, start=1):
        cells = [
            str(i),
            entry["model"],
            entry.get("backbone") or MISSING,
        ]
        cells += [_fmt(entry["metrics"], c) for c in TABLE_COLUMNS]
        lines.append("| " + " | ".join(cells) + " |")
    lines.append("")
    lines.append("## Per-entry provenance")
    for entry in ranked:
        lines.append("")
        lines.append(f"### {entry['model']}")
        if entry.get("backbone"):
            lines.append(f"- Backbone: {entry['backbone']}")
        if entry.get("date"):
            lines.append(f"- Date: {entry['date']}")
        if entry.get("submitter"):
            lines.append(f"- Submitter: {entry['submitter']}")
        for note in entry.get("notes", []):
            lines.append(f"- Note: {note}")
        lines.append("- Metrics:")
        for name in KNOWN_METRICS:
            metric = entry["metrics"].get(name)
            if metric is None:
                continue
            lines.append(
                f"  - {name} = {metric['value']:.4f} "
                f"({metric['protocol']}) — artifact: `{metric['artifact']}`"
            )
        missing = [
            c
            for c in KNOWN_METRICS
            if c not in entry["metrics"]
        ]
        if missing:
            lines.append(
                f"- Not measured: {', '.join(missing)} ({MISSING} in the table)"
            )
    lines.append("")
    lines.append(
        "Generated by `eval/tare/leaderboard.py` from the entries in "
        "`eval/tare/entries/`. Lower is better for ECE (pre/post), flip "
        "rate, negation error and exact-laws Brier; higher is better for "
        "accuracy and negation paired accuracy. `"
        + MISSING
        + "` means not measured — never zero."
    )
    return "\n".join(lines)


def render_json(entries: list[dict]) -> dict:
    return {
        "generated": _dt.datetime.now(_dt.timezone.utc).isoformat(),
        "metric_keys": list(KNOWN_METRICS),
        "entries": entries,
    }


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Tare leaderboard builder")
    parser.add_argument(
        "--entries-dir",
        default=str(Path(__file__).resolve().parent / "entries"),
        help="directory of entry JSONs (default: eval/tare/entries)",
    )
    parser.add_argument(
        "--out-md",
        default=str(Path(__file__).resolve().parent / "leaderboard.md"),
    )
    parser.add_argument(
        "--out-json",
        default=str(Path(__file__).resolve().parent / "leaderboard.json"),
    )
    parser.add_argument(
        "--check",
        action="store_true",
        help="validate entries and print the table; write nothing",
    )
    args = parser.parse_args(argv)

    entries = load_entries(args.entries_dir)
    print(render_markdown(entries))
    if args.check:
        return 0
    Path(args.out_md).write_text(render_markdown(entries), encoding="utf-8")
    with open(args.out_json, "w", encoding="utf-8") as fh:
        json.dump(render_json(entries), fh, indent=2, sort_keys=True)
        fh.write("\n")
    print(f"\nwrote {args.out_md} and {args.out_json}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
