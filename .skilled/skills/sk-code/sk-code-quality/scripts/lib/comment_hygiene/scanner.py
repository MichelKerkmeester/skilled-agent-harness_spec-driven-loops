#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: COMMENT HYGIENE SCANNER
# ───────────────────────────────────────────────────────────────

"""Split one source line into comment text, carrying what spans lines.

Usage: imported by `checker.py`
Output: `comment_text()`, the comment text of one line, and the `ScanState` that carries a
block comment, a string, an interpolation, an arithmetic construct or a heredoc across lines
"""

from __future__ import annotations

# ───────────────────────────────────────────────────────────────
# 1. IMPORTS
# ───────────────────────────────────────────────────────────────

from typing import Any, Dict, List, Optional, Tuple

from .constructs import (
    CHAR_LITERAL,
    HEREDOC_OPENER,
    _arithmetic_scan,
    _heredoc_closes,
    _regex_opens,
    _skip_regex,
    _skip_string,
    _yaml_block_base,
)


# ───────────────────────────────────────────────────────────────
# 2. CONSTANTS
# ───────────────────────────────────────────────────────────────

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
# A template literal's text ends at an interpolation, whose code is code, so the checker reads
# the ${ of one as a second way out of the text beside the closing backtick.
TEMPLATE_DELIMITER = "`"
INTERPOLATION_OPENER = "${"


# ───────────────────────────────────────────────────────────────
# 3. SCAN STATE
# ───────────────────────────────────────────────────────────────

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

    def __init__(self) -> None:
        self.contexts = []
        self.scalar_base = None
        self.heredocs = []
        self.depth = 0
        self.statement = ""
        self.line_kind = "blank"
        self.string_text = []

    @property
    def open(self) -> Optional[Tuple[Any, ...]]:
        """The construct this line continues, or None at code scope."""
        return self.contexts[-1] if self.contexts else None

    def enter(self, context: Tuple[Any, ...]) -> None:
        """Open a construct that runs past the end of this line."""
        self.contexts.append(context)

    def leave(self) -> None:
        """Close the innermost open construct."""
        self.contexts.pop()

    def set_depth(self, depth: int) -> None:
        """Replace the depth of the innermost frame that counts one."""
        self.contexts[-1] = (self.contexts[-1][0], depth)


# ───────────────────────────────────────────────────────────────
# 4. LOGICAL LINE
# ───────────────────────────────────────────────────────────────

def _opens_bare_string(state: ScanState) -> bool:
    """Say whether the string opening now starts a bare string statement.

    A string statement opens a logical line at bracket depth 0 with nothing before it but a
    prefix, so an assignment, a return, a call and a dict entry all leave their string data.
    """
    return (state.depth == 0 and state.line_kind in ("blank", "prefix")
            and state.statement.strip().lower() in DOCSTRING_PREFIXES)


def _note_literal(state: ScanState, text: str) -> None:
    """Record one string literal that a bare string statement may gather.

    A literal joins the statement when nothing but literals or a prefix came before it on
    its logical line, and any other code makes it data.
    """
    if _opens_bare_string(state) or (state.line_kind == "strings" and state.depth == 0):
        state.string_text.append(text)
        state.line_kind = "strings"
        return
    state.line_kind = "code"


def _note_code(state: ScanState, char: str) -> None:
    """Take one code character into the logical line.

    Whitespace, a string prefix and the backslash that continues the line are all that
    may sit before a bare string statement, so any other character says the literals on
    this line are data.
    """
    if char.isspace() or char == "\\" or state.line_kind == "code":
        return
    state.line_kind = "prefix" if char in "rRuUbB" else "code"


def _end_logical_line(state: ScanState) -> List[str]:
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


# ───────────────────────────────────────────────────────────────
# 5. LINE SCANNING
# ───────────────────────────────────────────────────────────────

def _find_closer(line: str, start: int, closer: str, escapes: bool, opener: Optional[str] = None) -> int:
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


def _line_comment_at(line: str, index: int, family: Dict[str, Any]) -> bool:
    for token in family["line"]:
        if line.startswith(token, index):
            if family["after_space"] and index > 0 and not line[index - 1].isspace():
                return False
            return True
    return False


def _skip_arithmetic(line: str, index: int, family: Dict[str, Any], state: ScanState) -> Optional[int]:
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


def _scan_line(line: str, family: Dict[str, Any], state: ScanState) -> List[str]:
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


# ───────────────────────────────────────────────────────────────
# 6. COMMENT TEXT
# ───────────────────────────────────────────────────────────────

def comment_text(raw_line: str, family: Dict[str, Any], state: ScanState) -> str:
    """Return the comment text of one line, updating state in place.

    Args:
        raw_line: One source line from the file being scanned.
        family: The comment and string rules for the line's language.
        state: Scanner state carried between lines.

    Returns:
        The comment segments joined by spaces, or an empty string.

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
    segments = _scan_line(line, family, state)
    if family["docstrings"]:
        segments += _end_logical_line(state)
    if family["block_scalars"] and state.open is None:
        state.scalar_base = _yaml_block_base(line.rstrip())
    # A star at the start of a line outside any tracked comment is read as the body of
    # a block comment, as the original JavaScript checker did.
    if family["leading_star"] and not was_open and stripped.startswith("*"):
        return stripped
    return " ".join(segment.strip() for segment in segments if segment.strip())
