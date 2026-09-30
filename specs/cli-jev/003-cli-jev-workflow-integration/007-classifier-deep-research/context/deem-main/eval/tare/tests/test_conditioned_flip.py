"""Accuracy-conditioned permutation-flip gate (see eval/tare/README.md).

Historical anchors used as regression constants:

* v5 mmlu — flip 0.347, identity accuracy 0.467 on N=4 — the honest-
  uncertainty outlier that the unconditional <2% gate misreads as a
  position shortcut.
* v2 tuned — flip 0.92-0.99 across datasets at 0.25-0.92 accuracy — the
  real position-shortcut failure, which must keep failing.
"""

import pytest

import metrics
from metrics import (
    FLIP_GATE_MARGIN,
    ConfusionError,
    conditioned_flip_gate,
    conditioned_flip_ok,
    expected_flip_rate,
)


class TestExpectedFlipRate:
    def test_uniform_guessing_flips_at_1_minus_1_over_n(self):
        assert expected_flip_rate(1 / 4, 4) == pytest.approx(0.75)
        assert expected_flip_rate(1 / 2, 2) == pytest.approx(0.50)
        assert expected_flip_rate(1 / 3, 3) == pytest.approx(2 / 3)

    def test_confident_model_flips_at_zero(self):
        assert expected_flip_rate(1.0, 4) == 0.0
        assert expected_flip_rate(1.0, 2) == 0.0

    def test_above_chance_null_is_one_minus_acc(self):
        assert expected_flip_rate(0.90, 4) == pytest.approx(0.10)
        assert expected_flip_rate(0.467, 4) == pytest.approx(0.533)

    def test_sub_chance_null_falls_below_uniform(self):
        # acc < 1/N: g = N*acc, F = acc * (N-1).
        assert expected_flip_rate(0.20, 4) == pytest.approx(0.60)
        assert expected_flip_rate(0.0, 4) == 0.0

    def test_continuous_at_chance(self):
        # Both branches agree at acc = 1/N.
        for n in (2, 3, 4, 5):
            assert expected_flip_rate(1 / n, n) == pytest.approx(1 - 1 / n)

    def test_single_option_never_flips(self):
        assert expected_flip_rate(0.5, 1) == 0.0
        assert expected_flip_rate(1.0, 1) == 0.0


class TestConditionedFlipGate:
    def test_random_guessing_sanity(self):
        # A uniform guesser: acc 1/N, flip 1 - 1/N -> inside the null.
        assert conditioned_flip_ok(0.75, 0.25, 4)
        # But no honest model flips above uniform guessing.
        assert not conditioned_flip_ok(1.0, 0.25, 4)
        assert not conditioned_flip_ok(0.99, 0.25, 4)

    def test_confident_model_sanity(self):
        # Confident and consistent: acc 1.0, flip 0.
        assert conditioned_flip_ok(0.0, 1.0, 4)
        # Confident accuracy with ~uniform flipping is the position-shortcut
        # signature (v2 tuned: identity acc 0.84, flip 0.993).
        assert not conditioned_flip_ok(0.99, 0.84, 4)

    def test_v5_mmlu_honest_uncertainty_passes(self):
        res = conditioned_flip_gate(0.3467, 0.4667, 4)
        assert res["ok"]
        assert res["null"] == pytest.approx(0.5333)
        assert res["threshold"] == pytest.approx(0.5333 + FLIP_GATE_MARGIN)

    def test_v5_signal_datasets_pass(self):
        # (flip_rate, identity acc, N) from scripts/sft/consistency_v5.json.
        for flip, acc, n in [
            (0.000, 0.900, 4),   # ag_news
            (0.020, 0.713, 5),   # amazon_reviews
            (0.0067, 0.867, 3),  # fever
            (0.013, 0.887, 3),   # snli
        ]:
            assert conditioned_flip_ok(flip, acc, n), (flip, acc, n)

    def test_v2_position_shortcut_still_fails(self):
        # (flip_rate, held-out tuned accuracy, N) from consistency_v2.json
        # and results_v2_qwen35_08b.json — every dataset must keep failing.
        for flip, acc, n in [
            (0.993, 0.897, 4),   # ag_news
            (0.987, 0.378, 5),   # amazon_reviews
            (0.953, 0.760, 3),   # snli
            (0.987, 0.253, 4),   # mmlu (barely above chance: null 0.747)
            (0.920, 0.779, 3),   # fever
        ]:
            assert not conditioned_flip_ok(flip, acc, n), (flip, acc, n)

    def test_v2_shortcut_fails_even_conditioned_on_shuffled_accuracy(self):
        # v2 tuned ag_news shuffled accuracy was 0.26; the gate must not
        # let the shortcut pass by claiming its (chance) shuffled accuracy.
        assert not conditioned_flip_ok(0.993, 0.26, 4)


class TestGateBoundaryAndErrors:
    def test_exact_threshold_passes(self):
        # flip == null + margin is inside the gate (<=).
        assert conditioned_flip_ok(0.5333 + FLIP_GATE_MARGIN, 0.4667, 4)
        assert not conditioned_flip_ok(0.5333 + FLIP_GATE_MARGIN + 1e-9, 0.4667, 4)

    def test_zero_margin(self):
        assert conditioned_flip_ok(0.75, 0.25, 4, margin=0.0)
        assert not conditioned_flip_ok(0.75 + 1e-9, 0.25, 4, margin=0.0)

    def test_gate_dict_fields(self):
        res = conditioned_flip_gate(0.02, 0.713, 5)
        assert res["ok"] is True
        assert res["flip_rate"] == pytest.approx(0.02)
        assert res["null"] == pytest.approx(0.287)
        assert res["threshold"] == pytest.approx(0.287 + FLIP_GATE_MARGIN)
        assert res["margin"] == FLIP_GATE_MARGIN
        assert res["accuracy"] == pytest.approx(0.713)
        assert res["n_options"] == 5

    def test_invalid_inputs_raise(self):
        with pytest.raises(ConfusionError):
            expected_flip_rate(1.5, 4)  # accuracy > 1
        with pytest.raises(ConfusionError):
            expected_flip_rate(-0.1, 4)  # accuracy < 0
        with pytest.raises(ConfusionError):
            expected_flip_rate(0.5, 0)  # no options
        with pytest.raises(ConfusionError):
            conditioned_flip_ok(-0.01, 0.5, 4)  # negative flip rate
        with pytest.raises(ConfusionError):
            conditioned_flip_ok(0.1, 0.5, 4, margin=-1.0)  # negative margin
        with pytest.raises(ConfusionError):
            conditioned_flip_ok(None, 0.5, 4)
