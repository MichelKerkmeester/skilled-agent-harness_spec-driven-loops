import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve, relative } from 'node:path';

// Drift guard for sk-code's machine-readable router. sk-code keeps its
// authoritative router as prose tables in references/smart-routing.md and a
// flat, surface-unioned projection in the same file's machine-readable block,
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
const { parseRouter, loadSurfaceRouter, registryPacketRoots } = require(join(SKILL_ROOT, 'scripts', 'skill-benchmark', 'router-replay.cjs'));

// Router-internal navigation docs — intentionally NOT intent resources.
const NON_ROUTED_ALLOWLIST = new Set([
  'references/smart-routing.md',
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
  const md = readFileSync(join(SKCODE, 'shared', 'references', 'smart-routing.md'), 'utf8');
  const start = md.indexOf('## 4. WEBFLOW MAP');
  const end = md.indexOf('## 7. VERIFICATION COMMANDS');
  const prose = md.slice(start, end);
  // Explicit full paths only — skip brace `{a,b}.md`, glob `dir/*`, and bare shorthand.
  // Surface packets are hub-root-relative and packet-qualified (webflow/…, opencode/…,
  // animation/…); the universal/shared tiers stay references/… and assets/….
  const re = /`((?:references|assets|webflow|opencode|animation)\/[^`*{}\s]+\.md)`/g;
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

// Decentralization guard: the two surface children now each own an inline
// INTENT_SIGNALS/RESOURCE_MAP router over their own references/assets. The parent
// surface RESOURCE_MAP must stay EXACTLY the union of those children (each path
// re-prefixed with its surface folder) plus a fixed parent-owned tier that no
// single surface child owns. This makes the children the single source of truth
// and fails closed if the parent projection or a child slice drifts apart.
const SURFACES = ['code-webflow', 'code-opencode'];

// The universal/shared tier the parent surface map owns directly (belongs to no
// single surface child): the surface-agnostic quality/error/checklist docs, the
// shared patterns readme, and the one code-review checklist the parent cites.
const PARENT_TIER_ALLOWLIST = new Set([
  'references/universal/multi-agent-research.md',
  'references/universal/code-quality-standards.md',
  'references/universal/code-style-guide.md',
  'references/universal/error-recovery.md',
  'references/universal-debugging-checklist.md',
  'references/universal-verification-checklist.md',
  'references/performance-loading-checklist.md',
  'shared/assets/patterns/README.md',
  'code-review/assets/code-quality-checklist.md',
]);

const norm = (p: string): string => p.replace(/^\.\//, '');

function childResourceMap(surface: string): Record<string, string[]> {
  const md = readFileSync(join(SKCODE, surface, 'SKILL.md'), 'utf8');
  const router = parseRouter(md, join(SKCODE, surface));
  return (router.resourceMap || {}) as Record<string, string[]>;
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
      for (const c of union) if (!parentPaths.has(c)) overExtraction.push(`${it}: ${c}`);
      for (const p of parentPaths) {
        if (union.has(p)) continue;
        if (/^code-(webflow|opencode)\//.test(p)) uncovered.push(`${it}: ${p}`);
        else if (!PARENT_TIER_ALLOWLIST.has(p)) tierViolations.push(`${it}: ${p}`);
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
  join(REPO_SKILLS, 'sk-doc', 'create-skill', 'scripts', 'lib', 'leaf-resource-contract.cjs'),
);
// The committed compiled route-gold is the SOURCE of the destination identities
// under test. This is a drift-guard test reading a committed artifact read-only,
// not runtime code taking a require/import dependency, so the manifest round-trip
// below is the durable, relocation-independent guarantee and the route-gold read
// is an additional check exercised whenever the artifact is present.
const SK_CODE_ROUTE_GOLD = join(
  REPO_ROOT,
  '.opencode', 'specs', 'sk-doc', '019-skill-routing-refactor', '020-router-unification-program',
  '007-unified-refactor-implementation', '006-parent-hub-rollout', '001-sk-code', 'compiled',
  'route-gold.typed.json',
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
  const md = readFileSync(join(SKCODE, 'code-opencode', 'SKILL.md'), 'utf8');
  const router = parseRouter(md, join(SKCODE, 'code-opencode'));
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
    const codeOpencode = modeIndex['code-opencode'];
    expect(codeOpencode, 'leaf-manifest.json declares no code-opencode mode').toBeTruthy();
    const orphans = [...codeOpencodeResourcePaths()].filter((p) => !codeOpencode.leaves.has(p));
    expect(orphans).toEqual([]);
  });
});
