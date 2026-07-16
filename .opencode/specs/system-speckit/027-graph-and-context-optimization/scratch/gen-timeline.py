#!/usr/bin/env python3
"""Generate timeline.md for the 026 phase parent.

Lists every spec folder (any directory containing spec.md) ordered NEWEST -> OLDEST
by git activity. This is the chronological index that is DELIBERATELY SEPARATE from
folder numbers: folder numbers encode topical/structural identity; this file encodes
"what was worked on when".

Chronology source = git commit dates. We do NOT trust graph-metadata `last_save_at`
because the MCP daemon mass-re-stages those files (they all collapse to one timestamp).

ATOMIC SNAPSHOT (race-immunity): the last-active timestamp for every folder comes from
a SINGLE `git log` pass, not one subprocess per folder. The repo is committed to by
background automation; 600+ sequential `git log` calls over ~15s would interleave with
those commits and produce an internally inconsistent sort (newer rows below older ones).
One `git log` process reads one ref state, so the resulting order is always consistent.

Regenerate (run from the 026 root):
    python3 scratch/gen-timeline.py > timeline.md

Sort key (primary): git last-commit touching the folder subtree (DESC) = "most recently active".
Secondary/tertiary: born (created_at) then path, for deterministic tie-breaking.
Display columns: last-active (YYYY-MM-DD HH:MM) | born (day) | impl? | path
  - born  = graph-metadata derived.created_at when present (folder's recorded creation),
            else the first git commit of the folder's spec.md (--follow, top-level tracks only).
  - impl? = "impl" when implementation-summary.md exists (a shipped hint; the graph-metadata
            `status` field is uniformly stale and is intentionally NOT used).
"""
import json
import os
import re
import subprocess
from datetime import datetime, timezone

SCRIPT_DIR = os.path.dirname(os.path.realpath(__file__))
ROOT26 = os.path.dirname(SCRIPT_DIR)  # scratch/ -> 026 root (realpath; resolves the specs/ symlink)
PACKET = "system-spec-kit/026-graph-and-context-optimization"
SEP = "\x01"  # commit-line marker unlikely to appear in a path


def git(args):
    try:
        out = subprocess.run(
            ["git"] + args, cwd=ROOT26, capture_output=True, text=True, timeout=120
        )
        return out.stdout
    except Exception:
        return ""


def repo_prefix():
    """ROOT26 path relative to the git repo root (e.g. '.opencode/specs/.../026-...')."""
    top = git(["rev-parse", "--show-toplevel"]).strip()
    if not top:
        return ""
    return os.path.relpath(ROOT26, top).replace(os.sep, "/")


def spec_folders():
    """Set of dir rels (relative to ROOT26) that contain spec.md, plus impl/born inputs."""
    folders = {}
    for dirpath, dirnames, filenames in os.walk(ROOT26):
        # prune dot-dirs (.git, .backup-YYYYMMDD snapshots, etc.)
        dirnames[:] = [d for d in dirnames if not d.startswith(".")]
        if "spec.md" not in filenames:
            continue
        rel = os.path.relpath(dirpath, ROOT26).replace(os.sep, "/")
        if rel == ".":
            continue  # parent root is covered by the §A header, excluded from the flat list
        folders[rel] = {
            "rel": rel,
            "abs": dirpath,
            "impl": os.path.isfile(os.path.join(dirpath, "implementation-summary.md")),
            "born": created_at(dirpath),
            "depth": rel.count("/"),
        }
    return folders


def build_last_map(folder_rels):
    """ONE git pass -> {folder_rel: newest-commit ISO touching its subtree}.

    Walks `git log` newest-first; the first commit that touches any path under a
    spec-folder is that folder's last-active. Subtree semantics: every changed file
    marks all of its spec-folder ancestors.
    """
    prefix = repo_prefix()
    fset = set(folder_rels)
    last_map = {}
    out = git([
        "-c", "core.quotepath=false",
        "log", "--format=" + SEP + "%cI", "--name-only", "--",
        ".",
    ])
    cur = None
    for line in out.splitlines():
        if line.startswith(SEP):
            cur = line[1:].strip()
            continue
        path = line.strip()
        if not path or cur is None:
            continue
        # normalize to a path relative to ROOT26
        if prefix and path.startswith(prefix + "/"):
            path = path[len(prefix) + 1:]
        d = os.path.dirname(path)
        # mark every spec-folder ancestor not yet assigned (newest-first => first wins)
        while d and d != ".":
            if d in fset and d not in last_map:
                last_map[d] = cur
            nd = os.path.dirname(d)
            if nd == d:
                break
            d = nd
    return last_map


