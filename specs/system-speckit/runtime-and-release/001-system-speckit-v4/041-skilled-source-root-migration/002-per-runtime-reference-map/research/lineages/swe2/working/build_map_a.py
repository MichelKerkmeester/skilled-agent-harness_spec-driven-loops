#!/usr/bin/env python3
"""Build Map A rows from the seed symlinks.tsv.

Emits one markdown table per requested root. Columns:
link | raw_target | into .opencode | post-move target | origin (generator/hand) | class

Post-move target rule: every link whose resolution passes through a `.opencode`
path segment gets the same target with that segment renamed to `.skilled`
(same depth, `..` prefix preserved). Where the raw target does not spell
`.opencode` but resolution still enters it (none observed at top level), or
where keeping the target depends on a `.opencode` compatibility link surviving,
both answers are recorded.
"""
import csv, os, sys

SEED = "specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/002-per-runtime-reference-map/scratch/seed-inventory/symlinks.tsv"
REPO = "/Users/michelkerkmeester/worktrees/public/055-skilled-source-root-migration"

SRM = "sync-runtime-mirrors.cjs"
SRM_CITE = ".opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs"


def generator_for(root, link, resolved_rel):
    """Return (origin_text, citation, base_class)."""
    if link.startswith(".claude/commands/"):
        return (f"generated — {SRM} tree `claude-commands`", f"{SRM_CITE}:126-133", "regenerate")
    if link.startswith(".claude/hooks/"):
        return (f"generated — {SRM} tree `claude-hooks`, sources read from `.claude/settings.json`", f"{SRM_CITE}:44,106-111,136-139", "regenerate")
    if link.startswith(".codex/hooks/"):
        return (f"generated — {SRM} tree `codex-hooks`, sources read from `.codex/hooks.json`", f"{SRM_CITE}:45,106-111,136-139", "regenerate")
    if link.startswith(".cursor/agents/"):
        return (f"generated — {SRM} tree `cursor-agents`, canonical source `.claude/agents`", f"{SRM_CITE}:117-123", "regenerate")
    if link.startswith(".cursor/commands/"):
        return (f"generated — {SRM} tree `cursor-commands`, flat names", f"{SRM_CITE}:99-101,126-134", "regenerate")
    if link.startswith(".cursor/hooks/"):
        return (f"generated — {SRM} tree `cursor-hooks`, sources read from `.cursor/hooks.json`", f"{SRM_CITE}:46,106-111,136-139", "regenerate")
    if link.startswith(".devin/agents/"):
        return (f"generated — {SRM} tree `devin-agents`, canonical source `.claude/agents`", f"{SRM_CITE}:117-123", "regenerate")
    if link.startswith(".devin/hooks/"):
        return (f"generated — {SRM} tree `devin-hooks`, sources read from `.devin/hooks.v1.json`", f"{SRM_CITE}:47,106-111,136-139", "regenerate")
    if link.startswith(".pi/extensions/"):
        return ("hand-made, verified by `sync-hook-registrations.cjs` against `hook-registry.json` (Pi registers by symlink)", f"{SRM_CITE.replace('sync-runtime-mirrors.cjs','sync-hook-registrations.cjs')}:193-202,237-238", "mechanical")
    if link == ".opencode/specs":
        return ("generated — `spec-root-migration.ts` creates `.opencode/specs -> ../specs`", ".opencode/skills/system-spec-kit/runtime/cli/core/spec-root-migration.ts:357", "regenerate")
    return ("hand-made", "—", "mechanical")


def post_move(r):
    """Return the post-move target cell text."""
    raw_target, resolves = r["raw_target"], r["resolves_into_opencode"]
    if r["root"] == ".opencode":
        # Internal link: relative target, moves with the renamed tree at same depth.
        if r["link"] == ".opencode/specs":
            return ("moves with tree to `.skilled/specs -> ../specs` (still resolves); "
                    "if a compat `.opencode/` survives it must re-create `.opencode/specs -> ../specs` there")
        if r["dangling"] == "yes":
            return "dangling today — moves with tree, still dangling"
        return "travels intact — relative target inside the moved tree"
    if r["root"] == "specs":
        if resolves == "yes":
            new = "/".join(".skilled" if s == ".opencode" else s for s in raw_target.split("/"))
            return (f"`{new}` if no compat layer; unchanged `{raw_target}` "
                    f"if `.opencode/` survives")
        return "unchanged — target never enters `.opencode/`"
    if resolves != "yes":
        return "unchanged (does not resolve into `.opencode`)"
    # raw target contains a .opencode segment: swap it for .skilled
    if ".opencode" in raw_target.split("/"):
        new = "/".join(".skilled" if seg == ".opencode" else seg for seg in raw_target.split("/"))
        return (f"`{new}` if no compat layer; unchanged `{raw_target}` "
                f"if `.opencode/` survives as links into `.skilled/`")
    # resolves into .opencode but raw target does not name it (indirect hop)
    return (f"unchanged `{raw_target}` — resolves through an intermediate link; "
            f"depends on what that hop points at")


def classify(r, gen_cls):
    root, resolves, dangling = r["root"], r["resolves_into_opencode"], r["dangling"]
    link = r["link"]
    if root == ".opencode":
        if dangling == "yes":
            return "regenerate" if "dist/" in r["raw_target"] else "manual"
        return "none" if link != ".opencode/specs" else gen_cls
    if root == "specs":
        if resolves == "yes":
            return "freeze"  # archived spec packet; prefer compat survival
        return "freeze" if dangling == "yes" else "none"
    if resolves != "yes":
        return "none" if dangling != "yes" else "manual"
    return gen_cls


def main(roots, out_path):
    rows = []
    with open(os.path.join(REPO, SEED)) as fh:
        for row in csv.DictReader(fh, delimiter="\t"):
            if row["root"] in roots:
                rows.append(row)
    lines = []
    for r in rows:
        link, raw, resolves, resolved_rel = r["link"], r["raw_target"], r["resolves_into_opencode"], r["resolved_rel"]
        origin, cite, gen_cls = generator_for(r["root"], link, resolved_rel)
        tgt = post_move(r)
        cls = classify(r, gen_cls)
        lines.append(
            f"| `{link}` | `{raw}` | {resolves} | {tgt} | {origin} | {cls} |"
        )
    with open(out_path, "w") as fh:
        fh.write("| link | raw target | resolves into `.opencode` | post-move target | origin | class |\n")
        fh.write("|---|---|---|---|---|---|\n")
        fh.write("\n".join(lines) + "\n")
    print(f"{out_path}: {len(rows)} rows")


if __name__ == "__main__":
    roots = sys.argv[1].split(",")
    main(roots, sys.argv[2])
