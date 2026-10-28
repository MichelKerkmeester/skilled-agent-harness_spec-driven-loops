#!/usr/bin/env python3
"""Check local README links, file references, inventories and command paths.

Usage: python3 check_readme_references.py [--self-test] README.md [...]

Path rules for links, fenced commands, inventories and tree entries come from
audit_readmes.py, imported rather than copied, so the two checkers agree on
what a path is. Five kinds of reference are read:

- ``link``: every markdown link target that is not a URL or an anchor.
- ``inline``: a path-shaped token in a code span. A slash command such as
  ``/speckit:plan`` is not a path.
- ``command``: a token in a fenced block that opens with ``./``, ``../``,
  ``.skilled/``, ``.opencode/`` or ``specs/``, read by the audit's rule.
- ``table``: a table cell made only of code spans, each one a file name with a
  known suffix or a slashed path. Such a cell is an inventory, so an entry also
  resolves when the README's folder holds it at any depth.
- ``tree``: an entry on a tree line (``├──``, ``└──``, ``+--``, ``|--`` or
  a backtick followed by ``--``), joined to its parent entries by indentation.
  A tree whose root line names a placeholder such as ``<track>`` is a template.
  A fenced tree whose root names no folder in this checkout reports the root,
  and its entries are not checked.
- ``slash``: a slash command in a code span or a fenced line, read against the
  command tree (``.skilled/commands``). ``/group:name`` names
  ``group/name.md``, and a trailing ``:mode`` must be one the command declares
  in its ``argument-hint`` or ``description``. A command file directly under
  the tree, such as ``vision.md``, has no group, so ``/vision:auto`` names it in
  mode ``auto`` when no ``vision/`` group folder exists. A hyphen form such as
  ``/create-changelog`` is tried as each ``group-name`` split. It fails only
  when it opens a code span and its prefix names a group holding a command it
  nearly spells (``/create-changelg``), so a skill name such as ``/deep-dive``
  or a route on a fenced line such as ``GET /deep-status`` is not read as a
  typo. A single name the tree does
  not hold (a runtime built-in such as ``/goal``), every command in a checkout
  with no command tree, text inside an HTML comment (``<!-- ... -->``) and a
  ``/<placeholder>`` form are not checked.

A code span that labels a working link, as in ``[`guide/intro.md`](../docs/guide/intro.md)``,
is a shortened name for the target and passes when the target's path ends
with it. Any other label is checked as a path, so a stale label in front of a
working link still fails. A ``path/to/...`` stem or a leading bracketed segment
such as ``[spec]/memory/*.md`` is a placeholder, not a reference, outside link
targets. A bracketed segment further in, as in ``app/[id]/page.tsx``, is a real
dynamic-route folder and is checked.

A reference resolves from the README folder, from the nearest folder above it
that holds a ``package.json`` and from the repository root. A code span the
audit reads as a path, an inventory or a tree entry also resolves from each
folder above the README, from ``.skilled/skills/`` and, for a relative code
span, from each folder below the README, where an importing file may sit; a
``.js`` specifier also names its ``.ts`` source. Fences whose info string
contains ``example`` are skipped.

Tokens that only look like paths are not checked: slash commands such as
``/doctor:git``, home paths such as ``~/.zshrc``, absolute paths outside the
repository (``/dev/null``, HTTP routes, ``/path/to/...`` placeholders), file
types such as ``*.ts``, and slashed words without a suffix or trailing slash
(``provider/model`` ids, ``HTTP/UDS``, branch names), ``<placeholder>``
tokens, and quoted shell arguments that contain spaces. A bare name in a code
span, such as ``graph-metadata.json``, that is not beside the README passes
when a file or folder of that name that git tracks or would track, or a
``.tmpl`` template that renders it, exists on disk in the repository (a tracked
file deleted from the working tree no longer counts), and a path that
starts with a skill folder name resolves from that skill. A fenced line drawn
inside a box (``│ ... │``) is diagram prose, so no path on it is checked.

Four narrow classes pass without existing in the checkout, each because the
path is absent by design: a path the repository's ``.gitignore`` excludes
(build output such as ``dist/``), a bare ``name.js`` whose ``name.ts`` source is
tracked, a path a hub README names per mode that every child mode folder (a
subfolder holding ``SKILL.md``) holds, and the per-repository config the doctor
commands create on demand
(``.skilled/skills/sk-code/sk-code-quality/repository/quality.json`` and
``.sk-git/``, exact tokens only). The former root location, ``.sk-code/ci.json``
and ``.sk-code/quality.json``, is named only so a document can describe the
move: the sk-code loaders refuse it. Every README in a run is asked about
git-ignored paths in one batched ``git check-ignore`` call, after one batched
call that finds the READMEs kept inside an ignored folder, where the rule does
not apply. The argument of an output flag (``-o file.txt``) names a file the
command writes, so it is not checked.

Any other known-good reference that cannot exist in the checkout is named in a
README-level marker block. Each entry suppresses that exact token in that README
only, needs a reason, and fails when it matches no unresolved reference, so a
marker cannot outlive its cause::

    <!-- readme-check
    allow-ref worktrees/ | a git branch namespace, not a folder
    allow-count two example files | the next two bullets name both files
    -->

``allow-count`` entries belong to ``check_derived_readme_counts.py``, which
reads the same block.
"""

from __future__ import annotations

import argparse
import dataclasses
import difflib
import fnmatch
import functools
import glob
import os
import re
import shlex
import subprocess
import sys
import tempfile
from dataclasses import dataclass, field
from pathlib import Path
from typing import Iterable

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "shared" / "scripts"))
sys.path.insert(0, str(Path(__file__).resolve().parent))
from validation_switch import exit_if_validation_off  # type: ignore  # noqa: E402
from audit_readmes import (  # type: ignore  # noqa: E402
    ALLOWED_LINK_EXTENSIONS,
    classify_reference_status,
    git_ignored_paths,
    normalize_reference_token,
    resolve_gitignored_references,
    token_looks_like_path,
)


