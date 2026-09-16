#!/usr/bin/env python3
"""Build Map C rows: all tracked files outside specs/ and runtime roots that
name `.opencode`, grouped by seed area. Per-file line citations via literal
`.opencode` grep. Classification rules:

- freeze: changelog/**, benchmark report/run output, logs, dated run dirs
- regenerate: __snapshots__/*.snap, assets/compiled/*, .state/**, package-lock
- manual: root-sentinel/contract code, git-hooks gate scripts, CI workflows,
  opencode.json, PUBLIC-RELEASE.md, AGENTS.md, installers writing external state
- mechanical: everything else (code path refs, docs fenced+inline, fixtures)
"""
import csv, os, re, subprocess, sys

SEED = "specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/002-per-runtime-reference-map/scratch/seed-inventory/tracked-refs.tsv"
REPO = "/Users/michelkerkmeester/worktrees/public/055-skilled-source-root-migration"
CODE_EXTS = {"ts", "mjs", "cjs", "js", "sh", "py"}

# Files whose `.opencode` refs encode the root-identity / gate contract itself.
MANUAL_CODE = {
    ".opencode/skills/system-spec-kit/shared/workspace/repo-root.mjs",
    ".opencode/bin/mcp-code-mode-launcher.cjs",
    ".opencode/bin/install-codex-hooks.mjs",
    ".opencode/bin/skill-advisor.cjs",
    ".opencode/bin/worktree-session.sh",
    ".opencode/bin/relink-local-specs.sh",
    ".opencode/scripts/install-git-hooks.sh",
    ".opencode/scripts/check-vendored-fork-provenance.mjs",
}
MANUAL_PAT = re.compile(
    r"scripts/git-hooks/|spec-root-|workspace-identity|folder-detector|"
    r"spec-root-canonical-resolver|spec-root-write-guard|/core/config\.ts$|"
    r"path-utils\.ts$|check-git-hooks|install-git-hooks|"
    r"check-agent-mirror-sync|mirror-sync-verify|check-contract-drift|"
    r"utils/workspace-root|check-no-spec-imports|hooks/git-hooks-check/|"
    r"hooks/git/"
)

def hitlines(path, cap=8):
    out = subprocess.run(["grep", "-n", "-F", ".opencode", os.path.join(REPO, path)],
                         capture_output=True, text=True).stdout
    nums = [l.split(":", 1)[0] for l in out.splitlines() if l.strip()]
    if not nums:
        return "UNKNOWN — seed counted hits but literal grep found none"
    s = ":" + ",".join(nums[:cap])
    return s + (f" (+{len(nums)-cap})" if len(nums) > cap else "")

def md_kind(path, fenced, inline):
    f, i = int(fenced or 0), int(inline or 0)
    bits = []
    if f: bits.append(f"{f} fenced (runnable)")
    if i: bits.append(f"{i} inline (prose)")
    return "; ".join(bits) if bits else "prose"

