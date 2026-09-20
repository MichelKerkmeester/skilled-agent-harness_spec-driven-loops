#!/usr/bin/env python3
"""Compare the re-run surface capture against the recorded baseline, section by section.

The capture is `### <section>` blocks of raw text. Only the scratch path may differ.
"""

import difflib
import re
import sys


def sections(path: str) -> dict[str, str]:
    out: dict[str, str] = {}
    name = None
    buf: list[str] = []
    for line in open(path, encoding="utf-8"):
        if line.startswith("### "):
            if name is not None:
                out[name] = "".join(buf).strip("\n")
            name, buf = line[4:].strip(), []
        elif name is not None:
            buf.append(line)
    if name is not None:
        out[name] = "".join(buf).strip("\n")
    return out


def normalize(text: str) -> str:
    text = re.sub(r"specs/cli-jev/001-cli-jev-creation/001-jev-contract-research-and-pin/scratch", "<D>", text)
    text = re.sub(r"/tmp/cli-jev-005", "<D>", text)
    return text


def main() -> int:
    base, new = sections(sys.argv[1]), sections(sys.argv[2])
    diffs = 0
    print(f"sections: baseline={len(base)} rerun={len(new)}")
    for name in base:
        if name not in new:
            print(f"MISSING in re-run: {name}")
            diffs += 1
            continue
        b, n = normalize(base[name]), normalize(new[name])
        if b != n:
            diffs += 1
            print(f"DIFF {name}:")
            for line in list(difflib.unified_diff(b.splitlines(), n.splitlines(), "base", "new", lineterm="", n=1))[:24]:
                print("  " + line[:200])
    for name in new:
        if name not in base:
            print(f"EXTRA in re-run: {name}")
            diffs += 1
    print(f"total section diffs: {diffs}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
