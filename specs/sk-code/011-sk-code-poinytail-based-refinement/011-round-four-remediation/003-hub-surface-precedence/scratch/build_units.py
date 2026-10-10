# Planner script: writes dispatch-units.json for this folder. Run from the repository root.
import json, sys
F = "specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/003-hub-surface-precedence"
CANARY = ".skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json"
ARCHIVE = "specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json"
HUB = ".skilled/skills/sk-code/"

def edit(task, path, old, new, check, expect):
    return {"task": task, "files": [path], "kind": "edit",
            "instruction": f"In {path}, replace the exact text <<<OLD\n{old}\nOLD>>> with <<<NEW\n{new}\nNEW>>>",
            "check": check, "expect": expect}

def gc(text, path):
    q = text.replace("'", "'\\''")
    return f"grep -c -F -- '{q}' {path}"

units = []
old_c = '''      "expectedModes": ["sk-code-review", "sk-code-obsidian"],
      "gold": {
        "expectedIntents": ["sk-code-review", "sk-code-obsidian"],
        "expectedResources": []
      }
    },
    {
      "id": "single-quality",'''
new_c = '''      "expectedModes": ["sk-code-review", "sk-code-obsidian"],
      "gold": {
        "expectedIntents": ["sk-code-review", "sk-code-obsidian"],
        "expectedResources": []
      }
    },
    {
      "id": "surface-collision-obsidian-over-webflow-implementation",
      "prompt": "obsidian plugin webflow implementation",
      "riskSlice": "actor:mutating:composite",
      "expectedAction": "route",
      "expectedSelectionKind": "orderedBundle",
      "expectedModes": ["sk-code-obsidian", "sk-code-webflow"],
      "gold": {
        "expectedIntents": ["sk-code-obsidian", "sk-code-webflow"],
        "expectedResources": []
      }
    },
    {
      "id": "single-quality",'''
units.append(edit("T012", CANARY, old_c, new_c, gc('"id": "surface-collision-obsidian-over-webflow-implementation",', CANARY), "1"))
units.append({"task": "T013", "files": [f"{F}/scratch/neg-canary.txt"], "kind": "command",
              "instruction": f"node {F}/scratch/canary-assert.cjs > {F}/scratch/neg-canary.txt 2>&1; echo \"exit=$?\"",
              "check": f"tail -1 {F}/scratch/neg-canary.txt; grep -c -F 'FAIL surface-collision-obsidian-over-webflow-implementation route orderedBundle sk-code-webflow,sk-code-obsidian' {F}/scratch/neg-canary.txt",
              "expect": "cases 13 failures 1"})
old_t = '    "tieBreak": ["sk-code-quality", "sk-code-review", "sk-code-webflow", "sk-code-opencode", "sk-code-obsidian"],'
new_t = '    "tieBreak": ["sk-code-quality", "sk-code-review", "sk-code-opencode", "sk-code-obsidian", "sk-code-webflow"],'
units.append(edit("T014", HUB + "hub-router.json", old_t, new_t, gc(new_t.strip(), HUB + "hub-router.json"), "1"))
units.append({"task": "T015", "files": [ARCHIVE], "kind": "command",
              "instruction": f"cp {CANARY} {ARCHIVE}",
              "check": f"cmp {CANARY} {ARCHIVE}; echo \"cmp=$?\"", "expect": "cmp=0"})
for task, name in (("T016", "hub-router.json"), ("T017", "mode-registry.json"), ("T018", "description.json")):
    units.append(edit(task, HUB + name, '  "version": "2.2.5.0",', '  "version": "2.2.6.0",', gc('"version": "2.2.6.0",', HUB + name), "1"))
units.append(edit("T019", HUB + "SKILL.md", "version: 2.2.5.0", "version: 2.2.6.0", gc("version: 2.2.6.0", HUB + "SKILL.md"), "1"))
old_s = '"review my webflow animation for jank" → `[sk-code-review, sk-code-webflow]`.'
new_s = old_s + " Bundled surfaces follow the `routerPolicy.tieBreak` order, which is the detection precedence OPENCODE > OBSIDIAN > WEBFLOW, so the higher-precedence evidence packet comes first."
units.append(edit("T020", HUB + "SKILL.md", old_s, new_s, gc("Bundled surfaces follow the `routerPolicy.tieBreak` order", HUB + "SKILL.md"), "1"))
units.append(edit("T021", HUB + "ROUTER.md", "version: 2.2.5.0", "version: 2.2.6.0", gc("version: 2.2.6.0", HUB + "ROUTER.md"), "1"))
units.append(edit("T022", HUB + "README.md", "version: 2.2.5.0", "version: 2.2.6.0", gc("version: 2.2.6.0", HUB + "README.md"), "1"))
units.append({"task": "T023", "files": [HUB + "changelog/v2.2.6.0.md"], "kind": "create",
              "instruction": f"Create {HUB}changelog/v2.2.6.0.md with exactly the content of {F}/scratch/units/v2.2.6.0.md",
              "check": f"cmp {HUB}changelog/v2.2.6.0.md {F}/scratch/units/v2.2.6.0.md; echo \"cmp=$?\"", "expect": "cmp=0"})
json.dump(units, open(f"{F}/scratch/dispatch-units.json", "w"), indent=2, ensure_ascii=False)
open(f"{F}/scratch/dispatch-units.json", "a").write("\n")
print(len(units), "units")
