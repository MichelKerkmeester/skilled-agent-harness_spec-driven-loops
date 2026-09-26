from app import patterns


def test_matcher():
    assert patterns.matcher(0) == "zero"
    assert patterns.matcher(500) == "big"
    assert patterns.matcher([7, 8]) == "seq:7"
    assert patterns.matcher("x") == "other"
