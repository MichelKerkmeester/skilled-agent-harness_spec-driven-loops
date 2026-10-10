#!/usr/bin/env python3
"""Planner tool: defines every Phase 2 change once, writes dispatch-units.json and the
Phase 2 task lines, and can apply the edits to a mirror tree for a dry run.

Usage (from the repository root):
  python3 -I <folder>/scratch/build_units.py write            # dispatch-units.json + phase2-tasks.md
  python3 -I <folder>/scratch/build_units.py verify           # every OLD occurs exactly once
  python3 -I <folder>/scratch/build_units.py apply <mirror>   # apply edits under <mirror>/
"""
import json
import os
import shutil
import sys

FOLDER = "specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/005-opencode-and-guards"
UNITS_DIR = FOLDER + "/scratch/units"
OC = ".skilled/skills/sk-code/sk-code-opencode"
GUARD = OC + "/assets/scripts/verify_router_sync.cjs"
GUARD_TEST = OC + "/scripts/tests/verify_router_sync.test.cjs"
UMBRELLA = OC + "/scripts/run-all-drift-guards.sh"
SKILL = OC + "/SKILL.md"
README = OC + "/README.md"
SREADME = OC + "/scripts/README.md"
AREADME = OC + "/assets/scripts/README.md"
AVA = OC + "/references/shared/alignment-verification-automation.md"
NAC = OC + "/references/shared/universal-patterns/naming-and-commenting.md"
JSG = OC + "/references/javascript/style-guide.md"
PB = OC + "/manual-testing-playbook"
CANARY = ".skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json"
CANARY_COPY = "specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json"
DOCTOR = ".skilled/commands/doctor/scripts/parent-skill-check.cjs"
DOCTOR_TEST = ".skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs"

U = []


def edit(desc, file, old, new, check, expect):
    U.append({"kind": "edit", "desc": desc, "file": file, "old": old, "new": new, "check": check, "expect": expect})


def create(desc, file, src, check, expect):
    U.append({"kind": "create", "desc": desc, "file": file, "src": UNITS_DIR + "/" + src, "check": check, "expect": expect})


def command(desc, files, cmd, check, expect):
    U.append({"kind": "command", "desc": desc, "files": files, "cmd": cmd, "check": check, "expect": expect})


def grepc(text, file):
    q = text.replace("'", "'\\''")
    return "grep -c -F -- '%s' %s" % (q, file)


# ── Router-sync guard: read the ROUTER.md shared-controls block ──────────────
edit("Drop the three dead entries from the orphan allowlist and keep the three shared workflow docs and their comment.", GUARD,
     """const NON_ROUTED_ALLOWLIST = new Set([
  'ROUTER.md',
  'references/stack-detection.md',
  'references/phase-detection.md',
  'shared/references/workflow-implement.md',""",
     """const NON_ROUTED_ALLOWLIST = new Set([
  'shared/references/workflow-implement.md',""",
     grepc("'references/stack-detection.md',", GUARD), "0")

edit("Replace the guard's own parent-tier list with the pattern that reads the ROUTER.md block.", GUARD,
     """const PARENT_TIER_ALLOWLIST = new Set([
  'shared/references/universal/multi-agent-research.md',
  'shared/references/universal/code-quality-standards.md',
  'shared/references/universal/code-style-guide.md',
  'shared/references/universal/error-recovery.md',
  'shared/references/universal-debugging-checklist.md',
  'shared/references/universal-verification-checklist.md',
  'shared/references/performance-loading-checklist.md',
  'shared/assets/patterns/README.md',
  'sk-code-review/assets/code-quality-checklist.md',
]);""",
     """// The hub-level shared controls are declared once in ROUTER.md: its SHARED_CONTROL_RESOURCES
// list plus its DEFAULT_RESOURCE preamble, and leg 2 reads both. A parent-map path under a
// workflow mode packet is that packet's own leaf in leaf-manifest.json, not a shared control.
const SHARED_CONTROL_BLOCK = /SHARED_CONTROL_RESOURCES\\s*=\\s*\\[([\\s\\S]*?)\\]/;
const DEFAULT_RESOURCE_BLOCK = /DEFAULT_RESOURCES?\\s*=\\s*\\[([\\s\\S]*?)\\]/;""",
     grepc("PARENT_TIER_ALLOWLIST", GUARD), "0")

edit("Add the three helpers that read the shared-controls block and the manifest leaves.", GUARD,
     """const readSkillRouter = (dir) => lib.parseRouter(fs.readFileSync(path.join(dir, 'SKILL.md'), 'utf8'), dir);
""",
     """const readSkillRouter = (dir) => lib.parseRouter(fs.readFileSync(path.join(dir, 'SKILL.md'), 'utf8'), dir);

// Same list grammar the root-router contract uses for these blocks, read here so the guard keeps
// no copy of the list.
function sharedControlResources() {
  const text = fs.readFileSync(path.join(SKCODE, 'ROUTER.md'), 'utf8');
  const out = new Set();
  for (const block of [SHARED_CONTROL_BLOCK, DEFAULT_RESOURCE_BLOCK]) {
    const m = block.exec(text);
    if (m) for (const x of m[1].matchAll(/["']([^"']+)["']/g)) out.add(x[1]);
  }
  return out;
}

function manifestLeavesByPacket() {
  const file = path.join(SKCODE, 'leaf-manifest.json');
  const byPacket = new Map();
  if (!fs.existsSync(file)) return byPacket;
  for (const mode of JSON.parse(fs.readFileSync(file, 'utf8')).modes || []) {
    if (mode && typeof mode.packet === 'string') byPacket.set(mode.packet, new Set(mode.leaves || []));
  }
  return byPacket;
}

function ownedLeaf(packetLeaves, owner, p) {
  if (!owner || !packetLeaves.has(owner[1])) return false;
  return packetLeaves.get(owner[1]).has(p.slice(owner[1].length + 1));
}
""",
     grepc("function sharedControlResources()", GUARD), "1")

