#!/usr/bin/env node
// verify_router_sync: drift guard for the sk-code router, as a standalone CommonJS script.
// PROTOTYPE: SK_SKILLS_ROOT replaces the __dirname-derived constants of the final file.
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const lib = require('./router_replay_lib.cjs');

const SKILLS_ROOT = process.env.SK_SKILLS_ROOT;
if (!SKILLS_ROOT) throw new Error('PROTOTYPE: set SK_SKILLS_ROOT to <repo>/.skilled/skills');
const SKCODE = path.join(SKILLS_ROOT, 'sk-code');
const REPO_ROOT = path.resolve(SKILLS_ROOT, '..', '..');
const LEAF_CONTRACT = require(path.join(SKILLS_ROOT, 'sk-doc', 'sk-create-skill', 'scripts', 'lib', 'leaf-resource-contract.cjs'));

const ROUTE_GOLD_REL = path.join('specs', 'sk-doc', '019-skill-routing-refactor', '015-router-unification-program', '009-parent-hub-rollout', '001-sk-code', 'compiled', 'route-gold.typed.json');
const ROUTE_GOLD_CANDIDATES = [
  path.join(REPO_ROOT, 'specs', 'sk-doc', 'z_archive', ROUTE_GOLD_REL.replace(/^specs[\\/]sk-doc[\\/]/, '')),
  path.join(REPO_ROOT, ROUTE_GOLD_REL),
];

const NON_ROUTED_ALLOWLIST = new Set(['ROUTER.md', 'references/stack-detection.md', 'references/phase-detection.md']);
const SURFACES = ['sk-code-webflow', 'sk-code-opencode'];
const SURFACE_PACKETS = new Set([...SURFACES, 'sk-code-obsidian']);
const PARENT_TIER_ALLOWLIST = new Set([
  'shared/references/universal/multi-agent-research.md',
  'shared/references/universal/code-quality-standards.md',
  'shared/references/universal/code-style-guide.md',
  'shared/references/universal/error-recovery.md',
  'shared/references/universal-debugging-checklist.md',
  'shared/references/universal-verification-checklist.md',
  'shared/references/performance-loading-checklist.md',
  'shared/assets/patterns/README.md',
  'sk-code-review/assets/code-quality-checklist.md',
]);
const NON_CONTRACT_CATEGORIES = new Set(['holdout', 'unknown_fallback', 'surface_detection', 'token_cost_baseline', 'resource_loading', 'cross_cli_dispatch']);

