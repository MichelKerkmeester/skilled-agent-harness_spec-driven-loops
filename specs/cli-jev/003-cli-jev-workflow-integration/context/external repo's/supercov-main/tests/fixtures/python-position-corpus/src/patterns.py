"""`match`, which CPython 3.9 cannot parse: kept apart so the rest of the
corpus is measured there too."""


def match_shapes(value):
    match value:
        case 0:
            return "zero"
        case int() if value > 10:
            return "large"
        case [first, *_] if first:
            return f"sequence:{first}"
        case _:
            return "other"
