#!/usr/bin/env python3
"""Assemble the Map A / Map B / Map C synthesis sections for research.md."""
import csv
import glob
import os
import re

OUT = os.path.dirname(os.path.abspath(__file__))

SECTION_TITLES = {
    "claude": "`.claude` (57 links)",
    "codex": "`.codex` (19 links)",
    "cursor": "`.cursor` (65 links)",
    "devin": "`.devin` (34 links)",
    "hermes": "`.hermes` (2 links)",
    "pi": "`.pi` (19 links)",
    "opencode-internal-hooks": "internal `.opencode` — hooks index (101 links)",
    "opencode-internal-changelog": "internal `.opencode` — changelog index (49 links)",
    "opencode-internal-skills": "internal `.opencode` — skill trees (50 links)",
    "opencode-internal-install-guides": "internal `.opencode` — install guides (5 links)",
    "opencode-internal-other": "internal `.opencode` — other (2 links)",
    "opencode-internal-plugins": "internal `.opencode` — plugins (1 link)",
    "specs": "`specs/` (29 links)",
    "root-level": "root-level (2 links)",
}

ORIGIN_SHORT = [
    (r"^generated: sync-runtime-mirrors", "generated: sync-runtime-mirrors.cjs"),
    (r"^generated: sync-prompts\.cjs", "generated: sync-prompts.cjs"),
    (r"^generated: sync-prompts-pi\.cjs", "generated: sync-prompts-pi.cjs"),
    (r"^generated: sync-prompts-hermes\.cjs", "generated: sync-prompts-hermes.cjs"),
    (r"^generated: sync-skills-hermes\.cjs", "generated: sync-skills-hermes.cjs"),
    (r"^generated: sync-agents-pi\.cjs", "generated: sync-agents-pi.cjs"),
    (r"^generated: sync-agents\.cjs", "generated: sync-agents.cjs"),
    (r"^generated: sync-hook-registrations\.cjs", "generated: sync-hook-registrations.cjs"),
    (r"^build-artifact link", "build artifact (dist)"),
    (r"^hand-made", "hand-made"),
    (r"^authored", "authored"),
    (r"^mixed", "mixed"),
]

AREA_LABEL = {
    "opencode-commands": "`.opencode/commands`",
    "opencode-agents": "`.opencode/agents`",
    "opencode-hooks": "`.opencode/hooks`",
    "opencode-plugins": "`.opencode/plugins`",
    "opencode-bin": "`.opencode/bin`",
    "opencode-scripts": "`.opencode/scripts`",
    "opencode-install-guides": "`.opencode/install-guides`",
    "opencode-logs": "`.opencode/logs`",
    "opencode-package-lock.json": "`.opencode/package-lock.json`",
    "root": "root documents and configuration",
    "ci": "CI under `.github/`",
}


def short_origin(origin):
    for pattern, label in ORIGIN_SHORT:
        if re.search(pattern, origin):
            return label
    return origin


def map_a():
    with open(os.path.join(OUT, "map-a.tsv"), newline="") as fh:
        rows = list(csv.DictReader(fh, delimiter="\t"))
    by_section = {}
    for r in rows:
        by_section.setdefault(r["section"], []).append(r)

    lines = []
    lines.append("## Map A — symlinks, one section per runtime\n")
    lines.append("**How to read this map.** Each row gives the link path, its current raw target, the target it needs once the real files live under `.skilled/`, its origin, and its classification. The brief asks for both answers wherever the required target depends on whether a `.opencode` compatibility link survives, so the two columns are: **with compat** — every raw target that already traverses `.opencode/...` stays unchanged because the compatibility link keeps resolving; **without compat** — the required target is shown. For external-runtime cells the without-compat value is the exact recomputed relative path. Internal `.opencode` links show `unchanged (travels)` because the link object moves with its target tree at the same depth. `specs/` rows are historical and are shown without a rewrite. Labels: M = mechanical, R = regenerate, F = freeze, N = none, U = manual.\n")
    lines.append("Full per-row tables with dangling/absolute columns and long origin citations are in `iterations/iteration-001.md` (`.claude`, `.codex`), `iteration-002.md` (`.cursor`, `.devin`, `.hermes`, `.pi`), and `iteration-003.md` (internal `.opencode`, `specs/`, root-level).\n")

    order = ["claude", "codex", "cursor", "devin", "hermes", "pi",
             "opencode-internal-hooks", "opencode-internal-changelog", "opencode-internal-skills",
             "opencode-internal-install-guides", "opencode-internal-other", "opencode-internal-plugins",
             "specs", "root-level"]
    for section in order:
        srows = by_section.get(section, [])
        lines.append(f"### Map A · {SECTION_TITLES.get(section, section)} — {len(srows)} links\n")
        lines.append("| link | raw target | required target (with `.opencode` compat) | required target (no compat) | origin | class |")
        lines.append("|---|---|---|---|---|---|")
        for r in sorted(srows, key=lambda x: x["link"]):
            keep = "unchanged" if r["raw_keep_compat"] == r["raw"] else f"`{r['raw_keep_compat']}`"
            no = r["raw_no_compat"]
            if no.startswith("unchanged") or no.startswith("already dangling"):
                no_cell = no.replace("|", "\\|")
            else:
                no_cell = f"`{no}`"
            lines.append(f"| `{r['link']}` | `{r['raw']}` | {keep} | {no_cell} | {short_origin(r['origin'])} | {r['class']} |")
        lines.append("")
    return "\n".join(lines)