def classify(r):
    p, sub, ext = r["path"], r["subarea"], r["ext"]
    fenced, inline = r["md_fenced_lines"], r["md_inline_lines"]
    base = os.path.basename(p)

    if p == ".opencode/package-lock.json":
        return ("lockfile names `.opencode`-scoped deps", "generated — `npm install`",
                "regenerate", "regenerate")
    if ("/changelog/" in p or sub == "changelog") and "/templates/" not in p:
        return ("historical changelog record", "authored history", "none — frozen history", "freeze")
    if "/benchmark/reports/" in p or "/benchmark/runs/" in p or re.search(r"benchmark/.*\d{4}-\d{2}-\d{2}", p):
        return ("benchmark run report — a past run's record", "generated history", "none — frozen history", "freeze")
    if "/cache/" in p:
        return ("cached run artifact (content-addressed)", "generated history", "none — frozen cache of a past run; cache invalidates on path change", "freeze")
    if "launchagents/" in p:
        return ("machine-local launchd config embedding an absolute `.opencode` path", "authored machine config",
                "manual — absolute path won't update itself; reinstall on the host", "manual")
    if p.startswith(".opencode/logs/"):
        return ("logs tree doc/state", "derived/runtime output", "regenerate or leave (runtime output dir)", "regenerate")
    if "/.state/" in p:
        return ("derived state dir doc", "derived state", "regenerates with state; doc refs mechanical", "regenerate")
    if "__snapshots__" in p or ext == "snap":
        return ("test snapshot embedding `.opencode` expectations", "generated — test run", "regenerate snapshots after code moves", "regenerate")
    if "/assets/compiled/" in p or base.endswith(".contract.md"):
        return ("compiled command contract", "generated — `compile-command-contracts.cjs`", "regenerate", "regenerate")
    if sub == "tests" or "/tests/" in p or "/test-fixtures" in p or ".test." in p or ".vitest." in p:
        if "/test-fixtures" in p:
            return ("fixture content naming `.opencode` paths", "authored fixture", "mechanical rewrite with layout (or compat keeps assertions valid)", "mechanical")
        return ("test asserting/constructing `.opencode` paths", "authored test", "expectations follow the emitted path — mechanical rewrite where the code switches to `.skilled`", "mechanical")
    if p in MANUAL_CODE or MANUAL_PAT.search(p):
        return ("constructs/matches `.opencode` as a contract (sentinel, gate, installer, hook)", "authored",
                "decide the contract (compat vs rename) then rewrite; gates self-disengage if missed", "manual")
    if ext in CODE_EXTS:
        return ("code referencing `.opencode` paths", "authored code", "rewrite path refs at the cited lines (or compat)", "mechanical")
    if ext in ("yml", "yaml"):
        if p.startswith(".github/workflows/"):
            return ("CI workflow — path filters/guard skips scope on `.opencode`", "authored CI",
                    "filters must see `.skilled` too, or guards skip silently", "manual")
        return ("command/asset YAML naming `.opencode`", "authored config", "mechanical rewrite", "mechanical")
    if ext == "md":
        if p == "PUBLIC-RELEASE.md":
            return ("published external contract — documents consumers symlinking `.opencode`", "authored contract",
                    "a published promise; rewriting changes what other repos were told", "manual")
        if p == "AGENTS.md":
            return ("root behavior contract; Gate-1 lookup + rules name `.opencode` paths", "authored contract",
                    "rewrite + regenerate downstream pointer blocks (`sync-gate1-pointers.cjs`)", "manual")
        return (f"documentation ({md_kind(p, fenced, inline)})", "authored doc",
                "rewrite refs — fenced lines are runnable, inline are prose", "mechanical")
    # json/toml/txt/tmpl/other data
    if p == "opencode.json":
        return ("opencode project config — plugin/provider paths name `.opencode`", "authored config",
                "the runtime's own project namespace; decide compat vs rename", "manual")
    if base == "hook-registry.json":
        return ("canonical hook registry — `script` fields carry `.opencode` paths consumed by 4 runtimes", "authored data (single rewrite point)",
                "rewrite `script` paths (or compat); then re-run `sync-hook-registrations.cjs`", "mechanical")
    return (f"{ext or 'file'} content naming `.opencode`", "authored", "mechanical rewrite", "mechanical")


def main(areas):
    rows = []
    with open(os.path.join(REPO, SEED)) as fh:
        for r in csv.DictReader(fh, delimiter="\t"):
            if r["area"] in areas:
                rows.append(r)
    groups = {}
    for r in rows:
        key = (r["area"], r["subarea"])
        groups.setdefault(key, []).append(r)
    outdir = sys.argv[1]
    for (area, sub), files in sorted(groups.items()):
        safe = (area + "--" + sub).replace(":", "_").replace("/", "_").replace(" ", "_")
        out = [f"## {area} / {sub} — {len(files)} files", "",
               "| file | `.opencode` lines | what it is | origin | needed change | class |",
               "|---|---|---|---|---|---|"]
        for r in sorted(files, key=lambda x: x["path"]):
            does, origin, change, cls = classify(r)
            out.append(f"| `{r['path']}` | {hitlines(r['path'])} | {does} | {origin} | {change} | {cls} |")
        with open(os.path.join(outdir, f"map-c--{safe}.md"), "w") as fh:
            fh.write("\n".join(out) + "\n")
        print(f"{area}/{sub}: {len(files)}")

if __name__ == "__main__":
    main(sys.argv[2].split(","))
