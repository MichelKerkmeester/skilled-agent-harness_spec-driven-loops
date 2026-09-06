import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve, relative } from 'node:path';
import { parseFrontmatter } from '@spec-kit/shared/frontmatter/parse-frontmatter.js';

// Drift guard for sk-code's machine-readable router. sk-code keeps its
// authoritative router as prose tables in root ROUTER.md and a flat,
// surface-unioned projection in the same file's machine-readable block,
// which the Lane C benchmark reads. Those two views can drift. Per-intent
// placement cannot be compared (the flat block unions Webflow/OpenCode/
// Motion.dev), so this guard pins the machine block to the two things that
// matter and stay checkable: it must point only at real files, and it must
// cover every routable reference/asset doc on disk. The third check pins it to
// the explicit full paths the prose maps name, without re-parsing the fragile
// brace/glob/shorthand forms.
//
// Run standalone: npx vitest run tests/sk-code-router-sync.vitest.ts

const SKILL_ROOT = resolve(__dirname, '..', '..', '..');
const REPO_SKILLS = resolve(SKILL_ROOT, '..', '..');
const SKCODE = join(REPO_SKILLS, 'sk-code');
const { parseRouter, loadSurfaceRouter, registryPacketRoots, routeSkillResources } = require(join(SKILL_ROOT, 'scripts', 'skill-benchmark', 'router-replay.cjs'));

// Router-internal navigation docs — intentionally NOT intent resources.
const NON_ROUTED_ALLOWLIST = new Set([
  'ROUTER.md',
  'references/stack-detection.md',
  'references/phase-detection.md',
]);

function machineRouterPaths(): Set<string> {
  const router = parseRouter(readFileSync(join(SKCODE, 'SKILL.md'), 'utf8'), SKCODE);
  const set = new Set<string>();
  for (const r of router.defaultResource || []) set.add(r);
  for (const paths of Object.values(router.resourceMap) as string[][]) {
    for (const p of paths) set.add(p);
  }
  // The hub router only projects mode-level pointers (a mode's SKILL.md); the
  // retained surface router carries the real per-surface RESOURCE_MAP this guard
  // exists to check, so union it in for a hub skill.
  if (router.routerSource === 'hub-router.json') {
    const surfaceRouter = loadSurfaceRouter(SKCODE);
    if (surfaceRouter) {
      for (const r of surfaceRouter.defaultResource || []) set.add(r);
      for (const paths of Object.values(surfaceRouter.resourceMap) as string[][]) {
        for (const p of paths) set.add(p);
      }
    }
  }
  return set;
}

function listRoutableMarkdown(): string[] {
  const out: string[] = [];
  for (const dir of ['references', 'assets']) {
    const base = join(SKCODE, dir);
    if (!existsSync(base)) continue;
    const stack = [base];
    while (stack.length) {
      const cur = stack.pop() as string;
      for (const entry of readdirSync(cur, { withFileTypes: true })) {
        const full = join(cur, entry.name);
        if (entry.isDirectory()) stack.push(full);
        else if (entry.isFile() && entry.name.endsWith('.md')) out.push(relative(SKCODE, full));
      }
    }
  }
  return out;
}

