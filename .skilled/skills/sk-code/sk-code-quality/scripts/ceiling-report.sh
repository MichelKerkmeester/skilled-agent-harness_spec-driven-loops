#!/usr/bin/env python3
"""
Ceiling-marker report: lists the shortcut markers in code comments and tags the ones whose trigger cannot fire.

Usage: ceiling-report.sh [<file>...]

With no arguments, the report reads the tracked code files of the repository (.ts .tsx .js .mjs .cjs .py .sh .bash).
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
  2  a bad argument: an unknown option, a path that does not exist, or a directory
"""
import os
import re
import subprocess
import sys

CODE_EXTENSIONS = (".ts", ".tsx", ".js", ".mjs", ".cjs", ".py", ".sh", ".bash")
JS_FAMILY = (".ts", ".tsx", ".js", ".mjs", ".cjs", ".jsonc")

# A marker starts at a comment prefix, so prose and identifiers that merely contain the word do not count.
MARKER_RE = re.compile(r"^(#|//|/\*|\*)\s*(ceiling|intentional-limit):")
MEASURABLE_RE = re.compile(
    r"\b(throughput|latency|rows?|requests?|users?|size|count|memory|load|rate|ms|seconds?|MB)\b",
    re.IGNORECASE,
)


# Comment detection is copied from check-comment-hygiene.sh because that file is a shell entrypoint with no
# importable module. Text inside a string literal is never a comment, so quoted fixtures do not count as markers.
def find_unquoted_js_line_comment(line):
    in_string = False
    quote = ""
    escaping = False
    index = 0
    while index < len(line):
        char = line[index]
        next_char = line[index + 1] if index + 1 < len(line) else ""
        if in_string:
            if escaping:
                escaping = False
            elif char == "\\":
                escaping = True
            elif char == quote:
                in_string = False
            index += 1
            continue
        if char in ("'", '"', "`"):
            in_string = True
            quote = char
            index += 1
            continue
        if char == "/" and next_char == "/":
            return index
        index += 1
    return -1


def find_unquoted_hash_comment(line):
    in_string = False
    quote = ""
    escaping = False
    for index, char in enumerate(line):
        if in_string:
            if escaping:
                escaping = False
            elif char == "\\" and quote != "'":
                escaping = True
            elif char == quote:
                in_string = False
            continue
        if char in ("'", '"'):
            in_string = True
            quote = char
            continue
        if char == "#" and (index == 0 or line[index - 1].isspace()):
            return index
    return -1


def comment_text(raw_line, js_family):
    stripped = raw_line.strip()
    if js_family:
        if stripped.startswith(("//", "/*", "*")):
            return stripped
        index = find_unquoted_js_line_comment(raw_line)
    else:
        if stripped.startswith("#"):
            return stripped
        index = find_unquoted_hash_comment(raw_line)
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


def scan(shown, path, js_family, markers):
    for lineno, raw_line in enumerate(read_lines(path), start=1):
        text = comment_text(raw_line, js_family)
        match = MARKER_RE.match(text)
        if match is None:
            continue
        trigger = trigger_clause(text[match.end():])
        markers.append((shown, lineno, raw_line.strip(), tags_for(trigger)))


def repo_root():
    here = os.path.dirname(os.path.abspath(__file__))
    result = subprocess.run(
        ["git", "-C", here, "rev-parse", "--show-toplevel"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    if result.returncode != 0:
        print("ceiling-report: no git repository found from %s" % here, file=sys.stderr)
        sys.exit(2)
    return result.stdout.decode("utf-8").strip()


def tracked_code_files(root):
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
        if os.path.splitext(rel)[1].lower() not in CODE_EXTENSIONS:
            continue
        parts = rel.split("/")
        if "node_modules" in parts:
            continue
        if parts[0] == "specs" and "context" in parts[1:]:
            continue
        kept.append(rel)
    return kept


def main(argv):
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
        targets = [(rel, os.path.join(root, rel)) for rel in tracked_code_files(root)]

    markers = []
    for shown, path in targets:
        js_family = os.path.splitext(shown)[1].lower() in JS_FAMILY
        scan(shown, path, js_family, markers)

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
