from src import patterns


def test_match():
    assert patterns.match_shapes(0) == "zero"
    assert patterns.match_shapes(20) == "large"
    assert patterns.match_shapes([3, 4]) == "sequence:3"
    assert patterns.match_shapes("x") == "other"
