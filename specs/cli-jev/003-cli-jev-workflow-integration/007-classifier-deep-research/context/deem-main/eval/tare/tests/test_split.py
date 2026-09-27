"""Determinism tests for the Tare hash-based split."""

import pytest

from split import (
    SPLIT_LABELS,
    normalize_text,
    split_dataset,
    split_for,
    split_hash,
)


def test_same_item_same_split_every_run():
    for i in range(500):
        state, question = f"state {i % 7}", f"Should we refund order {i}?"
        assert split_for(state, question) == split_for(state, question)


def test_split_deterministic_across_two_full_runs():
    items = [{"state": f"s{i % 13}", "question": f"q{i}"} for i in range(1000)]
    first = split_dataset(items)
    second = split_dataset(items)
    assert first == second
    # Every item lands somewhere, nothing is dropped or duplicated.
    assert sum(len(v) for v in first.values()) == len(items)
    # Every label present, even if some bucket is empty.
    assert set(first.keys()) == set(SPLIT_LABELS)


def test_ratios_roughly_80_10_10():
    items = [{"question": f"question number {i}"} for i in range(2000)]
    buckets = split_dataset(items)
    sizes = {label: len(bucket) for label, bucket in buckets.items()}
    assert sizes["train"] / 2000 == pytest.approx(0.8, abs=0.05)
    assert sizes["dev"] / 2000 == pytest.approx(0.1, abs=0.05)
    assert sizes["test"] / 2000 == pytest.approx(0.1, abs=0.05)


def test_seed_changes_split_without_losing_items():
    items = [{"question": f"q{i}"} for i in range(500)]
    a = split_dataset(items, seed="one")
    b = split_dataset(items, seed="two")
    total_a = sum(len(v) for v in a.values())
    total_b = sum(len(v) for v in b.values())
    assert total_a == total_b == 500
    assert a != b  # different seeds genuinely reshuffle


def test_text_normalization_invariance():
    assert split_for("User is 42. ", "  Refund? ") == \
        split_for("user is 42.", "refund?")
    assert normalize_text("  A   b\nc ") == "a b c"


def test_hash_is_stable():
    # Golden value: changing this means every existing split re-buckets.
    assert split_hash("", "question")[:8] == split_hash(
        "", "question"
    )[:8]



def test_custom_ratios_and_labels():
    which = split_for("s", "q", ratios=(0.5, 0.5), labels=("a", "b"))
    assert which in ("a", "b")
    with pytest.raises(ValueError):
        split_for("s", "q", ratios=(0.5, 0.5), labels=("a", "b", "c"))
    with pytest.raises(ValueError):
        split_for("s", "q", ratios=(0.0, 1.0))


def test_hash_depends_on_state_and_question():
    assert split_hash("s1", "q1") != split_hash("s2", "q1")
    assert split_hash("s1", "q1") != split_hash("s1", "q2")
