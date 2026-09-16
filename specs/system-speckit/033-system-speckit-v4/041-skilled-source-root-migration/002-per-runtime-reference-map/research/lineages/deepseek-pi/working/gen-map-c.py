#!/usr/bin/env python3
"""Generate Map C per-skill tables from the frozen tracked-refs inventory.

Usage: gen-map-c.py <skill-area> [<skill-area> ...]
Outputs (into working/):
  map-c-<slug>-code.md   — one row per non-markdown file, with first matching line
  map-c-<slug>-docs.md   — one row per documentation class (subarea), with fenced/inline counts
"""
import csv
import os
import sys
import re

REPO = "/Users/michelkerkmeester/worktrees/public/055-skilled-source-root-migration"
SEED = os.path.join(
    REPO,
    "specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/"
    "002-per-runtime-reference-map/scratch/seed-inventory/tracked-refs.tsv",
)
OUT = os.path.dirname(os.path.abspath(__file__))

DOC_CLASS = [
    (r"/changelog/|changelog\.md$", "historical record (changelog)", "freeze", "may keep historical paths"),
    (r"/(behavior-)?benchmark/", "benchmark material", "freeze", "recorded measurements from past runs"),
    (r"/manual-testing-playbook/", "manual testing playbook", "mechanical", "runnable steps; rewrite paths, review by hand"),
    (r"/feature-catalog/", "feature catalog", "mechanical", "prose describing current behavior; rewrite paths"),
    (r"/references/", "references", "mechanical", "mixed prose and runnable snippets; rewrite paths"),
    (r"/templates/", "templates", "mechanical", "emitted into packets; rewrite paths"),
    (r"/assets/", "assets", "mechanical", "templates and prompt assets; rewrite paths"),
    (r"/tests?/|test-fixtures/", "test documentation/fixtures", "mechanical", "test-owned content; rewrite or regenerate"),
    (r"/(SKILL|README|ROUTER|ARCHITECTURE)\.md$", "top-level skill doc", "mechanical", "load-bearing doc; rewrite paths"),
    (r"/changelog", "historical record", "freeze", "may keep historical paths"),
    (r"\.md$", "other documentation", "manual", "classify by hand"),
]

CODE_CLASS = [
    (r"/(behavior-)?benchmark/", "historical record: benchmark report data", "freeze"),
    (r"graph-metadata\.json$", "generated: regenerate-skill-derived.cjs", "regenerate"),
    (r"leaf-(manifest|scopes|aliases)\.json$", "generated: generate-leaf-manifest.cjs and its siblings", "regenerate"),
    (r"command-metadata\.json$|mode-registry\.json$", "generated: skill metadata build", "regenerate"),
    (r"trigger-index\..*json$|runtime/data/.*\.json$", "generated: generate-trigger-index.mjs", "regenerate"),
    (r"package-lock\.json$", "generated: package manager", "regenerate"),
    (r"\.snap$", "generated: vitest snapshot", "regenerate"),
    (r"test-fixtures/|/fixtures/", "test fixture (hand-authored data)", "manual"),
    (r"tests?/|\.test\.|\.vitest\.", "test code", "mechanical"),
]


def code_rule(path):
    for pattern, origin, cls in CODE_CLASS:
        if re.search(pattern, path):
            return origin, cls
    return "source code (authored)", "mechanical"


def doc_rule(path):
    for pattern, label, cls, note in DOC_CLASS:
        if re.search(pattern, path):
            return label, cls, note
    return "other documentation", "manual", "classify by hand"


def first_hit(path):
    try:
        with open(os.path.join(REPO, path), encoding="utf-8", errors="replace") as fh:
            for i, line in enumerate(fh, 1):
                if ".opencode" in line:
                    return i, line.strip()
    except OSError:
        return 0, ""
    return 0, ""


def slug(area):
    return area.replace("skill:", "").replace("opencode:", "opencode-").replace("/", "-")


def main():
    wanted = set(sys.argv[1:]) if len(sys.argv) > 1 else None
    rows = []
    with open(SEED, newline="") as fh:
        for r in csv.DictReader(fh, delimiter="\t"):
            area = r["area"]
            if not (area.startswith("skill:") or area.startswith("opencode:") or area in ("root","ci")):
                continue
            if wanted and area not in wanted:
                continue
            rows.append(r)

    areas = sorted({r["area"] for r in rows})
    for area in areas:
        arows = [r for r in rows if r["area"] == area]
        s = slug(area)

        code = [r for r in arows if r["ext"] != "md"]
        docs = [r for r in arows if r["ext"] == "md"]

        # code table
        code.sort(key=lambda r: r["path"])
        with open(os.path.join(OUT, f"map-c-{s}-code.md"), "w") as fh:
            fh.write(f"### Map C code rows: {area} ({len(code)} non-markdown files)\n\n")
            fh.write("| file | line | matching lines | first matching construct (truncated) | origin | class |\n|---|---|---:|---|---|---|\n")
            for r in code:
                ln, exc = first_hit(r["path"])
                exc = exc.replace("|", "\\|")
                if len(exc) > 110:
                    exc = exc[:107] + "..."
                origin, cls = code_rule(r["path"])
                fh.write(f"| `{r['path']}` | `{r['path']}:{ln}` | {r['hit_lines']} | `{exc}` | {origin} | {cls} |\n")

        # docs table grouped by class label
        groups = {}
        for r in docs:
            label, cls, note = doc_rule(r["path"])
            g = groups.setdefault((label, cls, note), {"files": 0, "fenced": 0, "inline": 0, "examples": []})
            g["files"] += 1
            g["fenced"] += int(r["md_fenced_lines"] or 0)
            g["inline"] += int(r["md_inline_lines"] or 0)
            if len(g["examples"]) < 3:
                g["examples"].append(r["path"])
        with open(os.path.join(OUT, f"map-c-{s}-docs.md"), "w") as fh:
            fh.write(f"### Map C documentation classes: {area} ({len(docs)} markdown files)\n\n")
            fh.write("| documentation class | files | fenced lines (runnable-ish) | inline lines (prose) | class | note | example files |\n")
            fh.write("|---|---:|---:|---:|---|---|---|\n")
            for (label, cls, note), g in sorted(groups.items(), key=lambda kv: -kv[1]["files"]):
                fh.write("| {label} | {files} | {fenced} | {inline} | {cls} | {note} | {examples} |\n".format(
                    label=label, files=g["files"], fenced=g["fenced"], inline=g["inline"], cls=cls, note=note,
                    examples="; ".join(f"`{e}`" for e in g["examples"])))

        print(f"{area}: {len(code)} code, {len(docs)} docs")


if __name__ == "__main__":
    main()
