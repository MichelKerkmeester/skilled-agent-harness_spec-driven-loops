#!/usr/bin/env python3
"""Build Map B rows: non-symlink runtime files naming `.opencode` + home-level config.

For each tracked file under a runtime root, emit: file, line/key refs, what the
reference does, generated-vs-authored (owning command), needed change, class.
Line numbers are pulled live with a literal `.opencode` substring match so they
match the seed's NEEDLE.
"""
import csv, os, re, subprocess, sys

SEED = "specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/002-per-runtime-reference-map/scratch/seed-inventory/tracked-refs.tsv"
HOME = "specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/002-per-runtime-reference-map/scratch/seed-inventory/home-refs.tsv"
REPO = "/Users/michelkerkmeester/worktrees/public/055-skilled-source-root-migration"

SHR = ".opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors"

def hits(path):
    try:
        out = subprocess.run(["grep", "-n", "-F", ".opencode", os.path.join(REPO, path)],
                             capture_output=True, text=True).stdout
    except Exception:
        return []
    return [int(l.split(":", 1)[0]) for l in out.splitlines() if l.strip()]

def linecell(path, cap=8):
    ls = hits(path)
    if not ls:
        return "UNKNOWN (no literal `.opencode` line found; seed counted it)"
    show = ls[:cap]
    s = ",".join(str(n) for n in show)
    return f":{s}" + (f" (+{len(ls)-cap} more)" if len(ls) > cap else "")

def rule(path):
    """-> (does, origin, change, cls)"""
    b = os.path.basename(path)
    if b == "SYNC.md":
        return ("documents the runtime's derivation contract", "authored",
                "rewrite: the manifest describes `.opencode`-as-source; post-move it must describe `.skilled` as source and `.opencode` as consumer", "manual")
    if path == ".claude/settings.json":
        return ("executes hooks — every `.opencode` ref sits in the generated `hooks` key command strings", f"authored file, generated `hooks` key — `sync-hook-registrations.cjs` from `hook-registry.json` `script` fields", "regenerate the hooks key after the registry's script paths change (or keep `.opencode` via compat)", "regenerate")
    if path in (".codex/hooks.json", ".cursor/hooks.json", ".devin/hooks.v1.json"):
        return ("registers runtime hooks — `.opencode` refs are generated command strings", f"generated — `sync-hook-registrations.cjs` from `hook-registry.json`", "regenerate after registry `script` paths change (or compat)", "regenerate")
    if re.match(r"\.codex/agents/.*\.toml$", path):
        return ("generated TOML agent dialect; `.opencode` refs embed canonical paths as data", "generated — `sync-agents.cjs`", "regenerate from the moved source (or compat)", "regenerate")
    if re.match(r"\.codex/prompts/.*\.md$", path):
        return ("generated pointer stub naming the canonical `.opencode/commands` file", "generated — `sync-prompts.cjs`", "regenerate from `.skilled/commands` (or compat)", "regenerate")
    if re.match(r"\.pi/agents/.*\.md$", path):
        return ("generated Pi-dialect agent; `.opencode` refs embed canonical paths", "generated — `sync-agents-pi.cjs`", "regenerate from `.skilled/agents` (or compat)", "regenerate")
    if re.match(r"\.pi/prompts/.*\.md$", path):
        return ("generated pointer stub naming the canonical `.opencode/commands` file", "generated — `sync-prompts-pi.cjs`", "regenerate (or compat)", "regenerate")
    if re.match(r"\.hermes/prompts/.*\.md$", path):
        return ("generated prompt template naming the canonical `.opencode/commands` file", "generated — `sync-prompts-hermes.cjs`", "regenerate (or compat)", "regenerate")
    if re.match(r"\.hermes/skills/.*/SKILL\.md$", path):
        return ("generated markdown-only skill copy; `.opencode` refs name the canonical dir for references/assets/scripts", "generated — `sync-skills-hermes.cjs`", "regenerate from `.skilled/skills` (or compat)", "regenerate")
    if re.match(r"\.claude/agents/.*\.md$", path):
        return ("forked agent body; `.opencode` refs are doc/command paths inside the body", "authored fork — kept aligned to canonical agents by the pre-commit mirror gate", "mechanical rewrite of body refs; the gate's upstream becomes `.skilled/agents`", "mechanical")
    if path == ".codex/AGENTS.md":
        return ("runtime voice doc + generated Gate-1 pointer block", "authored + generated block — `sync-gate1-pointers.cjs`", "rewrite authored refs; regenerate the Gate-1 block", "mechanical")
    if path == ".cursor/rules/skill-routing.md":
        return ("routing rules + generated Gate-1 pointer block", "authored + generated block — `sync-gate1-pointers.cjs`", "rewrite authored refs (:9-16 list `.opencode/skills/*/SKILL.md`); regenerate the Gate-1 block", "mechanical")
    if b in ("mcp.json", "mcp_config.json") or path == ".codex/config.toml":
        return ("registers the code_mode MCP server — `args`/`command` execs `.opencode/bin/mcp-code-mode-launcher.cjs`", "authored", "point the launcher arg at `.skilled/bin/mcp-code-mode-launcher.cjs` (or compat)", "mechanical")
    if path == ".claude/agents/README.txt":
        return ("documents the fork and its `.opencode/agents` sibling + crosswalk", "authored", "mechanical rewrite of the two refs", "mechanical")
    if path.endswith("hooks/README.md") or path.endswith("extensions/README.md") or path.endswith("extensions/lib/README.md"):
        return ("documents the mirror surface", "authored", "mechanical rewrite of prose refs", "mechanical")
    if path in (".cursor/commands/goal-cursor.md", ".pi/prompts/goal-pi.md", ".cursor/commands/vision.md"):
        return ("hand-authored native command; embeds an executable `.opencode` path", "authored (exempt from prompt generators per `command-scope.cjs`)", "mechanical rewrite of the embedded command", "mechanical")
    if path == ".hermes/plugins/repo-guards/__init__.py":
        return ("plugin bridge — hardcodes `REPO_ROOT / '.opencode' / ...` path constants for every guard core it shells to", "authored code", "rewrite the path constants (or rely on compat `.opencode`)", "mechanical")
    return ("UNKNOWN role", "UNKNOWN", "inspect", "manual")


