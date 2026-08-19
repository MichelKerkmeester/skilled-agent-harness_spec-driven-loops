import subprocess, sys, shutil, re, os
R = "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/022-012-runtime-enablement-build/.opencode/skills/system-deep-loop/runtime"
DRV = os.path.join(R, "lib/fleet-enablement/enablement-driver.ts")
MAP = os.path.join(R, "lib/fleet-enablement/mode-surface-map.ts")
TEST = "tests/unit/fleet-enablement.vitest.ts"

def run_tests():
    p = subprocess.run(["npx","vitest","run",TEST,"--reporter=verbose"], cwd=R,
                       capture_output=True, text=True)
    out = p.stdout + p.stderr
    failed = re.findall(r"[×✗] .*vitest\.ts > [^>]+> (.+?)(?: \d+ms)?$", out, re.M)
    m = re.search(r"Tests\s+(?:(\d+) failed \| )?(\d+) passed", out)
    return p.returncode, failed, (m.group(0) if m else "??")

def perturb(desc, target, fn, expect):
    bak = target + ".ncbak"
    shutil.copy(target, bak)
    src = open(target).read()
    new = fn(src)
    assert new != src, f"perturbation '{desc}' changed nothing — it did not apply"
    open(target,"w").write(new)
    code, failed, summary = run_tests()
    shutil.copy(bak, target); os.remove(bak)
    hit = [f for f in failed if expect.lower() in f.lower()]
    print(f"{desc}\n    exit={code}  {summary}")
    print(f"    failed: {failed if failed else 'none'}")
    print(f"    expected '{expect}' -> {'RED (guard proven)' if hit else 'STILL GREEN (guard untested!)'}\n")
    return bool(hit)

res = []
res.append(perturb("NC-F dry run falls through to the real loop", DRV,
    lambda s: s.replace("  if (dryRun) {\n    return {", "  if (false) {\n    return {"),
    "invokes nothing during a dry run"))
res.append(perturb("NC-G failure no longer stops the loop", DRV,
    lambda s: s.replace(
      "    return { dryRun, plannedModes, skippedModes, completedModes, failure, untouchedModes };\n  }",
      "    continue;\n  }"),
    "never invokes a mode after the failure"))
res.append(perturb("NC-H resume no longer skips completed modes", DRV,
    lambda s: s.replace("const plannedModes = FLEET_MODE_ORDER.filter((mode) => !skipped.has(mode));",
                        "const plannedModes = [...FLEET_MODE_ORDER];"),
    "resumes without re-running completed modes"))
res.append(perturb("NC-I state shape validation removed", DRV,
    lambda s: s.replace("    !Array.isArray(record.completedModes) ||", "    false ||")
               .replace("    record.completedModes.some((mode) => typeof mode !== 'string')", "    false"),
    "completed list is not a list"))
res.append(perturb("NC-J progress saved only at the end", DRV,
    lambda s: s.replace("      completedModes.push(mode);\n      save(completedModes, null);",
                        "      completedModes.push(mode);"),
    "persists progress after every success"))
res.append(perturb("NC-K pilot mode no longer excluded", MAP,
    lambda s: s.replace("AUTHORITY_FLIP_MODE_ORDER.filter(\n  (mode) => mode !== 'deep-research',\n)",
                        "AUTHORITY_FLIP_MODE_ORDER.filter(\n  () => true,\n)"),
    "excludes the already-enabled pilot mode"))
res.append(perturb("NC-L empty projectable set reported as populated", MAP,
    lambda s: s.replace("const hasProjectableSurface = projectableSurfaceIds.length > 0;",
                        "const hasProjectableSurface = true;"),
    "projectable set is empty"))

print("=" * 60)
print(f"{sum(res)}/{len(res)} guards went red when removed")
sys.exit(0 if all(res) else 1)
