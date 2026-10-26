#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: COMMENT HYGIENE CHECKER
# ───────────────────────────────────────────────────────────────
"""
Comment hygiene checker: detects ephemeral-artifact pointers in code comments.

Usage: check-comment-hygiene.sh [options] [--] <file> [<file>...]

Options, each repeatable except --json:
  --json                    print one comment-hygiene/v1 document instead of text lines
  --ticket-prefix PREFIX    also flag tracker ids that start with PREFIX and a hyphen
  --extension EXT=FAMILY    check files ending in EXT with a comment family from the table
  --extra-pattern REGEX     also flag comment text that matches REGEX

A file's language comes from a shebang that names a known interpreter, and from its
extension otherwise. The comment families, extensions and interpreters live in
../assets/comment-syntax.json, which is read from this script's real path.

Text output prints one line per finding: FILEPATH:LINE: excerpt [reason]

Exit codes:
  0  every checked file is clean
  1  violations found in at least one file
  2  every file was skipped (excluded directory, directory or unknown language, including
     a file that cannot be opened and whose extension names no language)
  3  a usage error, an unreadable family table, or an input file that could not be read

Escape: add "hygiene-ok" anywhere on a comment line to suppress it.

See: .skilled/skills/sk-code/sk-code-quality/references/code-style-guide.md section 4
"""
import json
import os
import re
import sys

SCHEMA = "comment-hygiene/v1"
USAGE = "Usage: check-comment-hygiene.sh [--json] [--ticket-prefix P] [--extension EXT=FAMILY] [--extra-pattern REGEX] [--] <file> [<file>...]"
TABLE_PATH = os.path.join(os.path.dirname(os.path.realpath(__file__)), "..", "assets", "comment-syntax.json")

EXCLUDED_DIRS = ["/dist/", "/node_modules/", "/.git/"]
SHEBANG_READ_BYTES = 512
# A docstring is a triple-quoted string standing alone as a statement, so only a
# string prefix may sit in front of its opening quotes.
DOCSTRING_PREFIXES = {"", "r", "u", "b", "f", "rb", "br", "rf", "fr"}
# A string statement documents the code only where Python or its documentation tools
# read it: first in a module, first in a def or class body, or right after an
# assignment, as an attribute docstring. Anywhere else it is data.
DOCUMENTED_STATEMENT = re.compile(r"^(?:(?:async\s+)?(?:def|class)\b.*:|[A-Za-z_][\w.]*\s*(?::[^=]*)?=(?!=).*)$", re.DOTALL)
BLOCK_OPENER_AFTER = "([{,;=:)]}"
URL_SPAN = re.compile(r"\bhttps?://\S+", re.IGNORECASE)
# A Rust char literal, so a quote inside one never opens a string. A lifetime such as
# 'a has no closing quote and stays code.
CHAR_LITERAL = re.compile(r"'(?:\\(?:u\{[0-9A-Fa-f]{1,6}\}|x[0-9A-Fa-f]{2}|.)|[^\\'\n])'")
# A YAML key or list item whose value is a block scalar indicator, | or >, with optional
# anchor and tag properties, indentation and chomping indicators and an optional
# trailing comment. The lines below it hold text, so a # there never starts a comment.
YAML_BLOCK_SCALAR = re.compile(
    r"^(?P<indent> *)(?P<dashes>(?:- +)*)"
    r"(?:(?P<key>(?:'[^']*')+|\"(?:[^\"\\]|\\.)*\"|[^\s#'\"][^#]*?)[ \t]*:[ \t]+)?"
    r"(?:(?:&\S+|!\S*)[ \t]+){0,2}"
    r"[|>](?:[1-9][+-]?|[+-][1-9]?)?(?:[ \t]+#.*)?[ \t]*$"
)

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

