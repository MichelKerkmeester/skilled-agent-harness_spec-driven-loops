#!/usr/bin/env python3
"""Planner tool for the f-iter003-003 move: writes the new OpenCode reference from the current
shared subsections, then dispatch-units-extra.json and extra-tasks.md. Usage from the repo root:
  python3 -I <folder>/scratch/build_extra.py write <first task number>
  python3 -I <folder>/scratch/build_extra.py verify <tree root with the 79 units applied>"""
import json, os, re, sys

FOLDER = "specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/005-opencode-and-guards"
SH = ".skilled/skills/sk-code/shared/references/"
OC = ".skilled/skills/sk-code/sk-code-opencode"
NEW = OC + "/references/shared/workflow-guardrails.md"
SKILL = OC + "/SKILL.md"
LOG = OC + "/changelog/v1.2.0.0.md"
SRC = FOLDER + "/scratch/units/workflow-guardrails.md"


def section(text, start, end):
    i = text.index(start)
    return text[i + len(start):text.index(end, i)].strip("\n")


def body_without_scope(block):
    # The first paragraph of each source subsection says why it sits in a shared file; that is
    # false once the content lives in the OpenCode tier, so it is the one paragraph not carried.
    paras = block.split("\n\n")
    assert paras[0].startswith("This subsection applies only to the OpenCode surface."), paras[0][:80]
    return "\n\n".join(paras[1:])


def build_reference():
    imp = open(SH + "workflow-implement.md").read()
    ver = open(SH + "workflow-verify.md").read()
    a = body_without_scope(section(imp, "### OpenCode Surface Only: Implementation Guardrails", "\n---\n\n## 3. DISCIPLINE"))
    b = body_without_scope(section(ver, "### OpenCode Surface Only: Verification Reality", "### OpenCode Surface Only: Runtime Build Traps"))
    c = body_without_scope(section(ver, "### OpenCode Surface Only: Runtime Build Traps", "### Baseline And Delta"))
    # The shared files link their siblings as ./workflow-*.md; from references/shared/ the surface's
    # symlinked copies sit one folder up.
    fix = lambda s: s.replace("](./workflow-verify.md)", "](../workflow-verify.md)").replace("](./workflow-implement.md)", "](../workflow-implement.md)")
    a, b, c = fix(a), fix(b), fix(c)
    return """---
title: "OpenCode Workflow Guardrails"
description: "OpenCode-only rules that sit on top of the shared implement and verify workflow: the continuity writer, the sk-git boundary, the spec validation and typecheck chain, and runtime build traps."
trigger_phrases:
  - "opencode workflow guardrails"
  - "opencode verification reality"
  - "runtime build traps"
  - "rebuild dist before verifying"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# OpenCode Workflow Guardrails

OpenCode-only rules for the implement and verify phases.

---

## 1. OVERVIEW

The shared [implementation](../workflow-implement.md) and [verification](../workflow-verify.md) workflows apply on every surface. This file adds what holds only for OpenCode system code under `.skilled/`: the implementation guardrails, the verification command chain and the runtime build traps.

---

## 2. IMPLEMENTATION GUARDRAILS

%s

---

## 3. VERIFICATION REALITY

%s

---

## 4. RUNTIME BUILD TRAPS

%s
""" % (a, b, c)


U = []


def edit(desc, file, old, new, check, expect):
    U.append({"kind": "edit", "desc": desc, "file": file, "old": old, "new": new, "check": check, "expect": expect})


def grepc(text, file):
    return "grep -c -F -- '%s' %s" % (text.replace("'", "'\\''"), file)


U.append({"kind": "create", "desc": "Create the OpenCode workflow guardrails reference, which takes over the three OpenCode-only subsections of the shared implement and verify workflow.",
          "file": NEW, "src": SRC,
          "check": "python3 -I .skilled/skills/sk-doc/scripts/validate_document.py " + NEW + " | grep -E 'VALID|Total issues'", "expect": "Total issues: 0"})
edit("Route the new reference through the OpenCode DEFAULT_RESOURCE, so router-sync check 1b sees it and check 2 is unchanged.", SKILL,
     """    "references/shared/code-organization/directory-and-test-conventions.md",
]

INTENT_SIGNALS = {""",
     """    "references/shared/code-organization/directory-and-test-conventions.md",
    "references/shared/workflow-guardrails.md",
]

INTENT_SIGNALS = {""",
     grepc('    "references/shared/workflow-guardrails.md",', SKILL), "1")
