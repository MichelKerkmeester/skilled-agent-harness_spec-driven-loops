"""Compare per-folder failing rules for the cleanup packets: HEAD content vs current content.

Both passes use the current tooling. FRONTMATTER_VALUES is excluded because it is the
rule under test. Edited files are backed up to scratch before HEAD content is restored,
and copied back afterwards; the script verifies the diff is identical at the end.
"""
import json, os, re, shutil, subprocess, sys
SP = sys.argv[1]
VALIDATE = ".skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh"
report = json.load(open("specs/system-speckit/050-open-knowledge-format-adoption/003-context-type-unification/scratch/cleanup-report.json"))
packets = sorted(set(report["packets"]) | {"specs/hooks/002-injection-bloat-reduction/008-sk-code-alignment"})
# Every packet runs on its own: a parent run reaches only its direct children,
# so a packet nested deeper is never validated through its ancestor.
tops = packets

def sh(*a): return subprocess.run(a, capture_output=True, text=True)
diff_before = sh("git", "diff", "--stat", "--", *tops).stdout
changed = [f for f in sh("git", "diff", "--name-only", "--", *tops).stdout.split("\n") if f]
bk = os.path.join(SP, "d1-backup")
for f in changed:
    os.makedirs(os.path.dirname(os.path.join(bk, f)), exist_ok=True)
    shutil.copy2(f, os.path.join(bk, f))
json.dump(changed, open(os.path.join(SP, "d1-changed.json"), "w"))

def run_all():
    out = {}
    for p in tops:
        text = sh("bash", VALIDATE, p, "--strict").stdout
        folder, rules, results = None, out.setdefault(p, {}), []
        for line in text.splitlines():
            m = re.match(r"\s*Folder:\s*(\S+)", line)
            if m: folder = m.group(1).split("/specs/", 1)[-1]; rules.setdefault(folder, [])
            m = re.match(r"^([x!])\s+([A-Z0-9_]+):", line)
            if m and folder and m.group(2) != "FRONTMATTER_VALUES": rules[folder].append(m.group(1) + m.group(2))
            if line.startswith("RESULT:"): results.append(line)
        rules["__results__"] = results
    return out

try:
    sh("git", "checkout", "HEAD", "--", *changed)
    before = run_all()
finally:
    for f in changed: shutil.copy2(os.path.join(bk, f), f)
diff_after = sh("git", "diff", "--stat", "--", *tops).stdout
assert diff_after == diff_before, "restore mismatch"
after = run_all()
changes = {}
for p in tops:
    for folder in sorted(set(before[p]) | set(after[p])):
        if folder == "__results__": continue
        b, a = sorted(before[p].get(folder, [])), sorted(after[p].get(folder, []))
        if b != a: changes[folder] = {"head": b, "now": a}
json.dump({"packets": len(tops), "folders": sum(len(v) - 1 for v in after.values()),
           "changed_folders": changes, "before": before, "after": after},
          open(os.path.join(SP, "d1-proof.json"), "w"), indent=1)
print(f"TOP_PACKETS {len(tops)} FOLDERS {sum(len(v) - 1 for v in after.values())} CHANGED {len(changes)} RESTORE_OK")
