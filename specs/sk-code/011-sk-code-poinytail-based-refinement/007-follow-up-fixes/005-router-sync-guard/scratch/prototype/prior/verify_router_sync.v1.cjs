#!/usr/bin/env node
// PROTOTYPE of the router-sync guard, run from scratch/prototype only.
// Path constants differ from the final file: SK_SKILLS_ROOT replaces __dirname.
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const lib = require('./router-replay-lib.cjs');

const SKILLS_ROOT = process.env.SK_SKILLS_ROOT;
if (!SKILLS_ROOT) throw new Error('set SK_SKILLS_ROOT to <repo>/.skilled/skills');
const SKCODE = path.join(SKILLS_ROOT, 'sk-code');
const REPO_ROOT = path.resolve(SKILLS_ROOT, '..', '..');
const LEAF_CONTRACT = require(path.join(SKILLS_ROOT, 'sk-doc', 'sk-create-skill', 'scripts', 'lib', 'leaf-resource-contract.cjs'));
const SK_CODE_ROUTE_GOLD = path.join(REPO_ROOT, 'specs', 'sk-doc', '019-skill-routing-refactor', '015-router-unification-program', '009-parent-hub-rollout', '001-sk-code', 'compiled', 'route-gold.typed.json');
const SK_CODE_ROUTE_GOLD_ARCHIVED = path.join(REPO_ROOT, 'specs', 'sk-doc', 'z_archive', '019-skill-routing-refactor', '015-router-unification-program', '009-parent-hub-rollout', '001-sk-code', 'compiled', 'route-gold.typed.json');

const NON_ROUTED_ALLOWLIST = new Set(['ROUTER.md', 'references/stack-detection.md', 'references/phase-detection.md']);
const SURFACES = process.env.PROTO_SURFACES ? process.env.PROTO_SURFACES.split(',') : ['sk-code-webflow', 'sk-code-opencode', 'sk-code-mobile-cli'];
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

// Minimal port of parseFrontmatter(...).raw: the leading fence block or null.
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
      const closingStart = offset;
      const closingEnd = newline === -1 ? markdown.length : newline + 1;
      let rawEnd = closingEnd;
      if (rawEnd > closingStart && markdown[rawEnd - 1] === '\n') rawEnd -= 1;
      if (rawEnd > closingStart && markdown[rawEnd - 1] === '\r') rawEnd -= 1;
      return markdown.slice(0, rawEnd);
    }
    if (newline === -1) return null;
    offset = newline + 1;
  }
}

function machineRouterPaths() {
  const router = lib.parseRouter(fs.readFileSync(path.join(SKCODE, 'SKILL.md'), 'utf8'), SKCODE);
  const set = new Set();
  for (const r of router.defaultResource || []) set.add(r);
  for (const paths of Object.values(router.resourceMap)) for (const p of paths) set.add(p);
  if (router.routerSource === 'hub-router.json') {
    const surfaceRouter = lib.loadSurfaceRouter(SKCODE);
    if (surfaceRouter) {
      for (const r of surfaceRouter.defaultResource || []) set.add(r);
      for (const paths of Object.values(surfaceRouter.resourceMap)) for (const p of paths) set.add(p);
    }
  }
  return { set, routerSource: router.routerSource };
}

function listRoutableMarkdown() {
  const out = [];
  for (const dir of ['references', 'assets']) {
    const base = path.join(SKCODE, dir);
    if (!fs.existsSync(base)) continue;
    const stack = [base];
    while (stack.length) {
      const cur = stack.pop();
      for (const entry of fs.readdirSync(cur, { withFileTypes: true })) {
        const full = path.join(cur, entry.name);
        if (entry.isDirectory()) stack.push(full);
        else if (entry.isFile() && entry.name.endsWith('.md')) out.push(path.relative(SKCODE, full));
      }
    }
  }
  return out;
}

