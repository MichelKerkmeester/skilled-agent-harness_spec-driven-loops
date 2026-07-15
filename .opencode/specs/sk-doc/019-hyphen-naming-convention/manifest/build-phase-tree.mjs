#!/usr/bin/env node
// Generates the phase-tree manifest for the literal-maximal re-decomposition of
// sk-doc/017-hyphen-naming-convention. Encodes the decomposition rules over the
// verified on-disk component directories. Emits phase-tree.json + a summary.
//
// Node shape: { slug, kind:'leaf'|'parent', level, verifyOnly?, origin?, note?, dependsOn?, children? }
// Levels: gates & tooling & codebase-closures = 3 ; modes/catalog/playbook/refs/assets = 2 ; verify-only = 1

import { writeFileSync } from 'node:fs';

const ROOT = 'sk-doc/017-hyphen-naming-convention';

// ---- reusable builders -------------------------------------------------------

const leaf = (slug, level = 2, extra = {}) => ({ slug, kind: 'leaf', level, ...extra });
const parent = (slug, children, extra = {}) => ({ slug, kind: 'parent', level: 'phase', children, ...extra });
const verify = (slug) => leaf(slug, 1, { verifyOnly: true, note: 'verify-only: prove zero in-scope candidates + scan references' });
const gate = (slug = 'skill-gate') => leaf(slug, 3, { note: 'rollup gate: subtree zero-snake, links, build/test/benchmark parity vs 000 baseline' });
const changelogVerify = () => verify('changelog-verify');

// A standard hub skill: hub-root+shared, one leaf per mode dir, catalog/playbook if present, benchmark, changelog, gate.
function hubSkill(slug, modeDirs, { hasFeatureCatalog = false, hasPlaybook = true, hasBenchmark = true, extraLeafPrefix = [] } = {}) {
  const kids = [];
  kids.push(leaf('hub-root-and-shared', 2, { note: 'SKILL.md, mode-registry.json path VALUES, shared/' }));
  for (const m of extraLeafPrefix) kids.push(leaf(m, 2));
  for (const m of modeDirs) kids.push(leaf(m, 2));
  if (hasFeatureCatalog) kids.push(leaf('feature-catalog', 2, { note: 'reverse feature_catalog underscore content; zero silent readme downgrade' }));
  if (hasPlaybook) kids.push(leaf('manual-testing-playbook', 2, { note: 'reverse manual_testing_playbook underscore content' }));
  if (hasBenchmark) kids.push(leaf('benchmark', 2));
  kids.push(changelogVerify());
  kids.push(gate());
  return parent(slug, kids);
}

// A codebase skill (mcp_server carrier): dir-and-manifest closure, scripts, refs/assets, runtime, catalog/playbook, gate.
function codebaseSkill(slug, { hasRuntime = false, hasAssets = false, hasFeatureCatalog = true, hasPlaybook = true, hasHooks = false } = {}) {
  const kids = [];
  kids.push(leaf('mcp-server-dir-and-manifest-closure', 3, { note: 'mcp_server->mcp-server: package.json workspaces, lockfile, tsconfigs, launchers, bin socket paths, opencode.json; realpath install proof (authored, not executed)' }));
  kids.push(leaf('scripts', 2));
  kids.push(leaf(hasAssets ? 'references-and-assets' : 'references', 2));
  if (hasRuntime) kids.push(leaf('runtime', 2));
  if (hasHooks) kids.push(leaf('hooks', 2));
  if (hasFeatureCatalog) kids.push(leaf('feature-catalog', 2));
  if (hasPlaybook) kids.push(leaf('manual-testing-playbook', 2));
  kids.push(changelogVerify());
  kids.push(gate());
  return parent(slug, kids);
}

// ---- 008 component fan-out ---------------------------------------------------

const sk_code = hubSkill('001-sk-code', ['code-opencode', 'code-quality', 'code-review', 'code-webflow'], { hasFeatureCatalog: false });

const sk_design = hubSkill('002-sk-design',
  ['design-interface', 'design-foundations', 'design-motion', 'design-audit', 'design-md-generator', 'design-mcp-open-design'],
  { hasFeatureCatalog: true });

