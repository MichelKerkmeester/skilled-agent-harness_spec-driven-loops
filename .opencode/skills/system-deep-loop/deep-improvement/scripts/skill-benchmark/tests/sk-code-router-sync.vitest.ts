import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve, relative } from 'node:path';

// Drift guard for sk-code's machine-readable router. sk-code keeps its
// authoritative router as prose tables in references/smart_routing.md and a
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
  'references/smart_routing.md',
  'references/stack_detection.md',
  'references/phase_detection.md',
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
  const md = readFileSync(join(SKCODE, 'shared', 'references', 'smart_routing.md'), 'utf8');
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