edit("Load the declared controls and the manifest leaves at the start of leg 2, and fail when the block is empty.", GUARD,
     """function legSurfaceMap() {
  const problems = [];
""",
     """function legSurfaceMap() {
  const problems = [];
  const sharedControls = sharedControlResources();
  if (sharedControls.size === 0) {
    problems.push('ROUTER.md declares no SHARED_CONTROL_RESOURCES, so the parent-tier check would be vacuous');
  }
  const packetLeaves = manifestLeavesByPacket();
""",
     grepc("const sharedControls = sharedControlResources();", GUARD), "1")

edit("Judge a non-surface parent-map path against the declared controls and the packet's own leaves.", GUARD,
     """      } else if (!PARENT_TIER_ALLOWLIST.has(p)) {""",
     """      } else if (!sharedControls.has(p) && !ownedLeaf(packetLeaves, owner, p)) {""",
     grepc("!ownedLeaf(packetLeaves, owner, p)", GUARD), "1")

edit("Add two leg 2 tests to the router-sync guard test.", GUARD_TEST,
     """test('a run without --checks includes leg 1b', (t) => {
  const { guard } = buildHub(t);
  const { out } = runGuard(guard, []);
  assert.match(out, /check 1b:/);
});
""",
     """test('a run without --checks includes leg 1b', (t) => {
  const { guard } = buildHub(t);
  const { out } = runGuard(guard, []);
  assert.match(out, /check 1b:/);
});

// Leg 2 reads the hub-level shared controls from the ROUTER.md list and preamble, so this hub gets
// a parent map, the two surface children and a manifest that names one workflow mode leaf.
function buildLegTwoHub(t, controls, defaults = []) {
  const { hub, guard } = buildHub(t);
  const parentMap = [
    '"DEMO": ["sk-code-webflow/references/w.md", "sk-code-opencode/references/o.md",',
    '"shared/references/control.md", "shared/references/undeclared.md", "sk-code-review/assets/leaf.md"],',
  ].join(' ');
  const block = controls.map((c) => `    "${c}",`).join('\\n');
  const preamble = defaults.map((c) => `    "${c}",`).join('\\n');
  const router = `DEFAULT_RESOURCE = [\\n${preamble}\\n]\\nRESOURCE_MAP = {\\n  ${parentMap}\\n}\\n`;
  write(path.join(hub, 'ROUTER.md'), `${router}SHARED_CONTROL_RESOURCES = [\\n${block}\\n]\\n`);
  for (const [surface, doc] of [['sk-code-webflow', 'w.md'], ['sk-code-opencode', 'o.md']]) {
    write(path.join(hub, surface, 'SKILL.md'), `RESOURCE_MAP = {\\n  "DEMO": ["references/${doc}"],\\n}\\n`);
    write(path.join(hub, surface, 'references', doc), `# ${doc}\\n`);
  }
  const manifest = { modes: [{ workflowMode: 'sk-code-review', packet: 'sk-code-review', leaves: ['assets/leaf.md'] }] };
  write(path.join(hub, 'leaf-manifest.json'), JSON.stringify(manifest));
  return guard;
}

test('leg 2 accepts paths the ROUTER.md list or preamble declares and a workflow mode leaf', (t) => {
  const guard = buildLegTwoHub(t, ['shared/references/control.md'], ['shared/references/undeclared.md']);
  const { status, out } = runGuard(guard, ['--checks', '2']);
  assert.equal(status, 0, out);
  assert.match(out, /PASS check 2/);
});

test('leg 2 reports a shared parent-map path ROUTER.md does not declare', (t) => {
  const guard = buildLegTwoHub(t, ['shared/references/control.md']);
  const { status, out } = runGuard(guard, ['--checks', '2']);
  assert.equal(status, 1, out);
  assert.match(out, /parent map DEMO cites shared\\/references\\/undeclared\\.md, outside the parent tier/);
  assert.doesNotMatch(out, /control\\.md/);
  assert.doesNotMatch(out, /sk-code-review\\/assets\\/leaf\\.md/);
});
""",
     grepc("function buildLegTwoHub(t, controls)", GUARD_TEST), "1")

# ── Documentation claim checker and its test ────────────────────────────────
create("Create the documentation claim checker.", OC + "/assets/scripts/verify_doc_claims.cjs", "verify_doc_claims.cjs",
       "node --check " + OC + "/assets/scripts/verify_doc_claims.cjs; echo \"exit=$?\"", "exit=0")
create("Create the checker's test with its known-bad inputs.", OC + "/scripts/tests/verify_doc_claims.test.cjs", "verify_doc_claims.test.cjs",
       "node --test " + OC + "/scripts/tests/verify_doc_claims.test.cjs 2>&1 | grep -E '^. (pass|fail) '", "pass 6")

