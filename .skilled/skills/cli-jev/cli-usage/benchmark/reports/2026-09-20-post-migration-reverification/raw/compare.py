#!/usr/bin/env python3
"""Compare the re-run probe matrices against the recorded baseline.

Normalizes the two things that legitimately moved: the scratch path used for the
absent-file probes ("D"), and nothing else. Prints a per-label RC+STDOUT+STDERR diff.
"""

import re
import sys


def parse(path: str) -> dict[str, dict[str, str]]:
    entries: dict[str, dict[str, str]] = {}
    label = None
    for line in open(path, encoding="utf-8"):
        line = line.rstrip("\n")
        if line.startswith("### "):
            label = line[4:].strip()
            entries[label] = {}
        elif label and line.startswith(("CMD: ", "RC: ", "STDOUT: ", "STDERR: ", "CHECK: ")):
            key, _, value = line.partition(": ")
            entries[label][key] = value
    return entries


def normalize(value: str) -> str:
    value = re.sub(r"specs/cli-jev/001-cli-jev-creation/001-jev-contract-research-and-pin/scratch", "<D>", value)
    value = re.sub(r"/tmp/cli-jev-005", "<D>", value)
    return value


def main() -> int:
    base_path, new_path = sys.argv[1], sys.argv[2]
    base, new = parse(base_path), parse(new_path)
    diffs = 0
    print(f"labels: baseline={len(base)} rerun={len(new)}")
    for label in base:
        if label not in new:
            print(f"MISSING in re-run: {label}")
            diffs += 1
            continue
        for key in ("RC", "STDOUT", "STDERR", "CHECK"):
            b, n = base[label].get(key, ""), new[label].get(key, "")
            if normalize(b) != normalize(n):
                diffs += 1
                print(f"DIFF {label} [{key}]\n  base: {b[:220]}\n  new : {n[:220]}")
    for label in new:
        if label not in base:
            print(f"EXTRA in re-run: {label}")
            diffs += 1
    print(f"total diffs: {diffs}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
