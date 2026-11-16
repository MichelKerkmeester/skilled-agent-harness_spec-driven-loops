#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: HOOK README BRIEF BUILDER
# ───────────────────────────────────────────────────────────────

"""
Fill a brief template for one hook README and write the brief.

Run it from the repository root.

Usage: python3 build-brief.py <feature|leaf> <readme path> [--name NAME]
           [--shape PATH] [--notes FILE]
Output: writes scratch/briefs/<name>.md, merges the automatic removals into
        scratch/removals/<path under hooks>.txt and prints
        "BRIEF <path> lines=N removals=N".
        Exit 0 on success, 2 on a bad call or a brief of 90 lines or more.

Options:
    --name NAME    Brief name. A retry needs a new one, because a run folder is never reused.
    --shape PATH   The finished README the worker copies the shape from.
    --notes FILE   Lines for the "Facts for this file" step, one fact per line.
    --new          The README was created in this phase and has no saved copy.
"""

import argparse
import csv
import importlib.util
import re
import sys
from pathlib import Path
from typing import Dict, List

# ───────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ───────────────────────────────────────────────────────────────

SCRATCH = Path(__file__).resolve().parent
BRIEFS = SCRATCH / "briefs"
FOLD_MAP = SCRATCH / "fold-map.tsv"
DELETED_READMES = SCRATCH / "deleted-readmes.txt"
WORKED_EXAMPLE = Path(".skilled/hooks/codex-global-hooks-check/README.md")

LINE_LIMIT = 90
INLINE_REMOVAL_LIMIT = 10
INLINE_ROW_LIMIT = 10
SKIPPED_NAMES = frozenset({"README.md", "node_modules", "tests", "__pycache__"})
UNRESOLVED_INLINE = re.compile(r"inline '([^']+)': path does not exist")
RUNTIME_LABELS = {
    "claude": "Claude", "codex": "Codex", "cursor": "Cursor", "devin": "Devin",
    "dsh": "DSH", "pi": "Pi", "opencode": "OpenCode", "vibe": "Vibe", "shared": "Shared",
}


