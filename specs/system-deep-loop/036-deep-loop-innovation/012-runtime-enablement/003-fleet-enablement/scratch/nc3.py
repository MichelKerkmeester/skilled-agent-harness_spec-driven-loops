import subprocess, sys, shutil, re, os
R = "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/022-012-runtime-enablement-build/.opencode/skills/system-deep-loop/runtime"
DRV = os.path.join(R, "lib/fleet-enablement/enablement-driver.ts")
CLI = os.path.join(R, "scripts/enable-modes.cjs")
TESTS = ["tests/unit/fleet-enablement.vitest.ts", "tests/unit/enable-modes-cli.vitest.ts"]

def run_tests():
    p = subprocess.run(["npx","vitest","run",*TESTS,"--reporter=verbose"], cwd=R,
                       capture_output=True, text=True)
    out = p.stdout + p.stderr
    failed = re.findall(r"[×✗] .*vitest\.ts > [^>]+> (.+?)(?: \d+ms)?$", out, re.M)
    m = re.search(r"Tests\s+(?:(\d+) failed \| )?(\d+) passed", out)
    return p.returncode, failed, (m.group(0) if m else "??")

def perturb(desc, target, fn, expects):
    bak = target + ".ncbak"; shutil.copy(target, bak)
    src = open(target).read(); new = fn(src)
    assert new != src, f"perturbation '{desc}' did not apply"
    open(target,"w").write(new)
    code, failed, summary = run_tests()
    shutil.copy(bak, target); os.remove(bak)
    hits = [e for e in expects if any(e.lower() in f.lower() for f in failed)]
    ok = len(hits) == len(expects)
    print(f"{desc}\n    exit={code}  {summary}")
    print(f"    failed: {failed if failed else 'none'}")
    print(f"    expected {expects} -> {'RED (proven)' if ok else 'STILL GREEN (untested!)'}\n")
    return ok

res = []
res.append(perturb("NC-M revert the cross-run union in save()", DRV,
    lambda s: s.replace(
      "    const persistedModes = FLEET_MODE_ORDER.filter(\n      (mode) => skipped.has(mode) || completed.includes(mode),\n    );",
      "    const persistedModes = [...completed];"),
    ["keeps an earlier run", "does not re-plan a mode"]))
res.append(perturb("NC-O revert the guard around the authority read", CLI,
    lambda s: s.replace(
      "    let record;\n    try {\n      record = registry.read(mode);\n    } catch (error) {\n      return {\n        mode,\n        ok: false,\n        failedCheck: 'flip',\n        reason: error instanceof Error ? error.message : String(error),\n        surfaces: null,\n      };\n    }",
      "    const record = registry.read(mode);"),
    ["authority record cannot be read"]))

print("=" * 60)
print(f"{sum(res)}/{len(res)} new guards went red when reverted")
sys.exit(0 if all(res) else 1)