# --- Violation patterns ---
# Each is (rule id, pattern, reason). The first match on a line is its one finding.
# F-notation is intentionally excluded: repo comments use it heavily for function keys,
# figures, and field references, so genuine finding labels stay review-owned.
# The slash rule needs a zero-padded second number, because packet children are
# zero-padded and a ratio or a measurement is not.
VIOLATION_PATTERNS = [
    ("packet-slash",      re.compile(r'\b\d{3}/0\d{2}\b'),                             "packet/phase reference"),
    ("rc",                re.compile(r'\bRC-\d+\b'),                                  "RC reference"),
    ("adr",               re.compile(r'\bADR-\d+\b'),                                 "ADR reference"),
    ("req",               re.compile(r'\bREQ-\d+\b'),                                 "REQ reference"),
    ("chk",               re.compile(r'\bCHK-\d+\b'),                                 "CHK reference"),
    ("task",              re.compile(r'\bT\d{3,4}\b'),                                "task ID reference"),
    ("packet-number",     re.compile(r'\bpacket\s+\d+\b', re.IGNORECASE),             "packet number reference"),
    ("packet-reversed",   re.compile(r'\b\d{3}\s+packet\b', re.IGNORECASE),           "reversed packet number reference"),
    ("phase-number",      re.compile(r'\bphase[\s-]\d{3}\b', re.IGNORECASE),          "3-digit phase reference"),
    ("phase-path",        re.compile(r'\bphase-\d{1,3}(?:-[a-z0-9]+)+\b', re.IGNORECASE), "numeric phase-path reference"),
    ("feature-catalog",   re.compile(r'\bfeature\s+catalog\s*:', re.IGNORECASE),       "feature-catalog reference"),
    ("generic-label",     re.compile(r'\bphase\s+0+\d*\b|\bspec\s+\d{3}\b', re.IGNORECASE), "bounded generic artifact label"),
    ("spec-path",         re.compile(r'specs/[a-z0-9][a-z0-9.-]*/[^/\s]+'),                "spec path reference"),
    ("worktree-session",  re.compile(r'\bWS-\d+-\d+\b'),                              "worktree session reference"),
    ("deep-review",       re.compile(r'\bDR-\d+(?:-\d+)?\b'),                         "deep review reference"),
    ("council-seat",      re.compile(r'\bP\d+-Seat\d+\b'),                            "council seat reference"),
    ("review-finding",    re.compile(r'\breview\s+finding\b', re.IGNORECASE),         "review finding reference"),
    ("checklist-item",    re.compile(r'\bchecklist\s+item\s+\d+\b', re.IGNORECASE),  "checklist item reference"),
    ("finding-id",        re.compile(r'\b[Pp]\d-finding[-\s]\d+\b'),                  "finding id reference"),
    ("finding-number",    re.compile(r'\bfinding\s+#\d+\b', re.IGNORECASE),          "finding id reference"),
    ("issue",             re.compile(r'\b(?:fix(?:es|ed)?|close[sd]?|resolve[sd]?|issue|ticket|bug)\s*#\d+\b', re.IGNORECASE), "issue or ticket reference"),
]


class UsageError(Exception):
    pass


# ─────────────────────────────────────────────────────────────────
# 1. FAMILY TABLE
# ─────────────────────────────────────────────────────────────────

def _string_list(value, where):
    if not isinstance(value, list) or not all(isinstance(item, str) and item for item in value):
        raise ValueError(f"{where} must be a list of non-empty strings")
    return value


def load_table(path):
    """Read and validate the comment-family table. Raises ValueError on any defect."""
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


def interpreter_from_shebang(first_line):
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


# ─────────────────────────────────────────────────────────────────
# 2. COMMENT SCANNING
# ─────────────────────────────────────────────────────────────────

def _skip_string(line, start, quote, family):
    """Return the index just past the string that opens at start."""
    index = start + 1
    while index < len(line):
        char = line[index]
        if char == "\\" and (quote != "'" or family["single_quote_escapes"]):
            index += 2
            continue
        if char == quote:
            return index + 1
        index += 1
    return index


def _line_comment_at(line, index, family):
    for token in family["line"]:
        if line.startswith(token, index):
            if family["after_space"] and index > 0 and not line[index - 1].isspace():
                return False
            return True
    return False


class ScanState:
    """What one line leaves open for the next.

    open is None, ("block",) inside a block comment, or ("string", closer, is_docstring)
    inside a string that spans lines. scalar_base is the column a YAML block scalar's
    text must be deeper than. The last three fields serve docstring families only: the
    open bracket depth, the code of the unfinished logical line, and the last finished one.
    """

    def __init__(self):
        self.open = None
        self.scalar_base = None
        self.depth = 0
        self.statement = ""
        self.last_statement = None


def _opens_docstring(state):
    if state.depth != 0 or state.statement.strip().lower() not in DOCSTRING_PREFIXES:
        return False
    return state.last_statement is None or DOCUMENTED_STATEMENT.match(state.last_statement) is not None


