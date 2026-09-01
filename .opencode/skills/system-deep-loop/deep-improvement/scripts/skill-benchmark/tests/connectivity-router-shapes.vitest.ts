import { describe, it, expect, afterEach } from 'vitest';
import { mkdtempSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const SB = resolve(__dirname, '..');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { scanConnectivity } = require(join(SB, 'd5-connectivity.cjs'));

// The connectivity scan has to recognize every shape the fleet's routers are
// actually written in, or it condemns a working skill as structurally unusable:
// the intent dictionary a skill's own SKILL.md names INTENT_MODEL, the
// loading-level tiers that declare always-loaded and keyword-gated resources,
// and the parent hub whose root ROUTER.md owns stage-two routing for its mode
// packets. Each case below pairs the shape with its negative control, so a fix
// that goes green by accepting anything fails here.
//
// Run standalone: npx vitest run tests/connectivity-router-shapes.vitest.ts

const DIRS: string[] = [];
afterEach(() => { for (const d of DIRS.splice(0)) rmSync(d, { recursive: true, force: true }); });

function skillMd(body: string): string {
  return `---\nname: t\n---\n\`\`\`python\n${body}\n\`\`\`\n`;
}

function makeStandalone(body: string, files: string[] = ['references/routed.md']): string {
  const dir = mkdtempSync(join(tmpdir(), 'router-shape-'));
  DIRS.push(dir);
  for (const f of files) {
    mkdirSync(join(dir, f.split('/').slice(0, -1).join('/')), { recursive: true });
    writeFileSync(join(dir, f), '# doc\n');
  }
  writeFileSync(join(dir, 'SKILL.md'), skillMd(body));
  return dir;
}

// A two-packet hub. `routed-mode` is registered and carries hub stage-two routes;
// `stray-mode` is registered but the hub routes none of its leaves.
function makeHub(routerState: string): string {
  const dir = mkdtempSync(join(tmpdir(), 'router-hub-'));
  DIRS.push(dir);
  for (const packet of ['routed-mode', 'stray-mode']) {
    mkdirSync(join(dir, packet, 'references'), { recursive: true });
    writeFileSync(join(dir, packet, 'references', 'guide.md'), '# guide\n');
    writeFileSync(join(dir, packet, 'SKILL.md'), `---\nname: ${packet}\n---\n# ${packet}\nNo inline router.\n`);
  }
  writeFileSync(join(dir, 'mode-registry.json'), JSON.stringify({
    modes: [
      { workflowMode: 'routed-mode', packet: 'routed-mode' },
      { workflowMode: 'stray-mode', packet: 'stray-mode' },
    ],
  }));
  writeFileSync(join(dir, 'ROUTER.md'), [
    '---',
    'title: hub surface router',
    `router_state: ${routerState}`,
    '---',
    '',
    '```python',
    'INTENT_SIGNALS = {\n  "GUIDE": {"weight": 4, "keywords": ["guide"]},\n}',
    'RESOURCE_MAP = {\n  "GUIDE": ["routed-mode/references/guide.md"],\n}',
    '```',
    '',
  ].join('\n'));
  return dir;
}

describe('d5 connectivity — INTENT_MODEL is the same intent dictionary', () => {
  it('a RESOURCE_MAP key backed by INTENT_MODEL is not a dead intent key', () => {
    const r = scanConnectivity({
      skillRoot: makeStandalone(
        'INTENT_MODEL = {\n  "X": {"weight": 3, "keywords": ["x"]},\n}\n'
        + 'RESOURCE_MAP = {\n  "X": ["references/routed.md"],\n}',
      ),
    });
    expect(r.routerParseable).toBe(true);
    expect(r.deadIntentKeys).toEqual([]);
    expect(r.gateFailed).toBe(false);
  });

  it('a RESOURCE_MAP key backed by neither dictionary is still a dead intent key', () => {
    const r = scanConnectivity({
      skillRoot: makeStandalone(
        'INTENT_MODEL = {\n  "X": {"weight": 3, "keywords": ["x"]},\n}\n'
        + 'RESOURCE_MAP = {\n  "X": ["references/routed.md"],\n  "GHOST": [],\n}',
      ),
    });
    expect(r.deadIntentKeys).toEqual(['GHOST']);
  });

  it('a skill with no intent dictionary and no resource map still hard-gates', () => {
    const r = scanConnectivity({ skillRoot: makeStandalone('SOME_OTHER_DICT = {\n  "X": {},\n}') });
    expect(r.routerParseable).toBe(false);
    expect(r.gateFailed).toBe(true);
    expect(r.findings.some((f: any) => f.class === 'router_unparseable')).toBe(true);
  });
});

describe('d5 connectivity — loading levels are declared routes', () => {
  it('an always-loaded and an on-demand resource are routed, not orphans', () => {
    const r = scanConnectivity({
      skillRoot: makeStandalone(
        'INTENT_SIGNALS = {\n  "X": {"weight": 3, "keywords": ["x"]},\n}\n'
        + 'RESOURCE_MAP = {\n  "X": ["references/routed.md"],\n}\n'
        + 'LOADING_LEVELS = {\n'
        + '    "ALWAYS": ["references/card.md"],\n'
        + '    "ON_DEMAND_KEYWORDS": ["deep dive", "full reference"],\n'
        + '    "ON_DEMAND": ["assets/deep.md"],\n'
        + '}',
        ['references/routed.md', 'references/card.md', 'assets/deep.md'],
      ),
    });
    expect(r.orphanReferences).toEqual([]);
    expect(r.gateFailed).toBe(false);
  });

  it('a loading level naming a file that is not there is a dead resource path', () => {
    const r = scanConnectivity({
      skillRoot: makeStandalone(
        'INTENT_SIGNALS = {\n  "X": {"weight": 3, "keywords": ["x"]},\n}\n'
        + 'RESOURCE_MAP = {\n  "X": ["references/routed.md"],\n}\n'
        + 'LOADING_LEVELS = {\n  "ALWAYS": ["references/gone.md"],\n}',
      ),
    });
    expect(r.deadResourcePaths).toEqual(['references/gone.md']);
    expect(r.gateFailed).toBe(true);
  });
});

describe('d5 connectivity — a hub owns stage-two routing for its mode packets', () => {
  it('a packet the hub routes is parseable and its hub-routed leaves are not orphans', () => {
    const hub = makeHub('active');
    const r = scanConnectivity({ skillRoot: join(hub, 'routed-mode') });
    expect(r.routerParseable).toBe(true);
    expect(r.hubStageTwoRouted).toBe(1);
    expect(r.orphanReferences).toEqual([]);
    expect(r.gateFailed).toBe(false);
  });

  it('a registered packet the hub routes nothing into still hard-gates', () => {
    const hub = makeHub('active');
    const r = scanConnectivity({ skillRoot: join(hub, 'stray-mode') });
    expect(r.routerParseable).toBe(false);
    expect(r.gateFailed).toBe(true);
    expect(r.orphanReferences).toEqual(['references/guide.md']);
  });

  it('a hub still on a stage1-only scaffold routes nothing down to its packets', () => {
    const hub = makeHub('stage1-only');
    const r = scanConnectivity({ skillRoot: join(hub, 'routed-mode') });
    expect(r.hubStageTwoRouted).toBe(0);
    expect(r.routerParseable).toBe(false);
    expect(r.gateFailed).toBe(true);
  });
});
