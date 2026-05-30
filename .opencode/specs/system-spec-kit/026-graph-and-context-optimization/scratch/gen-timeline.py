#!/usr/bin/env python3
"""Generate timeline.md for the 026 phase parent.

Lists every spec folder (any directory containing spec.md) ordered NEWEST -> OLDEST
by git activity. This is the chronological index that is DELIBERATELY SEPARATE from
folder numbers: folder numbers encode topical/structural identity; this file encodes
"what was worked on when".

Chronology source = git commit dates. We do NOT trust graph-metadata `last_save_at`
because the MCP daemon mass-re-stages those files (they all collapse to one timestamp).

Regenerate (run from the 026 root):
    python3 scratch/gen-timeline.py > timeline.md

Sort key (primary): git last-commit touching the folder subtree (DESC) = "most recently active".
Display columns: last-active | born | impl? | path
  - born  = graph-metadata derived.created_at when present (folder's recorded creation),
            else the first git commit of the folder's spec.md. May reflect a reorg stamp.
  - impl? = "impl" when implementation-summary.md exists in the folder (a shipped hint;
            the graph-metadata `status` field is uniformly stale and is intentionally NOT used).
"""
import json
import os
import subprocess
import sys
from datetime import datetime, timezone

SCRIPT_DIR = os.path.dirname(os.path.realpath(__file__))
ROOT26 = os.path.dirname(SCRIPT_DIR)  # scratch/ -> 026 root
PACKET = "system-spec-kit/026-graph-and-context-optimization"


def git(args):
    try:
        out = subprocess.run(
            ["git"] + args, cwd=ROOT26, capture_output=True, text=True, timeout=30
        )
        return out.stdout
    except Exception:
        return ""


def last_active(relpath):
    """Most recent commit ISO touching anything under relpath (current path)."""
    return git(["log", "-1", "--format=%cI", "--", relpath]).strip()


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


def collect():
    """Return (live, archived) lists of dicts for every dir containing spec.md."""
    live, archived = [], []
    for dirpath, dirnames, filenames in os.walk(ROOT26):
        # prune noise we never index: dot-dirs (.git, .backup-YYYYMMDD snapshots, etc.)
        dirnames[:] = [d for d in dirnames if not d.startswith(".")]
        if "spec.md" not in filenames:
            continue
        rel = os.path.relpath(dirpath, ROOT26)
        if rel == ".":
            continue  # the parent root itself is covered by §A header, skip from flat list
        rec = {
            "rel": rel.replace(os.sep, "/"),
            "abs": dirpath,
            "last": last_active(rel),
            "born": created_at(dirpath),
            "impl": os.path.isfile(os.path.join(dirpath, "implementation-summary.md")),
            "depth": rel.count(os.sep),
        }
        if not rec["born"]:
            rec["born"] = born_follow(os.path.join(rel, "spec.md"))
        if rec["rel"].split("/")[0] == "z_archive":
            archived.append(rec)
        else:
            live.append(rec)
    return live, archived


def fmt_date(iso):
    return (iso or "")[:10] or "??????????"


def fmt_dt(iso):
    """YYYY-MM-DD HH:MM from an ISO timestamp — the displayed sort key.

    Day granularity alone cannot order the rows: the vast majority of folders share
    one commit day, so HH:MM is what makes 'which is actually newest' answerable from
    the file. Falls back to date-only (+ '     ') when no time component is present.
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


def tracks_table():
    rows = []
    for d in sorted(os.listdir(ROOT26)):
        full = os.path.join(ROOT26, d)
        if not os.path.isdir(full):
            continue
        if not (len(d) >= 4 and d[:3].isdigit() and d[3] == "-"):
            continue
        la = last_active(d)
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


def main():
    live, archived = collect()
    live_s, arch_s = sort_recs(live), sort_recs(archived)
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
> recency view). The last-active column shows `YYYY-MM-DD HH:MM` (UTC-offset local) because most
> folders share one commit day — the time is what orders them. The `born` column is the folder's
> recorded `created_at` (or first git commit of its `spec.md`), shown at day granularity.
>
> **Folder numbers are NOT chronology.** Numbers (`000`–`007`, child `NNN-`) encode topical/structural
> identity assigned across reorg waves. This file is the *only* surface that orders by when work happened.
> Phase identity → home mapping lives in [`context-index.md`](./context-index.md); the live track map lives
> in [`spec.md`](./spec.md).
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

{tracks_table()}

> Note: `000-release-and-program-cleanup/` carries a deliberate `000` prefix (cross-cutting / program
> track), so it sorts first by number but is **not** the oldest by creation — see `Born` above and §B.

---

## B. All live spec folders — newest → oldest

Every directory containing `spec.md` under the live tree (excludes `z_archive/` and `.backup-*`
snapshot dirs), flat-sorted by last git activity. `impl` = an `implementation-summary.md` is present
(a shipped hint).

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
""")


if __name__ == "__main__":
    main()