function proseExplicitPaths(): Set<string> {
  const md = readFileSync(join(SKCODE, 'ROUTER.md'), 'utf8');
  const start = md.indexOf('## 4. WEBFLOW MAP');
  const end = md.indexOf('## 7. VERIFICATION COMMANDS');
  const prose = md.slice(start, end);
  // Explicit full paths only — skip brace `{a,b}.md`, glob `dir/*`, and bare shorthand.
  // Surface packets are hub-root-relative and packet-qualified (webflow/…, opencode/…,
  // animation/…); the universal/shared tiers stay references/… and assets/….
  const re = /`((?:shared|references|assets|webflow|opencode|animation)\/[^`*{}\s]+\.md)`/g;
  const set = new Set<string>();
  let m: RegExpExecArray | null;
  while ((m = re.exec(prose)) !== null) set.add(m[1]);
  return set;
}

describe('sk-code router sync — machine block vs filesystem and prose', () => {
  const machine = machineRouterPaths();

  it('parses the sk-code machine-readable router via reference-following', () => {
    expect(machine.size).toBeGreaterThan(50);
  });

  it('every machine-router path exists on disk (no dead routes)', () => {
    // The unioned surface-router paths resolve under a mode packet or the shared
    // preamble tier, not the hub root, so existence must check every packet root.
    const roots = [SKCODE, ...registryPacketRoots(SKCODE)];
    const dead = [...machine].filter((p) => !roots.some((root) => existsSync(join(root, p))));
    expect(dead).toEqual([]);
  });

  it('covers every routable reference/asset doc (no silent orphans)', () => {
    const uncovered = listRoutableMarkdown().filter(
      (p) => !NON_ROUTED_ALLOWLIST.has(p) && !machine.has(p),
    );
    expect(uncovered).toEqual([]);
  });

  it('includes every explicit full path named in the prose maps', () => {
    const missing = [...proseExplicitPaths()].filter((p) => !machine.has(p));
    expect(missing).toEqual([]);
  });
});

// Decentralization guard: the surface children each own an inline
// INTENT_SIGNALS/RESOURCE_MAP router over their own references/assets. The parent
// surface RESOURCE_MAP must stay EXACTLY the union of those children (each path
// re-prefixed with its surface folder) plus a fixed parent-owned tier that no
// single surface child owns. This makes the children the single source of truth
// and fails closed if the parent projection or a child slice drifts apart.
const SURFACES = ['sk-code-webflow', 'sk-code-opencode', 'sk-code-mobile-cli'];

// The universal/shared tier the parent surface map owns directly (belongs to no
// single surface child): the surface-agnostic quality/error/checklist docs, the
// shared patterns readme, and the one code-review checklist the parent cites.
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

const norm = (p: string): string => p.replace(/^\.\//, '');

function childResourceMap(surface: string): Record<string, string[]> {
  const md = readFileSync(join(SKCODE, surface, 'SKILL.md'), 'utf8');
  const router = parseRouter(md, join(SKCODE, surface));
  return (router.resourceMap || {}) as Record<string, string[]>;
}

// Every surface packet the hub can cite, including the read-only evidence
// surfaces the parent reaches through a stage-two intent rather than through the
// unioned detection projection.
const SURFACE_PACKETS = new Set([...SURFACES, 'sk-code-obsidian']);

const surfaceDeclaredCache = new Map<string, Set<string>>();
function surfaceDeclared(surface: string): Set<string> {
  const cached = surfaceDeclaredCache.get(surface);
  if (cached) return cached;
  const declared = new Set<string>();
  for (const paths of Object.values(childResourceMap(surface))) {
    for (const p of paths) declared.add(`${surface}/${norm(p)}`);
  }
  surfaceDeclaredCache.set(surface, declared);
  return declared;
}

describe('sk-code surface children own the parent projection', () => {
  const parent = loadSurfaceRouter(SKCODE);
  const parentMap: Record<string, string[]> = (parent && parent.resourceMap) || {};
  const children: Record<string, Record<string, string[]>> = {};
  for (const s of SURFACES) children[s] = childResourceMap(s);

  it('each surface child router parses with a non-empty resource map', () => {
    for (const s of SURFACES) {
      expect(Object.keys(children[s]).length, `${s} resourceMap empty`).toBeGreaterThan(0);
    }
  });

  it('every surface-child path exists at the child root', () => {
    const dead: string[] = [];
    for (const s of SURFACES) {
      for (const paths of Object.values(children[s])) {
        for (const p of paths) {
          if (!existsSync(join(SKCODE, s, norm(p)))) dead.push(`${s}/${p}`);
        }
      }
    }
    expect(dead).toEqual([]);
  });

  it('parent surface map == union(re-prefix(children)) + parent tier (no drift)', () => {
    const intents = new Set<string>([
      ...Object.keys(parentMap),
      ...SURFACES.flatMap((s) => Object.keys(children[s])),
    ]);
    const overExtraction: string[] = []; // a child path absent from the parent map
    const uncovered: string[] = []; // a parent surface path no child owns
    const tierViolations: string[] = []; // a parent non-surface path outside the allowlist
    for (const it of intents) {
      const union = new Set<string>();
      for (const s of SURFACES) {
        for (const p of children[s][it] || []) union.add(`${s}/${norm(p)}`);
      }
      const parentPaths = new Set((parentMap[it] || []).map(norm));
      // A stage-two surface-selection intent is the hub's own entry point into a
      // surface packet: no child declares the intent, and the parent cites a
      // curated slice of that packet. It is parent-owned, but never free — every
      // path it names must be a doc the surface child itself declares, so the
      // parent can cite the surface without inventing routes into it.
      const childOwnsIntent = SURFACES.some((s) => children[s][it]);
      for (const c of union) if (!parentPaths.has(c)) overExtraction.push(`${it}: ${c}`);
      for (const p of parentPaths) {
        if (union.has(p)) continue;
        const owner = /^(sk-code-[a-z0-9-]+)\//.exec(p);
        if (owner && SURFACE_PACKETS.has(owner[1])) {
          if (!childOwnsIntent && surfaceDeclared(owner[1]).has(p)) continue;
          uncovered.push(`${it}: ${p}`);
        } else if (!PARENT_TIER_ALLOWLIST.has(p)) tierViolations.push(`${it}: ${p}`);
      }
    }
    expect(overExtraction).toEqual([]);
    expect(uncovered).toEqual([]);
    expect(tierViolations).toEqual([]);
  });
});

// Bijection guard between the compiled router's destination identities and the
// documented resource map, meeting at sk-code's leaf-manifest.json. The compiled
// router names each destination as `<hub>/<workflowMode>/<packet>/<kind>/<slug>`;
// the manifest declares each mode's (workflowMode, packet) and its routable
// leaves; and the code-opencode surface SKILL.md declares a RESOURCE_MAP of those
// leaves. `qualifiedIdToLeaf` is the one bridge from a compiled destination to a
// manifest mode, so a compiled decision and a documented resource can no longer
// silently diverge: every compiled destination must resolve to a leaf-owning
// mode, and every RESOURCE_MAP entry must be a real manifest leaf.
const REPO_ROOT = resolve(REPO_SKILLS, '..', '..');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const LEAF_CONTRACT = require(
  join(REPO_SKILLS, 'sk-doc', 'sk-create-skill', 'scripts', 'lib', 'leaf-resource-contract.cjs'),
);
// The committed compiled route-gold is the SOURCE of the destination identities
// under test. This is a drift-guard test reading a committed artifact read-only,
// not runtime code taking a require/import dependency, so the manifest round-trip
// below is the durable, relocation-independent guarantee and the route-gold read
// is an additional check exercised whenever the artifact is present.
const SK_CODE_ROUTE_GOLD = join(
  REPO_ROOT,
  'specs', 'sk-doc', '019-skill-routing-refactor', '015-router-unification-program',
  '009-parent-hub-rollout', '001-sk-code', 'compiled', 'route-gold.typed.json',
);

interface ManifestMode {
  packet: string;
  leaves: Set<string>;
}

function manifestModeIndex(): Record<string, ManifestMode> {
  const manifest = JSON.parse(readFileSync(join(SKCODE, 'leaf-manifest.json'), 'utf8'));
  const index: Record<string, ManifestMode> = {};
  for (const mode of manifest.modes || []) {
    index[mode.workflowMode] = { packet: mode.packet, leaves: new Set(mode.leaves || []) };
  }
  return index;
}

function compiledTargetQualifiedIds(): string[] {
  const gold = JSON.parse(readFileSync(SK_CODE_ROUTE_GOLD, 'utf8'));
  const ids = new Set<string>();
  for (const testCase of gold.cases || []) {
    for (const id of testCase.targetQualifiedIds || []) ids.add(id);
  }
  return [...ids];
}

function codeOpencodeResourcePaths(): Set<string> {
  const md = readFileSync(join(SKCODE, 'sk-code-opencode', 'SKILL.md'), 'utf8');
  const router = parseRouter(md, join(SKCODE, 'sk-code-opencode'));
  const paths = new Set<string>();
  for (const r of router.defaultResource || []) paths.add(norm(r));
  for (const list of Object.values(router.resourceMap) as string[][]) {
    for (const p of list) paths.add(norm(p));
  }
  return paths;
}

describe('sk-code qualifiedIdToLeaf bijection — compiled destinations <-> leaf-manifest <-> RESOURCE_MAP', () => {
  const modeIndex = manifestModeIndex();

  it('every manifest mode round-trips through qualifiedIdToLeaf and a wrong packet fails closed', () => {
    // Durable, manifest-anchored direction: independent of any spec-tree path.
    const orphans: string[] = [];
    for (const [workflowMode, mode] of Object.entries(modeIndex)) {
      const probe = `sk-code/${workflowMode}/${mode.packet}/workflow/identity-probe`;
      const resolved = LEAF_CONTRACT.qualifiedIdToLeaf(probe, { modeIndex });
      if (!resolved.ok || resolved.mode !== mode) orphans.push(probe);
    }
    expect(orphans).toEqual([]);

    const [anyMode] = Object.keys(modeIndex);
    const wrongPacket = LEAF_CONTRACT.qualifiedIdToLeaf(
      `sk-code/${anyMode}/not-the-real-packet/workflow/identity-probe`,
      { modeIndex },
    );
    expect(wrongPacket.ok).toBe(false);
  });

  it('every compiled targetQualifiedIds entry resolves to a leaf-owning manifest mode', () => {
    if (!existsSync(SK_CODE_ROUTE_GOLD)) return; // relocation must not hard-break a committed hub guard
    const orphans = compiledTargetQualifiedIds().filter(
      (id) => !LEAF_CONTRACT.qualifiedIdToLeaf(id, { modeIndex }).ok,
    );
    expect(orphans).toEqual([]);
  });

  it('every code-opencode RESOURCE_MAP entry matches a manifest leaf (no doc/manifest drift)', () => {
    const codeOpencode = modeIndex['sk-code-opencode'];
    expect(codeOpencode, 'leaf-manifest.json declares no code-opencode mode').toBeTruthy();
    const orphans = [...codeOpencodeResourcePaths()].filter((p) => !codeOpencode.leaves.has(p));
    expect(orphans).toEqual([]);
  });
});

// A routing scenario declares the resources its prompt should pull. Nothing
// previously compared that declaration against what the router actually emits,
// so a scenario could name a doc no intent routes and stay green forever while
// silently scoring a permanent recall miss. The shared implement/debug/verify
// doctrine is the live example: it ships symlinked into every surface and is
// bundled on surface detection, never listed in any RESOURCE_MAP, so naming it
// in a fixture asserts something the router structurally cannot do.
// Categories that deliberately do NOT assert the intent -> resource contract.
// The corpus was widened from flat routing scenarios into a category taxonomy,
// and these axes measure something else: holdouts restate a fitted answer in
// phrasing that carries no router keyword (that miss IS the measurement),
// unknown-fallback asserts the default slice when nothing matches, and the
// detection/cost/dispatch axes exercise surface selection, load volume, and
// multi-turn sessions rather than a single prompt's routing.
const NON_CONTRACT_CATEGORIES = new Set([
  'holdout',
  'unknown_fallback',
  'surface_detection',
  'token_cost_baseline',
  'resource_loading',
  'cross_cli_dispatch',
]);

function routingScenarios(): Array<{ file: string; root: string; expected: string[]; prompt: string }> {
  const out: Array<{ file: string; root: string; expected: string[]; prompt: string }> = [];
  for (const packet of readdirSync(SKCODE, { withFileTypes: true })) {
    if (!packet.isDirectory()) continue;
    const root = join(SKCODE, packet.name);
    const pb = join(root, 'manual-testing-playbook');
    if (!existsSync(pb)) continue;
    // Scenario files sit in per-category folders under the playbook root, so a
    // flat listing sees only the index and silently makes this guard vacuous.
    const pending = [pb];
    const files: Array<{ name: string; path: string }> = [];
    while (pending.length) {
      const dir = pending.pop() as string;
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        if (entry.isDirectory()) pending.push(join(dir, entry.name));
        else if (entry.isFile()) files.push({ name: entry.name, path: join(dir, entry.name) });
      }
    }
    for (const entry of files) {
      if (!entry.name.endsWith('.md')) continue;
      if (entry.name === 'manual-testing-playbook.md' || entry.name.toLowerCase() === 'readme.md') continue;
      const text = readFileSync(entry.path, 'utf8');
      const parsed = parseFrontmatter(text);
      if (parsed.raw === null) continue;
      // Scenario keys stay line-read verbatim; only the fence split comes
      // from the shared parser.
      const fm = parsed.raw.slice(4, -4);
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

describe('sk-code routing scenarios — declared resources are actually routable', () => {
  const scenarios = routingScenarios();

  it('finds routing scenarios to check (guard would be vacuous otherwise)', () => {
    expect(scenarios.length).toBeGreaterThan(0);
  });

  it('every declared expected_resource is emitted by the surface router', () => {
    const unroutable: string[] = [];
    for (const s of scenarios) {
      const routed = new Set<string>(routeSkillResources({ skillRoot: s.root, taskText: s.prompt }).resources);
      for (const want of s.expected) {
        if (!routed.has(want)) unroutable.push(`${s.file} -> ${want}`);
      }
    }
    expect(unroutable).toEqual([]);
  });

  it('every scenario prompt selects at least one intent (no default-only fallthrough)', () => {
    const noIntent = scenarios
      .filter((s) => routeSkillResources({ skillRoot: s.root, taskText: s.prompt }).intents.length === 0)
      .map((s) => s.file);
    expect(noIntent).toEqual([]);
  });
});
