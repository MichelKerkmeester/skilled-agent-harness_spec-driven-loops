#!/usr/bin/env python3
"""Reject stale or unproven numeric file and suite counts in READMEs.

Usage: python3 check_derived_readme_counts.py [--self-test] README.md [...]

The checker can prove a count only from a folder listing, so it reads a number
as a count claim only when it counts a plural term directly, as in "three
files" or "12 shell scripts". One intervening word is allowed only when it is
a known category modifier or a singular count term, as in "12 shell scripts"
or a tree entry's "fifteen Node test files"; arbitrary concept words such as
"reader" or "example" do not turn a compound concept into a file count. Two
words are allowed only when one is a singular count term and the claim names
its folder. A label form such as
``Files: 12`` is a claim too, unless it reports a run (``Tests: 20/20 pass``).
Prose such as "in one file" counts nothing, and neither does a number after a
label or bound word (``Level 2 file set``, ``Gate 4``, ``more than 100 tracked
files``) or a rate such as ``300 files/session``.

A count in a sentence that names another path, and does not also name the
README's own folder, describes that path, so it is not a claim. Path detection
uses audit_readmes.py's reference rules. A claim whose sentence names a folder
in a code span, such as ``rules/``, is derived from that folder, and so is a
claim written after a folder entry on a fenced tree line (``├──``, ``└──``,
``+--`` or a backtick then ``--``), with or without a ``#``, resolved under the
tree's root line. A named folder is counted directly and recursively, with the
term's own filter (scripts and plugins count code files, tests and suites count
test files such as ``*.test.mjs``, ``test_*.py``, ``*.test.sh`` or
``test-*.sh``), so a folder that does not exist, or whose files are not what
the claim names, fails; the README folder's own lenient categories apply only
when the named folder is the README's. Any other claim is accepted only when a
complete direct-file inventory in the README derives the claimed category.
Dynamic shell derivations using ``find``, ``ls``, or ``wc`` are accepted.
Vague count words fail closed because they cannot be compared with the folder.

A correct claim the checker cannot derive, such as a count of guards one script
runs, is named in the README-level ``readme-check`` block that
``check_readme_references.py`` also reads. An ``allow-count`` entry names the
claim's phrase from its number through its count term, matched without regard
to case, suppresses that phrase in that README only, needs a reason, and fails
when it matches no failing claim::

    <!-- readme-check
    allow-count two example files | the next two bullets name both files
    -->
"""

from __future__ import annotations

import argparse
import os
import re
import subprocess
import sys
import tempfile
from dataclasses import dataclass
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "shared" / "scripts"))
sys.path.insert(0, str(Path(__file__).resolve().parent))
from validation_switch import exit_if_validation_off  # type: ignore  # noqa: E402
from audit_readmes import extract_references  # type: ignore  # noqa: E402


