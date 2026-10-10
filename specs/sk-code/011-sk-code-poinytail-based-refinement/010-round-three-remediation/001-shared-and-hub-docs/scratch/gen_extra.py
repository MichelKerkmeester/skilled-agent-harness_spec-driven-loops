#!/usr/bin/env python3
"""Build the extra dispatch units for the hub playbook and graph-metadata.json.

Run from the repository root: python3 -I <folder>/scratch/gen_extra.py
Writes <folder>/scratch/dispatch-units-extra.json, <folder>/scratch/units-extra/*.txt
and <folder>/scratch/extra-tasks.md, and prints one UNIQUE or FAIL line per unit.
The main build units touch none of these files, so the post-chain state of each
file equals its current state and the OLD texts are computed against it.
"""
import json
import pathlib
import sys

FOLDER = "specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/001-shared-and-hub-docs"
ROOT = pathlib.Path.cwd()
SCRATCH = ROOT / FOLDER / "scratch"
UNITS_DIR = SCRATCH / "units-extra"
FIRST_TASK = 146
PB = ".skilled/skills/sk-code/manual-testing-playbook"
GM = ".skilled/skills/sk-code/graph-metadata.json"
CS1 = f"{PB}/cross-stack-routing/webflow-plus-motion-dev.md"
CS2 = f"{PB}/cross-stack-routing/opencode-plus-motion-dev.md"
CS3 = f"{PB}/cross-stack-routing/non-webflow-plus-motion-dev.md"
SB = f"{PB}/compiled-routing/surface-bundle-compiled-routing.md"
SF = f"{PB}/design-restraint/stack-folders-validator.md"
CH = f"{PB}/tooling-and-hooks/comment-hygiene-hook.md"
QC = "`sk-code-quality/assets/code-quality-checklist/overview-header-and-comments.md`"
VC = "`sk-code-webflow/assets/webflow-verification-checklist.md`"

units = []

def edit(path, old, new, title):
    units.append({"file": path, "old": old, "new": new, "title": title})

# Unresolved expected-asset paths: the Webflow quality checklist lives in the quality
# packet and the Webflow verification checklist sits at the Webflow asset root.
edit(CS1, "- `sk-code-webflow/assets/checklists/code-quality-checklist.md`", f"- {QC}",
     "Repoint the Webflow code-quality checklist in CS-001")
edit(CS1, "- `sk-code-webflow/assets/checklists/verification_checklist.md`", f"- {VC}",
     "Repoint the Webflow verification checklist in CS-001")
edit(CS2, "- `sk-code-webflow/assets/checklists/verification_checklist.md`", f"- {VC}",
     "Repoint the Webflow verification checklist in the OpenCode plus Motion.dev scenario")
edit(CS3, "- `sk-code-webflow/assets/checklists/code-quality-checklist.md`", f"- {QC}",
     "Repoint the Webflow code-quality checklist in the non-Webflow plus Motion.dev scenario")

# Retired packet names.
edit(SB, "(`code-webflow` / `code-opencode` / `code-review` / `quality`)",
     "(`sk-code-webflow` / `sk-code-opencode` / `sk-code-obsidian`, bundled behind `sk-code-review` or `sk-code-quality`)",
     "Use the live packet keys and three surfaces in the surface-bundle focus line")
edit(SB, "- Mode: `code-webflow` (surface-resolved bundle)", "- Mode: `sk-code-webflow` (surface-resolved bundle)",
     "Use the live packet key in the surface-bundle Mode line")
edit(SF, "every known code-opencode language has", "every known sk-code-opencode language has",
     "Use the live packet key in the stack-folders scenario description")
edit(SF, "The code-opencode skill documents stack evidence", "The sk-code-opencode skill documents stack evidence",
     "Use the live packet key in the stack-folders scenario overview")
edit(SF, "the documented code-opencode languages", "the documented sk-code-opencode languages",
     "Use the live packet key in the stack-folders realistic request")
edit(SF, "code-opencode language reference folder validator.", "sk-code-opencode language reference folder validator.",
     "Use the live packet key in the stack-folders source anchor")
