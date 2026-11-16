#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: HOOK README GATES
# ───────────────────────────────────────────────────────────────

"""
Run the review gates for the hook README rewrite and print one verdict per file.

Run it from the repository root.

Usage: python3 readme-gates.py check [--detail] <file> [...]
       python3 readme-gates.py fold
       python3 readme-gates.py triggers
Output: check prints one tab-separated row per file: PASS or FAIL, the path,
        then G1 to G7 as ok, FAIL or n/a.
        fold prints "FOLD missing=N" and one line per link that is not named.
        triggers prints "TRIGGERS lost=N" and one line per lost phrase.
        Exit 0 when nothing fails, 1 when a gate fails, 2 on a bad call.

Options:
    --detail    Also print why each failing gate failed.
"""

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path
from typing import Dict, List, Optional, Tuple

# ───────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ───────────────────────────────────────────────────────────────

HOOKS = Path(".skilled/hooks")
DOC_SKILL = Path(".skilled/skills/sk-doc")
VALIDATE = DOC_SKILL / "shared/scripts/validate_document.py"
VOICE_SCAN = DOC_SKILL / "sk-create-with-human-voice/scripts/hvr_scan.py"
REFERENCES = DOC_SKILL / "sk-create-readme/scripts/check_readme_references.py"
COUNTS = DOC_SKILL / "sk-create-readme/scripts/check_derived_readme_counts.py"

SCRATCH = Path(__file__).resolve().parent
METRICS = SCRATCH.parent.parent / "scratch" / "readme-metrics.py"
BEFORE = SCRATCH / "before"
REMOVALS = SCRATCH / "removals"

README_NAME = "README.md"
SKIPPED_DIRECTORY = "node_modules"
WAIVED_RULE = "code_folder_inline_path"
ADVISOR_REFERENCE = "skill-advisor-hook.md"
SPLIT_README = HOOKS / "session-handover" / README_NAME
# The root README named a folder an earlier phase removed, so this phrase leaves with it.
DROPPED_PHRASES = frozenset({(README_NAME, "git hooks")})
GATES = ("G1", "G2", "G3", "G4", "G5", "G6", "G7")

FENCED_BLOCK = re.compile(r"^\s*(```|~~~).*?^\s*\1\s*$", re.DOTALL | re.MULTILINE)
INLINE_CODE = re.compile(r"`([^`\n]+)`")
HARD_BLOCKERS = re.compile(r"hard blockers:\s+(\d+)")
LIST_ITEM = re.compile(r"^\s+-\s+(.*)$")

# ───────────────────────────────────────────────────────────────
# 2. SHARED HELPERS
# ───────────────────────────────────────────────────────────────


def run_python(script: Path, *arguments: str) -> str:
    """Run one checker script and return what it printed on both streams."""
    result = subprocess.run(
        [sys.executable, str(script), *arguments], capture_output=True, text=True, check=False
    )
    return result.stdout + result.stderr


def split_frontmatter(text: str) -> Tuple[str, str]:
    """Return (frontmatter, body). The frontmatter is empty when the file has none."""
    if not text.startswith("---\n"):
        return "", text
    end = text.find("\n---", 4)
    if end == -1:
        return "", text
    return text[4:end], text[end + 4:]


def trigger_phrases(text: str) -> List[str]:
    """Read the trigger_phrases list from a file's frontmatter."""
    frontmatter, _ = split_frontmatter(text)
    phrases: List[str] = []
    in_list = False
    for line in frontmatter.splitlines():
        if line.startswith("trigger_phrases:"):
            in_list = True
            inline = line.split(":", 1)[1].strip()
            if inline.startswith("["):
                phrases.extend(part.strip().strip("\"'") for part in inline.strip("[]").split(",") if part.strip())
            continue
        if not in_list:
            continue
        item = LIST_ITEM.match(line)
        if not item:
            in_list = False
            continue
        phrases.append(item.group(1).strip().strip("\"'"))
    return phrases


def hook_readmes(root: Path) -> List[Path]:
    """List every README path under a tree, links included, without node_modules."""
    return sorted(p for p in root.rglob(README_NAME) if SKIPPED_DIRECTORY not in p.parts)