NUMBER_WORDS = {
    "zero": 0,
    "one": 1,
    "two": 2,
    "three": 3,
    "four": 4,
    "five": 5,
    "six": 6,
    "seven": 7,
    "eight": 8,
    "nine": 9,
    "ten": 10,
    "eleven": 11,
    "twelve": 12,
    "thirteen": 13,
    "fourteen": 14,
    "fifteen": 15,
    "sixteen": 16,
    "seventeen": 17,
    "eighteen": 18,
    "nineteen": 19,
    "twenty": 20,
}
COUNT_TERMS = {
    "file",
    "files",
    "script",
    "scripts",
    "suite",
    "suites",
    "test",
    "tests",
    "harness",
    "harnesses",
    "symlink",
    "symlinks",
    "plugin",
    "plugins",
    "workflow",
    "workflows",
    "entrypoint",
    "entrypoints",
    "guard",
    "guards",
}
VAGUE_TERMS = {
    "several",
    "many",
    "dozens",
    "numerous",
    "various",
    "multiple",
}
LABEL_WORDS = {
    "gate", "gates", "level", "levels", "step", "steps", "exit",
    "phase", "phases", "tier", "tiers", "than", "to", "least", "most",
}
CODE_SUFFIXES = {".js", ".cjs", ".mjs", ".ts"}
# What a script or plugin in a named folder may be written in.
SCRIPT_SUFFIXES = {".sh", ".bash", ".py", ".js", ".cjs", ".mjs", ".ts"}
TEST_SUFFIXES = (".test.cjs", ".test.js", ".test.mjs", ".test.ts", ".vitest.ts", ".test.sh")
# Runners that match on a name prefix: pytest's `test_*.py` and the shell `test-*.sh` scripts.
TEST_PREFIXES = (("test_", ".py"), ("test-", ".sh"))
FOLDER_SPAN = re.compile(r"`([^`\s]+/)`")
NUMBER_PATTERN = re.compile(r"\b(?:\d+|" + "|".join(NUMBER_WORDS) + r")\b", re.IGNORECASE)
WORD_PATTERN = re.compile(r"[A-Za-z][A-Za-z0-9_./*-]*")
# A count names what it counts right after the number, with at most one known
# category modifier or singular count term between them ("12 shell scripts",
# "three test files"). Two words are allowed only when one is a singular count
# term that narrows the plural ("fifteen Node test files") and the claim names
# the folder it counts, since a compound concept such as "four reader tests"
# is not a file count. The number must stand alone, so "one-shot" or "v2.1"
# never opens a count.
MAX_MODIFIERS = 2
# These modifiers name file or test categories; other words before a count term
# can form a concept name rather than a count of files in a folder.
CATEGORY_MODIFIERS = {"node", "shell", "vitest"}
WORD_STEP_PATTERN = re.compile(r"\s+([A-Za-z][\w-]*)")
# Words that end a noun phrase, or mark the count as a part of a larger set
# ("adds 2 more test files"), so a count term after one is not what the number counts.
PHRASE_BREAK_WORDS = {
    "a", "an", "and", "are", "as", "at", "be", "before", "by", "extra", "for", "from",
    "in", "is", "more", "new", "of", "on", "or", "other", "per", "than", "that", "the",
    "to", "was", "with",
}
# A result such as "20/20 pass" or "3 failing" reports a run, not a folder's contents.
RESULT_WORDS = {"pass", "passed", "passes", "passing", "fail", "failed", "failing"}
# Unicode and plain-text tree entries, as in `├── lib/` or `+-- lib/` under `|   `.
TREE_ENTRY_PATTERN = re.compile(r"^(?P<lead>[\s|│]*)(?:├──|└──|\+--|\|--|`--)\s*(?P<name>\S+)(?P<rest>.*)$")
TREE_ROOT_PATTERN = re.compile(r"^\s*(?P<name>[\w.@-][\w./@-]*/)\s*(?:#.*)?$")
WALK_SKIP = {"node_modules"}
# Only a plural counts the folder's contents. A singular after a number reads as
# prose ("in one file", "one log file"), not as an inventory.
PLURAL_COUNT_TERMS = {
    term for term in COUNT_TERMS
    if term[:-1] in COUNT_TERMS or (term.endswith("es") and term[:-2] in COUNT_TERMS)
}
MARKER_OPEN = re.compile(r"^\s*<!--\s*readme-check\s*$")


@dataclass(frozen=True)
class CountClaim:
    line: int
    value: int | None
    term: str
    text: str
    reason: str
    folder: str = ""
    phrase: str = ""
    # The root line of the tree whose folder entry the claim describes.
    tree_root: str = ""


def repository_root(readme: Path) -> Path:
    """Return the checkout root independently of the caller's CWD."""
    result = subprocess.run(
        ["git", "-c", "core.fsmonitor=false", "-C", str(readme.parent), "rev-parse", "--show-toplevel"],
        check=True,
        capture_output=True,
        text=True,
    )
    return Path(result.stdout.strip()).resolve()


def direct_files(folder: Path) -> list[Path]:
    """Return regular direct files and symlinks, excluding the README itself."""
    return sorted(
        path for path in folder.iterdir()
        if path.name != "README.md" and (path.is_file() or path.is_symlink())
    )


