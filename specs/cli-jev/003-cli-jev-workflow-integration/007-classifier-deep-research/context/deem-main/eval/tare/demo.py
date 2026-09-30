"""Synthetic demo for the Tare harness (stdlib only, fully deterministic).

Generates a fake results JSON — three domains of decision records plus
negation/permutation/paraphrase probe records — and prints the Tare report.

    python3 demo.py [--out demo_results.json]

The fake model is deliberately overconfident (temperature < 1), so the
report shows nonzero ECE, Brier above the ideal, and an automation rate
below 100% at 90% target accuracy.
"""

from __future__ import annotations

import argparse
import json
import random
import sys
from pathlib import Path

import metrics

DOMAINS = {
    # domain: ( n_options, skill, overconfidence temperature
    "routing": (4, 0.78, 0.55),
    "extraction": (2, 0.91, 0.7),
    "scoring": (5, 0.62, 0.45),
}
N_PER_DOMAIN = 240
NEGATION_ITEMS = 60
PROBE_ITEMS = 40


def fake_distribution(rng, n_options: int, skill: float, temp: float,
                      correct_index: int) -> list[float]:
    """Simulate one (overconfident) model distribution."""
    # Start from a roughly-correct belief, sharpened by temperature < 1.
    beliefs = [rng.uniform(0.05, 0.45) for _ in range(n_options)]
    hit = rng.random() < skill
    if hit:
        beliefs[correct_index] += rng.uniform(0.7, 1.4)
    else:
        wrong = [i for i in range(n_options) if i != correct_index]
        beliefs[rng.choice(wrong)] += rng.uniform(0.7, 1.4)
    # Sharpen (temperature) then normalize.
    sharpened = [b ** (1.0 / temp) for b in beliefs]
    total = sum(sharpened)
    return [b / total for b in sharpened]


def generate(seed: int = 20260920) -> list[dict]:
    rng = random.Random(seed)
    records: list[dict] = []

    for domain, (n_options, skill, temp) in DOMAINS.items():
        for i in range(N_PER_DOMAIN):
            correct_index = rng.randrange(n_options)
            probs = fake_distribution(rng, n_options, skill, temp, correct_index)
            records.append({
                "domain": domain,
                "question_id": f"{domain[:3]}-{i:04d}",
                "probabilities": [round(p, 6) for p in probs],
                "correct_answer": correct_index,
            })

        # --- negation probes (Noul-style) -----------------------------
        for i in range(NEGATION_ITEMS):
            truth = rng.random() < 0.5
            # Model has real skill but is noisy and slightly inconsistent
            # under negation: P(not a) ~= 1 - P(a) + noise, clipped.
            edge = rng.uniform(0.52, 0.95) if rng.random() < skill else \
                rng.uniform(0.05, 0.48)
            p_a = edge if truth else 1.0 - edge
            noise = rng.uniform(-0.25, 0.25)  # Jev-style inconsistency
            p_not_a = 1.0 - p_a + noise
            p_not_a = min(max(p_not_a, 0.0), 1.0)
            records.append({
                "domain": domain,
                "question_id": f"{domain[:3]}-neg-{i:04d}",
                "kind": "negation",
                "p_a": round(p_a, 4),
                "p_not_a": round(p_not_a, 4),
                "ground_truth": truth,
            })

        # --- permutation probes ---------------------------------------
        n_options_perm = min(n_options, 3)
        for i in range(PROBE_ITEMS):
            base = rng.randrange(n_options_perm)
            preds = [base] * rng.randrange(2, 6)
            # 10% of questions flip under reordering.
            if rng.random() < 0.1:
                preds[-1] = (base + 1) % n_options_perm
            records.append({
                "domain": domain,
                "question_id": f"{domain[:3]}-perm-{i:04d}",
                "kind": "permutation",
                "predictions": preds,
            })

        # --- paraphrase probes -----------------------------------------
        for i in range(PROBE_ITEMS):
            base = rng.randrange(n_options)
            preds = [base] * rng.randrange(2, 5)
            if rng.random() < 0.15:  # 15% of questions wobble on template
                preds[rng.randrange(len(preds))] = rng.randrange(n_options)
            records.append({
                "domain": domain,
                "question_id": f"{domain[:3]}-para-{i:04d}",
                "kind": "paraphrase",
                "predictions": preds,
            })

    return records


def main(argv: list[str] | None = None) -> int:
    here = Path(__file__).resolve().parent
    parser = argparse.ArgumentParser(description="Tare synthetic demo")
    parser.add_argument("--out", default=str(here / "demo_results.json"))
    parser.add_argument("--format", choices=("text", "json"), default="text")
    args = parser.parse_args(argv)

    records = generate()
    with open(args.out, "w", encoding="utf-8") as fh:
        json.dump(records, fh, indent=2)
    print(f"# wrote {len(records)} records to {args.out}", file=sys.stderr)

    import report
    if args.format == "json":
        print(json.dumps(report.build_report(records, 0.9), indent=2))
    else:
        print(report.render_text(report.build_report(records, 0.9), 0.9))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
