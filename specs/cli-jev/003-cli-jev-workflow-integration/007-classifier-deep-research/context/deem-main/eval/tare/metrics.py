"""Tare metrics — calibration & decision metrics.

Zero your scale. Measure decisions, not vibes.

All functions are dependency-free (stdlib only, Python >= 3.10) and pure:
no RNG, no I/O, no global state. Every public function tolerates edge cases
(empty inputs, zero-division, single-class data, unnormalized probabilities)
and returns well-defined values for them.

Conventions
-----------
* ``probs`` is a sequence of probability vectors (one per item, one float per
  option).  For binary/Noul-style probes a vector may also be a pair
  ``[p, 1-p]``; helper :func:`as_pair` normalizes that view.
* ``outcomes`` is a sequence of ground-truth labels: for calibration metrics
  it is the index of the correct option (or, in the binary case, the
  Bernoulli outcome 0/1).
* Probabilities that do not sum to 1 are normalized defensively; a zero-sum
  vector raises ``ValueError`` (it encodes no belief).
"""

from __future__ import annotations

import math
from typing import Iterable, Iterator, Optional, Sequence

__all__ = [
    "EPS",
    "ConfusionError",
    "as_pair",
    "normalize",
    "derived_confidence",
    "ece",
    "reliability_bins",
    "brier",
    "log_loss",
    "risk_coverage_curve",
    "automation_rate_at_accuracy",
    "auc_of_tradeoff",
    "argmax",
    "FLIP_GATE_MARGIN",
    "expected_flip_rate",
    "conditioned_flip_gate",
    "conditioned_flip_ok",
]

EPS = 1e-12
# Clip probabilities in log_loss to avoid infinite penalties.
_CLIP_LO = 1e-15
_CLIP_HI = 1.0 - 1e-15


class ConfusionError(ValueError):
    """Raised when inputs are structurally unusable (not merely degenerate)."""


# ---------------------------------------------------------------------------
# helpers
# ---------------------------------------------------------------------------


def as_pair(p: float) -> tuple[float, float]:
    """Return ``(p_true, p_false)`` for a Bernoulli probability ``p``.

    Accepts any float; clamps to [0, 1]. ``as_pair(0.72) == (0.72, 0.28)``.
    """
    p = min(max(float(p), 0.0), 1.0)
    return (p, 1.0 - p)


def normalize(
    probs: Optional[Sequence[float]],
) -> tuple[float, ...]:
    """Defensively normalize a probability vector.

    Handles ``None`` (treated as an empty/uniform-void vector -> raises), the
    empty vector (raises: no belief), and vectors that do not sum to 1
    (rescaled).  A vector of all-zeros raises: it encodes no belief.
    """
    if probs is None:
        raise ConfusionError("probability vector is None")
    vec = tuple(float(x) for x in probs)
    if not vec:
        raise ConfusionError("empty probability vector")
    total = sum(vec)
    if total <= 0.0:
        raise ConfusionError(
            "probability vector sums to <= 0; it encodes no belief"
        )
    if any(x < 0.0 for x in vec):
        raise ConfusionError("probability vector contains negative entries")
    if abs(total - 1.0) <= EPS:
        return vec
    return tuple(x / total for x in vec)


def argmax(probs: Optional[Sequence[float]]) -> int:
    """Index of the maximum entry; first index wins ties (deterministic)."""
    vec = normalize(probs)
    best = 0
    for i in range(1, len(vec)):
        if vec[i] > vec[best]:
            best = i
    return best


def _flatten(probs: Sequence[Sequence[float] | None],
             outcomes: Sequence[int]) -> Iterator[tuple[tuple[float, ...], int]]:
    if len(probs) != len(outcomes):
        raise ConfusionError(
            f"probs/outcomes length mismatch: {len(probs)} != {len(outcomes)}"
        )
    for row, outcome in zip(probs, outcomes):
        yield normalize(row), int(outcome)


def _top1(row: Sequence[float]) -> float:
    return max(row)


def derived_confidence(probs: Optional[Sequence[float]]) -> float:
    """Deem/Jev derived confidence for a choice distribution.

    Semantics (Jev's published formula): rescale the peak probability of an
    ``N``-option distribution to the unit interval,

        C = (N * p_max - 1) / (N - 1)        for N > 1
        C = p_max                           for N == 1

    so a uniform distribution (p_max = 1/N) maps to 0 and a certain choice
    (p_max = 1) maps to 1.  For N == 1 there is no choice to make and the
    single "probability" is passed through, clamped to [0, 1].

    Raises ``ConfusionError`` on empty/zero-sum vectors (and on a
    single-element vector that is not a probability).
    """
    if probs is None:
        raise ConfusionError("probability vector is None")
    if len(probs) == 1:
        # A lone Bernoulli probability is already normalized; do not let
        # the defensive rescaling below crush [p] into [1.0].
        p = float(probs[0])
        if not 0.0 <= p <= 1.0:
            raise ConfusionError(
                f"single-option confidence {p} is not a probability"
            )
        return p
    vec = normalize(probs)
    n = len(vec)
    p_max = _top1(vec)
    if n == 1:
        return min(max(p_max, 0.0), 1.0)
    return (n * p_max - 1.0) / (n - 1.0)


