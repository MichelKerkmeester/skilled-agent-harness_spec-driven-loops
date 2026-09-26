import pytest

from app import shapes


attempts = 0


@pytest.mark.flaky(reruns=1)
def test_failed_attempt_and_passing_retry_stay_separate():
    global attempts
    attempts += 1
    if attempts == 1:
        assert shapes.negation(True, False) == "both"
    assert shapes.negation(True, True) == "both"