# ── Umbrella: a fourth guard ────────────────────────────────────────────────
edit("Count four guards in the umbrella header.", UMBRELLA,
     """# sk-code has three drift guards: alignment-drift (language integrity and the
# dead-route check), stack-folder (language reference folders resolve) and
# router-sync (the sk-code router's paths, surface map, compiled agreement and
# playbook routing). Each was runnable only on its own.""",
     """# sk-code has four drift guards: alignment-drift (language integrity and the
# dead-route check), stack-folder (language reference folders resolve),
# router-sync (the sk-code router's paths, surface map, compiled agreement and
# playbook routing) and doc-claims (paths, packet names, surface counts and load
# tiers in the sk-code prose). Each was runnable only on its own.""",
     grepc("# sk-code has four drift guards", UMBRELLA), "1")
edit("Name the checker path in the umbrella.", UMBRELLA,
     """ROUTER_SYNC="${CODE_OPENCODE_DIR}/assets/scripts/verify_router_sync.cjs"
""",
     """ROUTER_SYNC="${CODE_OPENCODE_DIR}/assets/scripts/verify_router_sync.cjs"
DOC_CLAIMS="${CODE_OPENCODE_DIR}/assets/scripts/verify_doc_claims.cjs"
""",
     grepc('DOC_CLAIMS="${CODE_OPENCODE_DIR}/assets/scripts/verify_doc_claims.cjs"', UMBRELLA), "1")
edit("Run the checker as the fourth guard.", UMBRELLA,
     """# and 4 in warn-only mode.

if [ "${failures}" -ne 0 ]; then""",
     """# and 4 in warn-only mode.

run_guard "doc-claims       (verify_doc_claims.cjs)" \\
  node "${DOC_CLAIMS}"

if [ "${failures}" -ne 0 ]; then""",
     grepc('run_guard "doc-claims       (verify_doc_claims.cjs)"', UMBRELLA), "1")
edit("Report four guards on success.", UMBRELLA,
     """echo "run-all-drift-guards: all 3 guards PASSED\"""",
     """echo "run-all-drift-guards: all 4 guards PASSED\"""",
     grepc("all 4 guards PASSED", UMBRELLA), "1")

# ── Canary: OBSIDIAN over WEBFLOW collision case ────────────────────────────
edit("Add the OBSIDIAN-versus-WEBFLOW collision case after the surface-bundle-obsidian case.", CANARY,
     """      "expectedModes": ["sk-code-review", "sk-code-obsidian"],
      "gold": {
        "expectedIntents": ["sk-code-review", "sk-code-obsidian"],
        "expectedResources": []
      }
    },
""",
     """      "expectedModes": ["sk-code-review", "sk-code-obsidian"],
      "gold": {
        "expectedIntents": ["sk-code-review", "sk-code-obsidian"],
        "expectedResources": []
      }
    },
    {
      "id": "surface-collision-obsidian-over-webflow",
      "prompt": "code review my obsidian plugin that embeds a webflow site",
      "riskSlice": "actor:mutating:composite",
      "certificateFixture": "valid-composite",
      "expectedAction": "route",
      "expectedSelectionKind": "surfaceBundle",
      "expectedModes": ["sk-code-review", "sk-code-obsidian"],
      "gold": {
        "expectedIntents": ["sk-code-review", "sk-code-obsidian"],
        "expectedResources": []
      }
    },
""",
     "node -e 'console.log(JSON.parse(require(\"fs\").readFileSync(\"" + CANARY + "\",\"utf8\")).cases.length)'", "12")
command("Copy the canary fixture over its authored copy.", [CANARY_COPY],
        "cp " + CANARY + " " + CANARY_COPY,
        "cmp " + CANARY + " " + CANARY_COPY + "; echo \"cmp=$?\"", "cmp=0")

# ── Doctor: README and packet changelog parity ──────────────────────────────
edit("Rename the doctor's version section to cover 13a to 13d.", DOCTOR,
     "// 13. VERSION PARITY CHECKS (13a-13b)",
     "// 13. VERSION PARITY CHECKS (13a-13d)",
     grepc("// 13. VERSION PARITY CHECKS (13a-13d)", DOCTOR), "1")
edit("Add the README and packet changelog parity checks before 13a.", DOCTOR,
     """// 13a: SKILL.md is the release authority; every routing artifact that declares""",
     """// These hub front pages already lag their release, so their README drift warns until it is
// repaired. README drift on any other hub fails.
const README_VERSION_WARN_ONLY = new Set(['cli-classifier', 'cli-external-orchestration', 'sk-doc', 'system-deep-loop']);

// 13c: a hub README that declares a version is the front page of that release, so it carries
// the SKILL.md version.
function checkReadmeVersion(ctx, authority) {
  const readme = markdownVersion(ctx.target, 'README.md');
  if (!readme.present) {
    info('13c-readme-version: README.md declares no version, nothing to compare');
    return;
  }
  if (readme.value === authority) {
    pass(`13c-readme-version: README.md carries the SKILL.md version ${authority}`);
    return;
  }
  const report = README_VERSION_WARN_ONLY.has(ctx.basename) ? warn : softFail;
  report(`13c-readme-version: README.md carries ${readme.value} but SKILL.md, the release authority, carries ${authority}`);
}

// 13d: each mode packet's SKILL.md version names its newest changelog entry, and that entry's
// own version line agrees with its file name.
function checkPacketChangelogVersions(ctx) {
  const modes = ctx.registry && Array.isArray(ctx.registry.modes) ? ctx.registry.modes : [];
  const packets = [...new Set(modes
    .map((m) => (isPlainObject(m) && typeof m.packet === 'string' ? m.packet : null))
    .filter(Boolean))].sort();
  let checked = 0;
  let parity = true;
  for (const packet of packets) {
    const skill = markdownVersion(path.join(ctx.target, packet), 'SKILL.md');
    const logDir = path.join(ctx.target, packet, 'changelog');
    if (!skill.present || !FOUR_PART_VERSION.test(skill.value) || !isDirectory(logDir)) continue;
    const entries = fs.readdirSync(logDir)
      .map((name) => (name.match(/^v([0-9]+(?:\\.[0-9]+){3})\\.md$/) || [])[1])
      .filter(Boolean)
      .sort(compareVersions);
    const newest = entries[entries.length - 1];
    if (!newest) continue;
    checked += 1;
    if (newest !== skill.value) {
      softFail(`13d-packet-version: ${packet}/SKILL.md claims ${skill.value} but its newest changelog entry is v${newest}`);
      parity = false;
    }
    const entry = markdownVersion(logDir, `v${newest}.md`);
    if (entry.present && entry.value !== newest) {
      softFail(`13d-packet-version: ${packet}/changelog/v${newest}.md declares version ${entry.value}, not ${newest}`);
      parity = false;
    }
  }
  if (checked === 0) {
    info('13d-packet-version: no mode packet pairs a four-part SKILL.md version with a versioned changelog entry');
  } else if (parity) {
    pass(`13d-packet-version: ${checked} mode packet(s) match their newest changelog entry`);
  }
}

// 13a: SKILL.md is the release authority; every routing artifact that declares""",
     grepc("function checkPacketChangelogVersions(ctx) {", DOCTOR), "1")
