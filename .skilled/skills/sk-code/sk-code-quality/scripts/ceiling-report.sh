#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: CEILING MARKER REPORT
# ───────────────────────────────────────────────────────────────
"""
Ceiling-marker report: lists the shortcut markers in code comments and tags the ones whose trigger cannot fire.

Usage: ceiling-report.sh [<file>...]

With no arguments, the report reads the tracked files of the repository that holds the working directory,
keeping the extensions that ../assets/comment-syntax.json lists.
It skips any path with a node_modules component and any path under specs/ with a context component.
With arguments, each path is read as given, without those filters.

A marker is comment text that starts with the marker word and a colon, after an optional comment prefix. The
marker words are ceiling and intentional-limit. The text after the colon is split at its first semicolon, or at
its first comma when there is no semicolon. The part after that split is the trigger. The part before it is the
ceiling and is not checked.

Comment text, and the language and family a file is read with, come from check-comment-hygiene.sh, which is
loaded from beside this file, so the report and the checker read one set of rules. A marker inside a string, a
template literal, a heredoc body or a YAML block scalar is therefore never counted, and a marker in a docstring
is, because the checker decides which text of a line is a comment.

Tags, at most one per marker:
  no-trigger  the trigger is empty or missing
  no-signal   the trigger has no digit and no measurable term

Output: one line per marker in scan order, "path:line  text  [tags]", then the summary line
"markers=N no-trigger=N no-signal=N".

Exit codes:
  0  the report ran, whatever it found (it reports, it does not gate)
  2  a bad argument (an unknown option, a path that does not exist, or a directory), no repository
     around the working directory, an unusable comment family table, or a checker that cannot
     be loaded

"""
# ───────────────────────────────────────────────────────────────
# 1. IMPORTS
# ───────────────────────────────────────────────────────────────

import importlib.machinery
import importlib.util
import os
import re
import subprocess
import sys
from types import ModuleType
from typing import Any, Dict, List, Pattern, Tuple

# ───────────────────────────────────────────────────────────────
# 2. CONSTANTS
# ───────────────────────────────────────────────────────────────

# Loading the checker must not leave a bytecode cache beside the scripts.
sys.dont_write_bytecode = True

CHECKER_NAME = "check-comment-hygiene.sh"

MEASURABLE_RE = re.compile(
    r"\b(throughput|latency|rows?|requests?|users?|size|count|memory|load|rate|ms|seconds?|MB)\b",
    re.IGNORECASE,
)
MARKER_WORDS = r"\s*(ceiling|intentional-limit):"
# A file of unknown language, named as an argument, is read with the table's hash family.
FALLBACK_FAMILY = "hash"

# ───────────────────────────────────────────────────────────────
# 3. CHECKER LOADER
# ───────────────────────────────────────────────────────────────


def _load_checker() -> ModuleType:
    """Load the comment-hygiene checker that sits beside this file.

    The checker owns what counts as comment text, so the report asks it rather than
    keeping a second copy of the rules. The loader reads a file of any name, which a
    .sh entrypoint needs, and bytecode writing is off so no cache folder is left behind.
    """
    path = os.path.join(os.path.dirname(os.path.realpath(__file__)), CHECKER_NAME)
    if not os.path.isfile(path):
        print("ceiling-report: cannot load the comment-hygiene checker %s" % path, file=sys.stderr)
        sys.exit(2)
    try:
        loader = importlib.machinery.SourceFileLoader("comment_hygiene", path)
        spec = importlib.util.spec_from_loader(loader.name, loader)
        module = importlib.util.module_from_spec(spec)
        loader.exec_module(module)
    except (ImportError, OSError, SyntaxError, UnicodeError) as error:
        print("ceiling-report: cannot load the comment-hygiene checker %s: %s" % (path, error), file=sys.stderr)
        sys.exit(2)
    return module


# One module serves the whole run, so the report never keeps a second copy of the rules.
CHECKER = _load_checker()


# ───────────────────────────────────────────────────────────────
# 4. MARKER SCANNING
# ───────────────────────────────────────────────────────────────


def _marker_pattern(family: Dict[str, Any]) -> Pattern[str]:
    """Build the marker pattern for one comment family of the table.

    A marker starts the comment text, after an optional comment prefix, so a docstring
    line and a block body line can carry one, and prose that holds the word later in
    the text still does not count. A family with block comments also takes a leading
    star, the body of a block comment.
    """
    prefixes = list(family["line"])
    if family["block"]:
        prefixes.extend([family["block"][0], "*"])
    if not prefixes:
        return re.compile("^" + MARKER_WORDS)
    return re.compile("^(?:" + "|".join(re.escape(token) for token in prefixes) + ")?" + MARKER_WORDS)


def _trigger_clause(after_marker: str) -> str:
    if ";" in after_marker:
        return after_marker.split(";", 1)[1]
    if "," in after_marker:
        return after_marker.split(",", 1)[1]
    return ""


def _tags_for(trigger: str) -> List[str]:
    if not trigger.strip():
        return ["no-trigger"]
    if re.search(r"\d", trigger) or "%" in trigger or MEASURABLE_RE.search(trigger):
        return []
    return ["no-signal"]


