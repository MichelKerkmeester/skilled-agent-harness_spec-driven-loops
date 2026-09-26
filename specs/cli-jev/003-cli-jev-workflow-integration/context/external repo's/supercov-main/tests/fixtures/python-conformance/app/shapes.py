"""Construct corpus for the Python frontend."""
import subprocess
import sys
import threading


def loops(items, flag):
    total = 0
    for item in items:
        if item > 2 and flag:
            total += item
    squares = [x * x for x in items if x % 2 == 0 or flag]
    while total > 100:
        total -= 50
    return total, squares


def logical(a, b, c):
    first = a or b
    second = a and (b or c)
    third = None if a is None else a
    return first, second, third


def negation(a, b):
    if not (a and b):
        return "not-both"
    if not a:
        return "unreachable"
    return "both"


def chained(x):
    if 0 < x < 10:
        return "small"
    if x >= 10 and x is not None:
        return "large"
    return "negative"


def guarded(command):
    try:
        result = int(command)
    except ValueError:
        result = -1
    return result


def in_thread(values):
    out = []

    def work():
        for v in values:
            out.append(v * 2 if v else 0)

    thread = threading.Thread(target=work)
    thread.start()
    thread.join()
    return out


def in_subprocess(argument):
    code = "import sys; from app.shapes import chained; print(chained(int(sys.argv[1])))"
    completed = subprocess.run([sys.executable, "-c", code, str(argument)], capture_output=True, text=True, check=True)
    return completed.stdout.strip()


class Account:
    def __init__(self, balance):
        self.balance = balance

    def can_withdraw(self, amount):
        return amount > 0 and self.balance >= amount

    @property
    def rich(self):
        return self.balance > 1000


def parse_or_default(text, fallback):
    try:
        value = int(text)
    except ValueError:
        value = fallback
    except TypeError:
        return None
    return value


def parse_strict(text):
    try:
        value = int(text)
    except ValueError:
        raise RuntimeError("bad input") from None
    else:
        value += 1
    finally:
        text = None
    return value


def close_quietly(resource):
    try:
        return resource.close()
    finally:
        resource.closed = True


def compact(a, b):
    if a: return "a"
    x = 1; y = 2
    first, second = (lambda: x), (lambda: y)
    return first() + second() + (1 if b else 0)