def is_test_file(name: str) -> bool:
    """Tell whether a filename follows one of the test naming forms the repository uses."""
    return name.endswith(TEST_SUFFIXES) or any(
        name.startswith(prefix) and name.endswith(suffix) for prefix, suffix in TEST_PREFIXES
    )


def derived_values(folder: Path) -> dict[str, set[int]]:
    """Derive count categories from the current directory contents."""
    files = direct_files(folder)
    regular = [path for path in files if not path.is_symlink()]
    symlinks = [path for path in files if path.is_symlink()]
    test_files = [path for path in regular if is_test_file(path.name)]
    scripts = [path for path in files if path.suffix in {".sh", ".bash"}]
    code = [path for path in files if path.suffix in CODE_SUFFIXES]
    return {
        "file": {len(files), len(regular)},
        "files": {len(files), len(regular)},
        "script": {len(scripts), len(regular)},
        "scripts": {len(scripts), len(regular)},
        "suite": {len(test_files)},
        "suites": {len(test_files)},
        "test": {len(test_files), len(files)},
        "tests": {len(test_files), len(files)},
        "harness": {len(files)},
        "harnesses": {len(files)},
        "symlink": {len(symlinks)},
        "symlinks": {len(symlinks)},
        "plugin": {len(files), len(code)},
        "plugins": {len(files), len(code)},
        "workflow": {len(files)},
        "workflows": {len(files)},
        "entrypoint": {len(files)},
        "entrypoints": {len(files)},
        "guard": {len(files)},
        "guards": {len(files)},
    }


def source_inventory_complete(text: str, folder: Path) -> bool:
    """Check that every direct source filename appears in the README."""
    return all(path.name in text for path in direct_files(folder))


def divides_as_rate(line: str, position: int) -> bool:
    """Tell a rate such as "300 files/session" from an alternative such as "7 files/folders".

    A rate divides by one unit, so the word after the slash is singular. A plural
    or a count term there names another kind of thing being counted.
    """
    if line[position:position + 1] != "/":
        return False
    after = re.match(r"[A-Za-z]+", line[position + 1:])
    if after is None:
        return True
    word = after.group(0).lower()
    return word not in COUNT_TERMS and not (word.endswith("s") and not word.endswith("ss"))


def counted_term(line: str, number_end: int) -> tuple[str, int, int] | None:
    """Return the count term a number counts, where the phrase ends and how many words sit between.

    The phrase must end in a plural count term. A singular count term before it
    modifies it ("12 test files"), so the claim counts that narrower term. A
    one-word gap may instead name a known category ("12 shell scripts") or any
    word when the line names the folder it counts. A gap
    of two words needs a singular count term in it, and any other unknown word
    or phrase breaker ("the", "more") makes the number prose.
    """
    first: str | None = None
    position = number_end
    for index in range(MAX_MODIFIERS + 1):
        step = WORD_STEP_PATTERN.match(line, position)
        if step is None:
            return None
        position = step.end()
        lower = step.group(1).lower()
        if lower in PLURAL_COUNT_TERMS:
            if divides_as_rate(line, position):
                return None
            if index == MAX_MODIFIERS and first is None:
                return None
            return first or lower, position, index
        if lower in PHRASE_BREAK_WORDS:
            return None
        # An unknown word may still narrow a count when the line names the folder it
        # counts ("three rule files live in `rules/`"), since that listing proves it.
        if lower not in COUNT_TERMS and lower not in CATEGORY_MODIFIERS and not FOLDER_SPAN.search(line):
            return None
        if lower in COUNT_TERMS and first is None:
            first = lower
    return None


