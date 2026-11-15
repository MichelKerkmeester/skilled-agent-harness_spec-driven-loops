#!/usr/bin/env python3
"""Validate a TOML file against a JSON schema.

Usage: validate-config.py <file.toml> <schema.json>

Exit codes: 0 when the document is valid, 1 when it violates the schema,
2 when either input is missing or malformed.
"""

from __future__ import annotations

import json
import sys
import tomllib
from pathlib import Path
from typing import Any, Iterable

from jsonschema import Draft202012Validator
from jsonschema.exceptions import SchemaError

USAGE = "usage: validate-config.py <file.toml> <schema.json>"


def render_path(parts: Iterable[Any]) -> str:
    """Render an error location as a JSONPath expression."""
    rendered = "$"
    for part in parts:
        if isinstance(part, int):
            rendered += f"[{part}]"
        else:
            rendered += f".{part}"
    return rendered


def path_sort_key(parts: tuple[Any, ...]) -> tuple[tuple[int, Any], ...]:
    """Order sibling keys lexically and sibling indices numerically."""
    return tuple((0, part) if isinstance(part, int) else (1, part) for part in parts)


def load_toml(path: Path) -> Any:
    with path.open("rb") as handle:
        return tomllib.load(handle)


def load_schema(path: Path) -> Any:
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def normalize_models(document: Any) -> Any:
    """Re-key a ``[[models]]`` list into the alias map the printed schema describes.

    Vibe re-keys model rows by alias as it loads them, so the schema it prints
    describes the loaded config rather than the list form a file may use.
    """
    if not isinstance(document, dict):
        return document

    models = document.get("models")
    if not isinstance(models, list):
        return document

    keyed: dict[str, Any] = {}
    for row in models:
        if not isinstance(row, dict):
            return document
        alias = row.get("alias", row.get("name"))
        if not isinstance(alias, str) or not alias:
            return document
        keyed[alias] = {**row, "alias": alias}
    return {**document, "models": keyed}


def fail(message: str) -> int:
    print(message, file=sys.stderr)
    return 2


def main(argv: list[str]) -> int:
    if len(argv) != 3:
        return fail(USAGE)

    document_path = Path(argv[1])
    schema_path = Path(argv[2])

    try:
        document = load_toml(document_path)
    except OSError as exc:
        return fail(f"{document_path}: {exc.strerror or exc}")
    except tomllib.TOMLDecodeError as exc:
        return fail(f"{document_path}: invalid TOML: {exc}")

    try:
        schema = load_schema(schema_path)
    except OSError as exc:
        return fail(f"{schema_path}: {exc.strerror or exc}")
    except json.JSONDecodeError as exc:
        return fail(f"{schema_path}: invalid JSON: {exc}")

    try:
        Draft202012Validator.check_schema(schema)
    except SchemaError as exc:
        return fail(f"{schema_path}: invalid schema: {exc.message}")

    validator = Draft202012Validator(schema)
    errors = sorted(
        validator.iter_errors(normalize_models(document)),
        key=lambda error: (path_sort_key(tuple(error.absolute_path)), error.message),
    )

    if not errors:
        print("valid")
        return 0

    for error in errors:
        print(f"{render_path(error.absolute_path)}: {error.message}")
    return 1


if __name__ == "__main__":
    sys.exit(main(sys.argv))
