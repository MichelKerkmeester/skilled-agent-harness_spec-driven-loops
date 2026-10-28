#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: COMMENT HYGIENE CONSTRUCTS
# ───────────────────────────────────────────────────────────────

"""Find where a construct inside one source line opens and where it ends.

Usage: imported by `scanner.py`
Output: end indexes, depths and column bases for strings, regex literals, arithmetic,
heredoc bodies, Rust char literals and YAML block scalars
"""

from __future__ import annotations

# ───────────────────────────────────────────────────────────────
# 1. IMPORTS
# ───────────────────────────────────────────────────────────────

import re
from typing import Any, Dict, List, Optional, Tuple


# ───────────────────────────────────────────────────────────────
# 2. CONSTANTS
# ───────────────────────────────────────────────────────────────

# A slash opens a regex literal when the last token before it can end no expression: an
# operator or an opener, one of these words, or nothing at all. A name, a number and a closer
# all end an expression, so a slash after one of them divides.
REGEX_OPENER_PUNCTUATION = set("(,=:[!&|?{};+-*%<>~^")
REGEX_OPENER_WORDS = {"return", "typeof", "instanceof", "in", "of", "new", "delete", "void", "throw",
                      "case", "do", "else", "yield", "await"}
# A slash after the ) that closes one of these headers stands where code starts again, so it
# opens a regex literal rather than dividing.
REGEX_HEADER_WORDS = {"if", "while", "for"}
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


# ───────────────────────────────────────────────────────────────
# 3. STRINGS
# ───────────────────────────────────────────────────────────────

def _skip_string(line: str, start: int, quote: str, family: Dict[str, Any]) -> int:
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


# ───────────────────────────────────────────────────────────────
# 4. REGEX LITERALS
# ───────────────────────────────────────────────────────────────

def _header_word(line: str, close_index: int) -> str:
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


def _skip_space_back(line: str, position: int) -> int:
    """Return the index of the last character that is not a space at or before position."""
    while position >= 0 and line[position].isspace():
        position -= 1
    return position


def _expression_end_before(line: str, index: int, block: Optional[List[str]]) -> int:
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


def _regex_opens(line: str, index: int, block: Optional[List[str]]) -> bool:
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


def _skip_regex(line: str, start: int) -> int:
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


# ───────────────────────────────────────────────────────────────
# 5. ARITHMETIC
# ───────────────────────────────────────────────────────────────

def _arithmetic_scan(line: str, index: int, depth: int, family: Dict[str, Any]) -> Tuple[int, int]:
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


# ───────────────────────────────────────────────────────────────
# 6. HEREDOCS AND BLOCK SCALARS
# ───────────────────────────────────────────────────────────────

def _yaml_block_base(line: str) -> Optional[int]:
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


def _heredoc_closes(line: str, word: str, strip_tabs: bool) -> bool:
    """Say whether this line is the closing line of a heredoc body.

    That line holds only the word, after leading tabs when the opener was `<<-`.
    """
    return (line.lstrip("\t") if strip_tabs else line) == word
