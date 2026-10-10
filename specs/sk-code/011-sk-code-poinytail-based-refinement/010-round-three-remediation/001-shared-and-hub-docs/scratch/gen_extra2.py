#!/usr/bin/env python3
"""Build the batch-2 units that turn the OpenCode-only subsections into pointers.

Run from the repository root: python3 -I <folder>/scratch/gen_extra2.py
The post-chain text of each file is the current file with every main build unit
for it applied (a unit already landed is skipped), so OLD texts match the state
the chain leaves. Writes dispatch-units-extra2.json, units-extra2/*.txt and
extra2-tasks.md under <folder>/scratch, and prints one UNIQUE or FAIL line per unit.
"""
import json
import pathlib
import sys

FOLDER = "specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/001-shared-and-hub-docs"
ROOT = pathlib.Path.cwd()
SCRATCH = ROOT / FOLDER / "scratch"
UNITS_DIR = SCRATCH / "units-extra2"
FIRST_TASK = 163
WI = ".skilled/skills/sk-code/shared/references/workflow-implement.md"
WV = ".skilled/skills/sk-code/shared/references/workflow-verify.md"
MR = ".skilled/skills/sk-code/mode-registry.json"
TARGET = "../../sk-code-opencode/references/shared/workflow-guardrails.md"

def post_chain(path):
    text = (ROOT / path).read_text(encoding="utf-8")
    for unit in json.load(open(SCRATCH / "dispatch-units.json")):
        if unit["kind"] != "edit" or unit["files"][0] != path:
            continue
        old = (SCRATCH / "units" / f"{unit['task']}.old.txt").read_text(encoding="utf-8")
        new = (SCRATCH / "units" / f"{unit['task']}.new.txt").read_text(encoding="utf-8")
        if new and new in text and (old in new or old not in text):
            continue
        assert text.count(old) == 1, f"{unit['task']} cannot be replayed on {path}"
        text = text.replace(old, new, 1)
    return text

def span(text, start, end):
    """Text from the start marker up to, not including, the end marker."""
    i = text.index(start)
    j = text.index(end, i + len(start))
    return text[i:j]

sim = {WI: post_chain(WI), WV: post_chain(WV), MR: post_chain(MR)}
units = [
    (WI, span(sim[WI], "### OpenCode Surface Only: Implementation Guardrails\n", "\n---\n") + "\n",
     "### OpenCode Implementation Guardrails\n\n"
     f"OpenCode work: see the implementation guardrails in [OpenCode workflow guardrails]({TARGET}#2-implementation-guardrails).\n\n",
     "Replace the OpenCode implementation guardrails subsection with a pointer"),
    (WV, span(sim[WV], "### OpenCode Surface Only: Verification Reality\n", "### OpenCode Surface Only: Runtime Build Traps\n"),
     "### OpenCode Verification Reality\n\n"
     f"OpenCode work: see the verification reality, including the `validate.sh` pointer, in [OpenCode workflow guardrails]({TARGET}#3-verification-reality).\n\n",
     "Replace the OpenCode verification reality subsection with a pointer"),
    (WV, span(sim[WV], "### OpenCode Surface Only: Runtime Build Traps\n", "### Baseline And Delta\n"),
     "### OpenCode Runtime Build Traps\n\n"
     f"OpenCode work: see the runtime build traps in [OpenCode workflow guardrails]({TARGET}#4-runtime-build-traps).\n\n",
     "Replace the OpenCode runtime build traps subsection with a pointer"),
]
# The review cache moved out of the repository, so the registry note must name
# the user cache path and stop calling the cache untracked.
REGISTRY_UNIT = (MR,
    "Write is scoped to the ephemeral, untracked review cache (.skilled/.code-review-cache/<repo-ref>.jsonl); ",
    "Write is scoped to the ephemeral review cache in the reviewing user's cache directory (${XDG_CACHE_HOME:-$HOME/.cache}/sk-code-review/<repo-ref>.jsonl), outside the reviewed repository; ",
    "Point the review-mode write scope note at the user cache path")
