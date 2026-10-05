#!/usr/bin/env python3
"""Draw the enlarged labeled-citation sample for decision D3.

Usage: python3 sample_draw.py <commit> <seed> <per_family> > sample-rows.jsonl

Population: citations outside fences in tracked spec docs (no z_archive) and
skill docs whose target is a tracked .md file that resolves directly, by the
doc's own folder or the repo root, with the cited line or range inside the file.
Rows are drawn without replacement per family with random.Random(seed). Each
row carries the citing paragraph and a window of ten lines either side of the
cited line, read from git objects at the commit.
"""
import json
import posixpath
import random
import sys

import census


def paragraph(lines, index):
    start = index
    while start > 0 and lines[start - 1].strip():
        start -= 1
    end = index
    while end + 1 < len(lines) and lines[end + 1].strip():
        end += 1
    return "\n".join(lines[start:end + 1]).strip()


def main():
    commit, seed, per_family = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
    paths = census.tracked_files(commit)
    exists = set(paths)
    corpus = [p for p in paths if census.family(p)]
    candidates = {"spec": [], "skill": []}
    docs = {}
    for doc, text in census.read_blobs(commit, corpus):
        docs[doc] = text
        lines = text.splitlines()
        in_fence = False
        for i, line in enumerate(lines):
            if census.FENCE_RE.match(line):
                in_fence = not in_fence
                continue
            if in_fence:
                continue
            for m in census.CITATION_RE.finditer(line):
                target = m.group(1)
                if not target.endswith(".md"):
                    continue
                hit = None
                for cand in (posixpath.normpath(posixpath.join(posixpath.dirname(doc), target)), target):
                    if cand in exists:
                        hit = cand
                        break
                if not hit:
                    continue
                start = int(m.group(2))
                end = int(m.group(3)) if m.group(3) else start
                candidates[census.family(doc)].append((doc, i, target, hit, start, end))

    targets = sorted({c[3] for fam in candidates.values() for c in fam})
    target_text = dict(census.read_blobs(commit, targets))
    rng = random.Random(seed)
    ordinal = 0
    for fam in ("skill", "spec"):
        pool = [c for c in candidates[fam] if max(c[4], c[5]) <= len(target_text.get(c[3], "").splitlines())]
        pool.sort()
        for doc, i, target, hit, start, end in rng.sample(pool, min(per_family, len(pool))):
            ordinal += 1
            tlines = target_text[hit].splitlines()
            w0 = max(1, start - 10)
            w1 = min(len(tlines), max(start, end) + 10)
            doc_lines = docs[doc].splitlines()
            print(json.dumps({
                "id": f"d3-{ordinal:02d}",
                "family": fam,
                "doc": doc,
                "doc_line": i + 1,
                "claim": paragraph(doc_lines, i),
                "target": hit,
                "target_line": start,
                "target_line_end": end if end != start else None,
                "window_start": w0,
                "window_end": w1,
                "window": "\n".join(f"{n}: {tlines[n - 1]}" for n in range(w0, w1 + 1)),
                "target_has_anchor_markers": "<!-- ANCHOR:" in target_text[hit],
                "commit": commit,
                "population": len(pool),
            }))


if __name__ == "__main__":
    main()
