"""Tare consistency probes — negation, permutation, paraphrase.

Scored as *paired-accuracy*, not just invariance: a probe is only "passed"
when both phrasings/orderings of the same question independently produce the
correct decision.  A model can be internally consistent and wrong, or
internally inconsistent on items it still happens to get right — the two
numbers reported here distinguish those failures.

All functions are pure and dependency-free (stdlib only, Python >= 3.10).
"""

from __future__ import annotations

from typing import Sequence

__all__ = [
    "DECISION_THRESHOLD",
    "negation_consistency_error",
    "negation_paired_accuracy",
    "permutation_flip_rate",
    "paraphrase_consistency",
]


# A Noul/choice decision flips at the midpoint of the probability scale.
DECISION_THRESHOLD = 0.5


def _as_floats(x) -> list[float]:
    """Coerce scalar-or-sequence of bools/floats into a list of floats."""
    if isinstance(x, (str, bytes)) or not isinstance(x, Sequence):
        x = [x]
    return [float(v) for v in x]


def negation_consistency_error(p_a, p_not_a) -> float:
    """Mean ``|P(a) - (1 - P(not a))|`` over one or many item pairs.

    A perfectly consistent negation pair scores 0.  Jev's documented
    failure (Noul(refund) = 0.72, Noul(not refund) = 0.47) scores
    ``|0.72 - (1 - 0.47)| = 0.19``.
    """
    pa = _as_floats(p_a)
    pn = _as_floats(p_not_a)
    if len(pa) != len(pn):
        raise ValueError(
            f"p_a/p_not_a length mismatch: {len(pa)} != {len(pn)}"
        )
    if not pa:
        return 0.0
    total = sum(abs(a - (1.0 - n)) for a, n in zip(pa, pn))
    return total / len(pa)


def negation_paired_accuracy(p_a, p_not_a, ground_truth) -> dict:
    """Negation probe, scored as paired accuracy.

    Inputs are either scalars (single item) or equal-length sequences
    (batch).  ``p_a`` is the model's probability that proposition ``a`` is
    true, ``p_not_a`` its probability for the negated proposition, and
    ``ground_truth`` the outcome truth of ``a``.

    Returns a dict with:

    ``consistency_error``
        Mean ``|P(a) - (1 - P(not a))|`` (0 = perfectly consistent).
    ``accuracy_from_p``
        Decision accuracy when deciding from ``P(a)`` alone
        (predict "a" iff ``P(a) >= 0.5``).
    ``accuracy_from_not_p``
        Decision accuracy when deciding from ``P(not a)`` alone
        (predict "a" iff ``P(not a) < 0.5``).
    ``paired_accuracy``
        The *worse* of the two above — the honest paired score.  A probe
        batch only earns credit if both directions independently get the
        item right.
    ``agreement_rate``
        Fraction of items where the two directions yield the same decision
        (the invariance-only view, reported for contrast — passing it is
        not passing the probe).
    ``n``
        Number of items scored.
    """
    pa = _as_floats(p_a)
    pn = _as_floats(p_not_a)
    gt = _as_floats(ground_truth)
    if not (len(pa) == len(pn) == len(gt)):
        raise ValueError(
            f"length mismatch: {len(pa)}/{len(pn)}/{len(gt)}"
        )
    n = len(pa)
    if n == 0:
        return {
            "consistency_error": 0.0,
            "accuracy_from_p": 0.0,
            "accuracy_from_not_p": 0.0,
            "paired_accuracy": 0.0,
            "agreement_rate": 0.0,
            "n": 0,
        }
    acc_p = 0
    acc_not_p = 0
    agree = 0
    for a, not_a, truth in zip(pa, pn, gt):
        decide_from_p = a >= DECISION_THRESHOLD
        decide_from_not_p = not_a >= DECISION_THRESHOLD  # predicts "not a"
        truth = truth >= DECISION_THRESHOLD
        hit_p = decide_from_p == truth
        hit_not_p = decide_from_not_p != truth  # correct iff truth is "not a"
        agree += decide_from_p != decide_from_not_p
        acc_p += hit_p
        acc_not_p += hit_not_p
    accuracy_from_p = acc_p / n
    accuracy_from_not_p = acc_not_p / n
    return {
        "consistency_error": negation_consistency_error(pa, pn),
        "accuracy_from_p": accuracy_from_p,
        "accuracy_from_not_p": accuracy_from_not_p,
        "paired_accuracy": min(accuracy_from_p, accuracy_from_not_p),
        "agreement_rate": agree / n,
        "n": n,
    }


def _canonical(prediction, permutation=None) -> int:
    """Map a prediction to a canonical option id.

    ``prediction`` is either already canonical (an int), or a
    ``(index, permutation)`` pair where ``permutation[j]`` is the original
    option id of the option shown at position ``j`` — letting callers pass
    raw permuted outputs.
    """
    if isinstance(prediction, tuple) and len(prediction) == 2:
        index, perm = prediction
        return int(perm[int(index)])
    return int(prediction)


def permutation_flip_rate(
    results_across_permutations: Sequence[Sequence],
) -> dict:
    """How often the decision changes when option order is shuffled.

    ``results_across_permutations`` is one entry per question; each entry is
    the list of predictions for that question under different orderings of
    the options.  Predictions are canonical option ids (ints), or
    ``(permuted_index, permutation)`` pairs where ``permutation[j]`` gives
    the original option id shown at position ``j``.

    A question *flips* if its predictions are not all identical.  Returns
    ``{"flip_rate": ..., "flipped": ..., "n": ...}``.
    """
    n = len(results_across_permutations)
    if n == 0:
        return {"flip_rate": 0.0, "flipped": 0, "n": 0}
    flipped = 0
    for group in results_across_permutations:
        preds = [_canonical(p) for p in group]
        if any(p != preds[0] for p in preds[1:]):
            flipped += 1
    return {"flip_rate": flipped / n, "flipped": flipped, "n": n}


def paraphrase_consistency(
    results_across_templates: Sequence[Sequence],
) -> dict:
    """Cross-template consistency of decisions for the same question.

    ``results_across_templates`` is one entry per question; each entry is
    the list of predicted option ids (canonical ints, or
    ``(index, mapping)`` pairs as accepted by
    :func:`permutation_flip_rate`) obtained under different prompt
    templates phrasing the same question.

    Returns ``{"consistency": ..., "mean_majority_agreement": ..., "n": ...}``
    where ``consistency`` is the fraction of questions whose predictions
    are all identical, and ``mean_majority_agreement`` is the mean
    fraction of templates agreeing with each question's modal answer
    (1.0 = every template agrees on every question).
    """
    n = len(results_across_templates)
    if n == 0:
        return {"consistency": 0.0, "mean_majority_agreement": 0.0, "n": 0}
    consistent = 0
    agreement_sum = 0.0
    for group in results_across_templates:
        preds = [_canonical(p) for p in group]
        if not preds:
            continue
        counts: dict[int, int] = {}
        for p in preds:
            counts[p] = counts.get(p, 0) + 1
        top = max(counts.values())
        agreement_sum += top / len(preds)
        if top == len(preds):
            consistent += 1
    return {
        "consistency": consistent / n,
        "mean_majority_agreement": agreement_sum / n,
        "n": n,
    }
