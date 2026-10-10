# Planner script: writes dispatch-units.json for this folder. Run from the repository root.
import json

F = "specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/008-session-aware-tie-break"
RT = ".skilled/bin/lib/compiled-routing"
AU = "specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program"
ROUTER_REL = "009-parent-hub-rollout/001-sk-code/lib/canary-router.cjs"
ENGINE_REL = "014-runtime-engine/lib/compiled-route.cjs"
RESOLVE_REL = "014-runtime-engine/lib/resolve.cjs"
FIXTURE_REL = "009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json"
FRONT = ".skilled/bin/compiled-route.cjs"
TEST = ".skilled/bin/tests/compiled-route-surface-hint.test.cjs"
HUB = ".skilled/skills/sk-code/"
CHANGELOG = HUB + "changelog/v2.2.7.0.md"
HARNESS_REL = "009-parent-hub-rollout/001-sk-code/harness/build-artifacts.cjs"
_counter = [13]


def T():
    _counter[0] += 1
    return f"T{_counter[0]:03d}"


def edit(task, path, old, new, check, expect):
    return {"task": task, "files": [path], "kind": "edit",
            "instruction": f"In {path}, replace the exact text <<<OLD\n{old}\nOLD>>> with <<<NEW\n{new}\nNEW>>>",
            "check": check, "expect": expect}


def command(task, files, instruction, check, expect):
    return {"task": task, "files": files, "kind": "command", "instruction": instruction, "check": check, "expect": expect}


def gc(text, path):
    q = text.replace("'", "'\\''")
    return f"grep -c -F -- '{q}' {path}"


def cmp_check(a, b):
    return f"cmp {a} {b}; echo \"cmp=$?\""


units = []

units.append({"task": T(), "files": [TEST], "kind": "create",
              "instruction": f"Create {TEST} with exactly the content of {F}/scratch/units/compiled-route-surface-hint.test.cjs",
              "check": cmp_check(TEST, f"{F}/scratch/units/compiled-route-surface-hint.test.cjs"), "expect": "cmp=0"})

units.append(command(T(), [f"{F}/scratch/neg-tests.txt"],
                     f"node --test --test-reporter=tap {TEST} > {F}/scratch/neg-tests.txt 2>&1; echo \"exit=$?\"",
                     f"grep -E '^# (pass|fail) ' {F}/scratch/neg-tests.txt",
                     "# fail 3"))

old_f = '''      "expectedModes": ["sk-code-obsidian", "sk-code-webflow"],
      "gold": {
        "expectedIntents": ["sk-code-obsidian", "sk-code-webflow"],
        "expectedResources": []
      }
    },
    {
      "id": "single-quality",'''


def case(cid, prompt, modes, hint=None):
    lines = ['    {', f'      "id": "{cid}",', f'      "prompt": "{prompt}",']
    if hint:
        lines.append(f'      "surfaceHint": "{hint}",')
    m = ", ".join(f'"{x}"' for x in modes)
    lines += ['      "riskSlice": "actor:mutating:composite",', '      "expectedAction": "route",',
              '      "expectedSelectionKind": "orderedBundle",', f'      "expectedModes": [{m}],',
              '      "gold": {', f'        "expectedIntents": [{m}],', '        "expectedResources": []', '      }', '    },']
    return "\n".join(lines)


WF5 = "Add an integration test and unit test coverage plan for a Webflow animation, including vitest checks."
WF13 = "Check a Webflow TypeScript .ts helper and CommonJS .cjs bundle wrapper for docstring and language standards before publish."
OW = ["sk-code-opencode", "sk-code-webflow"]
WO = ["sk-code-webflow", "sk-code-opencode"]
new_cases = "\n".join([
    case("surface-hint-absent-webflow-testing", WF5, OW),
    case("surface-hint-webflow-testing", WF5, WO, "WEBFLOW"),
    case("surface-hint-absent-webflow-language", WF13, OW),
    case("surface-hint-webflow-language", WF13, WO, "WEBFLOW"),
    case("surface-hint-webflow-over-obsidian", "obsidian plugin webflow implementation", ["sk-code-webflow", "sk-code-obsidian"], "WEBFLOW"),
])
new_f = old_f.replace('    {\n      "id": "single-quality",', new_cases + '\n    {\n      "id": "single-quality",')
units.append(edit(T(), f"{RT}/{FIXTURE_REL}", old_f, new_f,
                  f"grep -c -F -- '\"id\": \"surface-hint-' {RT}/{FIXTURE_REL}", "5"))

