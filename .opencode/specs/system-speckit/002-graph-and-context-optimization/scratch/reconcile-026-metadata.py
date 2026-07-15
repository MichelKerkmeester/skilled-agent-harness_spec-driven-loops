#!/usr/bin/env python3
"""Reconcile graph-metadata chronology pointers + status for the 026 parent + 8 tracks.

Fixes two truth-drift defects:
  - derived.status was uniformly "planned" (program is ~90% done).
  - derived.last_active_child_id was null everywhere (the resume-ladder / "most recent
    phase" pointer the CLAUDE.md resume flow honors).

We patch ONLY three derived keys (status, last_active_child_id, last_active_at) and leave
every other field untouched. Chronology source = git (last_save_at is daemon-corrupted).

Run from the 026 root:  python3 scratch/reconcile-026-metadata.py [--apply]
Without --apply it's a dry run (prints the plan, writes nothing).
"""
import json
import os
import re
import subprocess
import sys

ROOT26 = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
PACKET = "system-spec-kit/026-graph-and-context-optimization"
APPLY = "--apply" in sys.argv

# Curated statuses (source of truth = spec.md Phase Documentation Map, 2026-05-26,
# extended with the 8th track 007 adopted in this pass).
CURATED = {
    "": "in_progress",  # root
    "000-release-and-program-cleanup": "complete",
    "001-research-and-baseline": "complete",
    "002-spec-kit-internals": "in_progress",
    "003-memory-and-causal-runtime": "in_progress",
    "004-code-graph": "in_progress",
    "005-graph-impact-and-affordance": "deferred",
    "006-operator-tooling": "in_progress",
    "007-mcp-daemon-reliability": "in_progress",
}


def git_last_iso(relpath):
    try:
        r = subprocess.run(
            ["git", "log", "-1", "--format=%cI", "--", relpath],
            cwd=ROOT26, capture_output=True, text=True, timeout=30,
        )
        return r.stdout.strip()
    except Exception:
        return ""


def packet_id_of(rel_dir):
    """packet_id for a dir relative to 026 root."""
    gm = os.path.join(ROOT26, rel_dir, "graph-metadata.json") if rel_dir else os.path.join(ROOT26, "graph-metadata.json")
    if os.path.isfile(gm):
        try:
            pid = json.load(open(gm)).get("packet_id")
            if pid:
                return pid
        except Exception:
            pass
    return f"{PACKET}/{rel_dir}" if rel_dir else PACKET


def newest_child(parent_rel):
    """Return (child_packet_id, iso) for the NNN- direct child with newest git activity."""
    parent_abs = os.path.join(ROOT26, parent_rel) if parent_rel else ROOT26
    best_iso, best_rel = "", None
    for name in sorted(os.listdir(parent_abs)):
        full = os.path.join(parent_abs, name)
        if not os.path.isdir(full):
            continue
        if not re.match(r"^\d{3}-[a-z0-9-]+$", name):
            continue
        rel = f"{parent_rel}/{name}" if parent_rel else name
        iso = git_last_iso(rel)
        if iso > best_iso:
            best_iso, best_rel = iso, rel
    if best_rel is None:
        return None, ""
    return packet_id_of(best_rel), best_iso


def patch(rel_dir):
    gm_path = os.path.join(ROOT26, rel_dir, "graph-metadata.json") if rel_dir else os.path.join(ROOT26, "graph-metadata.json")
    if not os.path.isfile(gm_path):
        return f"SKIP (no graph-metadata.json): {rel_dir or '<root>'}"
    j = json.load(open(gm_path))
    der = j.setdefault("derived", {})
    old_status = der.get("status")
    old_lac = der.get("last_active_child_id")

    lac, lac_iso = newest_child(rel_dir)
    der["status"] = CURATED.get(rel_dir, der.get("status", "in_progress"))
    der["last_active_child_id"] = lac  # may be None for leaf tracks
    der["last_active_at"] = lac_iso or git_last_iso(rel_dir or ".")

    if APPLY:
        with open(gm_path, "w") as f:
            json.dump(j, f, indent=2, ensure_ascii=False)
            f.write("\n")
    label = rel_dir or "<ROOT>"
    return (f"{label}\n    status: {old_status!r} -> {der['status']!r}\n"
            f"    last_active_child_id: {old_lac!r} -> {der['last_active_child_id']!r}\n"
            f"    last_active_at: {der['last_active_at']}")


def main():
    targets = [""] + [k for k in CURATED if k]
    print(f"{'APPLY' if APPLY else 'DRY-RUN'} — patching derived.{{status,last_active_child_id,last_active_at}}\n")
    for t in targets:
        print(patch(t))
        print()


if __name__ == "__main__":
    main()
