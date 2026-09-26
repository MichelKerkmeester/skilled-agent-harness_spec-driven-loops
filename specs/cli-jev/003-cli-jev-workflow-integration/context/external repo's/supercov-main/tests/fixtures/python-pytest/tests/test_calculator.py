from src.calculator import bounded, classify


def test_positive_path():
    assert classify(4, True) == "positive"
    assert bounded(4) == 4


def test_zero_path():
    assert classify(0, False) == "zero"
    assert bounded(-2) == 0
