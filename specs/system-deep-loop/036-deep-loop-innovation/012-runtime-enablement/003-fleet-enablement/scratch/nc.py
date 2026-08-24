import subprocess, sys, shutil, re, os
R = "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/022-012-runtime-enablement-build/.opencode/skills/system-deep-loop/runtime"
CLI = os.path.join(R, "scripts/enable-modes.cjs")
BAK = CLI + ".ncbak"
TEST = "tests/unit/enable-modes-cli.vitest.ts"

def run_tests():
    p = subprocess.run(["npx","vitest","run",TEST,"--reporter=verbose"], cwd=R,
                       capture_output=True, text=True)
    out = p.stdout + p.stderr
    failed = re.findall(r"[×✗] .*> enable-modes CLI > (.+?)(?: \d+ms)?$", out, re.M)
    m = re.search(r"Tests\s+(?:(\d+) failed \| )?(\d+) passed", out)
    return p.returncode, failed, (m.group(0) if m else "??")

def perturb(desc, fn, expect):
    shutil.copy(CLI, BAK)
    src = open(CLI).read()
    new = fn(src)
    assert new != src, f"perturbation '{desc}' changed nothing — it did not apply"
    open(CLI,"w").write(new)
    code, failed, summary = run_tests()
    shutil.copy(BAK, CLI); os.remove(BAK)
    hit = [f for f in failed if expect.lower() in f.lower()]
    verdict = "RED (guard proven)" if hit else "STILL GREEN (guard untested!)"
    print(f"{desc}\n    exit={code}  {summary}")
    print(f"    failed: {failed if failed else 'none'}")
    print(f"    expected '{expect}' to fail -> {verdict}\n")
    return bool(hit)

results = []
# NC-A: drop the value-required check
results.append(perturb("NC-A remove ARG_VALUE_REQUIRED check",
    lambda s: s.replace("if (typeof args[key] !== 'string' || args[key].trim() === '') {",
                        "if (false) {"),
    "state flag with no value"))
# NC-B: drop the flag-takes-no-value check
results.append(perturb("NC-B remove ARG_TAKES_NO_VALUE check",
    lambda s: s.replace("} else if (args[key] !== true) {", "} else if (false) {"),
    "dry-run flag that swallowed"))
# NC-C: drop the resume guard
results.append(perturb("NC-C remove RESUME_NOT_REQUESTED guard",
    lambda s: s.replace("      if (!resume) {", "      if (false) {"),
    "refuses to continue a stopped run"))
# NC-D: make the dry run construct the registry
results.append(perturb("NC-D dry run constructs the authority registry",
    lambda s: s.replace(
      "  if (dryRun) {\n    // A dry run changes nothing",
      "  if (dryRun) {\n    const { AuthorityRegistry: ARleak } = await import('../lib/per-mode-authority-flip/index.ts');\n    new ARleak(args.authorityRoot || '/tmp/nc-leak');\n    // A dry run changes nothing"),
    "never creates the authority root"))
# NC-E: make every step succeed
results.append(perturb("NC-E per-mode step always reports success",
    lambda s: s.replace("    if (record.state !== 'cutover_ready') {", "    if (false) {"),
    "stops at the first mode"))

print("=" * 60)
print(f"{sum(results)}/{len(results)} guards went red when removed")
sys.exit(0 if all(results) else 1)
