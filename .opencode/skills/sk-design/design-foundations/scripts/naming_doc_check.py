#!/usr/bin/env python3
# ---------------------------------------------------------------
# COMPONENT: DESIGN-SYSTEM NAMING AND DOC CHECKER
# ---------------------------------------------------------------
"""Deterministic naming and documentation checker for design-system artifacts.

The gate applies only to token, component, and library artifacts. Ordinary
skill, reference, example, and vocabulary markdown exits cleanly as not
applicable.

Usage:
  naming_doc_check.py artifact.md
  naming_doc_check.py --json artifact.md

Exit: 0 = clean or not applicable; 1 = naming/doc violation; 2 = usage or read
error.
"""
import json
from pathlib import Path
import re
import sys
from typing import Any, Optional

ARTIFACT_KINDS = {"token", "component", "library"}
TOKEN_PATTERN = re.compile(r"(?<![A-Za-z0-9_-])--[A-Za-z0-9_][A-Za-z0-9_-]*(?![A-Za-z0-9_-])")
MARKDOWN_HEADING = re.compile(r"^#{1,6}\s+(.+?)\s*(?:#+\s*)?$")
FRONTMATTER_KIND = re.compile(r"^artifact[-_]?kind\s*:\s*['\"]?([A-Za-z-]+)['\"]?\s*$", re.I)

TOKEN_TIERS: list[tuple[str, re.Pattern[str]]] = [
    ("neutral ramp", re.compile(r"^--neutral-\d{2,3}$")),
    ("color role", re.compile(r"^--color-[a-z][a-z0-9]*(?:-[a-z0-9]+)*$")),
    ("spacing baseline", re.compile(r"^--baseline$")),
    ("spacing scale", re.compile(r"^--space-[a-z0-9]+(?:-[a-z0-9]+)*$")),
    ("surface", re.compile(r"^--surface-[a-z][a-z0-9]*(?:-[a-z0-9]+)*$")),
    ("text", re.compile(r"^--text-[a-z][a-z0-9]*(?:-[a-z0-9]+)*$")),
    ("type", re.compile(r"^--type-[a-z][a-z0-9]*(?:-[a-z0-9]+)*$")),
    ("elevation and shape", re.compile(r"^--(?:radius|shadow|layer|stroke|material)-[a-z][a-z0-9]*(?:-[a-z0-9]+)*$")),
    ("motion and state", re.compile(r"^--(?:motion|state)-[a-z][a-z0-9]*(?:-[a-z0-9]+)*$")),
]

REQUIRED_HEADINGS: dict[str, list[dict[str, list[str]]]] = {
    "token": [
        {"label": "COLOR RAMP", "aliases": ["color ramp", "color tokens", "color system"]},
        {"label": "TYPE SCALE", "aliases": ["type scale"]},
        {"label": "SPACING SCALE", "aliases": ["spacing scale"]},
        {"label": "HAND OFF", "aliases": ["hand off", "handoff", "implementation handoff"]},
    ],
    "component": [
        {"label": "COMPONENT CONTRACT", "aliases": ["component contract"]},
        {"label": "VARIANTS", "aliases": ["variants"]},
        {"label": "STATES", "aliases": ["states"]},
        {"label": "TOKEN HOOKS", "aliases": ["token hooks", "tokens"]},
        {"label": "USAGE", "aliases": ["usage"]},
    ],
    "library": [
        {"label": "LIBRARY SCOPE", "aliases": ["library scope"]},
        {"label": "FOUNDATIONS", "aliases": ["foundations"]},
        {"label": "COMPONENTS", "aliases": ["components"]},
        {"label": "HAND OFF", "aliases": ["hand off", "handoff", "implementation handoff"]},
    ],
}

KNOWN_PREFIXES = [
    "--baseline",
    "--neutral-",
    "--color-",
    "--space-",
    "--surface-",
    "--text-",
    "--type-",
    "--radius-",
    "--shadow-",
    "--layer-",
    "--stroke-",
    "--material-",
    "--motion-",
    "--state-",
]