edit("List the new reference in the shared-tier prose map.", SKILL,
     "- `alignment-verification-automation.md` — the alignment-drift verifier\n",
     "- `alignment-verification-automation.md` — the alignment-drift verifier\n- `workflow-guardrails.md`: OpenCode-only implementation guardrails, the verification command chain and runtime build traps, applied on top of the shared implement and verify workflow\n",
     grepc("- `workflow-guardrails.md`: OpenCode-only implementation guardrails", SKILL), "1")
edit("Add the move to the changelog.", LOG,
     "\n## Upgrade\n",
     "- **OpenCode workflow rules live in the OpenCode tier.** `references/shared/workflow-guardrails.md` now holds the implementation guardrails, the verification command chain and the runtime build traps that the shared workflow files carried for this surface only.\n\n## Upgrade\n",
     grepc("- **OpenCode workflow rules live in the OpenCode tier.**", LOG), "1")
U.append({"kind": "command", "desc": "Regenerate the leaf manifest, which now lists the new reference.", "files": [".skilled/skills/sk-code/leaf-manifest.json"],
          "cmd": "node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --write .skilled/skills/sk-code",
          "check": "node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --check .skilled/skills/sk-code; echo \"exit=$?\"", "expect": "exit=0"})
U.append({"kind": "command", "desc": "Prove the router-sync guard and the doc-claims checker accept the new reference.", "files": [],
          "cmd": "node " + OC + "/assets/scripts/verify_router_sync.cjs",
          "check": "node " + OC + "/assets/scripts/verify_router_sync.cjs | tail -1; node " + OC + "/assets/scripts/verify_doc_claims.cjs | grep -c 'workflow-guardrails'",
          "expect": "router-sync: 5/5 checks passed"})


def instruction(u):
    if u["kind"] == "edit":
        return "In %s, replace the exact text <<<OLD\n%s\nOLD>>> with <<<NEW\n%s\nNEW>>>" % (u["file"], u["old"], u["new"])
    if u["kind"] == "create":
        return "Create %s with exactly the content of %s" % (u["file"], u["src"])
    return u["cmd"]


mode = sys.argv[1]
if mode == "write":
    first = int(sys.argv[2])
    open(SRC, "w").write(build_reference())
    out, lines = [], []
    for i, u in enumerate(U):
        tid = "T%03d" % (first + i)
        files = u["files"] if "files" in u else [u["file"]]
        out.append({"task": tid, "files": files, "kind": u["kind"], "instruction": instruction(u), "check": u["check"], "expect": u["expect"]})
        if u["kind"] == "edit":
            body = "In `%s`, replace the exact text given as OLD with the text given as NEW in unit %s of `%s/scratch/dispatch-units-extra.json`, where both are quoted in full between the <<<OLD and <<<NEW markers. OLD occurs exactly once in the file after the first 79 units have landed." % (u["file"], tid, FOLDER)
        elif u["kind"] == "create":
            body = "Create `%s` with exactly the content of `%s`." % (u["file"], u["src"])
        else:
            body = "Run `%s`." % u["cmd"]
        chk = ("Check: run the check command of unit %s in `%s/scratch/dispatch-units-extra.json`." % (tid, FOLDER)) if "`" in u["check"] else ("Check: `%s`." % u["check"])
        lines.append("- [ ] %s %s %s %s Expected: `%s`. (`%s`)" % (tid, u["desc"], body, chk, u["expect"], files[0] if files else NEW))
    json.dump(out, open(FOLDER + "/scratch/dispatch-units-extra.json", "w"), indent=2)
    open(FOLDER + "/scratch/extra-tasks.md", "w").write("\n".join(lines) + "\n")
    print("wrote %d extra units, first %s" % (len(out), out[0]["task"]))
elif mode in ("verify", "apply"):
    root = sys.argv[2]
    bad = 0
    for u in U:
        if u["kind"] == "edit":
            p = os.path.join(root, u["file"])
            s = open(p).read()
            n = s.count(u["old"])
            if n != 1:
                bad += 1
                print("%s: OLD occurs %d times" % (u["file"], n))
            elif mode == "apply":
                open(p, "w").write(s.replace(u["old"], u["new"]))
        elif u["kind"] == "create" and mode == "apply":
            p = os.path.join(root, u["file"])
            open(p, "w").write(open(u["src"]).read())
    print("extra units %d, edits %d, OLD not unique %d" % (len(U), sum(1 for u in U if u["kind"] == "edit"), bad))
    sys.exit(1 if bad else 0)
