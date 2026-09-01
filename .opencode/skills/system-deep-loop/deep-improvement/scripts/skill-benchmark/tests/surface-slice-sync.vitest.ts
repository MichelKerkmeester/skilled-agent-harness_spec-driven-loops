import { describe, it, expect } from 'vitest';
import { resolve, join } from 'node:path';

// Surface-slice sync guard for sk-code's router-replay.
//
// sk-code has two code surfaces (sk-code-webflow/, sk-code-opencode/) plus the
// Motion.dev overlay folded into sk-code-webflow/{references,assets}/animation/. The
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
// The Motion.dev overlay lives under sk-code-webflow/ but is a cross-stack overlay,
// not the Webflow surface — distinguish the two when checking for surface leaks.
const isAnimationOverlay = (p: string) =>
  p.startsWith('sk-code-webflow/references/animation/') || p.startsWith('sk-code-webflow/assets/animation/');
const hasWebflowSurface = (paths: string[]) =>
  paths.some((p) => p.startsWith('sk-code-webflow/') && !isAnimationOverlay(p));

describe('sk-code surface-slice sync — router-replay slices to sk-code-<surface>/ packets', () => {
  it('slices a WEBFLOW task to sk-code-webflow and never leaks sk-code-opencode', () => {
    const r = routed('improve lighthouse core web vitals for the webflow site in src/2_javascript/hero.js');
    expect(startsWithAny(r, 'sk-code-webflow/')).toBe(true);
    expect(startsWithAny(r, 'sk-code-opencode/')).toBe(false);
  });

  it('slices an OPENCODE task to sk-code-opencode and never leaks sk-code-webflow', () => {
    const r = routed('refactor the parseExecutorConfig function in .opencode/skills/system-spec-kit/mcp-server/mod.ts');
    expect(startsWithAny(r, 'sk-code-opencode/')).toBe(true);
    expect(startsWithAny(r, 'sk-code-webflow/')).toBe(false);
  });

  it('keeps the Motion.dev animation overlay but drops both surfaces for an UNKNOWN motion decision', () => {
    const r = routed('should I use motion.dev or plain CSS for a hover state on cards? routing decision only, not an implementation');
    expect(r.some(isAnimationOverlay)).toBe(true);
    expect(hasWebflowSurface(r)).toBe(false);
    expect(startsWithAny(r, 'sk-code-opencode/')).toBe(false);
  });

  it('no playbook scenario over-routes BOTH surfaces at once', () => {
    const { scenarios } = loadPlaybookScenarios({ skillRoot: SKCODE });
    const leaks = scenarios
      .filter((s: any) => s.prompt && s.classKind !== 'browser')
      .filter((s: any) => {
        const r = routeSkillResources({ skillRoot: SKCODE, taskText: s.prompt }).resources || [];
        return hasWebflowSurface(r) && startsWithAny(r, 'sk-code-opencode/');
      })
      .map((s: any) => s.scenarioId);
    expect(leaks).toEqual([]);
  });
});