# ---------------------------------------------------------------------------
# calibration
# ---------------------------------------------------------------------------


def reliability_bins(
    probs: Sequence[Sequence[float] | None],
    outcomes: Sequence[int],
    n_bins: int = 10,
) -> list[dict[str, float]]:
    """Per-bin reliability table.

    Items are binned by top-class probability ``p_max`` — the standard
    reliability-diagram convention.  Bins are equal-width over [0, 1]:
    bin ``i`` covers ``[i/n_bins, (i+1)/n_bins)`` with the last bin also
    catching ``p_max == 1.0`` (so a p_max of exactly 1.0 lands in the last
    bin).

    Returns one dict per bin with keys::

        low, high   bin edges
        count       number of items in the bin
        mean_prob   mean p_max over items in the bin
        empirical_acc   mean outcome (fraction correct) in the bin

    Empty bins have ``mean_prob = empirical_acc = 0.0`` and are included so
    that diagrams have a stable x-axis.
    """
    if n_bins <= 0:
        raise ConfusionError(f"n_bins must be positive, got {n_bins}")
    bins: list[dict[str, float]] = [
        {
            "low": i / n_bins,
            "high": (i + 1) / n_bins,
            "count": 0,
            "mean_prob": 0.0,
            "empirical_acc": 0.0,
        }
        for i in range(n_bins)
    ]
    sums = [[0.0, 0.0, 0] for _ in range(n_bins)]  # [p_sum, acc_sum, n]
    for row, outcome in _flatten(probs, outcomes):
        idx = min(int(_top1(row) * n_bins), n_bins - 1)
        acc = 1.0 if outcome == argmax(row) else 0.0
        s = sums[idx]
        s[0] += _top1(row)
        s[1] += acc
        s[2] += 1
    for i, (p_sum, acc_sum, n) in enumerate(sums):
        bins[i]["count"] = n
        if n:
            bins[i]["mean_prob"] = p_sum / n
            bins[i]["empirical_acc"] = acc_sum / n
    return bins


def ece(
    probs: Sequence[Sequence[float] | None],
    outcomes: Sequence[int],
    n_bins: int = 10,
) -> float:
    """Expected Calibration Error (equal-width binned, confidence-weighted).

    ``ECE = sum_i (n_i / N) * |acc_i - conf_i|`` over non-empty bins, where
    the item-level confidence is the top-class probability.  Empty inputs
    return 0.0; single-class data yields a well-defined (if uninformative)
    number.
    """
    bins = reliability_bins(probs, outcomes, n_bins)
    n_total = sum(b["count"] for b in bins)
    if n_total == 0:
        return 0.0
    return float(
        sum(
            (b["count"] / n_total) * abs(b["empirical_acc"] - b["mean_prob"])
            for b in bins
            if b["count"]
        )
    )


def brier(
    probs: Sequence[Sequence[float] | None],
    outcomes: Sequence[int],
) -> float:
    """Multi-class Brier score (mean over items).

    ``B = (1/N) * sum_items sum_k (p_k - 1[outcome == k])^2`` — the
    multi-category definition (not the half-Brier), so a perfect prediction
    scores 0 and a uniform prediction over K options scores ``(K-1)/K``.
    """
    rows = list(_flatten(probs, outcomes))
    if not rows:
        return 0.0
    total = 0.0
    for row, outcome in rows:
        total += sum(
            (p - (1.0 if outcome == k else 0.0)) ** 2 for k, p in enumerate(row)
        )
    return total / len(rows)


def log_loss(
    probs: Sequence[Sequence[float] | None],
    outcomes: Sequence[int],
) -> float:
    """Mean negative log-likelihood of the correct class, clipped.

    Probabilities are clipped to [1e-15, 1 - 1e-15] so a wrong-but-certain
    prediction yields ~34.54 rather than infinity, and a ``p = 0`` for the
    correct class is survivable.
    """
    rows = list(_flatten(probs, outcomes))
    if not rows:
        return 0.0
    total = 0.0
    for row, outcome in rows:
        if not 0 <= outcome < len(row):
            raise ConfusionError(
                f"outcome index {outcome} out of range for {len(row)} options"
            )
        p = min(max(row[outcome], _CLIP_LO), _CLIP_HI)
        total -= math.log(p)
    return total / len(rows)


