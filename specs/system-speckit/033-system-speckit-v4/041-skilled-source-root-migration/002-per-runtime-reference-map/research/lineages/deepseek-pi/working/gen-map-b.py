#!/usr/bin/env python3
"""Generate Map B row table: non-symlink files under runtime roots that name .opencode.

Input:  working/map-b-seed.tsv (tracked-refs.tsv rows for area runtime:*)
Output: working/map-b.md  (one markdown row per file, with a real file:line citation)
"""
import csv
import os
import re

REPO = "/Users/michelkerkmeester/worktrees/public/055-skilled-source-root-migration"
SEED = os.path.join(OUT_DIR := os.path.dirname(os.path.abspath(__file__)), "map-b-seed.tsv")

RULES = [
    (r"^\.codex/prompts/", "drives discovery: pointer stub tells Codex to read the canonical command file; comment names the source path",
     "generated: sync-prompts.cjs (`.codex/SYNC.md:14-20`)", "regenerate after the generator's .opencode source constant is retargeted", "regenerate"),
    (r"^\.pi/prompts/", "drives discovery: pointer stub tells Pi to read the canonical command file; comment names the source path",
     "generated: sync-prompts-pi.cjs (`.pi/SYNC.md:14-18`)", "regenerate after the generator's .opencode source constant is retargeted", "regenerate"),
    (r"^\.hermes/prompts/", "drives discovery: pointer stub tells Hermes to read the canonical command file; comment names the source path",
     "generated: sync-prompts-hermes.cjs (`.hermes/SYNC.md:22-27`)", "regenerate after the generator's .opencode source constant is retargeted", "regenerate"),
    (r"^\.hermes/skills/", "drives discovery: generated markdown-only skill copy names its canonical .opencode skill directory for references/assets/scripts",
     "generated: sync-skills-hermes.cjs (`.hermes/SYNC.md:12-18`)", "regenerate after the generator's .opencode source constant is retargeted", "regenerate"),
    (r"^\.pi/agents/", "generated agent definition: path-convention text and dispatch gates name .opencode paths",
     "generated: sync-agents-pi.cjs (`.pi/SYNC.md:12-18`)", "regenerate after the generator's .opencode source constant is retargeted", "regenerate"),
    (r"^\.codex/agents/", "generated agent definition: source comment plus path-convention text name .opencode paths",
     "generated: sync-agents.cjs (`.codex/SYNC.md:14-20`)", "regenerate after the generator's .opencode source constant is retargeted", "regenerate"),
    (r"^\.claude/agents/", "authored agent definition (real fork): runs commands, cites skill references, and documents paths under .opencode",
     "authored fork, lockstep with .opencode/agents via check-agent-mirror-sync.cjs (`.claude/SYNC.md:14-18`)",
     "mechanical path rewrite inside the fork, plus the twin update in .opencode/agents", "mechanical"),
    (r"^\.claude/settings\.json$", "registers and executes hooks: every hook command string targets a .opencode path",
     "generated (hooks key): sync-hook-registrations.cjs (L144-148) from hook-registry.json",
     "regenerate after hook-registry.json paths are retargeted", "regenerate"),
    (r"^\.codex/hooks\.json$", "registers and executes hooks: outbound-installed to ~/.codex/hooks.json",
     "generated: sync-hook-registrations.cjs (L151-153) from hook-registry.json",
     "regenerate after hook-registry.json paths are retargeted, then re-run install-codex-hooks.mjs", "regenerate"),
    (r"^\.cursor/hooks\.json$", "registers and executes hooks: every command string targets a .opencode path",
     "generated: sync-hook-registrations.cjs (L159-172) from hook-registry.json",
     "regenerate after hook-registry.json paths are retargeted", "regenerate"),
    (r"^\.devin/hooks\.v1\.json$", "registers and executes hooks: every command string targets a .opencode path",
     "generated: sync-hook-registrations.cjs (L155-157) from hook-registry.json",
     "regenerate after hook-registry.json paths are retargeted", "regenerate"),
    (r"^\.claude/mcp\.json$", "registers MCP server: node .opencode/bin/mcp-code-mode-launcher.cjs; canonical file the root .mcp.json links to",
     "authored (`.claude/SYNC.md:24-41`)", "mechanical path edit, or keep .opencode compatibility", "mechanical"),
    (r"^\.cursor/mcp\.json$", "registers MCP server: node .opencode/bin/mcp-code-mode-launcher.cjs; SYNC.md claims this is a symlink to ../.mcp.json, the tree shows a real file",
     "authored real file (`.cursor/SYNC.md:24-41` disagrees; verified real file on disk)",
     "mechanical path edit; correct the manifest", "mechanical"),
    (r"^\.devin/mcp_config\.json$", "registers MCP server: node .opencode/bin/mcp-code-mode-launcher.cjs",
     "authored, Devin-owned (`.devin/SYNC.md:22-31`)", "mechanical path edit", "mechanical"),
    (r"^\.pi/mcp\.json$", "registers MCP server: node .opencode/bin/mcp-code-mode-launcher.cjs",
     "authored (`.pi/SYNC.md:24-35`)", "mechanical path edit", "mechanical"),
    (r"^\.codex/config\.toml$", "registers MCP server: node .opencode/bin/mcp-code-mode-launcher.cjs; also carries the project trust entry",
     "authored (`.codex/SYNC.md:24-36`)", "mechanical path edit", "mechanical"),
    (r"^\.hermes/plugins/", "executes guard cores: hardcoded path constants shell out to .opencode hook scripts",
     "authored project plugin (`.hermes/SYNC.md:29-34`)", "mechanical path-constant rewrite (10 constants)", "mechanical"),
    (r"^\.cursor/rules/skill-routing\.md$", "drives discovery and routing: authored prose routing table plus a generated Gate 1 pointer block that runs a .opencode command",
     "mixed: authored prose + generated block by sync-gate1-pointers.cjs (L27 provenance)",
     "mechanical prose rewrite; regenerate the Gate 1 block from root AGENTS.md", "regenerate"),
    (r"^\.cursor/rules/sk-vision\.md$", "drives discovery: rule gives the runnable sk-vision CLI command under .opencode",
     "authored (`.cursor/SYNC.md` surface table)", "mechanical path edit", "mechanical"),
    (r"^\.cursor/commands/", "authored native Cursor command: runnable command lines target .opencode scripts",
     "authored native command, exempt from mirror generator (command-scope.cjs)",
     "mechanical path edit", "mechanical"),
    (r"^\.codex/AGENTS\.md$", "documents + drives discovery: authored global voice doc plus a generated Gate 1 pointer block that runs a .opencode command",
     "mixed: authored + generated block by sync-gate1-pointers.cjs (L131 provenance)",
     "manual doc update; regenerate the Gate 1 block from root AGENTS.md", "manual"),
    (r"/SYNC\.md$", "documents the sync surface: names sources, generators and .opencode paths",
     "authored manifest (some claims already stale, see iteration 1-2 findings)", "manual rewrite as part of the migration", "manual"),
    (r"/hooks/README\.md$", "documents the hook discovery mirror and its .opencode sources",
     "authored doc", "mechanical path rewrite"),
    (r"/extensions/(lib/)?README\.md$", "documents the Pi extension bridge and its .opencode sources",
     "authored doc", "mechanical path rewrite", "mechanical"),
]


