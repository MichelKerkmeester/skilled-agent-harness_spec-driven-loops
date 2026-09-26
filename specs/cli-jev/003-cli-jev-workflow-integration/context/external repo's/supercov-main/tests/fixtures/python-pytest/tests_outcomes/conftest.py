import pytest

from src.calculator import bounded, classify


@pytest.fixture
def setup_failure():
    classify(0, False)
    raise RuntimeError("setup failed deliberately")


@pytest.fixture
def teardown_failure():
    yield
    bounded(20)
    raise RuntimeError("teardown failed deliberately")