// sk-doc: 11 create packets pushed under a sub-parent to keep sk-doc <=14 children (depth-4, precedent-safe).
const skDocCreatePackets = parent('create-packets', [
  leaf('create-skill', 2), leaf('create-readme', 2), leaf('create-agent', 2), leaf('create-command', 2),
  leaf('create-feature-catalog', 2), leaf('create-manual-testing-playbook', 2), leaf('create-benchmark', 2),
  leaf('create-flowchart', 2), leaf('create-changelog', 2), leaf('create-diff', 2), leaf('create-quality-control', 2),
], { note: 'one leaf per create-* generator packet (generator logic emits hyphenated names)' });
const sk_doc = parent('003-sk-doc', [
  leaf('hub-root-and-shared', 2),
  leaf('scripts', 2, { note: 'sk-doc/scripts incl. the validate_document.py symlink surface (python exemption showcase)' }),
  skDocCreatePackets,
  leaf('manual-testing-playbook', 2),
  leaf('benchmark', 2),
  changelogVerify(),
  gate(),
]);

const sk_prompt = hubSkill('004-sk-prompt', ['prompt-improve', 'prompt-models'], { hasFeatureCatalog: false });
const cli_ext = hubSkill('005-cli-external-orchestration', ['cli-opencode', 'cli-claude-code', 'cli-codex'], { hasFeatureCatalog: false });
const mcp_tooling = hubSkill('006-mcp-tooling', ['mcp-chrome-devtools', 'mcp-click-up', 'mcp-figma'], { hasFeatureCatalog: false });

// system-deep-loop: 5 mode dirs + runtime + shared; agent/model/skill improvements live inside deep-improvement.
const system_deep_loop = parent('007-system-deep-loop', [
  leaf('hub-root-and-shared', 2),
  leaf('runtime', 3, { note: 'system-deep-loop/runtime: 271 files, 108 snake — biggest shared-code hotspot; dependency backbone for all modes' }),
  leaf('deep-research', 2),
  leaf('deep-review', 2),
  leaf('deep-ai-council', 2),
  leaf('deep-improvement', 2, { note: 'incl. agent/model/skill sub-modes + assets (158 files)' }),
  leaf('deep-alignment', 2),
  leaf('manual-testing-playbook', 2),
  leaf('benchmark', 2),
  changelogVerify(),
  gate(),
]);

// system-spec-kit: the deepest codebase (66% of the repo rename surface).
const system_spec_kit = parent('008-system-spec-kit', [
  leaf('mcp-server-dir-and-manifest-closure', 3, { note: 'mcp_server->mcp-server npm-workspace closure (authored, not executed)' }),
  leaf('mcp-server-inner-dirs', 3, { note: 'stress_test, matrix_runners, behavior_benchmark, level_1/2/3 etc.' }),
  leaf('mcp-server-consumer-rewrites', 3, { note: 'every repo reference to mcp_server/**; vitest parity vs 000' }),
  leaf('scripts-tree', 2),
  leaf('templates-and-examples', 2, { note: 'templates/examples/level_1..3+, create.sh header/consumers, .hashes regen' }),
  leaf('references-and-assets', 2),
  leaf('shared-and-runtime', 2),
  leaf('feature-catalog', 2, { note: '~348 files' }),
  leaf('manual-testing-playbook', 2, { note: '~421 files' }),
  leaf('config-checkpoints-vectors-constitutional-verify', 2, { note: 'mostly generated/data — verify + classify exempt' }),
  changelogVerify(),
  gate(),
]);

const system_skill_advisor = codebaseSkill('009-system-skill-advisor', { hasRuntime: false, hasAssets: false, hasHooks: true });
const system_code_graph = codebaseSkill('010-system-code-graph', { hasRuntime: true, hasAssets: false });
const mcp_code_mode = codebaseSkill('011-mcp-code-mode', { hasRuntime: true, hasAssets: true, hasFeatureCatalog: false });

const sk_git = parent('012-sk-git', [
  leaf('references', 2), leaf('assets', 2), leaf('manual-testing-playbook', 2), leaf('benchmark', 2),
  changelogVerify(), gate(),
]);