units.append(command(T(), [f"{F}/scratch/neg-canary.txt"],
                     f"node {F}/scratch/canary-assert.cjs > {F}/scratch/neg-canary.txt 2>&1; echo \"exit=$?\"",
                     f"tail -1 {F}/scratch/neg-canary.txt; grep -c '^FAIL surface-hint-webflow-' {F}/scratch/neg-canary.txt",
                     "cases 18 failures 3"))

old_r1 = """  return scores.filter((entry) => top - entry.score <= ambiguityDelta).map((entry) => entry.mode);
}

function evaluateCanary(snapshot, input) {"""
new_r1 = """  return scores.filter((entry) => top - entry.score <= ambiguityDelta).map((entry) => entry.mode);
}

// The caller may name the surface its session is working in, as a detection
// label such as WEBFLOW or as a workflowMode. Only a declared surface packet
// counts, so UNKNOWN, a workflow mode or an unknown name resolves to null.
function hintedSurface(snapshot, surfaceHint) {
  if (typeof surfaceHint !== 'string' || !surfaceHint.trim()) return null;
  const hint = normalize(surfaceHint);
  const match = snapshot.policy.destinations.find((destination) => (
    destination.id.packetKind === 'surface'
    && (destination.id.workflowMode === hint
      || destination.id.workflowMode === `${destination.id.skillId}-${hint}`)
  ));
  return match ? match.id.workflowMode : null;
}

// Serve-time reorder of a validated route's targets. The compiled composition
// rules fix one order per surface set, so the hint is applied after validation
// and never inside evaluateCanary. The hinted surface takes the first surface
// slot, workflow modes keep their slots and no target is added or dropped, so a
// hint the prompt did not match returns the targets unchanged.
function applySurfaceHint(snapshot, targets, surfaceHint) {
  const lead = hintedSurface(snapshot, surfaceHint);
  const isSurface = (target) => target.destinationId.packetKind === 'surface';
  if (!lead || !targets.some((target) => isSurface(target) && target.destinationId.workflowMode === lead)) {
    return targets;
  }
  const surfaces = targets.filter(isSurface);
  const reordered = [
    ...surfaces.filter((target) => target.destinationId.workflowMode === lead),
    ...surfaces.filter((target) => target.destinationId.workflowMode !== lead),
  ];
  let next = 0;
  return targets.map((target) => {
    if (!isSurface(target)) return target;
    next += 1;
    return reordered[next - 1];
  });
}

function evaluateCanary(snapshot, input) {"""
units.append(edit(T(), f"{AU}/{ROUTER_REL}", old_r1, new_r1,
                  gc("function applySurfaceHint(snapshot, targets, surfaceHint) {", f"{AU}/{ROUTER_REL}"), "1"))

old_r2 = """module.exports = {
  advisorDisposition,"""
new_r2 = """module.exports = {
  advisorDisposition,
  applySurfaceHint,"""
units.append(edit(T(), f"{AU}/{ROUTER_REL}", old_r2, new_r2, gc("  applySurfaceHint,", f"{AU}/{ROUTER_REL}"), "1"))

units.append(command(T(), [f"{RT}/{ROUTER_REL}"], f"cp {AU}/{ROUTER_REL} {RT}/{ROUTER_REL}",
                     cmp_check(f"{AU}/{ROUTER_REL}", f"{RT}/{ROUTER_REL}"), "cmp=0"))

old_h1 = "const { evaluateCanary } = require('../lib/canary-router.cjs');"
new_h1 = "const { applySurfaceHint, evaluateCanary } = require('../lib/canary-router.cjs');"
units.append(edit(T(), f"{AU}/{HARNESS_REL}", old_h1, new_h1, gc(new_h1, f"{AU}/{HARNESS_REL}"), "1"))

old_h2 = """      targetQualifiedIds: evaluated.decision.action === 'route'
        ? evaluated.decision.route.targets.map((target) => ("""
new_h2 = """      targetQualifiedIds: evaluated.decision.action === 'route'
        ? applySurfaceHint(snapshot, evaluated.decision.route.targets, entry.surfaceHint).map((target) => ("""