# ---------------------------------------------------------------------------
# risk-coverage / automation tradeoff
# ---------------------------------------------------------------------------


def risk_coverage_curve(
    probs: Sequence[Sequence[float] | None],
    correct: Sequence[bool | int],
    thresholds: Optional[Iterable[float]] = None,
) -> list[dict[str, float]]:
    """Risk-coverage points, one per supplied (or default) threshold.

    An item is *automated* when its top-class probability is >= threshold;
    ``accuracy`` is the fraction of automated items that were correct,
    ``automation`` (coverage) is the fraction of items automated.

    Thresholds default to a 101-point sweep ``[0.00, 0.01, ..., 1.00]``.
    Each point is a dict with keys ``threshold, automation, accuracy,
    automatable`` where the last is the absolute count (float for JSON
    friendliness).  Empty inputs yield points with automation 0 and
    accuracy 0 (nothing automatable, no claim).
    """
    if len(probs) != len(correct):
        raise ConfusionError(
            f"probs/correct length mismatch: {len(probs)} != {len(correct)}"
        )
    if thresholds is None:
        thresholds = [i / 100.0 for i in range(101)]
    tops: list[float] = []
    hits: list[bool] = []
    for row, was_correct in zip(probs, correct):
        vec = normalize(row)
        tops.append(_top1(vec))
        hits.append(bool(was_correct))
    n = len(tops)
    points: list[dict[str, float]] = []
    for t in thresholds:
        t = float(t)
        automated = sum(1 for p in tops if p >= t)
        right = sum(1 for p, h in zip(tops, hits) if p >= t and h)
        automation = automated / n if n else 0.0
        accuracy = right / automated if automated else 0.0
        points.append(
            {
                "threshold": t,
                "automation": automation,
                "accuracy": accuracy,
                "automatable": float(automated),
            }
        )
    return points


def automation_rate_at_accuracy(
    probs: Sequence[Sequence[float] | None],
    correct: Sequence[bool | int],
    target_acc: float,
    thresholds: Optional[Iterable[float]] = None,
) -> float:
    """Fraction of decisions automatable while holding accuracy >= target.

    Scans the same threshold grid as :func:`risk_coverage_curve` (highest
    automation wins ties).  Returns the largest automation rate whose
    accuracy meets or exceeds ``target_acc``.  If *no* threshold meets the
    target (including empty input), returns 0.0 — the honest answer, not an
    exception: a benchmark must distinguish "cannot automate" from "crashed".
    """
    curve = risk_coverage_curve(probs, correct, thresholds)
    best_automation = 0.0
    for pt in curve:
        if pt["accuracy"] >= target_acc:
            if pt["automation"] >= best_automation:
                best_automation = pt["automation"]
    return best_automation


def auc_of_tradeoff(
    probs: Sequence[Sequence[float] | None],
    correct: Sequence[bool | int],
    thresholds: Optional[Iterable[float]] = None,
) -> float:
    """Area under the accuracy-vs-automation tradeoff curve.

    Computed by trapezoid integration of accuracy over automation as the
    threshold sweeps from automating-everything (threshold 0) to
    automating-nothing (threshold 1).  The endpoint at automation = 0 is
    included with accuracy carried from the smallest non-empty automation
    level, so a perfect classifier integrates to ~1.0 and a random one to
    ~base-rate accuracy.
    """
    points = risk_coverage_curve(probs, correct, thresholds)
    if not points:
        return 0.0
    # Build (automation, accuracy) pairs, sorting by automation ascending.
    pairs: list[tuple[float, float]] = [(p["automation"], p["accuracy"]) for p in points]
    pairs.sort(key=lambda x: (x[0], -x[1]))
    # Carry accuracy from the smallest positive-automation point onto all
    # zero-automation points, so the curve meets the y-axis at the accuracy
    # of the highest threshold that automates anything (right-limit), instead
    # of collapsing to 0.
    carried = next((acc for cov, acc in pairs if cov > 0.0), 0.0)
    pairs = [(cov, acc if cov > 0.0 else carried) for cov, acc in pairs]
    area = 0.0
    for i in range(1, len(pairs)):
        x0, y0 = pairs[i - 1]
        x1, y1 = pairs[i]
        area += (y0 + y1) / 2.0 * (x1 - x0)
    return float(area)


# ---------------------------------------------------------------------------
# accuracy-conditioned permutation-flip gate
# ---------------------------------------------------------------------------