edit("Run 13c after 13b.", DOCTOR,
     """  if (parity) pass(`13a-version: all routing artifacts carry the SKILL.md version ${authority}`);
  checkChangelogVersion(ctx, authority);
""",
     """  if (parity) pass(`13a-version: all routing artifacts carry the SKILL.md version ${authority}`);
  checkChangelogVersion(ctx, authority);
  checkReadmeVersion(ctx, authority);
""",
     grepc("  checkReadmeVersion(ctx, authority);", DOCTOR), "1")
edit("Run 13d after the hub version checks.", DOCTOR,
     """  checkVersionParity(ctx);

  console.log('');""",
     """  checkVersionParity(ctx);
  checkPacketChangelogVersions(ctx);

  console.log('');""",
     grepc("  checkPacketChangelogVersions(ctx);", DOCTOR), "1")
edit("Pin 13c and 13d with one failing case each.", DOCTOR_TEST,
     """  ['13b-version', 'newer changelog entry than SKILL.md', (h) => fs.writeFileSync(path.join(h, 'changelog', 'v1.0.0.1.md'), '# x\\n'), 'v1.0.0.1'],
""",
     """  ['13b-version', 'newer changelog entry than SKILL.md', (h) => fs.writeFileSync(path.join(h, 'changelog', 'v1.0.0.1.md'), '# x\\n'), 'v1.0.0.1'],
  ['13c-readme-version', 'README.md version differs from SKILL.md', (h) => fs.writeFileSync(path.join(h, 'README.md'),
    '---\\ntitle: demo\\nversion: 1.0.0.9\\n---\\n# demo\\n'), 'README.md'],
  ['13d-packet-version', 'packet SKILL.md ahead of its newest changelog entry', (h) => {
    fs.writeFileSync(path.join(h, 'pkg-alpha', 'SKILL.md'), '---\\nname: pkg-alpha\\nversion: 1.0.0.1\\n---\\n# pkg-alpha\\n');
    fs.writeFileSync(path.join(h, 'pkg-alpha', 'changelog', 'v1.0.0.0.md'), '# x\\n');
  }, 'pkg-alpha'],
""",
     grepc("'13d-packet-version', 'packet SKILL.md ahead", DOCTOR_TEST), "1")
edit("Pin the warn-only README hubs.", DOCTOR_TEST,
     """test('5k warns, and does not fail, on alias drift that another hub already carries', () => {""",
     """test('13c warns, and does not fail, on a hub whose README already lags its release', () => {
  const hub = buildHub('sk-doc');
  fs.writeFileSync(path.join(hub, 'README.md'), '---\\ntitle: demo\\nversion: 1.0.0.9\\n---\\n# demo\\n');
  const { output } = runChecker(hub);
  assertLine(output, 'WARN', '13c-readme-version', 'README.md');
  assert.doesNotMatch(output, /^FAIL: 13c-readme-version:/m);
});

test('5k warns, and does not fail, on alias drift that another hub already carries', () => {""",
     grepc("test('13c warns, and does not fail", DOCTOR_TEST), "1")

# ── OpenCode SKILL.md ───────────────────────────────────────────────────────
edit("Bump the OpenCode packet version.", SKILL, "version: 1.1.1.0", "version: 1.2.0.0", grepc("version: 1.2.0.0", SKILL), "1")
edit("Rename the two hand-off targets.", SKILL,
     "hand off formal findings-first review to `code-review` and author-side quality gates to `code-quality`.",
     "hand off formal findings-first review to `sk-code-review` and author-side quality gates to `sk-code-quality`.",
     grepc("to `sk-code-review` and author-side quality gates to `sk-code-quality`.", SKILL), "1")
edit("Rename the packet in the routing-block intro.", SKILL,
     "This block is the deterministic projection of code-opencode's own",
     "This block is the deterministic projection of sk-code-opencode's own",
     grepc("projection of sk-code-opencode's own", SKILL), "1")
edit("Rename the packet in the routing-block comment.", SKILL,
     "# code-opencode owns its intent -> reference/asset routing.",
     "# sk-code-opencode owns its intent -> reference/asset routing.",
     grepc("# sk-code-opencode owns its intent", SKILL), "1")
