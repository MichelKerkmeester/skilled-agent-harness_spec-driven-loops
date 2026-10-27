#!/usr/bin/env python3
"""Reject stale or unproven numeric file and suite counts in READMEs.

Usage: python3 check_derived_readme_counts.py [--self-test] README.md [...]

Numeric counts are accepted only when a complete direct-file inventory in the
README independently derives the claimed category. Dynamic shell derivations
using ``find``, ``ls``, or ``wc`` are also accepted. Vague count words fail
closed because they cannot be compared with the source directory.

A claim is a number followed within three words, inside one clause, by a count
term that agrees with it in grammatical number: ``13 rule files`` is a claim,
while ``Level 2 file set`` (a label), ``five workflow modes`` (a singular noun
used as a modifier), ``more than 100 tracked files`` (a threshold) and ``in one
file`` (an article) are not. A claim whose line names a folder in a code span,
such as ``.skilled/repo-rules/``, is derived from that folder instead.

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
import re
import subprocess
import sys
import tempfile
from dataclasses import dataclass
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "shared" / "scripts"))
from validation_switch import exit_if_validation_off  # type: ignore  # noqa: E402


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
CLAUSE_BREAK = re.compile(r"[.,;:|()]")
FOLDER_SPAN = re.compile(r"`([^`\s]+/)`")
TERM_WINDOW = 3
NUMBER_PATTERN = re.compile(r"\b(?:\d+|" + "|".join(NUMBER_WORDS) + r")\b", re.IGNORECASE)
WORD_PATTERN = re.compile(r"[A-Za-z][A-Za-z0-9_./*-]*")
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


def repository_root(readme: Path) -> Path:
    """Return the checkout root independently of the caller's CWD."""
    result = subprocess.run(
        ["git", "-C", str(readme.parent), "rev-parse", "--show-toplevel"],
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


def derived_values(folder: Path) -> dict[str, set[int]]:
    """Derive count categories from the current directory contents."""
    files = direct_files(folder)
    regular = [path for path in files if not path.is_symlink()]
    symlinks = [path for path in files if path.is_symlink()]
    test_files = [
        path for path in regular
        if path.name.endswith((".test.cjs", ".test.js", ".test.ts", ".vitest.ts"))
    ]
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


def following_term(line: str, tokens: list[re.Match[str]], end: int) -> re.Match[str] | None:
    """Return the count term token a number counts, read from the words after it."""
    later = [token for token in tokens if token.start() >= end][:TERM_WINDOW]
    for token in later:
        if CLAUSE_BREAK.search(line[end:token.start()]):
            return None
        if token.group(0).lower() in COUNT_TERMS:
            return token
    return None


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


def same_sentence_folder(line: str, folders: list[re.Match[str]], number: re.Match[str]) -> str:
    """Return a folder span in the number's own sentence, so another sentence's folder is ignored."""
    for folder in folders:
        low, high = sorted((folder.start(), number.start()))
        if not re.search(r"[.!?]\s", line[low:high]):
            return folder.group(1)
    return ""


def is_label(line: str, tokens: list[re.Match[str]], start: int) -> bool:
    """Tell a label or bound such as ``Gate 4`` or ``more than 100`` from a count."""
    earlier = [token for token in tokens if token.end() <= start]
    if not earlier:
        return False
    previous = earlier[-1]
    return previous.group(0).lower() in LABEL_WORDS and not line[previous.end():start].strip("* ")


def agrees(value: int | None, term: str) -> bool:
    """A count above one names a plural term; a singular term is a modifier."""
    plural = term.endswith("s") and term not in {"harness"}
    if value == 1:
        return not plural
    return plural


def line_claims(text: str) -> list[CountClaim]:
    """Find numeric or vague count claims in prose and code output."""
    claims: list[CountClaim] = []
    in_fence = False
    for line_number, line in enumerate(text.splitlines(), start=1):
        if line.lstrip().startswith("```"):
            in_fence = not in_fence
            continue
        if re.match(r"^\s*#{1,6}\s+\d+\.", line):
            continue
        words = [word.lower() for word in WORD_PATTERN.findall(line)]
        if not words:
            continue
        dynamic = in_fence and any(token in line for token in ("find ", "ls ", "wc", "glob"))
        tokens = list(WORD_PATTERN.finditer(line))
        folders = list(FOLDER_SPAN.finditer(line))
        for match in NUMBER_PATTERN.finditer(line):
            value_token = match.group(0).lower()
            if value_token == "one":
                continue
            value = int(value_token) if value_token.isdigit() else NUMBER_WORDS[value_token]
            if is_label(line, tokens, match.start()):
                continue
            term_token = following_term(line, tokens, match.end())
            term = term_token.group(0).lower() if term_token is not None else None
            if term is None or not agrees(value, term):
                continue
            assert term_token is not None
            folder = same_sentence_folder(line, folders, match)
            claims.append(
                CountClaim(
                    line_number,
                    value,
                    term,
                    line.strip(),
                    "dynamic derivation" if dynamic else "numeric count",
                    folder,
                    normalize_phrase(line[match.start():term_token.end()]),
                )
            )
        for vague in VAGUE_TERMS:
            if re.search(rf"\b{vague}\b", line, re.IGNORECASE):
                vague_match = re.search(rf"\b{vague}\b", line, re.IGNORECASE)
                assert vague_match is not None
                term_token = following_term(line, tokens, vague_match.end())
                term = term_token.group(0).lower() if term_token is not None else None
                if term is not None and agrees(None, term):
                    claims.append(CountClaim(line_number, None, term, line.strip(), "unparseable count"))
    return claims


def named_folder(claim: CountClaim, folder: Path, root: Path) -> Path | None:
    """Resolve the folder a claim's line names, from the README or the repository root."""
    if not claim.folder:
        return None
    for base in (folder, root):
        candidate = base / claim.folder
        if candidate.is_dir():
            return candidate
    return None


def evaluate_claim(claim: CountClaim, text: str, folder: Path, root: Path | None = None) -> bool:
    """Accept only dynamic, named-folder or complete-inventory-backed claims."""
    if claim.reason == "dynamic derivation":
        return True
    if claim.value is None:
        return False
    target = named_folder(claim, folder, root or folder)
    if target is not None:
        return claim.value in derived_values(target).get(claim.term, set())
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
    claims = line_claims(text)
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
            "Two example files list them. Five files live here.\n\n"
            "<!-- readme-check\nallow-count two example files | the next bullets name both\n-->\n",
            encoding="utf-8",
        )
        claims, failures, missing = check_readme(str(marked))
        if missing is not None or [claim.term for claim in failures] != ["files"] or failures[0].value != 5:
            print("FAIL self-test-marker-scope")
            return 1
        for label, body in (
            ("marker-unused", "Nothing counted.\n\n<!-- readme-check\nallow-count two example files | stale\n-->\n"),
            ("marker-no-reason", "Two example files list them.\n\n<!-- readme-check\nallow-count two example files\n-->\n"),
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
