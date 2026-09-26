"""`match`, which CPython 3.9 cannot parse: kept apart so every other
scenario runs there too."""


def matcher(value):
    match value:
        case 0:
            return "zero"
        case int() if value > 100:
            return "big"
        case [first, *_]:
            return f"seq:{first}"
        case _:
            return "other"