edit("Rename the sibling map in the routing-block comment.", SKILL,
     "the sibling code-webflow map plus the",
     "the sibling sk-code-webflow map plus the",
     grepc("the sibling sk-code-webflow map", SKILL), "1")
edit("Count four guards in the verification-gate bullet.", SKILL,
     "System-code changes re-run the three live sk-code drift guards",
     "System-code changes re-run the four live sk-code drift guards",
     grepc("re-run the four live sk-code drift guards", SKILL), "1")
edit("Describe the documentation claim guard in the verification-gate bullet.", SKILL,
     "covers the compiled side of (3) and (4) in CI only, with the admission step warn-only. See `references/shared/alignment-verification-automation.md`.",
     "covers the compiled side of (3) and (4) in CI only, with the admission step warn-only. The documentation claim guard (`assets/scripts/verify_doc_claims.cjs`) reads the sk-code prose the other guards skip, from the hub folder on disk: path references resolve, no retired packet name remains, every surface count matches the three-surface hub and every file the `ROUTER.md` load-tier prose says loads on every route is in `DEFAULT_RESOURCE`. Lines that keep a legacy name on purpose sit in its allowlist with a reason. See `references/shared/alignment-verification-automation.md`.",
     grepc("The documentation claim guard (`assets/scripts/verify_doc_claims.cjs`)", SKILL), "1")
edit("List the checker among the verifier assets and count four.", SKILL,
     "the router-sync guard (`verify_router_sync.cjs`) and its replay library (`router_replay_lib.cjs`), used by this surface. `scripts/run-all-drift-guards.sh` is the single entry point that runs all three as one gate (non-zero if any fails).",
     "the router-sync guard (`verify_router_sync.cjs`) with its replay library (`router_replay_lib.cjs`) and the documentation claim guard (`verify_doc_claims.cjs`), used by this surface. `scripts/run-all-drift-guards.sh` is the single entry point that runs all four as one gate (non-zero if any fails).",
     grepc("runs all four as one gate", SKILL), "1")
edit("Give the spec-folder recipe its full system-spec-kit path.", SKILL,
     "(`references/workflows/spec-folder-write-recipe.md` + `spec-folder-authoring-checklist.md`)",
     "(`.skilled/skills/system-spec-kit/references/workflows/spec-folder-write-recipe.md` + `spec-folder-authoring-checklist.md`)",
     grepc("`.skilled/skills/system-spec-kit/references/workflows/spec-folder-write-recipe.md`", SKILL), "1")

# ── OpenCode README.md ──────────────────────────────────────────────────────
edit("Rename the sibling in the overview.", README, "Its sibling `code-webflow` carries", "Its sibling `sk-code-webflow` carries",
     grepc("Its sibling `sk-code-webflow` carries", README), "1")
edit("Say what a clean drift-gate exit means with four guards.", README,
     "A clean exit means the alignment verifier and the stack-folder verifier both pass.",
     "A clean exit means all four guards pass: the alignment verifier, the stack-folder verifier, the router-sync guard and the documentation claim guard.",
     grepc("A clean exit means all four guards pass", README), "1")
edit("Rename the sibling surface row.", README, "| `code-webflow` | Sibling surface.", "| `sk-code-webflow` | Sibling surface.",
     grepc("| `sk-code-webflow` | Sibling surface.", README), "1")
edit("Rename the review hand-off row.", README, "| `code-review` | Receives", "| `sk-code-review` | Receives",
     grepc("| `sk-code-review` | Receives", README), "1")
edit("Rename the quality hand-off row.", README, "| `code-quality` | Receives", "| `sk-code-quality` | Receives",
     grepc("| `sk-code-quality` | Receives", README), "1")
edit("Rename the sibling in the troubleshooting row.", README, "| Both this surface and `code-webflow` are loaded |",
     "| Both this surface and `sk-code-webflow` are loaded |",
     grepc("| Both this surface and `sk-code-webflow` are loaded |", README), "1")

# ── scripts/README.md ───────────────────────────────────────────────────────
edit("Rename the packet and count four guards in the overview.", SREADME,
     "`scripts/` holds the one drift-guard entrypoint for the `code-opencode` mode. It runs three drift guards (alignment-drift, stack-folder, router-sync) in sequence",
     "`scripts/` holds the one drift-guard entrypoint for the `sk-code-opencode` surface. It runs four drift guards (alignment-drift, stack-folder, router-sync, doc-claims) in sequence",
     grepc("It runs four drift guards (alignment-drift, stack-folder, router-sync, doc-claims)", SREADME), "1")
edit("Rename the packet in check 3 of the overview.", SREADME,
     "`leaf-manifest.json` and the code-opencode RESOURCE_MAP agree",
     "`leaf-manifest.json` and the sk-code-opencode RESOURCE_MAP agree",
     grepc("and the sk-code-opencode RESOURCE_MAP agree", SREADME), "1")
edit("Describe the doc-claims guard at the end of the overview.", SREADME,
     "covers the compiled side of (3) and (4), in CI only, in warn-only mode.",
     "covers the compiled side of (3) and (4), in CI only, in warn-only mode. The doc-claims guard (`assets/scripts/verify_doc_claims.cjs`) checks the sk-code prose: path references resolve, no retired packet name remains, every surface count matches the three-surface hub and the `ROUTER.md` load-tier claims match `DEFAULT_RESOURCE`.",
     grepc("The doc-claims guard (`assets/scripts/verify_doc_claims.cjs`)", SREADME), "1")
