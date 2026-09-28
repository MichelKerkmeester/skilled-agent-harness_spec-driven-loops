#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: VALIDATION OFF SWITCH
# ───────────────────────────────────────────────────────────────

"""The off switch every sk-doc validator shares.

Someone who does not care whether their docs drift from the expected formats
switches every sk-doc validator off with SKDOC_SKIP_VALIDATION, set in the
environment or saved in .skilled/hooks/hook-flags.env. The hooks resolve that
file in Node and shell, and no Python resolver exists, so this mirrors theirs:
the environment answers whenever the variable is set, even to an empty value,
the file answers otherwise, and only 1, true, yes or on turn the switch on.
validation-switch.cjs is the Node twin.
"""

import json
import os
import re
import sys
from pathlib import Path
from typing import Dict, Mapping, Optional, Sequence


# ───────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ───────────────────────────────────────────────────────────────

SWITCH = "SKDOC_SKIP_VALIDATION"
TRUTHY = frozenset({"1", "true", "yes", "on"})
# `valid` is the field the document validators report a pass in, so a caller
# reading their JSON, such as the README auditor, counts a skip as no finding.
SKIPPED_LINE = {"skipped": True, "valid": True, "reason": f"{SWITCH} is on"}
# A '#' after a space or tab ends a value, as in hook-flags.cjs, so a line that
# carries a trailing comment still counts.
TRAILING_COMMENT = re.compile(r"[ \t]#.*$")


# ───────────────────────────────────────────────────────────────
# 2. RESOLVER
# ───────────────────────────────────────────────────────────────

def is_truthy(value: Optional[str]) -> bool:
    """Match the hooks' truthy set, ignoring case and surrounding space."""
    return isinstance(value, str) and value.strip().lower() in TRUTHY


def config_path(env: Mapping[str, str] = os.environ) -> Path:
    """The flags file, which HOOK_FLAGS_CONFIG can point elsewhere."""
    override = env.get("HOOK_FLAGS_CONFIG")
    if override:
        return Path(override)
    # This file sits at .skilled/skills/sk-doc/shared/scripts/, four levels below .skilled/.
    return Path(__file__).resolve().parents[4] / "hooks" / "hook-flags.env"


def load_config_file(path: Path) -> Dict[str, str]:
    """Parse KEY=value lines the way hook-flags.cjs does.

    Blank lines, comment lines and lines without a key are skipped, a trailing
    comment is dropped, matching quotes around a value are stripped and a later
    line wins. A file that cannot be read yields no values, so it can never turn
    a switch on.
    """
    try:
        raw = path.read_text(encoding="utf-8-sig")
    except (OSError, UnicodeDecodeError):
        return {}
    values: Dict[str, str] = {}
    for line in raw.split("\n"):
        trimmed = line.strip()
        if not trimmed or trimmed.startswith("#"):
            continue
        eq = trimmed.find("=")
        if eq <= 0:
            continue
        key = trimmed[:eq].strip()
        if not key:
            continue
        value = TRAILING_COMMENT.sub("", trimmed[eq + 1:]).strip()
        if len(value) >= 2 and value[0] == value[-1] and value[0] in ("'", '"'):
            value = value[1:-1]
        values[key] = value
    return values


def skip_source(env: Mapping[str, str] = os.environ) -> Optional[str]:
    """Where the switch was turned on, or None when validation should run."""
    if SWITCH in env:
        return "the environment" if is_truthy(env[SWITCH]) else None
    path = config_path(env)
    return str(path) if is_truthy(load_config_file(path).get(SWITCH)) else None


# ───────────────────────────────────────────────────────────────
# 3. EARLY EXIT
# ───────────────────────────────────────────────────────────────

def wants_json(argv: Sequence[str]) -> bool:
    """True when the arguments ask for JSON output."""
    args = list(argv)
    for index, arg in enumerate(args):
        if arg in ("--json", "--format=json"):
            return True
        if arg == "--format" and index + 1 < len(args) and args[index + 1] == "json":
            return True
    return False


def exit_if_validation_off(tool: str, argv: Optional[Sequence[str]] = None) -> None:
    """End the process before any check runs when the switch is on.

    A caller that asked for JSON still gets a line it can parse, because an
    empty stdout reads as a broken report.
    """
    source = skip_source()
    if source is None:
        return
    args = sys.argv[1:] if argv is None else argv
    print(f"{tool}: validation skipped, {SWITCH} is on in {source}", file=sys.stderr)
    if wants_json(args):
        print(json.dumps(SKIPPED_LINE))
    sys.exit(0)