def main():
    rows = []
    with open(os.path.join(REPO, SEED)) as fh:
        for r in csv.DictReader(fh, delimiter="\t"):
            if r["area"].startswith("runtime:"):
                rows.append(r)
    by_area = {}
    for r in rows:
        by_area.setdefault(r["area"], []).append(r)
    for area, files in sorted(by_area.items()):
        out = [f"## {area} — {len(files)} files", "",
               "| file | `.opencode` lines | what the reference does | origin | needed change | class |",
               "|---|---|---|---|---|---|"]
        for r in sorted(files, key=lambda x: x["path"]):
            does, origin, change, cls = rule(r["path"])
            out.append(f"| `{r['path']}` | {linecell(r['path'])} | {does} | {origin} | {change} | {cls} |")
        target = sys.argv[1] + f"/map-b-{area.split(':')[1]}.md"
        with open(target, "w") as fh:
            fh.write("\n".join(out) + "\n")
        print(target, len(files))

    # home-level
    out = ["## home-level configuration — 36 candidate paths", "",
           "| path | exists | `.opencode` occ | link target | needed change | class |",
           "|---|---|---|---|---|---|"]
    with open(os.path.join(REPO, HOME)) as fh:
        for r in csv.DictReader(fh, delimiter="\t"):
            p = r["path"]
            occ = r["opencode_occurrences"] or "0"
            tgt = r["link_target"]
            if p == "~/.codex/hooks.json":
                change, cls = ("installed outbound copy of the repo's `.codex/hooks.json` command strings — re-run `install-codex-hooks.mjs` after the registry moves; outside git", "manual")
            elif p == "~/.config/git/hooks" or "/hooks/" in p and "git" in p:
                change, cls = ("absolute symlink into the main checkout's `.opencode/scripts/git-hooks/` — reinstall from the moved tree (installer lives inside it) or keep `.opencode` compat; outside git — no commit updates it; dangles machine-wide", "blocker")
            elif r["is_symlink"] == "yes" and ".opencode" in tgt:
                change, cls = ("absolute link into the main checkout's `.opencode/` — retarget to `.skilled` or rely on compat; outside git", "manual")
            elif r["is_symlink"] == "yes":
                change, cls = ("link targets `.codex/`/`.pi/` (not `.opencode/`) — unaffected by the move", "none")
            elif occ != "0" and "crash.log" in p:
                change, cls = ("historical log — never rewritten", "freeze")
            elif occ != "0":
                change, cls = ("home config naming `.opencode` — update on the machine; outside git", "manual")
            else:
                change, cls = ("no `.opencode` reference — unaffected", "none")
            out.append(f"| `{p}` | {r['exists']} | {occ} | `{tgt}` | {change} | {cls} |")
    target = sys.argv[1] + "/map-b-home.md"
    with open(target, "w") as fh:
        fh.write("\n".join(out) + "\n")
    print(target)

main()