edit("List the fourth guard in the wrapper row.", SREADME,
     "Runs `verify_alignment_drift.py --check-router`, `verify_stack_folders.py` and `verify_router_sync.cjs --checks 1a,1b,2,3,4` in order,",
     "Runs `verify_alignment_drift.py --check-router`, `verify_stack_folders.py`, `verify_router_sync.cjs --checks 1a,1b,2,3,4` and `verify_doc_claims.cjs` in order,",
     grepc("and `verify_doc_claims.cjs` in order,", SREADME), "1")
edit("Say the router-sync test now covers leg 2.", SREADME,
     "reports an unrouted doc and runs without `--checks`.",
     "reports an unrouted doc, runs without `--checks` and proves check 2 reads the `ROUTER.md` shared-controls block.",
     grepc("proves check 2 reads the `ROUTER.md` shared-controls block.", SREADME), "1")
edit("Add the doc-claims test row.", SREADME,
     "Run it with `node --test .skilled/skills/sk-code/sk-code-opencode/scripts/tests/verify_router_sync.test.cjs`. |",
     "Run it with `node --test .skilled/skills/sk-code/sk-code-opencode/scripts/tests/verify_router_sync.test.cjs`. |\n| `tests/verify_doc_claims.test.cjs` | Builds a throwaway hub and proves each check of `verify_doc_claims.cjs` passes on a clean tree and fails on its own known-bad input, and that an allowlisted line stays quiet. Run it with `node --test .skilled/skills/sk-code/sk-code-opencode/scripts/tests/verify_doc_claims.test.cjs`. |",
     grepc("| `tests/verify_doc_claims.test.cjs` |", SREADME), "1")
edit("Expect four guards in the validation section.", SREADME,
     "Expected: a `PASS: router-sync` line, `run-all-drift-guards: all 3 guards PASSED` and exit code 0.",
     "Expected: a `PASS: router-sync` line, a `PASS: doc-claims` line, `run-all-drift-guards: all 4 guards PASSED` and exit code 0.",
     grepc("`run-all-drift-guards: all 4 guards PASSED`", SREADME), "1")
edit("Rename the SKILL.md link label.", SREADME, "- [`code-opencode SKILL.md`](../SKILL.md)", "- [`sk-code-opencode SKILL.md`](../SKILL.md)",
     grepc("- [`sk-code-opencode SKILL.md`](../SKILL.md)", SREADME), "1")
edit("Rename the README.md link label.", SREADME, "- [`code-opencode README.md`](../README.md)", "- [`sk-code-opencode README.md`](../README.md)",
     grepc("- [`sk-code-opencode README.md`](../README.md)", SREADME), "1")

# ── assets/scripts/README.md ────────────────────────────────────────────────
edit("Count seven code files.", AREADME, "| Code files | 6 |", "| Code files | 7 |", grepc("| Code files | 7 |", AREADME), "1")
edit("Add the checker row before the router-sync row.", AREADME,
     "| `verify_router_sync.cjs` |",
     "| `verify_doc_claims.cjs` | Documentation claim guard: path references in the sk-code docs resolve, no retired packet name remains, every surface count matches the three-surface hub and the `ROUTER.md` load-tier claims match `DEFAULT_RESOURCE`, with an allowlist for deliberate legacy names. Usage: `node verify_doc_claims.cjs [--root <hub dir>] [--checks paths,names,surfaces,tiers]`. |\n| `verify_router_sync.cjs` |",
     grepc("| `verify_doc_claims.cjs` |", AREADME), "1")
edit("Rename the packet in the stack-folder row.", AREADME, "Verifies code-opencode language reference folders", "Verifies sk-code-opencode language reference folders",
     grepc("Verifies sk-code-opencode language reference folders", AREADME), "1")

# ── alignment-verification-automation.md ────────────────────────────────────
edit("Rename the packet in check 3.", AVA, "`leaf-manifest.json` and the code-opencode", "`leaf-manifest.json` and the sk-code-opencode",
     grepc("`leaf-manifest.json` and the sk-code-opencode", AVA), "1")
edit("Rename the packet in the section 6 heading.", AVA, "## 6. ALIGNMENT AUTHORITY INTERFACE (code-opencode)", "## 6. ALIGNMENT AUTHORITY INTERFACE (sk-code-opencode)",
     grepc("## 6. ALIGNMENT AUTHORITY INTERFACE (sk-code-opencode)", AVA), "1")
edit("Rename the packet in the section 6 opening.", AVA, "code-opencode has exactly one alignment source of truth", "sk-code-opencode has exactly one alignment source of truth",
     grepc("sk-code-opencode has exactly one alignment source of truth", AVA), "1")
edit("Rename the packet in the doc pointer item.", AVA, "This file plus the code-opencode `SKILL.md`", "This file plus the sk-code-opencode `SKILL.md`",
     grepc("This file plus the sk-code-opencode `SKILL.md`", AVA), "1")
edit("Count four guards in the orchestrator item.", AVA, "runs all three drift guards and exits non-zero if any fails.", "runs all four drift guards and exits non-zero if any fails.",
     grepc("runs all four drift guards", AVA), "1")
edit("Rename the packet in the extension rule.", AVA, "Any new check that needs code-opencode RESOURCE_MAP", "Any new check that needs sk-code-opencode RESOURCE_MAP",
     grepc("needs sk-code-opencode RESOURCE_MAP", AVA), "1")

