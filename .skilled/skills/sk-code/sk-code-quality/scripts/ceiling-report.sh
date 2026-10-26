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

A marker is a comment that starts with a comment prefix, then the marker word, then a colon. The marker words are
ceiling and intentional-limit. The text after the colon is split at its first semicolon, or at its first comma when
there is no semicolon. The part after that split is the trigger. The part before it is the ceiling and is not checked.

Tags, at most one per marker:
  no-trigger  the trigger is empty or missing
  no-signal   the trigger has no digit and no measurable term

Output: one line per marker in scan order, "path:line  text  [tags]", then the summary line
"markers=N no-trigger=N no-signal=N".

Exit codes:
  0  the report ran, whatever it found (it reports, it does not gate)
  2  a bad argument (an unknown option, a path that does not exist, or a directory), no repository
     around the working directory, or an unreadable comment family table
"""
import json
import os
import re
import subprocess
import sys

TABLE_PATH = os.path.join(os.path.dirname(os.path.realpath(__file__)), "..", "assets", "comment-syntax.json")

MEASURABLE_RE = re.compile(
    r"\b(throughput|latency|rows?|requests?|users?|size|count|memory|load|rate|ms|seconds?|MB)\b",
    re.IGNORECASE,
)
MARKER_WORDS = r"\s*(ceiling|intentional-limit):"
# A file whose extension the table does not name, passed as an argument, is read with
# hash comments, as the report always did.
FALLBACK_FAMILY = {"lineComment": ["#"], "lineCommentAfterSpace": True, "quotes": ["'", '"'], "singleQuoteEscapes": False}


def family_reader(spec):
    """Build the marker pattern and the comment tokens for one family of the table.

    A marker starts at a comment prefix, so prose and identifiers that merely contain the
    word do not count. A family with block comments also takes a leading star, the body
    line of a block comment.
    """
    line_tokens = list(spec.get("lineComment", []))
    block = spec.get("blockComment")
    prefixes = line_tokens + ([block[0], "*"] if block else [])
    return {
        "marker": re.compile("^(?:" + "|".join(re.escape(token) for token in prefixes) + ")" + MARKER_WORDS),
        "line": line_tokens,
        "block_opener": block[0] if block else None,
        "prefixes": tuple(prefixes),
        # A one-character multi-line string token, such as a Go backtick, quotes text on one line too.
        "quotes": tuple(spec.get("quotes", [])) + tuple(t for t in spec.get("multilineStrings", []) if len(t) == 1),
        "after_space": bool(spec.get("lineCommentAfterSpace", False)),
        "single_quote_escapes": bool(spec.get("singleQuoteEscapes", True)),
    }


# Comment detection is kept here because check-comment-hygiene.sh is a shell entrypoint with no importable
# module. A marker sits on one line, so block, docstring and block scalar state are not tracked. Text inside a
# string literal is never a comment, so quoted fixtures do not count as markers.
def find_unquoted_comment(line, reader):
    in_string = False
    quote = ""
    escaping = False
    for index, char in enumerate(line):
        if in_string:
            if escaping:
                escaping = False
            elif char == "\\" and (quote != "'" or reader["single_quote_escapes"]):
                escaping = True
            elif char == quote:
                in_string = False
            continue
        if char in reader["quotes"]:
            in_string = True
            quote = char
            continue
        starts_token = any(line.startswith(token, index) for token in reader["line"])
        if starts_token and reader["after_space"] and index > 0 and not line[index - 1].isspace():
            starts_token = False
        opener = reader["block_opener"]
        if opener and line.startswith(opener, index) and (index == 0 or line[index - 1].isspace()):
            starts_token = True
        if starts_token:
            return index
    return -1


def comment_text(raw_line, reader):
    stripped = raw_line.strip()
    if stripped.startswith(reader["prefixes"]):
        return stripped
    index = find_unquoted_comment(raw_line, reader)
    if index < 0:
        return ""
    return raw_line[index:].strip()


def trigger_clause(after_marker):
    if ";" in after_marker:
        return after_marker.split(";", 1)[1]
    if "," in after_marker:
        return after_marker.split(",", 1)[1]
    return ""


def tags_for(trigger):
    if not trigger.strip():
        return ["no-trigger"]
    if re.search(r"\d", trigger) or "%" in trigger or MEASURABLE_RE.search(trigger):
        return []
    return ["no-signal"]


def read_lines(path):
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
    return text.split("\n")


def scan(shown, path, reader, markers):
    for lineno, raw_line in enumerate(read_lines(path), start=1):
        text = comment_text(raw_line, reader)
        match = reader["marker"].match(text)
        if match is None:
            continue
        trigger = trigger_clause(text[match.end():])
        markers.append((shown, lineno, raw_line.strip(), tags_for(trigger)))


def load_readers():
    """Map each extension in the comment family table to the comment reader of its family."""
    try:
        with open(TABLE_PATH, "r", encoding="utf-8") as handle:
            table = json.load(handle)
        families = table["families"]
        reader_by_extension = {}
        for spec in table["languages"].values():
            reader = family_reader(families[spec["family"]])
            for ext in spec["extensions"]:
                reader_by_extension[ext.lower()] = reader
    except (OSError, ValueError, KeyError, TypeError, AttributeError, IndexError, re.error) as error:
        print("ceiling-report: cannot read the comment family table %s: %s" % (TABLE_PATH, error), file=sys.stderr)
        sys.exit(2)
    return reader_by_extension


# The report serves the repository it is run in, which need not be the one that holds this script.
def repo_root():
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


def tracked_code_files(root, extensions):
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


def main(argv):
    reader_by_extension = load_readers()
    fallback = family_reader(FALLBACK_FAMILY)
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
        root = repo_root()
        targets = [(rel, os.path.join(root, rel)) for rel in tracked_code_files(root, reader_by_extension)]

    markers = []
    for shown, path in targets:
        reader = reader_by_extension.get(os.path.splitext(shown)[1].lower(), fallback)
        scan(shown, path, reader, markers)

    no_trigger = 0
    no_signal = 0
    for shown, lineno, text, tags in markers:
        print("%s:%d  %s  [%s]" % (shown, lineno, text, ",".join(tags)))
        if "no-trigger" in tags:
            no_trigger += 1
        if "no-signal" in tags:
            no_signal += 1
    print("markers=%d no-trigger=%d no-signal=%d" % (len(markers), no_trigger, no_signal))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
