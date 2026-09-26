import pytest

from src.calculator import bounded, classify


def test_passes():
    assert bounded(3) == 3


def test_fails():
    classify(4, True)
    assert False, "failed deliberately"


@pytest.mark.skip(reason="skipped deliberately")
def test_skips():
    bounded(20)


@pytest.mark.xfail(reason="expected failure deliberately")
def test_expected_failure():
    classify(-1, False)
    assert False


def test_setup_failure(setup_failure):
    raise AssertionError("test body must not run")


def test_teardown_failure(teardown_failure):
    assert classify(4, True) == "positive"
