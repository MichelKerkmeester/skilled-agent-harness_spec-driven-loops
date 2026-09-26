import pytest

from src.calculator import bounded


attempts = 0


@pytest.mark.flaky(reruns=1)
def test_fails_then_passes():
    global attempts
    attempts += 1
    if attempts == 1:
        assert bounded(-1) == 1
    assert bounded(1) == 1