# ── Other references ────────────────────────────────────────────────────────
edit("Rename the packet in the Rust layout note.", OC + "/references/shared/code-organization/directory-and-test-conventions.md",
     "Rust code under `code-opencode` follows", "Rust code under `sk-code-opencode` follows",
     grepc("Rust code under `sk-code-opencode` follows", OC + "/references/shared/code-organization/directory-and-test-conventions.md"), "1")
edit("Label the comment budget as the OpenCode setting and point to the shared rule.", NAC,
     "1. **Quantity limit:** Maximum 3 comments per 10 lines of code",
     "1. **Quantity limit (OpenCode surface setting):** Maximum 3 comments per 10 lines of code. This number is the OpenCode surface's budget. The comment-density rule it applies, and the rule that each surface sets its own budget, live in the shared [code style guide](../../../../shared/references/universal/code-style-guide.md).",
     grepc("Quantity limit (OpenCode surface setting)", NAC), "1")
edit("Make the stale link label match its target.", NAC,
     "See [`../../universal/code-style-guide.md`](../../../../shared/references/universal/code-style-guide.md)",
     "See [`../../../../shared/references/universal/code-style-guide.md`](../../../../shared/references/universal/code-style-guide.md)",
     grepc("[`../../universal/code-style-guide.md`]", NAC), "0")
edit("Replace the packet-number carry-over line with its durable rule.", NAC,
     "Carry-over from 139: keep rule constants centralized and test imports referencing those constants (avoid duplicate local literals).",
     "Keep rule constants centralized and make tests import those constants rather than repeat local literals.",
     grepc("Carry-over from", NAC), "0")
for f, rel in [
    (JSG, "../shared/universal-patterns/naming-and-commenting.md"),
    (OC + "/references/python/style-guide.md", "../shared/universal-patterns/naming-and-commenting.md"),
    (OC + "/references/shell/style-guide/overview-structure-and-naming.md", "../../shared/universal-patterns/naming-and-commenting.md"),
]:
    edit("Label the comment budget as the OpenCode setting.", f,
         "1. **Quantity limit:** Maximum 3 comments per 10 lines of code",
         "1. **Quantity limit (OpenCode surface setting):** Maximum 3 comments per 10 lines of code, this surface's budget for the shared comment-density rule (see [naming and commenting](%s))" % rel,
         grepc("Quantity limit (OpenCode surface setting)", f), "1")
TSG = OC + "/references/typescript/style-guide/formatting-imports-and-coexistence.md"
edit("Label the comment budget as the OpenCode setting.", TSG,
     "1. **Quantity limit**: Maximum 3 comments per 10 lines of code",
     "1. **Quantity limit (OpenCode surface setting)**: Maximum 3 comments per 10 lines of code, this surface's budget for the shared comment-density rule (see [naming and commenting](../../shared/universal-patterns/naming-and-commenting.md))",
     grepc("Quantity limit (OpenCode surface setting)", TSG), "1")
CSG = OC + "/references/config/style-guide.md"
edit("Label the comment budget as the OpenCode setting.", CSG,
     "1. **Quantity limit:** Maximum 3 comments per 10 lines in JSONC blocks",
     "1. **Quantity limit (OpenCode surface setting):** Maximum 3 comments per 10 lines in JSONC blocks, this surface's budget for the shared comment-density rule (see [naming and commenting](../shared/universal-patterns/naming-and-commenting.md))",
     grepc("Quantity limit (OpenCode surface setting)", CSG), "1")
edit("Make the stale link label match its target.", JSG,
     "[`../../universal/code-style-guide.md`](../../../shared/references/universal/code-style-guide.md)",
     "[`../../../shared/references/universal/code-style-guide.md`](../../../shared/references/universal/code-style-guide.md)",
     grepc("[`../../universal/code-style-guide.md`]", JSG), "0")

# ── Playbook ────────────────────────────────────────────────────────────────
PBR = PB + "/manual-testing-playbook.md"
edit("Rename the packet in the playbook title.", PBR, "# code-opencode: Manual Testing Playbook", "# sk-code-opencode: Manual Testing Playbook",
     grepc("# sk-code-opencode: Manual Testing Playbook", PBR), "1")
edit("Rename the packet in the playbook intro.", PBR, "Routing-recall corpus for the `code-opencode` surface.", "Routing-recall corpus for the `sk-code-opencode` surface.",
     grepc("for the `sk-code-opencode` surface.", PBR), "1")
for s in ["authoring-verification/code-quality-gate.md", "authoring-verification/implementation-authoring.md",
          "authoring-verification/verification-alignment.md", "config-hooks/config-schema.md", "config-hooks/hooks-wiring.md",
          "language-standards/python-standards.md", "language-standards/rust-standards.md",
          "language-standards/shell-standards.md", "language-standards/typescript-standards.md"]:
    f = PB + "/" + s
    edit("Rename the packet in the scenario group.", f, "- Group: code-opencode routing", "- Group: sk-code-opencode routing",
         grepc("- Group: sk-code-opencode routing", f), "1")
VA = PB + "/authoring-verification/verification-alignment.md"
edit("Count the four drift guards in the scenario.", VA,
     "two drift guards (`verify_alignment_drift.py` and `verify_stack_folders.py`) run through",
     "four drift guards (`verify_alignment_drift.py`, `verify_stack_folders.py`, `verify_router_sync.cjs` and `verify_doc_claims.cjs`) run through",
     grepc("four drift guards (`verify_alignment_drift.py`", VA), "1")