units.append(edit(T(), f"{AU}/{HARNESS_REL}", old_h2, new_h2,
                  gc("applySurfaceHint(snapshot, evaluated.decision.route.targets, entry.surfaceHint)", f"{AU}/{HARNESS_REL}"), "1"))

units.append(command(T(), [f"{RT}/{HARNESS_REL}"], f"cp {AU}/{HARNESS_REL} {RT}/{HARNESS_REL}",
                     cmp_check(f"{AU}/{HARNESS_REL}", f"{RT}/{HARNESS_REL}"), "cmp=0"))

old_e1 = """  const { snapshot } = loadSnapshot();
  const engine = Object.freeze({ snapshot, evaluate });"""
new_e1 = """  const { snapshot } = loadSnapshot();
  // Only a router that knows its hub's surface packets exports applySurfaceHint,
  // so a hub without one serves the compiled order whatever hint arrives.
  const applySurfaceHint = typeof routerMod.applySurfaceHint === 'function' ? routerMod.applySurfaceHint : null;
  const engine = Object.freeze({ snapshot, evaluate, applySurfaceHint });"""
units.append(edit(T(), f"{AU}/{ENGINE_REL}", old_e1, new_e1,
                  gc("const engine = Object.freeze({ snapshot, evaluate, applySurfaceHint });", f"{AU}/{ENGINE_REL}"), "1"))

old_e2 = """// serializable decision; `action` is one of route/clarify/defer/reject.
function compiledRoute(hubId, taskText) {
  const { snapshot, evaluate } = loadHubEngine(hubId);
  const evaluated = evaluate(snapshot, { prompt: taskText });
  const route = evaluated.decision.route || null;"""
new_e2 = """// serializable decision; `action` is one of route/clarify/defer/reject.
// `options.surfaceHint` names the surface the caller's session works in. It is
// applied after the decision is validated and only reorders surfaces the prompt
// matched, so a call without it serves exactly the compiled order.
function compiledRoute(hubId, taskText, options = {}) {
  const { snapshot, evaluate, applySurfaceHint } = loadHubEngine(hubId);
  const evaluated = evaluate(snapshot, { prompt: taskText });
  let route = evaluated.decision.route || null;
  if (route && applySurfaceHint && typeof options.surfaceHint === 'string') {
    route = { ...route, targets: applySurfaceHint(snapshot, route.targets, options.surfaceHint) };
  }"""
units.append(edit(T(), f"{AU}/{ENGINE_REL}", old_e2, new_e2,
                  gc("function compiledRoute(hubId, taskText, options = {}) {", f"{AU}/{ENGINE_REL}"), "1"))

units.append(command(T(), [f"{RT}/{ENGINE_REL}"], f"cp {AU}/{ENGINE_REL} {RT}/{ENGINE_REL}",
                     cmp_check(f"{AU}/{ENGINE_REL}", f"{RT}/{ENGINE_REL}"), "cmp=0"))

old_s = """// a routing hot path.
function resolveRoute(hubId, taskText) {
  if (!flagPermitsCompiled(hubId)) return null;
  const manifest = readManifest(hubId);
  if (!manifest || manifest.servingAuthority !== 'compiled') return null;
  try {
    const route = compiledRoute(hubId, taskText);"""
new_s = """// a routing hot path. `options.surfaceHint` passes through to the engine, which
// uses it only to reorder surfaces the prompt already matched.
function resolveRoute(hubId, taskText, options = {}) {
  if (!flagPermitsCompiled(hubId)) return null;
  const manifest = readManifest(hubId);
  if (!manifest || manifest.servingAuthority !== 'compiled') return null;
  try {
    const route = compiledRoute(hubId, taskText, options);"""
units.append(edit(T(), f"{AU}/{RESOLVE_REL}", old_s, new_s,
                  gc("function resolveRoute(hubId, taskText, options = {}) {", f"{AU}/{RESOLVE_REL}"), "1"))

units.append(command(T(), [f"{RT}/{RESOLVE_REL}"], f"cp {AU}/{RESOLVE_REL} {RT}/{RESOLVE_REL}",
                     cmp_check(f"{AU}/{RESOLVE_REL}", f"{RT}/{RESOLVE_REL}"), "cmp=0"))

old_d1 = '''  const prompt = promptIdx >= 0 ? args[promptIdx + 1] : '';
  if (!hub) {'''