FENCE_PATTERN = re.compile(r"^\s*(`{3,}|~{3,})(.*)$")
LINK_PATTERN = re.compile(r"\[(?P<label>[^\]]*)\]\(\s*(?P<target><[^>]+>|[^\s)]+)")
LINK_SPAN_PATTERN = re.compile(r"!?\[[^\]]*\]\([^)]*\)")
INLINE_PATTERN = re.compile(r"`([^`\n]+)`")
# A cell made only of code spans joined by commas, slashes or "and"/"or".
INVENTORY_CELL_PATTERN = re.compile(r"^(?:`[^`]+`)(?:\s*(?:,|/|\band\b|\bor\b)?\s*`[^`]+`)*$")
TABLE_SEPARATOR_PATTERN = re.compile(r"^\|?\s*:?-{2,}")
TREE_ENTRY_PATTERN = re.compile(r"^(?P<lead>[\s|│]*)(?:├──|└──|\+--|\|--|`--)\s*(?P<name>\S+)")
# Box-drawing characters mark a diagram, whose wrapped labels are not commands.
BOX_PATTERN = re.compile(r"[│┌┐└┘├┤─╭╮╯╰▶]")
TREE_ROOT_PATTERN = re.compile(r"^\s*(?P<name>[\w.@-][\w./@-]*/)\s*(?:#.*)?$")
# A tree whose root names a placeholder (`specs/<track>/`) is a template, not an inventory.
PLACEHOLDER_PATTERN = re.compile(r"[<>{}\[\]]|###")
SUBTREE_SKIP = {".git", "node_modules"}
# Docs name a file inside a skill from the skills folder, as in
# `system-spec-kit/runtime/hooks/lib/...`, so that folder is a base as well.
SKILL_RELATIVE_BASES = (".skilled/skills",)
# A TypeScript ESM import names the compiled `.js` file of a `.ts` source.
SPECIFIER_SOURCE_SUFFIXES = (".ts", ".tsx", ".mts", ".cts")
TRAILING_PUNCTUATION = ".,;:!?)]}>'\""
KNOWN_SUFFIXES = {
    ".bash",
    ".cjs",
    ".css",
    ".json",
    ".js",
    ".mjs",
    ".md",
    ".plist",
    ".py",
    ".sh",
    ".ts",
    ".tsx",
    ".txt",
    ".yml",
    ".yaml",
}
REPOSITORY_ROOT_PREFIXES = (
    ".github/",
    ".skilled/", ".opencode/",
    ".claude/", ".codex/", ".cursor/", ".devin/", ".hermes/", ".pi/",
    "specs/",
    "opencode.json",
    ".utcp_config.json",
    "package.json",
)
ANCHORED_PREFIXES = ("./", "../", "/") + REPOSITORY_ROOT_PREFIXES
SLASH_COMMAND_PATTERN = re.compile(r"/[A-Za-z][\w-]*(?::[\w*-]+)?")
# An absolute path under a user home still fails: it leaks one machine's layout.
MACHINE_PATH_PREFIXES = ("/Users/", "/home/")
_TRACKED_NAMES: dict[Path, tuple[set[str], dict[str, Path], dict[str, list[str]]]] = {}
MARKER_OPEN = re.compile(r"^\s*<!--\s*readme-check\s*$")
MARKER_DIRECTIVES = ("allow-ref", "allow-count")
OUTPUT_FLAGS = {"-o", "--output", "--out"}
# Per-repository config the doctor commands create on demand, so no checkout ships it.
ON_DEMAND_PATHS = {
    ".skilled/skills/sk-code/sk-code-quality/repository/quality.json": "created by /doctor:sk-code quality",
    ".sk-code/ci.json": "the former root location, which the sk-code loaders refuse",
    ".sk-code/quality.json": "the former root location, which the sk-code loaders refuse",
    ".sk-git/": "created by /doctor:git standards",
}
# An extensionless sibling name whose ignored state shows a README's folder is ignored as a whole.
IGNORE_PROBE = "readme-check-probe"
COMMAND_TREE = (".skilled", "commands")
# A command is one segment after the slash: `/group:name` with optional trailing
# `:mode` tokens, or a bare `/name`. A second slash makes it a path.
COMMAND_PATTERN = re.compile(
    r"/(?P<group>[A-Za-z0-9][A-Za-z0-9_-]*)(?::(?P<name>[A-Za-z0-9*][A-Za-z0-9_*-]*))?"
    r"(?P<modes>(?::[A-Za-z][A-Za-z0-9-]*)*)"
)
# A command declares its `:mode` tokens in frontmatter, as in `[:auto|:confirm]`
# or "Modes :auto, :confirm; :with-* modifiers".
DECLARED_MODE_PATTERN = re.compile(r"(?<![A-Za-z0-9]):([A-Za-z][A-Za-z0-9-]*\*?)")
MODE_FRONTMATTER_KEYS = ("argument-hint:", "description:")
# An HTML comment closed on its own line, as in `<!-- /ANCHOR:id -->`, or running to the line end.
HTML_COMMENT_PATTERN = re.compile(r"<!--.*?(?:-->|$)")
# How closely a hyphen form must spell a real command to count as its typo:
# "changelg" against "changelog" scores 0.94, while an unrelated skill name such
# as "dive" against "research" scores far below.
TYPO_SIMILARITY = 0.8
# A whole segment in square brackets, such as `[spec]`, stands for a name the reader fills in.
PLACEHOLDER_SEGMENT_PATTERN = re.compile(r"^\[[A-Za-z][A-Za-z0-9 _-]*\]$")


@dataclass(frozen=True)
class Reference:
    line: int
    raw: str
    kind: str
    example: bool = False
    alternatives: tuple[str, ...] = field(default=())
    # An inventory table names a file by its bare name or a partial path, so it
    # also resolves when the README's folder holds it at any depth.
    subtree: bool = False
    # The whole code span, when it holds more than one word.
    span: str = ""
    # A code-span token the audit does not read as a path, such as a bare file
    # name, resolves by name from the repository rather than from nearby folders.
    named: bool = False
    # The target of the Markdown link whose visible text holds this code span.
    label_of: str = ""
    # A slash command that opens its code span, as an invocation does, rather
    # than a word on a fenced line such as an HTTP route in `GET /deep-status`.
    leading: bool = False


@dataclass(frozen=True)
class Resolution:
    reference: Reference
    resolved: bool
    detail: str


def repository_root(readme: Path) -> Path:
    """Return the checkout root without depending on the caller's CWD."""
    result = subprocess.run(
        ["git", "-c", "core.fsmonitor=false", "-C", str(readme.parent), "rev-parse", "--show-toplevel"],
        check=True,
        capture_output=True,
        text=True,
    )
    return Path(result.stdout.strip()).resolve()


def clean_candidate(value: str) -> str:
    """Normalize a Markdown or shell token while retaining meaningful dots."""
    candidate = value.strip().strip("`<>'\"")
    if "#" in candidate:
        candidate, _fragment = candidate.split("#", 1)
    candidate = candidate.rstrip(TRAILING_PUNCTUATION)
    return candidate


def looks_like_path(value: str) -> bool:
    """Recognize file and directory tokens in a code span without treating prose as paths."""
    if not value or value.startswith(("-", "@", "$", "~")):
        return False
    if "://" in value or value.startswith(("#", "mailto:")):
        return False
    if ":" in value and "/" not in value:
        return False
    if any(character in value for character in "(){}<>\""):
        return False
    if value in {"//", "/", "Node.js", "node:test", ".d.ts"} or value in KNOWN_SUFFIXES:
        return False
    if SLASH_COMMAND_PATTERN.fullmatch(value):
        return False
    if value.startswith("*.") and "/" not in value:
        return False
    if value.startswith(ANCHORED_PREFIXES):
        return True
    if "/" in value and ("*" not in value and "?" not in value):
        return value.endswith("/") or Path(value).suffix.lower() in KNOWN_SUFFIXES
    if ("*" in value or "?" in value) and Path(value).suffix.lower() in KNOWN_SUFFIXES:
        return True
    if Path(value).suffix.lower() in KNOWN_SUFFIXES:
        return True
    return value in {"README.md", "pre-commit", "package.json"}


def token_candidates(value: str) -> Iterable[str]:
    """Yield path-like shell tokens from a code span."""
    value = value.rstrip()
    if value.endswith("\\"):
        value = value[:-1]
    try:
        tokens = shlex.split(value, comments=False, posix=True)
    except ValueError:
        tokens = value.split()
    previous = ""
    for token in tokens:
        stripped = token.strip()
        writes_output, previous = previous in OUTPUT_FLAGS, stripped
        if writes_output:
            continue
        if any(character.isspace() for character in stripped):
            continue
        if stripped.startswith("<") and stripped.rstrip(".,;:!?)]}'\"").endswith(">"):
            continue
        if re.match(r"[A-Za-z_][A-Za-z0-9_]*=", stripped):
            continue
        cleaned = clean_candidate(token)
        if looks_like_path(cleaned):
            yield cleaned