def labelled_term(line: str, number_start: int) -> tuple[str, int] | None:
    """Return the plural term a label such as ``Files: 12`` or ``**Files:** 12`` puts before a number.

    A run result such as ``Tests: 20/20 pass`` reports outcomes, not the folder's files.
    """
    after = line[number_start:]
    number = re.match(r"\w+", after)
    rest = after[number.end():] if number else after
    if rest.startswith("/"):
        return None
    following = re.match(r"\s+([A-Za-z]+)", rest)
    if following is not None and following.group(1).lower() in RESULT_WORDS:
        return None
    before = line[:number_start].rstrip().rstrip("*")
    if not before.endswith(":"):
        return None
    words = before[:-1].split()
    if not words:
        return None
    term = words[-1].strip("*").lower()
    if term not in PLURAL_COUNT_TERMS:
        return None
    return term, before.rfind(words[-1])


def term_keeps(term: str, path: Path) -> bool:
    """Tell whether a file in a named folder is one of the things a count term counts."""
    singular = term[:-2] if term.endswith("es") and term[:-2] in COUNT_TERMS else term.rstrip("s")
    if singular in ("script", "plugin"):
        return path.suffix in SCRIPT_SUFFIXES
    if singular in ("test", "suite"):
        return is_test_file(path.name)
    if singular == "symlink":
        return path.is_symlink()
    return True


def folder_values(folder: Path, term: str) -> set[int]:
    """Count the files a term names in a folder, directly and recursively.

    Dot folders and ``node_modules`` are not walked, and README files and
    dotfiles are not counted, since neither is what a README counts.
    """
    direct = [path for path in direct_files(folder) if term_keeps(term, path)]
    recursive = 0
    for current, dirnames, filenames in os.walk(folder):
        dirnames[:] = [name for name in dirnames if not name.startswith(".") and name not in WALK_SKIP]
        for name in filenames:
            if name != "README.md" and not name.startswith(".") and term_keeps(term, Path(current) / name):
                recursive += 1
    return {len(direct), recursive}


def normalize_phrase(phrase: str) -> str:
    """Compare claim phrases without regard to case or spacing."""
    return " ".join(phrase.lower().split())


def parse_markers(text: str) -> tuple[dict[str, tuple[int, str]], list[tuple[int, str]], str]:
    """Read allow-count entries from readme-check blocks and return the text with blocks blanked."""
    entries: dict[str, tuple[int, str]] = {}
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
        directive, _space, rest = body.partition(" ")
        if directive != "allow-count":
            continue
        phrase, bar, reason = rest.partition("|")
        if not bar or not phrase.strip() or not reason.strip():
            errors.append((index + 1, "allow-count entry needs '<phrase> | <reason>'"))
        else:
            entries[normalize_phrase(phrase)] = (index + 1, reason.strip())
    return entries, errors, "\n".join(lines)


def is_label(line: str, tokens: list[re.Match[str]], start: int) -> bool:
    """Tell a label or bound such as ``Gate 4`` or ``more than 100`` from a count."""
    earlier = [token for token in tokens if token.end() <= start]
    if not earlier:
        return False
    previous = earlier[-1]
    return previous.group(0).lower() in LABEL_WORDS and not line[previous.end():start].strip("* ")


def same_sentence_folder(line: str, folders: list[re.Match[str]], number: re.Match[str]) -> str:
    """Return a folder span in the number's own sentence, so another sentence's folder is ignored."""
    for folder in folders:
        low, high = sorted((folder.start(), number.start()))
        if not re.search(r"[.!?]\s", line[low:high]):
            return folder.group(1)
    return ""


SENTENCE_BREAK = re.compile(r"(?<=[.!?])\s+(?=[A-Z`\[*(])")
SPAN_OR_LINK = re.compile(r"`([^`]+)`|\]\(([^)\s]+)\)")


def sentence_bounds(line: str, position: int) -> tuple[int, int]:
    """Return the start and end of the sentence holding position."""
    start, end = 0, len(line)
    for brk in SENTENCE_BREAK.finditer(line):
        if brk.end() <= position:
            start = brk.end()
        elif brk.start() >= position:
            end = brk.start()
            break
    return start, end


