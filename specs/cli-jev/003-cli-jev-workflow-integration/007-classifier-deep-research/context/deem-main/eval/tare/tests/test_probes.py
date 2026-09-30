"""Tests for Tare consistency probes, incl. the Jev 0.72/0.47 case."""

import pytest

import probes
from probes import (
    negation_consistency_error,
    negation_paired_accuracy,
    paraphrase_consistency,
    permutation_flip_rate,
)


class TestJevDocumentedFailure:
    """Noul(refund) = 0.72, Noul(not refund) = 0.47, truth: refund is due."""

    PA = 0.72
    P_NOT_A = 0.47

    def test_consistency_error_is_0_19(self):
        # |P(a) - (1 - P(not a))| = |0.72 - 0.53| = 0.19
        assert negation_consistency_error(self.PA, self.P_NOT_A) == \
            pytest.approx(0.19)

    def test_paired_accuracy_both_directions_correct(self):
        res = negation_paired_accuracy(self.PA, self.P_NOT_A, True)
        # From P(a): 0.72 >= 0.5 -> predicts "refund" -> right.
        assert res["accuracy_from_p"] == 1.0
        # From P(not a): 0.47 < 0.5 -> predicts "refund" -> right.
        assert res["accuracy_from_not_p"] == 1.0
        assert res["paired_accuracy"] == 1.0
        # The decisions agree *and* are correct — yet the probabilities
        # are inconsistent (0.19); the two numbers tell different stories.
        assert res["agreement_rate"] == 1.0
        assert res["n"] == 1

    def test_paired_accuracy_when_truth_is_the_other_way(self):
        res = negation_paired_accuracy(self.PA, self.P_NOT_A, False)
        # Both directions confidently assert "refund" when none is due.
        assert res["accuracy_from_p"] == 0.0
        assert res["accuracy_from_not_p"] == 0.0
        assert res["paired_accuracy"] == 0.0
        assert res["agreement_rate"] == 1.0


class TestNegationProbe:
    def test_perfect_pair(self):
        res = negation_paired_accuracy(0.8, 0.2, True)
        assert res["consistency_error"] == pytest.approx(0.0)
        assert res["paired_accuracy"] == 1.0

    def test_disagreeing_pair(self):
        # P(a) says "a" (0.55 >= 0.5); P(not a) also says "not a" (0.6).
        res = negation_paired_accuracy(0.55, 0.6, True)
        assert res["consistency_error"] == pytest.approx(0.15)
        assert res["accuracy_from_p"] == 1.0
        assert res["accuracy_from_not_p"] == 0.0
        assert res["paired_accuracy"] == 0.0
        assert res["agreement_rate"] == 0.0

    def test_batches_and_min_semantics(self):
        # Batch: direction A is right on both items, direction B only once.
        res = negation_paired_accuracy(
            [0.9, 0.1],   # p_a
            [0.1, 0.9],   # p_not_a
            [True, False],
        )
        assert res["n"] == 2
        assert res["accuracy_from_p"] == 1.0
        assert res["accuracy_from_not_p"] == 1.0
        # Now corrupt one direction's second item.
        res = negation_paired_accuracy(
            [0.9, 0.7],
            [0.1, 0.9],
            [True, False],
        )
        # Item 2: p_a=0.7 predicts "a", truth False -> wrong;
        # p_not_a=0.9 predicts "not a", truth False -> right.
        assert res["accuracy_from_p"] == 0.5
        assert res["accuracy_from_not_p"] == 1.0
        assert res["paired_accuracy"] == 0.5

    def test_empty(self):
        res = negation_paired_accuracy([], [], [])
        assert res["n"] == 0
        assert res["paired_accuracy"] == 0.0
        assert res["consistency_error"] == 0.0

    def test_length_mismatch_raises(self):
        with pytest.raises(ValueError):
            negation_paired_accuracy([0.6, 0.6], [0.4], [True])


class TestPermutationFlipRate:
    def test_no_flips(self):
        res = permutation_flip_rate([[0, 0, 0], [1, 1], [2]])
        assert res["flip_rate"] == 0.0
        assert res["flipped"] == 0
        assert res["n"] == 3

    def test_flips(self):
        res = permutation_flip_rate([[0, 0, 1], [1, 1]])
        assert res["flip_rate"] == pytest.approx(0.5)
        assert res["flipped"] == 1
        assert res["n"] == 2

    def test_permuted_pairs_are_canonicalized(self):
        # (position, permutation) where permutation[j] = original id at j.
        res = permutation_flip_rate([
            [(0, (2, 0, 1)), (1, (1, 2, 0))],  # -> 2, 2 (no flip)
            [(0, (0, 1, 2)), (1, (0, 2, 1))],  # -> 0, 1 (flip)
        ])
        assert res["flipped"] == 1
        assert res["flip_rate"] == pytest.approx(0.5)

    def test_empty(self):
        assert permutation_flip_rate([]) == {"flip_rate": 0.0, "flipped": 0, "n": 0}


class TestParaphraseConsistency:
    def test_all_agree(self):
        res = paraphrase_consistency([[1, 1, 1], [2, 2]])
        assert res["consistency"] == 1.0
        assert res["mean_majority_agreement"] == 1.0

    def test_partial(self):
        res = paraphrase_consistency([[1, 1, 1], [2, 2, 3]])
        assert res["consistency"] == pytest.approx(0.5)
        assert res["mean_majority_agreement"] == pytest.approx((1 + 2 / 3) / 2)

    def test_empty(self):
        assert paraphrase_consistency([]) == {
            "consistency": 0.0, "mean_majority_agreement": 0.0, "n": 0,
        }


def test_module_exports():
    assert probes.DECISION_THRESHOLD == 0.5