def path_tokens(text: str) -> list[str]:
    """Return the tokens in a code span or command line the audit reads as paths.

    In a span of several words, a quoted word is a literal argument such as
    `--path "../etc/passwd"`, not a reference, and the argument of an output
    flag names a file the command writes.
    """
    words = text.split()
    tokens = []
    previous = ""
    for raw in words:
        writes_output, previous = previous in OUTPUT_FLAGS, raw
        if writes_output:
            continue
        if len(words) > 1 and raw[:1] in "'\"" and raw[-1:] in "'\"":
            continue
        token = normalize_reference_token(raw, "inline_code")
        if token and token_looks_like_path(token, "inline_code"):
            tokens.append(token)
    return tokens


def inventory_token(raw: str) -> str | None:
    """Return a file name or slashed path named in an inventory, or None."""
    token = normalize_reference_token(raw, "inline_code")
    if not token or token.startswith(("-", "/", "@")) or ":" in token:
        return None
    # A slashed name without a file suffix, such as a model id, is a path only
    # when it ends with a slash.
    if token.endswith("/"):
        return token
    return token if Path(token).suffix.lower() in ALLOWED_LINK_EXTENSIONS else None


def table_tokens(line: str) -> list[str]:
    """Return the inventory tokens of a table row's code-span-only cells."""
    stripped = line.strip()
    if not stripped.startswith("|") or TABLE_SEPARATOR_PATTERN.match(stripped):
        return []
    tokens = []
    for cell in stripped.strip("|").split("|"):
        cell = LINK_SPAN_PATTERN.sub("", cell).strip()
        if not cell or not INVENTORY_CELL_PATTERN.match(cell):
            continue
        for span in INLINE_PATTERN.findall(cell):
            # A span with a space is a command line, not an inventory entry.
            if " " in span.strip():
                continue
            token = inventory_token(span)
            if token and not token_looks_like_path(token, "inline_code"):
                tokens.append(token)
    return tokens


class TreeState:
    """Track a tree's root folder and parent entries so each entry gets its full path.

    A tree is checked only against a folder in this checkout. With no root line
    its entries sit in the README folder. A root line such as `lib/` must name a
    folder that exists from the README folder or a folder above it, or be the
    README folder's own name. A root that names no such folder is reported once,
    at its first entry, and its entries are skipped, since failing every entry
    would bury the one stale line. A root or an entry that names a placeholder
    such as `<track>` is a template, and it and the entries below it are skipped.
    """

    def __init__(self, folder: Path | None = None, root: Path | None = None) -> None:
        self.folder = folder
        self.repo_root = root
        self.reset()

    def reset(self) -> None:
        self.label: str | None = None
        self.base: Path | None = self.folder
        self.stack: list[tuple[int, str]] = []
        self.stale_root: tuple[int, str] | None = None

    def _root_folder(self, label: str) -> Path | None:
        if self.folder is None:
            return None
        if label.rstrip("/") == self.folder.name:
            return self.folder
        if PLACEHOLDER_PATTERN.search(label):
            return None
        bases = [self.folder, *self.folder.parents]
        for base in bases:
            candidate = Path(os.path.normpath(base / label))
            if candidate.is_dir():
                return candidate
            if self.repo_root is not None and base == self.repo_root:
                break
        return None

    def entry(self, line: str, line_number: int = 0) -> tuple[str, ...] | None:
        """Return the candidate paths for a tree line, or None when it names nothing to check."""
        stripped = line.strip()
        # A table row such as `|---|---|` opens like an ASCII tree branch.
        match = None if stripped.startswith("|") and stripped.endswith("|") else TREE_ENTRY_PATTERN.match(line)
        if match is None:
            if stripped and not stripped.startswith(("#", "//")):
                root = TREE_ROOT_PATTERN.match(line)
                self.stack = []
                self.label = root.group("name") if root is not None else stripped.split()[0]
                self.base = self._root_folder(self.label) if root is not None else None
                self.stale_root = None
                if root is not None and self.base is None and not PLACEHOLDER_PATTERN.search(self.label):
                    self.stale_root = (line_number, self.label)
            return None
        depth = len(match.group("lead"))
        name = match.group("name")
        while self.stack and self.stack[-1][0] >= depth:
            self.stack.pop()
        parents = "".join(part if part.endswith("/") else part + "/" for _col, part in self.stack)
        self.stack.append((depth, name))
        if self.base is None or PLACEHOLDER_PATTERN.search(parents + name):
            return None
        token = inventory_token(name)
        if token is None and not name.endswith("/"):
            return None
        relative = parents + (token or name)
        target = self.base / relative
        # Name the entry from the README folder, so the git-ignored check asks
        # git about the real path.
        shown = os.path.relpath(target, self.folder) + ("/" if relative.endswith("/") else "")
        return (shown, str(target))

    def take_stale_root(self) -> tuple[int, str] | None:
        """Return the stale root line once, when the tree under it has an entry."""
        stale, self.stale_root = self.stale_root, None
        return stale


def inline_references(line_number: int, span_text: str, skip: set[str]) -> list[Reference]:
    """Return the path references in one code span, each token once."""
    span = clean_candidate(span_text) if " " in span_text.strip() else ""
    audited = path_tokens(span_text)
    references: list[Reference] = []
    seen: set[str] = set(skip)
    for token in audited:
        if token not in seen:
            seen.add(token)
            references.append(Reference(line_number, token, "inline", span=span))
    for token in token_candidates(span_text):
        if token in seen:
            continue
        seen.add(token)
        normalized = normalize_reference_token(token, "inline_code")
        named = not (normalized and token_looks_like_path(normalized, "inline_code"))
        references.append(Reference(line_number, token, "inline", span=span, named=named))
    return references


def command_tokens(text: str) -> list[str]:
    """Return the slash commands in a code span or fenced line, each once."""
    tokens: list[str] = []
    for word in text.split():
        token = clean_candidate(word.lstrip("([{'\"*"))
        if COMMAND_PATTERN.fullmatch(token) and token not in tokens:
            tokens.append(token)
    return tokens


def mask_html_comments(line: str, inside: bool) -> tuple[str, bool]:
    """Blank the HTML comment text on a prose line and report whether a comment stays open.

    A ``<!--`` inside a code span is quoted syntax, not a comment, so it opens
    nothing. Blanking keeps every column, so code span offsets agree.
    """
    spans = [(match.start(), match.end()) for match in INLINE_PATTERN.finditer(line)]
    characters = list(line)
    index = 0
    while index < len(line):
        if inside:
            close = line.find("-->", index)
            stop = len(line) if close < 0 else close + 3
            characters[index:stop] = " " * (stop - index)
            if close < 0:
                break
            inside, index = False, stop
            continue
        opening = line.find("<!--", index)
        while opening >= 0 and any(start <= opening < end for start, end in spans):
            opening = line.find("<!--", opening + 1)
        if opening < 0:
            break
        inside, index = True, opening
    return "".join(characters), inside


