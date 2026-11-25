// Foundation invariants for compiled skill-routing:
//   - eligibility (advisor hub set) never diverges from the engine-dispatch map
//   - the tri-state flag is parsed identically at both runtime read sites
//   - the resolver's per-hub default-on cohort covers all eight promoted hubs; a
//     stale manifest fails closed while every hub-set copy equals the registry
//   - the status probe's causeCode separates drift from breakage
//   - the promoted serving path reads nothing under .opencode/specs
//   - a future spec-tree import is blocked by the durable guard

import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { chmodSync, copyFileSync, mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';

import {
  COMPILED_ROUTING_HUBS,
  DEFAULT_ON_HUBS as ADVISOR_DEFAULT_ON_HUBS,
  parseCompiledRoutingFlagMode,
} from '../skills/system-skill-advisor/runtime/lib/compiled-routing-flag';

const requireCjs = createRequire(import.meta.url);
const HERE = dirname(fileURLToPath(import.meta.url));
const RUNTIME = join(HERE, 'lib', 'compiled-routing');

// Load the resolver/engine the runtime actually serves (coherent layout), not a
// hardcoded generation. Before and after publication this binds the module the
// serving path actually uses, so the parity guard tracks reality.
const layout = requireCjs(join(HERE, 'lib', 'compiled-route-layout.cjs'));
const RUNTIME_RESOLVER = layout.resolverPathFor(RUNTIME);
const RUNTIME_ENGINE = layout.enginePathFor(RUNTIME);
if (!RUNTIME_RESOLVER || !RUNTIME_ENGINE) {
  throw new Error(`no coherent compiled-routing layout under ${RUNTIME}`);
}
const resolver = requireCjs(RUNTIME_RESOLVER);
const engine = requireCjs(RUNTIME_ENGINE);
const status = requireCjs(join(HERE, 'compiled-route-status.cjs'));
const scanner = requireCjs(join(HERE, 'check-no-spec-imports.cjs'));
const sync = requireCjs(join(HERE, 'compiled-route-sync.cjs'));

// The hub set has one source, the registry beside the runtime closure. Its readers
// are the deployed runtime engine and resolver, their current authored source, and
// the advisor flag module from source and from its compiled dist. Every one of them
// must yield exactly the registry, in registry order.
const REPO = join(HERE, '..', '..');
const AUTHORED_RESOLVER = sync.AUTHORED_RESOLVER;
const HUB_REGISTRY = join(RUNTIME, 'hub-registry.json');
const ADVISOR_DIST_FLAG = join(
  REPO,
  '.skilled/skills/system-skill-advisor/runtime/dist/runtime/lib/compiled-routing-flag.js',
);

const FLAG = 'SPECKIT_COMPILED_ROUTING';
function clearFlag() { delete process.env[FLAG]; }
function setFlag(v: string) { process.env[FLAG] = v; }
afterEach(() => clearFlag());

describe('eligibility vs engine-dispatch split (cross-check)', () => {
  it('sort(COMPILED_ROUTING_HUBS) === sort(keys(HUB_CHILD)); diverging hub named', () => {
    const advisorHubs = [...COMPILED_ROUTING_HUBS].sort();
    const engineHubs = Object.keys(engine.HUB_CHILD).sort();
    const onlyInAdvisor = advisorHubs.filter((h) => !engineHubs.includes(h));
    const onlyInEngine = engineHubs.filter((h) => !advisorHubs.includes(h));
    // On divergence this reports exactly which hub is missing from which side.
    expect({ onlyInAdvisor, onlyInEngine }).toEqual({ onlyInAdvisor: [], onlyInEngine: [] });
    expect(advisorHubs).toEqual(engineHubs);
  });

  it('selects one complete layout and fails closed on a partial layout', () => {
    const root = mkdtempSync(join(tmpdir(), 'compiled-route-layout-'));
    try {
      for (const relative of [
        layout.LEGACY_LAYOUT.resolver,
        layout.LEGACY_LAYOUT.engine,
        layout.LEGACY_LAYOUT.compiler,
      ]) {
        const filePath = join(root, relative);
        mkdirSync(dirname(filePath), { recursive: true });
        writeFileSync(filePath, 'module.exports = {};\n');
      }
      const partialCurrent = join(root, layout.CURRENT_LAYOUT.resolver);
      mkdirSync(dirname(partialCurrent), { recursive: true });
      writeFileSync(partialCurrent, 'module.exports = {};\n');
      expect(layout.resolveLayout(root)?.id).toBe('legacy');
      rmSync(join(root, layout.LEGACY_LAYOUT.compiler));
      expect(layout.resolveLayout(root)).toBeNull();
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});

describe('flag tri-state truth-table (both read sites agree)', () => {
  const table: Array<[string | undefined, string]> = [
    [undefined, 'default'],
    ['', 'default'],
    ['1', 'force-on'],
    ['0', 'force-legacy'],
    ['false', 'force-legacy'],
    ['off', 'force-legacy'],
    ['2', 'invalid'],
    ['yes', 'invalid'],
    ['true', 'invalid'],
    ['on', 'invalid'],
  ];
  for (const [raw, expected] of table) {
    it(`flag=${JSON.stringify(raw)} => ${expected} in resolver and advisor`, () => {
      expect(resolver.parseFlagMode(raw)).toBe(expected);
      expect(parseCompiledRoutingFlagMode(raw)).toBe(expected);
    });
  }

  it('every hub-set copy equals the registry (8 hubs, registry order)', async () => {
    const registry = JSON.parse(readFileSync(HUB_REGISTRY, 'utf8')) as {
      hubs: Array<{ id: string; rolloutChild: string; defaultOn: boolean }>;
    };
    const eligible = registry.hubs.map((h) => h.id);
    const defaultOn = registry.hubs.filter((h) => h.defaultOn).map((h) => h.id);
    expect(eligible.length).toBe(8);

    const authoredResolver = requireCjs(AUTHORED_RESOLVER);
    const authoredEngine = requireCjs(join(dirname(AUTHORED_RESOLVER), 'compiled-route.cjs'));
    const advisorDist = await import(pathToFileURL(ADVISOR_DIST_FLAG).href);

    // Eligibility: the engine-dispatch maps and the advisor's probe sets.
    expect(Object.entries(engine.HUB_CHILD)).toEqual(registry.hubs.map((h) => [h.id, h.rolloutChild]));
    expect(Object.keys(authoredEngine.HUB_CHILD)).toEqual(eligible);
    expect([...COMPILED_ROUTING_HUBS]).toEqual(eligible);
    expect([...advisorDist.COMPILED_ROUTING_HUBS]).toEqual(eligible);
    // The default-on cohort: both resolver copies and both advisor copies.
    expect([...resolver.DEFAULT_ON_HUBS]).toEqual(defaultOn);
    expect([...authoredResolver.DEFAULT_ON_HUBS]).toEqual(defaultOn);
    expect([...ADVISOR_DEFAULT_ON_HUBS]).toEqual(defaultOn);
    expect([...advisorDist.DEFAULT_ON_HUBS]).toEqual(defaultOn);
  });

  it('unset resolves every fresh default-on hub and fails closed on authorized drift', () => {
    clearFlag();
    const staleHubs: string[] = [];
    for (const hub of Object.keys(engine.HUB_CHILD)) {
      const route = resolver.resolveRoute(hub, 'do the thing');
      const hubStatus = status.computeHubStatus(hub, { probeEngine: false });
      if (hubStatus.causeCode === 'stale-manifest') {
        staleHubs.push(hub);
        expect(route).toBeNull();
      } else {
        expect(hubStatus.causeCode).toBe('compiled-serving');
        expect(route).not.toBeNull();
        expect(route.hubId).toBe(hub);
      }
    }
    expect(staleHubs).toEqual(staleHubs.length === 0 ? [] : ['cli-external-orchestration']);
  });

  it('kill-switch and invalid values also resolve legacy for every hub', () => {
    for (const value of ['0', 'false', 'off', '2', 'yes']) {
      setFlag(value);
      for (const hub of Object.keys(engine.HUB_CHILD)) {
        expect(resolver.resolveRoute(hub, 'do the thing')).toBeNull();
      }
    }
  });

  it('force-on serves a compiled decision for a real hub', () => {
    setFlag('1');
    const route = resolver.resolveRoute('sk-code', 'quality review of the code');
    expect(route).not.toBeNull();
    expect(route.hubId).toBe('sk-code');
  });
});

describe('status causeCode matrix (drift vs breakage)', () => {
  let tmp: string;

  beforeAll(() => {
    tmp = mkdtempSync(join(tmpdir(), 'cr-status-'));
    const mk = (hub: string, manifest: unknown, fence: number) => {
      const dir = join(tmp, hub);
      mkdirSync(dir, { recursive: true });
      writeFileSync(join(dir, 'manifest.json'), JSON.stringify(manifest));
      writeFileSync(join(dir, 'fence-state.json'), JSON.stringify({ fencingEpoch: fence, schemaVersion: 'V1' }));
    };
    mk('legacy-hub', { schemaVersion: 'V1', selectedPolicy: { generation: 1 }, servingAuthority: 'legacy', shadowOnly: true }, 1);
    mk('broken-hub', { schemaVersion: 'V1', selectedPolicy: { generation: 1, effectivePolicyHash: 'deadbeef' }, servingAuthority: 'compiled', shadowOnly: false }, 2);
  });

  afterAll(() => rmSync(tmp, { recursive: true, force: true }));

  it("missing-manifest => legacy (expected drift)", () => {
    setFlag('1');
    const r = status.computeHubStatus('ghost-hub', { activationRoot: tmp, probeEngine: true });
    expect(r.causeCode).toBe('missing-manifest');
    expect(r.servingAuthority).toBe('legacy');
  });

  it('legacy-authority => legacy (expected drift)', () => {
    setFlag('1');
    const r = status.computeHubStatus('legacy-hub', { activationRoot: tmp, probeEngine: true });
    expect(r.causeCode).toBe('legacy-authority');
    expect(r.servingAuthority).toBe('legacy');
  });

  it('flag-off => legacy (expected drift) when compiled manifest but flag not permitting', () => {
    clearFlag();
    const r = status.computeHubStatus('broken-hub', { activationRoot: tmp, probeEngine: false });
    expect(r.causeCode).toBe('flag-off');
    expect(r.servingAuthority).toBe('legacy');
  });

  it('engine-throw => legacy (BREAKAGE) when compiled+flag but the engine cannot route', () => {
    setFlag('1');
    const originalCompiledRoute = engine.compiledRoute;
    engine.compiledRoute = () => { throw new Error('seeded engine failure'); };
    try {
      const r = status.computeHubStatus('sk-code', { probeEngine: true });
      expect(r.causeCode).toBe('engine-throw');
      expect(r.servingAuthority).toBe('legacy');
    } finally {
      engine.compiledRoute = originalCompiledRoute;
    }
  });

  it('compiled-serving => compiled for a real promoted hub under force-on', () => {
    setFlag('1');
    const r = status.computeHubStatus('sk-code', { probeEngine: true });
    expect(r.causeCode).toBe('compiled-serving');
    expect(r.servingAuthority).toBe('compiled');
    expect(typeof r.manifestFingerprint).toBe('string');
    expect(r.selectedPolicy).toHaveProperty('generation');
  });

  it('--all default state reports only authorized pre-publication drift, none broken', () => {
    clearFlag();
    const rows = status.computeAllStatus({ probeEngine: false });
    const promotedHubs = new Set(resolver.DEFAULT_ON_HUBS);
    const promotedRows = rows.filter((r: { hubId: string }) => promotedHubs.has(r.hubId));
    expect(promotedRows.length).toBe(promotedHubs.size);
    const staleHubs = promotedRows
      .filter((r: { causeCode: string }) => r.causeCode !== 'compiled-serving')
      .map((r: { hubId: string }) => r.hubId);
    expect(staleHubs).toEqual(staleHubs.length === 0 ? [] : ['cli-external-orchestration']);
    expect(promotedRows.every((r: { causeCode: string }) => (
      r.causeCode === 'compiled-serving' || r.causeCode === 'stale-manifest'
    ))).toBe(true);
    expect(rows.some((r: { causeCode: string }) => r.causeCode === 'engine-throw')).toBe(false);
  });
});

describe('move-simulation: no runtime read under .opencode/specs', () => {
  it('an isolated authored closure resolves all hubs with 0 spec reads', () => {
    // Inside the repo so the promoted harness's root-walk still finds the skill tree,
    // but out of the live serving parent so a failed cleanup cannot litter it.
    const sandboxRoot = join(__dirname, 'tests', '.sandboxes');
    mkdirSync(sandboxRoot, { recursive: true });
    const sandbox = mkdtempSync(join(sandboxRoot, 'compiled-route-move-'));
    const runtimeRoot = join(sandbox, 'compiled-routing');
    try {
      sync.build({ runtimeRoot });
      const verification = sync.verifyRoot(runtimeRoot, { emit: false });
      expect(verification.message).toContain('all 8 hubs resolve; 0 reads under .opencode/specs');
      expect(Object.keys(verification.resolved)).toEqual([...resolver.DEFAULT_ON_HUBS]);
    } finally {
      rmSync(sandbox, { recursive: true, force: true });
    }
  });
});

describe('durable no-spec-import guard', () => {
  it('flags the seeded spec-import fixture', () => {
    const v = scanner.scanFile(join(HERE, 'tests', 'fixtures', 'no-spec-import', 'positive', 'seeded-spec-import.cjs'));
    expect(v.length).toBeGreaterThan(0);
  });

  it('passes the clean runtime fixture', () => {
    const v = scanner.scanFile(join(HERE, 'tests', 'fixtures', 'no-spec-import', 'negative', 'clean-runtime.cjs'));
    expect(v).toEqual([]);
  });
});

describe('durable no-spec-import guard under either source-root name', () => {
  const REPO_ROOT = join(HERE, '..', '..');
  const GUARD = join(HERE, 'check-no-spec-imports.cjs');
  // A checkout holds the tree under .opencode, under .skilled, or under .skilled with
  // .opencode linked to it, and Node runs a script through that link by its real path.
  const layouts = [
    { name: 'today', realRoot: '.opencode', linked: false, entries: ['.opencode'] },
    { name: 'skilled-only', realRoot: '.skilled', linked: false, entries: ['.skilled'] },
    { name: 'whole-link', realRoot: '.skilled', linked: true, entries: ['.opencode', '.skilled'] },
  ];

  it.each(['specs', '.opencode/specs', '.skilled/specs'])(
    'flags an import from a .skilled/bin script that resolves under %s',
    (spelling) => {
      expect(scanner.targetResolvesUnderSpecs(join(REPO_ROOT, '.skilled', 'bin'), `../../${spelling}`)).toBe(true);
    },
  );

  it("flags require('../specs') from a .skilled/bin script", () => {
    expect(scanner.targetResolvesUnderSpecs(join(REPO_ROOT, '.skilled', 'bin'), '../specs')).toBe(true);
  });

  for (const layout of layouts) {
    for (const entry of layout.entries) {
      it(`${layout.name} through ${entry}/bin: the default scan reads its own directory and fails on a seeded import`, () => {
        const root = mkdtempSync(join(tmpdir(), 'no-spec-import-layout-'));
        try {
          const binDirectory = join(root, layout.realRoot, 'bin');
          mkdirSync(binDirectory, { recursive: true });
          copyFileSync(GUARD, join(binDirectory, 'check-no-spec-imports.cjs'));
          writeFileSync(join(binDirectory, 'seeded-spec-import.cjs'), "require('../../specs/seeded/target.cjs');\n");
          if (layout.linked) symlinkSync('.skilled', join(root, '.opencode'));

          const result = spawnSync(process.execPath, [join(root, entry, 'bin', 'check-no-spec-imports.cjs')], { encoding: 'utf8' });
          expect(result.status).toBe(1);
          expect(result.stderr).toContain('seeded-spec-import.cjs');
        } finally {
          rmSync(root, { recursive: true, force: true });
        }
      });
    }
  }

  it('exits 2, not 0 or the violation code, when a scan reads no file', () => {
    const empty = mkdtempSync(join(tmpdir(), 'no-spec-import-empty-'));
    try {
      const result = spawnSync(process.execPath, [GUARD, empty], { encoding: 'utf8' });
      expect(result.status).toBe(2);
      expect(result.stdout).not.toContain('ok:');
    } finally {
      rmSync(empty, { recursive: true, force: true });
    }
  });

  // Permission bits hide a file from every user but root, so the row skips under root.
  it.skipIf(process.getuid?.() === 0)('exits 2 when a scanned file cannot be read, even beside a readable one', () => {
    const root = mkdtempSync(join(tmpdir(), 'no-spec-import-unreadable-'));
    try {
      const hidden = join(root, 'hidden-spec-import.cjs');
      writeFileSync(join(root, 'clean-runtime.cjs'), 'module.exports = 1;\n');
      writeFileSync(hidden, "require('../../specs/seeded/target.cjs');\n");
      chmodSync(hidden, 0o000);

      const result = spawnSync(process.execPath, [GUARD, root], { encoding: 'utf8' });
      expect(result.status).toBe(2);
      expect(result.stderr).toContain('hidden-spec-import.cjs');
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it('exits 2 when every file the scan finds is allowlisted, so none was read', () => {
    const root = mkdtempSync(join(tmpdir(), 'no-spec-import-allowlisted-'));
    try {
      copyFileSync(GUARD, join(root, 'check-no-spec-imports.cjs'));

      const result = spawnSync(process.execPath, [GUARD, root], { encoding: 'utf8' });
      expect(result.status).toBe(2);
      expect(result.stdout).not.toContain('ok:');
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it.skipIf(process.getuid?.() === 0)('exits 2, not the violation code, when an unreadable file sits beside a violation', () => {
    const root = mkdtempSync(join(tmpdir(), 'no-spec-import-mixed-'));
    try {
      const hidden = join(root, 'hidden-runtime.cjs');
      writeFileSync(join(root, 'seeded-spec-import.cjs'), "require('../../specs/seeded/target.cjs');\n");
      writeFileSync(hidden, 'module.exports = 1;\n');
      chmodSync(hidden, 0o000);

      const result = spawnSync(process.execPath, [GUARD, root], { encoding: 'utf8' });
      expect(result.status).toBe(2);
      expect(result.stderr).toContain('seeded-spec-import.cjs');
      expect(result.stderr).toContain('hidden-runtime.cjs');
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