#: Default tolerance added to the honest-null flip rate.  At the probe's
#: customary n=150 rows the binomial standard error of a flip-rate estimate
#: never exceeds ~0.04 (it peaks at ~0.035 near the null's own ceiling,
#: 1 - 1/N = 0.75 for N=4), so 0.05 is roughly one standard error of
#: measurement noise.  The honest-vs-shortcut gap it arbitrates is an order
#: of magnitude larger (0.35 vs 0.99 in the data that motivated the gate).
FLIP_GATE_MARGIN = 0.05


def _as_rate(value, name: str) -> float:
    """Coerce and validate a rate-like scalar (unit interval)."""
    try:
        x = float(value)
    except (TypeError, ValueError):
        raise ConfusionError(f"{name} is not a number: {value!r}") from None
    if not 0.0 <= x <= 1.0:
        raise ConfusionError(f"{name} must be in [0, 1], got {value!r}")
    return x


def expected_flip_rate(accuracy: float, n_options: int) -> float:
    """Flip rate of an *honest* model at ``accuracy`` on ``n_options``.

    The honest null: on each question the model either *knows* an answer
    (its argmax is invariant under option permutation) or *guesses*
    uniformly.  A question flips only when guessed, so with guess
    fraction ``g`` the flip rate is ``g * (1 - 1/N)`` and the accuracy is
    ``q_c + g/N`` (knowledge used correctly).  Maximising flips at fixed
    accuracy (all knowledge correct) gives::

        acc >= 1/N:   F_null = 1 - acc
        acc <= 1/N:   F_null = acc * (N - 1)

    which is the largest flip rate honest uncertainty can produce at that
    accuracy — a position-consistent model can be wrong (it flips 0 and
    scores 0), but a model flipping *above* ``F_null`` is not merely
    uncertain: its argmax is position-tied.  Uniform guessing
    (``acc = 1/N``) flips at ``1 - 1/N`` (0.75 for N=4); a fully
    confident model (``acc = 1``) flips at 0.

    ``n_options == 1`` means no permutation can change anything: the
    null is 0.
    """
    acc = _as_rate(accuracy, "accuracy")
    try:
        n = int(n_options)
    except (TypeError, ValueError):
        raise ConfusionError(f"n_options is not an integer: {n_options!r}") from None
    if n < 1:
        raise ConfusionError(f"n_options must be >= 1, got {n_options!r}")
    if n == 1:
        return 0.0
    chance = 1.0 / n
    if acc <= chance:
        return acc * (n - 1)
    return 1.0 - acc


def conditioned_flip_gate(
    flip_rate: float,
    accuracy: float,
    n_options: int,
    margin: float = FLIP_GATE_MARGIN,
) -> dict[str, float | bool | int]:
    """Verdict for a permutation flip rate under the conditioned gate.

    The raw gate — ``flip_rate < 2%`` unconditionally — is miscalibrated
    at low accuracy: a uniform-guessing model flips at ``1 - 1/N``
    (~0.75 for N=4), so near-chance accuracy *must* flip.  The
    conditioned gate passes a model only while its flip rate stays
    within what honest uncertainty at its accuracy can explain::

        flip_rate <= expected_flip_rate(acc, N) + margin

    Use an accuracy that position shortcuts cannot inflate (e.g. the
    mean permuted accuracy of the probe, or the min of identity and
    permuted accuracy) — a position-tied model scores near chance there.

    Returns a dict with keys ``ok`` (bool), ``flip_rate``, ``null``
    (the honest-null rate), ``threshold`` (null + margin), ``margin``,
    ``accuracy`` and ``n_options``.
    """
    flip = _as_rate(flip_rate, "flip_rate")
    try:
        m = float(margin)
    except (TypeError, ValueError):
        raise ConfusionError(f"margin is not a number: {margin!r}") from None
    if m < 0.0:
        raise ConfusionError(f"margin must be >= 0, got {margin!r}")
    null = expected_flip_rate(accuracy, n_options)
    threshold = null + m
    return {
        "ok": flip <= threshold,
        "flip_rate": flip,
        "null": null,
        "threshold": threshold,
        "margin": m,
        "accuracy": float(accuracy),
        "n_options": int(n_options),
    }


def conditioned_flip_ok(
    flip_rate: float,
    accuracy: float,
    n_options: int,
    margin: float = FLIP_GATE_MARGIN,
) -> bool:
    """Boolean convenience wrapper for :func:`conditioned_flip_gate`."""
    return bool(
        conditioned_flip_gate(flip_rate, accuracy, n_options, margin)["ok"]
    )