def is_placeholder(raw: str) -> bool:
    """Recognize a path the reader fills in: a leading `[name]` segment or a `path/to/` stem.

    Only the first segment counts, as in `[spec-folder]/spec.md`: a bracketed
    segment further in, as in `app/[id]/page.tsx`, is a real dynamic-route folder.
    """
    segments = raw.strip("/").split("/")
    if PLACEHOLDER_SEGMENT_PATTERN.match(segments[0]):
        return True
    return any(first == "path" and second == "to" for first, second in zip(segments, segments[1:]))


def label_target(labels: list[tuple[int, int, str]], start: int, end: int) -> str:
    """Return the target of the link whose visible text holds the span at start..end, or ''."""
    return next((target for low, high, target in labels if low <= start and end <= high), "")


def extract_references(text: str, readme: Path | None = None, root: Path | None = None) -> list[Reference]:
    """Extract links, inline paths, command paths, slash commands, inventories and tree entries."""
    references: list[Reference] = []
    active_fence: str | None = None
    example_fence = False
    example_lines: set[int] = set()
    in_comment = False
    tree = TreeState(readme.parent if readme else None, root)

    for line_number, line in enumerate(text.splitlines(), start=1):
        # A slash command inside an HTML comment is hidden from readers, so it is not read.
        if active_fence is None:
            visible, in_comment = mask_html_comments(line, in_comment)
        else:
            visible = HTML_COMMENT_PATTERN.sub(" ", line)
        fence_match = FENCE_PATTERN.match(line)
        if fence_match:
            marker = fence_match.group(1)
            if active_fence is None:
                active_fence = marker[0]
                example_fence = "example" in fence_match.group(2).lower().split()
            elif marker[0] == active_fence:
                active_fence = None
                example_fence = False
            tree.reset()
            continue

        # An example fence is read like any other fence so its references can be
        # counted, and each one is tagged so it is never checked against the disk.
        if example_fence:
            example_lines.add(line_number)

        labels: list[tuple[int, int, str]] = []
        for match in LINK_PATTERN.finditer(line):
            token = normalize_reference_token(match.group("target"), "markdown_link")
            if token:
                references.append(Reference(line_number, token, "link"))
                labels.append((match.start("label"), match.end("label"), token))

        inventory = table_tokens(line)
        for token in inventory:
            references.append(Reference(line_number, token, "table", subtree=True))

        seen: set[str] = set(inventory)
        for match in INLINE_PATTERN.finditer(line):
            found = inline_references(line_number, match.group(1), seen)
            seen.update(reference.raw for reference in found)
            target = label_target(labels, match.start(), match.end())
            references.extend(dataclasses.replace(item, label_of=target) if target else item for item in found)

        # A code span that quotes comment syntax, as in `<!-- /ANCHOR:id -->`, names no command.
        commands = [HTML_COMMENT_PATTERN.sub(" ", match.group(1)) for match in INLINE_PATTERN.finditer(visible)]
        if active_fence is not None:
            commands = [visible]
        leading: dict[str, bool] = {}
        for part in commands:
            tokens = command_tokens(part)
            words = part.split()
            opener = clean_candidate(words[0].lstrip("([{'\"*")) if words and active_fence is None else ""
            for token in tokens:
                leading[token] = leading.get(token, False) or token == opener
        for token, opens in leading.items():
            references.append(Reference(line_number, token, "slash", leading=opens))

        candidates = tree.entry(line, line_number)
        if TREE_ENTRY_PATTERN.match(line) and active_fence is not None:
            stale = tree.take_stale_root()
            if stale is not None:
                references.append(Reference(stale[0], stale[1], "tree", named=True))
        if candidates is not None:
            references.append(Reference(line_number, candidates[0], "tree", alternatives=candidates[1:]))
        elif active_fence is not None and not TREE_ENTRY_PATTERN.match(line) and not BOX_PATTERN.search(line):
            for token in path_tokens(line):
                references.append(Reference(line_number, token, "command"))

    return [
        dataclasses.replace(reference, example=True) if reference.line in example_lines else reference
        for reference in references
        if reference.kind in ("link", "slash") or not is_placeholder(reference.raw)
    ]


@dataclass(frozen=True)
class MarkerEntry:
    line: int
    directive: str
    token: str
    reason: str


def parse_markers(text: str) -> tuple[list[MarkerEntry], list[tuple[int, str]], str]:
    """Read readme-check blocks and return entries, malformed lines and the text with blocks blanked."""
    entries: list[MarkerEntry] = []
    errors: list[tuple[int, str]] = []
    lines = text.splitlines()
    inside = False
    for index, line in enumerate(lines):
        if not inside:
            inside = MARKER_OPEN.match(line) is not None
            if inside:
                lines[index] = ""
            continue
        lines[index] = ""
        body = line.strip()
        if body.startswith("-->"):
            inside = False
            continue
        if not body:
            continue
        directive, _space, rest = body.partition(" ")
        token, bar, reason = rest.partition("|")
        if directive not in MARKER_DIRECTIVES:
            errors.append((index + 1, f"unknown readme-check directive {directive!r}"))
        elif not bar or not token.strip() or not reason.strip():
            errors.append((index + 1, f"{directive} entry needs '<token> | <reason>'"))
        else:
            entries.append(MarkerEntry(index + 1, directive, token.strip(), reason.strip()))
    if inside:
        errors.append((len(lines), "readme-check block is not closed with -->"))
    return entries, errors, "\n".join(lines)


def tracked_names(root: Path) -> tuple[set[str], dict[str, Path]]:
    """Return file and folder names git tracks or would track, plus skill folders by name, cached per root.

    An untracked file git does not ignore is about to be committed, so its name
    counts; a git-ignored local file never does, so a name cannot pass in one
    checkout and fail in another.
    """
    if root not in _TRACKED_NAMES:
        result = subprocess.run(
            ["git", "-c", "core.fsmonitor=false", "-C", str(root), "ls-files", "-z",
             "--cached", "--others", "--exclude-standard"],
            check=False,
            capture_output=True,
            text=True,
        )
        names: set[str] = set()
        skills: dict[str, Path] = {}
        paths: dict[str, list[str]] = {}
        folders: set[str] = set()
        for relative in result.stdout.split("\0"):
            if not relative:
                continue
            parts = relative.split("/")
            names.add(parts[-1])
            paths.setdefault(parts[-1], []).append(relative)
            for depth in range(1, len(parts)):
                folder = "/".join(parts[:depth])
                if folder not in folders:
                    folders.add(folder)
                    names.add(f"{parts[depth - 1]}/")
                    paths.setdefault(f"{parts[depth - 1]}/", []).append(folder)
            if parts[-1] == "SKILL.md" and parts[:2] == [".skilled", "skills"] and len(parts) in (4, 5):
                skills.setdefault(parts[-2], root.joinpath(*parts[:-1]))
        _TRACKED_NAMES[root] = (names, skills, paths)
    names, skills, _paths = _TRACKED_NAMES[root]
    return names, skills


def name_on_disk(name: str, root: Path) -> bool:
    """Tell whether a file or folder of this name is listed by git and still on disk.

    The index keeps listing a tracked file deleted from the working tree, and a
    reference to it is as broken as one to a file that never existed.
    """
    tracked_names(root)
    return any(os.path.lexists(root / relative) for relative in _TRACKED_NAMES[root][2].get(name, ()))