def _clean_cell(value: str) -> str:
    value = value.strip()
    if len(value) >= 2 and value[0] == "`" and value[-1] == "`":
        value = value[1:-1].strip()
    return value


def _split_table_row(line: str) -> list[str]:
    line = line.strip()
    if not line.startswith("|") or not line.endswith("|"):
        return []
    return [cell.strip() for cell in line.strip("|").split("|")]


def _is_separator_row(cells: list[str]) -> bool:
    return bool(cells) and all(re.fullmatch(r":?-{3,}:?", cell.strip()) for cell in cells)


def _normalized_header(cells: list[str]) -> list[str]:
    return [re.sub(r"\s+", " ", _clean_cell(cell).lower()) for cell in cells]


def _normalize_heading(value: str) -> str:
    value = re.sub(r"^\d+\.\s+", "", value.strip())
    value = value.strip("#").strip()
    value = re.sub(r"[\s_-]+", " ", value.lower())
    return value


def _frontmatter_artifact_kind(text: str) -> Optional[str]:
    lines = text.splitlines()
    if not lines or lines[0].strip() != "---":
        return None

    for line in lines[1:]:
        if line.strip() == "---":
            return None
        match = FRONTMATTER_KIND.match(line.strip())
        if match:
            kind = match.group(1).strip().lower()
            return kind if kind in ARTIFACT_KINDS else None
    return None


def _find_token_table_declarations(text: str) -> list[dict[str, Any]]:
    lines = text.splitlines()
    declarations: list[dict[str, Any]] = []
    token_column: Optional[int] = None
    in_table = False
    awaiting_separator = False
    seen: set[str] = set()

    for line_number, line in enumerate(lines, 1):
        cells = _split_table_row(line)
        if not cells:
            token_column = None
            in_table = False
            awaiting_separator = False
            continue

        normalized = _normalized_header(cells)
        if "token" in normalized:
            token_column = normalized.index("token")
            in_table = True
            awaiting_separator = True
            continue

        if in_table and _is_separator_row(cells):
            awaiting_separator = False
            continue

        if token_column is None or awaiting_separator:
            continue

        if len(cells) <= token_column:
            continue

        for match in TOKEN_PATTERN.finditer(_clean_cell(cells[token_column])):
            name = match.group(0)
            if name not in seen:
                declarations.append({"name": name, "line": line_number})
                seen.add(name)

    return declarations


def _find_all_token_declarations(text: str) -> list[dict[str, Any]]:
    declarations: list[dict[str, Any]] = []
    seen: set[str] = set()
    for line_number, line in enumerate(text.splitlines(), 1):
        for match in TOKEN_PATTERN.finditer(line):
            name = match.group(0)
            if name not in seen:
                declarations.append({"name": name, "line": line_number})
                seen.add(name)
    return declarations


def _headings(text: str) -> set[str]:
    found = set()
    for line in text.splitlines():
        match = MARKDOWN_HEADING.match(line)
        if match:
            found.add(_normalize_heading(match.group(1)))
    return found


def _has_all_required_headings(text: str, artifact_kind: str) -> bool:
    found = _headings(text)
    required = REQUIRED_HEADINGS[artifact_kind]
    return all(any(_normalize_heading(alias) in found for alias in item["aliases"]) for item in required)


def _detect_artifact(text: str) -> tuple[bool, Optional[str], str, list[dict[str, Any]]]:
    frontmatter_kind = _frontmatter_artifact_kind(text)
    table_declarations = _find_token_table_declarations(text)

    if frontmatter_kind:
        declarations = _find_all_token_declarations(text) if frontmatter_kind == "token" else table_declarations
        return True, frontmatter_kind, "frontmatter artifactKind", declarations

    if table_declarations and _has_all_required_headings(text, "token"):
        return True, "token", "token table with token-artifact headings", table_declarations

    return False, None, "no design-system artifact marker", []


