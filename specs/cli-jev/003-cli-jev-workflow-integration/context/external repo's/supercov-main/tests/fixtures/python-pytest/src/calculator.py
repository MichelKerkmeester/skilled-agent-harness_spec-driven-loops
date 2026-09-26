def classify(value: int, enabled: bool) -> str:
    if enabled and value > 0:
        return "positive"
    if value == 0:
        return "zero"
    return "other"


def bounded(value: int) -> int:
    if value < 0:
        return 0
    if value > 10:
        return 10
    return value