def candidate_paths(candidate: str, base: Path, root: Path) -> list[Path]:
    """Resolve a literal or glob from the README directory, safe root anchors and a skill folder."""
    if candidate.rstrip("/") == base.name:
        return [base]
    if candidate.startswith("/"):
        return [Path(candidate)]
    paths = [base / candidate]
    if candidate.startswith(REPOSITORY_ROOT_PREFIXES):
        root_path = root / candidate
        if root_path not in paths:
            paths.append(root_path)
    head, _slash, tail = candidate.partition("/")
    if tail:
        skill = tracked_names(root)[1].get(head)
        if skill is not None:
            paths.append(skill.parent / candidate)
    return paths


def outside_repository(raw: str, root: Path) -> bool:
    """Name an absolute path that is not a repository reference and is not a machine path."""
    if not raw.startswith("/") or raw.startswith(MACHINE_PATH_PREFIXES):
        return False
    try:
        Path(raw).resolve().relative_to(root)
    except ValueError:
        return True
    return False


def machine_path_outside(raw: str, root: Path) -> bool:
    """Tell whether a token is an absolute path under a user home outside this checkout."""
    if not raw.startswith(MACHINE_PATH_PREFIXES):
        return False
    try:
        Path(raw).resolve().relative_to(root)
    except ValueError:
        return True
    return False


def per_mode_path(raw: str, base: Path) -> bool:
    """Tell whether a hub README names a path that every child mode folder holds."""
    if raw.startswith(ANCHORED_PREFIXES) or "/" not in raw.rstrip("/") or "*" in raw:
        return False
    modes = [child for child in base.iterdir() if child.is_dir() and (child / "SKILL.md").is_file()]
    return len(modes) >= 2 and all((mode / raw).exists() for mode in modes)


def absent_by_design(raw: str, readme: Path, root: Path) -> str:
    """Name why an unresolved path is absent from every checkout by design, or return ''.

    A git-ignored path is the fourth class; it is cleared for every README of a
    run in one batch, by clear_gitignored.
    """
    if raw in ON_DEMAND_PATHS:
        return f"per-repository config {ON_DEMAND_PATHS[raw]}"
    if "/" not in raw and raw.endswith(".js") and f"{raw[:-3]}.ts" in tracked_names(root)[0]:
        return f"compiled from tracked {raw[:-3]}.ts"
    if per_mode_path(raw, readme.parent):
        return "held by every child mode folder"
    return ""


def resolve_literal(reference: Reference, raw: str, readme: Path, root: Path) -> Resolution:
    """Resolve one literal or glob from every candidate base."""
    for candidate_path in candidate_paths(raw, readme.parent, root):
        matches = sorted(glob.glob(str(candidate_path), recursive=True)) if any(
            marker in str(candidate_path) for marker in ("*", "?")
        ) else [str(candidate_path)]
        for match in matches:
            path = Path(match)
            if not path.exists():
                continue
            resolved = path.resolve()
            try:
                resolved.relative_to(root)
            except ValueError:
                return Resolution(reference, False, "resolves outside the repository")
            return Resolution(reference, True, str(resolved))
    return Resolution(reference, False, "path does not exist")


def resolve_by_name(reference: Reference, readme: Path, root: Path) -> Resolution | None:
    """Resolve a token the audit does not read as a path: by literal, whole span or repository name."""
    literal = resolve_literal(reference, reference.raw, readme, root)
    if literal.resolved or literal.detail == "resolves outside the repository":
        return literal
    if reference.span.endswith(reference.raw) and reference.span != reference.raw:
        whole = resolve_literal(reference, reference.span, readme, root)
        if whole.resolved:
            return whole
        if "/" not in reference.span.rstrip("/") and name_on_disk(reference.span, root):
            return Resolution(reference, True, f"tracked name {reference.span}")
    bare = reference.raw
    if "/" not in bare.rstrip("/") and "*" not in bare and (
        name_on_disk(bare, root) or name_on_disk(f"{bare}.tmpl", root)
    ):
        return Resolution(reference, True, f"tracked name {bare}")
    return None


@functools.lru_cache(maxsize=None)
def declared_modes(command_file: Path) -> frozenset[str]:
    """Return the `:mode` tokens a command's frontmatter declares, wildcards included."""
    try:
        lines = command_file.read_text(encoding="utf-8").splitlines()
    except OSError:
        return frozenset()
    if not lines or lines[0].strip() != "---":
        return frozenset()
    modes: set[str] = set()
    for line in lines[1:]:
        if line.strip() == "---":
            break
        if line.startswith(MODE_FRONTMATTER_KEYS):
            modes.update(DECLARED_MODE_PATTERN.findall(line.split(":", 1)[1]))
    return frozenset(modes)


def check_modes(reference: Reference, command_file: Path, modes: list[str], concrete: bool) -> Resolution:
    """Accept a resolved command only when every trailing `:mode` is one it declares."""
    if modes and concrete:
        declared = declared_modes(command_file)
        unknown = [mode for mode in modes if not any(fnmatch.fnmatchcase(mode, token) for token in declared)]
        if unknown:
            return Resolution(reference, False, f"mode :{unknown[0]} is not declared by {command_file.name}")
    return Resolution(reference, True, str(command_file))


def command_group(tree: Path, group: str) -> bool:
    """Tell whether a folder of the command tree holds commands, not only assets or scripts."""
    folder = tree / group
    return folder.is_dir() and any(folder.glob("*.md"))


def resolve_slash_command(reference: Reference, root: Path) -> Resolution:
    """Resolve `/group:name`, `/name` or `/group-name` against the command tree."""
    tree = root.joinpath(*COMMAND_TREE)
    if not tree.is_dir():
        return Resolution(reference, True, "no command tree in this checkout")
    match = COMMAND_PATTERN.fullmatch(reference.raw)
    if match is None:
        return Resolution(reference, False, "not a command name")
    group, name = match.group("group"), match.group("name")
    modes = [mode for mode in match.group("modes").split(":") if mode]
    if name is not None:
        hits = sorted(glob.glob(str(tree / group / f"{name}.md")))
        if hits and command_group(tree, group):
            return check_modes(reference, Path(hits[0]), modes, concrete="*" not in name)
        # A command file directly under the tree, such as `vision.md`, has no
        # group, so in `/vision:auto` the segment after the colon is a mode.
        top_level = tree / f"{group}.md"
        if not command_group(tree, group) and top_level.is_file():
            return check_modes(reference, top_level, [name, *modes], concrete="*" not in name)
        return Resolution(reference, False, "command does not exist in the command tree")
    # Runtimes that cannot spell a colon write `/group-name`, so try each hyphen split.
    splits = [index for index, character in enumerate(group) if character == "-"]
    candidates = [tree / f"{group}.md"]
    candidates += [tree / group[:index] / f"{group[index + 1:]}.md" for index in splits]
    for candidate in candidates:
        if candidate.is_file():
            return check_modes(reference, candidate, modes, concrete=True)
    # A hyphen form that opens its code span and nearly spells a command of the
    # group its prefix names is a typo. Any other hyphen form, such as a skill
    # name like `/deep-dive` or a route on a fenced line, is not a command here.
    if reference.leading and any(near_command(tree, group[:index], group[index + 1:]) for index in splits):
        return Resolution(reference, False, "command does not exist in its command group")
    return Resolution(reference, True, "not in the command tree: a runtime built-in or skill")