def born_follow(rel_specmd):
    """Earliest commit ISO that added the spec.md, traced across git mv renames."""
    lines = [l for l in git(
        ["log", "--follow", "--diff-filter=A", "--format=%cI", "--", rel_specmd]
    ).splitlines() if l.strip()]
    return lines[-1] if lines else ""


def created_at(folder_abs):
    gm = os.path.join(folder_abs, "graph-metadata.json")
    if os.path.isfile(gm):
        try:
            j = json.load(open(gm))
            return (j.get("derived", {}) or {}).get("created_at") or ""
        except Exception:
            return ""
    return ""


def fmt_date(iso):
    return (iso or "")[:10] or "??????????"


def fmt_dt(iso):
    """YYYY-MM-DD HH:MM from an ISO timestamp — the displayed sort key.

    Day granularity alone cannot order the rows: the vast majority of folders share
    one commit day, so HH:MM is what makes 'which is actually newest' answerable from
    the file. Falls back to a padded date when no time component is present.
    """
    iso = iso or ""
    if len(iso) >= 16 and iso[10] in ("T", " "):
        return iso[:10] + " " + iso[11:16]
    return (iso[:10] or "??????????") + "     "


def sort_recs(recs):
    return sorted(recs, key=lambda r: (r["last"], r["born"], r["rel"]), reverse=True)


def block(recs):
    out = []
    for r in recs:
        impl = "impl" if r["impl"] else "    "
        out.append(f"{fmt_dt(r['last'])}  born:{fmt_date(r['born'])}  {impl}  {r['rel']}")
    return "\n".join(out)


def tracks_table(last_map):
    rows = []
    for d in sorted(os.listdir(ROOT26)):
        full = os.path.join(ROOT26, d)
        if not os.path.isdir(full):
            continue
        if not (len(d) >= 4 and d[:3].isdigit() and d[3] == "-"):
            continue
        la = last_map.get(d, "")
        bn = born_follow(os.path.join(d, "spec.md")) or created_at(full)
        rows.append((la, bn, d))
    rows.sort(reverse=True)
    lines = [
        "| Rank | Last active | Born | Track |",
        "|------|------------------|------------|-------|",
    ]
    for i, (la, bn, d) in enumerate(rows, 1):
        lines.append(f"| {i} | {fmt_dt(la)} | {fmt_date(bn)} | `{d}/` |")
    return "\n".join(lines)


def changelog_map():
    """Invert each changelog's `> Spec folder:` line -> {spec_rel: {"all":[clrel], "rollup":clrel|None}}.

    The bridge from a spec folder (what was worked on, recency view) to its packet
    changelog(s) (what shipped). Keyed by the spec-folder path each changelog itself
    declares in its blockquote, normalized on the packet anchor. Phase-parent rollups
    (`-root.md`) are recorded separately so a parent folder can link the rollup that
    already indexes its child phases instead of dumping every child link in one cell.
    """
    cl_root = os.path.join(ROOT26, "changelog")
    anchor = "027-graph-and-context-optimization"
    m = {}
    for dirpath, _, filenames in os.walk(cl_root):
        for fn in filenames:
            if not fn.endswith(".md") or fn == "README.md":
                continue
            p = os.path.join(dirpath, fn)
            sf = None
            try:
                with open(p, encoding="utf-8", errors="surrogateescape") as fh:
                    for line in fh:
                        mm = re.match(r"^> Spec folder: `([^`]+)`", line)
                        if mm:
                            sf = mm.group(1).rstrip("/")
                            break
            except OSError:
                continue
            if not sf or anchor not in sf:
                continue
            spec_rel = sf[sf.index(anchor) + len(anchor):].lstrip("/")
            cl_rel = os.path.relpath(p, cl_root).replace(os.sep, "/")
            entry = m.setdefault(spec_rel, {"all": [], "rollup": None})
            entry["all"].append(cl_rel)
            if fn.endswith("-root.md"):
                entry["rollup"] = cl_rel
    return m


def cl_cell(rel, clmap):
    """Render the §D Changelog cell for one spec folder. Links are relative to ROOT26
    (where timeline.md lives), so `./changelog/<clrel>` resolves directly."""
    e = clmap.get(rel)
    if not e:
        return "(none)"

    def link(clrel):
        return f"[{os.path.basename(clrel)}](./changelog/{clrel})"

    if e["rollup"]:
        cell = link(e["rollup"])
        extra = len(e["all"]) - 1
        if extra > 0:
            cell += f" (rollup indexes +{extra})"
        return cell
    # no rollup: list every changelog (these cases hold only a few)
    return "<br>".join(link(c) for c in sorted(e["all"]))