def rule_for(path):
    for rule in RULES:
        pattern = rule[0]
        if re.search(pattern, path):
            what, origin, change = rule[1], rule[2], rule[3]
            cls = rule[4] if len(rule) > 4 else ("regenerate" if origin.startswith("generated") else "mechanical")
            return what, origin, change, cls
    return "UNKNOWN: names .opencode", "UNKNOWN", "UNKNOWN", "UNKNOWN"


def first_hit(path):
    try:
        with open(os.path.join(REPO, path), encoding="utf-8", errors="replace") as fh:
            for i, line in enumerate(fh, 1):
                if ".opencode" in line:
                    return i
    except OSError:
        return 0
    return 0


def main():
    rows = []
    with open(SEED, newline="") as fh:
        for r in csv.DictReader(fh, delimiter="\t"):
            if not r["area"].startswith("runtime:"):
                continue
            what, origin, change, cls = rule_for(r["path"])
            ln = first_hit(r["path"])
            rows.append({
                "file": r["path"],
                "line": f"{r['path']}:{ln}" if ln else r["path"],
                "hits": r["hit_lines"],
                "what": what,
                "origin": origin,
                "change": change,
                "class": cls,
            })

    rows.sort(key=lambda r: (r["file"]))
    out = os.path.join(os.path.dirname(SEED), "map-b.md")
    with open(out, "w") as fh:
        fh.write("| file | line/key | matching lines | what the reference does | generated (owner) or authored | change needed | class |\n")
        fh.write("|---|---|---:|---|---|---|---|\n")
        for r in rows:
            fh.write("| `{file}` | `{line}` | {hits} | {what} | {origin} | {change} | {cls} |\n".format(
                file=r["file"], line=r["line"], hits=r["hits"], what=r["what"],
                origin=r["origin"], change=r["change"], cls=r["class"]))
    print(f"wrote {len(rows)} rows to {out}")


if __name__ == "__main__":
    main()
