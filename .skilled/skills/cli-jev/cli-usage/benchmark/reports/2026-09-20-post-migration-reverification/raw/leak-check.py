#!/usr/bin/env python3
"""Value-blind leak check over the captured probe streams.

Reads the credential store, extracts its token set, and intersects it with the token
set of every capture file. Prints counts only: a token that appears in both places is
key material echoed into a transcript, and its value is never printed.
"""

import glob
import re
import sys

STORE = "/Users/michelkerkmeester/.config/jev-cli/credentials.json"
TOKEN = re.compile(r"[A-Za-z0-9_\-]{16,}")


def tokens(text: str) -> set[str]:
    found = set()
    for match in TOKEN.finditer(text):
        token = match.group(0)
        # Skip prose words joined by hyphens and long hex digests of repo artifacts.
        if token.lower().startswith(("http", "manifest", "effective", "sha256")):
            continue
        found.add(token)
    return found


def main() -> int:
    store_tokens = tokens(open(STORE, encoding="utf-8", errors="replace").read())
    print(f"store tokens: {len(store_tokens)}")
    total_hits = 0
    for path in sorted(glob.glob("/tmp/cli-jev-005/*.txt")):
        hits = tokens(open(path, encoding="utf-8", errors="replace").read()) & store_tokens
        total_hits += len(hits)
        print(f"{path}: {len(hits)} store token(s) present")
    print(f"total key-material hits: {total_hits}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
