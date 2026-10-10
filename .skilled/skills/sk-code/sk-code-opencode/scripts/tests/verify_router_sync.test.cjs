// ───────────────────────────────────────────────────────────────────
// MODULE: Router-sync guard, orphan-doc check tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// Drives leg 1b of verify_router_sync.cjs against a throwaway hub, so the orphan check can be
// made to pass and to fail without touching the live tree.
// Run from the repository root:
//   node --test .skilled/skills/sk-code/sk-code-opencode/scripts/tests/verify_router_sync.test.cjs

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const SCRIPTS = path.resolve(__dirname, '..', '..', 'assets', 'scripts');
const LIVE_SKILLS = path.resolve(__dirname, '..', '..', '..', '..');
const CONTRACT = path.join('sk-doc', 'sk-create-skill', 'scripts', 'lib', 'leaf-resource-contract.cjs');

function write(file, text) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text);
}

// The guard resolves the hub from its own location, so it runs from a copy placed where a real
// one would sit. The hub has one packet whose router names one reference, plus a canonical
// workflow doc that the packet reaches through a symlink and no router names.
function buildHub(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'router-sync-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const skills = path.join(root, 'skills');
  const hub = path.join(skills, 'sk-code');
  const scripts = path.join(hub, 'sk-code-opencode', 'assets', 'scripts');
  fs.mkdirSync(scripts, { recursive: true });
  for (const name of ['verify_router_sync.cjs', 'router_replay_lib.cjs']) {
    fs.copyFileSync(path.join(SCRIPTS, name), path.join(scripts, name));
  }
  write(path.join(skills, CONTRACT), fs.readFileSync(path.join(LIVE_SKILLS, CONTRACT), 'utf8'));
  write(path.join(hub, 'SKILL.md'), 'RESOURCE_MAP = {\n  "DEMO": ["sk-code-demo/references/routed.md"],\n}\n');
  write(path.join(hub, 'sk-code-demo', 'SKILL.md'), 'RESOURCE_MAP = {\n  "DEMO": ["references/routed.md"],\n}\n');
  write(path.join(hub, 'sk-code-demo', 'references', 'routed.md'), '# routed\n');
  write(path.join(hub, 'shared', 'references', 'workflow-debug.md'), '# canonical workflow doc\n');
  fs.symlinkSync(
    path.join('..', '..', 'shared', 'references', 'workflow-debug.md'),
    path.join(hub, 'sk-code-demo', 'references', 'workflow-debug.md'),
  );
  return { hub, guard: path.join(scripts, 'verify_router_sync.cjs') };
}

function runGuard(guard, args) {
  const run = spawnSync(process.execPath, [guard, ...args], { encoding: 'utf8' });
  return { status: run.status, out: run.stdout };
}

test('a canonical workflow doc reached through a surface symlink is not reported', (t) => {
  const { guard } = buildHub(t);
  const { status, out } = runGuard(guard, ['--checks', '1b']);
  assert.equal(status, 0, out);
  assert.match(out, /PASS check 1b/);
  assert.doesNotMatch(out, /workflow-debug/);
});

test('an unrouted doc is still reported, in the shared tier and in a packet', (t) => {
  const { hub, guard } = buildHub(t);
  write(path.join(hub, 'shared', 'references', 'stray.md'), '# stray\n');
  write(path.join(hub, 'sk-code-demo', 'references', 'stray-local.md'), '# stray local\n');
  const { status, out } = runGuard(guard, ['--checks', '1b']);
  assert.equal(status, 1, out);
  assert.match(out, /FAIL check 1b/);
  assert.match(out, /orphan \(routable doc no router names\): shared\/references\/stray\.md/);
  assert.match(out, /orphan \(routable doc no router names\): sk-code-demo\/references\/stray-local\.md/);
  assert.doesNotMatch(out, /workflow-debug/);
});

test('a run without --checks includes leg 1b', (t) => {
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
  const block = controls.map((c) => `    "${c}",`).join('\n');
  const preamble = defaults.map((c) => `    "${c}",`).join('\n');
  const router = `DEFAULT_RESOURCE = [\n${preamble}\n]\nRESOURCE_MAP = {\n  ${parentMap}\n}\n`;
  write(path.join(hub, 'ROUTER.md'), `${router}SHARED_CONTROL_RESOURCES = [\n${block}\n]\n`);
  for (const [surface, doc] of [['sk-code-webflow', 'w.md'], ['sk-code-opencode', 'o.md']]) {
    write(path.join(hub, surface, 'SKILL.md'), `RESOURCE_MAP = {\n  "DEMO": ["references/${doc}"],\n}\n`);
    write(path.join(hub, surface, 'references', doc), `# ${doc}\n`);
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
  assert.match(out, /parent map DEMO cites shared\/references\/undeclared\.md, outside the parent tier/);
  assert.doesNotMatch(out, /control\.md/);
  assert.doesNotMatch(out, /sk-code-review\/assets\/leaf\.md/);
});