def near_command(tree: Path, group: str, name: str) -> bool:
    """Tell whether ``name`` nearly spells a command in a group of the command tree."""
    if not command_group(tree, group):
        return False
    names = [path.stem for path in (tree / group).glob("*.md")]
    return bool(difflib.get_close_matches(name, names, n=1, cutoff=TYPO_SIMILARITY))


def resolve_reference(reference: Reference, readme: Path, root: Path) -> Resolution:
    """Resolve one reference and reject a target that escapes the repository."""
    if reference.example:
        return Resolution(reference, True, "example: not checked")
    if reference.kind == "slash":
        return resolve_slash_command(reference, root)
    if machine_path_outside(reference.raw, root):
        return Resolution(reference, False, "names a machine-local path outside the repository")
    if reference.named:
        hit = resolve_by_name(reference, readme, root)
        if hit is not None:
            return hit
        reason = absent_by_design(reference.raw, readme, root)
        if reason:
            return Resolution(reference, True, reason)
        return Resolution(reference, False, "path does not exist")
    for candidate in (reference.raw, *reference.alternatives):
        found, evidence = classify_reference_status(readme, root, candidate)
        if not found:
            continue
        path = Path(evidence[0])
        if path.is_absolute() and path.exists():
            try:
                path.resolve().relative_to(root)
            except ValueError:
                return Resolution(reference, False, "resolves outside the repository")
        return Resolution(reference, True, evidence[0])
    if reference.kind == "link":
        return Resolution(reference, False, "path does not exist")
    nearby = resolve_from_nearby(reference, readme.parent, root)
    if nearby is not None:
        return Resolution(reference, True, nearby)
    reason = absent_by_design(reference.raw, readme, root)
    if reason:
        return Resolution(reference, True, reason)
    return Resolution(reference, False, "path does not exist")


_SUBTREE_CACHE: dict[Path, tuple[set[str], set[str]]] = {}


def subtree_paths(folder: Path) -> tuple[set[str], set[str]]:
    """Return every file and folder path below folder, relative and posix, cached per folder."""
    if folder not in _SUBTREE_CACHE:
        files: set[str] = set()
        dirs: set[str] = set()
        for current, dirnames, filenames in os.walk(folder):
            dirnames[:] = [name for name in dirnames if name not in SUBTREE_SKIP]
            rel = Path(current).relative_to(folder).as_posix()
            prefix = "" if rel == "." else rel + "/"
            dirs.update(prefix + name + "/" for name in dirnames)
            files.update(prefix + name for name in filenames)
        _SUBTREE_CACHE[folder] = (files, dirs)
    return _SUBTREE_CACHE[folder]


def found_in_subtree(token: str, folder: Path) -> str | None:
    """Return a path below folder that ends with token, or None."""
    files, dirs = subtree_paths(folder)
    pool = dirs if token.endswith("/") else files
    suffix = "/" + token
    for path in pool:
        if path == token or path.endswith(suffix):
            return str(folder / path)
    return None


def resolve_from_nearby(reference: Reference, folder: Path, root: Path) -> str | None:
    """Resolve a code-span, inventory or tree entry from the folders it may be written from.

    An inventory or tree names files the way a parent folder sees them, as in
    `system-spec-kit/runtime/...` in a hook README, so each folder between the
    README and the repository root is a base. A relative code span such as
    `../lib/core.cjs` is often an import specifier written from a file below the
    README, so each folder below it is a base too. An inventory also resolves
    when its entry sits at any depth below the README.
    """
    if reference.kind == "link" or reference.kind == "command":
        return None
    bases = [ancestor for ancestor in folder.parents if ancestor == root or root in ancestor.parents]
    bases.extend(root / rel for rel in SKILL_RELATIVE_BASES)
    if reference.kind == "inline":
        _files, dirs = subtree_paths(folder)
        bases.extend(folder / rel for rel in sorted(dirs))
    for candidate in (reference.raw, *reference.alternatives):
        names = [candidate]
        if reference.kind == "inline" and candidate.endswith(".js"):
            names.extend(candidate[:-3] + suffix for suffix in SPECIFIER_SOURCE_SUFFIXES)
        for name in names:
            for base in bases:
                path = Path(os.path.normpath(base / name))
                if path.exists() and (path == root or root in path.parents):
                    return str(path)
    if reference.subtree:
        return found_in_subtree(reference.raw, folder)
    return None


def gitignore_candidate(raw: str) -> bool:
    """Tell whether git can be asked about a reference: not absolute and not a glob."""
    return not raw.startswith("/") and "*" not in raw and "?" not in raw


def named_ignore_paths(raw: str, readme: Path, root: Path) -> list[str]:
    """Return the repository-relative paths a name-resolved token can mean, for git to judge."""
    bases = [readme.parent] + ([root] if raw.startswith(REPOSITORY_ROOT_PREFIXES) else [])
    paths = []
    for start in bases:
        try:
            relative = (start / raw).resolve().relative_to(root).as_posix()
        except ValueError:
            continue
        if relative not in ("", "."):
            paths.append(relative + ("/" if raw.endswith("/") else ""))
    return paths


def clear_gitignored(checked: list[tuple[list[Resolution], Path, Path]]) -> list[list[Resolution]]:
    """Mark broken references resolved when they name a git-ignored runtime path.

    Every README under one repository root goes to git in batches, since a call
    costs far more than the paths it carries. A README kept inside an ignored
    folder would pass every relative path, broken ones too, so the first call
    asks an extensionless sibling name per README and leaves any README whose
    folder is ignored as a whole out of the clearing. The same call judges each
    name-resolved token from the README folder, and from the repository root
    when it opens with a root anchor. The second call clears every other broken
    reference through audit_readmes.py, from the README folder, its package root
    and the repository root, where the folder holding the path must exist or be
    ignored itself.
    """
    by_root: dict[Path, list[int]] = {}
    for index, (_resolutions, _readme, root) in enumerate(checked):
        by_root.setdefault(root, []).append(index)
    cleared: dict[int, dict[tuple[str, bool], str]] = {}
    for root, indexes in by_root.items():
        pending = [
            index for index in indexes
            if any(not r.resolved and gitignore_candidate(r.reference.raw) for r in checked[index][0])
        ]
        if not pending:
            continue
        probes = {index: (checked[index][1].parent / IGNORE_PROBE).relative_to(root).as_posix() for index in pending}
        named: dict[tuple[int, str], list[str]] = {}
        for index in pending:
            for r in checked[index][0]:
                if not r.resolved and r.reference.named and gitignore_candidate(r.reference.raw):
                    named[(index, r.reference.raw)] = named_ignore_paths(r.reference.raw, checked[index][1], root)
        ignored = git_ignored_paths(root, [*probes.values(), *(path for paths in named.values() for path in paths)])
        eligible = [index for index in pending if probes[index] not in ignored]
        for (index, raw), paths in named.items():
            hit = next((path for path in paths if path in ignored), None)
            if index in eligible and hit is not None:
                cleared.setdefault(index, {})[(raw, True)] = hit
        items = [
            {
                "file": checked[index][1].relative_to(root).as_posix(),
                "broken_references": [
                    {"reference": r.reference.raw} for r in checked[index][0]
                    if not r.resolved and not r.reference.named and gitignore_candidate(r.reference.raw)
                ],
            }
            for index in eligible
        ]
        if not any(item["broken_references"] for item in items):
            continue
        resolve_gitignored_references(root, items)
        for index, item in zip(eligible, items):
            for entry in item.get("resolved_references", []):
                cleared.setdefault(index, {})[(entry["reference"], False)] = entry["path"]
    return [
        [
            Resolution(r.reference, True, f"excluded by .gitignore: {cleared[index][(r.reference.raw, r.reference.named)]}")
            if not r.resolved and (r.reference.raw, r.reference.named) in cleared.get(index, {}) else r
            for r in resolutions
        ]
        for index, (resolutions, _readme, _root) in enumerate(checked)
    ]