def names_own_folder(sentence: str, readme: Path, root: Path) -> bool:
    """Return whether a sentence names the README's own folder, as in `.claude/hooks/` contains."""
    for match in SPAN_OR_LINK.finditer(sentence):
        token = (match.group(1) or match.group(2) or "").split("#", 1)[0].strip()
        if not token or token.startswith(("http", "#")):
            continue
        for base in (readme.parent, root):
            if Path(os.path.normpath(base / token)) == readme.parent:
                return True
    return False


def names_other_path(sentence: str, readme: Path) -> bool:
    """Return whether a sentence names a path other than a direct file of the README folder."""
    for ref in extract_references(sentence):
        # A direct file of the README folder, symlink or not, is the README's own.
        literal = Path(os.path.normpath(readme.parent / ref))
        if literal.parent == readme.parent and (literal.is_file() or literal.is_symlink()):
            continue
        return True
    return False


def describes_other_path(line: str, position: int, readme: Path, root: Path) -> bool:
    """Return whether the sentence around position counts something outside the README folder.

    Only the sentence that holds the number is read. It describes another path
    when it names one and does not also name the README's own folder.
    """
    start, end = sentence_bounds(line, position)
    sentence = line[start:end]
    return names_other_path(sentence, readme) and not names_own_folder(sentence, readme, root)


def line_claims(text: str, readme: Path | None = None, root: Path | None = None) -> list[CountClaim]:
    """Find numeric or vague count claims about the README's own folder or a folder its sentence names."""
    claims: list[CountClaim] = []
    in_fence = False
    tree_root = ""
    tree_stack: list[tuple[int, str]] = []
    for line_number, line in enumerate(text.splitlines(), start=1):
        if line.lstrip().startswith("```"):
            in_fence = not in_fence
            tree_root, tree_stack = "", []
            continue
        if re.match(r"^\s*#{1,6}\s+\d+\.", line):
            continue
        if not WORD_PATTERN.search(line):
            continue
        # Text after a folder entry on a tree line describes that folder, `#` or not.
        tree_dir, described_from = "", len(line)
        entry = TREE_ENTRY_PATTERN.match(line) if in_fence else None
        if entry is not None:
            depth = len(entry.group("lead"))
            while tree_stack and tree_stack[-1][0] >= depth:
                tree_stack.pop()
            name = entry.group("name")
            if name.endswith("/"):
                tree_stack.append((depth, name.rstrip("/")))
                tree_dir, described_from = "/".join(part for _depth, part in tree_stack) + "/", entry.start("rest")
        elif in_fence and not tree_root and TREE_ROOT_PATTERN.match(line):
            tree_root = TREE_ROOT_PATTERN.match(line).group("name")
        dynamic = in_fence and any(token in line for token in ("find ", "ls ", "wc", "glob"))
        tokens = list(WORD_PATTERN.finditer(line))
        folders = list(FOLDER_SPAN.finditer(line))
        for match in NUMBER_PATTERN.finditer(line):
            # A number glued to other text ("LIVE=1", "one-shot", "v2.1") is not a count.
            if match.start() > 0 and line[match.start() - 1] not in " \t(|*":
                continue
            if match.end() < len(line) and line[match.end()] in "-.":
                continue
            value_token = match.group(0).lower()
            if value_token == "one":
                continue
            if is_label(line, tokens, match.start()):
                continue
            counted = counted_term(line, match.end())
            phrase_start = match.start()
            if counted is None:
                labelled = labelled_term(line, match.start())
                if labelled is None:
                    continue
                counted, phrase_start = (labelled[0], match.end(), 0), labelled[1]
            term, term_end, gap = counted
            in_tree = bool(tree_dir) and match.start() >= described_from
            folder = tree_dir if in_tree else same_sentence_folder(line, folders, match)
            if gap == MAX_MODIFIERS and not folder:
                continue
            if not in_tree and readme is not None and root is not None and describes_other_path(
                line, match.start(), readme, root,
            ):
                continue
            value = int(value_token) if value_token.isdigit() else NUMBER_WORDS[value_token]
            claims.append(
                CountClaim(
                    line_number,
                    value,
                    term,
                    line.strip(),
                    "dynamic derivation" if dynamic else "numeric count",
                    folder,
                    # Bold markers in a label form are layout, so `**Files:** 12` reads `files: 12`.
                    normalize_phrase(line[phrase_start:term_end].replace("*", "")),
                    tree_root if in_tree else "",
                )
            )
        for vague in VAGUE_TERMS:
            vague_match = re.search(rf"\b{vague}\b", line, re.IGNORECASE)
            if vague_match is None:
                continue
            counted = counted_term(line, vague_match.end())
            if counted is None:
                continue
            if readme is not None and root is not None and describes_other_path(line, vague_match.start(), readme, root):
                continue
            claims.append(CountClaim(line_number, None, counted[0], line.strip(), "unparseable count"))
    return claims