def scan_line(line, family, state):
    """Split one line into comment segments, updating state in place.

    Only docstring text counts as comment text, so the body of any other string that
    spans lines is skipped.
    """
    segments = []
    index = 0
    block = family["block"]
    tracks_statements = family["docstrings"]
    while index < len(line):
        if state.open is not None:
            if state.open[0] == "block":
                close = line.find(block[1], index)
                if close < 0:
                    segments.append(line[index:])
                    return segments
                segments.append(line[index:close + len(block[1])])
                index = close + len(block[1])
            else:
                _, closer, is_docstring = state.open
                close = line.find(closer, index)
                if close < 0:
                    if is_docstring:
                        segments.append(line[index:])
                    return segments
                if is_docstring:
                    segments.append(line[index:close])
                index = close + len(closer)
            state.open = None
            continue

        char = line[index]
        token = next((t for t in family["multiline"] if line.startswith(t, index)), None)
        if token:
            is_docstring = tracks_statements and _opens_docstring(state)
            if tracks_statements:
                state.statement += token
            state.open = ("string", token, is_docstring)
            index += len(token)
            continue
        if family["char_literals"] and char == "'":
            literal = CHAR_LITERAL.match(line, index)
            index = literal.end() if literal else index + 1
            continue
        if char in family["quotes"]:
            end = _skip_string(line, index, char, family)
            if tracks_statements:
                state.statement += line[index:end]
            index = end
            continue
        # An opener counts only at the start of a line, after whitespace or after
        # punctuation that can end code, so a glob such as src/** in prose or an
        # escaped slash in a regex literal never opens a block comment.
        if block and line.startswith(block[0], index) and (
                index == 0 or line[index - 1].isspace() or line[index - 1] in BLOCK_OPENER_AFTER):
            close = line.find(block[1], index + len(block[0]))
            if close < 0:
                segments.append(line[index:])
                state.open = ("block",)
                return segments
            segments.append(line[index:close + len(block[1])])
            index = close + len(block[1])
            continue
        if _line_comment_at(line, index, family):
            segments.append(line[index:])
            return segments
        if tracks_statements:
            if char in "([{":
                state.depth += 1
            elif char in ")]}":
                state.depth = max(0, state.depth - 1)
            state.statement += char
        index += 1
    return segments


def _end_logical_line(state):
    """Close the logical line unless a string, a bracket or a backslash continues it."""
    if state.open is not None or state.depth > 0 or state.statement.rstrip().endswith("\\"):
        state.statement += " "
        return
    if state.statement.strip():
        state.last_statement = state.statement.strip()
    state.statement = ""


def yaml_block_base(line):
    """Return the column a block scalar's text must be deeper than, or None.

    That is the key's column, or the dash's for a bare list item, because YAML nests
    the mapping of a list item at its key rather than at the dash.
    """
    match = YAML_BLOCK_SCALAR.match(line)
    if not match:
        return None
    if match.group("key") is not None:
        return match.start("key")
    dashes = match.group("dashes")
    if not dashes:
        return None
    return match.start("dashes") + dashes.rstrip().rfind("-")


def comment_text(raw_line, family, state):
    """Return the comment text of one line, updating state in place.

    After a YAML block scalar opens, each following line that is blank or indented
    deeper than state.scalar_base is text, and the first other line ends it.
    """
    line = raw_line.rstrip("\n")
    if state.scalar_base is not None:
        if not line.strip() or len(line) - len(line.lstrip(" ")) > state.scalar_base:
            return ""
        state.scalar_base = None
    stripped = raw_line.strip()
    was_open = state.open is not None
    segments = scan_line(line, family, state)
    if family["docstrings"]:
        _end_logical_line(state)
    if family["block_scalars"] and state.open is None:
        state.scalar_base = yaml_block_base(line.rstrip())
    # A star at the start of a line outside any tracked comment is read as the body of
    # a block comment, as the original JavaScript checker did.
    if family["leading_star"] and not was_open and stripped.startswith("*"):
        return stripped
    return " ".join(segment.strip() for segment in segments if segment.strip())


# ─────────────────────────────────────────────────────────────────
# 3. FILE CHECK
# ─────────────────────────────────────────────────────────────────

def language_for(filepath, table, extra_extensions):
    """Pick the language from a shebang that names one, then from the extension.

    Returns (language, family name). Only the first line is read for the shebang.
    """
    with open(filepath, "rb") as handle:
        head = handle.read(SHEBANG_READ_BYTES)
    first_line = head.split(b"\n", 1)[0].decode("utf-8", errors="replace")
    interpreter = interpreter_from_shebang(first_line)
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