new_d1 = '''  const prompt = promptIdx >= 0 ? args[promptIdx + 1] : '';
  // The surface the caller's session works in. It only reorders surfaces the
  // prompt already matched, and a value that names no surface is ignored.
  const hintIdx = args.indexOf('--surface-hint');
  const surfaceHint = hintIdx >= 0 ? args[hintIdx + 1] : undefined;
  if (!hub) {'''
units.append(edit(T(), FRONT, old_d1, new_d1, gc("const hintIdx = args.indexOf('--surface-hint');", FRONT), "1"))

old_d2 = "    process.stderr.write('usage: compiled-route.cjs --hub <hubId> (--prompt <text> | --prompt-stdin)\\n');"
new_d2 = "    process.stderr.write('usage: compiled-route.cjs --hub <hubId> (--prompt <text> | --prompt-stdin) [--surface-hint <SURFACE>]\\n');"
units.append(edit(T(), FRONT, old_d2, new_d2, gc("[--surface-hint <SURFACE>]", FRONT), "1"))

old_d3 = "    route = resolveRoute(hub, promptFromStdin ? fs.readFileSync(0, 'utf8') : prompt);"
new_d3 = "    route = resolveRoute(hub, promptFromStdin ? fs.readFileSync(0, 'utf8') : prompt, { surfaceHint });"
units.append(edit(T(), FRONT, old_d3, new_d3, gc("prompt, { surfaceHint });", FRONT), "1"))

units.append(command(T(), [f"{AU}/{FIXTURE_REL}"], f"cp {RT}/{FIXTURE_REL} {AU}/{FIXTURE_REL}",
                     cmp_check(f"{RT}/{FIXTURE_REL}", f"{AU}/{FIXTURE_REL}"), "cmp=0"))

units.append(edit(T(), HUB + "SKILL.md", "version: 2.2.6.0", "version: 2.2.7.0", gc("version: 2.2.7.0", HUB + "SKILL.md"), "1"))

old_k = '''the explicit kill-switch.

### Surface Router'''
new_k = '''the explicit kill-switch.

**Session surface hint.** Before you call the front door, run the surface detection in [`stack-detection.md`](shared/references/stack-detection.md) on the session's working directory and the files it is editing, then add its result as `--surface-hint <SURFACE>`, for example `--surface-hint WEBFLOW`. When the prompt's keywords tie between surfaces, the hinted surface leads them. Workflow modes keep first place, and the targets and the bundle kind stay the same. With `UNKNOWN`, no hint or a surface the prompt did not match, the `routerPolicy.tieBreak` order applies.

### Surface Router'''
units.append(edit(T(), HUB + "SKILL.md", old_k, new_k, gc("**Session surface hint.**", HUB + "SKILL.md"), "1"))

units.append(edit(T(), HUB + "ROUTER.md", "version: 2.2.6.0", "version: 2.2.7.0", gc("version: 2.2.7.0", HUB + "ROUTER.md"), "1"))

old_c = '''loaded after the surface decision, not a surface.

### Bundled Evidence Surfaces'''
new_c = '''loaded after the surface decision, not a surface. The detected surface also goes to the compiled front door as `--surface-hint`, so when a prompt ties between surfaces the session's surface leads the bundle (`SKILL.md` §2).

### Bundled Evidence Surfaces'''
units.append(edit(T(), HUB + "ROUTER.md", old_c, new_c, gc("goes to the compiled front door as `--surface-hint`", HUB + "ROUTER.md"), "1"))

units.append(edit(T(), HUB + "README.md", "version: 2.2.6.0", "version: 2.2.7.0", gc("version: 2.2.7.0", HUB + "README.md"), "1"))
for name in ("description.json", "hub-router.json", "mode-registry.json"):
    units.append(edit(T(), HUB + name, '  "version": "2.2.6.0",', '  "version": "2.2.7.0",', gc('"version": "2.2.7.0",', HUB + name), "1"))

units.append({"task": T(), "files": [CHANGELOG], "kind": "create",
              "instruction": f"Create {CHANGELOG} with exactly the content of {F}/scratch/units/v2.2.7.0.md",
              "check": cmp_check(CHANGELOG, f"{F}/scratch/units/v2.2.7.0.md"), "expect": "cmp=0"})

with open(f"{F}/scratch/dispatch-units.json", "w") as fh:
    json.dump(units, fh, indent=2, ensure_ascii=False)
    fh.write("\n")
print(len(units), "units")
