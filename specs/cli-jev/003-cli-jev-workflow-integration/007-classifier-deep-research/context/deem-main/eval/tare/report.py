"""Tare report generator — per-domain calibration & decision-quality tables.

Input is a results JSON file: a list of records.

Decision records (the default; ``kind`` omitted or ``"decision"``)::

    {
        "domain": "routing",
        "question_id": "r-0001",
        "probabilities": [0.1, 0.9],       # per-option, need not sum to 1
        "correct_answer": 1,                # index of the correct option
        "confidence": 0.8                    # optional, model-supplied
    }

Probe records (same ``domain``/``question_id`` fields, plus ``kind``)::

    {"kind": "negation",
     "domain": "contracts", "question_id": "n-0042",
     "p_a": 0.72, "p_not_a": 0.47, "ground_truth": true}

    {"kind": "permutation",
     "domain": "routing", "question_id": "p-0007",
     "predictions": [[0, 1], [1, 0]]}       # canonical ids per permutation

    {"kind": "paraphrase",
     "domain": "routing", "question_id": "t-0012",
     "predictions": [[2, 2, 2, 1]]}         # predicted ids per template

Usage::

    python3 report.py results.json                # text table
    python3 report.py results.json --format json  # machine-readable
    python3 report.py results.json --target-acc 0.95
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any

sys.path.insert(0, str(Path(__file__).resolve().parent))

import metrics  # noqa: E402
import probes  # noqa: E402


def _load_results(path: str | Path) -> list[dict]:
    with open(path, "r", encoding="utf-8") as fh:
        records = json.load(fh)
    if not isinstance(records, list):
        raise ValueError("results file must contain a JSON list of records")
    for i, rec in enumerate(records):
        if not isinstance(rec, dict):
            raise ValueError(f"record {i} is not a JSON object")
        if "domain" not in rec:
            raise ValueError(f"record {i} is missing 'domain'")
    return records


def summarize_domain(records: list[dict], target_acc: float) -> dict:
    """Compute all metrics for one domain's records."""
    decisions = [r for r in records if r.get("kind", "decision") == "decision"]
    negations = [r for r in records if r.get("kind") == "negation"]
    permutations = [r for r in records if r.get("kind") == "permutation"]
    paraphrases = [r for r in records if r.get("kind") == "paraphrase"]

    out: dict[str, Any] = {"n_decisions": len(decisions)}

    if decisions:
        probabilities = [r["probabilities"] for r in decisions]
        outcomes = [int(r["correct_answer"]) for r in decisions]
        correct = [
            metrics.argmax(r["probabilities"]) == int(r["correct_answer"])
            for r in decisions
        ]
        supplied_conf = [
            float(r["confidence"]) for r in decisions if "confidence" in r
        ]
        out.update(
            {
                "accuracy": sum(correct) / len(correct),
                "mean_confidence": (
                    sum(supplied_conf) / len(supplied_conf)
                    if supplied_conf
                    else None
                ),
                "mean_derived_confidence": sum(
                    metrics.derived_confidence(p) for p in probabilities
                )
                / len(probabilities),
                "ece": metrics.ece(probabilities, outcomes),
                "brier": metrics.brier(probabilities, outcomes),
                "log_loss": metrics.log_loss(probabilities, outcomes),
                f"automation_at_{target_acc:g}": (
                    metrics.automation_rate_at_accuracy(
                        probabilities, correct, target_acc
                    )
                ),
                "risk_coverage_auc": metrics.auc_of_tradeoff(
                    probabilities, correct
                ),
                "reliability_bins": metrics.reliability_bins(
                    probabilities, outcomes
                ),
            }
        )
    else:
        out["accuracy"] = None

    if negations:
        out["negation"] = probes.negation_paired_accuracy(
            [r["p_a"] for r in negations],
            [r["p_not_a"] for r in negations],
            [bool(r["ground_truth"]) for r in negations],
        )
    if permutations:
        out["permutation"] = probes.permutation_flip_rate(
            [r["predictions"] for r in permutations]
        )
    if paraphrases:
        out["paraphrase"] = probes.paraphrase_consistency(
            [r["predictions"] for r in paraphrases]
        )
    return out


def build_report(records: list[dict], target_acc: float) -> dict:
    domains: dict[str, list[dict]] = {}
    for rec in records:
        domains.setdefault(rec["domain"], []).append(rec)
    return {
        domain: summarize_domain(recs, target_acc)
        for domain, recs in sorted(domains.items())
    }


def _fmt(value: Any) -> str:
    if value is None:
        return "-"
    if isinstance(value, bool):
        return str(value)
    if isinstance(value, float):
        return f"{value:.4f}"
    return str(value)


def render_text(report: dict, target_acc: float) -> str:
    lines: list[str] = ["TARE — decisions, not vibes", "=" * 60]
    for domain, stats in report.items():
        lines.append("")
        lines.append(f"Domain: {domain}  (n={stats['n_decisions']} decisions)")
        lines.append("-" * 60)
        keys = [
            "accuracy",
            "mean_confidence",
            "mean_derived_confidence",
            "ece",
            "brier",
            "log_loss",
            f"automation_at_{target_acc:g}",
            "risk_coverage_auc",
        ]
        for key in keys:
            if key in stats:
                lines.append(f"  {key:<24} {_fmt(stats[key])}")
        if "negation" in stats:
            lines.append("  -- negation probe --")
            for key, value in stats["negation"].items():
                lines.append(f"  negation.{key:<16} {_fmt(value)}")
        if "permutation" in stats:
            lines.append("  -- permutation probe --")
            for key, value in stats["permutation"].items():
                lines.append(f"  perm.{key:<20} {_fmt(value)}")
        if "paraphrase" in stats:
            lines.append("  -- paraphrase probe --")
            for key, value in stats["paraphrase"].items():
                lines.append(f"  para.{key:<21} {_fmt(value)}")
    return "\n".join(lines)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Tare report generator")
    parser.add_argument("results", help="results JSON file")
    parser.add_argument(
        "--format", choices=("text", "json"), default="text",
        help="output format (default: text)",
    )
    parser.add_argument(
        "--target-acc", type=float, default=0.90,
        help="target accuracy for the automation-rate metric (default 0.90)",
    )
    args = parser.parse_args(argv)
    records = _load_results(args.results)
    report = build_report(records, args.target_acc)
    if args.format == "json":
        print(json.dumps(report, indent=2, sort_keys=True))
    else:
        print(render_text(report, args.target_acc))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