def map_b():
    lines = []
    lines.append("## Map B — runtime files that reference outdated paths, one section per runtime\n")
    lines.append("**How to read this map.** One row per non-symlink file under a runtime root that names `.opencode`, with the first actual matching line (verified by reading the file), the seed's matching-line count, what the reference does, whether a generator owns it, and the change it needs. The four generated families share one generator each; the authored files carry the change individually. Home-level configuration follows at the end — counts only, no contents, per the brief.\n")
    with open(os.path.join(OUT, "map-b.md")) as fh:
        table = fh.read().splitlines()
    # split by runtime and re-header
    runtime_of = lambda p: p.split("/")[0]
    grouped = {}
    for row in table:
        if not row.startswith("| `"):
            continue
        m = re.match(r"\| `([^`]+)`", row)
        if not m:
            continue
        grouped.setdefault(runtime_of(m.group(1)), []).append(row)
    for runtime in [".claude", ".codex", ".cursor", ".devin", ".hermes", ".pi"]:
        rows = grouped.get(runtime, [])
        lines.append(f"### Map B · `{runtime}` — {len(rows)} files\n")
        lines.append("| file | line/key | matching lines | what the reference does | generated (owner) or authored | change needed | class |")
        lines.append("|---|---|---:|---|---|---|---|")
        lines.extend(rows)
        lines.append("")
    lines.append("### Map B · home-level configuration (counts only)\n")
    lines.append("| home path | key / role | occurrences | class | change needed |")
    lines.append("|---|---|---:|---|---|")
    home = [
        ("`~/.config/git/hooks/` (7 links)", "absolute symlinks into the main checkout `.opencode/scripts/git-hooks/`", "7", "blocker", "reinstall against the new source root; breaks every repository on the machine at the move moment"),
        ("`~/.codex/hooks.json`", "outbound hook command strings", "18", "manual", "re-run `install-codex-hooks.mjs` after `.codex/hooks.json` regenerates"),
        ("`~/.codex/config.toml`", "project trust entry", "1", "manual", "update the trust key"),
        ("`~/.codex/AGENTS.md`", "symlink to repo `.codex/AGENTS.md`", "is symlink", "none", "follows the repository"),
        ("`~/.hermes/config.yaml`", "MCP launcher reference", "1", "manual", "update launcher path, or keep `.opencode/bin` compatibility"),
        ("`~/.claude.json`", "project entries", "1", "manual", "inspect and update (no secrets copied)"),
        ("`~/.claude/settings.json`", "user settings", "0", "none", "no `.opencode` reference"),
        ("`~/.claude/CLAUDE.md`", "user doc", "0", "none", "no `.opencode` reference"),
        ("`~/.zshrc`", "shell wrappers/aliases", "2", "manual", "update by hand"),
        ("`~/.pi/agent/SYNC.md`", "operator sync notes", "2", "manual", "doc update"),
        ("`~/.pi/agent/trust.json`", "trust entry", "1", "manual", "update the trust key"),
        ("`~/.pi/agent/{settings.json,models.json,modes.json,statusline.sh,pi-cache-optimizer-config.json}`", "symlinks to repo `.pi/*`", "0", "none", "follow the repository"),
        ("`~/.pi/agent/pi-crash.log`", "crash log (not configuration)", "989", "none", "log content only"),
        ("`~/.config/devin/*`", "Devin user config and MCP config", "0", "none", "no `.opencode` reference found"),
        ("`~/.config/git/config`", "absent on this machine", "—", "none", "path does not exist"),
    ]
    for row in home:
        lines.append("| " + " | ".join(row) + " |")
    lines.append("")
    return "\n".join(lines)