function proseExplicitPaths(problems) {
  const md = fs.readFileSync(path.join(SKCODE, 'ROUTER.md'), 'utf8');
  const start = md.indexOf('## 4. WEBFLOW MAP');
  const end = md.indexOf('## 7. VERIFICATION COMMANDS');
  if (start < 0 || end < 0 || end <= start) problems.push(`ROUTER.md section anchors missing (start=${start}, end=${end}); prose scan is empty`);
  const prose = md.slice(Math.max(start, 0), Math.max(end, 0));
  const re = /`((?:shared|references|assets|webflow|opencode|animation)\/[^`*{}\s]+\.md)`/g;
  const set = new Set();
  let m;
  while ((m = re.exec(prose)) !== null) set.add(m[1]);
  return set;
}

function check1() {
  const problems = [];
  const { set: machine, routerSource } = machineRouterPaths();
  console.log(`  info: machine router paths=${machine.size} routerSource=${routerSource}`);
  if (machine.size <= 50) problems.push(`machine router has ${machine.size} paths, expected more than 50`);
  const roots = [SKCODE, ...lib.registryPacketRoots(SKCODE)];
  for (const p of machine) {
    if (!roots.some((root) => fs.existsSync(path.join(root, p)))) problems.push(`dead route: ${p}`);
  }
  for (const p of listRoutableMarkdown()) {
    if (!NON_ROUTED_ALLOWLIST.has(p) && !machine.has(p)) problems.push(`orphan (routable doc not routed): ${p}`);
  }
  for (const p of proseExplicitPaths(problems)) {
    if (!machine.has(p)) problems.push(`prose path not routed: ${p}`);
  }
  return problems;
}

function childResourceMap(surface) {
  const md = fs.readFileSync(path.join(SKCODE, surface, 'SKILL.md'), 'utf8');
  return parseRouterMapOnly(md, path.join(SKCODE, surface));
}
function parseRouterMapOnly(md, root) {
  return (lib.parseRouter(md, root).resourceMap || {});
}

function check2() {
  const problems = [];
  const parent = lib.loadSurfaceRouter(SKCODE);
  const parentMap = (parent && parent.resourceMap) || {};
  const children = {};
  for (const s of SURFACES) children[s] = childResourceMap(s);
  for (const s of SURFACES) {
    if (Object.keys(children[s]).length === 0) problems.push(`${s} resourceMap empty`);
    for (const paths of Object.values(children[s])) {
      for (const p of paths) if (!fs.existsSync(path.join(SKCODE, s, norm(p)))) problems.push(`dead child path: ${s}/${p}`);
    }
  }
  const surfaceDeclared = (surface) => {
    const declared = new Set();
    for (const paths of Object.values(children[surface] || childResourceMap(surface))) for (const p of paths) declared.add(`${surface}/${norm(p)}`);
    return declared;
  };
  const intents = new Set([...Object.keys(parentMap), ...SURFACES.flatMap((s) => Object.keys(children[s]))]);
  for (const it of intents) {
    const union = new Set();
    for (const s of SURFACES) for (const p of children[s][it] || []) union.add(`${s}/${norm(p)}`);
    const parentPaths = new Set((parentMap[it] || []).map(norm));
    const childOwnsIntent = SURFACES.some((s) => children[s][it]);
    for (const c of union) if (!parentPaths.has(c)) problems.push(`over-extraction ${it}: ${c}`);
    for (const p of parentPaths) {
      if (union.has(p)) continue;
      const owner = /^(sk-code-[a-z0-9-]+)\//.exec(p);
      if (owner && SURFACE_PACKETS.has(owner[1])) {
        if (!childOwnsIntent && surfaceDeclared(owner[1]).has(p)) continue;
        problems.push(`uncovered ${it}: ${p}`);
      } else if (!PARENT_TIER_ALLOWLIST.has(p)) problems.push(`tier violation ${it}: ${p}`);
    }
  }
  return problems;
}

function check3() {
  const problems = [];
  const manifest = JSON.parse(fs.readFileSync(path.join(SKCODE, 'leaf-manifest.json'), 'utf8'));
  const modeIndex = {};
  for (const mode of manifest.modes || []) modeIndex[mode.workflowMode] = { packet: mode.packet, leaves: new Set(mode.leaves || []) };
  for (const [workflowMode, mode] of Object.entries(modeIndex)) {
    const probe = `sk-code/${workflowMode}/${mode.packet}/workflow/identity-probe`;
    const resolved = LEAF_CONTRACT.qualifiedIdToLeaf(probe, { modeIndex });
    if (!resolved.ok || resolved.mode !== mode) problems.push(`manifest round-trip fails: ${probe}`);
  }
  const [anyMode] = Object.keys(modeIndex);
  if (LEAF_CONTRACT.qualifiedIdToLeaf(`sk-code/${anyMode}/not-the-real-packet/workflow/identity-probe`, { modeIndex }).ok) problems.push('wrong packet resolves (must fail closed)');
  const goldPath = [SK_CODE_ROUTE_GOLD, SK_CODE_ROUTE_GOLD_ARCHIVED].find((p) => fs.existsSync(p));
  if (!goldPath) {
    problems.push(`route-gold not found at the path the suite used or at its z_archive copy`);
  } else {
    console.log(`  info: route-gold read from ${path.relative(REPO_ROOT, goldPath)}`);
    const gold = JSON.parse(fs.readFileSync(goldPath, 'utf8'));
    const ids = new Set();
    for (const c of gold.cases || []) for (const id of c.targetQualifiedIds || []) ids.add(id);
    for (const id of ids) if (!LEAF_CONTRACT.qualifiedIdToLeaf(id, { modeIndex }).ok) problems.push(`compiled destination without a leaf-owning mode: ${id}`);
  }
  const codeOpencode = modeIndex['sk-code-opencode'];
  if (!codeOpencode) {
    problems.push('leaf-manifest.json declares no sk-code-opencode mode');
  } else {
    const md = fs.readFileSync(path.join(SKCODE, 'sk-code-opencode', 'SKILL.md'), 'utf8');
    const router = lib.parseRouter(md, path.join(SKCODE, 'sk-code-opencode'));
    const paths = new Set();
    for (const r of router.defaultResource || []) paths.add(norm(r));
    for (const list of Object.values(router.resourceMap)) for (const p of list) paths.add(norm(p));
    for (const p of paths) if (!codeOpencode.leaves.has(p)) problems.push(`RESOURCE_MAP entry not a manifest leaf: ${p}`);
  }
  return problems;
}

function routingScenarios() {
  const out = [];
  for (const packet of fs.readdirSync(SKCODE, { withFileTypes: true })) {
    if (!packet.isDirectory()) continue;
    const root = path.join(SKCODE, packet.name);
    const pb = path.join(root, 'manual-testing-playbook');
    if (!fs.existsSync(pb)) continue;
    const pending = [pb];
    const files = [];
    while (pending.length) {
      const dir = pending.pop();
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.isDirectory()) pending.push(path.join(dir, entry.name));
        else if (entry.isFile()) files.push({ name: entry.name, path: path.join(dir, entry.name) });
      }
    }
    for (const entry of files) {
      if (!entry.name.endsWith('.md')) continue;
      if (entry.name === 'manual-testing-playbook.md' || entry.name.toLowerCase() === 'readme.md') continue;
      const text = fs.readFileSync(entry.path, 'utf8');
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
      out.push({ file: `${packet.name}/${entry.name}`, root, expected, prompt });
    }
  }
  return out;
}

function check4() {
  const problems = [];
  const scenarios = routingScenarios();
  console.log(`  info: scenarios=${scenarios.length}`);
  if (scenarios.length === 0) problems.push('no routing scenarios found (guard would be vacuous)');
  for (const s of scenarios) {
    const routed = new Set(lib.routeSkillResources({ skillRoot: s.root, taskText: s.prompt }).resources);
    for (const want of s.expected) if (!routed.has(want)) problems.push(`${s.file} -> ${want}`);
  }
  for (const s of scenarios) {
    if (lib.routeSkillResources({ skillRoot: s.root, taskText: s.prompt }).intents.length === 0) problems.push(`no intent selected: ${s.file}`);
  }
  return problems;
}

const CHECKS = [
  ['1 machine-router paths: parse, dead routes, orphans, prose paths', check1],
  ['2 surface RESOURCE_MAP equals children union plus parent tier', check2],
  ['3 qualifiedIdToLeaf bijection: manifest, route-gold, code-opencode RESOURCE_MAP', check3],
  ['4 playbook expected_resource is emitted by the router', check4],
];

let failed = 0;
for (const [name, fn] of CHECKS) {
  let problems;
  try {
    problems = fn();
  } catch (err) {
    problems = [`threw: ${err.message.split('\n')[0]}`];
  }
  if (problems.length === 0) {
    console.log(`PASS check ${name}`);
  } else {
    failed += 1;
    console.log(`FAIL check ${name} (${problems.length} problem(s))`);
    for (const p of problems.slice(0, 12)) console.log(`  - ${p}`);
    if (problems.length > 12) console.log(`  - ... ${problems.length - 12} more`);
  }
}
console.log(`router-sync: ${CHECKS.length - failed}/${CHECKS.length} checks passed`);
process.exitCode = failed === 0 ? 0 : 1;
