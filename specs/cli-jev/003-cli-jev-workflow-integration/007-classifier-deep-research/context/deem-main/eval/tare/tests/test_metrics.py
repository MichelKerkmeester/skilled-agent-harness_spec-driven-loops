"""Hand-computed tests for Tare core metrics."""

import math

import pytest

import metrics
from metrics import (
    ConfusionError,
    automation_rate_at_accuracy,
    brier,
    derived_confidence,
    ece,
    log_loss,
    reliability_bins,
    risk_coverage_curve,
    auc_of_tradeoff,
)


class TestECE:
    def test_perfect_predictions_give_zero(self):
        probs = [[1.0, 0.0], [0.0, 1.0], [1.0, 0.0], [0.0, 1.0]]
        outcomes = [0, 1, 0, 1]
        assert ece(probs, outcomes) == pytest.approx(0.0, abs=1e-12)

    def test_hand_computed_overconfident_case(self):
        # 4 items all predicting their top class with p_max = 0.9,
        # but only half are right: ECE = |0.5 - 0.9| = 0.4.
        probs = [[0.9, 0.1]] * 4
        outcomes = [0, 1, 0, 1]
        assert ece(probs, outcomes) == pytest.approx(0.4)

    def test_hand_computed_two_bins(self):
        # Two items in bin [0.5, 0.6): p_max 0.55, one right (acc 0.5);
        # two items in bin [0.8, 0.9): p_max 0.85, both right.
        # ECE = (2/4)*|0.5 - 0.55| + (2/4)*|1.0 - 0.85| = 0.025 + 0.075.
        probs = [[0.55, 0.45], [0.55, 0.45], [0.85, 0.15], [0.85, 0.15]]
        outcomes = [0, 1, 0, 0]
        assert ece(probs, outcomes) == pytest.approx(0.1)

    def test_empty(self):
        assert ece([], []) == 0.0

    def test_single_class(self):
        assert ece([[1.0]], [0]) == pytest.approx(0.0)

    def test_non_normalized_probs_are_rescaled(self):
        # [2, 1] normalizes to [2/3, 1/3]; p_max = 2/3 with outcome right.
        # Bin [0.6, 0.7): |acc 1.0 - conf 2/3| = 1/3.
        assert ece([[2.0, 1.0]], [0]) == pytest.approx(1.0 / 3.0)

    def test_zero_sum_raises(self):
        with pytest.raises(ConfusionError):
            ece([[0.0, 0.0]], [0])


class TestReliabilityBins:
    def test_bin_edges_and_content(self):
        bins = reliability_bins([[1.0, 0.0], [0.55, 0.45]], [0, 1])
        assert len(bins) == 10
        # p_max = 0.55 -> bin 5; p_max = 1.0 -> bin 9.
        assert bins[5]["count"] == 1
        assert bins[9]["count"] == 1
        assert bins[5]["mean_prob"] == pytest.approx(0.55)
        assert bins[5]["empirical_acc"] == pytest.approx(0.0)
        assert bins[9]["mean_prob"] == pytest.approx(1.0)
        assert bins[9]["empirical_acc"] == pytest.approx(1.0)
        assert sum(b["count"] for b in bins) == 2

    def test_n_bins(self):
        assert len(reliability_bins([[1.0]], [0], n_bins=3)) == 3


class TestBrier:
    def test_perfect(self):
        assert brier([[1.0, 0.0]], [0]) == pytest.approx(0.0)

    def test_uniform_scores_half(self):
        # Uniform over K=2 scores (K-1)/K = 0.5 for either outcome.
        assert brier([[0.5, 0.5]], [0]) == pytest.approx(0.5)

    def test_uniform_k_classes(self):
        k = 5
        assert brier([[1 / k] * k], [2]) == pytest.approx((k - 1) / k)

    def test_empty(self):
        assert brier([], []) == 0.0


class TestLogLoss:
    def test_perfect(self):
        assert log_loss([[1.0, 0.0]], [0]) == pytest.approx(0.0)

    def test_clipped_not_infinite(self):
        # p = 0 for the correct class must not yield infinity.
        assert log_loss([[0.0, 1.0]], [0]) == pytest.approx(-math.log(1e-15))

    def test_simple(self):
        assert log_loss([[0.25, 0.75]], [1]) == pytest.approx(-math.log(0.75))


