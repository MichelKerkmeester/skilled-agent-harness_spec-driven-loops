#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: COMMENT HYGIENE FAMILIES
# ───────────────────────────────────────────────────────────────

"""Read the comment-family table and name the language of one file.

Usage: imported by `checker.py` and `cli.py`
Output: the parsed families and language maps, and the language and comment family a file
resolves to from its shebang and then from its extension
"""

from __future__ import annotations

# ───────────────────────────────────────────────────────────────
# 1. IMPORTS
# ───────────────────────────────────────────────────────────────

import json
import os
from typing import Any, Dict, List, Optional, Tuple


# ───────────────────────────────────────────────────────────────
# 2. CONSTANTS
# ───────────────────────────────────────────────────────────────

SHEBANG_READ_BYTES = 512


# ───────────────────────────────────────────────────────────────
# 3. FAMILY TABLE
# ───────────────────────────────────────────────────────────────

def _string_list(value: Any, where: str) -> List[str]:
    if not isinstance(value, list) or not all(isinstance(item, str) and item for item in value):
        raise ValueError(f"{where} must be a list of non-empty strings")
    return value


def load_table(path: str) -> Dict[str, Any]:
    """Read and validate the comment-family table.

    Args:
        path: Location of the JSON table.

    Returns:
        The parsed families and language lookup maps.

    Raises:
        OSError: The table cannot be read.
        ValueError: The table contains invalid data.
    """
    with open(path, "r", encoding="utf-8") as handle:
        table = json.load(handle)
    if not isinstance(table, dict):
        raise ValueError("the table root must be an object")
    families = table.get("families")
    languages = table.get("languages")
    if not isinstance(families, dict) or not families:
        raise ValueError("families must be a non-empty object")
    if not isinstance(languages, dict) or not languages:
        raise ValueError("languages must be a non-empty object")

    parsed_families = {}
    for name, spec in families.items():
        if not isinstance(spec, dict):
            raise ValueError(f"family {name} must be an object")
        block = spec.get("blockComment")
        if block is not None and (not isinstance(block, list) or len(block) != 2):
            raise ValueError(f"family {name} blockComment must be an opener and a closer")
        parsed_families[name] = {
            "line": _string_list(spec.get("lineComment", []), f"family {name} lineComment"),
            "block": _string_list(block, f"family {name} blockComment") if block else None,
            "quotes": _string_list(spec.get("quotes", []), f"family {name} quotes"),
            "after_space": bool(spec.get("lineCommentAfterSpace", False)),
            "single_quote_escapes": bool(spec.get("singleQuoteEscapes", True)),
            # Longest first, so ''' is tried before the ' it starts with.
            "multiline": sorted(_string_list(spec.get("multilineStrings", []), f"family {name} multilineStrings"),
                                key=len, reverse=True),
            # Only the families whose language reads escapes in a string that spans lines set
            # this, so a Go raw string still ends at its first backtick.
            "multiline_escapes": bool(spec.get("multilineEscapes", False)),
            # A template literal in this family reads its ${...} as code, so a template literal
            # nested inside one never flips the outer literal's backtick parity.
            "template_interpolation": bool(spec.get("templateInterpolation", False)),
            # A regex literal is cut out of the line whole, so a quote or a backtick inside it
            # never opens a string. Only the families whose language reads them set this.
            "regex_literals": bool(spec.get("regexLiterals", False)),
            "heredocs": bool(spec.get("heredocs", False)),
            "docstrings": bool(spec.get("docstrings", False)),
            "block_scalars": bool(spec.get("blockScalars", False)),
            "char_literals": bool(spec.get("charLiterals", False)),
            "leading_star": bool(spec.get("leadingStarComment", False)),
        }

    by_extension = {}
    by_interpreter = {}
    for language, spec in languages.items():
        if not isinstance(spec, dict) or spec.get("family") not in parsed_families:
            raise ValueError(f"language {language} must name a family from the table")
        for ext in _string_list(spec.get("extensions", []), f"language {language} extensions"):
            by_extension[ext.lower()] = language
        for name in _string_list(spec.get("shebangs", []), f"language {language} shebangs"):
            by_interpreter[name] = language
    return {
        "families": parsed_families,
        "language_family": {language: spec["family"] for language, spec in languages.items()},
        "by_extension": by_extension,
        "by_interpreter": by_interpreter,
    }


# ───────────────────────────────────────────────────────────────
# 4. LANGUAGE DETECTION
# ───────────────────────────────────────────────────────────────

def _interpreter_from_shebang(first_line: str) -> Optional[str]:
    """Name the interpreter a shebang runs, with any version suffix removed, or None."""
    if not first_line.startswith("#!"):
        return None
    words = first_line[2:].strip().split()
    if not words:
        return None
    program = os.path.basename(words[0])
    if program == "env":
        rest = [word for word in words[1:] if not word.startswith("-") and "=" not in word]
        if not rest:
            return None
        program = os.path.basename(rest[0])
    return program.rstrip("0123456789.") or None


def language_for(
    filepath: str,
    table: Dict[str, Any],
    extra_extensions: Dict[str, str],
) -> Tuple[Optional[str], Optional[str]]:
    """Pick the language from a shebang that names one, then from the extension.

    Args:
        filepath: File to inspect.
        table: Parsed comment-family and language metadata.
        extra_extensions: Extension-to-family mappings from command-line options.

    Returns:
        The language and comment family, or ``(None, None)`` when unknown.
    """
    with open(filepath, "rb") as handle:
        head = handle.read(SHEBANG_READ_BYTES)
    first_line = head.split(b"\n", 1)[0].decode("utf-8", errors="replace")
    interpreter = _interpreter_from_shebang(first_line)
    if interpreter and interpreter in table["by_interpreter"]:
        language = table["by_interpreter"][interpreter]
        return language, table["language_family"][language]
    ext = os.path.splitext(os.path.basename(filepath))[1].lower()
    if ext in extra_extensions:
        return ext.lstrip("."), extra_extensions[ext]
    if ext in table["by_extension"]:
        language = table["by_extension"][ext]
        return language, table["language_family"][language]
    return None, None
