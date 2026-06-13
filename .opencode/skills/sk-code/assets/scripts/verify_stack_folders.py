#!/usr/bin/env python3
"""Verify sk-code STACK_FOLDERS declarations match on-disk surface folders.

The sk-code smart router (SKILL.md) detects a surface (WEBFLOW, OPENCODE,
MOTION_DEV, ...) and then loads that surface's patterns from
references/<surface>/ and assets/<surface>/. If a surface is declared in the
STACK_FOLDERS map but its folders are missing — or a surface-shaped folder
exists on disk with no matching declaration — the router silently loads nothing
or drifts from its documented contract. This check keeps the declaration and
the folders in agreement so routing always resolves to real, declared patterns.
"""
import ast
import sys
from pathlib import Path

# Resolve sk-code relative to this file: scripts -> assets -> sk-code
SK_CODE = Path(__file__).resolve().parents[2]
SKILL_MD = SK_CODE / "SKILL.md"
REFERENCES = SK_CODE / "references"
ASSETS = SK_CODE / "assets"

# references/ holds shared, stack-agnostic material alongside the per-surface
# folders. These support dirs are intentionally not surfaces and must not be
# reported as orphans.
# Shared, non-surface folders that live alongside the per-surface trees and must
# not be reported as orphans: `universal` (stack-agnostic material) and `scripts`
# (tooling such as this validator, which lives under assets/).
EXEMPT_NON_SURFACE_DIRS = {"universal", "scripts"}


def extract_dict_literal(text, var_name):
    """Return the source of the first {...} assigned to var_name (string-aware)."""
    search_from = text.find(var_name)
    while search_from != -1:
        brace = text.find("{", search_from)
        if brace == -1:
            break
        depth = 0
        quote = ""
        index = brace
        while index < len(text):
            char = text[index]
            if quote:
                if char == "\\":
                    index += 2
                    continue
                if char == quote:
                    quote = ""
            elif char in ("'", '"'):
                quote = char
            elif char == "{":
                depth += 1
            elif char == "}":
                depth -= 1
                if depth == 0:
                    return text[brace : index + 1]
            index += 1
        search_from = text.find(var_name, search_from + 1)
    return None


def parse_surfaces():
    text = SKILL_MD.read_text(encoding="utf-8")
    literal = extract_dict_literal(text, "STACK_FOLDERS")
    if literal is None:
        print(f"PROBLEM: could not find STACK_FOLDERS dict in {SKILL_MD}")
        sys.exit(1)
    try:
        mapping = ast.literal_eval(literal)
    except (ValueError, SyntaxError) as exc:
        print(f"PROBLEM: STACK_FOLDERS is not a parseable literal — {exc}")
        sys.exit(1)
    if not isinstance(mapping, dict) or not mapping:
        print("PROBLEM: STACK_FOLDERS did not parse to a non-empty dict")
        sys.exit(1)
    return sorted({str(key).lower() for key in mapping})


def main():
    surfaces = parse_surfaces()
    problems = []

    for surface in surfaces:
        ref_dir = REFERENCES / surface
        asset_dir = ASSETS / surface
        if not ref_dir.is_dir():
            problems.append(f"missing references folder for surface '{surface}': {ref_dir}")
        if not asset_dir.is_dir():
            problems.append(f"missing assets folder for surface '{surface}': {asset_dir}")

    # Scan BOTH trees for undeclared surface folders. The declared-surface check
    # above already verifies references/ + assets/ exist per surface; this catches
    # the other direction — a surface-shaped folder on disk with no declaration —
    # for assets/ as well as references/, so neither half of the binding drifts.
    for label, base in (("references", REFERENCES), ("assets", ASSETS)):
        if not base.is_dir():
            continue
        for child in sorted(base.iterdir()):
            if not child.is_dir():
                continue
            if child.name in surfaces or child.name in EXEMPT_NON_SURFACE_DIRS:
                continue
            problems.append(f"orphan {label} folder not declared in STACK_FOLDERS: {child}")

    if problems:
        for problem in problems:
            print(f"PROBLEM: {problem}")
        print(f"\n{len(problems)} stack-folder problem(s) found.")
        sys.exit(1)

    print(f"OK: {len(surfaces)} declared surface(s) all resolve — {', '.join(surfaces)}")
    sys.exit(0)


if __name__ == "__main__":
    main()