def named_folder(claim: CountClaim, folder: Path, root: Path) -> Path | None:
    """Resolve the folder a claim names, from the README or the repository root.

    A tree entry is tried under its tree's root line first, then from the
    README folder, since a root line often repeats the README folder's name.
    """
    if not claim.folder:
        return None
    relatives = [claim.tree_root + claim.folder] if claim.tree_root else []
    relatives.append(claim.folder)
    for relative in relatives:
        for base in (folder, root):
            candidate = base / relative
            if candidate.is_dir():
                return candidate
    return None


def evaluate_claim(claim: CountClaim, text: str, folder: Path, root: Path | None = None) -> bool:
    """Accept only dynamic, named-folder or complete-inventory-backed claims.

    A claim that names a folder is judged against that folder only: a folder
    that does not exist fails rather than falling back to the README folder.
    """
    if claim.reason == "dynamic derivation":
        return True
    if claim.value is None:
        return False
    if claim.folder:
        target = named_folder(claim, folder, root or folder)
        if target is None:
            return False
        values = folder_values(target, claim.term)
        if target.resolve() == folder.resolve():
            values |= derived_values(target).get(claim.term, set())
        return claim.value in values
    values = derived_values(folder)
    if claim.value not in values.get(claim.term, set()):
        return False
    return source_inventory_complete(text, folder)


def check_readme(readme_arg: str) -> tuple[list[CountClaim], list[CountClaim], Path | None]:
    """Return count claims, failures, and a missing README marker."""
    readme = Path(readme_arg).resolve()
    if not readme.is_file():
        return [], [], readme
    try:
        root = repository_root(readme)
        text = readme.read_text(encoding="utf-8")
    except (OSError, subprocess.CalledProcessError):
        return [], [], readme
    allowed, errors, text = parse_markers(text)
    claims = line_claims(text, readme, root)
    failures: list[CountClaim] = []
    used: set[str] = set()
    for claim in claims:
        if evaluate_claim(claim, text, readme.parent, root):
            continue
        if claim.phrase in allowed:
            used.add(claim.phrase)
            continue
        failures.append(claim)
    for line, message in errors:
        failures.append(CountClaim(line, None, "readme-check", message, "malformed marker"))
    for phrase, (line, _reason) in allowed.items():
        if phrase not in used:
            failures.append(CountClaim(line, None, phrase, "allow-count matches no failing claim", "unused marker"))
    return claims, failures, None


def print_result(readme_arg: str, claims: list[CountClaim], failures: list[CountClaim], missing: Path | None) -> bool:
    """Print one count-gate verdict."""
    if missing is not None:
        print(f"FAIL {readme_arg}: README is missing or unreadable")
        return False
    for claim in failures:
        print(f"  line {claim.line}: {claim.reason} for {claim.term!r}: {claim.text}")
    status = "PASS" if not failures else "FAIL"
    print(f"{status} {readme_arg}: claims={len(claims)} failures={len(failures)}")
    return not failures


