"""Runs the planned Python port, with both marker candidates, over the parity rows.

Every line should equal js-reference.cjs for the same row.
Usage from the repository root: python3 <this file> <parity-rows.json>
"""
import json
import re
import sys

_JS_SPACE_CHARS = (
    "\t\n\v\f\r              "
    "    　﻿"
)
_S = "[" + _JS_SPACE_CHARS + "]"
_FLAGS = re.IGNORECASE | re.ASCII
_PASTED_REPLY_CUE = re.compile(
    rf"^{_S}*(?:(?:earlier|previously|above),?{_S}+)?"
    rf"(?:(?:you|the assistant|claude){_S}+(?:replied|said|wrote|answered|responded)"
    rf"|(?:the{_S}+)?(?:assistant|claude){_S}+(?:response|reply|answer)){_S}*:",
    _FLAGS,
)
_TASK_MARKER = re.compile(rf"(?:^|[.!?\n]{_S}*)(?:now|task){_S}*:{_S}*", _FLAGS)


def _once(prompt, last):
    if not _PASTED_REPLY_CUE.search(prompt):
        return prompt
    markers = list(_TASK_MARKER.finditer(prompt))
    if not markers:
        return prompt
    marker = markers[-1] if last else markers[0]
    task = prompt[marker.end():].strip(_JS_SPACE_CHARS)
    return task if task else prompt


def strip(prompt, last):
    current = prompt
    while True:
        nxt = _once(current, last)
        if nxt == current:
            return current
        current = nxt


with open(sys.argv[1], encoding="utf-8") as handle:
    for key, value in json.load(handle).items():
        print("port ", key.ljust(27), json.dumps(strip(value, False)), json.dumps(strip(value, True)))
