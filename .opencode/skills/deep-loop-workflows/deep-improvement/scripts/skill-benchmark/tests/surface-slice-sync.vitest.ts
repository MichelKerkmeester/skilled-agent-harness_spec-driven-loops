import { describe, it, expect } from 'vitest';
import { resolve, join } from 'node:path';

// Surface-slice sync guard for sk-code's router-replay.
//
// sk-code has two code surfaces (code-webflow/, code-opencode/) plus the
// Motion.dev overlay folded into code-webflow/{references,assets}/animation/. The
// deterministic router-replay MUST slice a single-surface task to only its
// detected surface's resources and never leak the other surface — that is the
// route-time loading discipline the smart router documents, and the D3 efficiency
// dimension scores against it. The Motion.dev overlay is cross-stack: it may load
// alongside either surface and is NOT a surface leak. The slicing keys on the
// packet-folder prefixes; when a folder rename or fold moves the surfaces those
// prefixes must move with it, or hasSurfaceLayout silently goes false and every
// single-surface task over-routes the whole cross-surface union. This guard fails
// loudly if the slicing prefixes drift out of sync with the packet-folder names.

const SKILL_ROOT = resolve(__dirname, '..', '..', '..');
const REPO_SKILLS = resolve(SKILL_ROOT, '..', '..');
const SKCODE = join(REPO_SKILLS, 'sk-code');
const HARNESS = join(SKILL_ROOT, 'scripts', 'skill-benchmark');
const { routeSkillResources } = require(join(HARNESS, 'router-replay.cjs'));
const { loadPlaybookScenarios } = require(join(HARNESS, 'load-playbook-scenarios.cjs'));

function routed(taskText: string): string[] {
  return routeSkillResources({ skillRoot: SKCODE, taskText }).resources || [];
}
const startsWithAny = (paths: string[], prefix: string) => paths.some((p) => p.startsWith(prefix));
// The Motion.dev overlay lives under code-webflow/ but is a cross-stack overlay,
// not the Webflow surface — distinguish the two when checking for surface leaks.
const isAnimationOverlay = (p: string) =>
  p.startsWith('code-webflow/references/animation/') || p.startsWith('code-webflow/assets/animation/');
const hasWebflowSurface = (paths: string[]) =>
  paths.some((p) => p.startsWith('code-webflow/') && !isAnimationOverlay(p));

describe('sk-code surface-slice sync — router-replay slices to code-<surface>/ packets', () => {
  it('slices a WEBFLOW task to code-webflow and never leaks code-opencode', () => {
    const r = routed('improve lighthouse core web vitals for the webflow site in src/2_javascript/hero.js');
    expect(startsWithAny(r, 'code-webflow/')).toBe(true);
    expect(startsWithAny(r, 'code-opencode/')).toBe(false);
  });

  it('slices an OPENCODE task to code-opencode and never leaks code-webflow', () => {
    const r = routed('refactor the parseExecutorConfig function in .opencode/skills/system-spec-kit/mcp_server/mod.ts');
    expect(startsWithAny(r, 'code-opencode/')).toBe(true);
    expect(startsWithAny(r, 'code-webflow/')).toBe(false);
  });

  it('keeps the Motion.dev animation overlay but drops both surfaces for an UNKNOWN motion decision', () => {
    const r = routed('should I use motion.dev or plain CSS for a hover state on cards? routing decision only, not an implementation');
    expect(r.some(isAnimationOverlay)).toBe(true);
    expect(hasWebflowSurface(r)).toBe(false);
    expect(startsWithAny(r, 'code-opencode/')).toBe(false);
  });

  it('no playbook scenario over-routes BOTH surfaces at once', () => {
    const { scenarios } = loadPlaybookScenarios({ skillRoot: SKCODE });
    const leaks = scenarios
      .filter((s: any) => s.prompt && s.classKind !== 'browser')
      .filter((s: any) => {
        const r = routeSkillResources({ skillRoot: SKCODE, taskText: s.prompt }).resources || [];
        return hasWebflowSurface(r) && startsWithAny(r, 'code-opencode/');
      })
      .map((s: any) => s.scenarioId);
    expect(leaks).toEqual([]);
  });
});
