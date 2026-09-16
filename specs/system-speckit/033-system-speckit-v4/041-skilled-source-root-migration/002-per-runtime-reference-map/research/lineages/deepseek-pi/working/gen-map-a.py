#!/usr/bin/env python3
"""Generate Map A row tables from the frozen seed symlink inventory.

Reads (relative to the repository root):
  specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/002-per-runtime-reference-map/scratch/seed-inventory/symlinks.tsv
Writes (into this lineage working directory):
  map-a.tsv                 — every row, computed columns
  map-a-<section>.md        — one markdown table per Map A section
"""
import csv
import os
import re

REPO = "/Users/michelkerkmeester/worktrees/public/055-skilled-source-root-migration"
SEED = os.path.join(
    REPO,
    "specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/"
    "002-per-runtime-reference-map/scratch/seed-inventory/symlinks.tsv",
)
OUT = os.path.dirname(os.path.abspath(__file__))

ORIGIN_RULES = [
    # (regex on link path, origin label, classification)
    (r"^\.claude/commands/",
     "generated: sync-runtime-mirrors.cjs L126-134 (listCommandPaths + toFlatName; 33 filtered per-file mirrors)",
     "regenerate"),
    (r"^\.claude/hooks/",
     "generated: sync-runtime-mirrors.cjs L43-48,L106-111,L136-140 (hookSourcesFromConfig reads .claude/settings.json)",
     "regenerate"),
    (r"^\.claude/skills$",
     "hand-made whole-directory link (documented .claude/SYNC.md L28 surface table; no generator found)",
     "mechanical"),
    (r"^\.claude/manual-testing-playbook$",
     "hand-made whole-directory link (documented .claude/SYNC.md L28 surface table; no generator found)",
     "mechanical"),
    (r"^\.claude/\.utcp_config\.json$",
     "hand-made root-file link (documented .claude/SYNC.md L28 surface table)",
     "none"),
    (r"^\.codex/hooks/",
     "generated: sync-runtime-mirrors.cjs L43-48,L136-140 (hookSourcesFromConfig reads .codex/hooks.json)",
     "regenerate"),
    (r"^\.codex/manual-testing-playbook$",
     "hand-made whole-directory link (documented .codex/SYNC.md surface table; no generator found)",
     "mechanical"),
    (r"^\.cursor/agents/",
     "generated: sync-runtime-mirrors.cjs L120-124 (listAgentNames over .claude/agents)",
     "none"),
    (r"^\.cursor/commands/",
     "generated: sync-runtime-mirrors.cjs L126-134 (flattened command mirrors)",
     "regenerate"),
    (r"^\.cursor/hooks/",
     "generated: sync-runtime-mirrors.cjs L43-48,L136-140 (hookSourcesFromConfig reads .cursor/hooks.json)",
     "regenerate"),
    (r"^\.cursor/rules/sk-vision\.md$",
     "hand-made (no generator found; sk-vision install surface)",
     "mechanical"),
    (r"^\.cursor/manual-testing-playbook$",
     "hand-made whole-directory link (documented .cursor/SYNC.md surface table; no generator found)",
     "mechanical"),
    (r"^\.devin/agents/",
     "generated: sync-runtime-mirrors.cjs L120-124 (nested .devin/agents/<name>/AGENT.md)",
     "none"),
    (r"^\.devin/hooks/",
     "generated: sync-runtime-mirrors.cjs L43-48,L136-140 (hookSourcesFromConfig reads .devin/hooks.v1.json)",
     "regenerate"),
    (r"^\.devin/manual-testing-playbook$",
     "hand-made whole-directory link (documented .devin/SYNC.md surface table; no generator found)",
     "mechanical"),
    (r"^\.hermes/agents$",
     "hand-made whole-directory link (documented .hermes/SYNC.md surface table; no generator found)",
     "mechanical"),
    (r"^\.hermes/manual-testing-playbook$",
     "hand-made whole-directory link (documented .hermes/SYNC.md surface table; no generator found)",
     "mechanical"),
    (r"^\.pi/extensions/",
     "hand-made browsability symlink (documented .pi/extensions/README.md L19-L32; verified by sync-hook-registrations.cjs L192-205 but not created by it)",
     "mechanical"),
    (r"^\.pi/skills$",
     "hand-made whole-directory link (documented .pi/SYNC.md surface table; no generator found)",
     "mechanical"),
    (r"^\.pi/manual-testing-playbook$",
     "hand-made whole-directory link (documented .pi/SYNC.md surface table; no generator found)",
     "mechanical"),
    (r"^\.opencode/hooks/",
     "hand-made browsability index symlink (documented .opencode/hooks/README.md L30,L248-L260; no generator found)",
     "mechanical"),
    (r"^\.opencode/changelog/",
     "hand-made index symlink (no generator found; changelog tooling only links/checks markdown)",
     "mechanical"),
    (r"^\.opencode/install-guides/",
     "hand-made index symlink (no generator found)",
     "mechanical"),
    (r"^\.opencode/manual-testing-playbook$",
     "hand-made whole-directory link (documented .opencode/hooks-independent; no generator found)",
     "mechanical"),
    (r"^\.opencode/plugins/sk-vision\.js$",
     "build-artifact link: sk-vision vision-runtime build emits dist/plugin.js; link resolves after build",
     "regenerate"),
    (r"^\.opencode/specs$",
     "hand-made whole-directory link (repo-root specs is the real tree)",
     "none"),
    (r"^\.opencode/skills/system-spec-kit/runtime/cli/runtime$",
     "build-artifact link: spec-kit CLI build emits runtime/dist",
     "regenerate"),
    (r"^\.opencode/skills/system-spec-kit/runtime/shared$",
     "build-artifact link: shared build emits shared/dist",
     "regenerate"),
    (r"^\.opencode/skills/system-spec-kit/runtime/cli/tests/test-fixtures$",
     "hand-made test-fixture link (no generator found)",
     "mechanical"),
    (r"^\.opencode/skills/system-spec-kit/runtime/cli/test-fixtures/",
     "hand-made test-fixture link (no generator found)",
     "mechanical"),
    (r"^\.opencode/skills/system-skill-advisor/runtime/lib/shared/embeddings$",
     "hand-made shared-module link (no generator found)",
     "mechanical"),
    (r"^\.opencode/skills/",
     "hand-made link inside a skill tree (references, scripts, fixtures; no generator found)",
     "mechanical"),
    (r"^specs/",
     "historical run artifact inside specs/ (frozen record)",
     "freeze"),
    (r"^\.mcp\.json$",
     "hand-made root link (documented .claude/SYNC.md surface table: .claude/mcp.json is canonical)",
     "none"),
    (r"^CLAUDE\.md$",
     "hand-made root link (root AGENTS.md is canonical)",
     "none"),
]


