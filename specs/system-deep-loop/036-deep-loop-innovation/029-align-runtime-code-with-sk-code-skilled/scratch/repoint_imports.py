#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: REPOINT IMPORTS
# ───────────────────────────────────────────────────────────────

"""Rewrite relative import specifiers after a file moves.

Usage:
    repoint_imports.py <scan-root> <old-path> <new-path> [--apply]

<old-path> and <new-path> are file paths without extension. Every relative
specifier in a JS or TS file under <scan-root> that resolves to <old-path>
is rewritten to reach <new-path> from that file, keeping its extension.
Without --apply the rewrites are only printed.
"""

import os
import re
import sys

EXTENSIONS = (".ts", ".tsx", ".mts", ".js", ".mjs", ".cjs")
SPECIFIER_RE = re.compile(r"""(?P<q>['"])(?P<spec>\.{1,2}/[^'"\n]+)(?P=q)""")
CODE_EXT_RE = re.compile(r"\.(?:[cm]?[jt]sx?)$")


def strip_ext(path):
    return CODE_EXT_RE.sub("", path)


def main(argv):
    if len(argv) < 4:
        print(__doc__)
        return 2
    root, old, new = (os.path.realpath(a) for a in argv[1:4])
    apply = "--apply" in argv
    changed = 0
    for current, dirs, files in os.walk(root):
        dirs[:] = [d for d in dirs if d not in ("node_modules", "dist", ".git")]
        for name in files:
            if not name.endswith(EXTENSIONS):
                continue
            path = os.path.join(current, name)
            text = open(path, encoding="utf-8").read()

            def rewrite(match):
                spec = match.group("spec")
                target = os.path.normpath(os.path.join(current, spec))
                if strip_ext(target) != old:
                    return match.group(0)
                ext = spec[len(strip_ext(spec)):]
                rel = os.path.relpath(new, current)
                if not rel.startswith("."):
                    rel = "./" + rel
                return match.group("q") + rel + ext + match.group("q")

            updated = SPECIFIER_RE.sub(rewrite, text)
            if updated != text:
                changed += 1
                for before, after in zip(text.splitlines(), updated.splitlines()):
                    if before != after:
                        print(f"{os.path.relpath(path, root)}: {before.strip()}  ->  {after.strip()}")
                if apply:
                    open(path, "w", encoding="utf-8").write(updated)
    print(f"files {'rewritten' if apply else 'to rewrite'}: {changed}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
