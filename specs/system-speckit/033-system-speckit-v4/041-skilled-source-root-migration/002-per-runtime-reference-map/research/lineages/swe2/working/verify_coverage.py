#!/usr/bin/env python3
"""Convergence verification: every seed row appears in the map working files."""
import csv, glob, os, re

L = "specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/002-per-runtime-reference-map/research/lineages/swe2"
S = "specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/002-per-runtime-reference-map/scratch/seed-inventory"
os.chdir("/Users/michelkerkmeester/worktrees/public/055-skilled-source-root-migration")

def mapped_paths(pat):
    out = set()
    for f in glob.glob(os.path.join(L, "working", pat)):
        for line in open(f):
            m = re.match(r"\| `([^`]+)`", line)
            if m: out.add(m.group(1))
    return out

# Map A: symlinks
a_rows = list(csv.DictReader(open(os.path.join(S, "symlinks.tsv")), delimiter="\t"))
a_mapped = mapped_paths("map-a-*.md")
a_missing = [r["link"] for r in a_rows if r["link"] not in a_mapped]
print(f"MAP A: {len(a_rows)} seed, {len(a_mapped)} mapped, missing={len(a_missing)}")
for m in a_missing[:10]: print("  MISS:", m)

# Map B: runtime files + home
b_rows = [r for r in csv.DictReader(open(os.path.join(S, "tracked-refs.tsv")), delimiter="\t")
          if r["area"].startswith("runtime:")]
b_mapped = mapped_paths("map-b-*.md")
b_missing = [r["path"] for r in b_rows if r["path"] not in b_mapped]
print(f"MAP B (runtime files): {len(b_rows)} seed, mapped coverage missing={len(b_missing)}")
for m in b_missing[:10]: print("  MISS:", m)

h_rows = [r for r in csv.reader(open(os.path.join(S, "home-refs.tsv")), delimiter="\t")][1:]
h_mapped = mapped_paths("map-b-home.md")
# home rows: path col index — check header
print(f"MAP B (home): {len(h_rows)} seed rows; home table rows={len(h_mapped)}")

# Map C: non-runtime tracked refs
c_rows = [r for r in csv.DictReader(open(os.path.join(S, "tracked-refs.tsv")), delimiter="\t")
          if not r["area"].startswith("runtime:")]
c_mapped = mapped_paths("map-c--*.md")
c_missing = [r["path"] for r in c_rows if r["path"] not in c_mapped]
print(f"MAP C: {len(c_rows)} seed, {len(c_mapped)} mapped, missing={len(c_missing)}")
for m in c_missing[:15]: print("  MISS:", m)

# overlap check: file mapped in both B and C?
both = b_mapped & c_mapped
print(f"B∩C overlap: {len(both)}")
for m in list(both)[:5]: print("  OVERLAP:", m)