const commands = parent('013-commands', [
  leaf('create-namespace', 2), leaf('deep-namespace', 2), leaf('design-namespace', 2), leaf('doctor-namespace', 2),
  leaf('memory-namespace', 2), leaf('scripts-namespace', 2), leaf('speckit-namespace', 2),
  leaf('loose-command-ids', 2, { note: 'agent_router.md->agent-router.md, goal_opencode.md->goal-opencode.md — user-facing command-id changes' }),
  leaf('command-assets', 2, { note: '~103 snake yaml/txt/py under <ns>/assets/' }),
  gate('commands-gate'),
]);

const AGENT_NAMES = ['ai-council', 'code', 'context', 'debug', 'deep-alignment', 'deep-improvement', 'deep-research', 'deep-review', 'design', 'markdown', 'orchestrate', 'prompt-improver', 'review'];
const agents = parent('014-agents',
  [...AGENT_NAMES.map((a, i) => verify(`${a}-verify`)), gate('agents-gate')],
  { note: 'agents have ZERO snake_case names across .opencode/.claude/.codex — per-agent verify-only leaves prove it (literal-maximal directive)' });

const component_migration = parent('008-component-migration', [
  sk_code, sk_design, sk_doc, sk_prompt, cli_ext, mcp_tooling, system_deep_loop,
  system_spec_kit, system_skill_advisor, system_code_graph, mcp_code_mode, sk_git, commands, agents,
], { dependsOn: ['007-shared-and-cross-cutting-closures'] });

// ---- foundation + tail (top level) ------------------------------------------

const TOP = [
  leaf('000-worktree-baseline-and-census', 2, { origin: '000-worktree-baseline-and-census' }),
  leaf('001-convention-policy-and-scope', 3, { origin: '001-convention-policy-and-scope', note: 'holds decision-record.md' }),
  leaf('002-root-name-consumer-migration', 3, { origin: '002-root-name-consumer-migration', note: 'add per-skill fail-closed coexistence acceptance criterion' }),
  parent('003-create-generators-and-templates', [
    leaf('create-skill-and-packaging', 2),
    leaf('catalog-and-playbook-generators', 2),
    leaf('readme-agent-command-changelog-flowchart-diff-benchmark', 2),
    leaf('command-asset-emitters', 2),
  ], { origin: '003-create-generators-and-templates (was leaf -> parent)' }),
  leaf('004-no-new-snake-guard', 2, { origin: '004-no-new-snake-guard' }),
  parent('005-rename-and-reference-tooling', [
    leaf('rename-engine', 3),
    leaf('reference-checker-and-disposition-ledger', 3),
    leaf('fixture-corpus-and-dry-run-harness', 2),
  ], { origin: '005-rename-and-reference-tooling (was leaf -> parent)' }),
  leaf('006-inventory-and-frozen-map', 3, { origin: '006-inventory-and-frozen-map (kept; scope expanded in content)', note: 'inventory + frozen bijective map + closure<->component map, hoist list, parallel go-list' }),
  parent('007-shared-and-cross-cutting-closures', [
    leaf('root-and-opencode-infra-strays', 2, { note: 'install_guides, install_scripts, root docs; .utcp_config.json exempt' }),
    leaf('cross-skill-symlink-closure', 3, { note: '53-symlink manifest; advisor->spec-kit shared/embeddings link; standing merge-gate check' }),
    leaf('hoisted-shared-script-closures', 2, { note: 'placeholder for closures 006 hoists across >=2 component subtrees' }),
    leaf('active-specs-and-docs', 2, { note: 'active (non-frozen) spec/doc .md filesystem names repo-wide' }),
  ], { origin: 'NEW (dependency backbone)' }),
  component_migration,
  leaf('009-remove-transition-aliases', 2, { origin: '008-remove-transition-aliases (git mv renumber)' }),
  leaf('010-whole-repo-gate', 3, { origin: '014-validate-build-test-rebenchmark (git mv renumber)' }),
  leaf('011-integrate-and-closeout', 2, { origin: '015-integrate-and-closeout (git mv renumber)' }),
];

// ---- flatten -----------------------------------------------------------------

const nodes = [];
let maxDepth = 0;
const overWide = [];