def load_gates():
    """Load readme-gates.py as a module, so both scripts read tokens and phrases the same way."""
    spec = importlib.util.spec_from_file_location("readme_gates", SCRATCH / "readme-gates.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


GATES = load_gates()

# ───────────────────────────────────────────────────────────────
# 2. THE FACTS A BRIEF CARRIES
# ───────────────────────────────────────────────────────────────


def deleted_readmes() -> List[Path]:
    """List the leaf READMEs the phase deletes, as paths from the repository root."""
    lines = DELETED_READMES.read_text(encoding="utf-8").splitlines()
    return [Path(".skilled") / line.strip() for line in lines if line.strip()]


def fold_rows(feature: str, name: str) -> str:
    """
    Format the fold-map rows of one feature as indented list lines.

    A TypeScript adapter and its compiled twin share a runtime and an event, so
    they share one line. A list longer than the inline limit goes to a side file
    the brief names, which keeps the brief under its line limit.
    """
    with FOLD_MAP.open(encoding="utf-8", newline="") as handle:
        rows = [row for row in csv.DictReader(handle, delimiter="\t") if row["feature"] == feature]
    if not rows:
        return "   - none: this folder has no subfolder that holds only links."
    grouped: Dict[tuple, List[dict]] = {}
    for row in rows:
        stem = Path(row["link"]).stem
        grouped.setdefault((row["runtime"], row["event"], stem), []).append(row)
    lines = []
    for (runtime, event, _), group in grouped.items():
        entries = " and ".join(f"`{runtime}/{row['link']}`" for row in group)
        reals = " and ".join(f"`{row['real file']}`" for row in group)
        lines.append(
            f"   - {RUNTIME_LABELS.get(runtime, runtime)}: event `{event}`, entry {entries}, real file {reals}"
        )
    if len(lines) <= INLINE_ROW_LIMIT:
        return "\n".join(lines)
    side_file = BRIEFS / f"{name}.rows.txt"
    side_file.write_text("\n".join(line.strip()[2:] for line in lines) + "\n", encoding="utf-8")
    return f"   - the {len(lines)} lines of {side_file}, one row each."


def leaf_triggers(readme: Path) -> str:
    """List the trigger phrases of the deleted leaf READMEs that the feature README lacks."""
    kept = set(GATES.trigger_phrases(readme.read_text(encoding="utf-8"))) if readme.is_file() else set()
    added: Dict[str, None] = {}
    for leaf in deleted_readmes():
        if leaf.parent.parent != readme.parent:
            continue
        saved = GATES.BEFORE / leaf.relative_to(GATES.HOOKS)
        for phrase in GATES.trigger_phrases(saved.read_text(encoding="utf-8")):
            if phrase not in kept:
                added.setdefault(phrase, None)
    return ", ".join(f'"{phrase}"' for phrase in added) or "none"


def describe_entry(entry: Path, root: Path) -> str:
    """Name one folder entry by absolute path, with the real file when it is a link."""
    if entry.is_symlink():
        return f"{root / entry} (a link to {entry.resolve()})"
    return f"{root / entry}/" if entry.is_dir() else str(root / entry)


def sources(tier: str, folder: Path, root: Path) -> str:
    """List the files a worker reads: the folder's entries, and one level down for a feature."""
    entries = sorted(entry for entry in folder.iterdir() if entry.name not in SKIPPED_NAMES)
    if tier == "leaf":
        return ", ".join(describe_entry(entry, root) for entry in entries) or "none"
    files: List[Path] = []
    for entry in entries:
        if entry.is_dir() and not entry.is_symlink():
            files += [child for child in sorted(entry.iterdir()) if child.name not in SKIPPED_NAMES]
        else:
            files.append(entry)
    # Several runtime folders link the same real file, so a link is listed once, as that file.
    listed: Dict[str, None] = {}
    for item in files:
        if ".test." not in item.name:
            listed.setdefault(str(item.resolve()) if item.is_symlink() else describe_entry(item, root), None)
    return ", ".join(listed) or "none"


def merge_removals(readme: Path, saved: Path) -> List[str]:
    """
    Add the removals a rewrite always needs to the file's removal list.

    Two kinds are certain before any worker runs: a backticked path the
    reference checker cannot resolve, and a backticked link to a leaf README
    the phase deletes.

    Args:
        readme: The README as named on the command line
        saved: Its copy from before the first edit

    Returns:
        Every line of the merged list, as "token<TAB>reason"
    """
    listing = GATES.REMOVALS / (str(saved.relative_to(GATES.BEFORE)) + ".txt")
    lines = listing.read_text(encoding="utf-8").splitlines() if listing.is_file() else []
    known = {line.split("\t", 1)[0].strip() for line in lines if line.strip()}
    doomed = {path.resolve() for path in deleted_readmes()}

    report = GATES.run_python(GATES.REFERENCES, str(readme))
    found = {token: "the path does not exist, write the path that does" for token in UNRESOLVED_INLINE.findall(report)}
    for token in GATES.inline_tokens(saved.read_text(encoding="utf-8")):
        # A link resolves from the real file's folder, which differs for a README path that is a link.
        if token.endswith("README.md") and (readme.resolve().parent / token).resolve() in doomed:
            found[token] = "the linked README is deleted in this phase"
    lines += [f"{token}\t{reason}" for token, reason in found.items() if token not in known]

    if lines:
        listing.parent.mkdir(parents=True, exist_ok=True)
        listing.write_text("\n".join(lines) + "\n", encoding="utf-8")
    return [line for line in lines if line.strip()]


def removal_sentence(lines: List[str], listing_hint: Path) -> str:
    """Say which tokens may go: inline for a short list, by file for a long one."""
    if not lines:
        return "none."
    if len(lines) > INLINE_REMOVAL_LIMIT:
        return f"the {len(lines)} tokens listed one per line, before the tab, in {listing_hint}"
    return " ".join(f"`{token}` ({reason})." for token, reason in (line.split("\t", 1) for line in lines))


# ───────────────────────────────────────────────────────────────
# 3. ENTRY POINT
# ───────────────────────────────────────────────────────────────


def main() -> int:
    """Fill the template of the tier for one README and write the brief."""
    parser = argparse.ArgumentParser(description="Write one worker brief for a hook README.")
    parser.add_argument("tier", choices=("feature", "leaf"))
    parser.add_argument("readme")
    parser.add_argument("--name")
    parser.add_argument("--shape", default=str(WORKED_EXAMPLE))
    parser.add_argument("--notes")
    parser.add_argument("--new", action="store_true")
    options = parser.parse_args()

    readme = Path(options.readme)
    saved = GATES.before_copy(readme) if readme.is_file() else None
    # A README the phase creates has no saved copy. Only a missing file, or one
    # named --new for a correction pass on a created README, may lack one.
    if saved is None and not options.new and (readme.exists() or not readme.parent.is_dir()):
        print(f"Error: no saved copy for {readme}. Run from the repository root.", file=sys.stderr)
        return 2

    root = Path.cwd()
    folder = readme.parent
    under_hooks = readme.relative_to(GATES.HOOKS).parent
    name = options.name or "--".join(under_hooks.parts) or "root"
    removals = merge_removals(readme, saved) if saved else []
    if saved is None:
        saved = "none, this README is new. Write it from the code, and give it a frontmatter with title, description, trigger_phrases, importance_tier and contextType as in the shape file"
    notes = Path(options.notes).read_text(encoding="utf-8").rstrip() if options.notes else ""
    values = {
        "ROOT": str(root),
        "PACKET": str(SCRATCH.parent),
        "GATES": str(SCRATCH / "readme-gates.py"),
        "OUTPUT": str(readme.resolve()),
        "OUTPUT_REL": str(readme),
        "BEFORE": str(saved),
        "SHAPE": str(root / options.shape),
        "FOLDER": f"{root / folder}/",
        "SOURCES": sources(options.tier, folder, root),
        "TRIGGERS": leaf_triggers(readme),
        "FOLD_ROWS": fold_rows(folder.name, name),
        "FINDINGS": notes or "   - none beyond what the source files show.",
        "REMOVALS": removal_sentence(removals, GATES.REMOVALS / (str(under_hooks / "README.md") + ".txt")),
    }

    text = (BRIEFS / f"template-{options.tier}.md").read_text(encoding="utf-8")
    for key, value in values.items():
        text = text.replace("{{" + key + "}}", value)
    count = len(text.splitlines())
    if count >= LINE_LIMIT:
        print(f"Error: the brief has {count} lines, the limit is {LINE_LIMIT - 1}.", file=sys.stderr)
        return 2
    brief = BRIEFS / f"{name}.md"
    brief.write_text(text, encoding="utf-8")
    print(f"BRIEF {brief} lines={count} removals={len(removals)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
