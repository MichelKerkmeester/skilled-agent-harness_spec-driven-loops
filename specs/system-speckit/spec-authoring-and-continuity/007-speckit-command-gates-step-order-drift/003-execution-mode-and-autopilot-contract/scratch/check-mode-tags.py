#!/usr/bin/env python3
"""Report every stop-and-ask branch in a speckit workflow that states no mode behavior.

Usage: check-mode-tags.py <workflow.yaml>...

An ask is a key or text that makes the agent wait for the operator. It is tagged when
a mapping on its path carries a `modes` map with confirm, auto and autopilot keys, or
`applies_to: confirm`, or when it sits under `mode_overrides > confirm`.
`autopilot_ask` counts every `modes.autopilot` value that still says ask.
`auto_ask` is printed for reading only: auto may ask at confidence below 40 and at Gate 3.
"""
import re
import sys

import yaml

ASK_TEXT = re.compile(
    r"STOP - (Ask|Request)"
    r"|STOP: A\)"
    r"|STOP → (Ask|surface)"
    r"|STOPS and waits"
    r"|(?i:ask (user|clarifying|spec folder))"
    r"|\[Y/n/review\]"
    r"|prompt_user"
    r"|\(y / continue manually / skip\)"
    r"|user must approve"
    r"|^user_approval$"
    r"|still pause"
    r"|(?i:wait for (user )?response)"
    r"|Present options (to user|with current findings)"
    r"|show_checkpoint"
    r"|single_consolidated_prompt"
)
MODE_KEYS = {"confirm", "auto", "autopilot"}
SAYS_ASK = re.compile(r"\bask\b", re.I)
SEP = " > "


def has_modes(node):
    modes = node.get("modes")
    return isinstance(modes, dict) and MODE_KEYS <= set(modes)


def covers(node):
    return has_modes(node) or node.get("applies_to") == "confirm"


def is_option_list(value):
    return (
        isinstance(value, list)
        and bool(value)
        and all(isinstance(i, dict) and ("label" in i or "key" in i) for i in value)
    )


def walk(node, path, covered, out):
    """Collect (kind, path) rows for one workflow document."""
    if isinstance(node, dict):
        covered = covered or covers(node)
        if has_modes(node):
            for mode in ("auto", "autopilot"):
                if SAYS_ASK.search(str(node["modes"][mode])):
                    out.append((mode + "_ask", SEP.join(path)))
        for key, value in node.items():
            here = path + [str(key)]
            if key == "modes":
                continue
            if key == "wait_for" or (key == "options" and is_option_list(value)):
                if not covered:
                    out.append(("untagged", SEP.join(path)))
                continue
            if isinstance(value, str):
                if ASK_TEXT.search(value) and not covered:
                    out.append(("untagged", SEP.join(here)))
            else:
                walk(value, here, covered, out)
    elif isinstance(node, list):
        for item in node:
            if isinstance(item, str):
                if ASK_TEXT.search(item) and not covered:
                    out.append(("untagged", SEP.join(path)))
            else:
                walk(item, path, covered, out)


def check(file_path):
    with open(file_path, encoding="utf-8") as handle:
        doc = yaml.safe_load(handle)
    rows = []
    for key, value in doc.items():
        if key == "checkpoint_options":
            continue
        if key == "mode_overrides":
            value = {k: v for k, v in value.items() if k != "confirm"}
        if isinstance(value, str):
            if ASK_TEXT.search(value):
                rows.append(("untagged", str(key)))
        else:
            walk(value, [str(key)], False, rows)
    return sorted(set(rows))


def main(argv):
    if len(argv) < 2:
        print(__doc__)
        return 2
    totals = {"untagged": 0, "autopilot_ask": 0, "auto_ask": 0}
    for file_path in argv[1:]:
        name = file_path.split("/")[-1]
        for kind, where in check(file_path):
            totals[kind] += 1
            print(f"{kind.upper()} {name} {where}")
    for kind in ("untagged", "autopilot_ask", "auto_ask"):
        print(f"{kind}: {totals[kind]}")
    return 1 if totals["untagged"] or totals["autopilot_ask"] else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
