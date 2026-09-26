"""Instruction-position corpus shared by every supported CPython."""


def boolean_tree(a, b, c):
    if a and (b or not c):
        return "first"
    if (a is None) or (b in {1, 2, 3}):
        return "second"
    return "other"


def chained_and_walrus(value):
    if 0 < value < 10:
        return "small"
    if (normalized := abs(value)) > 100:
        return normalized
    return value


def ternary_condition(a, b, c):
    if (b if a else c):
        return True
    return False


def loop_shapes(values, enabled):
    total = 0
    for value in values:
        if value > 0 and enabled:
            total += value
    while total > 10:
        total -= 10
    return total


def comprehensions(values, enabled):
    listed = [value * 2 for value in values if value and enabled]
    mapped = {value: value + 1 for value in values if value > 1 and enabled}
    selected = {value for value in values if value < 3 or enabled}
    generated = tuple(value for value in values if value != 2 and enabled)
    return listed, mapped, selected, generated


def exception_shapes(value):
    try:
        parsed = int(value)
    except ValueError:
        return "value"
    except TypeError:
        return "type"
    else:
        parsed += 1
    finally:
        value = None
    return parsed


def same_line(a, b):
    if a: return "a"
    first = lambda: a; second = lambda: b
    return first() or second()


def assertion_shape(value):
    assert value is not None and value >= 0
    return value


async def async_boolean(a, b):
    async def truth(value):
        return bool(value)

    if await truth(a) and await truth(b):
        return "both"
    return "not-both"


class Counter:
    """Function-entry and decorator position coverage."""

    def __init__(self, value):
        self.value = value

    @property
    def positive(self):
        return self.value > 0

    def adjust(self, delta):
        def apply():
            nonlocal delta
            delta += 1
            return self.value + delta

        return apply()
