"""Build dispatch-units.json for this plan and verify every OLD text is unique in the live tree."""
import json, os, sys
S = "specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/001-review-canary-pins/scratch"
P = ".skilled/skills/sk-code/sk-code-review"
JS = f"{P}/scripts/check-rule-copies.js"
SH = f"{P}/scripts/check-rule-copies.test.sh"
RM = f"{P}/scripts/README.md"
DD = f"{P}/references/pr-state-dedup.md"
SK = f"{P}/SKILL.md"
RD = f"{P}/README.md"
CL = f"{P}/changelog/v1.7.1.0.md"

js_old1 = "// It pins the assessment tokens to the status-line vocabulary and the pointer to the shared detection contract, so neither can drift back.\n"
js_new1 = js_old1 + "// It pins the AGENTS.md evidence-floor labels the review mode applies, so a renamed or dropped floor fails here instead of going unnoticed.\n"

js_old2 = """  {
    file: '.skilled/skills/sk-code/sk-code-review/references/review-ux-single-pass.md',
    strings: ['`APPROVED`, `REQUESTED_CHANGES` or `COMMENTED`'],
  },
"""
js_new2 = js_old2 + """  {
    file: 'AGENTS.md',
    strings: [
      '**Confirmed vs inferred**',
      '**Observed command evidence**',
      '**Finding = hypothesis**',
      '**Your own read is also one lens**',
    ],
  },
"""

sh_old = "# Seeded examples ensure the canary rejects content after status and missing context.\n"
sh_new = """# FAIL: an AGENTS.md evidence-floor label the review mode applies is renamed.
CASE_REVIEW_FLOOR="$TMP_DIR/review_floor_label"
seed_tree "$CASE_REVIEW_FLOOR"
node -e 'const fs=require("fs");const f=process.argv[1];fs.writeFileSync(f, fs.readFileSync(f,"utf8").replace("**Finding = hypothesis**","**Finding = claim**"));' \\
  "$CASE_REVIEW_FLOOR/AGENTS.md"
run_case 1 "review_floor_label_drift" node "$CHECKER" --root "$CASE_REVIEW_FLOOR"
expect_output 'AGENTS.md: missing exact invariant string: "**Finding = hypothesis**"' "review_floor_label_drift_output" node "$CHECKER" --root "$CASE_REVIEW_FLOOR"

""" + sh_old

rm_old1 = "that `code-quality-standards.md` keeps the items the restraint ladder may never cut, that at least one Iron Law line"
rm_new1 = "that `code-quality-standards.md` keeps the items the restraint ladder may never cut, that `AGENTS.md` keeps the four evidence-floor labels the review mode applies (`Confirmed vs inferred`, `Observed command evidence`, `Finding = hypothesis` and `Your own read is also one lens`), that at least one Iron Law line"
rm_old2 = "and a drifted gate-recommendation token in `review-ux-single-pass.md` |"
rm_new2 = "a drifted gate-recommendation token in `review-ux-single-pass.md`, and a renamed evidence-floor label in `AGENTS.md` |"
rm_old3 = "Expected: `OK: all rule invariants present (6 exact-string file(s)"
rm_new3 = "Expected: `OK: all rule invariants present (7 exact-string file(s)"

dd_old = "Detailed reference for the M-1 PR-state deduplication gate documented in `../SKILL.md` §9.1.\n"
dd_new = "## 1. OVERVIEW\n\n" + dd_old

v_old = "version: 1.7.0.0\n"
v_new = "version: 1.7.1.0\n"

def edit(task, f, old, new, check, expect):
    return {"task": task, "files": [f], "kind": "edit",
            "instruction": f"In {f}, replace the exact text <<<OLD\n{old}OLD>>> with <<<NEW\n{new}NEW>>>" if old.endswith("\n") else f"In {f}, replace the exact text <<<OLD\n{old}\nOLD>>> with <<<NEW\n{new}\nNEW>>> (the OLD and NEW texts are a fragment of one line; the newline before OLD>>> and NEW>>> is not part of them)",
            "check": check, "expect": expect, "_old": old, "_new": new}

units = [
    edit("T010", JS, js_old1, js_new1, f"grep -cF -- 'evidence-floor labels the review mode applies, so a renamed or dropped floor' {JS}", "1"),
    edit("T011", JS, js_old2, js_new2, f"grep -cF -- \"'**Your own read is also one lens**',\" {JS}", "1"),
    edit("T012", SH, sh_old, sh_new, f"grep -cF -- 'review_floor_label_drift_output' {SH}", "1"),
    edit("T013", RM, rm_old1, rm_new1, f"grep -cF -- 'keeps the four evidence-floor labels the review mode applies' {RM}", "1"),
    edit("T014", RM, rm_old2, rm_new2, f"grep -cF -- 'and a renamed evidence-floor label in' {RM}", "1"),
    edit("T015", RM, rm_old3, rm_new3, f"grep -cF -- '(7 exact-string file(s)' {RM}", "1"),
    edit("T016", DD, dd_old, dd_new, f"grep -cxF -- '## 1. OVERVIEW' {DD}", "1"),
    edit("T017", SK, v_old, v_new, f"grep -cxF -- 'version: 1.7.1.0' {SK}", "1"),
    edit("T018", RD, v_old, v_new, f"grep -cxF -- 'version: 1.7.1.0' {RD}", "1"),
    {"task": "T019", "files": [CL], "kind": "create",
     "instruction": f"Create {CL} with exactly the content of {S}/units/changelog-v1.7.1.0.md (run: cp {S}/units/changelog-v1.7.1.0.md {CL})",
     "check": f"cmp {S}/units/changelog-v1.7.1.0.md {CL}; echo exit=$?", "expect": "exit=0"},
]

mode = sys.argv[1] if len(sys.argv) > 1 else "check"
root = sys.argv[2] if len(sys.argv) > 2 else "."
ok = True
for u in units:
    if u["kind"] != "edit":
        continue
    path = os.path.join(root, u["files"][0])
    text = open(path, encoding="utf8").read()
    n = text.count(u["_old"])
    print(f"{u['task']} {u['files'][0]} OLD occurrences={n}")
    if n != 1:
        ok = False
    if mode == "apply" and n == 1:
        open(path, "w", encoding="utf8").write(text.replace(u["_old"], u["_new"], 1))
if mode == "apply":
    import shutil
    shutil.copy(os.path.join(S, "units/changelog-v1.7.1.0.md"), os.path.join(root, CL))
if mode == "write":
    out = [{k: v for k, v in u.items() if not k.startswith("_")} for u in units]
    open(os.path.join(S, "dispatch-units.json"), "w", encoding="utf8").write(json.dumps(out, indent=2, ensure_ascii=False) + "\n")
    print(f"wrote {len(out)} units")
print("ALL_OLD_UNIQUE" if ok else "OLD_NOT_UNIQUE")
sys.exit(0 if ok else 1)