REGISTRY_TASK = FIRST_TASK + len(units) + 1
REGISTRY_CHECK = ("node -e 'const s=require(\"fs\").readFileSync(\".skilled/skills/sk-code/mode-registry.json\",\"utf8\");"
    "const n=JSON.parse(s).modes.find((m)=>m.backendKind===\"review-cache\");const w=JSON.stringify(n);"
    "const ok=w.includes(\"${XDG_CACHE_HOME:-$HOME/.cache}/sk-code-review/<repo-ref>.jsonl\")&&!s.includes(\"untracked\")&&!s.includes(\".code-review-cache\");"
    "console.log(ok?\"T167 OK\":\"T167 BAD\");process.exit(ok?0:1)'")

UNITS_DIR.mkdir(parents=True, exist_ok=True)
for stale in UNITS_DIR.glob("*.txt"):
    stale.unlink()
out, lines, failures = [], [], 0
check = f"node {FOLDER}/scratch/check-unit-extra2.cjs"
for i, (path, old, new, title) in enumerate(units + [REGISTRY_UNIT]):
    tid = f"T{FIRST_TASK + i:03d}" if i < len(units) else f"T{REGISTRY_TASK:03d}"
    count = sim[path].count(old)
    print(f"{'UNIQUE' if count == 1 else f'FAIL count={count}'} {tid} {path}")
    failures += count != 1
    sim[path] = sim[path].replace(old, new, 1)
    (UNITS_DIR / f"{tid}.old.txt").write_text(old, encoding="utf-8")
    (UNITS_DIR / f"{tid}.new.txt").write_text(new, encoding="utf-8")
    out.append({"task": tid, "files": [path], "kind": "edit",
                "instruction": f"In {path}, replace the exact text <<<OLD\n{old}\nOLD>>> with <<<NEW\n{new}\nNEW>>>",
                "check": f"{check} {tid}" + ("" if i < len(units) else f" && {REGISTRY_CHECK}"),
                "expect": f"LANDED {tid}" + ("" if i < len(units) else f"\nT{REGISTRY_TASK} OK")})
    if i < len(units):
        lines.append(f"- [ ] {tid} {title}. In `{path}`, replace the exact text in `{FOLDER}/scratch/units-extra2/{tid}.old.txt` (it occurs once, the whole subsection from its heading) with the exact text in `{FOLDER}/scratch/units-extra2/{tid}.new.txt`. Check: `{check} {tid}` prints `LANDED {tid}` and exits 0. (`{path}`)")
    else:
        registry_line = (f"- [ ] {tid} {title}. In `{path}`, replace the exact text in `{FOLDER}/scratch/units-extra2/{tid}.old.txt` (it occurs once, inside the review mode's writeScopeNote) with the exact text in `{FOLDER}/scratch/units-extra2/{tid}.new.txt`. Check: `{check} {tid} && {REGISTRY_CHECK}` prints `LANDED {tid}` then `T{REGISTRY_TASK} OK` and exits 0. (`{path}`)")

lines.append(
    f"- [ ] T{FIRST_TASK + len(units)} Verify batch 2, after the OpenCode guardrails file exists. Run "
    "`rg -c 'OpenCode Surface Only' .skilled/skills/sk-code/shared/references; echo \"rg=$?\"; "
    "test -f .skilled/skills/sk-code/sk-code-opencode/references/shared/workflow-guardrails.md; echo \"target=$?\"; "
    "grep -c -x -e '## 2. IMPLEMENTATION GUARDRAILS' -e '## 3. VERIFICATION REALITY' -e '## 4. RUNTIME BUILD TRAPS' .skilled/skills/sk-code/sk-code-opencode/references/shared/workflow-guardrails.md; "
    f"node {FOLDER}/scratch/check-links.cjs; {REGISTRY_CHECK}`. Expected: only `rg=1`, `target=0`, `3`, `checked=127 missing=0` (three pointers removed, three added) and `T{REGISTRY_TASK} OK`. "
    "(`.skilled/skills/sk-code/shared/references/workflow-verify.md`)")
lines.insert(len(units), registry_line)
(SCRATCH / "dispatch-units-extra2.json").write_text(json.dumps(out, indent=2) + "\n", encoding="utf-8")
(SCRATCH / "extra2-tasks.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
import os
if os.environ.get("SIM_OUT"):
    for f, t in sim.items():
        dst = pathlib.Path(os.environ["SIM_OUT"]) / f
        dst.parent.mkdir(parents=True, exist_ok=True)
        dst.write_text(t, encoding="utf-8")
print(f"units={len(out)} failures={failures} last_task={out[-1]['task']}")
sys.exit(1 if failures else 0)