def section_d(live_s, clmap):
    lines = [
        "| Spec folder | impl | Changelog |",
        "|-------------|------|-----------|",
    ]
    for r in live_s:
        impl = "impl" if r["impl"] else ""
        rel = r["rel"].replace("|", "\\|")
        lines.append(f"| `{rel}` | {impl} | {cl_cell(r['rel'], clmap)} |")
    return "\n".join(lines)


def main():
    folders = spec_folders()
    last_map = build_last_map(folders.keys())
    live, archived = [], []
    for rel, rec in folders.items():
        rec["last"] = last_map.get(rel, "")
        (archived if rel.split("/")[0] == "z_archive" else live).append(rec)

    live_s, arch_s = sort_recs(live), sort_recs(archived)
    clmap = changelog_map()
    gen = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    newest = live_s[0]["rel"] if live_s else "n/a"
    oldest = live_s[-1]["rel"] if live_s else "n/a"
    top15 = "\n".join(
        f"{i:>2}. {fmt_dt(r['last'])}  {r['rel']}" for i, r in enumerate(live_s[:15], 1)
    )

    print(f"""---
title: "Chronological Timeline [{PACKET}/timeline]"
description: "GENERATED chronological index of 026 live-tree spec folders, newest to oldest by git activity. The recency view that is separate from folder numbers."
trigger_phrases:
  - "026 timeline"
  - "026 newest phase"
  - "026 most recent spec folder"
  - "026 chronological order"
  - "which 026 phase is newest"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "{PACKET}"
    last_updated_at: "{gen}"
    recent_action: "Regenerated chronological timeline from git history"
    next_safe_action: "Use this file to find the most recent / oldest spec folder"
    completion_pct: 100
---
# 026 Chronological Timeline

<!-- GENERATED FILE — do not hand-edit. Regenerate: `python3 scratch/gen-timeline.py > timeline.md` (run from the 026 root). -->

> **Generated:** {gen} — regenerate before relying on intra-day ordering; same-day commits made
> after this stamp are not reflected until the next run.
> **Sort key:** git last-commit timestamp touching each folder subtree, **newest → oldest** (the
> recency view), taken from one atomic `git log` snapshot. The last-active column shows
> `YYYY-MM-DD HH:MM` (committer local offset) because most folders share one commit day — the time
> is what orders them. The `born` column is the folder's recorded `created_at` (or first git commit
> of its `spec.md`), shown at day granularity.
>
> **Folder numbers are NOT chronology.** Numbers (`000`–`007`, child `NNN-`) encode topical/structural
> identity assigned across reorg waves. This file is the *only* surface that orders by when work happened.
> Phase identity → home mapping lives in [`context-index.md`](./context-index.md); the live track map lives
> in [`spec.md`](./spec.md).
>
> **Changelog links:** §D maps every live spec folder to its packet changelog(s). Folders with none
> (docs-only, research, or work consolidated into a parent rollup) show `(none)`. Phase parents link
> their `-root.md` rollup, which indexes the child phase changelogs.
>
> **Most recent live spec folder:** `{newest}`
> **Oldest live spec folder:** `{oldest}`
> **Counts:** {len(live_s)} live spec folders · {len(arch_s)} archived (`z_archive/`).

---

## 0. Most recent 15 (quick answer to "what was worked on last")

```
{top15}
```

---

## A. Tracks — newest activity → oldest

The eight top-level themed tracks, ordered by most recent git activity. `Born` uses `--follow` so it
traces through the reorg `git mv` history to each track's true origin.

{tracks_table(last_map)}

> Note: `000-release-and-program-cleanup/` carries a deliberate `000` prefix (cross-cutting / program
> track), so it sorts first by number but is **not** the oldest by creation — see `Born` above and §B.

---

## B. All live spec folders — newest → oldest

Every directory containing `spec.md` under the live tree (excludes `z_archive/` and `.backup-*`
snapshot dirs), flat-sorted by last git activity. `impl` = an `implementation-summary.md` is present
(a shipped hint). Folders with no committed git history (uncommitted) show `??????????` and sort last.

```
{block(live_s)}
```

---

## C. Archived spec folders (`z_archive/`)

Superseded / merged packets, preserved for provenance. Same sort. Resolve their original phase
identities via [`context-index.md`](./context-index.md).

```
{block(arch_s)}
```

---

## D. Spec folder → changelog (generated link index)

Every live spec folder linked to its packet changelog(s), in the same newest → oldest order as §B.
This is the connection between "what was worked on when" (§B) and "what shipped" (the changelogs).
Folders with `(none)` are docs-only, research, or work consolidated into a parent rollup. Phase
parents link their `-root.md` rollup, which indexes the child phase changelogs (`+N` = additional
changelogs the rollup covers). Links resolve relative to this file.

{section_d(live_s, clmap)}
""")


if __name__ == "__main__":
    main()
