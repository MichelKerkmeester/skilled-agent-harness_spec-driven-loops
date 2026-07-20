// Flag propagation + effective consumption invariants for compiled routing:
//   - SPECKIT_COMPILED_ROUTING survives the native launcher child-env allowlist
//     (unset / 0 / 1 each propagate the intended value; no prefix widening)
//   - the promoted engine cache is keyed by the manifest fingerprint, so a real
//     hub still routes and a decision is byte-identical across calls
//   - the serving-state fingerprint the advisor-brief cache consumes flips on a
//     kill (=0), which is what forces a stale compiled brief to invalidate

import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const requireCjs = createRequire(import.meta.url);
const HERE = dirname(fileURLToPath(import.meta.url));

const launcher = requireCjs(join(HERE, 'mk-skill-advisor-launcher.cjs'));
const engine = requireCjs(join(HERE, 'lib', 'compiled-routing', '011-runtime-engine', 'lib', 'compiled-route.cjs'));
const status = requireCjs(join(HERE, 'compiled-route-status.cjs'));

const FLAG = 'SPECKIT_COMPILED_ROUTING';
function clearFlag() { delete process.env[FLAG]; }
afterEach(() => clearFlag());

// Mirror of the advisor-brief cache's serving-state fingerprint input. Kept in the
// test so a drift in the plugin's canonicalization is caught here.
function servingSignature(rows: Array<Record<string, unknown>>): string {
  return rows
    .map((r) => `${r.hubId}:${r.servingAuthority}:${r.causeCode}:${r.manifestFingerprint ?? ''}:${r.effectivePolicyHash ?? ''}`)
    .join('|');
}

describe('flag propagation through the native launcher child-env allowlist', () => {
  it('forwards the flag =1 to the spawned daemon child', () => {
    const childEnv = launcher.createChildEnv({ SPECKIT_COMPILED_ROUTING: '1', PATH: '/usr/bin' });
    expect(childEnv.SPECKIT_COMPILED_ROUTING).toBe('1');
  });

  it('forwards the kill value =0 (not stripped)', () => {
    const childEnv = launcher.createChildEnv({ SPECKIT_COMPILED_ROUTING: '0', PATH: '/usr/bin' });
    expect(childEnv.SPECKIT_COMPILED_ROUTING).toBe('0');
  });

  it('adds no flag key when the operator leaves it unset (no prefix widening)', () => {
    const childEnv = launcher.createChildEnv({ PATH: '/usr/bin' });
    expect(Object.prototype.hasOwnProperty.call(childEnv, 'SPECKIT_COMPILED_ROUTING')).toBe(false);
  });

  it('forwards exactly the literal key, not a similarly-named neighbour', () => {
    const childEnv = launcher.createChildEnv({ SPECKIT_COMPILED_ROUTING_DEBUG: '1', PATH: '/usr/bin' });
    // DEBUG is not allowlisted; only the exact flag would be forwarded.
    expect(Object.prototype.hasOwnProperty.call(childEnv, 'SPECKIT_COMPILED_ROUTING_DEBUG')).toBe(false);
    expect(Object.prototype.hasOwnProperty.call(childEnv, 'SPECKIT_COMPILED_ROUTING')).toBe(false);
  });
});

describe('promoted engine cache keyed by manifest fingerprint', () => {
  it('routes a real compiled hub and caches the engine within a process', () => {
    process.env[FLAG] = '1';
    const first = engine.loadHubEngine('sk-code');
    const second = engine.loadHubEngine('sk-code');
    // Same manifest => same cache key => same frozen engine instance.
    expect(second).toBe(first);
    expect(typeof first.evaluate).toBe('function');
  });

  it('produces a byte-identical decision across calls (additive, no decision drift)', () => {
    process.env[FLAG] = '1';
    const a = engine.compiledRoute('sk-code', 'quality review of the code');
    const b = engine.compiledRoute('sk-code', 'quality review of the code');
    expect(a).toEqual(b);
    expect(['route', 'clarify', 'defer', 'reject']).toContain(a.action);
    expect(a.hubId).toBe('sk-code');
  });

  it('still rejects an unknown hub after fingerprint keying', () => {
    expect(() => engine.loadHubEngine('ghost-hub')).toThrow(/unknown hub/);
  });
});

describe('serving-state fingerprint invalidates on a kill', () => {
  it('the fingerprint source flips between force-on and =0 for a compiled-serving hub', () => {
    process.env[FLAG] = '1';
    const on = servingSignature(status.computeAllStatus({ probeEngine: false }));
    process.env[FLAG] = '0';
    const killed = servingSignature(status.computeAllStatus({ probeEngine: false }));
    // A =0 kill flips servingAuthority/causeCode in the probe rows, so the
    // advisor-brief cache key that folds this in is guaranteed to miss.
    expect(on).not.toBe(killed);
  });

  it('the fingerprint is stable across repeated reads of an unchanged serving state', () => {
    process.env[FLAG] = '1';
    const a = servingSignature(status.computeAllStatus({ probeEngine: false }));
    const b = servingSignature(status.computeAllStatus({ probeEngine: false }));
    expect(a).toBe(b);
  });
});
