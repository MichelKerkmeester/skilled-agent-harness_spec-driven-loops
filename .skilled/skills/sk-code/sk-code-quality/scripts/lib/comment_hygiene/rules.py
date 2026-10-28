#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: COMMENT HYGIENE RULES
# ───────────────────────────────────────────────────────────────

"""Name the rule a finding carries, and refuse an id no run may switch off.

Usage: imported by `checker.py` and `cli.py`
Output: the allow-list patterns cut out before the violation patterns run, the URL span, and
the core rule name a disable value resolves to

The core violation table itself is exported from the checker's entry point, because the
quality runner and two shared suites read it out of that file's text, so it is handed to
the functions here rather than kept in a second copy.
"""

from __future__ import annotations

# ───────────────────────────────────────────────────────────────
# 1. IMPORTS
# ───────────────────────────────────────────────────────────────

import json
import re
from typing import List, Pattern, Tuple


# ───────────────────────────────────────────────────────────────
# 2. CONSTANTS
# ───────────────────────────────────────────────────────────────

RULE_CLASS = "hygiene"

URL_SPAN = re.compile(r"\bhttps?://\S+", re.IGNORECASE)

# --- Allowed-class patterns ---
# Each match is cut out of the comment text before the violation patterns run, the way
# a URL is, so a standard code on a line never hides a label beside it.
ALLOWED_PATTERNS = [
    re.compile(r'\bCWE-\d+\b'),                    # CWE security codes
    re.compile(r'\bRFC\s*-?\d+\b'),                 # RFC references
    re.compile(r'\bPOSIX\b'),                        # POSIX standard
    re.compile(r'\bHTTP\s+\d{3}\b'),                 # HTTP status codes
    re.compile(r'\bV\d+\s*:'),                       # V16: schema tag
]


# ───────────────────────────────────────────────────────────────
# 3. USAGE ERROR
# ───────────────────────────────────────────────────────────────

class _UsageError(Exception):
    pass


# ───────────────────────────────────────────────────────────────
# 4. RULE IDS
# ───────────────────────────────────────────────────────────────

def _load_fixed_ids(path: str) -> List[str]:
    """Read the ids the shared contract fixes. Raises ValueError on any defect."""
    with open(path, "r", encoding="utf-8") as handle:
        contract = json.load(handle)
    fixed = contract.get("fixed") if isinstance(contract, dict) else None
    if not isinstance(fixed, list) or not all(isinstance(entry, dict) and isinstance(entry.get("id"), str)
                                              for entry in fixed):
        raise ValueError("fixed must be a list of entries with an id")
    return [entry["id"] for entry in fixed]


def _disabled_rule(
    value: str,
    fixed_ids: List[str],
    violation_patterns: List[Tuple[str, Pattern[str], str]],
) -> str:
    """Return the core rule name a --disable-rule value names, or raise UsageError.

    A value is a bare core rule name or the same name with its class in front. An id the
    contract fixes, whole or through its class wildcard, is refused by name, because a
    floor rule stays on in every repository. Anything else that names no core rule is
    refused too, so a misspelled id never reads as a rule switched off.
    """
    known = [rule for rule, _, _ in violation_patterns]
    rule_class, dot, name = value.partition(".")
    if not dot:
        rule_class, name = RULE_CLASS, value
    qualified = f"{rule_class}.{name}"
    if qualified in fixed_ids or f"{rule_class}.*" in fixed_ids:
        raise _UsageError(f"--disable-rule {value} is fixed by the shared rule-override contract and cannot be disabled")
    if rule_class != RULE_CLASS or name not in known:
        raise _UsageError(f"--disable-rule {value} names no core comment-hygiene rule (known: {', '.join(known)})")
    return name