def before_copy(path: Path) -> Optional[Path]:
    """
    Find the saved copy of a file from before the first edit.

    A skill-owned file is saved under the hook README path that links to it.

    Args:
        path: The file being checked, as named on the command line

    Returns:
        The saved copy, or None when the file is new
    """
    real = path.resolve()
    hooks_root = HOOKS.resolve()
    candidates = [path] if hooks_root in real.parents else []
    candidates += [link for link in hook_readmes(HOOKS) if link.is_symlink() and link.resolve() == real]
    for candidate in candidates:
        try:
            saved = BEFORE / candidate.relative_to(HOOKS)
        except ValueError:
            continue
        if saved.is_file():
            return saved
    return None


# ───────────────────────────────────────────────────────────────
# 3. THE SEVEN GATES
# ───────────────────────────────────────────────────────────────


def gate_structure(path: Path) -> Tuple[str, str]:
    """G1: the document validator accepts the file."""
    output = run_python(VALIDATE, "--json", str(path))
    try:
        valid = json.loads(output).get("valid") is True
    except json.JSONDecodeError:
        return "FAIL", f"validate_document.py printed no JSON: {output[:200]}"
    return ("ok", "") if valid else ("FAIL", "validate_document.py reports the file as not valid")


def gate_code_folder(path: Path) -> Tuple[str, str]:
    """
    G2: the code-folder rules hold, apart from the waived inline-path rule.

    The validator resolves relative links from the README's own folder, so a
    README path that is a link is checked at the file it points to.
    """
    real = path.resolve()
    if real.name != README_NAME:
        return "n/a", ""
    output = run_python(VALIDATE, "--type", "code_folder", "--json", str(real))
    try:
        errors = json.loads(output).get("blocking_errors", [])
    except json.JSONDecodeError:
        return "FAIL", f"validate_document.py printed no JSON: {output[:200]}"
    blocking = [error for error in errors if error.get("type") != WAIVED_RULE]
    if not blocking:
        return "ok", ""
    reasons = "; ".join(f"{error.get('type')}: {str(error.get('message'))[:140]}" for error in blocking[:8])
    return "FAIL", reasons


def gate_voice(path: Path) -> Tuple[str, str]:
    """G3: the human voice scan reports no hard blocker."""
    output = run_python(VOICE_SCAN, str(path))
    found = HARD_BLOCKERS.search(output)
    if not found:
        return "FAIL", f"hvr_scan.py printed no hard blocker count: {output[:200]}"
    count = int(found.group(1))
    return ("ok", "") if count == 0 else ("FAIL", f"hard blockers: {count}")


def gate_summary_line(script: Path, path: Path) -> Tuple[str, str]:
    """G4, G5 and G6: the checker prints a PASS line for the file."""
    output = run_python(script, str(path))
    lines = output.splitlines()
    if any(line.startswith("PASS ") for line in lines):
        return "ok", ""
    reasons = [line.strip() for line in lines if line.strip() and not line.startswith(("SUMMARY", "TOTAL"))]
    return "FAIL", " | ".join(reasons[:8])[:900] or "the checker printed no PASS line"


def inline_tokens(text: str) -> List[str]:
    """List the inline code spans of a file's body, in order, without repeats."""
    _, body = split_frontmatter(text)
    seen: Dict[str, None] = {}
    for token in INLINE_CODE.findall(FENCED_BLOCK.sub("", body)):
        seen.setdefault(token.strip(), None)
    return list(seen)


def allowed_removals(saved: Path) -> List[str]:
    """Read the tokens a brief lists as removed on purpose, one per line before a tab."""
    listing = REMOVALS / (str(saved.relative_to(BEFORE)) + ".txt")
    if not listing.is_file():
        return []
    return [line.split("\t", 1)[0].strip() for line in listing.read_text(encoding="utf-8").splitlines() if line.strip()]


def gate_identifiers(path: Path) -> Tuple[str, str]:
    """
    G7: every inline code token of the old file is still present.

    The split session-handover README is read together with the documents next
    to it, because its sections moved into them.
    """
    saved = before_copy(path)
    if saved is None:
        return "n/a", ""
    current = path.read_text(encoding="utf-8")
    if path.resolve() == SPLIT_README.resolve():
        current += "".join(
            sibling.read_text(encoding="utf-8") for sibling in sorted(path.parent.glob("*.md")) if sibling != path
        )
    removed = set(allowed_removals(saved))
    missing = [
        token for token in inline_tokens(saved.read_text(encoding="utf-8"))
        if token not in current and token not in removed
    ]
    if not missing:
        return "ok", ""
    return "FAIL", f"{len(missing)} missing: " + " ; ".join(missing[:40])