def apply_markers(
    resolutions: list[Resolution], entries: list[MarkerEntry], errors: list[tuple[int, str]],
) -> list[Resolution]:
    """Allow each unresolved token a README names in its readme-check block, and fail stale or malformed entries."""
    allowed = {entry.token: entry for entry in entries if entry.directive == "allow-ref"}
    used: set[str] = set()
    marked: list[Resolution] = []
    for resolution in resolutions:
        entry = allowed.get(resolution.reference.raw)
        if not resolution.resolved and entry is not None:
            used.add(entry.token)
            resolution = Resolution(resolution.reference, True, f"allowed: {entry.reason}")
        marked.append(resolution)
    for line, message in errors:
        marked.append(Resolution(Reference(line, "readme-check", "marker"), False, message))
    for token, entry in allowed.items():
        if token not in used:
            marked.append(Resolution(
                Reference(entry.line, token, "marker"), False, "allow-ref matches no unresolved reference",
            ))
    return marked


def path_ends_with(path: str, tail: str) -> bool:
    """Tell whether a path's last segments are exactly the segments of tail."""
    tail_parts = [part for part in tail.strip("/").split("/") if part not in ("", ".")]
    path_parts = [part for part in path.strip("/").split("/") if part]
    return bool(tail_parts) and path_parts[-len(tail_parts):] == tail_parts


def pass_link_labels(resolutions: list[Resolution], readme: Path) -> list[Resolution]:
    """Pass a code-span label that shortens the target of a working link on its line.

    Readers follow the target, so a label such as `guide/intro.md` in front of
    a working link to `../docs/guide/intro.md` names that file. A label the
    target does not end with, such as a folder that was renamed, is still a
    path of its own and keeps its own verdict.
    """
    working = {
        (item.reference.line, item.reference.raw)
        for item in resolutions if item.reference.kind == "link" and item.resolved
    }
    passed: list[Resolution] = []
    for item in resolutions:
        target = item.reference.label_of
        if not item.resolved and target and (item.reference.line, target) in working:
            full = os.path.normpath(readme.parent / target).replace(os.sep, "/")
            if path_ends_with(target, item.reference.raw) or path_ends_with(full, item.reference.raw):
                item = Resolution(item.reference, True, f"label of a working link to {target}")
        passed.append(item)
    return passed


def check_readmes(readme_args: list[str]) -> list[tuple[list[Resolution], Path | None]]:
    """Check READMEs and return, per README, reference receipts plus a read error."""
    results: list[tuple[list[Resolution], Path | None]] = []
    checked: list[tuple[list[Resolution], Path, Path]] = []
    markers: list[tuple[list[MarkerEntry], list[tuple[int, str]]]] = []
    slots: list[int] = []
    for readme_arg in readme_args:
        readme = Path(readme_arg).resolve()
        if not readme.is_file():
            results.append(([], readme))
            continue
        try:
            root = repository_root(readme)
            text = readme.read_text(encoding="utf-8")
        except (OSError, subprocess.CalledProcessError):
            results.append(([], readme))
            continue
        entries, errors, text = parse_markers(text)
        references = [
            reference for reference in extract_references(text, readme, root)
            if reference.kind == "slash" or not outside_repository(reference.raw, root)
        ]
        resolutions = [resolve_reference(reference, readme, root) for reference in references]
        checked.append((pass_link_labels(resolutions, readme), readme, root))
        markers.append((entries, errors))
        slots.append(len(results))
        results.append(([], None))
    for slot, resolutions, (entries, errors) in zip(slots, clear_gitignored(checked), markers):
        results[slot] = (apply_markers(resolutions, entries, errors), None)
    return results


def check_readme(readme_arg: str) -> tuple[list[Resolution], Path | None]:
    """Check one README and return reference receipts plus a read error."""
    return check_readmes([readme_arg])[0]


def print_result(readme_arg: str, resolutions: list[Resolution], missing: Path | None) -> bool:
    """Print a human-readable verdict for one README."""
    if missing is not None:
        print(f"FAIL {readme_arg}: README is missing or unreadable")
        return False
    failures = [item for item in resolutions if not item.resolved]
    allowed = sum(1 for item in resolutions if item.detail.startswith("allowed: "))
    examples = 0
    for item in resolutions:
        if item.reference.example:
            examples += 1
        if not item.resolved:
            print(
                f"  line {item.reference.line}: {item.reference.kind} "
                f"{item.reference.raw!r}: {item.detail}"
            )
    status = "PASS" if not failures else "FAIL"
    print(
        f"{status} {readme_arg}: references={len(resolutions)} "
        f"unresolved={len(failures)} examples={examples} allowed={allowed}"
    )
    return not failures


