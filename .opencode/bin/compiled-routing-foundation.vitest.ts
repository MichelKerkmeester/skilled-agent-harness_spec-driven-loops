// Foundation invariants for compiled skill-routing:
//   - eligibility (advisor hub set) never diverges from the engine-dispatch map
//   - the tri-state flag is parsed identically at both runtime read sites
//   - the per-hub default-on cohort ships empty (unset => legacy for every hub)
//   - the status probe's causeCode separates drift from breakage
//   - the promoted serving path reads nothing under .opencode/specs
//   - a future spec-tree import is blocked by the durable guard

import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';

import {
  COMPILED_ROUTING_HUBS,
  DEFAULT_ON_HUBS as ADVISOR_DEFAULT_ON_HUBS,
  parseCompiledRoutingFlagMode,
} from '../skills/system-skill-advisor/mcp-server/lib/compiled-routing-flag';

const requireCjs = createRequire(import.meta.url);
const HERE = dirname(fileURLToPath(import.meta.url));
const RUNTIME = join(HERE, 'lib', 'compiled-routing');

const resolver = requireCjs(join(RUNTIME, '011-runtime-engine', 'lib', 'resolve.cjs'));
const engine = requireCjs(join(RUNTIME, '011-runtime-engine', 'lib', 'compiled-route.cjs'));
const status = requireCjs(join(HERE, 'compiled-route-status.cjs'));
const scanner = requireCjs(join(HERE, 'check-no-spec-imports.cjs'));

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

  it('default-on cohort ships empty at both read sites', () => {
    expect(resolver.DEFAULT_ON_HUBS.size).toBe(0);
    expect(ADVISOR_DEFAULT_ON_HUBS.size).toBe(0);
  });

  it('unset resolves to legacy (null) for every hub — byte-identical default', () => {
    clearFlag();
    for (const hub of Object.keys(engine.HUB_CHILD)) {
      expect(resolver.resolveRoute(hub, 'do the thing')).toBeNull();
    }
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
    const r = status.computeHubStatus('broken-hub', { activationRoot: tmp, probeEngine: true });
    expect(r.causeCode).toBe('engine-throw');
    expect(r.servingAuthority).toBe('legacy');
  });

  it('compiled-serving => compiled for a real promoted hub under force-on', () => {
    setFlag('1');
    const r = status.computeHubStatus('sk-code', { probeEngine: true });
    expect(r.causeCode).toBe('compiled-serving');
    expect(r.servingAuthority).toBe('compiled');
    expect(typeof r.manifestFingerprint).toBe('string');
    expect(r.selectedPolicy).toHaveProperty('generation');
  });

  it('--all default state reports every hub as flag-off drift, none broken', () => {
    clearFlag();
    const rows = status.computeAllStatus({ probeEngine: false });
    expect(rows.length).toBe(Object.keys(engine.HUB_CHILD).length);
    expect(rows.every((r: { causeCode: string }) => r.causeCode === 'flag-off')).toBe(true);
    expect(rows.some((r: { causeCode: string }) => r.causeCode === 'engine-throw')).toBe(false);
  });
});

describe('move-simulation: no runtime read under .opencode/specs', () => {
  it('sync --verify reports all hubs resolve with 0 spec reads', () => {
    const out = execFileSync(process.execPath, [join(HERE, 'compiled-route-sync.cjs'), '--verify'], { encoding: 'utf8' });
    expect(out).toContain('0 reads under .opencode/specs');
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
