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
  --disable-rule ID         stop applying the core rule ID, written bare (task) or with its
                            class (hygiene.task). An id the shared rule-override contract
                            fixes, or one that names no core rule, is a usage error

A file's language comes from a shebang that names a known interpreter, and from its
extension otherwise. The comment families, extensions and interpreters live in
../assets/comment-syntax.json, which is read from this script's real path.

Three rules decide what counts as comment text beyond a plain comment. A string that spans lines is
a string, and a backslash before the closing backtick keeps a template literal open. A shell
heredoc body is text until the line that holds only its word, after leading tabs when the opener
was <<-. A quoted string that opens a logical line at bracket depth 0 is comment text wherever it
stands, because nothing reads its value, unless its prefix holds f. In a family that sets
regexLiterals, a slash that follows an operator or a keyword opens a regex literal, a block
comment between the two leaves the token in front of its opener to decide, and the body of that
literal is skipped whole, so a quote or a backtick inside one opens nothing. In a family
that sets templateInterpolation, the text of a template literal ends where an unescaped ${ opens
an interpolation, whose code runs to the brace that closes it, so a template literal nested inside
one opens and closes on its own, and a comment inside an interpolation is comment text. A shell
arithmetic construct runs on to the )) that closes it, so a shift inside one opens no heredoc
even if the construct runs past the line end.

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
import os
import re
import sys
from typing import List

# ───────────────────────────────────────────────────────────────
# 1. MODULE PATH
# ───────────────────────────────────────────────────────────────

# The modules live in lib/ beside this file and no step installs them, so they are found
# from this file's own real path. A checker copied without that folder fails closed below.
MODULE_DIR = os.path.join(os.path.dirname(os.path.realpath(__file__)), "lib")
sys.path.insert(0, MODULE_DIR)
# Callers run this checker inside skill folders, so importing its modules must leave no
# cache folder behind.
sys.dont_write_bytecode = True

# ───────────────────────────────────────────────────────────────
# 2. RULE REGISTRY
# ───────────────────────────────────────────────────────────────

# --- Violation patterns ---
# Each is (rule id, pattern, reason). The first match on a line is its one finding.
# F-notation is intentionally excluded: repo comments use it heavily for function keys,
# figures, and field references, so genuine finding labels stay review-owned.
# The slash rule needs a zero-padded second number, because packet children are
# zero-padded and a ratio or a measurement is not.
# The table is read out of this file's text by the quality runner and by two shared suites,
# which is why it stays here and is handed to the modules that match with it.
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

# ───────────────────────────────────────────────────────────────
# 3. IMPORTS
# ───────────────────────────────────────────────────────────────

try:
    from comment_hygiene.checker import EXCLUDED_DIRS, _check_file
    from comment_hygiene.cli import (
        CONTRACT_PATH,
        SCHEMA,
        TABLE_PATH,
        USAGE,
        _exit_code_for,
        _parse_args,
        main as _cli_main,
    )
    from comment_hygiene.constructs import (
        CHAR_LITERAL,
        HEREDOC_OPENER,
        REGEX_HEADER_WORDS,
        REGEX_OPENER_PUNCTUATION,
        REGEX_OPENER_WORDS,
        YAML_BLOCK_SCALAR,
        _arithmetic_scan,
        _expression_end_before,
        _header_word,
        _heredoc_closes,
        _regex_opens,
        _skip_regex,
        _skip_space_back,
        _skip_string,
        _yaml_block_base,
    )
    from comment_hygiene.families import (
        SHEBANG_READ_BYTES,
        _interpreter_from_shebang,
        _string_list,
        language_for,
        load_table,
    )
    from comment_hygiene.rules import (
        ALLOWED_PATTERNS,
        RULE_CLASS,
        URL_SPAN,
        _UsageError,
        _disabled_rule,
        _load_fixed_ids,
    )
    from comment_hygiene.scanner import (
        BLOCK_OPENER_AFTER,
        DOCSTRING_PREFIXES,
        INTERPOLATION_OPENER,
        LITERAL_MARKER,
        TEMPLATE_DELIMITER,
        ScanState,
        _end_logical_line,
        _find_closer,
        _line_comment_at,
        _note_code,
        _note_literal,
        _opens_bare_string,
        _scan_line,
        _skip_arithmetic,
        comment_text,
    )
except ImportError as error:
    print(f"ERROR: cannot load the comment family table: the checker modules that read it "
          f"did not import from {MODULE_DIR} ({error})", file=sys.stderr)
    sys.exit(3)

# ───────────────────────────────────────────────────────────────
# 4. MAIN
# ───────────────────────────────────────────────────────────────

def main(argv: List[str]) -> int:
    """Check every input file and return the exit code the run ends with."""
    return _cli_main(argv, VIOLATION_PATTERNS)


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
