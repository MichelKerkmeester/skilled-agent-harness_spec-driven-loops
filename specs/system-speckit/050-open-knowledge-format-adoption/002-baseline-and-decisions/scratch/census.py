#!/usr/bin/env python3
"""Frozen baseline census for the R1 R5 R9 adoption program.

Reads every document from git objects at one commit, so a rerun on that commit
gives the same numbers no matter what the working tree holds.

Usage:
  git log -M --diff-filter=R --name-status --format='C %H %ct' <commit> > renames.txt
  python3 census.py <commit> renames.txt > census.json

Families:
  spec   tracked .md under specs/, excluding any path with a z_archive segment
  skill  tracked .md under .skilled/skills/

Citation classes, tested in order for each `path.ext:line` outside a fence:
  in_range        doc-relative or repo-root path exists at the commit and the line fits
  past_end        the path exists but the line or range end is past its last line
  moved           the path is gone, a rename chain from git history reaches a path
                  that exists; split into moved_in_range and moved_past_end
  basename_only   the path is gone, no rename chain, but exactly one tracked file
                  has the same basename (the current scanner accepts these silently)
  ambiguous       the path is gone and several tracked files share its basename
  gone            none of the above
"""
import collections
import json
import posixpath
import re
import subprocess
import sys

CITATION_RE = re.compile(r"(?<![\w./-])([A-Za-z0-9_./-]+\.(?:ts|cjs|mjs|js|py|md|json|sh)):(\d+)(?:-(\d+))?")
FENCE_RE = re.compile(r"^\s*(?:```|~~~)")
SOURCE_TAG_RE = re.compile(r"\[SOURCE:[^\]]*\]")
FM_KEY_RE = re.compile(r"^(contextType|importance_tier):\s*(.*?)\s*$")


def git(*args, input_bytes=None):
    return subprocess.run(["git", *args], input=input_bytes, capture_output=True, check=True).stdout


def tracked_files(commit):
    out = git("ls-tree", "-r", "-z", "--full-tree", "--name-only", commit)
    return [p for p in out.decode("utf-8", "replace").split("\0") if p]


def read_blobs(commit, paths):
    """Yield (path, text) for each path using one cat-file --batch process."""
    proc = subprocess.Popen(["git", "cat-file", "--batch"], stdin=subprocess.PIPE, stdout=subprocess.PIPE)
    for p in paths:
        proc.stdin.write(f"{commit}:{p}\n".encode())
        proc.stdin.flush()
        header = proc.stdout.readline().decode()
        parts = header.split()
        if len(parts) < 3 or parts[1] == "missing":
            continue
        size = int(parts[2])
        data = proc.stdout.read(size)
        proc.stdout.read(1)
        yield p, data.decode("utf-8", "replace")
    proc.stdin.close()
    proc.wait()


def family(path):
    if path.endswith(".md") and path.startswith("specs/") and "/z_archive/" not in f"/{path}":
        return "spec"
    if path.endswith(".md") and path.startswith(".skilled/skills/"):
        return "skill"
    return None


def frontmatter_values(text):
    if not text.startswith("---"):
        return None
    end = text.find("\n---", 3)
    if end < 0:
        return None
    values = {}
    for line in text[3:end].splitlines():
        m = FM_KEY_RE.match(line)
        if m:
            values[m.group(1)] = m.group(2).strip("'\"").lower()
    return values


def load_renames(path):
    """Map old path -> newest successor. The log is newest first, so read it reversed."""
    records = []
    with open(path, encoding="utf-8", errors="replace") as fh:
        for line in fh:
            if line.startswith("R"):
                parts = line.rstrip("\n").split("\t")
                if len(parts) == 3:
                    records.append((parts[1], parts[2]))
    succ = {}
    for old, new in reversed(records):
        succ[old] = new
    return succ


def follow(succ, path, exists, limit=50):
    seen = set()
    cur = path
    while cur in succ and cur not in seen and limit > 0:
        seen.add(cur)
        cur = succ[cur]
        limit -= 1
        if cur in exists:
            return cur
    return None


