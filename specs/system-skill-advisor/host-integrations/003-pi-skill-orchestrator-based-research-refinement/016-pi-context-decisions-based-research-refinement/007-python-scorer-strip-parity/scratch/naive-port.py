"""Prints a direct Python copy of the shipped rule's output for each parity row.

It uses Python's own \\s, re.IGNORECASE and str.strip(), so every line that differs
from js-reference.cjs is a parity break the real port must avoid.
Usage from the repository root: python3 <this file> <parity-rows.json>
"""
import json
import re
import sys

CUE = re.compile(r'^\s*(?:(?:earlier|previously|above),?\s+)?(?:(?:you|the assistant|claude)\s+(?:replied|said|wrote|answered|responded)\s*:|["“>])', re.I)
MARK = re.compile(r'(?:^|[.!?\n]\s*)(?:now|task)\s*:\s*', re.I)


def once(prompt):
    if not CUE.search(prompt):
        return prompt
    marker = MARK.search(prompt)
    if not marker:
        return prompt
    task = prompt[marker.end():].strip()
    return task if task else prompt


def strip(prompt):
    current = prompt
    while True:
        nxt = once(current)
        if nxt == current:
            return current
        current = nxt


with open(sys.argv[1], encoding="utf-8") as handle:
    for key, value in json.load(handle).items():
        print("py   ", key.ljust(27), json.dumps(strip(value)))
