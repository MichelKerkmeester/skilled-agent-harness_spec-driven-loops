from app import shapes


def test_loops():
    assert shapes.loops([1, 2, 3, 4], True) == (7, [1, 4, 9, 16])
    assert shapes.loops([], False) == (0, [])
    assert shapes.loops([50, 60, 70], True)[0] == 80


def test_logical():
    assert shapes.logical(0, 5, 0) == (5, 0, 0)
    assert shapes.logical(1, 0, 3) == (1, 3, 1)
    assert shapes.logical(None, 2, 0) == (2, None, None)


def test_negation():
    assert shapes.negation(True, True) == "both"
    assert shapes.negation(True, False) == "not-both"


def test_chained():
    assert shapes.chained(5) == "small"
    assert shapes.chained(50) == "large"
    assert shapes.chained(-1) == "negative"


def test_guarded():
    assert shapes.guarded("12") == 12
    assert shapes.guarded("nope") == -1


def test_thread_and_subprocess():
    assert shapes.in_thread([1, 0, 2]) == [2, 0, 4]
    assert shapes.in_subprocess(3) == "small"


def test_account():
    account = shapes.Account(100)
    assert account.can_withdraw(50)
    assert not account.can_withdraw(-1)
    assert not account.rich


def test_exceptions():
    assert shapes.parse_or_default("7", 0) == 7
    assert shapes.parse_or_default("x", 3) == 3
    assert shapes.parse_or_default(None, 3) is None
    assert shapes.parse_strict("1") == 2
    try:
        shapes.parse_strict("nope")
    except RuntimeError:
        pass
    else:
        raise AssertionError("expected RuntimeError")


class Resource:
    closed = False

    def close(self):
        return "closed"


def test_compact_and_finally():
    assert shapes.close_quietly(Resource()) == "closed"
    assert shapes.compact(True, False) == "a"
    assert shapes.compact(False, True) == 4