// Rust language-slice sync guard.
//
// Within the OpenCode surface, router-replay slices to the touched-language SET so
// an interop task that legitimately touches both Rust and TypeScript (a napi-rs /
// WASM sidecar under byte-for-byte parity with the Node backend) loads BOTH trios,
// while a single-language task still loads only its own. Rust is detected by `.rs`,
// Cargo markers, or the napi-rs/wasm-bindgen/WASI/cdylib interop vocabulary — none
// of the fixtures below say the word "Rust", so a passing assertion proves real
// signal detection rather than a tautology. If the OPENCODE_LANGUAGES list, the
// touched-language detector, or the rust reference folder drift apart, these fail
// loudly the same way the surface-slice guard does.
const OC_LANGS = ['typescript', 'python', 'shell', 'config', 'javascript', 'rust'];
const langFolders = (paths: string[]): Set<string> => {
  const s = new Set<string>();
  for (const p of paths) {
    const m = /^sk-code-opencode\/references\/([^/]+)\//.exec(p);
    if (m && OC_LANGS.includes(m[1])) s.add(m[1]);
  }
  return s;
};
// The rust reference trio was split into topic-cohesive parts, so the router now
// returns each part; the slice assertion checks that whole part set loads.
const RUST_TRIO = [
  'sk-code-opencode/references/rust/style-guide/overview-and-file-header.md',
  'sk-code-opencode/references/rust/style-guide/toolchain-and-project-structure.md',
  'sk-code-opencode/references/rust/style-guide/naming-conventions.md',
  'sk-code-opencode/references/rust/style-guide/formatting-and-imports.md',
  'sk-code-opencode/references/rust/style-guide/commenting-and-rustdoc.md',
  'sk-code-opencode/references/rust/style-guide/interop-model.md',
  'sk-code-opencode/references/rust/style-guide/interop-errors-and-parity.md',
  'sk-code-opencode/references/rust/quality-standards/overview-and-data-ownership.md',
  'sk-code-opencode/references/rust/quality-standards/modeling-collections-and-api.md',
  'sk-code-opencode/references/rust/quality-standards/docs-errors-and-async.md',
  'sk-code-opencode/references/rust/quality-standards/build-and-organization.md',
  'sk-code-opencode/references/rust/quality-standards/determinism-and-parity.md',
  'sk-code-opencode/references/rust/quick-reference/overview-and-boundary-template.md',
  'sk-code-opencode/references/rust/quick-reference/naming-ordering-and-signatures.md',
  'sk-code-opencode/references/rust/quick-reference/collections-imports-and-errors.md',
  'sk-code-opencode/references/rust/quick-reference/rustdoc-and-cargo.md',
  'sk-code-opencode/references/rust/quick-reference/determinism-parity-and-related.md',
];
// The typescript trio was split into topic-cohesive parts, so the router now
// returns each part; the slice assertion checks that whole part set loads.
const TS_TRIO = [
  'sk-code-opencode/references/typescript/style-guide/overview-strict-and-naming.md',
  'sk-code-opencode/references/typescript/style-guide/formatting-imports-and-coexistence.md',
  'sk-code-opencode/references/typescript/quality-standards/overview-and-type-system.md',
  'sk-code-opencode/references/typescript/quality-standards/tsdoc-errors-and-async.md',
  'sk-code-opencode/references/typescript/quality-standards/tsconfig-and-modules.md',
  'sk-code-opencode/references/typescript/quick-reference/template-naming-and-types.md',
  'sk-code-opencode/references/typescript/quick-reference/imports-errors-and-tsconfig.md',
];

describe('sk-code rust language-slice sync — touched-language set loads the right trios', () => {
  const singleRust: Array<[string, string]> = [
    ['a .rs source edit', 'add a request-ID field to the sidecar in .opencode/native/src/lib.rs'],
    ['a Cargo manifest change', 'update dependencies in .opencode/native/Cargo.toml for the sidecar crate'],
    ['a napi-rs binding', 'expose a napi-rs binding from .opencode/native/src/lib.rs for the scorer'],
    ['a wasm-bindgen export', 'add wasm-bindgen exports in .opencode/native/src/lib.rs'],
    ['a cdylib/WASI target', 'build a cdylib wasi target from .opencode/native/src/lib.rs'],
  ];
  for (const [label, prompt] of singleRust) {
    it(`slices ${label} to the rust trio only — no other language folder, no webflow leak`, () => {
      const r = routed(prompt);
      expect(langFolders(r)).toEqual(new Set(['rust']));
      for (const t of RUST_TRIO) expect(r).toContain(t);
      expect(hasWebflowSurface(r)).toBe(false);
    });
  }

  it('loads BOTH the rust and typescript trios for a Rust+TypeScript byte-parity task, and no other language', () => {
    const r = routed(
      'port scorer.ts compute to a napi-rs lib.rs crate under .opencode/native, byte-identical to the typescript oracle',
    );
    expect(langFolders(r)).toEqual(new Set(['rust', 'typescript']));
    for (const t of RUST_TRIO) expect(r).toContain(t);
    for (const t of TS_TRIO) expect(r).toContain(t);
    expect(hasWebflowSurface(r)).toBe(false);
  });

  it('routes a rust quality/audit task to the rust quality standards (a trio member), not another language', () => {
    const r = routed(
      'review the .opencode/native/src/lib.rs sidecar for clippy lints and unsafe-block SAFETY invariants',
    );
    expect(langFolders(r)).toEqual(new Set(['rust']));
    expect(r).toContain('sk-code-opencode/references/rust/quality-standards/overview-and-data-ownership.md');
  });

  it('never loads the rust trio for a non-Rust OpenCode task — the touched-set does not over-route', () => {
    const r = routed('update the skill_advisor.py argparse block in .opencode/skills/system-skill-advisor');
    expect(langFolders(r)).toEqual(new Set(['python']));
    expect(r.some((p) => p.startsWith('sk-code-opencode/references/rust/'))).toBe(false);
  });
});
