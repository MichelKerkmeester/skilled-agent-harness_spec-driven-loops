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
even when the construct runs past the line end.

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
# A string statement is comment text wherever it stands, because an expression statement's
# value is discarded and only a person reads it. Nothing but a prefix may open its logical
# line, and a prefix that holds f makes the string data, because Python evaluates an
# f-string as an expression.
DOCSTRING_PREFIXES = {"", "r", "u", "b", "rb", "br"}
# A single-line literal leaves this marker in the unfinished logical line, so the code
# beside it decides whether the line continues: a backslash after the marker still
# continues the line, and a line that ends with one ends. The literal's own text never
# decides either, because a string is never code.
LITERAL_MARKER = "0"
BLOCK_OPENER_AFTER = "([{,;=:)]}"
# A slash opens a regex literal when the last token before it can end no expression: an
# operator or an opener, one of these words, or nothing at all. A name, a number and a closer
# all end an expression, so a slash after one of them divides.
REGEX_OPENER_PUNCTUATION = set("(,=:[!&|?{};+-*%<>~^")
REGEX_OPENER_WORDS = {"return", "typeof", "instanceof", "in", "of", "new", "delete", "void", "throw",
                      "case", "do", "else", "yield", "await"}
# A slash after the ) that closes one of these headers stands where code starts again, so it
# opens a regex literal rather than dividing.
REGEX_HEADER_WORDS = {"if", "while", "for"}
# A template literal's text ends at an interpolation, whose code is code, so the checker reads
# the ${ of one as a second way out of the text beside the closing backtick.
TEMPLATE_DELIMITER = "`"
INTERPOLATION_OPENER = "${"
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
# A heredoc opener queues its word, and the body that follows is text. The word is bare or
# quoted, and `<<-` strips leading tabs from the closing line. The operator never touches
# another `<`, so a here-string opens nothing, and an arithmetic expansion is skipped
# before this pattern runs, so a shift opens nothing either.
HEREDOC_OPENER = re.compile(
    r"<<(?P<dash>-?)[ \t]*(?:'(?P<single>[^'\n]+)'"
    r"|\"(?P<double>[^\"\n]+)\"|(?P<bare>[A-Za-z_][A-Za-z0-9_-]*))"
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

    contexts holds the constructs that run past the end of a line, the innermost last. A
    frame is ("block",) inside a block comment, ("string", closer, is_comment, templated)
    inside a string that spans lines, ("code", depth) inside a template literal's
    interpolation, whose brace depth counts from 1, or ("arith", depth) inside an arithmetic
    construct, whose paren depth does. scalar_base is the column a YAML block scalar's text
    must be deeper than, and heredocs holds the words of the bodies still open. The rest
    serve the families that read string statements: the open bracket depth, the code of the
    unfinished logical line, what that line holds so far, and the text of its literals,
    which stays here until the logical line ends.
    """

    def __init__(self):
        self.contexts = []
        self.scalar_base = None
        self.heredocs = []
        self.depth = 0
        self.statement = ""
        self.line_kind = "blank"
        self.string_text = []

    @property
    def open(self):
        """The construct this line continues, or None at code scope."""
        return self.contexts[-1] if self.contexts else None

    def enter(self, context):
        """Open a construct that runs past the end of this line."""
        self.contexts.append(context)

    def leave(self):
        """Close the innermost open construct."""
        self.contexts.pop()

    def set_depth(self, depth):
        """Replace the depth of the innermost frame that counts one."""
        self.contexts[-1] = (self.contexts[-1][0], depth)


def _opens_bare_string(state):
    """Say whether the string opening now starts a bare string statement.

    A string statement opens a logical line at bracket depth 0 with nothing before it but a
    prefix, so an assignment, a return, a call and a dict entry all leave their string data.
    """
    return (state.depth == 0 and state.line_kind in ("blank", "prefix")
            and state.statement.strip().lower() in DOCSTRING_PREFIXES)


def _note_literal(state, text):
    """Record one string literal that a bare string statement may gather.

    A literal joins the statement when nothing but literals or a prefix came before it on
    its logical line, and any other code makes it data.
    """
    if _opens_bare_string(state) or (state.line_kind == "strings" and state.depth == 0):
        state.string_text.append(text)
        state.line_kind = "strings"
        return
    state.line_kind = "code"


def _note_code(state, char):
    """Take one code character into the logical line.

    Whitespace, a string prefix and the backslash that continues the line are all that
    may sit before a bare string statement, so any other character says the literals on
    this line are data.
    """
    if char.isspace() or char == "\\" or state.line_kind == "code":
        return
    state.line_kind = "prefix" if char in "rRuUbB" else "code"


def _find_closer(line, start, closer, escapes, opener=None):
    """Return the index where the string's text ends, or -1 when it runs past this line.

    A backslash before a candidate escapes it only in the families whose language reads
    escapes in a string that spans lines, so a Go raw string ends at its first backtick. An
    opener ends the text too, a template literal's interpolation, and the caller tells the
    two apart by reading the token at the index returned. Whichever comes first ends the
    text, and reading on past an escaped candidate leaves it as text.
    """
    index = start
    while True:
        close = line.find(closer, index)
        if opener:
            opened = line.find(opener, index)
            if 0 <= opened and (close < 0 or opened < close):
                close = opened
        if close < 0 or not escapes:
            return close
        backslashes = 0
        position = close - 1
        while position >= 0 and line[position] == "\\":
            backslashes += 1
            position -= 1
        if backslashes % 2 == 0:
            return close
        index = close + 1


def _header_word(line, close_index):
    """Return the word before the ( that matches the ) at close_index, or "".

    Only the ) that closes a header lets code start again, so the word in front of the
    matching ( decides. A word that follows a dot names a method on its receiver, so a call
    ends an expression like any other. A pair that does not close on this line, or a bracket
    that has no opener here, names no header and leaves the slash a division.
    """
    depth = 0
    position = close_index
    while position >= 0:
        char = line[position]
        if char == ")":
            depth += 1
        elif char == "(":
            depth -= 1
            if depth == 0:
                break
        position -= 1
    if position < 0:
        return ""
    position -= 1
    while position >= 0 and line[position].isspace():
        position -= 1
    end = position + 1
    while position >= 0 and (line[position].isalnum() or line[position] in "_$"):
        position -= 1
    if position >= 0 and line[position] == ".":
        return ""
    return line[position + 1:end]


def _skip_space_back(line, position):
    """Return the index of the last character that is not a space at or before position."""
    while position >= 0 and line[position].isspace():
        position -= 1
    return position


def _expression_end_before(line, index, block):
    """Return the index of the token that ends just before index, or -1 at statement start.

    A block comment is not code, so a comment between a token and the slash leaves the token
    in front of the comment's opener to decide. A closer that matches no opener here is an
    operator, so the star that ends a regex literal still divides.
    """
    closer_length = len(block[1]) if block else 1
    position = _skip_space_back(line, index - 1)
    while block and position >= closer_length - 1:
        closer = position - closer_length + 1
        if not line.startswith(block[1], closer):
            break
        opened = line.rfind(block[0], 0, closer)
        if opened < 0:
            break
        position = _skip_space_back(line, opened - 1)
    return position


def _regex_opens(line, index, block):
    """Say whether the slash at index opens a regex literal rather than a division.

    A slash opens a literal when the last token before it can end no expression: nothing at
    the start of the line, an operator or an opener, a word such as return, or the ) that
    closes an if, while or for header. A name, a number, a closer, a property name after a
    dot and a postfix increment or decrement all end an expression, so a slash after one of
    them divides. A closed block comment changes none of that, because a comment is no code.
    """
    position = _expression_end_before(line, index, block)
    if position < 0:
        return True
    if position and line[position] in "+-" and line[position - 1] == line[position]:
        return False
    if line[position] in REGEX_OPENER_PUNCTUATION:
        return True
    if line[position] == ")":
        return _header_word(line, position) in REGEX_HEADER_WORDS
    end = position + 1
    while position >= 0 and (line[position].isalnum() or line[position] in "_$"):
        position -= 1
    # A word after a dot names a property, and an expression that ends there divides.
    if position >= 0 and line[position] == ".":
        return False
    return line[position + 1:end] in REGEX_OPENER_WORDS


def _skip_regex(line, start):
    """Return the index just past the regex literal that opens at start, or -1 when it never ends.

    A backslash escapes the next character, a bracketed class runs to its unescaped close, and
    the literal ends at the next unescaped slash outside a class. The flags after it and a
    division that follows stay code, and a literal that reaches the line end was no literal.
    """
    index = start + 1
    in_class = False
    while index < len(line):
        char = line[index]
        if char == "\\":
            index += 2
            continue
        if char == "[":
            in_class = True
        elif char == "]":
            in_class = False
        elif char == "/" and not in_class:
            return index + 1
        index += 1
    return -1


def _arithmetic_scan(line, index, depth, family):
    """Return the index just past the )) that closes an arithmetic construct, and its depth.

    The close is the first )) that stands at the depth the construct opened at, because an
    inner pair brings a )) of its own: in the expansion that holds (a*(b+c)) beside a shift,
    the pair around c returns only to the depth the shift sits at. A quoted span and an
    escaped character are text, so neither hides the close. A scan that reaches the line end
    returns -1, and the depth it reached carries into the next line, so a construct that runs
    past the line end is still arithmetic there.
    """
    while index < len(line):
        char = line[index]
        if char == "\\":
            index += 2
            continue
        if char in "'\"":
            index = _skip_string(line, index, char, family)
            continue
        if char == "(":
            depth += 1
        elif char == ")" and depth:
            depth -= 1
        elif char == ")" and line.startswith("))", index):
            return index + 2, depth
        index += 1
    return -1, depth


def _skip_arithmetic(line, index, family, state):
    """Return the index just past the arithmetic construct at index, or None.

    An expansion or a command from $(( or (( runs to the )) that closes it, and let takes
    arithmetic arguments up to the separator or the comment that ends the command. A <<
    inside either is a shift, so neither opens a heredoc. A construct that runs past the line
    end leaves its frame open, so the lines that follow are arithmetic until it closes.
    """
    if line.startswith("$((", index) or line.startswith("((", index):
        opened = index + (3 if line.startswith("$((", index) else 2)
        close, depth = _arithmetic_scan(line, opened, 0, family)
        if close < 0:
            state.enter(("arith", depth))
            return len(line)
        return close
    if not line.startswith("let", index):
        return None
    if index and not (line[index - 1].isspace() or line[index - 1] in ";|&({"):
        return None
    end = index + 3
    if end < len(line) and not (line[end].isspace() or line[end] in ";|&)"):
        return None
    while end < len(line):
        char = line[end]
        if char in "\"'":
            end = _skip_string(line, end, char, family)
            continue
        if char == "\\":
            end += 2
            continue
        if char in ";|&`":
            return end
        if char == "#" and (line[end - 1].isspace() or line[end - 1] in ";|&("):
            return end
        end += 1
    return end


def scan_line(line, family, state):
    """Split one line into comment segments, updating state in place.

    Text counts as comment text only inside a string that opens a bare string statement, so
    the body of any other string that spans lines is skipped. A template literal's
    interpolation holds code, which is read as code is, so a comment in one is comment text.
    """
    segments = []
    index = 0
    block = family["block"]
    tracks_statements = family["docstrings"]
    while index < len(line):
        context = state.open
        # A block comment and a string that spans lines take the text up to where each ends,
        # while an interpolation holds code, which the tail of this loop reads as code.
        if context is not None and context[0] != "code":
            if context[0] == "arith":
                # Arithmetic that ran past the line end is still arithmetic, so a shift here
                # opens no heredoc and the scan resumes after the )) that closes it.
                close, depth = _arithmetic_scan(line, index, context[1], family)
                if close < 0:
                    state.set_depth(depth)
                    return segments
                state.leave()
                index = close
                continue
            if context[0] == "block":
                close = line.find(block[1], index)
                if close < 0:
                    segments.append(line[index:])
                    return segments
                segments.append(line[index:close + len(block[1])])
                index = close + len(block[1])
                state.leave()
                continue
            _, closer, is_comment, templated = context
            close = _find_closer(line, index, closer, family["multiline_escapes"],
                                 INTERPOLATION_OPENER if templated else None)
            if close < 0:
                if is_comment:
                    segments.append(line[index:])
                return segments
            if is_comment:
                segments.append(line[index:close])
            if templated and line.startswith(INTERPOLATION_OPENER, close):
                # The interpolation's code runs at brace depth 1 until the brace that closes
                # it, and a template literal nested in that code opens and closes inside it.
                state.enter(("code", 1))
                index = close + len(INTERPOLATION_OPENER)
                continue
            index = close + len(closer)
            state.leave()
            continue

        char = line[index]
        # A triple quote or a backtick opens a string that spans lines, and its body holds data
        # unless it opens a bare string statement.
        token = next((t for t in family["multiline"] if line.startswith(t, index)), None)
        if token:
            is_comment = tracks_statements and _opens_bare_string(state)
            if tracks_statements:
                state.line_kind = "strings" if is_comment else "code"
            templated = family["template_interpolation"] and token == TEMPLATE_DELIMITER
            state.enter(("string", token, is_comment, templated))
            index += len(token)
            continue
        if family["char_literals"] and char == "'":
            literal = CHAR_LITERAL.match(line, index)
            index = literal.end() if literal else index + 1
            continue
        if char in family["quotes"]:
            end = _skip_string(line, index, char, family)
            if tracks_statements:
                text = line[index + 1:end]
                _note_literal(state, text[:-1] if text.endswith(char) else text)
                state.statement += LITERAL_MARKER
            index = end
            continue
        # A shell arithmetic construct reads << as a shift, so no heredoc opens in one, and
        # the arguments of let are arithmetic too. The scan resumes after the construct, or
        # after the separator that ends the let, so a comment after one is still checked.
        if family["heredocs"]:
            arithmetic = _skip_arithmetic(line, index, family, state)
            if arithmetic is not None:
                index = arithmetic
                continue
        # A heredoc body holds text, and its opener queues the word on this line, so a
        # comment after the opener is still checked. A here-string opens nothing.
        if family["heredocs"] and line.startswith("<<", index):
            if (index == 0 or line[index - 1] != "<") and not line.startswith("<<<", index):
                opener = HEREDOC_OPENER.match(line, index)
                if opener:
                    word = opener.group("single") or opener.group("double") or opener.group("bare")
                    state.heredocs.append((word, opener.group("dash") == "-"))
                    index = opener.end()
                    continue
        # An opener counts only at the start of a line, after whitespace or after
        # punctuation that can end code, so a glob such as src/** in prose or an
        # escaped slash in a regex literal never opens a block comment.
        if block and line.startswith(block[0], index) and (
                index == 0 or line[index - 1].isspace() or line[index - 1] in BLOCK_OPENER_AFTER):
            close = line.find(block[1], index + len(block[0]))
            if close < 0:
                segments.append(line[index:])
                state.enter(("block",))
                return segments
            segments.append(line[index:close + len(block[1])])
            index = close + len(block[1])
            continue
        if _line_comment_at(line, index, family):
            segments.append(line[index:])
            return segments
        # A slash that opens a regex literal is skipped as one, so the quotes and the
        # backticks inside it open nothing. A division stays code, and so does a slash whose
        # literal would reach the line end.
        if family["regex_literals"] and char == "/" and _regex_opens(line, index, block):
            end = _skip_regex(line, index)
            if end > 0:
                if tracks_statements:
                    state.statement += line[index:end]
                    _note_code(state, char)
                index = end
                continue
        # An interpolation's code ends at the brace that closes it, and a pair inside that
        # code nests, so the frame carries the depth from one line to the next.
        if context is not None:
            if char in "{}":
                depth = context[1] + (1 if char == "{" else -1)
                if depth:
                    state.set_depth(depth)
                else:
                    state.leave()
            index += 1
            continue
        if tracks_statements:
            if char in "([{":
                state.depth += 1
            elif char in ")]}":
                state.depth = max(0, state.depth - 1)
            state.statement += char
            _note_code(state, char)
        index += 1
    return segments


def _end_logical_line(state):
    """Close the logical line unless a string, a bracket or a backslash continues it.

    A logical line that ends with nothing but string literals holds a bare string statement,
    so the text its literals gathered is comment text, returned here to be reported.
    """
    if state.open is not None or state.depth > 0 or state.statement.rstrip().endswith("\\"):
        state.statement += " "
        return []
    text = state.string_text if state.line_kind in ("prefix", "strings") else []
    state.statement = ""
    state.line_kind = "blank"
    state.string_text = []
    return text


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


def _heredoc_closes(line, word, strip_tabs):
    """Say whether this line is the closing line of a heredoc body.

    That line holds only the word, after leading tabs when the opener was `<<-`.
    """
    return (line.lstrip("\t") if strip_tabs else line) == word


def comment_text(raw_line, family, state):
    """Return the comment text of one line, updating state in place.

    A line inside a heredoc body is text, so it holds no comment, and the first body that
    is still open decides whether this line closes it. After a YAML block scalar opens,
    each following line that is blank or indented deeper than state.scalar_base is text,
    and the first other line ends it.
    """
    line = raw_line.rstrip("\n")
    if state.heredocs:
        word, strip_tabs = state.heredocs[0]
        if _heredoc_closes(line, word, strip_tabs):
            state.heredocs.pop(0)
        return ""
    if state.scalar_base is not None:
        if not line.strip() or len(line) - len(line.lstrip(" ")) > state.scalar_base:
            return ""
        state.scalar_base = None
    stripped = raw_line.strip()
    was_open = state.open is not None
    segments = scan_line(line, family, state)
    if family["docstrings"]:
        segments += _end_logical_line(state)
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