def origin_for(link):
    for pattern, origin, cls in ORIGIN_RULES:
        if re.search(pattern, link):
            return origin, cls
    return "UNKNOWN (no rule matched)", "UNKNOWN"


def section_for(root, link):
    if root == ".opencode":
        if link.startswith(".opencode/hooks/"):
            return "opencode-internal-hooks"
        if link.startswith(".opencode/changelog/"):
            return "opencode-internal-changelog"
        if link.startswith(".opencode/skills/"):
            return "opencode-internal-skills"
        if link.startswith(".opencode/install-guides/"):
            return "opencode-internal-install-guides"
        if link.startswith(".opencode/plugins/"):
            return "opencode-internal-plugins"
        return "opencode-internal-other"
    return {
        ".claude": "claude",
        ".codex": "codex",
        ".cursor": "cursor",
        ".devin": "devin",
        ".hermes": "hermes",
        ".pi": "pi",
        "specs": "specs",
    }.get(root, "root-level")


def main():
    rows = []
    with open(SEED, newline="") as fh:
        reader = csv.DictReader(fh, delimiter="\t")
        for r in reader:
            root, link, raw = r["root"], r["link"], r["raw_target"]
            resolved = r["resolved_rel"]
            into = r["resolves_into_opencode"]
            dangling = r["dangling"]
            origin, cls = origin_for(link)
            link_dir_abs = os.path.join(REPO, os.path.dirname(link))
            if into == "yes" and root != ".opencode":
                target_abs = os.path.join(REPO, resolved.replace(".opencode/", ".skilled/", 1))
                raw_no_compat = os.path.relpath(target_abs, link_dir_abs)
                raw_keep_compat = raw
            elif into == "yes":
                raw_no_compat = "unchanged (link and target travel together into .skilled/)"
                raw_keep_compat = "unchanged (resolves through .opencode compatibility link)"
            else:
                raw_no_compat = "unchanged (target outside .opencode does not move)"
                raw_keep_compat = "unchanged (target outside .opencode does not move)"
            if dangling == "yes" and into == "yes":
                raw_no_compat = "already dangling today: " + raw_no_compat
            rows.append({
                "section": section_for(root, link),
                "link": link,
                "raw": raw,
                "into_opencode": into,
                "resolved": resolved,
                "raw_keep_compat": raw_keep_compat,
                "raw_no_compat": raw_no_compat,
                "dangling": dangling,
                "origin": origin,
                "class": cls,
            })

    # machine-readable working file
    with open(os.path.join(OUT, "map-a.tsv"), "w", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=list(rows[0].keys()), delimiter="\t")
        w.writeheader()
        for row in rows:
            w.writerow(row)

    sections = {}
    for row in rows:
        sections.setdefault(row["section"], []).append(row)

    for section, srows in sections.items():
        path = os.path.join(OUT, f"map-a-{section}.md")
        with open(path, "w") as fh:
            fh.write(f"### Map A section: {section} ({len(srows)} links)\n\n")
            fh.write("| link | raw target | resolves into .opencode | required raw target — `.opencode` compat link survives | required raw target — no `.opencode` compat link | origin | class |\n")
            fh.write("|---|---|---|---|---|---|---|\n")
            for r in srows:
                fh.write(
                    "| `{link}` | `{raw}` | {into} | `{keep}` | `{no}` | {origin} | {cls} |\n".format(
                        link=r["link"], raw=r["raw"], into=r["into_opencode"],
                        keep=r["raw_keep_compat"], no=r["raw_no_compat"],
                        origin=r["origin"], cls=r["class"],
                    )
                )

    print(f"wrote {len(rows)} rows across {len(sections)} sections")
    for section, srows in sorted(sections.items()):
        print(f"  {section}: {len(srows)}")


if __name__ == "__main__":
    main()