function walk(node, parentPath, depth) {
  const path = `${parentPath}/${node.slug}`;
  maxDepth = Math.max(maxDepth, depth);
  const entry = {
    id: path,
    slug: node.slug,
    parent: parentPath,
    kind: node.kind,
    level: node.level,
    depth,
  };
  if (node.verifyOnly) entry.verifyOnly = true;
  if (node.origin) entry.origin = node.origin;
  if (node.note) entry.note = node.note;
  if (node.dependsOn) entry.dependsOn = node.dependsOn;
  if (node.kind === 'parent') {
    entry.childrenCount = node.children.length;
    if (node.children.length > 14) overWide.push({ id: path, count: node.children.length });
  }
  nodes.push(entry);
  if (node.children) for (const c of node.children) walk(c, path, depth + 1);
}

// The scaffold (create.sh --phase) assigns each child folder a NNN- prefix in
// sibling order. Reproduce that here so the manifest ids match the on-disk tree.
// Pre-numbered slugs (top level, 008's skill dirs) are preserved as-is.
function numberChildren(node) {
  if (!node.children) return;
  node.children.forEach((child, i) => {
    if (!/^\d{3}-/.test(child.slug)) child.slug = `${String(i + 1).padStart(3, '0')}-${child.slug}`;
    numberChildren(child);
  });
}
for (const n of TOP) numberChildren(n);

for (const n of TOP) walk(n, ROOT, 1);

const leaves = nodes.filter((n) => n.kind === 'leaf');
const parents = nodes.filter((n) => n.kind === 'parent');
const byLevel = leaves.reduce((a, n) => { a[n.level] = (a[n.level] || 0) + 1; return a; }, {});

const manifest = {
  schema: 'phase-tree/v1',
  packet: ROOT,
  generated_note: 'Authoritative node enumeration for the literal-maximal re-decomposition. Source of truth for scaffolding, LUNA briefs, and the per-node validate loop.',
  policy: { max_children_per_parent: 14, max_depth: 4, recursive_validate_is_one_level: true },
  totals: {
    all_nodes: nodes.length,
    leaves: leaves.length,
    parents: parents.length,
    leaf_docs_estimate: leaves.reduce((a, n) => a + (n.level === 1 ? 4 : n.level === 3 ? 5 : 4), 0),
    max_depth: maxDepth,
    leaves_by_level: byLevel,
  },
  nodes,
};

// Default to the authoritative manifest beside this script so a bare
// `node build-phase-tree.mjs` refreshes the checked-in tree (pass an explicit
// path as argv[2] to write elsewhere, e.g. a scratch diff target).
const outPath = process.argv[2] || new URL('./phase-tree.json', import.meta.url).pathname;
writeFileSync(outPath, JSON.stringify(manifest, null, 2));

// ---- summary -----------------------------------------------------------------
console.log('=== 017 phase-tree manifest ===');
console.log('nodes:', nodes.length, '| leaves:', leaves.length, '| parents:', parents.length);
console.log('leaf docs (est):', manifest.totals.leaf_docs_estimate);
console.log('max depth:', maxDepth);
console.log('leaves by level:', JSON.stringify(byLevel));
console.log('parents over 14 children:', overWide.length ? JSON.stringify(overWide) : 'none');
console.log('');
console.log('--- top level ---');
for (const n of nodes.filter((x) => x.depth === 1)) console.log(`  ${n.slug}  [${n.kind}${n.kind === 'parent' ? ' x' + n.childrenCount : ' L' + n.level}]`);
console.log('');
console.log('--- 008-component-migration children ---');
for (const n of nodes.filter((x) => x.parent === `${ROOT}/008-component-migration`)) console.log(`  ${n.slug}  [${n.kind}${n.kind === 'parent' ? ' x' + n.childrenCount : ' L' + n.level}]`);
console.log('');
console.log('--- sample subtree: 008/003-sk-doc ---');
for (const n of nodes.filter((x) => x.id.includes('/008-component-migration/003-sk-doc'))) console.log(`  ${'  '.repeat(Math.max(0, n.depth - 2))}${n.slug} [${n.kind}${n.kind === 'parent' ? ' x' + n.childrenCount : ' L' + n.level}]`);
console.log('\nwrote:', outPath);