def run_self_test() -> int:
    """Exercise derived, stale, unparseable, prose and named-folder count behavior."""
    with tempfile.TemporaryDirectory() as temp_dir:
        root = Path(temp_dir)
        subprocess.run(["git", "-C", str(root), "init", "-q"], check=True)
        (root / "alpha.ts").write_text("", encoding="utf-8")
        (root / "beta.ts").write_text("", encoding="utf-8")
        positive = root / "README.md"
        positive.write_text(
            "Two files are listed in the inventory.\n\n"
            "| File | Role |\n|---|---|\n| `alpha.ts` | A |\n| `beta.ts` | B |\n",
            encoding="utf-8",
        )
        claims, failures, missing = check_readme(str(positive))
        if missing is not None or not print_result("self-test-positive", claims, failures, missing):
            return 1

        negative = root / "negative.md"
        negative.write_text("Two files are listed, but only `alpha.ts` is documented.\n", encoding="utf-8")
        claims, failures, missing = check_readme(str(negative))
        if missing is not None or print_result("self-test-negative", claims, failures, missing):
            return 1

        vague = root / "vague.md"
        vague.write_text("Several files are present.\n", encoding="utf-8")
        claims, failures, missing = check_readme(str(vague))
        if missing is not None or print_result("self-test-unparseable", claims, failures, missing):
            return 1

        (root / "rules").mkdir()
        for name in ("a.md", "b.md", "c.md"):
            (root / "rules" / name).write_text("", encoding="utf-8")
        prose = root / "prose.md"
        prose.write_text(
            "Three rule files live in `rules/`.\n"
            "Level 2 file set. Gate 4: Workflow tiebreakers. It routes to five workflow modes.\n"
            "It blocks more than 100 tracked files. A fix in one file is exempt.\n",
            encoding="utf-8",
        )
        claims, failures, missing = check_readme(str(prose))
        if missing is not None or len(claims) != 1 or not print_result("self-test-prose", claims, failures, missing):
            return 1

        stale_folder = root / "stale-folder.md"
        stale_folder.write_text("Four rule files live in `rules/`.\n", encoding="utf-8")
        claims, failures, missing = check_readme(str(stale_folder))
        if missing is not None or print_result("self-test-stale-named-folder", claims, failures, missing):
            return 1

        # A marker suppresses only its own phrase: an unproven claim beside it still fails.
        marked = root / "marked.md"
        marked.write_text(
            "Two shell scripts list them. Five files live here.\n\n"
            "<!-- readme-check\nallow-count two shell scripts | the next bullets name both\n-->\n",
            encoding="utf-8",
        )
        claims, failures, missing = check_readme(str(marked))
        if missing is not None or [claim.term for claim in failures] != ["files"] or failures[0].value != 5:
            print("FAIL self-test-marker-scope")
            return 1
        for label, body in (
            ("marker-unused", "Nothing counted.\n\n<!-- readme-check\nallow-count two shell scripts | stale\n-->\n"),
            ("marker-no-reason", "Two shell scripts list them.\n\n<!-- readme-check\nallow-count two shell scripts\n-->\n"),
        ):
            target = root / f"{label}.md"
            target.write_text(body, encoding="utf-8")
            claims, failures, missing = check_readme(str(target))
            if missing is not None or print_result(f"self-test-{label}", claims, failures, missing):
                return 1
    print("SELF-TEST PASS: derived, stale, unparseable, prose, named-folder and marker count cases")
    return 0


def parse_args(argv: list[str]) -> argparse.Namespace:
    """Parse command-line arguments."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("readmes", nargs="*", help="README paths to check")
    parser.add_argument("--self-test", action="store_true", help="run built-in behavior checks")
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    """Run the derived-count gate."""
    args = parse_args(argv or sys.argv[1:])
    if args.self_test:
        return run_self_test()
    exit_if_validation_off("check_derived_readme_counts.py", argv)
    if not args.readmes:
        print("No README paths supplied", file=sys.stderr)
        return 2
    results = [print_result(path, *check_readme(path)) for path in args.readmes]
    print(
        f"SUMMARY files={len(results)} pass={sum(results)} "
        f"fail={len(results) - sum(results)}"
    )
    return 0 if all(results) else 1


if __name__ == "__main__":
    raise SystemExit(main())
