import asyncio

from src import corpus


def test_boolean_positions():
    assert corpus.boolean_tree(True, False, False) == "first"
    assert corpus.boolean_tree(None, 0, True) == "second"
    assert corpus.boolean_tree(False, 9, True) == "other"
    assert corpus.chained_and_walrus(5) == "small"
    assert corpus.chained_and_walrus(-200) == 200
    assert corpus.chained_and_walrus(20) == 20
    assert corpus.ternary_condition(True, 1, 0)
    assert not corpus.ternary_condition(False, 1, 0)


def test_loops_and_comprehensions():
    assert corpus.loop_shapes([4, 8], True) == 2
    assert corpus.loop_shapes([], False) == 0
    listed, mapped, selected, generated = corpus.comprehensions([0, 1, 2, 4], True)
    assert listed == [2, 4, 8]
    assert mapped == {2: 3, 4: 5}
    assert selected == {0, 1, 2, 4}
    assert generated == (0, 1, 4)


def test_match_and_exceptions():
    assert corpus.exception_shapes("4") == 5
    assert corpus.exception_shapes("x") == "value"
    assert corpus.exception_shapes(None) == "type"


def test_same_line_assertion_async_and_class():
    assert corpus.same_line(True, 2) == "a"
    assert corpus.same_line(False, 2) == 2
    assert corpus.assertion_shape(0) == 0
    assert asyncio.run(corpus.async_boolean(True, True)) == "both"
    assert asyncio.run(corpus.async_boolean(True, False)) == "not-both"
    counter = corpus.Counter(2)
    assert counter.positive
    assert counter.adjust(3) == 6
