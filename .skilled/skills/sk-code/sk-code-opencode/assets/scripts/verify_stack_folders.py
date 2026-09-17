#!/usr/bin/env python3
"""Verify the code-opencode language reference folders.

The code-opencode skill organizes stack evidence by language:
references/<language>/ holds each per-language trio, while references/shared/
holds cross-language material. This guard keeps the on-disk language folders in
agreement with the documented language set so detection always resolves to a
real trio.
"""
import sys
from pathlib import Path

SURFACE_ROOT = Path(__file__).resolve().parents[2]
REFERENCES = SURFACE_ROOT / "references"
KNOWN_LANGUAGES = {"typescript", "javascript", "python", "shell", "rust", "config"}
EXEMPT_NON_LANGUAGE_DIRS = {"shared"}


def main():
    problems = []

    for language in sorted(KNOWN_LANGUAGES):
        ref_dir = REFERENCES / language
        if not ref_dir.is_dir():
            problems.append(f"missing references folder for language '{language}': {ref_dir}")

    if REFERENCES.is_dir():
        for child in sorted(REFERENCES.iterdir()):
            if not child.is_dir():
                continue
            if child.name in KNOWN_LANGUAGES or child.name in EXEMPT_NON_LANGUAGE_DIRS:
                continue
            problems.append(f"orphan references folder not a known language: {child}")

    if problems:
        for problem in problems:
            print(f"PROBLEM: {problem}")
        print(f"\n{len(problems)} stack-folder problem(s) found.")
        sys.exit(1)

    languages = sorted(KNOWN_LANGUAGES)
    print(f"OK: {len(languages)} language folder(s) all resolve — {', '.join(languages)}")
    sys.exit(0)


if __name__ == "__main__":
    main()