def _match_token_tier(name: str) -> Optional[str]:
    for tier, pattern in TOKEN_TIERS:
        if pattern.fullmatch(name):
            return tier
    return None


def _token_reason(name: str) -> str:
    if "_" in name:
        return "use hyphens, not underscores"
    if any(char.isupper() for char in name):
        return "use lowercase kebab-case, not camelCase or uppercase"
    if not any(name == prefix or name.startswith(prefix) for prefix in KNOWN_PREFIXES):
        return "category must be one of the design-system token tiers"
    return "name does not match its tier regex"


def _check_tokens(declarations: list[dict[str, Any]], artifact_kind: str) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    checked: list[dict[str, Any]] = []
    invalid: list[dict[str, Any]] = []

    for declaration in declarations:
        name = declaration["name"]
        tier = _match_token_tier(name)
        item = {**declaration, "tier": tier}
        checked.append(item)
        if tier is None:
            invalid.append({**declaration, "reason": _token_reason(name)})

    if artifact_kind == "token" and not declarations:
        invalid.append({"name": None, "line": None, "reason": "token artifact has no declared token names"})

    return checked, invalid


def _check_headings(text: str, artifact_kind: str) -> tuple[list[str], list[str]]:
    found = _headings(text)
    required = REQUIRED_HEADINGS[artifact_kind]
    missing = [
        item["label"]
        for item in required
        if not any(_normalize_heading(alias) in found for alias in item["aliases"])
    ]
    return [item["label"] for item in required], missing


def check(text: str) -> dict[str, Any]:
    applicable, artifact_kind, reason, declarations = _detect_artifact(text)
    if not applicable or artifact_kind is None:
        return {
            "applicable": False,
            "artifact_kind": None,
            "applicability_reason": reason,
            "token_names": [],
            "invalid_token_names": [],
            "required_headings": [],
            "missing_headings": [],
            "ok": True,
        }

    checked_tokens, invalid_tokens = _check_tokens(declarations, artifact_kind)
    required_headings, missing_headings = _check_headings(text, artifact_kind)
    ok = not invalid_tokens and not missing_headings

    return {
        "applicable": True,
        "artifact_kind": artifact_kind,
        "applicability_reason": reason,
        "token_names": checked_tokens,
        "invalid_token_names": invalid_tokens,
        "required_headings": required_headings,
        "missing_headings": missing_headings,
        "ok": ok,
    }


def _print_text(path: Path, result: dict[str, Any]) -> None:
    print(f"Naming/doc gate - {path}")
    if not result["applicable"]:
        print(f"NOT_APPLICABLE - {result['applicability_reason']}")
        return

    print(f"  artifact kind: {result['artifact_kind']} ({result['applicability_reason']})")
    print(f"  token names: {len(result['token_names'])}")
    print(f"  required headings: {', '.join(result['required_headings'])}")

    if result["ok"]:
        print("PASS - token names and required headings conform.")
        return

    for item in result["invalid_token_names"]:
        name = item.get("name") or "<none>"
        line = item.get("line")
        prefix = f"line {line}: " if line else ""
        print(f"FAIL - {prefix}{name} - {item['reason']}")
    for heading in result["missing_headings"]:
        print(f"FAIL - missing heading {heading}")


def main(argv: list[str]) -> int:
    as_json = "--json" in argv
    paths = [arg for arg in argv if arg != "--json"]
    if len(paths) != 1:
        sys.stderr.write("usage: naming_doc_check.py [--json] <artifact.md>\n")
        return 2

    path = Path(paths[0])
    try:
        text = path.read_text(encoding="utf-8")
    except OSError as exc:
        sys.stderr.write(f"cannot read {path}: {exc}\n")
        return 2

    result = check(text)
    if as_json:
        print(json.dumps({"file": str(path), **result}, indent=2))
    else:
        _print_text(path, result)

    return 0 if result["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
