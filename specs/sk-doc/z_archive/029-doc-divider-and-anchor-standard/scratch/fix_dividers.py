#!/usr/bin/env python3
"""Insert-only, idempotent, fence-aware `---` divider fixer.

For every numbered ALL-CAPS H2 (`## N. TITLE`) that is not the first section and
whose nearest non-transparent line above is not `---`, insert a `---` divider
above it (above any contiguous `<!-- ... -->` comment block that sits directly
on top of the heading, matching the canonical `--- / blank / <!-- ANCHOR --> /
heading` shape).

GUARANTEES:
  - Never deletes a content line. Only inserts `---` and normalizes blank spacing
    immediately around the inserted divider.
  - Idempotent: running twice makes no further change.
  - Fence-aware: headings inside ``` code blocks are ignored.
  - Same scan scope + detection as scratch/census.py, so the flag-on validator
    (SKDOC_ENFORCE_STRUCTURE=1) reports 0 divider gaps afterward.

Usage:
  python3 fix_dividers.py --dry-run          # report counts, change nothing
  python3 fix_dividers.py --apply            # apply to the fleet
  python3 fix_dividers.py --apply <f1> <f2>  # apply to explicit files only
"""
import re, sys, pathlib, argparse

ROOTS = [".opencode/skills", ".opencode/commands", ".opencode/agents"]
SKIP = ("z_archive", "/tests/", "node_modules", "/dist/", "test-fixtures", "/scratch/")
H2 = re.compile(r'^##\s+(\d+)\.\s+(.+?)\s*$')

def is_upper(s):
    # section heading if the title minus any parenthetical qualifier is uppercase,
    # so "FILE-LAYER SURFACE (what the AI edits)" counts but title-case headings do not
    core = re.sub(r'\([^)]*\)', '', s).strip()
    return bool(core) and core == core.upper()
def transparent(s): return (not s) or bool(re.fullmatch(r'<!--.*-->', s))

def numbered_caps_h2(lines):
    fence = False; out = []
    for i, l in enumerate(lines):
        st = l.strip()
        if st.startswith("```"):
            fence = not fence; continue
        if fence: continue
        m = H2.match(l)
        if m and is_upper(m.group(2).strip()):
            out.append(i)
    return out

def needs_divider(lines, i):
    """True if heading at line index i lacks a `---` above (skipping transparent lines)."""
    j = i - 1
    while j >= 0 and transparent(lines[j].strip()):
        j -= 1
    return j >= 0 and lines[j].strip() != '---'   # j<0 (top of file) => first section, no divider

def fix_file(path):
    lines = path.read_text(errors="ignore").split("\n")
    idx = numbered_caps_h2(lines)
    # process bottom-up so earlier indices stay valid
    targets = [i for i in idx[1:] if needs_divider(lines, i)]
    if not targets:
        return 0
    for i in sorted(targets, reverse=True):
        # walk up over a contiguous comment block directly above the heading
        c = i
        while c - 1 >= 0 and lines[c - 1].strip().startswith("<!--"):
            c -= 1
        # drop blank lines immediately above the (comment block + heading)
        j = c
        while j - 1 >= 0 and lines[j - 1].strip() == "":
            del lines[j - 1]; j -= 1
        if j == 0:
            continue  # nothing above; treat as first section, skip
        lines[j:j] = ["", "---", ""]
    path.write_text("\n".join(lines))
    return len(targets)

def fleet_files():
    files = []
    for r in ROOTS:
        root = pathlib.Path(r)
        if root.exists():
            files += [p for p in root.rglob("*.md") if not any(s in str(p) for s in SKIP)]
    return files

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--apply", action="store_true")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("files", nargs="*")
    a = ap.parse_args()
    files = [pathlib.Path(f) for f in a.files] if a.files else fleet_files()
    changed = gaps = 0
    for p in files:
        lines = p.read_text(errors="ignore").split("\n")
        t = [i for i in numbered_caps_h2(lines)[1:] if needs_divider(lines, i)]
        if not t:
            continue
        gaps += len(t);
        if a.apply:
            fix_file(p)
        changed += 1
        if a.dry_run:
            print(f"  {len(t):2} gaps  {p}")
    print(f"{'APPLIED' if a.apply else 'WOULD FIX'}: files={changed} gaps={gaps}")

if __name__ == "__main__":
    main()