edit(CH, "inside `code-quality` (the `sk-code` quality workflow mode)", "inside `sk-code-quality` (the `sk-code` quality workflow mode)",
     "Use the live packet key in the comment-hygiene hand-off note")
edit(CH, "**What `code-quality` hands forward.** When a `code-quality` pass", "**What `sk-code-quality` hands forward.** When a `sk-code-quality` pass",
     "Use the live packet key in the comment-hygiene hands-forward paragraph")
edit(CH, "make `code-quality` a deep-loop mode", "make `sk-code-quality` a deep-loop mode",
     "Use the live packet key in the boundary paragraph, first mention")
edit(CH, "`code-quality` stays the author-side gate", "`sk-code-quality` stays the author-side gate",
     "Use the live packet key in the boundary paragraph, second mention")
edit(CH, "dependency from `code-quality` onto the deep-loop runtime", "dependency from `sk-code-quality` onto the deep-loop runtime",
     "Use the live packet key in the boundary paragraph, third mention")

# graph-metadata.json causal_summary: the regenerator preserves this authored field
# (regenerate-skill-derived.cjs PRESERVED_FIELDS), so it is a hand edit, not a command.
edit(GM, "two workflow modes (quality, code-review) or bundles one of three read-only surface evidence packets (code-webflow, code-opencode, code-obsidian) over a shared surface-detection router. Each surface carries the shared implement/debug/verify workflow doctrine plus its stack knowledge; code-webflow also carries the Motion.dev animation overlay, and code-obsidian carries",
     "two workflow modes (sk-code-quality, sk-code-review) or bundles one of three read-only surface evidence packets (sk-code-webflow, sk-code-opencode, sk-code-obsidian) over a shared surface-detection router. Each surface carries the shared implement/debug/verify workflow doctrine plus its stack knowledge; sk-code-webflow also carries the Motion.dev animation overlay, and sk-code-obsidian carries",
     "Use the live packet keys in the graph-metadata.json causal_summary")

UNITS_DIR.mkdir(parents=True, exist_ok=True)
for stale in UNITS_DIR.glob("*.txt"):
    stale.unlink()
sim, out, lines, failures = {}, [], [], 0
check = f"node {FOLDER}/scratch/check-unit-extra.cjs"
for i, u in enumerate(units):
    tid = f"T{FIRST_TASK + i:03d}"
    text = sim.get(u["file"]) or (ROOT / u["file"]).read_text(encoding="utf-8")
    count = text.count(u["old"])
    print(f"{'UNIQUE' if count == 1 else f'FAIL count={count}'} {tid} {u['file']}")
    failures += count != 1
    sim[u["file"]] = text.replace(u["old"], u["new"], 1)
    (UNITS_DIR / f"{tid}.old.txt").write_text(u["old"], encoding="utf-8")
    (UNITS_DIR / f"{tid}.new.txt").write_text(u["new"], encoding="utf-8")
    out.append({"task": tid, "files": [u["file"]], "kind": "edit",
                "instruction": f"In {u['file']}, replace the exact text <<<OLD\n{u['old']}\nOLD>>> with <<<NEW\n{u['new']}\nNEW>>>",
                "check": f"{check} {tid}", "expect": f"LANDED {tid}"})
    lines.append(f"- [ ] {tid} {u['title']}. In `{u['file']}`, find `` {u['old']} `` (it occurs once) and replace it with `` {u['new']} ``. Check: `{check} {tid}` prints `LANDED {tid}` and exits 0. (`{u['file']}`)")

(SCRATCH / "dispatch-units-extra.json").write_text(json.dumps(out, indent=2) + "\n", encoding="utf-8")
(SCRATCH / "extra-tasks.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
import os
if os.environ.get("SIM_OUT"):
    for f, t in sim.items():
        dst = pathlib.Path(os.environ["SIM_OUT"]) / f
        dst.parent.mkdir(parents=True, exist_ok=True)
        dst.write_text(t, encoding="utf-8")
print(f"units={len(out)} failures={failures} last_task=T{FIRST_TASK + len(out) - 1:03d}")
sys.exit(1 if failures else 0)