def run_self_test() -> int:
    """Exercise valid, missing, example-fence, path-shaped prose and broken-path cases."""
    with tempfile.TemporaryDirectory() as temp_dir:
        root = Path(temp_dir)
        (root / ".git").mkdir()
        subprocess.run(["git", "-C", str(root), "init", "-q"], check=True)
        (root / "docs").mkdir()
        (root / "docs" / "README.md").write_text(
            "[source](../source.md)\n\n```bash\n./run.sh\n```\n\n"
            "```bash example\n./illustrative.sh\n```\n",
            encoding="utf-8",
        )
        (root / "source.md").write_text("source\n", encoding="utf-8")
        (root / "docs" / "run.sh").write_text("#!/usr/bin/env bash\n", encoding="utf-8")
        valid, missing = check_readme(str(root / "docs" / "README.md"))
        if missing is not None or not print_result("self-test-positive", valid, None):
            return 1

        (root / "docs" / "README.md").write_text("```bash\n./missing.sh\n```\n", encoding="utf-8")
        invalid, missing = check_readme(str(root / "docs" / "README.md"))
        if missing is not None or print_result("self-test-negative", invalid, None):
            return 1

        for relative in (
            "elsewhere/graph-metadata.json", "elsewhere/addons/x.md",
            "templates/phase.spec.md.tmpl", "REPO RULES.md",
            ".skilled/skills/tool/SKILL.md", ".skilled/skills/tool/scripts/run.py",
            "docs/pkg/a.py", "docs/pkg/sub/b.py",
        ):
            (root / relative).parent.mkdir(parents=True, exist_ok=True)
            (root / relative).write_text("x\n", encoding="utf-8")
        subprocess.run(["git", "-C", str(root), "add", "-A"], check=True)
        _TRACKED_NAMES.clear()
        (root / "docs" / "README.md").write_text(
            "Run `/doctor:git` or `/deep:*`, edit `~/.zshrc`, pipe to `/dev/null`, call `/api/embed`.\n"
            "Pick `openai/gpt-6` over `HTTP/UDS`, match `*.ts` and `.d.ts`.\n"
            "Read `graph-metadata.json`, `addons/`, the `phase.spec.md` template and `REPO RULES.md`.\n"
            "Run `tool/scripts/run.py` with `<path/to/file.md>`.\n\n"
            "```bash\ncodex exec \\\n  \"Edit src/missing.ts now\" \\\n```\n\n"
            "```text\npkg/\n├── a.py\n└── sub/\n    └── b.py\n```\n\n"
            "```text\n┌──────────┐\n│ scratch/ │\n└──────────┘\n```\n",
            encoding="utf-8",
        )
        shaped, missing = check_readme(str(root / "docs" / "README.md"))
        if missing is not None or not print_result("self-test-path-shaped-prose", shaped, None):
            return 1

        # A stale tree root fails once, and the entries under it are not checked.
        (root / "docs" / "README.md").write_text("```text\nold-name/\n└── pkg/\n```\n", encoding="utf-8")
        stale_root, missing = check_readme(str(root / "docs" / "README.md"))
        if missing is not None or [item.reference.raw for item in stale_root if not item.resolved] != ["old-name/"]:
            print("FAIL self-test-stale-tree-root")
            return 1

        for label, body in (
            ("untracked-bare-name", "`nowhere-at-all.json`\n"),
            ("unanchored-missing-file", "`lib/missing.py`\n"),
            ("missing-tree-entry", "```text\npkg/\n└── gone.py\n```\n"),
            ("machine-path", "`/Users/someone/file.md`\n"),
        ):
            (root / "docs" / "README.md").write_text(body, encoding="utf-8")
            broken, missing = check_readme(str(root / "docs" / "README.md"))
            if missing is not None or print_result(f"self-test-{label}", broken, None):
                return 1

        # A marker suppresses only its own token: a broken path beside it still fails.
        (root / "docs" / "README.md").write_text(
            "Branches live under `gone-ns/`, next to `lib/broken.py`.\n\n"
            "<!-- readme-check\nallow-ref gone-ns/ | a git branch namespace, not a folder\n-->\n",
            encoding="utf-8",
        )
        marked, missing = check_readme(str(root / "docs" / "README.md"))
        if missing is not None or [item.reference.raw for item in marked if not item.resolved] != ["lib/broken.py"]:
            print("FAIL self-test-marker-scope")
            return 1
        for label, body in (
            ("marker-unused", "`docs/`\n\n<!-- readme-check\nallow-ref docs/ | exists, so the entry is stale\n-->\n"),
            ("marker-no-reason", "`gone-ns/`\n\n<!-- readme-check\nallow-ref gone-ns/\n-->\n"),
            ("marker-unclosed", "`gone-ns/`\n\n<!-- readme-check\nallow-ref gone-ns/ | reason\n"),
        ):
            (root / "docs" / "README.md").write_text(body, encoding="utf-8")
            broken, missing = check_readme(str(root / "docs" / "README.md"))
            if missing is not None or print_result(f"self-test-{label}", broken, None):
                return 1

        # Each absent-by-design class passes its own case and never an ordinary missing path.
        (root / ".gitignore").write_text("build/\n", encoding="utf-8")
        for relative in ("hub/a/SKILL.md", "hub/a/refs/x.md", "hub/a/refs/y.md", "hub/b/SKILL.md",
                         "hub/b/refs/x.md", "src/gen.ts"):
            (root / relative).parent.mkdir(parents=True, exist_ok=True)
            (root / relative).write_text("x\n", encoding="utf-8")
        subprocess.run(["git", "-C", str(root), "add", "-A"], check=True)
        _TRACKED_NAMES.clear()
        (root / "hub" / "README.md").write_text(
            "Each mode keeps `refs/x.md`. Output lands in `build/out.js`. It runs `gen.js`.\n"
            "Config lives in `.sk-git/` and `.skilled/skills/sk-code/sk-code-quality/repository/quality.json`. Run `tool -o out.txt`.\n",
            encoding="utf-8",
        )
        classes, missing = check_readme(str(root / "hub" / "README.md"))
        if missing is not None or not print_result("self-test-absent-by-design", classes, None):
            return 1
        for label, body in (
            ("class-not-every-mode", "`refs/y.md`\n"),
            ("class-not-ignored", "`src/out.js`\n"),
            ("class-no-ts-source", "`other.js`\n"),
            ("class-config-near-miss", "`.sk-gitx/`\n"),
            ("class-not-output-flag", "`tool out.txt`\n"),
        ):
            (root / "hub" / "README.md").write_text(body, encoding="utf-8")
            broken, missing = check_readme(str(root / "hub" / "README.md"))
            if missing is not None or print_result(f"self-test-{label}", broken, None):
                return 1
        # Inside an ignored folder every relative path is ignored, so the rule must not apply there.
        (root / "build").mkdir(exist_ok=True)
        (root / ".gitignore").write_text("build/\nstate/*/*\n!state/*/README.md\n", encoding="utf-8")
        (root / "state" / "lane").mkdir(parents=True)
        (root / "state" / "lane" / "README.md").write_text("`gone.md`\n", encoding="utf-8")
        broken, missing = check_readme(str(root / "state" / "lane" / "README.md"))
        if missing is not None or print_result("self-test-class-readme-reincluded-in-ignored-folder", broken, None):
            return 1
        (root / "build" / "README.md").write_text("`gone.md`\n", encoding="utf-8")
        broken, missing = check_readme(str(root / "build" / "README.md"))
        if missing is not None or print_result("self-test-class-readme-in-ignored-folder", broken, None):
            return 1
        # A tracked file under the skill folder resolves from a README in any folder, because
        # the skills sit under a repository-root folder.
        profile = root / ".skilled" / "skills" / "sk-code" / "sk-code-ci" / "repository" / "ci.json"
        profile.parent.mkdir(parents=True, exist_ok=True)
        profile.write_text("{}\n", encoding="utf-8")
        subprocess.run(["git", "-C", str(root), "add", "-A"], check=True)
        _TRACKED_NAMES.clear()
        (root / "hub" / "README.md").write_text(
            "The profile is `.skilled/skills/sk-code/sk-code-ci/repository/ci.json`.\n", encoding="utf-8")
        rooted, missing = check_readme(str(root / "hub" / "README.md"))
        if missing is not None or not print_result("self-test-root-config-folder", rooted, None):
            return 1
        (root / "hub" / "README.md").write_text("`.sk-code/gone.json`\n", encoding="utf-8")
        broken, missing = check_readme(str(root / "hub" / "README.md"))
        if missing is not None or print_result("self-test-root-config-folder-missing", broken, None):
            return 1
    print("SELF-TEST PASS: positive, negative, example-fence, path-shaped prose, broken-path, "
          "marker and absent-by-design cases")
    return 0


def parse_args(argv: list[str]) -> argparse.Namespace:
    """Parse command-line arguments."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("readmes", nargs="*", help="README paths to check")
    parser.add_argument("--self-test", action="store_true", help="run built-in behavior checks")
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    """Run the reference gate."""
    args = parse_args(argv or sys.argv[1:])
    if args.self_test:
        return run_self_test()
    exit_if_validation_off("check_readme_references.py", argv)
    if not args.readmes:
        print("No README paths supplied", file=sys.stderr)
        return 2
    results = [print_result(path, *checked) for path, checked in zip(args.readmes, check_readmes(args.readmes))]
    print(
        f"SUMMARY files={len(results)} pass={sum(results)} "
        f"fail={len(results) - sum(results)}"
    )
    return 0 if all(results) else 1


if __name__ == "__main__":
    raise SystemExit(main())