def check_file(filepath, table, patterns, extra_extensions):
    """Check one file and return its result record."""
    record = {"file": filepath, "status": "clean", "language": None, "findings": []}
    abs_path = os.path.abspath(filepath)
    if any(excl in abs_path for excl in EXCLUDED_DIRS):
        record.update(status="skipped", reason="excluded directory")
        return record
    if os.path.basename(filepath).endswith(".vitest.js"):
        record.update(status="skipped", reason="excluded test bundle")
        return record
    if os.path.isdir(filepath):
        record.update(status="skipped", reason="directory")
        return record

    try:
        language, family_name = language_for(filepath, table, extra_extensions)
        if language is None:
            record.update(status="skipped", reason="unknown language")
            return record
        with open(filepath, "r", encoding="utf-8", errors="replace") as handle:
            lines = handle.readlines()
    except OSError as error:
        # The shebang sniff opens every file, so a file the extension alone would have
        # skipped stays skipped when it cannot be opened.
        ext = os.path.splitext(os.path.basename(filepath))[1].lower()
        if ext not in extra_extensions and ext not in table["by_extension"]:
            record.update(status="skipped", reason="unreadable, unknown language")
            return record
        print(f"ERROR: cannot read {filepath}: {error}", file=sys.stderr)
        record.update(status="unreadable", error=str(error))
        return record

    record["language"] = language
    family = table["families"][family_name]
    state = ScanState()
    for lineno, raw_line in enumerate(lines, start=1):
        text = comment_text(raw_line, family, state)
        if not text or "hygiene-ok" in text:
            continue
        text = URL_SPAN.sub("", text)
        for allowed in ALLOWED_PATTERNS:
            text = allowed.sub(" ", text)
        for rule, pattern, reason in patterns:
            if pattern.search(text):
                record["findings"].append({
                    "line": lineno,
                    "rule": rule,
                    "reason": reason,
                    "excerpt": raw_line.rstrip(),
                })
                break
    if record["findings"]:
        record["status"] = "violation"
    return record


# ─────────────────────────────────────────────────────────────────
# 4. ENTRY POINT
# ─────────────────────────────────────────────────────────────────

def parse_args(argv, families):
    options = {"json": False, "patterns": [], "extensions": {}, "files": []}
    index = 0
    while index < len(argv):
        arg = argv[index]
        if arg == "--":
            options["files"].extend(argv[index + 1:])
            break
        if arg == "--json":
            options["json"] = True
        elif arg in ("--ticket-prefix", "--extension", "--extra-pattern"):
            if index + 1 >= len(argv) or not argv[index + 1]:
                raise UsageError(f"{arg} needs a value")
            value = argv[index + 1]
            index += 1
            if arg == "--ticket-prefix":
                pattern = re.compile(r"\b" + re.escape(value) + r"-[0-9][0-9A-Za-z]*\b")
                options["patterns"].append(("ticket-prefix", pattern, "issue or ticket reference"))
            elif arg == "--extension":
                ext, _, family = value.partition("=")
                if not ext or family not in families:
                    raise UsageError(f"--extension needs EXT=FAMILY with a family from the table: {value}")
                options["extensions"][("." + ext.lstrip(".")).lower()] = family
            else:
                try:
                    pattern = re.compile(value)
                except re.error as error:
                    raise UsageError(f"--extra-pattern is not a valid regular expression: {error}")
                options["patterns"].append(("extra-pattern", pattern, "repository pattern"))
        elif arg.startswith("--"):
            raise UsageError(f"unknown option {arg}")
        else:
            options["files"].append(arg)
        index += 1
    if not options["files"]:
        raise UsageError("no input files")
    return options


def exit_code_for(records):
    statuses = {record["status"] for record in records}
    if "violation" in statuses:
        return 1
    if "unreadable" in statuses:
        return 3
    return 0 if "clean" in statuses else 2


def main(argv):
    try:
        table = load_table(TABLE_PATH)
    except (OSError, ValueError) as error:
        print(f"ERROR: cannot load the comment family table {TABLE_PATH}: {error}", file=sys.stderr)
        return 3
    try:
        options = parse_args(argv, table["families"])
    except UsageError as error:
        print(f"ERROR: {error}", file=sys.stderr)
        print(USAGE, file=sys.stderr)
        return 3

    patterns = VIOLATION_PATTERNS + options["patterns"]
    records = [check_file(path, table, patterns, options["extensions"]) for path in options["files"]]
    code = exit_code_for(records)
    if options["json"]:
        print(json.dumps({"schema": SCHEMA, "exit_code": code, "files": records}, indent=2))
    else:
        for record in records:
            for finding in record["findings"]:
                print(f"{record['file']}:{finding['line']}: {finding['excerpt']} [{finding['reason']}]")
    return code


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