# ── Changelog and leaf manifest ─────────────────────────────────────────────
create("Create the OpenCode changelog entry.", OC + "/changelog/v1.2.0.0.md", "v1.2.0.0.md",
       "python3 -I .skilled/skills/sk-doc/scripts/validate_document.py " + OC + "/changelog/v1.2.0.0.md | grep -E 'VALID|Total issues'", "Total issues: 0")
command("Regenerate the leaf manifest, which lists the new checker as an assets/scripts leaf.", [".skilled/skills/sk-code/leaf-manifest.json"],
        "node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --write .skilled/skills/sk-code",
        "node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --check .skilled/skills/sk-code; echo \"exit=$?\"", "exit=0")


# Order: each new test lands before the code it covers, then a negative-control run proves it fails.
def _take(pred):
    picked = [u for u in U if pred(u)]
    for u in picked:
        U.remove(u)
    return picked


_guard_test = _take(lambda u: u.get("file") == GUARD_TEST)
_doctor_test = _take(lambda u: u.get("file") == DOCTOR_TEST)
_guard_neg = {"kind": "command", "desc": "Negative control: run the new leg 2 tests against the unedited guard, which must fail.",
              "files": [FOLDER + "/scratch/neg-guard-test.txt"], "cmd": "node --test " + GUARD_TEST + " > " + FOLDER + "/scratch/neg-guard-test.txt 2>&1; echo \"exit=$?\"",
              "check": "grep -E '^. (pass|fail) ' " + FOLDER + "/scratch/neg-guard-test.txt", "expect": "fail 2"}
_doctor_neg = {"kind": "command", "desc": "Negative control: run the new 13c and 13d tests against the unedited doctor, which must fail.",
               "files": [FOLDER + "/scratch/neg-doctor-test.txt"], "cmd": "node " + DOCTOR_TEST + " > " + FOLDER + "/scratch/neg-doctor-test.txt 2>&1; echo \"exit=$?\"",
               "check": "grep -E '^. (pass|fail) ' " + FOLDER + "/scratch/neg-doctor-test.txt", "expect": "fail 3"}
_first_guard = next(i for i, u in enumerate(U) if u.get("file") == GUARD)
U[_first_guard:_first_guard] = _guard_test + [_guard_neg]
_first_doctor = next(i for i, u in enumerate(U) if u.get("file") == DOCTOR)
U[_first_doctor:_first_doctor] = _doctor_test + [_doctor_neg]


def instruction(u):
    if u["kind"] == "edit":
        return "In %s, replace the exact text <<<OLD\n%s\nOLD>>> with <<<NEW\n%s\nNEW>>>" % (u["file"], u["old"], u["new"])
    if u["kind"] == "create":
        return "Create %s with exactly the content of %s" % (u["file"], u["src"])
    return u["cmd"]


def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else "write"
    start = int(os.environ.get("FIRST_TASK", "16"))
    if mode == "verify":
        bad = 0
        for i, u in enumerate(U):
            if u["kind"] != "edit":
                continue
            n = open(u["file"], encoding="utf-8").read().count(u["old"])
            if n != 1:
                bad += 1
                print("T%03d %s: OLD occurs %d times" % (start + i, u["file"], n))
        print("units %d, edits %d, bad %d" % (len(U), sum(1 for u in U if u["kind"] == "edit"), bad))
        sys.exit(1 if bad else 0)
    if mode == "apply":
        mirror = sys.argv[2]
        for u in U:
            if u["kind"] == "edit":
                p = os.path.join(mirror, u["file"])
                s = open(p, encoding="utf-8").read()
                assert s.count(u["old"]) == 1, u["file"]
                open(p, "w", encoding="utf-8").write(s.replace(u["old"], u["new"]))
            elif u["kind"] == "create":
                p = os.path.join(mirror, u["file"])
                os.makedirs(os.path.dirname(p), exist_ok=True)
                shutil.copyfile(u["src"], p)
        print("applied %d units" % len(U))
        return
    out = []
    lines = []
    for i, u in enumerate(U):
        tid = "T%03d" % (start + i)
        files = u.get("files") or [u["file"]]
        out.append({"task": tid, "files": files, "kind": u["kind"], "instruction": instruction(u), "check": u["check"], "expect": u["expect"]})
        if u["kind"] == "edit" and "\n" not in u["old"] + u["new"] and "`" not in u["old"] + u["new"] and not u["old"].startswith(" "):
            body = "In `%s`, replace the exact text `%s` with `%s`." % (u["file"], u["old"], u["new"])
        elif u["kind"] == "edit":
            body = "In `%s`, replace the exact text given as OLD with the text given as NEW in unit %s of `%s/scratch/dispatch-units.json`, where both are quoted in full between the <<<OLD and <<<NEW markers. OLD occurs exactly once in the file." % (u["file"], tid, FOLDER)
        elif u["kind"] == "create":
            body = "Create `%s` with exactly the content of `%s`." % (u["file"], u["src"])
        else:
            body = "Run `%s`." % u["cmd"]
        if "`" in u["check"]:
            chk = "Check: run the check command of unit %s in `%s/scratch/dispatch-units.json`." % (tid, FOLDER)
        else:
            chk = "Check: `%s`." % u["check"]
        lines.append("- [ ] %s %s %s %s Expected: `%s`. (`%s`)" % (tid, u["desc"], body, chk, u["expect"], files[0]))
    json.dump(out, open(FOLDER + "/scratch/dispatch-units.json", "w", encoding="utf-8"), indent=2)
    open(FOLDER + "/scratch/phase2-tasks.md", "w", encoding="utf-8").write("\n".join(lines) + "\n")
    print("wrote %d units" % len(out))


main()
