#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: COMMENT HYGIENE CLI
# ───────────────────────────────────────────────────────────────

"""Read the checker's arguments, check every input file and print the result.

Usage: imported by the checker's entry point, which calls `main(argv, violation_patterns)`
Output: one text line per finding, or one comment-hygiene/v1 document, and the exit code
"""

from __future__ import annotations

# ───────────────────────────────────────────────────────────────
# 1. IMPORTS
# ───────────────────────────────────────────────────────────────

import json
import os
import re
import sys
from typing import Any, Dict, List, Pattern, Tuple

from .checker import _check_file
from .families import load_table
from .rules import _UsageError, _disabled_rule, _load_fixed_ids


# ───────────────────────────────────────────────────────────────
# 2. CONFIGURATION
# ───────────────────────────────────────────────────────────────

SCHEMA = "comment-hygiene/v1"
USAGE = ("Usage: check-comment-hygiene.sh [--json] [--ticket-prefix P] [--extension EXT=FAMILY] "
         "[--extra-pattern REGEX] [--disable-rule ID] [--] <file> [<file>...]")
# The scripts folder the checker and its assets sit in, three folders above this module, so
# every asset and contract path reads the same as it does from the entry point.
SCRIPTS_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.realpath(__file__))))
TABLE_PATH = os.path.join(SCRIPTS_DIR, "..", "assets", "comment-syntax.json")
# The shared rule-override contract names the rules no repository may switch off, so a
# disabled id is checked against that one list rather than a copy kept here.
CONTRACT_PATH = os.path.join(SCRIPTS_DIR, "..", "..", "shared", "references",
                             "universal", "rule-overrides.json")


# ───────────────────────────────────────────────────────────────
# 3. ARGUMENTS
# ───────────────────────────────────────────────────────────────

def _parse_args(
    argv: List[str],
    families: Dict[str, Any],
    violation_patterns: List[Tuple[str, Pattern[str], str]],
) -> Dict[str, Any]:
    options = {"json": False, "patterns": [], "extensions": {}, "disabled": [], "files": []}
    fixed_ids = None
    index = 0
    while index < len(argv):
        arg = argv[index]
        if arg == "--":
            options["files"].extend(argv[index + 1:])
            break
        if arg == "--json":
            options["json"] = True
        elif arg in ("--ticket-prefix", "--extension", "--extra-pattern", "--disable-rule"):
            if index + 1 >= len(argv) or not argv[index + 1]:
                raise _UsageError(f"{arg} needs a value")
            value = argv[index + 1]
            index += 1
            if arg == "--disable-rule":
                # The contract is read only when a rule is switched off, so a run that
                # disables nothing never depends on it, and one that does fails closed.
                if fixed_ids is None:
                    try:
                        fixed_ids = _load_fixed_ids(CONTRACT_PATH)
                    except (OSError, ValueError) as error:
                        raise _UsageError(f"--disable-rule cannot read the rule-override contract {CONTRACT_PATH}: {error}")
                name = _disabled_rule(value, fixed_ids, violation_patterns)
                if name not in options["disabled"]:
                    options["disabled"].append(name)
            elif arg == "--ticket-prefix":
                pattern = re.compile(r"\b" + re.escape(value) + r"-[0-9][0-9A-Za-z]*\b")
                options["patterns"].append(("ticket-prefix", pattern, "issue or ticket reference"))
            elif arg == "--extension":
                ext, _, family = value.partition("=")
                if not ext or family not in families:
                    raise _UsageError(f"--extension needs EXT=FAMILY with a family from the table: {value}")
                options["extensions"][("." + ext.lstrip(".")).lower()] = family
            else:
                try:
                    pattern = re.compile(value)
                except re.error as error:
                    raise _UsageError(f"--extra-pattern is not a valid regular expression: {error}")
                options["patterns"].append(("extra-pattern", pattern, "repository pattern"))
        elif arg.startswith("--"):
            raise _UsageError(f"unknown option {arg}")
        else:
            options["files"].append(arg)
        index += 1
    if not options["files"]:
        raise _UsageError("no input files")
    return options


# ───────────────────────────────────────────────────────────────
# 4. EXIT CODE
# ───────────────────────────────────────────────────────────────

def _exit_code_for(records: List[Dict[str, Any]]) -> int:
    statuses = {record["status"] for record in records}
    if "violation" in statuses:
        return 1
    if "unreadable" in statuses:
        return 3
    return 0 if "clean" in statuses else 2


# ───────────────────────────────────────────────────────────────
# 5. RUN
# ───────────────────────────────────────────────────────────────

def main(argv: List[str], violation_patterns: List[Tuple[str, Pattern[str], str]]) -> int:
    try:
        table = load_table(TABLE_PATH)
    except (OSError, ValueError) as error:
        print(f"ERROR: cannot load the comment family table {TABLE_PATH}: {error}", file=sys.stderr)
        return 3
    try:
        options = _parse_args(argv, table["families"], violation_patterns)
    except _UsageError as error:
        print(f"ERROR: {error}", file=sys.stderr)
        print(USAGE, file=sys.stderr)
        return 3

    core = [entry for entry in violation_patterns if entry[0] not in options["disabled"]]
    patterns = core + options["patterns"]
    records = [_check_file(path, table, patterns, options["extensions"]) for path in options["files"]]
    code = _exit_code_for(records)
    if options["json"]:
        document = {"schema": SCHEMA, "exit_code": code, "files": records}
        if options["disabled"]:
            document["disabled_rules"] = options["disabled"]
        print(json.dumps(document, indent=2))
    else:
        for record in records:
            for finding in record["findings"]:
                print(f"{record['file']}:{finding['line']}: {finding['excerpt']} [{finding['reason']}]")
    return code