class TestDerivedConfidence:
    """C = (N * p_max - 1) / (N - 1), Jev semantics."""

    def test_n_equals_1_passthrough(self):
        assert derived_confidence([0.6]) == pytest.approx(0.6)
        assert derived_confidence([1.0]) == pytest.approx(1.0)

    def test_n_equals_2(self):
        assert derived_confidence([0.5, 0.5]) == pytest.approx(0.0)
        assert derived_confidence([1.0, 0.0]) == pytest.approx(1.0)
        assert derived_confidence([0.75, 0.25]) == pytest.approx(0.5)

    def test_n_equals_10(self):
        assert derived_confidence([0.1] * 10) == pytest.approx(0.0)
        assert derived_confidence([1.0] + [0.0] * 9) == pytest.approx(1.0)
        assert derived_confidence([0.55] + [0.05] * 9) == pytest.approx(0.5)
        # p_max = 0.28 -> (2.8 - 1) / 9
        assert derived_confidence([0.28, 0.08, 0.08, 0.08, 0.08,
                                   0.08, 0.08, 0.08, 0.08, 0.08]) == \
            pytest.approx(0.2)

    def test_non_normalized(self):
        # [2, 1, 1] normalizes to [0.5, 0.25, 0.25]; (3*0.5 - 1)/2 = 0.25.
        assert derived_confidence([2.0, 1.0, 1.0]) == pytest.approx(0.25)


class TestRiskCoverage:
    def _monotone_dataset(self, n=30):
        """Correct items get high p_max, wrong items low p_max."""
        probs, correct = [], []
        for i in range(n):
            if i % 3 == 0:  # wrong, confident-ly wrong-ish (low band)
                probs.append([0.55 + 0.04 * (i % 10 / 10), 0.45 - 0.04 * (i % 10 / 10)])
                correct.append(False)
            else:  # right, higher band
                top = 0.75 + 0.2 * ((i % 7) / 7)
                probs.append([top, 1 - top])
                correct.append(True)
        return probs, correct

    def test_accuracy_monotone_nondecreasing(self):
        probs, correct = self._monotone_dataset()
        curve = risk_coverage_curve(probs, correct)
        # Accuracy is undefined (0 by convention) at zero automation, so
        # monotonicity is asserted over points that automate something.
        accuracies = [pt["accuracy"] for pt in curve if pt["automatable"] > 0]
        for lo, hi in zip(accuracies, accuracies[1:]):
            assert hi >= lo - 1e-12

    def test_automation_monotone_nondecreasing(self):
        # Higher threshold -> automated set shrinks -> automation falls.
        probs, correct = self._monotone_dataset()
        curve = risk_coverage_curve(probs, correct)
        automations = [pt["automation"] for pt in curve]
        for lo, hi in zip(automations, automations[1:]):
            assert hi <= lo + 1e-12

    def test_hand_computed_point(self):
        # tops are 0.9, 0.6, 0.4 (the last item's top class is option 0).
        probs = [[0.9, 0.1], [0.6, 0.4], [0.4, 0.35, 0.25]]
        correct = [True, False, True]
        curve = risk_coverage_curve(probs, correct, thresholds=[0.5])
        assert len(curve) == 1
        assert curve[0]["automation"] == pytest.approx(2 / 3)
        assert curve[0]["accuracy"] == pytest.approx(1 / 2)
        assert curve[0]["automatable"] == 2

    def test_empty(self):
        curve = risk_coverage_curve([], [])
        assert all(pt["automation"] == 0.0 for pt in curve)
        assert all(pt["accuracy"] == 0.0 for pt in curve)


class TestAutomationRate:
    def test_hand_computed(self):
        # 5 right items at p_max = 1.0, 5 coin-flips at p_max = 0.5.
        probs = ([[1.0, 0.0]] * 5) + [[0.5, 0.5]] * 5
        correct = [True] * 5 + [True, False, True, False, True]
        # Automating only the certain items: 50% coverage at 100% accuracy.
        assert automation_rate_at_accuracy(probs, correct, 0.99) == \
            pytest.approx(0.5)
        # Low bar: automate everything (threshold 0 covers all).
        assert automation_rate_at_accuracy(probs, correct, 0.5) == \
            pytest.approx(1.0)

    def test_unreachable_target_returns_zero(self):
        probs = [[0.5, 0.5], [0.5, 0.5]]
        assert automation_rate_at_accuracy(probs, [False, False], 0.9) == 0.0

    def test_empty(self):
        assert automation_rate_at_accuracy([], [], 0.9) == 0.0


class TestAucOfTradeoff:
    def test_perfect_classifier_integrates_to_one(self):
        probs = []
        correct = []
        for i in range(10):
            top = 0.6 + 0.04 * i
            probs.append([top, 1 - top])
            correct.append(True)
        assert auc_of_tradeoff(probs, correct) == pytest.approx(1.0)

    def test_empty(self):
        assert auc_of_tradeoff([], []) == 0.0


class TestArgmax:
    def test_tie_breaks_low(self):
        assert metrics.argmax([0.5, 0.5]) == 0

    def test_non_normalized(self):
        assert metrics.argmax([1, 2, 4]) == 2