def check_file(path: Path) -> Dict[str, Tuple[str, str]]:
    """Run the seven gates on one file and return a (state, reason) pair for each."""
    return {
        "G1": gate_structure(path),
        "G2": gate_code_folder(path),
        "G3": gate_voice(path),
        "G4": gate_summary_line(REFERENCES, path),
        "G5": gate_summary_line(COUNTS, path),
        "G6": gate_summary_line(METRICS, path),
        "G7": gate_identifiers(path),
    }


# ───────────────────────────────────────────────────────────────
# 4. SUBCOMMANDS
# ───────────────────────────────────────────────────────────────


def command_check(files: List[str], detail: bool) -> int:
    """Print one row per file and return 1 when a gate failed."""
    missing = [name for name in files if not Path(name).is_file()]
    if missing:
        print(f"Error: no file at: {', '.join(missing)}", file=sys.stderr)
        return 2
    failed = 0
    for name in files:
        results = check_file(Path(name))
        verdict = "FAIL" if any(state == "FAIL" for state, _ in results.values()) else "PASS"
        failed += verdict == "FAIL"
        print("\t".join([verdict, name] + [f"{gate}={results[gate][0]}" for gate in GATES]))
        if detail:
            for gate in GATES:
                state, reason = results[gate]
                if state == "FAIL":
                    print(f"  {gate}: {reason}")
    return 1 if failed else 0


def link_only_folders() -> List[Path]:
    """List the folders under the hooks tree that hold links and nothing else, a README aside."""
    folders: List[Path] = []
    for folder in sorted(p for p in HOOKS.rglob("*") if p.is_dir() and not p.is_symlink()):
        if SKIPPED_DIRECTORY in folder.parts:
            continue
        entries = [entry for entry in folder.iterdir() if entry.name != README_NAME]
        if entries and all(entry.is_symlink() for entry in entries):
            folders.append(folder)
    return folders


def command_fold() -> int:
    """Check that the README one level up names each link of a link-only folder."""
    missing: List[str] = []
    links = 0
    folders = link_only_folders()
    for folder in folders:
        parent_readme = folder.parent / README_NAME
        text = parent_readme.read_text(encoding="utf-8") if parent_readme.is_file() else ""
        for link in sorted(entry for entry in folder.iterdir() if entry.name != README_NAME):
            links += 1
            needle = f"{folder.name}/{link.name}"
            if needle not in text:
                missing.append(f"{folder.parent.name}\t{needle}")
    print(f"FOLD missing={len(missing)} links={links} folders={len(folders)}")
    for line in missing:
        print(f"  {line}")
    return 1 if missing else 0


def command_triggers() -> int:
    """Check that no trigger phrase of the saved READMEs was lost."""
    lost: List[str] = []
    phrases = 0
    for saved in hook_readmes(BEFORE):
        relative = saved.relative_to(BEFORE)
        current = HOOKS / relative
        holder = current if current.is_file() else HOOKS / relative.parent.parent / README_NAME
        kept = set(trigger_phrases(holder.read_text(encoding="utf-8"))) if holder.is_file() else set()
        for phrase in trigger_phrases(saved.read_text(encoding="utf-8")):
            phrases += 1
            if phrase in kept or (str(relative), phrase) in DROPPED_PHRASES:
                continue
            lost.append(f"{relative}\t{phrase}\t(expected in {holder})")
    print(f"TRIGGERS lost={len(lost)} phrases={phrases}")
    for line in lost:
        print(f"  {line}")
    return 1 if lost else 0


# ───────────────────────────────────────────────────────────────
# 5. ENTRY POINT
# ───────────────────────────────────────────────────────────────


def main() -> int:
    """Parse the subcommand and run it from the repository root."""
    parser = argparse.ArgumentParser(description="Review gates for the hook README rewrite.")
    commands = parser.add_subparsers(dest="command", required=True)
    check = commands.add_parser("check", help="run the seven gates on each file")
    check.add_argument("files", nargs="+")
    check.add_argument("--detail", action="store_true", help="print why each failing gate failed")
    commands.add_parser("fold", help="check that each link of a link-only folder is named one level up")
    commands.add_parser("triggers", help="check that no trigger phrase was lost")
    options = parser.parse_args()

    if not HOOKS.is_dir():
        print(f"Error: {HOOKS} not found. Run from the repository root.", file=sys.stderr)
        return 2
    if options.command == "check":
        return command_check(options.files, options.detail)
    if options.command == "fold":
        return command_fold()
    return command_triggers()


if __name__ == "__main__":
    sys.exit(main())