def main():
    commit, renames_path = sys.argv[1], sys.argv[2]
    paths = tracked_files(commit)
    exists = set(paths)
    by_base = collections.defaultdict(list)
    for p in paths:
        by_base[posixpath.basename(p)].append(p)
    succ = load_renames(renames_path)

    corpus = [p for p in paths if family(p)]
    line_counts = {}

    def line_count(p, text_cache={}):
        if p not in line_counts:
            data = next(read_blobs(commit, [p]), (p, ""))[1]
            line_counts[p] = 0 if data == "" else data.count("\n") + (0 if data.endswith("\n") else 1)
        return line_counts[p]

    fm = {fam: {"docs": 0, "no_frontmatter": 0, "contextType": collections.Counter(), "importance_tier": collections.Counter()} for fam in ("spec", "skill")}
    cites = {fam: {kind: collections.Counter() for kind in ("source_tag", "bare")} for fam in ("spec", "skill")}
    moved_examples = collections.Counter()
    texts = {}

    for p, text in read_blobs(commit, corpus):
        fam = family(p)
        fm[fam]["docs"] += 1
        values = frontmatter_values(text)
        if values is None:
            fm[fam]["no_frontmatter"] += 1
        else:
            for key in ("contextType", "importance_tier"):
                if key in values:
                    fm[fam][key][values[key]] += 1
        texts[p] = text

    # Line counts for every tracked file a citation can hit are needed; read lazily in bulk.
    pending = []
    parsed = []
    for p, text in texts.items():
        fam = family(p)
        in_fence = False
        for line in text.splitlines():
            if FENCE_RE.match(line):
                in_fence = not in_fence
                continue
            if in_fence:
                continue
            tag_spans = [m.span() for m in SOURCE_TAG_RE.finditer(line)]
            for m in CITATION_RE.finditer(line):
                kind = "source_tag" if any(a <= m.start() < b for a, b in tag_spans) else "bare"
                target = m.group(1)
                start = int(m.group(2))
                end = int(m.group(3)) if m.group(3) else start
                parsed.append((fam, kind, p, target, max(start, end)))

    def resolve_existing(doc, target):
        for cand in (posixpath.normpath(posixpath.join(posixpath.dirname(doc), target)), target.lstrip("./") if target.startswith("./") else target):
            if cand in exists:
                return cand
        return None

    needed = set()
    plan = []
    for fam, kind, doc, target, last in parsed:
        hit = resolve_existing(doc, target)
        if hit:
            plan.append((fam, kind, "direct", hit, last, target))
            needed.add(hit)
            continue
        moved = follow(succ, target, exists) or follow(succ, posixpath.normpath(posixpath.join(posixpath.dirname(doc), target)), exists)
        if moved:
            plan.append((fam, kind, "moved", moved, last, target))
            needed.add(moved)
            continue
        same = by_base.get(posixpath.basename(target), [])
        if len(same) == 1:
            plan.append((fam, kind, "basename_only", same[0], last, target))
        elif len(same) > 1:
            plan.append((fam, kind, "ambiguous", None, last, target))
        else:
            plan.append((fam, kind, "gone", None, last, target))

    for p, data in read_blobs(commit, sorted(needed)):
        line_counts[p] = 0 if data == "" else data.count("\n") + (0 if data.endswith("\n") else 1)

    for fam, kind, how, hit, last, target in plan:
        if how == "direct":
            cls = "in_range" if last <= line_counts.get(hit, 0) else "past_end"
        elif how == "moved":
            cls = "moved_in_range" if last <= line_counts.get(hit, 0) else "moved_past_end"
            moved_examples[f"{posixpath.dirname(target).split('/')[0] or '.'} -> {hit.split('/')[0]}"] += 1
        else:
            cls = how
        cites[fam][kind][cls] += 1

    def counter_dict(c):
        return dict(sorted(c.items(), key=lambda kv: (-kv[1], kv[0])))

    out = {
        "commit": commit,
        "rename_records": len(succ),
        "frontmatter": {
            fam: {
                "docs": d["docs"],
                "no_frontmatter": d["no_frontmatter"],
                "contextType_docs": sum(d["contextType"].values()),
                "contextType_distinct": len(d["contextType"]),
                "contextType": counter_dict(d["contextType"]),
                "importance_tier_docs": sum(d["importance_tier"].values()),
                "importance_tier_distinct": len(d["importance_tier"]),
                "importance_tier": counter_dict(d["importance_tier"]),
            }
            for fam, d in fm.items()
        },
        "citations": {fam: {kind: counter_dict(c) for kind, c in kinds.items()} for fam, kinds in cites.items()},
        "moved_top_roots": dict(moved_examples.most_common(10)),
    }
    json.dump(out, sys.stdout, indent=2)
    sys.stdout.write("\n")


if __name__ == "__main__":
    main()