const norm = (p) => p.replace(/^\.\//, '');
const readSkillRouter = (dir) => lib.parseRouter(fs.readFileSync(path.join(dir, 'SKILL.md'), 'utf8'), dir);

// Port of parseFrontmatter(text).raw: the leading fence block including both fences, or null.
function frontmatterRaw(markdown) {
  if (typeof markdown !== 'string' || markdown.length === 0) return null;
  const firstNewline = markdown.indexOf('\n');
  const firstLine = firstNewline === -1 ? markdown : markdown.slice(0, firstNewline);
  if (firstLine.trimEnd() !== '---') return null;
  let offset = firstNewline + 1;
  for (;;) {
    const newline = markdown.indexOf('\n', offset);
    const lineEnd = newline === -1 ? markdown.length : newline;
    if (markdown.slice(offset, lineEnd).trimEnd() === '---') {
      const closingEnd = newline === -1 ? markdown.length : newline + 1;
      let rawEnd = closingEnd;
      if (rawEnd > offset && markdown[rawEnd - 1] === '\n') rawEnd -= 1;
      if (rawEnd > offset && markdown[rawEnd - 1] === '\r') rawEnd -= 1;
      return markdown.slice(0, rawEnd);
    }
    if (newline === -1) return null;
    offset = newline + 1;
  }
}

function walkMarkdown(base, out) {
  const stack = [base];
  while (stack.length) {
    const cur = stack.pop();
    for (const entry of fs.readdirSync(cur, { withFileTypes: true })) {
      const full = path.join(cur, entry.name);
      if (entry.isDirectory()) stack.push(full);
      else if (entry.isFile() && entry.name.endsWith('.md')) out.push(path.relative(SKCODE, full).split(path.sep).join('/'));
    }
  }
  return out;
}

function hubPacketDirs() {
  return fs.readdirSync(SKCODE, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name).sort();
}

// Leg 1a: the machine-readable router names real files and the prose maps name only routed paths.
function machineRouterPaths() {
  const router = readSkillRouter(SKCODE);
  const set = new Set(router.defaultResource || []);
  for (const paths of Object.values(router.resourceMap)) for (const p of paths) set.add(p);
  if (router.routerSource === 'hub-router.json') {
    const surfaceRouter = lib.loadSurfaceRouter(SKCODE);
    if (surfaceRouter) {
      for (const r of surfaceRouter.defaultResource || []) set.add(r);
      for (const paths of Object.values(surfaceRouter.resourceMap)) for (const p of paths) set.add(p);
    }
  }
  return set;
}

function proseExplicitPaths(problems) {
  const md = fs.readFileSync(path.join(SKCODE, 'ROUTER.md'), 'utf8');
  const start = md.indexOf('## 4. WEBFLOW MAP');
  const end = md.indexOf('## 7. VERIFICATION COMMANDS');
  if (start < 0 || end <= start) {
    problems.push(`ROUTER.md section anchors not found (start=${start}, end=${end}), so the prose scan would be empty`);
    return new Set();
  }
  const re = /`((?:shared|references|assets|webflow|opencode|animation)\/[^`*{}\s]+\.md)`/g;
  const set = new Set();
  let m;
  while ((m = re.exec(md.slice(start, end))) !== null) set.add(m[1]);
  return set;
}

function legPaths() {
  const problems = [];
  const machine = machineRouterPaths();
  if (machine.size <= 50) problems.push(`machine router lists ${machine.size} paths, expected more than 50`);
  const roots = [SKCODE, ...lib.registryPacketRoots(SKCODE)];
  for (const p of machine) {
    if (!roots.some((root) => fs.existsSync(path.join(root, p)))) problems.push(`dead route: ${p}`);
  }
  for (const p of proseExplicitPaths(problems)) {
    if (!machine.has(p)) problems.push(`prose path not routed: ${p}`);
  }
  return problems;
}

// Leg 1b: every reference or asset markdown doc under the hub is routed by the hub, a surface or its own packet router.
function legOrphans() {
  const problems = [];
  const docs = [];
  for (const top of hubPacketDirs()) {
    for (const sub of ['references', 'assets']) {
      const base = path.join(SKCODE, top, sub);
      if (fs.existsSync(base)) walkMarkdown(base, docs);
    }
  }
  if (docs.length === 0) problems.push('walk found 0 routable docs, so the check would be vacuous');
  const routed = new Set(machineRouterPaths());
  for (const top of hubPacketDirs()) {
    const skill = path.join(SKCODE, top, 'SKILL.md');
    if (!fs.existsSync(skill)) continue;
    const router = readSkillRouter(path.join(SKCODE, top));
    for (const p of [...(router.defaultResource || []), ...Object.values(router.resourceMap).flat()]) routed.add(`${top}/${norm(p)}`);
  }
  for (const d of docs.sort()) {
    if (!NON_ROUTED_ALLOWLIST.has(d) && !routed.has(d)) problems.push(`orphan (routable doc no router names): ${d}`);
  }
  return problems;
}

// Leg 2: the parent surface RESOURCE_MAP equals the union of the surface children plus the parent tier.
function legSurfaceMap() {
  const problems = [];
  const parent = lib.loadSurfaceRouter(SKCODE);
  const parentMap = (parent && parent.resourceMap) || {};
  const children = {};
  for (const s of SURFACES) children[s] = readSkillRouter(path.join(SKCODE, s)).resourceMap || {};
  for (const s of SURFACES) {
    if (Object.keys(children[s]).length === 0) problems.push(`${s} resourceMap is empty`);
    for (const paths of Object.values(children[s])) {
      for (const p of paths) if (!fs.existsSync(path.join(SKCODE, s, norm(p)))) problems.push(`dead child path: ${s}/${norm(p)}`);
    }
  }
  const declaredBy = (surface) => {
    const map = children[surface] || readSkillRouter(path.join(SKCODE, surface)).resourceMap || {};
    return new Set(Object.values(map).flat().map((p) => `${surface}/${norm(p)}`));
  };
  const intents = new Set([...Object.keys(parentMap), ...SURFACES.flatMap((s) => Object.keys(children[s]))]);
  for (const it of intents) {
    const union = new Set();
    for (const s of SURFACES) for (const p of children[s][it] || []) union.add(`${s}/${norm(p)}`);
    const parentPaths = new Set((parentMap[it] || []).map(norm));
    const childOwnsIntent = SURFACES.some((s) => children[s][it]);
    for (const c of union) if (!parentPaths.has(c)) problems.push(`parent map ${it} is missing child path ${c}`);
    for (const p of parentPaths) {
      if (union.has(p)) continue;
      const owner = /^(sk-code-[a-z0-9-]+)\//.exec(p);
      if (owner && SURFACE_PACKETS.has(owner[1])) {
        if (!childOwnsIntent && declaredBy(owner[1]).has(p)) continue;
        problems.push(`parent map ${it} cites ${p}, which no surface child owns`);
      } else if (!PARENT_TIER_ALLOWLIST.has(p)) {
        problems.push(`parent map ${it} cites ${p}, outside the parent tier`);
      }
    }
  }
  return problems;
}

// Leg 3: compiled destinations, leaf-manifest.json and the code-opencode RESOURCE_MAP agree through qualifiedIdToLeaf.
function legBijection() {
  const problems = [];
  const manifest = JSON.parse(fs.readFileSync(path.join(SKCODE, 'leaf-manifest.json'), 'utf8'));
  const modeIndex = {};
  for (const mode of manifest.modes || []) modeIndex[mode.workflowMode] = { packet: mode.packet, leaves: new Set(mode.leaves || []) };
  for (const [workflowMode, mode] of Object.entries(modeIndex)) {
    const probe = `sk-code/${workflowMode}/${mode.packet}/workflow/identity-probe`;
    const resolved = LEAF_CONTRACT.qualifiedIdToLeaf(probe, { modeIndex });
    if (!resolved.ok || resolved.mode !== mode) problems.push(`manifest round trip fails for ${probe}`);
  }
  const [anyMode] = Object.keys(modeIndex);
  if (anyMode && LEAF_CONTRACT.qualifiedIdToLeaf(`sk-code/${anyMode}/not-the-real-packet/workflow/identity-probe`, { modeIndex }).ok) {
    problems.push('a wrong packet resolves through qualifiedIdToLeaf (it must fail closed)');
  }
  const goldPath = ROUTE_GOLD_CANDIDATES.find((p) => fs.existsSync(p));
  if (!goldPath) {
    problems.push(`route-gold not found, tried: ${ROUTE_GOLD_CANDIDATES.map((p) => path.relative(REPO_ROOT, p)).join(', ')}`);
  } else {
    const gold = JSON.parse(fs.readFileSync(goldPath, 'utf8'));
    const ids = new Set();
    for (const c of gold.cases || []) for (const id of c.targetQualifiedIds || []) ids.add(id);
    for (const id of ids) if (!LEAF_CONTRACT.qualifiedIdToLeaf(id, { modeIndex }).ok) problems.push(`compiled destination resolves to no leaf-owning mode: ${id}`);
  }
  const codeOpencode = modeIndex['sk-code-opencode'];
  if (!codeOpencode) {
    problems.push('leaf-manifest.json declares no sk-code-opencode mode');
  } else {
    const router = readSkillRouter(path.join(SKCODE, 'sk-code-opencode'));
    const paths = new Set([...(router.defaultResource || []), ...Object.values(router.resourceMap).flat()].map(norm));
    for (const p of paths) if (!codeOpencode.leaves.has(p)) problems.push(`code-opencode RESOURCE_MAP entry is not a manifest leaf: ${p}`);
  }
  return problems;
}

function playbookScenarios() {
  const out = [];
  for (const top of hubPacketDirs()) {
    const pb = path.join(SKCODE, top, 'manual-testing-playbook');
    if (!fs.existsSync(pb)) continue;
    const pending = [pb];
    while (pending.length) {
      const dir = pending.pop();
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) { pending.push(full); continue; }
        if (!entry.isFile() || !entry.name.endsWith('.md')) continue;
        if (entry.name === 'manual-testing-playbook.md' || entry.name.toLowerCase() === 'readme.md') continue;
        const text = fs.readFileSync(full, 'utf8');
        const raw = frontmatterRaw(text);
        if (raw === null) continue;
        const fm = raw.slice(4, -4);
        if (!/^expected_intent:/m.test(fm)) continue;
        const category = /^category:\s*(\S+)/m.exec(fm);
        if (category && NON_CONTRACT_CATEGORIES.has(category[1])) continue;
        const expected = [...fm.matchAll(/^\s*-\s*(\S+\.md)\s*$/gm)].map((m) => m[1]);
        if (!expected.length) continue;
        const fence = /```text\n([\s\S]*?)\n```/.exec(text);
        const inline = /^-\s*Prompt:\s*`([^`]+)`/m.exec(text);
        const prompt = (fence ? fence[1] : inline ? inline[1] : '').trim();
        if (!prompt) continue;
        out.push({ file: path.relative(SKCODE, full).split(path.sep).join('/'), root: path.join(SKCODE, top), expected, prompt });
      }
    }
  }
  return out;
}