def map_c():
    lines = []
    lines.append("## Map C — everything else, by area\n")
    lines.append("**How to read this map.** Areas are grouped as the brief lists them: first the skills (iterations 5-7), then the `.opencode` runtime areas, then the root documents/configuration and CI (iteration 8). For code, the compact rows below list **every file that constructs, matches or hardcodes the path, with its first matching line** and its class; the truncated first construct and the full origin label live in the iteration tables (`iterations/iteration-005.md` through `iteration-008.md`). For documentation, each area's table aggregates the markdown files into artifact classes with files, fenced (runnable-ish) and inline (prose) line counts, and the freeze/mechanical/manual classification.\n")

    code_files = sorted(glob.glob(os.path.join(OUT, "map-c-*-code.md")))
    docs_files = sorted(glob.glob(os.path.join(OUT, "map-c-*-docs.md")))
    slug_of = lambda p: os.path.basename(p).replace("map-c-", "").replace("-code.md", "").replace("-docs.md", "")

    # skills order
    skill_order = ["system-spec-kit", "system-deep-loop", "cli-external-orchestration", "system-skill-advisor",
                   "sk-code", "sk-doc", "mcp-tooling", "sk-design", "sk-vision", "sk-git", "sk-prompt",
                   "mcp-code-mode", "sk-communication"]
    for slug in skill_order:
        code_path = os.path.join(OUT, f"map-c-{slug}-code.md")
        docs_path = os.path.join(OUT, f"map-c-{slug}-docs.md")
        lines.append(f"### Map C · skill `{slug}`\n")
        if os.path.exists(code_path):
            rows = [l for l in open(code_path).read().splitlines() if l.startswith("| `")]
            lines.append(f"**Code: {len(rows)} non-markdown files.** Compact rows (file:line — class); constructs and origins in the iteration table.\n")
            for row in rows:
                m = re.match(r"\| `([^`]+)` \| `([^`]+:\d+)` \| \d+ \| .*? \| [^|]* \| ([a-z]+) \|", row)
                if m:
                    lines.append(f"- `{m.group(2)}` — {m.group(3)}")
                else:
                    lines.append(f"- {row}")
            lines.append("")
        if os.path.exists(docs_path):
            body = open(docs_path).read().strip().splitlines()
            lines.append("**Documentation classes:**\n")
            lines.extend(body[2:])
            lines.append("")
    lines.append("### Map C · `.opencode/skills` root files (area `opencode:skills`, 3 files)\n")
    lines.append("- `.opencode/skills/README.txt:31` — mechanical (7 matching lines; runnable commands)")
    lines.append("- `.opencode/skills/.state/advisor/README.md:21` — mechanical (1 matching line)")
    lines.append("- `.opencode/skills/.state/smart-router-telemetry/README.md:75` — mechanical (3 matching lines; the L88 bug record is `none`)")
    lines.append("")
    for slug in ["opencode-commands", "opencode-agents", "opencode-hooks", "opencode-plugins", "opencode-bin",
                 "opencode-scripts", "opencode-install-guides", "opencode-logs", "opencode-package-lock.json",
                 "root", "ci"]:
        label = AREA_LABEL.get(slug, slug)
        code_path = os.path.join(OUT, f"map-c-{slug}-code.md")
        docs_path = os.path.join(OUT, f"map-c-{slug}-docs.md")
        lines.append(f"### Map C · {label}\n")
        if os.path.exists(code_path):
            rows = [l for l in open(code_path).read().splitlines() if l.startswith("| `")]
            lines.append(f"**Code: {len(rows)} files.**\n")
            for row in rows:
                m = re.match(r"\| `([^`]+)` \| `([^`]+:\d+)` \| \d+ \| .*? \| [^|]* \| ([a-z]+) \|", row)
                if m:
                    lines.append(f"- `{m.group(2)}` — {m.group(3)}")
                else:
                    lines.append(f"- {row}")
            lines.append("")
        if os.path.exists(docs_path):
            body = open(docs_path).read().strip().splitlines()
            lines.append("**Documentation classes:**\n")
            lines.extend(body[2:])
            lines.append("")
    return "\n".join(lines)


def main():
    a = map_a()
    b = map_b()
    c = map_c()
    with open(os.path.join(OUT, "synthesis-map-a.md"), "w") as fh:
        fh.write(a + "\n")
    with open(os.path.join(OUT, "synthesis-map-b.md"), "w") as fh:
        fh.write(b + "\n")
    with open(os.path.join(OUT, "synthesis-map-c.md"), "w") as fh:
        fh.write(c + "\n")
    for name in ["synthesis-map-a.md", "synthesis-map-b.md", "synthesis-map-c.md"]:
        print(name, os.path.getsize(os.path.join(OUT, name)))


if __name__ == "__main__":
    main()