def _read_lines(path: str) -> List[str]:
    try:
        with open(path, "rb") as handle:
            raw = handle.read()
    except OSError as error:
        print("WARNING: cannot read %s: %s" % (path, error), file=sys.stderr)
        return []
    try:
        text = raw.decode("utf-8")
    except UnicodeDecodeError:
        print("WARNING: %s is not valid UTF-8, decoded with replacement characters" % path, file=sys.stderr)
        text = raw.decode("utf-8", errors="replace")
    # The checker reads with universal newlines, so a CRLF closing word ends a heredoc there and
    # would not end it here without the same translation, losing every marker after the body.
    return text.replace("\r\n", "\n").replace("\r", "\n").split("\n")


def _scan(
    shown: str,
    path: str,
    table: Dict[str, Any],
    patterns: Dict[str, Pattern[str]],
    found: List[Tuple[str, int, str, List[str]]],
) -> None:
    """Collect the ceiling markers of one file, reading its comment text through the checker.

    The language comes from the checker, and one scan state runs over the whole file, so a
    construct that spans lines is read here the way the checker reads it.
    """
    try:
        _, family_name = CHECKER.language_for(path, table, {})
    except OSError as error:
        print("WARNING: cannot read %s: %s" % (path, error), file=sys.stderr)
        return
    family_name = family_name or FALLBACK_FAMILY
    family = table["families"][family_name]
    state = CHECKER.ScanState()
    for lineno, raw_line in enumerate(_read_lines(path), start=1):
        text = CHECKER.comment_text(raw_line, family, state)
        match = patterns[family_name].match(text)
        if match is None:
            continue
        trigger = _trigger_clause(text[match.end():])
        found.append((shown, lineno, raw_line.strip(), _tags_for(trigger)))


def _read_table() -> Dict[str, Any]:
    """Read the comment family table through the checker, and exit 2 when it cannot."""
    try:
        table = CHECKER.load_table(CHECKER.TABLE_PATH)
    # The loader validates the table while reading it, so a malformed table reaches here as any
    # of these, and each must read as one message rather than a traceback.
    except (OSError, ValueError, KeyError, TypeError, AttributeError, IndexError) as error:
        print("ceiling-report: cannot read the comment family table %s: %s" % (CHECKER.TABLE_PATH, error),
              file=sys.stderr)
        sys.exit(2)
    # A file of unknown language is read with the fallback family, so a table without that
    # family is refused here, before any file is read, rather than raising partway through a
    # run that had already printed the markers before it.
    if FALLBACK_FAMILY not in table["families"]:
        print("ceiling-report: the comment family table %s has no %s family for files of unknown language"
              % (CHECKER.TABLE_PATH, FALLBACK_FAMILY), file=sys.stderr)
        sys.exit(2)
    return table


# ───────────────────────────────────────────────────────────────
# 5. REPOSITORY FILE DISCOVERY
# ───────────────────────────────────────────────────────────────


# The report serves the repository it is run in, which need not be the one that holds this script.
def _repo_root() -> str:
    here = os.getcwd()
    result = subprocess.run(
        ["git", "-C", here, "rev-parse", "--show-toplevel"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    if result.returncode != 0:
        print("ceiling-report: no git repository found from %s" % here, file=sys.stderr)
        sys.exit(2)
    return result.stdout.decode("utf-8").strip()


def _tracked_code_files(root: str, extensions: Dict[str, Any]) -> List[str]:
    result = subprocess.run(
        ["git", "-C", root, "ls-files", "-z"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    if result.returncode != 0:
        print("ceiling-report: git ls-files failed: %s" % result.stderr.decode("utf-8", "replace").strip(), file=sys.stderr)
        sys.exit(2)
    kept = []
    for rel in result.stdout.decode("utf-8", "replace").split("\0"):
        if not rel:
            continue
        if os.path.splitext(rel)[1].lower() not in extensions:
            continue
        parts = rel.split("/")
        if "node_modules" in parts:
            continue
        if parts[0] == "specs" and "context" in parts[1:]:
            continue
        kept.append(rel)
    return kept


def main(argv: List[str]) -> int:
    table = _read_table()
    patterns = {name: _marker_pattern(family) for name, family in table["families"].items()}
    if argv:
        for arg in argv:
            if arg.startswith("-"):
                print("ceiling-report: unknown option %s" % arg, file=sys.stderr)
                print("Usage: ceiling-report.sh [<file>...]", file=sys.stderr)
                return 2
            if not os.path.exists(arg):
                print("ceiling-report: no such path: %s" % arg, file=sys.stderr)
                return 2
            if os.path.isdir(arg):
                print("ceiling-report: a directory is not a file: %s" % arg, file=sys.stderr)
                return 2
        targets = [(arg, arg) for arg in argv]
    else:
        root = _repo_root()
        targets = [(rel, os.path.join(root, rel)) for rel in _tracked_code_files(root, table["by_extension"])]

    found = []
    for shown, path in targets:
        _scan(shown, path, table, patterns, found)

    no_trigger = 0
    no_signal = 0
    for shown, lineno, text, tags in found:
        print("%s:%d  %s  [%s]" % (shown, lineno, text, ",".join(tags)))
        if "no-trigger" in tags:
            no_trigger += 1
        if "no-signal" in tags:
            no_signal += 1
    print("markers=%d no-trigger=%d no-signal=%d" % (len(found), no_trigger, no_signal))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