// Leg 4: every playbook scenario's expected_resource is emitted by the router, and each scenario selects an intent.
function legScenarios() {
  const problems = [];
  const scenarios = playbookScenarios();
  if (scenarios.length === 0) problems.push('no routing scenarios found, so the check would be vacuous');
  for (const s of scenarios) {
    const routed = lib.routeSkillResources({ skillRoot: s.root, taskText: s.prompt });
    const emitted = new Set(routed.resources);
    for (const want of s.expected) if (!emitted.has(want)) problems.push(`${s.file} expects ${want}, which the router does not emit`);
    if (routed.intents.length === 0) problems.push(`${s.file} selects no intent`);
  }
  return problems;
}

const LEGS = [
  ['1a', 'machine-router paths exist and the prose maps are routed', legPaths],
  ['1b', 'every routable reference or asset doc is routed', legOrphans],
  ['2', 'surface RESOURCE_MAP equals the children union plus the parent tier', legSurfaceMap],
  ['3', 'compiled destinations, leaf-manifest and code-opencode RESOURCE_MAP agree', legBijection],
  ['4', 'playbook expected_resource is emitted by the router', legScenarios],
];

function parseChecks(argv) {
  const idx = argv.indexOf('--checks');
  if (idx === -1) return LEGS.map((l) => l[0]);
  const ids = (argv[idx + 1] || '').split(',').filter(Boolean);
  const known = new Set(LEGS.map((l) => l[0]));
  const unknown = ids.filter((id) => !known.has(id));
  if (ids.length === 0 || unknown.length) {
    console.error(`usage: verify_router_sync [--checks ${[...known].join(',')}] (unknown: ${unknown.join(',') || 'none given'})`);
    process.exit(2);
  }
  return ids;
}

function main(argv) {
  const selected = parseChecks(argv);
  const legs = LEGS.filter((l) => selected.includes(l[0]));
  let failed = 0;
  for (const [id, title, run] of legs) {
    let problems;
    try {
      problems = run();
    } catch (err) {
      problems = [`threw: ${String(err.message).split('\n')[0]}`];
    }
    if (problems.length === 0) {
      console.log(`PASS check ${id}: ${title}`);
    } else {
      failed += 1;
      console.log(`FAIL check ${id}: ${title} (${problems.length} problem(s))`);
      for (const p of problems.slice(0, 12)) console.log(`  - ${p}`);
      if (problems.length > 12) console.log(`  - ... ${problems.length - 12} more`);
    }
  }
  console.log(`router-sync: ${legs.length - failed}/${legs.length} checks passed`);
  return failed === 0 ? 0 : 1;
}

process.exitCode = main(process.argv.slice(2));
